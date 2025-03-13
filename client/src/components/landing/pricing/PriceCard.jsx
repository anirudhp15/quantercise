import React from "react";
import PropTypes from "prop-types";
import { FaArrowRightLong } from "react-icons/fa6";
import { GrValidate } from "react-icons/gr";
import { TbAlertSquareRounded } from "react-icons/tb";

const PriceCard = React.memo(
  ({
    title,
    price,
    period,
    features,
    color,
    hoverColor,
    priceId,
    handleCheckout,
    badgeText,
    isAnnual,
  }) => {
    const isStarter = title === "Starter";

    return (
      <div
        className={`relative group group/card w-full max-w-lg p-6 transition-all duration-100 border-2 bg-gray-950 rounded-lg border-gray-500
      } ${isAnnual ? "scale-[1.00]" : "scale-[0.99]"} ${
          title === "Pro" || title === "Pro Yearly"
            ? "hover:border-blue-400"
            : title === "Starter"
            ? "hover:border-gray-300"
            : "hover:border-green-400"
        }`}
      >
        {badgeText && (
          <div
            className={`absolute top-0 right-0 px-3 py-1 text-xs font-semibold transition-all border-2 duration-100 rounded-tr-sm group-hover:text-black rounded-bl-xl ${
              title === "Pro" || title === "Pro Yearly"
                ? "group-hover:bg-blue-400 border border-t-0 border-r-0 border-gray-500 text-blue-400 group-hover:border-blue-400"
                : title === "Starter"
                ? "group-hover:bg-gray-300 border border-t-0 border-r-0 border-gray-500 text-gray-400 group-hover:border-gray-300"
                : "group-hover:bg-green-400 border border-t-0 border-r-0 border-gray-500 text-green-400 group-hover:border-green-400"
            }`}
          >
            {badgeText}
            {isAnnual && (
              <GrValidate className="inline-block h-4 w-4 mb-[2px] ml-1" />
            )}
            {!isAnnual && (
              <TbAlertSquareRounded className="inline-block h-4 w-4 mb-[2px] ml-1" />
            )}
          </div>
        )}
        <h3
          className={`text-2xl xl:text-4xl transition-all duration-100 font-bold sm:text-md ${color} ${hoverColor}`}
        >
          {title}
        </h3>
        <p className="mt-2 text-3xl font-bold text-gray-300 xl:text-4xl">
          <span className="text-gray-300">{price}</span>
          <span className="ml-1 text-sm text-gray-300">{period}</span>
        </p>
        <div className="mt-4 mb-4 border-t border-gray-700"></div>
        <ul className="mt-4 text-sm text-left">
          {features.map((feature, index) => (
            <li key={index} className="mt-2 text-gray-300">
              • {feature}
            </li>
          ))}
        </ul>
        <div className="mt-4 mb-4 border-t border-gray-700"></div>
        <button
          className={`inline-block w-full px-4 py-2 mt-6 font-bold text-center transition-all duration-100 hover:scale-105 hover:cursor-pointer hover:text-white hover:shadow-lg group ${
            isStarter
              ? "bg-gray-300 text-black hover:bg-gray-500 hover:text-white"
              : title == "Sharpe" || title == "Sharpe Yearly"
              ? "bg-green-400 text-black"
              : "bg-blue-400 text-black"
          }`}
          onClick={() => handleCheckout(priceId)}
        >
          Get Started
          <FaArrowRightLong className="inline-block ml-2 transition-transform duration-300 -rotate-45 group-hover:translate-x-1 group-hover:-translate-y-1" />
        </button>
      </div>
    );
  }
);

PriceCard.propTypes = {
  title: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  period: PropTypes.string.isRequired,
  features: PropTypes.arrayOf(PropTypes.string).isRequired,
  color: PropTypes.string.isRequired,
  priceId: PropTypes.string.isRequired,
  handleCheckout: PropTypes.func.isRequired,
  badgeText: PropTypes.string,
  isAnnual: PropTypes.bool,
};

export default PriceCard;
