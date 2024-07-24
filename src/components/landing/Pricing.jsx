import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRightLong } from "react-icons/fa6";
import { Link as ScrollLink, scroller } from "react-scroll";
import axios from "axios";

const Pricing = () => {
  const handleCheckout = async (priceId) => {
    try {
      const response = await axios.post(
        "http://localhost:4242/create-checkout-session",
        {
          priceId,
        }
      );
      if (response.data.url) {
        window.location.href = response.data.url;
      } else {
        console.error("No URL returned from Stripe");
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
    }
  };

  return (
    <div
      id="pricing"
      className="relative min-h-screen p-16 my-auto text-gray-300 lg:p-32"
    >
      <div className="mx-auto text-center">
        <h2 className="relative py-8 text-4xl font-bold text-transparent z-2 md:pb-12 md:text-5xl bg-clip-text bg-gradient-to-r from-green-400 via-blue-500 to-purple-500">
          Pricing Plans
        </h2>
        <p className="relative pb-8 text-lg font-medium text-white z-2 sm:text-xl md:text-2xl">
          Choose the plan that best fits your needs.
        </p>
      </div>
      <div className="flex justify-center">
        <div className="relative z-10 max-w-screen-lg p-8 mt-8 transition-all duration-200 border-2 border-gray-500 sm:w-3/4 lg:w-full bg-gray-950 rounded-3xl hover:border-gray-300">
          <p className="py-2 text-lg font-light text-center sm:text-xl md:text-2xl">
            Get notified when{" "}
            <span className="relative font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
              Quantercise Pro
            </span>{" "}
            goes live for unlimited access to all questions, detailed feedback,
            unlimited hints, and exclusive resources.
          </p>
          <div className="grid gap-8 px-4 mx-auto mt-4 text-center lg:grid-cols-3">
            <div className="relative group">
              <div className="absolute inset-0 z-0 w-full h-full transition-transform duration-200 transform bg-gray-700 rounded-lg shadow-lg"></div>
              <div className="relative z-10 p-6 transition-transform duration-200 transform bg-gray-800 rounded-lg shadow-lg sm:p-6 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:shadow-2xl">
                <h3 className="text-xl font-medium text-green-400 sm:text-md">
                  Starter
                </h3>
                <p className="mt-2 text-3xl font-bold text-gray-300 xl:text-4xl">
                  <span className="text-gray-300">$0</span>
                  <span className="ml-2 text-sm text-gray-300">(free)</span>
                </p>
                <ul className="mt-4 text-xs text-left">
                  <li className="mt-2 text-gray-300">
                    • Access to 10 essential questions
                  </li>
                  <li className="mt-2 text-gray-300">
                    • Basic feedback to get you started
                  </li>
                  <li className="mt-2 text-gray-300">
                    • Limited hints to guide your learning
                  </li>
                  <li className="mt-2 text-gray-300">
                    • No exclusive resources or advanced content
                  </li>
                </ul>
                <ScrollLink
                  to="intro"
                  smooth={true}
                  duration={500}
                  className="inline-block px-4 py-2 mt-6 font-bold text-black transition duration-300 bg-green-400 rounded-xl hover:bg-green-500 hover:text-white hover:shadow-lg group/link hover:cursor-pointer"
                >
                  Get Started
                  <FaArrowRightLong className="inline-block ml-2 group-hover:scale-110 group-hover:-rotate-45 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 group-hover/link:rotate-45 arrow-animation" />
                </ScrollLink>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 z-0 w-full h-full transition-transform duration-200 transform bg-gray-700 rounded-lg shadow-lg"></div>
              <div className="relative z-10 p-6 transition-transform duration-200 transform bg-gray-800 rounded-lg shadow-lg sm:p-6 hover:-translate-y-1 hover:translate-x-1 group-hover:shadow-2xl">
                <h3 className="text-xl font-medium text-blue-400 sm:text-md">
                  Pro (Monthly)
                </h3>
                <p className="mt-2 text-3xl font-bold text-gray-300 xl:text-4xl">
                  <span className="text-gray-300">$4.99</span>
                  <span className="ml-2 text-sm text-gray-300">per month</span>
                </p>
                <ul className="mt-4 text-xs text-left">
                  <li className="mt-2 text-gray-300">
                    • Unlimited access to all questions
                  </li>
                  <li className="mt-2 text-gray-300">
                    • Detailed feedback on every question
                  </li>
                  <li className="mt-2 text-gray-300">• Unlimited hints</li>
                  <li className="mt-2 text-gray-300">
                    • Exclusive resources to boost your learning
                  </li>
                </ul>
                <ScrollLink
                  to="intro"
                  smooth={true}
                  duration={500}
                  className="inline-block px-4 py-2 mt-6 font-bold text-black transition duration-300 bg-blue-400 hover:cursor-pointer rounded-xl hover:bg-blue-500 hover:text-white hover:shadow-lg group/link"
                >
                  Get Started
                  <FaArrowRightLong className="inline-block ml-2 group-hover:scale-110 group-hover:-rotate-45 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 group-hover/link:rotate-45 arrow-animation" />
                </ScrollLink>

                {/* <button
                  onClick={() =>
                    handleCheckout("price_1PfQac2LYK3gCcnX2jnYp8du")
                  }
                  className="inline-block px-4 py-2 mt-6 font-bold text-black transition duration-300 bg-blue-400 rounded-xl hover:bg-blue-500 hover:text-white hover:shadow-lg group/link"
                >
                  Get Started
                  <FaArrowRightLong className="inline-block ml-2 group-hover:scale-110 group-hover:-rotate-45 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 group-hover/link:rotate-45 arrow-animation" />
                </button> */}
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 z-0 w-full h-full transition-transform duration-200 transform bg-gray-700 rounded-lg shadow-lg"></div>
              <div className="relative z-10 p-6 transition-transform duration-200 transform bg-gray-800 rounded-lg shadow-lg sm:p-6 hover:-translate-y-1 hover:translate-x-1 group-hover:shadow-2xl">
                <h3 className="text-xl font-medium text-purple-400 sm:text-md">
                  Pro (Annual)
                </h3>
                <p className="mt-2 text-3xl font-bold text-gray-300 xl:text-4xl">
                  <span className="text-gray-300">$49.99</span>
                  <span className="ml-2 text-sm text-gray-300">per year</span>
                </p>
                <ul className="mt-4 text-xs text-left">
                  <li className="mt-2 text-gray-300">
                    • Unlimited access to all questions
                  </li>
                  <li className="mt-2 text-gray-300">
                    • Detailed feedback and unlimited hints
                  </li>
                  <li className="mt-2 text-gray-300">
                    • Exclusive resources to boost your learning
                  </li>
                  <li className="mt-2 text-gray-300">
                    • Save{" "}
                    <span className="font-bold text-purple-400">17%</span>{" "}
                    compared to monthly plan
                  </li>
                </ul>
                <ScrollLink
                  to="intro"
                  smooth={true}
                  duration={500}
                  className="inline-block px-4 py-2 mt-6 font-bold text-black transition duration-300 bg-purple-400 hover:cursor-pointer rounded-xl hover:bg-purple-500 hover:text-white hover:shadow-lg group/link"
                >
                  Get Started
                  <FaArrowRightLong className="inline-block ml-2 group-hover:scale-110 group-hover:-rotate-45 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 group-hover/link:rotate-45 arrow-animation" />
                </ScrollLink>
                {/* <button
                  onClick={() =>
                    handleCheckout("price_1PfmdZ2LYK3gCcnX8NT8jDok")
                  }
                  className="inline-block px-4 py-2 mt-6 font-bold text-black transition duration-300 bg-purple-400 rounded-xl hover:bg-purple-500 hover:text-white hover:shadow-lg group/link"
                >
                  Get Started
                  <FaArrowRightLong className="inline-block ml-2 group-hover:scale-110 group-hover:-rotate-45 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 group-hover/link:rotate-45 arrow-animation" />
                </button> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
