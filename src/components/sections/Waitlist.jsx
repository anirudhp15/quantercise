import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { ReactTyped } from "react-typed";
import emailjs from "emailjs-com";
import AnimatedGrid from "./landing/animatedGrid/AnimatedGrid";
import "../../index.css";

const Waitlist = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const form = useRef();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_kctlhsd",
        "template_mvzr4wq",
        form.current,
        "_1DlpBDmqjdIFafVH"
      )
      .then(
        (result) => {
          console.log("Sign-up email sent SUCCESS!", result.text);
          setMessage(
            "Thanks for subscribing to our newsletter! We'll keep you updated."
          );
          setShowMessage(true);
        },
        (error) => {
          console.log("Sign-up email FAILED...", error.text);
          setMessage("Error occurred. Please try again later.");
          setShowMessage(true);
        }
      );

    setTimeout(() => setShowMessage(false), 5000);
  };

  return (
    <div className="relative flex items-center justify-center w-full min-h-screen text-gray-300 bg-center bg-cover bg-gradient-to-br from-gray-800 to-gray-950">
      {/* Background with animated grid and spaced "waitlist" text */}
      <div className="absolute top-0 left-0 w-full h-full z-9">
        <div className="absolute top-0 left-0 z-10 w-full h-full pointer-events-none">
          <ReactTyped
            strings={[
              "waitlist",
              "waitlist waitlist",
              "waitlist waitlist waitlist",
              "waitlist waitlist waitlist waitlist",
              "waitlist waitlist waitlist waitlist waitlist",
              "waitlist waitlist waitlist waitlist waitlist waitlist",
              "waitlist waitlist waitlist waitlist waitlist waitlist waitlist",
              "waitlist waitlist waitlist waitlist waitlist waitlist waitlist waitlist",
            ]}
            typeSpeed={10}
            backSpeed={50}
            backDelay={80}
            loop
            className="text-3xl font-bold opacity-5 text-gray-300 sm:text-5xl md:text-[12rem] lg:text-[15rem] text-center"
          />
        </div>
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 flex flex-col items-center justify-center h-full max-w-screen-xl px-4 mx-auto text-center"
      >
        <h1 className="text-4xl font-extrabold tracking-tighter sm:text-6xl md:text-7xl">
          Subscribe to our{" "}
          <span className="font-black text-transparent gradient-text animate-gradient ">
            Newsletter.
          </span>
        </h1>
        <p className="mt-4 text-lg font-light text-gray-300 sm:text-xl md:text-2xl">
          Get the latest updates on new features, product launches, and expert
          tips for mastering quantitative skills.
        </p>
        <form
          ref={form}
          onSubmit={handleSubmit}
          className="flex flex-row items-center w-full gap-6 mt-8"
        >
          <input
            type="email"
            name="user_email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Enter your email"
            className="w-full px-4 py-3 text-white placeholder-gray-400 bg-gray-800 border-gray-600 rounded-lg shadow-sm outline-none font-extralight focus:border-2 focus:border-green-600 focus:bg-gray-950"
            required
          />
          <motion.button
            type="submit"
            className="w-auto px-4 py-2 text-lg font-bold text-black bg-green-400 border-2 border-green-400 rounded-lg shadow-lg hover:text-green-400 whitespace-nowrap hover:bg-black"
          >
            Subscribe Now
          </motion.button>
        </form>
        {showMessage && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mt-6 text-lg text-green-400"
          >
            {message}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
};

export default Waitlist;
