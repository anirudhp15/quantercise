import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowRightLong } from "react-icons/fa6";
import { PiArrowArcRightThin } from "react-icons/pi";
import { ReactTyped } from "react-typed";
import emailjs from "emailjs-com";
import backgroundImage from "../../assets/images/practice_problems.jpg";
import trackingImage from "../../assets/images/applications.jpg";
import AnimatedGrid from "./AnimatedGrid";

// Memoized Intro Component
const Intro = React.memo(({ triggerBounce }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [showQuote, setShowQuote] = useState(true); // State to control quote display
  const form = useRef();

  const quote = "Luck is what happens when preparation meets opportunity.";
  const author = "- Seneca, c. 1-100 AD.";

  const handleEmailChange = useCallback((e) => {
    setEmail(e.target.value);
  }, []);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      emailjs
        .sendForm(
          "service_kctlhsd", // Replace with your EmailJS service ID
          "template_mvzr4wq", // Replace with your EmailJS sign-up template ID
          form.current,
          "_1DlpBDmqjdIFafVH" // Replace with your EmailJS public key
        )
        .then(
          (result) => {
            console.log("Sign-up email sent SUCCESS!", result.text);
            setMessage("Thanks, we'll let you know when we're live.");
            setShowMessage(true);

            emailjs
              .send(
                "service_uh2nkmr", // Replace with your EmailJS service ID
                "template_ol82vvi", // Replace with your EmailJS welcome template ID
                {
                  user_email: form.current.user_email.value, // Use the user's email address
                  reply_to: "quantercise@gmail.com", // Replace with your reply-to email if needed
                },
                "_1DlpBDmqjdIFafVH" // Replace with your EmailJS public key
              )
              .then(
                (welcomeResult) => {
                  console.log(
                    "Welcome email sent SUCCESS!",
                    welcomeResult.text
                  );
                },
                (welcomeError) => {
                  console.log("Welcome email FAILED...", welcomeError.text);
                }
              );
          },
          (error) => {
            console.log("Sign-up email FAILED...", error.text);
            setMessage("Server error. Please try again later.");
            setShowMessage(true);
          }
        );

      setTimeout(() => {
        setShowMessage(false);
      }, 5000);
    },
    [email]
  );

  useEffect(() => {
    const quoteDuration = 10000;
    const fadeDuration = 1000;

    setTimeout(() => {
      setShowQuote(false);
    }, quoteDuration + fadeDuration);
  }, []);

  return (
    <div className="relative flex items-center justify-center w-full min-h-screen text-gray-300 bg-center bg-cover">
      <AnimatePresence>
        {showQuote && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, delay: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black"
          >
            <ReactTyped
              strings={[quote]}
              typeSpeed={40}
              backSpeed={30}
              showCursor={true}
              loop={false}
              onComplete={() => {
                setTimeout(() => {
                  setShowQuote(false);
                }, 4000); // Small delay before fading out the quote
              }}
            />
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 4 }}
              className="block mt-4 text-lg font-light text-gray-300 md:text-xl"
            >
              {author}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {!showQuote && (
        <>
          <div className="fixed inset-0 w-screen h-screen bg-black opacity-50"></div>
          <AnimatedGrid />
          <motion.div
            id="emailForm"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 flex flex-col items-center justify-center h-full max-w-screen-xl mx-auto lg:flex-row"
          >
            <div className="px-12 text-center lg:w-1/2 lg:pr-8 lg:text-left">
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="pt-32 text-3xl font-bold xl:pt-16 lg:pb-4 sm:text-5xl md:text-6xl"
              >
                Welcome to{" "}
                <span className="block text-5xl font-bold text-transparent sm:pt-12 gradient-text animate-gradient sm:inline md:text-7xl">
                  Quantercise
                </span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="hidden mt-6 text-lg font-medium text-gray-300 md:block sm:text-xl md:text-2xl"
              >
                A cutting-edge platform designed to elevate your quantitative
                skills.{" "}
                <span className="font-black text-white">Join our waitlist</span>{" "}
                to be notified when new updates are released.
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="block mt-6 text-lg font-medium text-gray-300 md:hidden sm:text-xl md:text-2xl"
              >
                Join our{" "}
                <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
                  waitlist
                </span>{" "}
                to be notified when new updates are released.
              </motion.p>
              {/* <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.6 }}
                className="flex justify-center mt-4 lg:justify-start"
              >
                <ul className="text-sm font-light text-left text-gray-400 list-disc list-inside sm:text-base md:text-lg">
                  <li>150+ technical questions used in industry interviews</li>
                  <li>Interactive hints and explanations</li>
                  <li>Detailed follow-up questions</li>
                  <li>Site-integrated internship application manager</li>
                </ul>
              </motion.p> */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.7 }}
                className="mt-8"
              >
                <form
                  ref={form}
                  onSubmit={handleSubmit}
                  className="flex flex-col items-center gap-4 lg:flex-row lg:items-start"
                >
                  <input
                    type="email"
                    name="user_email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="Enter your email"
                    className="w-full max-w-xs px-3 py-2 text-white transition duration-200 bg-gray-900 border border-gray-600 rounded-lg shadow-sm outline-none h-11 font-extralight focus:border-green-600 focus:bg-gray-950"
                    required
                  />
                  <motion.button
                    type="submit"
                    className={`w-auto px-6 py-2 text-lg font-bold text-black transition-all duration-200 bg-green-400 rounded-lg shadow-lg whitespace-nowrap lg:mt-0 ${
                      triggerBounce
                        ? "animate-bounce outline-2 outline outline-offset-4 outline-green-400"
                        : ""
                    } hover:scale-105 group hover:bg-green-500 hover:text-white hover:shadow-xl`}
                  >
                    Notify Me
                    <FaArrowRightLong className="inline-block ml-2 transition-transform duration-300 -rotate-45 group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </motion.button>
                </form>
                {message && (
                  <p
                    className={`mt-4 text-lg transition-opacity duration-500 ${
                      showMessage ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    {message}
                  </p>
                )}
              </motion.p>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 2.5, delay: 0.3 }}
              className="relative z-10 max-w-screen-xl mx-auto mt-4 lg:mt-0 lg:w-1/2"
            >
              <div className="relative flex flex-col">
                <div className="flex items-end justify-start space-x-4">
                  <motion.div
                    initial={{ opacity: 0, x: 15, y: 15 }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                    className="relative max-w-sm mb-4 overflow-hidden transition-all duration-150 border-2 border-gray-500 rounded-lg shadow-lg sm:max-w-md md:max-w-lg lg:-rotate-3 lg:-translate-x-6 hover:border-gray-400 group"
                  >
                    <img
                      src={backgroundImage}
                      alt="Quantitative Finance Illustration"
                      className="w-full transition-opacity duration-150 shadow-xl group-hover:opacity-40"
                      loading="lazy"
                    />
                    <div className="absolute bottom-0 left-0 right-0 z-10 flex items-center justify-center w-full h-full px-4 py-2 transition-opacity duration-150 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100">
                      <p className="text-sm font-thin text-center text-white md:text-lg">
                        Access our extensive knowledgebase of interview
                        questions, tagged by specific concepts and subjects to
                        focus on in probability, statistics, programming,
                        finance, and general logical reasoning. Perfect for
                        undergraduates in STEM, graduate students, PhD
                        candidates, and early career quant professionals.
                      </p>
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ clipPath: "inset(0 0 100% 0)" }}
                    animate={{ clipPath: "inset(0 0 0 0)" }}
                    transition={{ duration: 1.5, ease: "easeIn", delay: 2.5 }}
                  >
                    <PiArrowArcRightThin className="hidden w-16 h-16 text-green-300 rotate-90 lg:block" />
                  </motion.div>
                </div>
                <div className="flex items-start justify-center space-x-4 lg:justify-end">
                  <motion.div
                    initial={{ clipPath: "inset(100% 0 0 0)" }}
                    animate={{ clipPath: "inset(0 0 0 0)" }}
                    transition={{ duration: 1.5, delay: 2.7 }}
                  >
                    <PiArrowArcRightThin className="hidden w-16 h-16 text-green-300 -rotate-90 lg:block" />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -15, y: -15 }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    transition={{ duration: 1.5, delay: 0.7 }}
                    className="relative max-w-sm mt-4 overflow-hidden transition-all duration-150 border-2 border-gray-500 rounded-lg shadow-lg sm:max-w-md md:max-w-lg lg:-rotate-3 lg:-translate-x-6 hover:border-gray-400 group"
                  >
                    <img
                      src={trackingImage}
                      alt="Applications Tracking Page"
                      className="w-full transition-opacity duration-150 shadow-xl group-hover:opacity-40"
                      loading="lazy"
                    />
                    <div className="absolute bottom-0 left-0 right-0 z-10 flex items-center justify-center w-full h-full px-4 py-2 transition-opacity duration-150 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100">
                      <p className="text-sm font-thin text-center text-white md:text-lg">
                        Manage your internship and job applications directly
                        from our platform. Track deadlines, statuses, and more
                        with our integrated application tracking system.
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </div>
  );
});

export default Intro;
