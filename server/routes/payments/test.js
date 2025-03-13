const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_API_KEY);
const User = require("../../models/User");
const Plans = require("../../models/Plans");
const SubscriptionLog = require("../../models/SubscriptionLog");
const { handlePaymentRecovery } = require("../../utils/paymentRecovery");
const subscriptionManager = require("../../utils/subscriptionManager");
const mongoose = require("mongoose");

// Middleware to restrict test endpoints to development environment
const restrictToDev = (req, res, next) => {
  if (
    process.env.NODE_ENV !== "development" &&
    process.env.NODE_ENV !== "test"
  ) {
    return res
      .status(403)
      .json({ error: "Test endpoints are only available in development mode" });
  }
  next();
};

router.use(restrictToDev);

// Test endpoint root - provides available test endpoints
router.get("/", (req, res) => {
  res.json({
    message: "Stripe test endpoints",
    availableTests: [
      {
        path: "/test/simulate-checkout",
        method: "POST",
        description: "Simulate successful checkout",
      },
      {
        path: "/test/simulate-webhook",
        method: "POST",
        description: "Simulate webhook event",
      },
      {
        path: "/test/simulate-payment-failure",
        method: "POST",
        description: "Simulate payment failure",
      },
      {
        path: "/test/create-test-customer",
        method: "POST",
        description: "Create test customer",
      },
      {
        path: "/test/subscription-lifecycle",
        method: "POST",
        description: "Test subscription lifecycle",
      },
    ],
  });
});

// Helper function to find user by ID or Firebase UID
const findUserByIdOrFirebaseUid = async (userId) => {
  const user = await User.findOne({
    $or: [
      { _id: mongoose.Types.ObjectId.isValid(userId) ? userId : null },
      { firebaseUid: userId },
    ],
  });
  return user;
};

// Simulate successful checkout
router.post("/simulate-checkout", async (req, res) => {
  try {
    const { userId, planId } = req.body;

    if (!userId || !planId) {
      return res.status(400).json({ error: "userId and planId are required" });
    }

    const user = await findUserByIdOrFirebaseUid(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const plan = await Plans.findById(planId);
    if (!plan) return res.status(404).json({ error: "Plan not found" });

    // Create a payment method using a test token
    const paymentMethod = await stripe.paymentMethods.create({
      type: "card",
      card: {
        token: "tok_visa", // Use Stripe's test token
      },
    });

    // Create or update subscription
    const result = await subscriptionManager.createOrUpdateSubscription(
      userId,
      planId,
      paymentMethod.id
    );

    res.json({
      success: true,
      message: "Checkout simulation successful",
      result,
    });
  } catch (error) {
    console.error("Error simulating checkout:", error);
    res.status(500).json({ error: error.message });
  }
});

// Simulate webhook event
router.post("/simulate-webhook", async (req, res) => {
  try {
    const { eventType, userId } = req.body;

    if (!eventType || !userId) {
      return res
        .status(400)
        .json({ error: "eventType and userId are required" });
    }

    const user = await findUserByIdOrFirebaseUid(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    let result;

    switch (eventType) {
      case "checkout.session.completed":
        // Find a plan to use
        const plan = await Plans.findOne();
        if (!plan) return res.status(404).json({ error: "No plans found" });

        // Create a mock session object
        const session = {
          id: `mock_cs_${Date.now()}`,
          metadata: { userId: user._id.toString() },
          customer: user.stripeCustomerId || `mock_cus_${Date.now()}`,
          subscription: user.subscriptionId || `mock_sub_${Date.now()}`,
          line_items: {
            data: [
              {
                price: { id: plan.priceId },
              },
            ],
          },
        };

        // Process the mock event
        await handleCheckoutComplete(session);
        result = session;
        break;

      case "customer.subscription.updated":
        // Create a mock subscription object
        const subscription = {
          id: user.subscriptionId || `mock_sub_${Date.now()}`,
          customer: user.stripeCustomerId || `mock_cus_${Date.now()}`,
          status: "active",
          current_period_end: Math.floor(Date.now() / 1000) + 2592000, // +30 days
          items: {
            data: [
              {
                price: { id: "price_mock" },
              },
            ],
          },
        };

        // Process the mock event
        await handleSubscriptionChange(subscription);
        result = subscription;
        break;

      case "customer.subscription.deleted":
        if (!user.subscriptionId) {
          return res
            .status(400)
            .json({ error: "User has no subscription to cancel" });
        }

        // Create a mock subscription object
        const cancelledSubscription = {
          id: user.subscriptionId,
          status: "canceled",
        };

        // Process the mock event
        await handleSubscriptionCancelled(cancelledSubscription);
        result = cancelledSubscription;
        break;

      case "invoice.payment_failed":
        // Create a mock invoice object
        const invoice = {
          id: `mock_inv_${Date.now()}`,
          customer: user.stripeCustomerId || `mock_cus_${Date.now()}`,
          subscription: user.subscriptionId || `mock_sub_${Date.now()}`,
          amount_due: 999,
          status: "open",
          paid: false,
          attempt_count: 1,
        };

        // Process the mock event
        await handlePaymentFailed(invoice);
        result = invoice;
        break;

      default:
        return res
          .status(400)
          .json({ error: `Unsupported event type: ${eventType}` });
    }

    res.json({
      success: true,
      message: `${eventType} event simulated successfully`,
      result,
    });
  } catch (error) {
    console.error("Error simulating webhook event:", error);
    res.status(500).json({ error: error.message });
  }
});

// Simulate payment failure
router.post("/simulate-payment-failure", async (req, res) => {
  try {
    const { userId, failureCount = 1 } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const user = await findUserByIdOrFirebaseUid(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (!user.subscriptionId) {
      return res.status(400).json({ error: "User has no active subscription" });
    }

    // Create a payment method that will fail
    const paymentMethodIdempotencyKey = `pm_create_test_fail_${userId}_${Date.now()}`;
    const paymentMethod = await stripe.paymentMethods.create(
      {
        type: "card",
        card: {
          token: "tok_chargeDeclined", // Use Stripe's test token for declined charges
        },
      },
      {
        idempotencyKey: paymentMethodIdempotencyKey,
      }
    );

    if (!user.stripeCustomerId) {
      return res.status(400).json({ error: "User has no Stripe customer ID" });
    }

    try {
      // Attach payment method to customer
      const attachIdempotencyKey = `pm_attach_test_fail_${userId}_${
        paymentMethod.id
      }_${Date.now()}`;
      await stripe.paymentMethods.attach(
        paymentMethod.id,
        {
          customer: user.stripeCustomerId,
        },
        {
          idempotencyKey: attachIdempotencyKey,
        }
      );

      // Set as default payment method
      const updateIdempotencyKey = `customer_update_test_fail_${userId}_${
        paymentMethod.id
      }_${Date.now()}`;
      await stripe.customers.update(
        user.stripeCustomerId,
        {
          invoice_settings: {
            default_payment_method: paymentMethod.id,
          },
        },
        {
          idempotencyKey: updateIdempotencyKey,
        }
      );
    } catch (error) {
      console.log("Expected error attaching failing card:", error.message);
    }

    // Create a mock invoice object
    const invoice = {
      id: `mock_inv_${Date.now()}`,
      customer: user.stripeCustomerId,
      subscription: user.subscriptionId,
      amount_due: 999,
      status: "open",
      paid: false,
      attempt_count: failureCount,
    };

    // Process the payment failure
    const recoveryResult = await handlePaymentRecovery(invoice, user);

    res.json({
      success: true,
      message: "Payment failure simulated successfully",
      recoveryResult,
      invoice,
    });
  } catch (error) {
    console.error("Error simulating payment failure:", error);
    res.status(500).json({ error: error.message });
  }
});

// Create test customer
router.post("/create-test-customer", async (req, res) => {
  try {
    const { userId, withPaymentMethod = true } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const user = await findUserByIdOrFirebaseUid(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Create a Stripe customer
    const customerIdempotencyKey = `customer_create_test_${userId}_${Date.now()}`;
    const customer = await stripe.customers.create(
      {
        email: user.email || `test-${Date.now()}@example.com`,
        name: user.displayName || `Test User ${Date.now()}`,
        metadata: {
          userId: user._id.toString(),
          firebaseUid: user.firebaseUid,
        },
      },
      {
        idempotencyKey: customerIdempotencyKey,
      }
    );

    // Save customer ID to user
    user.stripeCustomerId = customer.id;
    await user.save();

    let paymentMethod = null;

    // Add a test payment method if requested
    if (withPaymentMethod) {
      // Create a payment method using a test token
      const pmIdempotencyKey = `pm_create_test_${userId}_${Date.now()}`;
      paymentMethod = await stripe.paymentMethods.create(
        {
          type: "card",
          card: {
            token: "tok_visa", // Use Stripe's test token instead of raw card number
          },
        },
        {
          idempotencyKey: pmIdempotencyKey,
        }
      );

      // Attach payment method to customer
      const attachIdempotencyKey = `pm_attach_test_${userId}_${
        paymentMethod.id
      }_${Date.now()}`;
      await stripe.paymentMethods.attach(
        paymentMethod.id,
        {
          customer: customer.id,
        },
        {
          idempotencyKey: attachIdempotencyKey,
        }
      );

      // Set as default payment method
      const updateIdempotencyKey = `customer_update_test_${userId}_${
        paymentMethod.id
      }_${Date.now()}`;
      await stripe.customers.update(
        customer.id,
        {
          invoice_settings: {
            default_payment_method: paymentMethod.id,
          },
        },
        {
          idempotencyKey: updateIdempotencyKey,
        }
      );
    }

    res.json({
      success: true,
      message: "Test customer created successfully",
      customer,
      paymentMethod,
    });
  } catch (error) {
    console.error("Error creating test customer:", error);
    res.status(500).json({ error: error.message });
  }
});

// Test full subscription lifecycle
router.post("/subscription-lifecycle", async (req, res) => {
  try {
    const { userId, planId, daysActive = 30 } = req.body;

    if (!userId || !planId) {
      return res.status(400).json({ error: "userId and planId are required" });
    }

    const user = await findUserByIdOrFirebaseUid(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const plan = await Plans.findById(planId);
    if (!plan) return res.status(404).json({ error: "Plan not found" });

    // Create a test customer if not exists
    if (!user.stripeCustomerId) {
      const customerIdempotencyKey = `customer_create_lifecycle_${userId}_${Date.now()}`;
      const customer = await stripe.customers.create(
        {
          email: user.email || `test-${Date.now()}@example.com`,
          name: user.displayName || `Test User ${Date.now()}`,
          metadata: {
            userId: user._id.toString(),
            firebaseUid: user.firebaseUid,
          },
        },
        {
          idempotencyKey: customerIdempotencyKey,
        }
      );
      user.stripeCustomerId = customer.id;
      await user.save();

      // Log customer creation
      await new SubscriptionLog({
        userId: user._id,
        eventType: "customer_created",
        timestamp: new Date(),
        metadata: { customerId: customer.id },
      }).save();
    }

    // Create a payment method using a test token
    const pmIdempotencyKey = `pm_create_lifecycle_${userId}_${Date.now()}`;
    const paymentMethod = await stripe.paymentMethods.create(
      {
        type: "card",
        card: {
          token: "tok_visa",
        },
      },
      {
        idempotencyKey: pmIdempotencyKey,
      }
    );

    // Attach payment method to customer
    const attachIdempotencyKey = `pm_attach_lifecycle_${userId}_${
      paymentMethod.id
    }_${Date.now()}`;
    await stripe.paymentMethods.attach(
      paymentMethod.id,
      {
        customer: user.stripeCustomerId,
      },
      {
        idempotencyKey: attachIdempotencyKey,
      }
    );

    // Set as default payment method
    const updateIdempotencyKey = `customer_update_lifecycle_${userId}_${
      paymentMethod.id
    }_${Date.now()}`;
    await stripe.customers.update(
      user.stripeCustomerId,
      {
        invoice_settings: {
          default_payment_method: paymentMethod.id,
        },
      },
      {
        idempotencyKey: updateIdempotencyKey,
      }
    );

    // Log customer update with payment method
    await new SubscriptionLog({
      userId: user._id,
      eventType: "customer_updated",
      timestamp: new Date(),
      metadata: {
        paymentMethodId: paymentMethod.id,
        last4: "4242",
        brand: "visa",
      },
    }).save();

    // 1. Create actual Stripe subscription
    const subCreateIdempotencyKey = `sub_create_lifecycle_${userId}_${
      plan._id
    }_${Date.now()}`;
    const subscription = await stripe.subscriptions.create(
      {
        customer: user.stripeCustomerId,
        items: [{ price: plan.priceId }],
        payment_behavior: "default_incomplete",
        payment_settings: { save_default_payment_method: "on_subscription" },
        expand: ["latest_invoice.payment_intent"],
      },
      {
        idempotencyKey: subCreateIdempotencyKey,
      }
    );

    // Update user with real subscription data
    user.subscriptionId = subscription.id;
    user.subscriptionStatus = subscription.status;
    user.subscriptionCurrentPeriodEnd = new Date(
      subscription.current_period_end * 1000
    );
    await user.save();

    // Log subscription creation
    await new SubscriptionLog({
      userId: user._id,
      eventType: "subscription_created",
      planId: plan._id,
      subscriptionId: subscription.id,
      timestamp: new Date(),
      metadata: {
        status: subscription.status,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      },
    }).save();

    // 2. Simulate passage of time
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + daysActive);

    // 3. Start cancellation process
    user.subscriptionStatus = "canceling";
    await user.save();

    // Log cancellation initiation
    await new SubscriptionLog({
      userId: user._id,
      eventType: "subscription_canceling",
      planId: plan._id,
      subscriptionId: subscription.id,
      timestamp: new Date(),
      metadata: {
        reason: "lifecycle_test",
        initiatedAt: new Date(),
      },
    }).save();

    // 4. Cancel the actual Stripe subscription
    const cancelIdempotencyKey = `sub_cancel_lifecycle_${
      subscription.id
    }_${Date.now()}`;
    const cancelledSubscription = await stripe.subscriptions.cancel(
      subscription.id,
      { idempotencyKey: cancelIdempotencyKey }
    );

    // 5. Update final status
    user.subscriptionStatus = "cancelled";
    user.subscriptionId = null;
    user.subscriptionCurrentPeriodEnd = null;
    await user.save();

    // Log final cancellation
    await new SubscriptionLog({
      userId: user._id,
      eventType: "subscription_cancelled",
      planId: plan._id,
      subscriptionId: subscription.id,
      timestamp: new Date(),
      metadata: {
        cancelReason: "lifecycle_test",
        daysActive,
        finalStatus: "cancelled",
      },
    }).save();

    res.json({
      success: true,
      message: "Subscription lifecycle simulation completed",
      subscription: {
        created: subscription,
        cancelled: cancelledSubscription,
      },
      timeline: {
        created: new Date(),
        endsAt: endDate,
      },
      finalStatus: user.subscriptionStatus,
      logs: await SubscriptionLog.find({
        userId: user._id,
        subscriptionId: subscription.id,
      }).sort({ timestamp: 1 }),
    });
  } catch (error) {
    console.error("Error simulating subscription lifecycle:", error);
    res.status(500).json({ error: error.message });
  }
});

// Import webhook handlers
async function handleCheckoutComplete(session) {
  try {
    // Get user ID from the session metadata
    const userId = session.metadata.userId;
    const user = await User.findOne({
      $or: [{ _id: userId }, { firebaseUid: userId }],
    });

    if (!user) {
      console.error(`User not found for ID: ${userId}`);
      return;
    }

    // Find the plan based on the price ID in the session
    const priceId = session.line_items?.data[0]?.price?.id;
    const plan = await Plans.findOne({ priceId });

    if (!plan) {
      console.error(`Plan not found for price ID: ${priceId}`);
      return;
    }

    // Store Stripe customer ID for future transactions
    if (session.customer && !user.stripeCustomerId) {
      user.stripeCustomerId = session.customer;
    }

    // Store subscription ID for management
    if (session.subscription) {
      user.subscriptionId = session.subscription;
    }

    // Update user subscription details
    user.isPro = plan.name.toLowerCase().includes("pro");
    user.currentPlan = plan._id;
    user.subscriptionStatus = "active";
    await user.save();

    // Log the subscription event
    await new SubscriptionLog({
      userId: user._id,
      eventType: "subscription_created",
      planId: plan._id,
      sessionId: session.id,
      timestamp: new Date(),
    }).save();
  } catch (error) {
    console.error("Error in test handleCheckoutComplete:", error);
  }
}

async function handleSubscriptionChange(subscription) {
  try {
    // Find the user by Stripe customer ID
    const user = await User.findOne({
      stripeCustomerId: subscription.customer,
    });
    if (!user) return;

    // Update user's subscription details
    user.subscriptionId = subscription.id;
    user.subscriptionStatus = subscription.status;
    user.subscriptionCurrentPeriodEnd = new Date(
      subscription.current_period_end * 1000
    );
    await user.save();

    // Log the subscription change
    await new SubscriptionLog({
      userId: user._id,
      eventType: "subscription_updated",
      subscriptionId: subscription.id,
      timestamp: new Date(),
    }).save();
  } catch (error) {
    console.error("Error in test handleSubscriptionChange:", error);
  }
}

async function handleSubscriptionCancelled(subscription) {
  try {
    const user = await User.findOne({ subscriptionId: subscription.id });
    if (!user) return;

    // Update user record
    user.subscriptionId = null;
    user.isPro = null; // Reset to free tier
    user.currentPlan = null;
    user.subscriptionStatus = "cancelled";
    await user.save();

    // Log the cancellation
    await new SubscriptionLog({
      userId: user._id,
      eventType: "subscription_cancelled",
      subscriptionId: subscription.id,
      timestamp: new Date(),
    }).save();
  } catch (error) {
    console.error("Error in test handleSubscriptionCancelled:", error);
  }
}

async function handlePaymentFailed(invoice) {
  try {
    const user = await User.findOne({ stripeCustomerId: invoice.customer });
    if (!user) return;

    // Update subscription status
    user.subscriptionStatus = "past_due";
    user.paymentFailureCount = (user.paymentFailureCount || 0) + 1;
    user.lastPaymentFailureDate = new Date();
    await user.save();

    // Log the failed payment
    await new SubscriptionLog({
      userId: user._id,
      eventType: "payment_failed",
      subscriptionId: invoice.subscription,
      invoiceId: invoice.id,
      timestamp: new Date(),
      amount: invoice.amount_due / 100, // Convert to dollars
    }).save();
  } catch (error) {
    console.error("Error in test handlePaymentFailed:", error);
  }
}

module.exports = router;
