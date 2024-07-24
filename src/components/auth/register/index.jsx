import React, { useState, useEffect, useRef } from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/authContext";
import { doCreateUserWithEmailAndPassword } from "../../../firebase/auth";
import { gsap } from "gsap";
import { CSSPlugin } from "gsap/CSSPlugin";

gsap.registerPlugin(CSSPlugin);

const Register = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const registerRef = useRef(null);
  const buttonRef = useRef(null);

  const { userLoggedIn, setCurrentUser } = useAuth();

  useEffect(() => {
    gsap.fromTo(
      registerRef.current,
      { opacity: 0, y: -50 },
      { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
    );
    gsap.fromTo(
      buttonRef.current,
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.7)" }
    );
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isRegistering) {
      setIsRegistering(true);
      if (password !== confirmPassword) {
        setErrorMessage("Passwords do not match");
        setIsRegistering(false);
        return;
      }
      try {
        const userCredential = await doCreateUserWithEmailAndPassword(
          email,
          password
        );
        setCurrentUser(userCredential.user);
        // navigate to home page after successful registration
        navigate("/home");
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setIsRegistering(false);
      }
    }
  };

  return (
    <>
      {userLoggedIn && <Navigate to={"/home"} replace={true} />}

      <main className="flex self-center w-full my-auto bg-gray-900 place-content-center place-items-center">
        <div
          ref={registerRef}
          className="p-6 space-y-5 text-gray-300 bg-gray-800 border border-gray-700 shadow-xl w-96 rounded-xl"
        >
          <div className="mb-6 text-center">
            <div className="mt-2">
              <h3 className="text-xl font-semibold text-gray-100 sm:text-2xl">
                Create a New Account
              </h3>
            </div>
          </div>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-bold text-gray-300">Email</label>
              <input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                className="w-full px-3 py-2 mt-2 text-gray-200 transition duration-300 bg-transparent border border-gray-700 rounded-lg shadow-sm outline-none focus:bg-gray-900 focus:border-green-600"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-gray-300">
                Password
              </label>
              <input
                disabled={isRegistering}
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                className="w-full px-3 py-2 mt-2 text-gray-200 transition duration-300 bg-transparent border border-gray-700 rounded-lg shadow-sm outline-none focus:bg-gray-900 focus:border-green-600"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-gray-300">
                Confirm Password
              </label>
              <input
                disabled={isRegistering}
                type="password"
                autoComplete="off"
                required
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                }}
                className="w-full px-3 py-2 mt-2 text-gray-200 transition duration-300 bg-transparent border border-gray-700 rounded-lg shadow-sm outline-none focus:bg-gray-900 focus:border-green-600"
              />
            </div>

            {errorMessage && (
              <span className="font-bold text-red-600">{errorMessage}</span>
            )}

            <button
              ref={buttonRef}
              type="submit"
              disabled={isRegistering}
              className={`w-full px-4 py-2 text-white font-medium rounded-lg ${
                isRegistering
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-green-400 hover:bg-green-500 hover:shadow-xl transition duration-300"
              }`}
            >
              {isRegistering ? "Signing Up..." : "Sign Up"}
            </button>
            <div className="text-sm text-center">
              Already have an account?{" "}
              <Link
                to={"/login"}
                className="text-sm font-bold text-center text-green-400 hover:underline"
              >
                Continue
              </Link>
            </div>
          </form>
        </div>
      </main>
    </>
  );
};

export default Register;
