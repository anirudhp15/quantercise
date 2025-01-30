import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowRightLong } from "react-icons/fa6";
import { PiArrowArcRightThin } from "react-icons/pi";
import { TbUserEdit, TbNews } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { ReactTyped } from "react-typed";
import emailjs from "emailjs-com";
import backgroundImage from "../../../../assets/images/mac.png";
import trackingImage from "../../../../assets/images/applications.jpg";
import AnimatedGrid from "../animatedGrid/AnimatedGrid";
import "../../../../index.css";

// Memoized Intro Component
const Intro = React.memo(({ triggerBounce }) => {
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
    navigate("/waitlist");
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
            transition={{ duration: 1, delay: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black"
          >
            <ReactTyped
              strings={[quote]}
              startDelay={2000}
              typeSpeed={40}
              backSpeed={30}
              className="absolute top-4 left-4 right-4 z-10 text-[5rem] font-bold text-white md:text-[10.5rem]"
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
              className="fixed block text-lg font-light text-gray-300 bottom-[10rem] md:text-xl"
            >
              {author}
            </motion.p>
            {/* Add a skip button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              onClick={() => setShowQuote(false)}
              className="fixed z-50 px-4 py-2 font-normal text-white border-4 border-white rounded bottom-[45vh] hover:text-black hover:bg-green-500 hover:border-black focus:outline-none"
            >
              SKIP
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {!showQuote && (
        <>
          <div className="absolute top-0 left-0 w-full h-full z-9">
            <div className="fixed top-0 z-10 left-4 transform-gpu">
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
                  "quantercise quantercise quantercise quantercise quantercise quantercise quantercise quantercise quantercise quantercise",
                  "quantercise quantercise quantercise quantercise quantercise quantercise quantercise quantercise quantercise quantercise quantercise",
                  "quantercise quantercise quantercise quantercise quantercise quantercise quantercise quantercise quantercise quantercise quantercise quantercise",
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
            className="relative z-[11] flex flex-col items-center justify-center h-full px-8 mx-auto max-w-screen-2xl xl:flex-row"
          >
            <div className="text-center xl:w-1/3 xl:text-left">
              <div className=" xl:mx-auto xl:w-2/3">
                <motion.h1
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                  className="text-3xl font-extrabold tracking-tight text-gray-200 whitespace-nowrap xl:pt-16 sm:text-4xl md:text-5xl"
                >
                  <span className="text-gray-100/75">Welcome to</span> <br />
                  <span className="block text-5xl font-black tracking-tighter text-transparent whitespace-nowrap sm:pt-12 gradient-text animate-gradient sm:inline md:text-6xl">
                    Quantercise
                  </span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="hidden mt-4 text-lg font-normal tracking-wide text-center text-gray-400 xl:max-w-[400px] lg:text-left md:block sm:text-xl md:text-2xl"
                >
                  A cutting-edge platform designed to elevate all of your
                  quantitative skills.
                </motion.p>
                <div className="flex flex-row justify-center gap-4 mb-4 xl:justify-normal">
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1 }}
                    onClick={handleCreateAccount}
                    className="px-4 py-2 mt-8 text-xs font-bold text-green-400 bg-black border-2 border-green-400 rounded-lg shadow-lg lg:text-lg whitespace-nowrap hover:bg-green-400 hover:text-black"
                  >
                    Create Account
                    <TbUserEdit className="inline-block w-4 h-4 ml-2 lg:w-4 lg:h-6" />
                  </motion.button>
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1 }}
                    onClick={handleJoinNewsletter}
                    className="px-4 py-2 mt-8 text-xs font-bold text-black bg-green-400 border-2 border-green-400 rounded-lg shadow-lg lg:text-lg whitespace-nowrap hover:bg-black hover:text-green-400"
                  >
                    Join Newsletter
                    <TbNews className="inline-block w-4 h-4 ml-2 lg:w-4 lg:h-6" />
                  </motion.button>
                </div>
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 2.5, delay: 0.3 }}
              className="relative z-10 mx-auto mt-4 lg:max-w-screen-lg xl:mt-0 xl:w-2/3"
            >
              {/* Right MacBook Mockup */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 2.5, delay: 0.3 }}
                className="relative flex items-center justify-center w-full"
              >
                <img
                  src={backgroundImage}
                  alt="Quantercise MacBook Mockup"
                  className="w-[80%] relative z-20"
                  loading="lazy"
                />
                {/* <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  src={demo}
                  className="absolute w-[85%]"
                >
                  {" "}
                </video> */}
              </motion.div>
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
