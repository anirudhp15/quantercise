const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_API_KEY);
const User = require("../../models/User");
const Plans = require("../../models/Plans");
const SubscriptionLog = require("../../models/SubscriptionLog"); // We'll create this model

// Webhook signing secret from Stripe Dashboard
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

router.post(
  "/",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      // Validate the webhook signature
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.error(`Webhook Error: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event based on its type
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutComplete(event.data.object);
        break;
      case "customer.subscription.created":
      case "customer.subscription.updated":
        await handleSubscriptionChange(event.data.object);
        break;
      case "customer.subscription.deleted":
        await handleSubscriptionCancelled(event.data.object);
        break;
      case "invoice.payment_failed":
        await handlePaymentFailed(event.data.object);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    res.send({ received: true });
  }
);

// Handle successful checkout completion
async function handleCheckoutComplete(session) {
  try {
    // Get user ID from the session metadata
    const userId = session.metadata.userId;
    const user = await User.findOne({
      $or: [{ firebaseUid: userId }, { googleId: userId }],
    });

    if (!user) {
      console.error(`User not found for ID: ${userId}`);
      return;
    }

    // Find the plan based on the price ID in the session
    const priceId =
      session.line_items?.data[0]?.price?.id ||
      (await stripe.checkout.sessions.listLineItems(session.id)).data[0].price
        .id;

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
    console.error("Error processing checkout completion:", error);
  }
}

// Handle subscription changes
async function handleSubscriptionChange(subscription) {
  try {
    // Find the user by Stripe customer ID
    const user = await User.findOne({
      stripeCustomerId: subscription.customer,
    });
    if (!user) return;

    // Update user's subscription status based on the subscription object
    user.subscriptionId = subscription.id;
    user.subscriptionStatus = subscription.status;
    user.subscriptionCurrentPeriodEnd = new Date(
      subscription.current_period_end * 1000
    );

    // Find the plan associated with this price
    const plan = await Plans.findOne({
      priceId: subscription.items.data[0].price.id,
    });
    if (plan) {
      user.currentPlan = plan._id;
      user.isPro = plan.name.toLowerCase().includes("pro");
    }

    await user.save();

    // Log the subscription change
    await new SubscriptionLog({
      userId: user._id,
      eventType: "subscription_updated",
      planId: user.currentPlan,
      subscriptionId: subscription.id,
      timestamp: new Date(),
    }).save();
  } catch (error) {
    console.error("Error processing subscription change:", error);
  }
}

// Handle subscription cancellations
async function handleSubscriptionCancelled(subscription) {
  try {
    console.log(
      "Processing subscription cancellation webhook:",
      subscription.id
    );

    // Find user by subscription ID
    const user = await User.findOne({ subscriptionId: subscription.id });
    if (!user) {
      console.error(`No user found with subscription ID: ${subscription.id}`);
      return;
    }

    console.log(
      `Updating user ${user._id} to free tier due to subscription cancellation`
    );

    // Update user record to reflect cancellation
    user.subscriptionId = null;
    user.isPro = null; // Reset to free tier
    user.currentPlan = null;
    user.subscriptionStatus = "cancelled";

    // Clear any cancellation details since it's now effective
    user.cancellationDetails = {
      canceledAt: user.cancellationDetails?.canceledAt || new Date(),
      effectiveAt: new Date(),
      completed: true,
    };

    await user.save();
    console.log(`User ${user._id} subscription canceled successfully`);

    // Log the cancellation
    try {
      await new SubscriptionLog({
        userId: user._id,
        eventType: "subscription_cancelled",
        subscriptionId: subscription.id,
        timestamp: new Date(),
        metadata: {
          cancelReason: subscription.cancellation_details?.reason || "unknown",
          canceledBy:
            subscription.cancellation_details?.initiated_by || "unknown",
        },
      }).save();
      console.log(`Subscription cancellation logged for user ${user._id}`);
    } catch (logError) {
      console.error("Error logging subscription cancellation:", logError);
    }

    // Optionally send an email to notify the user that their subscription has ended
    // This would be implemented with your email service
  } catch (error) {
    console.error("Error processing subscription cancellation:", error);
  }
}

// Handle failed payments
async function handlePaymentFailed(invoice) {
  try {
    const user = await User.findOne({ stripeCustomerId: invoice.customer });
    if (!user) return;

    // Update subscription status
    user.subscriptionStatus = "past_due";
    await user.save();

    // Log the failed payment
    await new SubscriptionLog({
      userId: user._id,
      eventType: "payment_failed",
      subscriptionId: invoice.subscription,
      invoiceId: invoice.id,
      timestamp: new Date(),
      amount: invoice.amount_due / 100, // Convert to dollars
      errorMessage: invoice.last_payment_error?.message,
    }).save();

    // Send email notification to user (you would implement this)
    // await sendPaymentFailureEmail(user.email, invoice);
  } catch (error) {
    console.error("Error processing payment failure:", error);
  }
}

module.exports = router;
