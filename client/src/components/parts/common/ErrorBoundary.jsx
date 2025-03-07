import React, { Component } from "react";
import { SiOpentofu } from "react-icons/si";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // You can customize the fallback UI here
      return (
        <div className="flex flex-col justify-center items-center p-8 min-h-screen bg-gray-900">
          <div className="p-8 max-w-lg bg-gray-800 rounded-lg shadow-xl">
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-full bg-red-500 bg-opacity-20">
                <SiOpentofu className="w-16 h-16 text-red-500" />
              </div>
            </div>

            <h1 className="mb-4 text-2xl font-bold text-center text-white">
              Something went wrong
            </h1>

            <div className="p-4 mb-4 overflow-auto text-sm bg-gray-900 rounded-md">
              <p className="text-red-400">
                {this.state.error && this.state.error.toString()}
              </p>
              {this.props.showDetails && this.state.errorInfo && (
                <details className="mt-4 text-gray-400">
                  <summary className="cursor-pointer">Error Details</summary>
                  <pre className="mt-2 whitespace-pre-wrap">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    // When there's no error, render children normally
    return this.props.children;
  }
}

export default ErrorBoundary;
