const stripe = require("stripe")(process.env.STRIPE_API_KEY);
const User = require("../models/User");
const Plans = require("../models/Plans");
const SubscriptionLog = require("../models/SubscriptionLog");

/**
 * Creates or updates a subscription for a user
 * @param {string} userId - User ID
 * @param {string} planId - Plan ID
 * @param {string} paymentMethodId - Stripe payment method ID (optional for updates)
 */
async function createOrUpdateSubscription(
  userId,
  planId,
  paymentMethodId = null
) {
  try {
    // Find user and plan
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    const plan = await Plans.findById(planId);
    if (!plan) throw new Error("Plan not found");

    // Handle free plan differently
    if (plan.price === 0) {
      return await switchToFreePlan(user);
    }

    // Create or get Stripe customer
    let stripeCustomerId = user.stripeCustomerId;
    if (!stripeCustomerId) {
      // Generate a unique idempotency key for customer creation
      const customerIdempotencyKey = `customer_create_${user._id.toString()}_${Date.now()}`;

      const customer = await stripe.customers.create(
        {
          email: user.email,
          name: user.displayName || user.email,
          metadata: {
            userId: user._id.toString(),
            firebaseUid: user.firebaseUid || "",
          },
        },
        {
          idempotencyKey: customerIdempotencyKey,
        }
      );
      stripeCustomerId = customer.id;
      user.stripeCustomerId = stripeCustomerId;
      await user.save();
    }

    // Handle payment method if provided
    if (paymentMethodId) {
      // Generate idempotency key for payment method attachment
      const attachIdempotencyKey = `pm_attach_${user._id.toString()}_${paymentMethodId}_${Date.now()}`;

      // Attach payment method to customer
      await stripe.paymentMethods.attach(
        paymentMethodId,
        {
          customer: stripeCustomerId,
        },
        {
          idempotencyKey: attachIdempotencyKey,
        }
      );

      // Generate idempotency key for customer update
      const updateIdempotencyKey = `customer_update_${user._id.toString()}_${paymentMethodId}_${Date.now()}`;

      // Set as default
      await stripe.customers.update(
        stripeCustomerId,
        {
          invoice_settings: {
            default_payment_method: paymentMethodId,
          },
        },
        {
          idempotencyKey: updateIdempotencyKey,
        }
      );
    }

    // If user already has a subscription, update it
    if (user.subscriptionId) {
      return await updateSubscription(user, plan);
    } else {
      // Otherwise create a new subscription
      return await createNewSubscription(user, plan);
    }
  } catch (error) {
    console.error("Error in createOrUpdateSubscription:", error);
    throw error;
  }
}

/**
 * Creates a new subscription for a user
 * @param {Object} user - User document
 * @param {Object} plan - Plan document
 */
async function createNewSubscription(user, plan) {
  try {
    // Generate idempotency key for subscription creation
    const subscriptionIdempotencyKey = `sub_create_${user._id.toString()}_${plan._id.toString()}_${Date.now()}`;

    const subscription = await stripe.subscriptions.create(
      {
        customer: user.stripeCustomerId,
        items: [{ price: plan.priceId }],
        expand: ["latest_invoice.payment_intent"],
        metadata: {
          userId: user._id.toString(),
          planId: plan._id.toString(),
        },
      },
      {
        idempotencyKey: subscriptionIdempotencyKey,
      }
    );

    // Update user's subscription details
    user.subscriptionId = subscription.id;
    user.subscriptionStatus = subscription.status;
    user.currentPlan = plan._id;
    user.isPro = plan.name.toLowerCase().includes("pro");
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
    }).save();

    return {
      success: true,
      subscription,
      requiresAction:
        subscription.latest_invoice?.payment_intent?.status ===
        "requires_action",
      clientSecret: subscription.latest_invoice?.payment_intent?.client_secret,
    };
  } catch (error) {
    console.error("Error creating new subscription:", error);
    throw error;
  }
}

/**
 * Updates an existing subscription
 * @param {Object} user - User document
 * @param {Object} plan - Plan document
 */
async function updateSubscription(user, plan) {
  try {
    // Retrieve current subscription
    const subscription = await stripe.subscriptions.retrieve(
      user.subscriptionId
    );

    // Generate idempotency key for subscription update
    const updateIdempotencyKey = `sub_update_${user._id.toString()}_${plan._id.toString()}_${Date.now()}`;

    // Update the subscription items
    const updatedSubscription = await stripe.subscriptions.update(
      user.subscriptionId,
      {
        items: [
          {
            id: subscription.items.data[0].id,
            price: plan.priceId,
          },
        ],
        metadata: {
          userId: user._id.toString(),
          planId: plan._id.toString(),
        },
      },
      {
        idempotencyKey: updateIdempotencyKey,
      }
    );

    // Update user's subscription details
    user.currentPlan = plan._id;
    user.isPro = plan.name.toLowerCase().includes("pro");
    user.subscriptionStatus = updatedSubscription.status;
    user.subscriptionCurrentPeriodEnd = new Date(
      updatedSubscription.current_period_end * 1000
    );

    await user.save();

    // Log subscription update
    await new SubscriptionLog({
      userId: user._id,
      eventType: "subscription_updated",
      planId: plan._id,
      subscriptionId: updatedSubscription.id,
      timestamp: new Date(),
    }).save();

    return {
      success: true,
      subscription: updatedSubscription,
    };
  } catch (error) {
    console.error("Error updating subscription:", error);
    throw error;
  }
}

/**
 * Switches a user to the free plan
 * @param {Object} user - User document
 */
async function switchToFreePlan(user) {
  try {
    // Cancel existing subscription if any
    if (user.subscriptionId) {
      await stripe.subscriptions.cancel(user.subscriptionId);

      // Log cancellation
      await new SubscriptionLog({
        userId: user._id,
        eventType: "subscription_cancelled",
        subscriptionId: user.subscriptionId,
        timestamp: new Date(),
        metadata: { reason: "Switch to free plan" },
      }).save();
    }

    // Update user record
    user.isPro = null;
    user.currentPlan = null;
    user.subscriptionId = null;
    user.subscriptionStatus = "cancelled";

    await user.save();

    return {
      success: true,
      message: "Successfully switched to free plan",
    };
  } catch (error) {
    console.error("Error switching to free plan:", error);
    throw error;
  }
}

/**
 * Cancels a user's subscription
 * @param {string} userId - User ID
 */
async function cancelSubscription(userId) {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    if (!user.subscriptionId) {
      return { success: false, message: "No active subscription to cancel" };
    }

    // Generate idempotency key for subscription update (cancellation)
    const cancelIdempotencyKey = `sub_cancel_${user._id.toString()}_${Date.now()}`;

    // Cancel at end of billing period
    const subscription = await stripe.subscriptions.update(
      user.subscriptionId,
      { cancel_at_period_end: true },
      { idempotencyKey: cancelIdempotencyKey }
    );

    // Update user record
    user.subscriptionStatus = "canceling";
    await user.save();

    // Log cancellation request
    await new SubscriptionLog({
      userId: user._id,
      eventType: "subscription_updated",
      subscriptionId: user.subscriptionId,
      timestamp: new Date(),
      metadata: { cancelAtPeriodEnd: true },
    }).save();

    return {
      success: true,
      cancelsAt: new Date(subscription.cancel_at * 1000),
    };
  } catch (error) {
    console.error("Error cancelling subscription:", error);
    throw error;
  }
}

/**
 * Gets a subscription invoice PDF url
 * @param {string} userId - User ID
 * @param {string} invoiceId - Stripe invoice ID
 */
async function getInvoicePdf(userId, invoiceId) {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    const invoice = await stripe.invoices.retrieve(invoiceId, {
      expand: ["subscription"],
    });

    // Verify invoice belongs to user's subscription
    if (invoice.subscription.id !== user.subscriptionId) {
      throw new Error("Invoice does not belong to user");
    }

    // Get PDF URL
    const invoicePdf = await stripe.invoices.retrievePdf(invoiceId);

    return {
      success: true,
      invoicePdfUrl: invoicePdf,
    };
  } catch (error) {
    console.error("Error getting invoice PDF:", error);
    throw error;
  }
}

module.exports = {
  createOrUpdateSubscription,
  cancelSubscription,
  getInvoicePdf,
  switchToFreePlan,
};
