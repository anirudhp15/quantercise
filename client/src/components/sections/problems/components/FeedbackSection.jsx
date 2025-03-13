import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SiOpentofu } from "react-icons/si";
import { BiLoaderAlt, BiSend } from "react-icons/bi";
import { FaLightbulb, FaQuestion, FaRedo, FaCheck } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import ProcessedText from "../../../parts/ProcessedText";
import "../../../../index.css";

const FeedbackSection = ({
  loadingFeedback,
  conversationHistory,
  isStreaming,
  feedback,
  feedbackCategory,
  currentUser,
  isComplete,
  isAnswerIncorrect,
  userAnswer,
  setUserAnswer,
  handleSubmit,
  handleExplainFurther,
  handleAskQuestion,
  isPro,
  isProSharpe,
  explanationCount,
  isExplanationLimitReached,
  inputType,
  setInputType,
  chatContainerRef,
  textareaRef,
  clearConversationHistory,
}) => {
  const [charCount, setCharCount] = useState(0);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const MAX_CHARS = 2000;

  useEffect(() => {
    setCharCount(userAnswer.length);
  }, [userAnswer]);

  // Removed auto-scroll effect for streaming

  useEffect(() => {
    if (!loadingFeedback && !isStreaming && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [loadingFeedback, isStreaming]);

  const getAttemptNumber = () => {
    if (!conversationHistory.length) return 1;

    const answerCount = conversationHistory.filter(
      (msg) => msg.role === "user" && msg.type === "answer"
    ).length;

    return answerCount + 1;
  };

  const getSubmitButtonText = () => {
    if (loadingFeedback) return "Processing...";
    if (conversationHistory.length === 0) return "Submit";
    if (inputType === "question") return "Ask";
    if (inputType === "explanation") return "Get Explanation";
    return "Submit";
  };

  const getPlaceholderText = () => {
    if (conversationHistory.length === 0) {
      return "Enter your solution...";
    }
    if (inputType === "question") {
      return "Ask a specific question about this problem...";
    }
    if (inputType === "explanation") {
      return "What would you like further explanation about?";
    }
    return "Enter your revised solution...";
  };

  const handleExplainClick = () => {
    // Fill in the explanation request template
    setInputType("explanation");
    setUserAnswer("I'd like more explanation about ");

    // Focus the textarea
    setTimeout(() => {
      const textarea = document.querySelector("textarea");
      if (textarea) {
        textarea.focus();
        // Set cursor position at the end of the prefilled text
        textarea.selectionStart = textarea.selectionEnd = textarea.value.length;
      }
    }, 10);
  };

  const handleQuestionClick = () => {
    // Fill in the question template
    setInputType("question");
    setUserAnswer("Can you explain ");

    // Focus the textarea
    setTimeout(() => {
      const textarea = document.querySelector("textarea");
      if (textarea) {
        textarea.focus();
        // Set cursor position at the end of the prefilled text
        textarea.selectionStart = textarea.selectionEnd = textarea.value.length;
      }
    }, 10);
  };

  const handleTryAgainClick = () => {
    // Reset for a new answer attempt
    setInputType("answer");
    setUserAnswer("");

    // Focus the textarea
    setTimeout(() => {
      const textarea = document.querySelector("textarea");
      if (textarea) {
        textarea.focus();
      }
    }, 10);
  };

  const handleSendMessage = () => {
    if (!userAnswer || !userAnswer.trim()) {
      console.warn("Attempted to send empty message");
      return;
    }

    // Handle different types of messages based on inputType
    switch (inputType) {
      case "question":
        // Send as a question
        handleAskQuestion();
        setUserAnswer("");
        break;

      case "explanation":
        // Send as an explanation request
        handleExplainFurther();
        setUserAnswer("");
        break;

      case "answer":
      default:
        // Send as a solution attempt
        handleSubmit();
        setUserAnswer("");
        break;
    }
  };

  const isErrorFeedback =
    feedbackCategory?.heading === "WRONG ANSWER" ||
    feedbackCategory?.heading === "WEAKLY WRONG" ||
    feedbackCategory?.heading === "STRONGLY WRONG" ||
    feedbackCategory?.heading === "UNABLE TO EVALUATE";

  // Handle scroll events to detect manual scrolling
  const handleScroll = () => {
    if (!chatContainerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;

    // If user scrolls up, mark as manually scrolling
    if (scrollTop < lastScrollTop && !isAtBottom) {
      setIsUserScrolling(true);
      setAutoScrollEnabled(false);
    }

    // If user scrolls to bottom, reset manual scrolling flag
    if (isAtBottom) {
      setIsUserScrolling(false);
    }

    setLastScrollTop(scrollTop);
  };

  // Add scroll event listener
  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      chatContainer.addEventListener("scroll", handleScroll);
      return () => chatContainer.removeEventListener("scroll", handleScroll);
    }
  }, [lastScrollTop]);

  // Manual scroll to bottom function
  const scrollToBottom = () => {
    if (!chatContainerRef.current) return;
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  };

  // Toggle auto-scroll
  const toggleAutoScroll = () => {
    setAutoScrollEnabled(!autoScrollEnabled);
    if (!autoScrollEnabled) {
      scrollToBottom();
    }
  };

  const handleClearHistory = async () => {
    try {
      if (clearConversationHistory) {
        const success = await clearConversationHistory();
        if (success) {
          setShowClearConfirm(false);
          setUserAnswer("");

          // Additional refresh actions can go here if needed
          // The hook will automatically update the conversationHistory state
        }
      } else {
        console.warn("clearConversationHistory function not available");
        setShowClearConfirm(false);
      }
    } catch (error) {
      console.error("Error in handleClearHistory:", error);
      setShowClearConfirm(false);
    }
  };

  return (
    <div className="p-2 pt-0 bg-gray-900 rounded-b-xl">
      <div
        className="overflow-y-auto flex-grow mb-4 scroll-smooth hide-scrollbar chat-container"
        id="chat-container"
        ref={chatContainerRef}
        style={{ scrollBehavior: "smooth" }}
      >
        {/* Welcome screen - show when no conversation and not loading */}
        {/* {conversationHistory.length === 0 &&
        !loadingFeedback &&
        !isStreaming ? ( */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col justify-center items-center bg-gray-950 rounded-t-xl min-h-[400px] px-4 py-8 xl:p-8"
        >
          <div className="flex flex-col justify-center items-center h-full text-center">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="p-3 mb-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full border border-white shadow-lg"
            >
              <SiOpentofu className="w-12 h-12 text-white" />
            </motion.div>

            <motion.h2
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="mb-3 text-2xl font-semibold text-white"
            >
              Are you ready to get started?
            </motion.h2>

            <motion.p
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="mb-6 max-w-lg text-gray-300"
            >
              Enter your solution in the box below, and I'll provide you with
              detailed feedback and guidance.
            </motion.p>

            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="grid grid-cols-1 gap-4 mb-4 w-full max-w-2xl sm:grid-cols-3"
            >
              <div className="p-4 text-left bg-gray-800 rounded-lg border border-gray-700 shadow-md transition-colors hover:bg-gray-750">
                <p className="text-sm text-gray-300">
                  <span className="block mb-1 font-medium text-green-400">
                    Submit a solution
                  </span>
                  Type your answer and click Submit to receive feedback on your
                  approach.
                </p>
              </div>
              <div className="p-4 text-left bg-gray-800 rounded-lg border border-gray-700 shadow-md transition-colors hover:bg-gray-750">
                <p className="text-sm text-gray-300">
                  <span className="block mb-1 font-medium text-yellow-300">
                    Explain concepts further
                  </span>
                  Ask to explain a specific concept or topic in more detail.
                </p>
              </div>
              <div className="p-4 text-left bg-gray-800 rounded-lg border border-gray-700 shadow-md transition-colors hover:bg-gray-750">
                <p className="text-sm text-gray-300">
                  <span className="block mb-1 font-medium text-blue-400">
                    Ask questions
                  </span>
                  Need clarification? You can ask questions about the problem at
                  any time.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
        {/* ) : null} */}

        {/* Always render the conversation history */}
        <div className="flex flex-col p-4 pb-8 space-y-8 rounded-b-xl xl:p-8 xl:pr-16 bg-gray-950">
          {/* Render all messages from conversation history, sorted by timestamp */}
          {conversationHistory
            .slice() // Create a copy to avoid mutating the original array
            .sort((a, b) => {
              // Sort by timestamp if available
              if (a.timestamp && b.timestamp) {
                return new Date(a.timestamp) - new Date(b.timestamp);
              }
              // Fallback to index-based ordering (maintaining original order)
              return 0;
            })
            .map((message, index) => (
              <React.Fragment key={index}>
                {message.role === "user" && (
                  <UserMessage
                    message={message}
                    currentUser={currentUser}
                    index={index}
                  />
                )}
                {message.role === "assistant" && (
                  <AssistantMessage
                    message={message}
                    feedbackCategory={feedbackCategory}
                    isPro={isPro}
                  />
                )}
              </React.Fragment>
            ))}
          {isStreaming && (
            <StreamingMessage
              content={feedback}
              feedbackCategory={feedbackCategory}
              isPro={isPro}
            />
          )}
        </div>

        {/* Loading spinner - only show when loading and not streaming */}
        {loadingFeedback && !isStreaming && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col justify-center items-center p-6 space-y-4"
          >
            <div className="relative w-24 h-24">
              <motion.div
                animate={{
                  rotate: 360,
                  transition: {
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                  },
                }}
                className="absolute inset-0 w-full h-full rounded-full border-t-4 border-blue-500"
              />
              <SiOpentofu className="absolute inset-0 mx-auto my-auto w-12 h-12 text-blue-400 animate-pulse" />
            </div>
            <p className="text-lg font-medium text-blue-300 animate-pulse">
              {conversationHistory.length > 0
                ? "Processing your request..."
                : "Analyzing your solution..."}
            </p>
          </motion.div>
        )}
      </div>

      {/* Chat input */}
      <div className="mt-4 mb-4 xl:mt-8 xl:mb-0">
        <div className="flex relative flex-col gap-1">
          {/* Text input area */}
          <textarea
            ref={textareaRef}
            value={userAnswer}
            onChange={(e) => {
              if (e.target.value.length <= MAX_CHARS) {
                setUserAnswer(e.target.value);
              }
            }}
            placeholder={getPlaceholderText()}
            className={`w-full px-4 py-4 text-gray-200 bg-gray-800 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-${
              inputType === "question"
                ? "blue"
                : inputType === "explanation"
                ? "yellow"
                : "green"
            }-500 focus:border-transparent ${
              loadingFeedback
                ? "cursor-not-allowed bg-gray-700"
                : "border-gray-700"
            }`}
            style={{
              height: "auto",
              minHeight: "56px",
              maxHeight: "150px",
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            disabled={loadingFeedback}
          />

          {/* Send button */}
          <button
            onClick={handleSendMessage}
            disabled={loadingFeedback || !userAnswer.trim()}
            className={`absolute top-3 right-3 p-3 text-white rounded-full bg-gray-600 transition-all ${
              loadingFeedback || !userAnswer.trim()
                ? "bg-gray-600 cursor-not-allowed"
                : inputType === "question"
                ? "bg-blue-600 hover:bg-blue-700"
                : inputType === "explanation"
                ? "bg-yellow-600 hover:bg-yellow-700"
                : "bg-green-600 hover:bg-green-700"
            } shadow-sm hover:shadow-md`}
          >
            {loadingFeedback ? (
              <BiLoaderAlt className="w-5 h-5 animate-spin" />
            ) : (
              <BiSend className="w-5 h-5" />
            )}
          </button>

          {/* Action buttons row */}
          <div className="flex flex-wrap gap-2 items-center mt-1">
            {/* Model selector with tooltip */}
            <div
              className={`relative px-2 py-1 bg-gray-800 rounded-xl border border-gray-700 hover:bg-gray-700 group`}
            >
              <div className="flex items-center cursor-pointer">
                <div className="p-1 mr-2 text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
                  <SiOpentofu className="w-3 h-3" />
                </div>
                <kbd className="text-xs font-medium text-gray-400">Qube</kbd>
              </div>

              {/* Tooltip content */}
              <div className="absolute left-0 bottom-full invisible mb-2 w-auto bg-gray-700 rounded-md shadow-2xl opacity-0 transition-all duration-50 group-hover:opacity-100 group-hover:visible">
                <div className="p-4 rounded-t-md border-t border-gray-900 hover:bg-gray-900 hover:cursor-pointer bg-gray-950">
                  <div className="flex items-center">
                    <div className="p-1 mr-2 text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-full border border-white">
                      <SiOpentofu className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <kbd className="text-sm font-medium text-gray-300">
                          Qube
                        </kbd>
                        <FaCheck className="ml-2 w-4 h-4 text-green-400" />
                      </div>
                      <div className="py-1 text-xs text-gray-300 whitespace-nowrap">
                        GPT 4o-mini
                      </div>
                    </div>
                  </div>
                  <p className="pt-1 text-xs text-gray-400">
                    Great for solving problems and explaining concepts
                  </p>
                </div>

                {/* Upcoming model */}

                <div className="p-4 border-t border-gray-900 bg-gray-950">
                  <div className="flex items-center">
                    <div className="p-1 mr-2 text-white bg-gradient-to-r from-red-500 to-pink-500 rounded-full border border-white">
                      <SiOpentofu className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <kbd className="text-sm font-medium text-gray-300">
                          Quarrel
                        </kbd>
                        <kbd className="px-2 py-0.5 ml-2 text-xs text-gray-300 bg-gray-800 rounded-full whitespace-nowrap">
                          COMING SOON
                        </kbd>
                      </div>
                      <div className="py-1 text-xs text-gray-300 whitespace-nowrap">
                        DeepSeek R1
                      </div>
                    </div>
                  </div>
                  <p className="pt-1 text-xs text-gray-400">
                    Most powerful reasoning model
                  </p>
                </div>

                <div className="p-4 rounded-b-md border-t border-gray-900 bg-gray-950">
                  <div className="flex items-center">
                    <div className="p-1 mr-2 text-white bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full border border-white">
                      <SiOpentofu className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <kbd className="text-sm font-medium text-gray-300">
                          Quark
                        </kbd>
                        <kbd className="px-2 py-0.5 ml-2 text-xs text-gray-300 bg-gray-800 rounded-full whitespace-nowrap">
                          COMING SOON
                        </kbd>
                      </div>
                      <div className="py-1 text-xs text-gray-300 whitespace-nowrap">
                        Claude 3.7 Sonnet
                      </div>
                    </div>
                  </div>
                  <p className="pt-1 text-xs text-gray-400">
                    Most meticulous programming model
                  </p>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            {!isErrorFeedback && isComplete && !loadingFeedback && (
              <>
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={handleExplainClick}
                  disabled={isExplanationLimitReached || loadingFeedback}
                  className={`flex items-center px-2 py-1 text-sm font-medium text-gray-200 bg-gray-800 rounded-xl border border-gray-700 transition-all duration-200 
                    ${
                      isExplanationLimitReached || loadingFeedback
                        ? "opacity-40 cursor-not-allowed"
                        : "hover:bg-gray-700  hover:shadow-md"
                    }`}
                >
                  <FaLightbulb className="mr-2 text-yellow-400" />
                  <kbd className="text-xs text-gray-400">Explain Further</kbd>
                  {!isPro && !isProSharpe && (
                    <span className="ml-1 text-xs text-gray-400">
                      ({3 - explanationCount} left)
                    </span>
                  )}
                </motion.button>

                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={handleQuestionClick}
                  disabled={loadingFeedback}
                  className={`flex items-center px-2 py-1 text-sm font-medium text-gray-200 bg-gray-800 rounded-xl border border-gray-700 transition-all duration-200 
                    ${
                      loadingFeedback
                        ? "opacity-40 cursor-not-allowed"
                        : "hover:bg-gray-700 hover:shadow-md"
                    }`}
                >
                  <FaQuestion className="mr-2 text-blue-400" />
                  <kbd className="text-xs text-gray-400">Ask a Question</kbd>
                </motion.button>

                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={handleTryAgainClick}
                  disabled={loadingFeedback}
                  className={`flex items-center px-2 py-1 text-sm font-medium text-gray-200 bg-gray-800 rounded-xl border border-gray-700 transition-all duration-200 
                    ${
                      loadingFeedback
                        ? "opacity-40 cursor-not-allowed"
                        : "hover:bg-gray-700 hover:shadow-md"
                    }`}
                >
                  <FaRedo className="mr-2 text-green-400" />
                  <kbd className="text-xs text-gray-400">Try Again</kbd>
                </motion.button>
              </>
            )}
          </div>
        </div>

        {/* Character counter and keyboard hints */}
        <button
          onClick={() => setShowClearConfirm(true)}
          className="block px-2 py-1 mt-2 text-xs text-gray-400 bg-gray-800 rounded-lg xl:hidden"
        >
          Clear Conversation
        </button>
        <div className="hidden justify-between mt-2 text-xs text-gray-500 xl:flex">
          <span>
            Press{" "}
            <kbd className="px-1 py-0.5 bg-gray-700 rounded text-xs">Enter</kbd>{" "}
            to {getSubmitButtonText().toLowerCase()} •{" "}
            <kbd className="px-1 py-0.5 bg-gray-700 rounded text-xs">
              Shift+Enter
            </kbd>{" "}
            for new line •{" "}
            <kbd className="px-1 py-0.5 bg-gray-700 rounded text-xs">
              Cmd+Shift+C
            </kbd>{" "}
            <button
              onClick={() => setShowClearConfirm(true)}
              className="text-gray-500 hover:text-gray-300"
            >
              to clear conversation
            </button>
          </span>
          <span
            className={
              charCount > MAX_CHARS * 0.8
                ? charCount > MAX_CHARS * 0.95
                  ? "text-red-500"
                  : "text-yellow-500"
                : "text-gray-500"
            }
          >
            {charCount}/{MAX_CHARS}
          </span>
        </div>

        {/* Attempt counter */}
        {/* {conversationHistory.length > 0 && (
          <div className="mt-2 text-xs text-gray-400">
            <span className="px-2 py-0.5 bg-gray-800 rounded-full">
              {inputType === "answer"
                ? `Attempt #${getAttemptNumber()}`
                : inputType === "question"
                ? "Question"
                : "Explanation"}
            </span>
          </div>
        )} */}
      </div>

      {/* Confirmation Modal */}
      {showClearConfirm && (
        <div className="flex fixed inset-0 z-50 justify-center items-center bg-black bg-opacity-50">
          <div className="p-6 mx-4 bg-gray-800 rounded-lg shadow-lg">
            <h3 className="mb-4 text-lg font-medium text-white">
              Clear conversation?
            </h3>
            <p className="mb-6 text-gray-300">
              Are you sure you want to clear this conversation? This action
              cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 text-white bg-gray-600 rounded-md hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleClearHistory}
                className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper sub-components
const UserMessage = ({ message, currentUser, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="flex items-start mb-4 space-x-0 xl:space-x-4"
  >
    {/* User Avatar - hidden on mobile */}
    <div
      className="hidden flex-shrink-0 justify-center items-center w-8 h-8 rounded-full xl:flex"
      style={{
        backgroundColor: currentUser?.profileColor || "#4B5563",
      }}
    >
      <span className="text-sm font-semibold text-white">
        {currentUser?.displayName?.charAt(0) || "U"}
      </span>
    </div>

    {/* Message content */}
    <div className="w-full xl:flex-1 xl:min-w-0">
      <div className="flex items-center mb-1">
        <p className="font-semibold text-gray-300">
          {currentUser?.displayName || "User"}
        </p>
        <div className="flex items-center ml-2">
          <span className="px-2 py-0.5 text-xs text-gray-300 bg-gray-700 rounded-full">
            {message.type === "answer"
              ? `ATTEMPT ${index + 1}`
              : message.type === "question"
              ? "QUESTION"
              : "EXPLANATION REQUEST"}
          </span>
        </div>
        <span className="ml-2 text-xs text-gray-500">
          {new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>

      {/* Modern message bubble */}
      <div className="p-4 bg-gray-800 rounded-lg border border-gray-700 shadow-sm transition-all hover:shadow-md">
        <p className="text-gray-200 whitespace-pre-wrap break-words">
          {message.content}
        </p>
      </div>
    </div>
  </motion.div>
);

const AssistantMessage = ({ message, feedbackCategory, isPro }) => {
  // Check if this is an error message
  const isError =
    message.content.includes("error") ||
    message.content.includes("Sorry") ||
    (feedbackCategory && feedbackCategory.heading === "UNABLE TO EVALUATE");

  // Use React.memo to prevent unnecessary re-renders
  const MemoizedMarkdown = React.memo(({ content }) => (
    <ProcessedText text={content} isStreaming={false} />
  ));

  // Prevent re-renders when content hasn't changed
  MemoizedMarkdown.displayName = "MemoizedMarkdown";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-start space-x-0 xl:space-x-4"
    >
      {/* AI Avatar */}
      <div className="hidden overflow-hidden flex-shrink-0 justify-center items-center w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full xl:flex">
        <SiOpentofu className="w-4 h-4 text-white" />
      </div>

      {/* Message content */}
      <div className="w-full xl:flex-1 xl:min-w-0">
        <div className="flex items-center mb-1">
          <p className="font-semibold text-gray-300">
            {isPro ? "Qube Pro" : "Qube"}
          </p>
          <div className="flex items-center ml-2">
            <span className="px-2 py-0.5 text-xs text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
              {message.type === "feedback"
                ? "FEEDBACK"
                : message.type === "explanation"
                ? "EXPLANATION"
                : "ANSWER"}
            </span>
          </div>
          <span className="ml-2 text-xs text-gray-500">
            {new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>

        {/* Modern message display with smooth rounded appearance */}
        <div className="p-4 bg-gray-800 rounded-lg border border-gray-700 shadow-sm transition-all hover:shadow-md">
          <MemoizedMarkdown content={message.content} />
        </div>
      </div>
    </motion.div>
  );
};

// Add this component for displaying error messages
const ErrorMessage = ({ message }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="flex items-start my-4 space-x-4"
  >
    <div className="flex flex-shrink-0 justify-center items-center w-8 h-8 bg-red-500 rounded-full">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5 text-white"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center mb-1">
        <p className="font-semibold text-red-500">Error</p>
        <span className="ml-2 text-xs text-gray-500">
          {new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
      <div className="p-4 bg-gray-800 rounded-lg border-l-4 border-red-500 shadow-md">
        <p className="text-gray-200">{message}</p>
        <div className="mt-2 text-sm text-gray-400">
          Please try again or refresh the page if the issue persists.
        </div>
      </div>
    </div>
  </motion.div>
);

// Update the StreamingFeedback component to handle error messages
const StreamingFeedback = ({
  feedback,
  feedbackCategory,
  isPro,
  isProSharpe,
  isStreaming,
}) => {
  // Check if this is an error message
  const isError =
    feedback.includes("error") ||
    feedback.includes("Sorry") ||
    feedbackCategory.heading === "UNABLE TO EVALUATE";

  // Use React.memo to prevent unnecessary re-renders
  const MemoizedMarkdown = React.memo(({ content }) => (
    <ProcessedText text={content} isStreaming={true} />
  ));

  if (isError) {
    return <ErrorMessage message={feedback} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="flex items-start space-x-4"
    >
      <div
        className={`flex flex-shrink-0 justify-center items-center w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full`}
      >
        <SiOpentofu className="w-4 h-4 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center mb-1">
          <kbd className={`font-semibold ${feedbackCategory.color}`}>Qube</kbd>
          <div className="flex items-center ml-2">
            <span
              className={`px-2 py-0.5 text-xs rounded-full ${
                feedbackCategory.color === "text-gray-400"
                  ? "bg-gray-700 text-gray-300"
                  : feedbackCategory.color === "text-red-500"
                  ? "bg-red-900/50 text-red-300"
                  : feedbackCategory.color === "text-yellow-500"
                  ? "bg-yellow-900/50 text-yellow-300"
                  : "bg-green-900/50 text-green-300"
              }`}
            >
              {feedbackCategory.heading}
            </span>
          </div>
          <span className="ml-2 text-xs text-gray-500">
            {new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
        <div
          className={`p-4 rounded-lg bg-gray-800 border-l-4 shadow-md ${feedbackCategory.color.replace(
            "text",
            "border"
          )}`}
        >
          <MemoizedMarkdown content={feedback} />

          {/* Improved typing indicator */}
          {isStreaming && (
            <div className="flex items-center mt-3 space-x-1">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                  times: [0, 0.5, 1],
                }}
                className="w-1 h-1 bg-blue-400 rounded-full"
              />
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                  delay: 0.2,
                  times: [0, 0.5, 1],
                }}
                className="w-1 h-1 bg-blue-400 rounded-full"
              />
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                  delay: 0.4,
                  times: [0, 0.5, 1],
                }}
                className="w-1 h-1 bg-blue-400 rounded-full"
              />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Add StreamingMessage component for responding text
const StreamingMessage = ({ content, feedbackCategory, isPro }) => {
  // Use ref to track previous content length for animation
  const prevContentLengthRef = useRef(0);
  const [animateLastChars, setAnimateLastChars] = useState(false);

  // Effect to animate new characters
  useEffect(() => {
    if (content && content.length > prevContentLengthRef.current) {
      setAnimateLastChars(true);
      const timer = setTimeout(() => setAnimateLastChars(false), 200);
      prevContentLengthRef.current = content.length;
      return () => clearTimeout(timer);
    }
  }, [content]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-start space-x-0 xl:space-x-4"
    >
      {/* AI Avatar */}
      <div className="hidden overflow-hidden flex-shrink-0 justify-center items-center w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full xl:flex">
        <SiOpentofu className="w-4 h-4 text-white" />
      </div>

      {/* Message content */}
      <div className="w-full xl:flex-1 xl:min-w-0">
        <div className="flex items-center mb-1">
          <p className="font-semibold text-gray-300">
            {isPro ? "Qube Pro" : "Qube"}
          </p>
          <div className="flex items-center ml-2">
            <span className="px-2 py-0.5 text-xs text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
              {content ? "RESPONDING..." : "THINKING..."}
            </span>
          </div>
          <span className="ml-2 text-xs text-gray-500">
            {new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>

        {/* Modern message display with smooth rounded appearance */}
        <div className="p-4 bg-gray-800 rounded-lg border border-gray-700 shadow-sm transition-all">
          <div className={animateLastChars ? "animate-pulse-opacity" : ""}>
            <ProcessedText text={content} isStreaming={true} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FeedbackSection;
