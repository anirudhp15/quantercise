const stripe = require("stripe")(process.env.STRIPE_API_KEY);
const User = require("../models/User");
const SubscriptionLog = require("../models/SubscriptionLog");
const Plans = require("../models/Plans");

/**
 * Handles payment recovery for failed invoices
 * @param {Object} invoice - Stripe invoice object
 * @param {Object} user - User document
 */
async function handlePaymentRecovery(invoice, user) {
  try {
    // Increment payment failure count
    user.paymentFailureCount = (user.paymentFailureCount || 0) + 1;
    user.lastPaymentFailureDate = new Date();
    await user.save();

    // Log the recovery attempt
    await new SubscriptionLog({
      userId: user._id,
      eventType: "payment_failed",
      subscriptionId: invoice.subscription,
      invoiceId: invoice.id,
      amount: invoice.amount_due / 100,
      recoveryAttempt: user.paymentFailureCount,
      timestamp: new Date(),
    }).save();

    // Determine recovery path based on number of failures
    if (user.paymentFailureCount === 1) {
      // First failure - let Stripe's automatic retry system handle it
      return { action: "automatic_retry" };
    } else if (user.paymentFailureCount === 2) {
      // Second failure - send email to update payment method
      // await sendPaymentUpdateEmail(user.email, invoice);
      return { action: "email_sent" };
    } else if (user.paymentFailureCount >= 3) {
      // Third+ failure - downgrade to free plan if subscription is still failing
      const subscription = await stripe.subscriptions.retrieve(
        invoice.subscription
      );

      if (
        subscription.status === "past_due" ||
        subscription.status === "unpaid"
      ) {
        // Cancel at Stripe
        // Generate idempotency key for subscription cancellation
        const cancelIdempotencyKey = `sub_cancel_recovery_${user._id.toString()}_${
          invoice.subscription
        }_${Date.now()}`;

        await stripe.subscriptions.cancel(invoice.subscription, {
          idempotencyKey: cancelIdempotencyKey,
        });

        // Update user record
        user.isPro = null;
        user.currentPlan = null;
        user.subscriptionId = null;
        user.subscriptionStatus = "cancelled";
        user.paymentFailureCount = 0; // Reset counter
        await user.save();

        // Log the downgrade
        await new SubscriptionLog({
          userId: user._id,
          eventType: "subscription_cancelled",
          subscriptionId: invoice.subscription,
          invoiceId: invoice.id,
          timestamp: new Date(),
          errorMessage: "Downgraded after multiple payment failures",
        }).save();

        // await sendAccountDowngradedEmail(user.email);
        return { action: "downgraded" };
      }
    }

    return { action: "no_action" };
  } catch (error) {
    console.error("Error in payment recovery process:", error);
    return { action: "error", error: error.message };
  }
}

/**
 * Updates a user's payment method
 * @param {string} userId - User ID
 * @param {string} paymentMethodId - Stripe payment method ID
 */
async function updatePaymentMethod(userId, paymentMethodId) {
  try {
    const user = await User.findById(userId);
    if (!user || !user.stripeCustomerId) {
      throw new Error("User not found or no Stripe customer ID");
    }

    // Generate idempotency key for payment method attachment
    const attachIdempotencyKey = `pm_attach_recovery_${userId}_${paymentMethodId}_${Date.now()}`;

    // Attach payment method to customer
    await stripe.paymentMethods.attach(
      paymentMethodId,
      {
        customer: user.stripeCustomerId,
      },
      {
        idempotencyKey: attachIdempotencyKey,
      }
    );

    // Generate idempotency key for customer update
    const updateIdempotencyKey = `customer_update_recovery_${userId}_${paymentMethodId}_${Date.now()}`;

    // Set as default payment method
    await stripe.customers.update(
      user.stripeCustomerId,
      {
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      },
      {
        idempotencyKey: updateIdempotencyKey,
      }
    );

    // Get payment method details
    const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);

    // Update user record with new payment method info
    user.paymentMethodLast4 = paymentMethod.card.last4;
    user.paymentMethodBrand = paymentMethod.card.brand;
    await user.save();

    // Log the payment method update
    await new SubscriptionLog({
      userId: user._id,
      eventType: "payment_recovery_succeeded",
      timestamp: new Date(),
      metadata: {
        paymentMethodUpdated: true,
        brand: paymentMethod.card.brand,
        last4: paymentMethod.card.last4,
      },
    }).save();

    return { success: true };
  } catch (error) {
    console.error("Error updating payment method:", error);
    return { success: false, error: error.message };
  }
}

module.exports = {
  handlePaymentRecovery,
  updatePaymentMethod,
};
