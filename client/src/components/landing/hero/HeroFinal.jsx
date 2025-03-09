import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TbUserEdit, TbNews } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { ReactTyped } from "react-typed";
import emailjs from "emailjs-com";
import { useAuth } from "../../../contexts/authContext";
import backgroundImage from "../../../assets/images/mac.png";
import iphoneImage from "../../../assets/images/iphone.png";
import "../../../index.css";
import { FaArrowRightLong } from "react-icons/fa6";

// Memoized Intro Component
const Intro = React.memo(({ triggerBounce }) => {
  const { currentUser, userValid } = useAuth();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [showQuote, setShowQuote] = useState(true); // State to control quote display
  const form = useRef();
  const navigate = useNavigate();

  const quote = "Luck is what happens when preparation meets opportunity.";
  const author = "- Seneca, c. 1-100 AD.";

  const handleEmailChange = useCallback((e) => {
    setEmail(e.target.value);
  }, []);

  const handleCreateAccount = useCallback(() => {
    console.log("Create Account button clicked.");
    navigate("/register");
  }, []);

  const handleJoinNewsletter = useCallback(() => {
    console.log("Join Newsletter button clicked.");
    navigate("/newsletter-sign-up");
  }, []);

  const handleGoToHome = useCallback(() => {
    console.log("Go to Home button clicked.");
    navigate("/home");
  }, []);

  const handleSubmit = useCallback((e) => {
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
                console.log("Welcome email sent SUCCESS!", welcomeResult.text);
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
  }, []);

  useEffect(() => {
    const quoteDuration = 10000;
    const fadeDuration = 1000;

    setTimeout(() => {
      setShowQuote(false);
    }, quoteDuration + fadeDuration);
  }, []);

  return (
    <div className="relative flex items-center justify-center w-full min-h-[100vh] text-gray-300 bg-center bg-cover bg-gradient-to-b from-gray-800 to-black">
      <AnimatePresence>
        {showQuote && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="flex fixed inset-0 z-[100] flex-col justify-center items-center bg-black"
          >
            <ReactTyped
              strings={[quote]}
              typeSpeed={40}
              backSpeed={30}
              startDelay={1000}
              className="px-6 text-2xl font-semibold text-center text-white md:text-5xl"
              showCursor={false}
            />
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 3 }}
              className="mt-4 text-sm text-gray-400 md:text-lg"
            >
              {author}
            </motion.p>

            {/* SKIP Button with smooth UI/UX */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              onClick={() => setShowQuote(false)}
              className="mt-6 px-4 py-2 font-medium text-gray-100 bg-[#343541] border border-gray-700 rounded-md hover:bg-[#45474A] hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              SKIP
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {!showQuote && (
        <>
          <div className="absolute top-0 left-0 w-full h-full z-9">
            <div className="fixed top-0 left-4 z-10 transform-gpu">
              <ReactTyped
                strings={[
                  "quantercise",
                  "quantercise quantercise",
                  "quantercise quantercise quantercise",
                  "quantercise quantercise quantercise quantercise",
                  "quantercise quantercise quantercise quantercise quantercise",
                  "quantercise quantercise quantercise quantercise quantercise quantercise",
                  "quantercise quantercise quantercise quantercise quantercise quantercise quantercise",
                  "quantercise quantercise quantercise quantercise quantercise quantercise quantercise quantercise",
                  "quantercise quantercise quantercise quantercise quantercise quantercise quantercise quantercise quantercise",
                  "quantercise quantercise quantercise quantercise quantercise quantercise quantercise quantercise quantercise",
                  "quantercise quantercise quantercise quantercise quantercise quantercise quantercise quantercise quantercise",
                  "quantercise quantercise quantercise quantercise quantercise quantercise quantercise quantercise quantercise",
                ]}
                typeSpeed={10}
                backSpeed={50}
                backDelay={800}
                loop
                className="font-bold opacity-[0.03] text-gray-300 text-[18vw] leading-none text-center"
              />
            </div>
          </div>
          <motion.div
            id="emailForm"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-[11] flex flex-col items-center justify-center h-full px-4 mx-auto max-w-screen-2xl xl:flex-row"
          >
            <div className="text-center xl:w-1/3 xl:text-left">
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="flex-row text-3xl font-extrabold tracking-tight text-gray-200 xl:pt-16 sm:text-4xl xl:flex-col md:text-5xl"
              >
                <span className="block text-4xl font-bold tracking-tighter md:text-6xl sm:pt-12 sm:inline">
                  quantitative prep{" "}
                </span>
                <span className="text-5xl font-bold text-transparent xl:text-6xl gradient-text animate-gradient">
                  made easy
                </span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                className=" mt-4 text-base font-normal tracking-wide text-center text-gray-300 xl:max-w-[400px] lg:text-left  sm:text-xl md:text-2xl"
              >
                Track your application progress and simulate intense quant
                interviews, all in one place
              </motion.p>
              <div className="hidden flex-row gap-4 justify-center mb-4 xl:flex xl:justify-normal">
                {currentUser && userValid ? (
                  <>
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 1, delay: 1 }}
                      onClick={handleGoToHome}
                      className="px-4 py-2 mt-8 text-xs font-bold text-green-400 whitespace-nowrap bg-black rounded-lg border-2 border-green-400 shadow-lg group lg:text-lg hover:bg-green-400 hover:text-black"
                    >
                      Your Dashboard
                      <FaArrowRightLong className="inline-block ml-2 w-4 h-4 transition-transform duration-300 lg:w-4 lg:h-6 group-hover:-rotate-45" />
                    </motion.button>
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 1, delay: 1 }}
                      onClick={handleJoinNewsletter}
                      className="px-4 py-2 mt-8 text-xs font-bold text-black whitespace-nowrap bg-green-400 rounded-lg border-2 border-green-400 shadow-lg lg:text-lg hover:bg-black hover:text-green-400"
                    >
                      Join Newsletter
                      <TbNews className="inline-block ml-2 w-4 h-4 lg:w-4 lg:h-6" />
                    </motion.button>
                  </>
                ) : (
                  <>
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 1, delay: 1 }}
                      onClick={handleCreateAccount}
                      className="px-4 py-2 mt-8 text-xs font-bold text-green-400 whitespace-nowrap bg-black rounded-lg border-2 border-green-400 shadow-lg lg:text-lg hover:bg-green-400 hover:text-black"
                    >
                      Start for Free
                      <TbUserEdit className="inline-block ml-2 w-4 h-4 lg:w-4 lg:h-6" />
                    </motion.button>
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 1, delay: 1 }}
                      onClick={handleJoinNewsletter}
                      className="px-4 py-2 mt-8 text-xs font-bold text-black whitespace-nowrap bg-green-400 rounded-lg border-2 border-green-400 shadow-lg lg:text-lg hover:bg-black hover:text-green-400"
                    >
                      Join Newsletter
                      <TbNews className="inline-block ml-2 w-4 h-4 lg:w-4 lg:h-6" />
                    </motion.button>
                  </>
                )}
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 2.5, delay: 0.3 }}
              className="relative z-10 mt-4 lg:max-w-screen-lg xl:mt-0 xl:w-2/3"
            >
              {/* Device Mockup Container */}
              <div className="flex relative justify-center items-center">
                {/* iPhone Mockup - positioned to overlap with MacBook */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 2, delay: 0.8 }}
                  className="absolute left-0 -bottom-4 md:-bottom-8 z-30 w-[30%] transform translate-x-[-15%] translate-y-[10%]"
                >
                  <img
                    alt="Content image"
                    src={iphoneImage}
                    className="w-full h-auto drop-shadow-2xl"
                    loading="lazy"
                  />
                </motion.div>

                {/* MacBook Mockup */}
                <motion.div
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 2.5, delay: 0.3 }}
                  className="relative w-[90%] ml-auto"
                >
                  <img
                    alt="Quantercise MacBook Mockup"
                    src={backgroundImage}
                    className="w-full h-auto drop-shadow-2xl"
                    loading="lazy"
                  />
                </motion.div>
              </div>
              <div className="flex flex-row gap-4 justify-center mt-4 xl:hidden xl:justify-normal">
                {currentUser && userValid ? (
                  <>
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 1, delay: 1 }}
                      onClick={handleGoToHome}
                      className="px-4 py-2 mt-8 text-xs font-bold text-green-400 whitespace-nowrap bg-black rounded-lg border-2 border-green-400 shadow-lg group lg:text-lg hover:bg-green-400 hover:text-black"
                    >
                      Your Dashboard
                      <FaArrowRightLong className="inline-block ml-2 w-4 h-4 transition-transform duration-300 lg:w-4 lg:h-6 group-hover:-rotate-45" />
                    </motion.button>
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 1, delay: 1 }}
                      onClick={handleJoinNewsletter}
                      className="px-4 py-2 mt-8 text-xs font-bold text-black whitespace-nowrap bg-green-400 rounded-lg border-2 border-green-400 shadow-lg lg:text-lg hover:bg-black hover:text-green-400"
                    >
                      Join Newsletter
                      <TbNews className="inline-block ml-2 w-4 h-4 lg:w-4 lg:h-6" />
                    </motion.button>
                  </>
                ) : (
                  <>
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 1, delay: 1 }}
                      onClick={handleCreateAccount}
                      className="px-4 py-2 mt-8 text-xs font-bold text-green-400 whitespace-nowrap bg-black rounded-lg border-2 border-green-400 shadow-lg lg:text-lg hover:bg-green-400 hover:text-black"
                    >
                      Start for Free
                      <TbUserEdit className="inline-block ml-2 w-4 h-4 lg:w-4 lg:h-6" />
                    </motion.button>
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 1, delay: 1 }}
                      onClick={handleJoinNewsletter}
                      className="px-4 py-2 mt-8 text-xs font-bold text-black whitespace-nowrap bg-green-400 rounded-lg border-2 border-green-400 shadow-lg lg:text-lg hover:bg-black hover:text-green-400"
                    >
                      Join Newsletter
                      <TbNews className="inline-block ml-2 w-4 h-4 lg:w-4 lg:h-6" />
                    </motion.button>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, delay: 7, ease: "easeOut" }}
        class="custom-shape-divider-bottom-1733168517"
      >
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,120L1200,120L892.25,5.28L0,120Z"
            class="shape-fill"
          ></path>
        </svg>
      </motion.div>
    </div>
  );
});

export default Intro;
