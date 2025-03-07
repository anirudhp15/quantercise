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
      className="relative bottom-0 z-10 pt-8 pb-4 w-full text-gray-300 border-t-4 border-gray-700 transition-all duration-100 group/footer bg-gray-950 xl:hover:border-green-400"
    >
      <div
        id="landingfooter"
        className="flex flex-col justify-between items-center mx-auto space-y-8 md:px-32 lg:flex-row lg:space-y-0"
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={footerVariants}
          className="flex flex-col items-center space-y-6 lg:items-start"
        >
          <RouterLink
            to="/landing"
            className="text-xl font-black text-green-400 transition duration-100 hover:text-green-200"
          >
            Quantercise
          </RouterLink>
          <p className="text-sm text-gray-400">Stay Sharpe.</p>
          <div className="flex flex-row items-center mt-4 space-x-8 lg:items-start">
            <ScrollLink
              to="intro"
              smooth={true}
              duration={800}
              onJoinClick={onJoinClick}
              className="px-2 py-1 text-sm font-semibold text-gray-300 rounded-lg hover:text-black hover:scale-105 hover:bg-gray-300 hover:cursor-pointer"
            >
              Join Now
            </ScrollLink>
            <ScrollLink
              to="concepts"
              smooth={true}
              duration={800}
              className="px-2 py-1 text-sm font-semibold text-gray-300 rounded-lg hover:text-black hover:scale-105 hover:bg-gray-300 hover:cursor-pointer"
            >
              Concepts
            </ScrollLink>
            <ScrollLink
              to="pricing"
              smooth={true}
              duration={800}
              className="px-2 py-1 text-sm font-semibold text-gray-300 rounded-lg hover:text-black hover:scale-105 hover:bg-gray-300 hover:cursor-pointer"
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
                className="hover:text-[#181717] hover:bg-white rounded-lg p-1 transition-all duration-100 hover:scale-110"
              >
                <FaGithub size={24} />
              </a>
              <a
                href="https://www.linkedin.com/company/quantercise"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#0A66C2] hover:bg-white rounded-lg p-1 transition-all duration-100 hover:scale-110"
              >
                <FaLinkedin size={24} />
              </a>
              <a
                href="https://www.youtube.com/channel/UCOgvBdaN7lrWmgbf_wD8zyw"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#FF0000] hover:bg-white rounded-lg p-1 transition-all duration-100 hover:scale-110"
              >
                <FaYoutube size={24} />
              </a>
              <a
                href="https://www.instagram.com/quantercise/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#E4405F] hover:bg-white rounded-lg p-1 transition-all duration-100 hover:scale-110"
              >
                <FaInstagram size={24} />
              </a>
              <a
                href="https://x.com/quantercise"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#1DA1F2] hover:bg-white rounded-lg p-1 transition-all duration-100 hover:scale-110"
              >
                <FaXTwitter size={24} />
              </a>
            </div>
            <div className="flex items-center px-2 py-1 space-x-2 text-gray-400 rounded-lg transition duration-200 hover:text-black hover:bg-white">
              <MdOutgoingMail size={20} className="mt-[2px]" />
              <a
                href="mailto:quantercise@gmail.com"
                className="px-2 py-1 text-sm font-semibold"
              >
                quantercise@gmail.com
              </a>
            </div>
          </div>
        </motion.div>
      </div>
      <div className="flex flex-col justify-center items-center px-4 py-6 mx-auto rounded-lg">
        <h2 className="text-lg font-semibold text-center text-gray-400">
          Have suggestions for features? <br />{" "}
          <span className="text-gray-300">We value your feedback!</span>
        </h2>
        <form
          ref={form}
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 items-center mt-4 w-full max-w-md"
        >
          <input
            type="text"
            name="from_name"
            value={feedback.from_name}
            onChange={handleChange}
            placeholder="Name"
            className="px-3 py-2 w-full text-gray-400 rounded-lg border-2 border-t-0 border-r-0 border-l-0 shadow-sm transition duration-200 outline-none focus:border-t-gray-600 bg-gray-950 border-b-gray-600 focus:border-green-600 focus:bg-gray-950"
            required
          />
          <input
            type="email"
            name="user_email"
            value={feedback.user_email}
            onChange={handleChange}
            placeholder="Email"
            className="px-3 py-2 w-full text-gray-400 rounded-lg border-2 border-t-0 border-r-0 border-l-0 shadow-sm transition duration-200 outline-none focus:border-t-gray-600 bg-gray-950 border-b-gray-600 focus:border-green-600 focus:bg-gray-950"
            required
          />
          <textarea
            name="message"
            value={feedback.message}
            onChange={handleChange}
            placeholder="Share your thoughts or suggestions here."
            className="px-3 py-2 w-full text-gray-400 rounded-lg border-2 border-t-0 border-r-0 border-l-0 shadow-sm transition duration-200 outline-none focus:border-t-gray-600 bg-gray-950 border-b-gray-600 focus:border-green-600 focus:bg-gray-950"
            required
          />
          <button
            type="submit"
            className="inline-block px-4 py-2 mt-6 font-bold text-black bg-green-400 rounded-lg border-2 border-green-400 hover:text-green-400 hover:bg-black hover:cursor-pointer hover:shadow-lg group"
          >
            Send Feedback
            <FaArrowRightLong className="inline-block ml-2 transition-transform duration-200 group-hover/footer:-rotate-45 group-hover:translate-x-1 group-hover:-translate-y-1" />
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
      <div className="flex justify-center items-center py-4 w-full text-sm text-gray-500">
        © 2024 Quantercise. All rights reserved.
      </div>
    </motion.div>
  );
};

export default LandingFooter;
