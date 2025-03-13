require("dotenv").config();
const express = require("express");
const path = require("path");

// Import configuration
const config = require("./config/server");
const connectDatabase = require("./config/database");
const setupErrorHandlers = require("./config/errorHandlers");
require("./config/firebase"); // Initialize Firebase Admin

// Import middleware
const security = require("./middleware/security");
const performance = require("./middleware/performance");
const responseFormatter = require("./middleware/responseFormatter");
const requestLogger = require("./middleware/requestLogger");

// Import controllers
const apiController = require("./controllers/api.controller");

// Import routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const questionsRoutes = require("./routes/questions");
const applicationsRoute = require("./routes/applications");
const stripeRoutes = require("./routes/payments/stripe");
const progressRoutes = require("./routes/progress");
const feedbackRoutes = require("./routes/feedback");
const paymentRoutes = require("./routes/payments/payment");
const conversationRoutes = require("./routes/conversations");
const webhooksRoutes = require("./routes/payments/webhooks");
const testRoutes = require("./routes/payments/test");

// Initialize express app
const app = express();

// Set up process error handlers
setupErrorHandlers();

// Apply core middleware
app.use(requestLogger);
app.use(responseFormatter);

// Apply security middleware
app.use(security.cors);
app.use(security.helmet);

// Apply performance middleware
app.use(performance.compression);
app.use(performance.logger);

// Apply rate limiting to all routes except webhooks
app.use(/^(?!\/api\/webhooks).*$/, security.rateLimiter);

// Important: Handle Stripe webhooks before bodyParser middleware
app.use("/api/webhooks", webhooksRoutes);

// Body parser middleware for all other routes
app.use(express.json(performance.bodyParser.json));
app.use(express.urlencoded(performance.bodyParser.urlencoded));

// Connect to database
connectDatabase();

// API Routes
const apiRoutes = express.Router();

apiRoutes.use("/auth", authRoutes);
apiRoutes.use("/user", userRoutes);
apiRoutes.use("/questions", questionsRoutes);
apiRoutes.use("/applications", applicationsRoute);
apiRoutes.use("/stripe", stripeRoutes);
apiRoutes.use("/progress", progressRoutes);
apiRoutes.use("/feedback", feedbackRoutes);
apiRoutes.use("/payment", paymentRoutes);
apiRoutes.use("/conversations", conversationRoutes);

// Only expose test routes in development
if (!config.isProduction) {
  apiRoutes.use("/payment/test", testRoutes);
}

// Mount all API routes under /api
app.use("/api", apiRoutes);

// Root route with API info
app.get("/", apiController.getApiInfo);

// 404 handler
app.use(security.notFound);

// Global error handler
app.use(security.errorHandler);

// Start the server
app.listen(config.port, () => {
  console.log(`Server running in ${config.env} mode on port ${config.port}`);
});
