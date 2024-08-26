import React, { useRef, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import { motion } from "framer-motion";
import {
  FaGithub,
  FaLinkedin,
  FaYoutube,
  FaInstagram,
  FaXTwitter,
  FaArrowRightLong,
} from "react-icons/fa6";
import { MdOutgoingMail } from "react-icons/md";
import emailjs from "emailjs-com";

const footerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const LandingFooter = ({ onJoinClick }) => {
  const form = useRef();
  const [feedback, setFeedback] = useState({
    from_name: "",
    user_email: "",
    message: "",
  });
  const [formMessage, setFormMessage] = useState("");
  const [showFormMessage, setShowFormMessage] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFeedback({ ...feedback, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    emailjs
      .sendForm(
        "service_kctlhsd", // Replace with your EmailJS service ID
        "template_p52caer", // Replace with your EmailJS template ID
        form.current,
        "_1DlpBDmqjdIFafVH" // Replace with your EmailJS public key
      )
      .then(
        (result) => {
          setFormMessage("Thanks for your feedback!");
          setShowFormMessage(true);
          setFeedback({ from_name: "", user_email: "", message: "" });
        },
        (error) => {
          setFormMessage("Failed to send feedback. Please try again later.");
          setShowFormMessage(true);
        }
      );
    setTimeout(() => {
      setShowFormMessage(false);
    }, 5000);
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={footerVariants}
      className="relative bottom-0 z-10 w-full py-8 text-gray-300 border-t-4 border-gray-700 bg-gray-950"
    >
      <div
        id="landingfooter"
        className="flex flex-col items-center justify-between w-[90%] mx-auto space-y-8 lg:flex-row lg:space-y-0"
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={footerVariants}
          className="flex flex-col items-center space-y-4 lg:items-start"
        >
          <RouterLink
            to="/landing"
            className="text-xl font-bold text-green-400 transition duration-300 hover:text-green-200"
          >
            Quantercise
          </RouterLink>
          <p className="pb-4 text-sm text-gray-400">Stay Sharpe.</p>
          <div className="flex flex-row items-center mt-4 space-x-8 lg:items-start">
            <ScrollLink
              to="intro"
              smooth={true}
              duration={800}
              onJoinClick={onJoinClick}
              className="text-sm text-gray-400 transition duration-300 hover:text-white hover:cursor-pointer"
            >
              Join Now
            </ScrollLink>
            <ScrollLink
              to="concepts"
              smooth={true}
              duration={800}
              className="text-sm text-gray-400 transition duration-300 hover:text-white hover:cursor-pointer"
            >
              Concepts
            </ScrollLink>
            <ScrollLink
              to="pricing"
              smooth={true}
              duration={800}
              className="text-sm text-gray-400 transition duration-300 hover:text-white hover:cursor-pointer"
            >
              Pricing
            </ScrollLink>
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={footerVariants}
          className="flex flex-col items-center lg:items-end"
        >
          <div className="flex flex-col items-center space-y-4 lg:items-end">
            <h2 className="hidden text-lg font-semibold text-white lg:block">
              Follow our socials!
            </h2>
            <div className="flex flex-wrap justify-center space-x-4">
              <a
                href="https://github.com/anirudhp15"
                target="_blank"
                rel="noopener noreferrer"
                className="transition duration-200 text-github hover:text-github-hover"
              >
                <FaGithub size={24} />
              </a>
              <a
                href="https://www.linkedin.com/company/quantercise"
                target="_blank"
                rel="noopener noreferrer"
                className="transition duration-200 text-linkedin hover:text-linkedin-hover"
              >
                <FaLinkedin size={24} />
              </a>
              <a
                href="https://www.youtube.com/channel/UCOgvBdaN7lrWmgbf_wD8zyw"
                target="_blank"
                rel="noopener noreferrer"
                className="transition duration-200 text-youtube hover:text-youtube-hover"
              >
                <FaYoutube size={24} />
              </a>
              <a
                href="https://www.instagram.com/anirudhp15/"
                target="_blank"
                rel="noopener noreferrer"
                className="transition duration-200 text-instagram hover:text-instagram-hover"
              >
                <FaInstagram size={24} />
              </a>
              <a
                href="https://x.com/quantercise"
                target="_blank"
                rel="noopener noreferrer"
                className="transition duration-200 text-twitter hover:text-twitter-hover"
              >
                <FaXTwitter size={24} />
              </a>
            </div>
            <div className="flex items-center pt-2 space-x-2">
              <MdOutgoingMail size={20} className="mt-[2px] text-gray-300" />
              <a
                href="mailto:quantercise@gmail.com"
                className="text-sm text-gray-500 transition duration-200 hover:text-white"
              >
                quantercise@gmail.com
              </a>
            </div>
          </div>
        </motion.div>
      </div>
      <div className="flex flex-col items-center justify-center px-4 py-6 rounded-lg">
        <h2 className="text-lg font-semibold text-white">
          Have suggestions for features? Let us know!
        </h2>
        <form
          ref={form}
          onSubmit={handleSubmit}
          className="flex flex-col items-center w-full max-w-md gap-4 mt-4"
        >
          <input
            type="text"
            name="from_name"
            value={feedback.from_name}
            onChange={handleChange}
            placeholder="Your Name"
            className="w-full px-3 py-2 text-gray-400 transition duration-200 border border-t-0 border-l-0 border-r-0 rounded-lg shadow-sm outline-none focus:border-t-gray-600 bg-gray-950 border-b-gray-600 focus:border-green-600 focus:bg-gray-950"
            required
          />
          <input
            type="email"
            name="user_email"
            value={feedback.user_email}
            onChange={handleChange}
            placeholder="Your Email"
            className="w-full px-3 py-2 text-gray-400 transition duration-200 border border-t-0 border-l-0 border-r-0 rounded-lg shadow-sm outline-none focus:border-t-gray-600 bg-gray-950 border-b-gray-600 focus:border-green-600 focus:bg-gray-950"
            required
          />
          <textarea
            name="message"
            value={feedback.message}
            onChange={handleChange}
            placeholder="Your Feedback (We are still in development, so any ideas are appreciated!)"
            className="w-full px-3 py-2 text-gray-400 transition duration-200 border border-t-0 border-l-0 border-r-0 rounded-lg shadow-sm outline-none focus:border-t-gray-600 bg-gray-950 border-b-gray-600 focus:border-green-600 focus:bg-gray-950"
            required
          />
          <button
            type="submit"
            className="inline-block px-4 py-2 mt-6 font-bold text-black transition-all duration-200 bg-green-400 hover:scale-105 hover:cursor-pointer rounded-xl hover:bg-green-500 hover:text-white hover:shadow-lg group"
          >
            Send Feedback
            <FaArrowRightLong className="inline-block ml-2 transition-transform duration-300 -rotate-45 group-hover:translate-x-1 group-hover:-translate-y-1" />
          </button>
        </form>
        {formMessage && (
          <p
            className={`mt-4 text-lg transition-opacity duration-500 ${
              showFormMessage ? "opacity-100" : "opacity-0"
            }`}
          >
            {formMessage}
          </p>
        )}
      </div>
      <div className="flex items-center justify-center w-full py-4 text-sm text-gray-500">
        © 2024 Quantercise. All rights reserved.
      </div>
    </motion.div>
  );
};

export default LandingFooter;
