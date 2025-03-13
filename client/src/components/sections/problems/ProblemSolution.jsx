import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  FaTimes,
  FaClock,
  FaCheck,
  FaLightbulb,
  FaQuestion,
  FaRedo,
} from "react-icons/fa";
import { BiSend } from "react-icons/bi";
import { SiOpentofu } from "react-icons/si";
import { Switch } from "@headlessui/react";
import SquigglyPlaceholder from "../../parts/SquigglyPlaceholder";
import { useFeedback } from "../../../hooks/useFetch/useFetchFeedback";
import { useProblemState } from "../../../hooks/useProblemState/useProblemState";
import { useConversationHistory } from "../../../hooks/useConversationHistory/useConversationHistory";
import axios from "axios";

import ProblemTimer from "./components/ProblemTimer";
import ProblemHeader from "./components/ProblemHeader";
import FeedbackSection from "./components/FeedbackSection";

const MAX_CHARS = 1000;

const ProblemSolution = ({
  currentUser,
  selectedProblem,
  hintsVisible,
  currentHintIndex,
  showNextHint,
  setHintsVisible,
  setCurrentHintIndex,
  setSolutionVisible,
  solutionVisible,
  handleCloseModal,
  toggleState,
  isPro,
  startTime,
  userAnswer,
  setUserAnswer,
  notes,
  setNotes,
  handleSaveNotes,
  savedMessage,
  showNotes,
  toggleNotes,
}) => {
  // Use our custom hooks
  const {
    isOverlayVisible,
    setIsOverlayVisible,
    isTimerEnabled,
    setIsTimerEnabled,
    inputType,
    setInputType,
    isProSharpe,
    userPlan,
    getTimeLimit,
    formatTime,
    startProblem,
    tryAgain,
    toggleTimer,
  } = useProblemState(isPro);

  const [feedbackCategory, setFeedbackCategory] = useState({
    heading: "NO FEEDBACK",
    color: "text-gray-400",
    replace: "",
  });

  // First initialize conversation history hook
  const {
    conversationId,
    conversationHistory,
    clearConversationHistory,
    loading: historyLoading,
    submitAttempt: submitProgressAttempt,
    addMessage,
  } = useConversationHistory(selectedProblem?._id, {
    title: selectedProblem?.title,
    difficulty: selectedProblem?.difficulty,
    category: selectedProblem?.category,
    timeLimit: getTimeLimit(selectedProblem?.difficulty || "Medium"),
  });

  // Get feedback functionality from the useFeedback hook, passing addMessage function
  const {
    feedback,
    chatContainerRef,
    feedbackCategory: hookFeedbackCategory,
    loading: loadingFeedback,
    isAnswerIncorrect,
    isComplete,
    isStreaming,
    explanationCount,
    isExplanationLimitReached,
    fetchFeedback,
    fetchFurtherExplanation,
    resetExplanation,
    updateMetadata,
  } = useFeedback();

  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
  const [charCount, setCharCount] = useState(0);
  const [timeoutOccurred, setTimeoutOccurred] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [isTimerStarted, setIsTimerStarted] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleTimeout = () => {
    setTimeoutOccurred(true);
    setShowSolution(true);
    fetchFeedback(selectedProblem.description, "No solution provided", isPro);
  };

  // Create a ref for the textarea
  const textareaRef = useRef(null);

  const handleSubmit = async () => {
    if (!userAnswer || userAnswer.trim() === "") {
      return;
    }

    try {
      // Calculate time spent for progress tracking
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);

      // Fetch feedback - this will now use addMessage internally to save messages
      const response = await fetchFeedback(
        selectedProblem.description,
        userAnswer,
        isPro
      );

      // Get the feedback category information and determine if correct
      const feedbackCat = hookFeedbackCategory || {
        heading: "NO FEEDBACK",
        color: "text-gray-400",
      };

      const isCorrect =
        hookFeedbackCategory?.heading === "STRONGLY RIGHT" ||
        hookFeedbackCategory?.heading === "WEAKLY RIGHT";

      // Submit the attempt using the function from useConversationHistory
      if (submitProgressAttempt) {
        await submitProgressAttempt(
          userAnswer,
          "text", // language
          timeSpent,
          isCorrect,
          feedbackCat
        );
      } else {
        // Fallback - direct API call
        try {
          const mongoId = localStorage.getItem("mongoId");
          if (mongoId) {
            await axios.post("/api/progress/submit-attempt", {
              userId: mongoId,
              questionId: selectedProblem._id,
              code: userAnswer,
              language: "text",
              timeSpent,
              correct: isCorrect,
              feedbackCategory: feedbackCat,
            });
          }
        } catch (error) {
          console.error("Error submitting attempt directly:", error);
        }
      }

      // Only add to the global conversation history after streaming is complete
      if (response && response.content && addMessage) {
        await addMessage({
          role: "assistant",
          content: response.content,
          messageType: "feedback",
        });

        // Update metadata with feedback category
        if (updateMetadata) {
          await updateMetadata({
            feedbackCategory: response.category,
          });
        }
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
    }
  };

  // Enhanced explain handler that also saves to conversation history
  const handleExplainFurther = async () => {
    try {
      // First clear the user input
      setUserAnswer("");

      // Add user message requesting explanation
      if (addMessage) {
        await addMessage({
          role: "user",
          content: "Please explain this further.",
          messageType: "explanation",
        });
      }

      // Fetch explanation
      const explanation = await fetchFurtherExplanation(
        feedback || selectedProblem.description,
        "explanation",
        userPlan
      );

      // Add assistant explanation to conversation history
      if (explanation && explanation.content && addMessage) {
        await addMessage({
          role: "assistant",
          content: explanation.content,
          messageType: "explanation",
        });
      }
    } catch (error) {
      console.error("Error in handleExplainFurther:", error);
    }
  };

  // Enhanced question handler that also saves to conversation history
  const handleAskQuestion = async () => {
    if (!userAnswer || userAnswer.trim() === "") {
      return;
    }

    try {
      const question = userAnswer;

      // Clear the input field
      setUserAnswer("");

      // Add user question to conversation history
      if (addMessage) {
        await addMessage({
          role: "user",
          content: question,
          messageType: "question",
        });
      }

      // Fetch explanation for the question
      const explanation = await fetchFurtherExplanation(
        question,
        "question",
        userPlan
      );

      // Add assistant answer to conversation history
      if (explanation && explanation.content && addMessage) {
        await addMessage({
          role: "assistant",
          content: explanation.content,
          messageType: "explanation",
        });
      }
    } catch (error) {
      console.error("Error in handleAskQuestion:", error);
    }
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+Alt+C to clear conversation
      if (e.metaKey && e.shiftKey && e.key === "c") {
        e.preventDefault();
        setShowClearConfirm(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleClearHistory = async () => {
    try {
      if (clearConversationHistory) {
        const success = await clearConversationHistory();
        if (success) {
          setShowClearConfirm(false);
          setUserAnswer("");
          resetExplanation();
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

  // Manual scroll to bottom function
  const scrollToBottom = () => {
    if (!chatContainerRef.current) return;
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  };

  // Auto-scroll chat to bottom when new messages are added
  useEffect(() => {
    if (!autoScrollEnabled) return;

    const shouldScroll =
      chatContainerRef?.current &&
      (conversationHistory.length > 0 || isStreaming);

    if (shouldScroll) {
      scrollToBottom();
    }
  }, [conversationHistory, isStreaming, chatContainerRef, scrollToBottom]);

  // Toggle auto-scroll
  const toggleAutoScroll = () => {
    setAutoScrollEnabled(!autoScrollEnabled);
    if (!autoScrollEnabled) {
      scrollToBottom();
    }
  };

  // Check if the ref exists before trying to scroll
  const safeScrollToBottom = () => {
    if (chatContainerRef?.current) {
      scrollToBottom();
    }
  };

  // Handle the "Start Problem" button to begin the timer
  const handleStartProblem = () => {
    startProblem(selectedProblem?.difficulty || "Medium");
    setIsOverlayVisible(false);
    // Ensure we don't try to scroll immediately as the chat container may not be mounted yet
    setTimeout(safeScrollToBottom, 100);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex z-50 justify-center items-center h-min"
    >
      <div className="backdrop-blur-sm" onClick={handleCloseModal} />

      <div className="relative mx-4 my-16 w-full max-w-5xl lg:max-w-none">
        {isOverlayVisible ? (
          // Enhanced welcome screen and problem start overlay
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="px-4 py-8 bg-gray-800 rounded-lg shadow-xl lg:p-16"
          >
            <button
              onClick={handleCloseModal}
              className="absolute right-0 p-1 text-gray-400 bg-gray-700 border-2 border-gray-600 -top-[60px] hover:bg-gray-600 rounded-xl hover:text-red-500 transition-colors"
            >
              <FaTimes className="w-5 h-5" />
            </button>

            <div className="flex flex-col justify-between items-center pb-2 mb-6 border-b border-gray-700 lg:flex-row">
              <div className="flex flex-col">
                <h2 className="mb-2 text-3xl font-bold tracking-tighter text-green-400">
                  {selectedProblem.title}
                </h2>
                <p className="text-sm tracking-widest text-gray-400">
                  {selectedProblem.category}
                </p>

                <div className="flex flex-wrap gap-2 my-4">
                  <div className="flex gap-2 items-center px-3 py-1 text-xs font-semibold text-gray-300 bg-gray-700 rounded-md">
                    {selectedProblem.difficulty.toUpperCase()}
                  </div>
                  {selectedProblem.tags.map((tag, index) => (
                    <div
                      key={index}
                      className="px-3 py-1 text-xs tracking-wide text-gray-300 bg-gray-700 rounded-md"
                    >
                      {tag}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col justify-center items-center w-full lg:w-1/2">
                <div className="flex flex-col gap-3 justify-center items-center w-full">
                  <div className="flex justify-between items-center p-3 w-full rounded-lg bg-gray-700/50">
                    <div className="flex gap-2 items-center">
                      <FaClock className="w-4 h-4 text-gray-300" />
                      <span className="text-sm font-medium text-gray-300">
                        Timer
                      </span>
                      {isTimerEnabled ? (
                        <span className="p-1 text-xs text-gray-400 bg-gray-700 rounded-md">
                          Limit:{" "}
                          <span className="font-semibold text-green-400">
                            {formatTime(
                              getTimeLimit(selectedProblem.difficulty)
                            )}
                          </span>
                        </span>
                      ) : (
                        <span className="p-1 text-xs text-gray-400 bg-gray-700 rounded-md">
                          Limit:{" "}
                          <span className="font-semibold text-green-400">
                            Infinity
                          </span>
                        </span>
                      )}
                    </div>
                    <Switch
                      checked={isTimerEnabled}
                      onChange={toggleTimer}
                      className={`${
                        isTimerEnabled ? "bg-green-500" : "bg-gray-600"
                      } relative inline-flex h-6 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-800`}
                    >
                      <span
                        className={`${
                          isTimerEnabled ? "translate-x-6" : "translate-x-1"
                        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200`}
                      />
                    </Switch>
                  </div>

                  <motion.button
                    onClick={handleStartProblem}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={`w-full px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-green-600 to-green-500 rounded-md transition-all duration-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800 ${
                      isTimerEnabled
                        ? "shadow-[0_0_15px_rgba(74,222,128,0.3)]"
                        : ""
                    }`}
                  >
                    Start Problem
                  </motion.button>
                </div>
              </div>
            </div>

            <div className="p-4 my-4 w-full rounded-lg bg-gray-700/50">
              <motion.div
                initial={{ opacity: 0.3 }}
                animate={{ opacity: 1 }}
                transition={{
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 1.5,
                }}
              >
                <SquigglyPlaceholder lines={4} />
              </motion.div>
            </div>

            <div className="p-6 mt-4 w-full rounded-lg shadow-lg backdrop-blur-sm bg-gray-900/30">
              <div className="flex flex-col justify-center items-center text-center">
                <motion.div
                  className="p-3 mb-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full border border-white"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, type: "spring" }}
                >
                  <SiOpentofu className="w-12 h-12 text-white" />
                </motion.div>

                <motion.h2
                  className="mb-3 text-xl font-semibold text-white lg:text-2xl"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                >
                  Hello! I'm Qube, <br /> your{" "}
                  <span className="text-transparent animate-gradient gradient-text bg-clip">
                    personal
                  </span>{" "}
                  quant assistant
                </motion.h2>

                <motion.p
                  className="mb-6 max-w-lg text-gray-300"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                >
                  Enter your solution after starting the problem, and I'll
                  provide you with detailed feedback and guidance.
                </motion.p>

                <motion.div
                  className="grid grid-cols-1 gap-3 w-full max-w-lg sm:grid-cols-2"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.4 }}
                >
                  <div className="p-4 text-left bg-gray-800 rounded-lg border border-gray-700 shadow-md transition-colors hover:bg-gray-750">
                    <p className="text-sm text-gray-300">
                      <span className="block mb-1 font-medium text-green-400">
                        Submit a solution
                      </span>
                      Type your answer and click Submit to receive feedback on
                      your approach.
                    </p>
                  </div>
                  <div className="p-4 text-left bg-gray-800 rounded-lg border border-gray-700 shadow-md transition-colors hover:bg-gray-750">
                    <p className="text-sm text-gray-300">
                      <span className="block mb-1 font-medium text-green-400">
                        Ask questions
                      </span>
                      Need clarification? You can ask questions about the
                      problem at any time.
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>

            <div className="flex relative items-center mt-4">
              {/* Model selector with tooltip */}
              <div
                className={`flex absolute bottom-3 left-3 z-10 gap-2 items-center`}
              >
                <div className="relative px-2 py-1 bg-gray-800 rounded-xl border border-gray-700 hover:bg-gray-700 group">
                  <div className="flex items-center cursor-pointer">
                    <div className="p-1 mr-2 text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
                      <SiOpentofu className="w-3 h-3" />
                    </div>
                    <kbd className="text-xs font-medium text-gray-400">
                      Qube
                    </kbd>
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

                <div className="hidden gap-2 lg:flex">
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    disabled={true}
                    className={`flex items-center px-2 py-1.5 text-sm font-medium text-gray-200 bg-gray-800 rounded-xl border border-gray-700 transition-all duration-200 hover:bg-gray-700 hover:shadow-md`}
                  >
                    <FaLightbulb className="mr-2 text-yellow-400" />
                    <kbd className="text-xs text-gray-400">Explain Further</kbd>
                  </motion.button>

                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    disabled={true}
                    className={`flex items-center px-2 py-1.5 text-sm font-medium text-gray-200 bg-gray-800 rounded-xl border border-gray-700 transition-all duration-200 hover:bg-gray-700 hover:shadow-md`}
                  >
                    <FaQuestion className="mr-2 text-blue-400" />
                    <kbd className="text-xs text-gray-400">Ask a Question</kbd>
                  </motion.button>

                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    disabled={true}
                    className={`flex items-center px-2 py-1.5 text-sm font-medium text-gray-200 bg-gray-800 rounded-xl border border-gray-700 transition-all duration-200 hover:bg-gray-700 hover:shadow-md`}
                  >
                    <FaRedo className="mr-2 text-green-400" />
                    <kbd className="text-xs text-gray-400">Try Again</kbd>
                  </motion.button>
                </div>
              </div>

              <textarea
                ref={textareaRef}
                className={`px-6 pt-6 pb-12 w-full text-gray-200 rounded-xl border border-gray-700 shadow-inner transition-all resize- bg-gray-900/80 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                style={{
                  height: "auto",
                  minHeight: "120px",
                  maxHeight: "250px",
                }}
                disabled={true}
                placeholder="Start the problem to begin typing..."
              />
              <motion.button
                disabled={true}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`absolute right-2 bottom-2 p-3 text-white bg-gray-600 rounded-full transition-all cursor-not-allowed`}
              >
                <BiSend className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Character counter and keyboard hints */}
            <div className="hidden justify-between mt-2 text-xs text-gray-500 xl:flex">
              <span>
                Press{" "}
                <kbd className="px-1 py-0.5 bg-gray-700 rounded text-xs">
                  Enter
                </kbd>{" "}
                to submit •{" "}
                <kbd className="px-1 py-0.5 bg-gray-700 rounded text-xs">
                  Shift+Enter
                </kbd>{" "}
                for new line
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

            <div className="mt-8 text-sm text-center text-gray-400">
              Click "Start Problem" when you're ready to begin.{" "}
              {isTimerEnabled && "The timer will start automatically."}
            </div>
          </motion.div>
        ) : (
          // Main problem solving interface
          <div className="flex flex-col">
            {/* Upper section with problem description and hints/notes */}
            <div
              className="px-2 pt-8 pb-4 bg-gray-900 rounded-t-xl xl:pb-8 xl:p-16"
              style={{
                boxShadow:
                  "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              }}
            >
              <button
                onClick={handleCloseModal}
                className="absolute right-0 p-1 text-gray-400 bg-gray-700 border-2 border-gray-600 -top-[60px] hover:bg-gray-600 rounded-xl hover:text-red-500 transition-colors"
              >
                <FaTimes className="w-5 h-5" />
              </button>
              {/* Problem header */}
              <ProblemHeader
                selectedProblem={selectedProblem}
                isTimerStarted={isTimerStarted}
                handleTimeout={handleTimeout}
                feedbackCategory={feedbackCategory}
              />

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="p-4 mt-4 font-medium rounded-lg shadow-sm bg-gray-950"
              >
                <p>{selectedProblem.description}</p>
              </motion.div>
            </div>

            {/* FeedbackSection component */}
            <FeedbackSection
              loadingFeedback={loadingFeedback || historyLoading}
              conversationHistory={conversationHistory}
              isStreaming={isStreaming}
              feedback={feedback}
              feedbackCategory={hookFeedbackCategory}
              currentUser={currentUser}
              isComplete={isComplete}
              isAnswerIncorrect={isAnswerIncorrect}
              userAnswer={userAnswer}
              setUserAnswer={setUserAnswer}
              handleSubmit={handleSubmit}
              handleExplainFurther={handleExplainFurther}
              handleAskQuestion={handleAskQuestion}
              isPro={isPro}
              isProSharpe={isProSharpe}
              explanationCount={explanationCount}
              isExplanationLimitReached={isExplanationLimitReached}
              inputType={inputType}
              setInputType={setInputType}
              chatContainerRef={chatContainerRef}
              textareaRef={textareaRef}
              clearConversationHistory={clearConversationHistory}
            />
          </div>
        )}
      </div>

      {/* Confirmation Modal (global keyboard shortcut) */}
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
    </motion.div>
  );
};

export default ProblemSolution;
