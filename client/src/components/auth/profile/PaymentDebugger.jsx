import React, { useState } from "react";
import axios from "axios";

/**
 * Component for testing payment flows
 * Only rendered for admin users
 */
const PaymentDebugger = ({ userId }) => {
  const [selectedTest, setSelectedTest] = useState("");
  const [planId, setPlanId] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const tests = [
    {
      id: "checkout",
      name: "Simulate Checkout",
      endpoint: "/api/payment/test/simulate-checkout",
    },
    {
      id: "webhook-checkout",
      name: "Simulate Webhook: Checkout Complete",
      endpoint: "/api/payment/test/simulate-webhook",
      params: { eventType: "checkout.session.completed" },
    },
    {
      id: "webhook-update",
      name: "Simulate Webhook: Subscription Updated",
      endpoint: "/api/payment/test/simulate-webhook",
      params: { eventType: "customer.subscription.updated" },
    },
    {
      id: "webhook-cancel",
      name: "Simulate Webhook: Subscription Cancelled",
      endpoint: "/api/payment/test/simulate-webhook",
      params: { eventType: "customer.subscription.deleted" },
    },
    {
      id: "webhook-failed",
      name: "Simulate Webhook: Payment Failed",
      endpoint: "/api/payment/test/simulate-webhook",
      params: { eventType: "invoice.payment_failed" },
    },
    {
      id: "payment-failure",
      name: "Simulate Payment Failure",
      endpoint: "/api/payment/test/simulate-payment-failure",
    },
    {
      id: "test-customer",
      name: "Create Test Customer",
      endpoint: "/api/payment/test/create-test-customer",
    },
    {
      id: "lifecycle",
      name: "Test Subscription Lifecycle",
      endpoint: "/api/payment/test/subscription-lifecycle",
    },
  ];

  const runTest = async () => {
    if (!selectedTest) {
      setError("Please select a test to run");
      return;
    }

    const test = tests.find((t) => t.id === selectedTest);
    if (!test) {
      setError("Invalid test selected");
      return;
    }

    // Reset previous results
    setResult(null);
    setError("");
    setLoading(true);

    try {
      // Prepare request params
      const params = {
        userId,
        ...(test.params || {}),
      };

      // Add planId if provided and needed
      if (planId && ["checkout", "lifecycle"].includes(selectedTest)) {
        params.planId = planId;
      }

      // Make the API request
      const response = await axios.post(test.endpoint, params);
      setResult(response.data);
    } catch (err) {
      console.error("Test execution failed:", err);
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 p-6 bg-gray-700 rounded-lg">
      <h3 className="text-xl font-bold text-white mb-4">
        Payment Testing Tools
      </h3>
      <div className="space-y-4">
        <div className="flex flex-col space-y-2">
          <label className="text-gray-300">Select Test</label>
          <select
            value={selectedTest}
            onChange={(e) => setSelectedTest(e.target.value)}
            className="p-2 bg-gray-800 rounded text-white"
          >
            <option value="">-- Select a test --</option>
            {tests.map((test) => (
              <option key={test.id} value={test.id}>
                {test.name}
              </option>
            ))}
          </select>
        </div>

        {["checkout", "lifecycle"].includes(selectedTest) && (
          <div className="flex flex-col space-y-2">
            <label className="text-gray-300">Plan ID</label>
            <input
              type="text"
              value={planId}
              onChange={(e) => setPlanId(e.target.value)}
              placeholder="Enter plan ID"
              className="p-2 bg-gray-800 rounded text-white"
            />
          </div>
        )}

        <button
          onClick={runTest}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Running..." : "Run Test"}
        </button>

        {error && (
          <div className="p-3 bg-red-900 bg-opacity-50 text-red-300 rounded">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-4">
            <h4 className="text-lg font-semibold text-white mb-2">Result:</h4>
            <pre className="p-3 bg-gray-800 rounded overflow-auto text-sm text-green-400 max-h-80">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentDebugger;
