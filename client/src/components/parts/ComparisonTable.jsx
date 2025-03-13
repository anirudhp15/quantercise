import React from "react";
import { TbCheck, TbX } from "react-icons/tb";
import "../../index.css"; // Adjust the path according to your folder structure
import { useNavigate } from "react-router-dom";

const ComparisonTable = () => {
  const navigate = useNavigate();

  const features = [
    "Access to all 150+ industry-used questions",
    "Assistive hints for each question",
    "Basic progress tracking",
    "Detailed solution walkthroughs",
    "Advanced progress analytics",
    "Applications tracking dashboard",
    "Follow-up questions for each problem",
    "Priority support",
    "Save 17% compared to monthly plans",
    "Yearly access with one-time payment",
  ];

  const plans = {
    Sharpe: {
      monthlyPrice: "$4.99 / month",
      yearlyPrice: "$49.99 / year",
      monthlyFeatures: [
        true,
        true,
        true,
        true,
        false,
        false,
        false,
        false,
        false,
        false,
      ],
      yearlyFeatures: [
        true,
        true,
        true,
        true,
        false,
        false,
        false,
        false,
        true,
        true,
      ],
    },
    Pro: {
      monthlyPrice: "$9.99 / month",
      yearlyPrice: "$99.99 / year",
      monthlyFeatures: [
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        false,
        false,
      ],
      yearlyFeatures: [
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
      ],
    },
  };

  const redirectToRegister = () => {
    navigate("/register");
  };

  return (
    <div className="flex relative justify-center items-center min-h-screen text-white bg-gradient-to-b from-black via-gray-800 to-black">
      <div className="absolute top-0 w-full custom-shape-divider-top-1735112865">
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M1200 0L0 0 892.25 114.72 1200 0z"
            className="shape-fill"
          ></path>
        </svg>
      </div>
      <div className="relative z-10 px-4 mx-auto w-full max-w-screen-2xl">
        <h2 className="py-8 ml-8 text-4xl font-black tracking-tighter text-transparent md:text-5xl gradient-text animate-gradient">
          <span className="text-gray-100/75"> Compare</span> All Plans
        </h2>
        <div className="overflow-x-auto">
          <div className="p-8 bg-gray-900 bg-opacity-10 rounded-2xl shadow-2xl backdrop-blur-sm">
            <table className="w-full border-collapse table-auto border-spacing-0">
              <thead>
                <tr className="font-black lg:text-xl">
                  <th className="px-4 text-left border-r-4 border-b-4 border-gray-700">
                    Features
                  </th>
                  <th className="px-4 py-3 text-center border-r-4 border-b-4 border-gray-700">
                    <div>
                      <span className="text-transparent whitespace-nowrap bg-clip-text bg-gradient-to-r from-green-500 to-green-300">
                        Sharpe (Monthly)
                      </span>
                      <div className="flex flex-col gap-4 justify-center items-center mt-4 text-sm font-medium text-gray-400 md:flex-row">
                        <div className="text-sm font-medium text-gray-400">
                          {plans.Sharpe.monthlyPrice}
                        </div>
                        <button
                          onClick={redirectToRegister}
                          className="px-4 py-2 text-sm font-bold text-black whitespace-nowrap bg-green-400 rounded-lg shadow-lg hover:bg-black hover:text-green-400"
                        >
                          Choose Plan
                        </button>
                      </div>
                    </div>
                  </th>
                  <th className="px-4 py-3 text-center border-r-4 border-b-4 border-gray-700">
                    <div>
                      <span className="text-transparent whitespace-nowrap bg-clip-text bg-gradient-to-r from-green-500 to-green-300">
                        Sharpe (Yearly)
                      </span>
                      <div className="flex flex-col gap-4 justify-center items-center mt-4 text-sm font-medium text-gray-400 md:flex-row">
                        <div className="text-sm font-medium text-gray-400">
                          {plans.Sharpe.yearlyPrice}
                        </div>
                        <button
                          onClick={redirectToRegister}
                          className="px-4 py-2 text-sm font-bold text-black whitespace-nowrap bg-green-400 rounded-lg shadow-lg hover:bg-black hover:text-green-400"
                        >
                          Choose Plan
                        </button>
                      </div>
                    </div>
                  </th>
                  <th className="relative px-4 py-3 text-center border-r-4 border-b-4 border-gray-700">
                    <div>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-300">
                        Pro (Monthly)
                      </span>
                      {/* <span className="absolute flex items-center whitespace-nowrap gap-2 top-[-24px] left-1/2 transform -translate-x-1/2 px-3 py-1 text-xs font-semibold text-black bg-gradient-to-r from-yellow-300 to-yellow-600 rounded-full">
                        Most Popular
                        <FaStar className="w-4 h-4 text-black" />
                      </span> */}
                      <div className="flex flex-col gap-4 justify-center items-center mt-4 text-sm font-medium text-gray-400 md:flex-row">
                        <div className="text-sm font-medium text-gray-400">
                          {plans.Pro.monthlyPrice}
                        </div>
                        <button
                          onClick={redirectToRegister}
                          className="px-4 py-2 text-sm font-bold text-black whitespace-nowrap bg-blue-400 rounded-lg shadow-lg hover:bg-black hover:text-blue-400"
                        >
                          Choose Plan
                        </button>
                      </div>
                    </div>
                  </th>
                  <th className="px-4 py-3 text-center border-b-4 border-gray-700">
                    <div>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-300">
                        Pro (Yearly)
                      </span>
                      <div className="flex flex-col gap-4 justify-center items-center mt-4 text-sm font-medium text-gray-400 md:flex-row">
                        <div className="text-sm font-medium text-gray-400">
                          {plans.Pro.yearlyPrice}
                        </div>
                        <button
                          onClick={redirectToRegister}
                          className="px-4 py-2 text-sm font-bold text-black whitespace-nowrap bg-blue-400 rounded-lg shadow-lg hover:bg-black hover:text-blue-400"
                        >
                          Choose Plan
                        </button>
                      </div>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="text-xs sm:text-base">
                {features.map((feature, index) => (
                  <tr
                    key={index}
                    className="whitespace-nowrap even:bg-gray-850"
                  >
                    <td className="px-4 py-3 font-light tracking-wider border-r-4 border-b-4 border-gray-700">
                      {feature}
                    </td>
                    <td className="px-4 py-3 text-xl text-center border-r-4 border-b-4 border-gray-700">
                      {plans.Sharpe.monthlyFeatures[index] ? (
                        <span className="flex justify-center font-bold text-green-400">
                          <TbCheck />
                        </span>
                      ) : (
                        <span className="flex justify-center font-bold text-red-400">
                          <TbX />
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xl text-center border-r-4 border-b-4 border-gray-700">
                      {plans.Sharpe.yearlyFeatures[index] ? (
                        <span className="flex justify-center font-bold text-green-400">
                          <TbCheck />
                        </span>
                      ) : (
                        <span className="flex justify-center font-bold text-red-400">
                          <TbX />
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xl text-center border-r-4 border-b-4 border-gray-700">
                      {plans.Pro.monthlyFeatures[index] ? (
                        <span className="flex justify-center font-bold text-green-400">
                          <TbCheck />
                        </span>
                      ) : (
                        <span className="flex justify-center font-bold text-red-400">
                          <TbX />
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xl text-center border-b-4 border-gray-700">
                      {plans.Pro.yearlyFeatures[index] ? (
                        <span className="flex justify-center font-bold text-green-400">
                          <TbCheck />
                        </span>
                      ) : (
                        <span className="flex justify-center font-bold text-red-400">
                          <TbX />
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonTable;
