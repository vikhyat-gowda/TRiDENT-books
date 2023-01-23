import React, { useState } from "react";
import { BsGoogle, BsMicrosoft, BsTwitter } from "react-icons/bs";
import { auth } from "../../backend/config";
import { User } from "react-feather";
import { Link } from "react-router-dom";
import { authErrors } from "./Errors/ErrorMessages";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import Loading from "../../components/Loading/Loading";
import { authWithGoogle } from "./handleThirdPartyAuth";
import { FcGoogle } from "react-icons/fc";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(auth);

  if (error) {
    console.log(error);
    console.log(user);
  }

  if (loading) {
    return <Loading status={`Authenticating as ${email} `} />;
  }

  return (
    <div className="flex justify-center items-center h-screen max-w-md mx-auto text-lmPrimaryText dark:text-primaryText">
      <div className="px-10 py-5 rounded-lg shadow-2xl bg-lmPrimaryDark dark:bg-primaryLight ">
        <div className="flex flex-col space-y-2 py-3 border-b-2 dark:border-lmPrimaryText ">
          <h4 className="text-xl font-bold text-center">Login</h4>
          <button
            onClick={() => authWithGoogle(true)}
            className="flex py-2 w-full justify-center space-x-2 items-center ring-2 ring-lmPrimaryLight dark:ring-lmPrimaryText font-semibold rounded-md text-lg dark:bg-primaryDark focus:outline-none focus:ring-contrast hover:shadow-md dark:focus:ring-contrast"
          >
            <FcGoogle size={20} />
            <span className="text-sm">Login in with Google</span>
          </button>
        </div>
        <form
          className="flex flex-col py-3 space-y-3 border-b-2 dark:border-lmPrimaryText"
          onSubmit={(e) => {
            e.preventDefault();
            signInWithEmailAndPassword(email, password);
          }}
        >
          <input
            required
            autoFocus
            type="email"
            value={email}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            className="px-2 py-1 border-0 rounded-md ring-2 ring-lmPrimaryLight dark:ring-lmPrimaryText dark:bg-primaryDark text-lmPrimaryText dark:text-primaryText focus:outline-none focus:ring-contrast dark:focus:ring-contrast"
          />
          <input
            required
            type="password"
            value={password}
            minLength="6"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            className="px-2 py-1 border-0 rounded-md ring-2 ring-lmPrimaryLight dark:ring-lmPrimaryText dark:bg-primaryDark text-lmPrimaryText dark:text-primaryText focus:outline-none focus:ring-contrast dark:focus:ring-contrast"
          />
          {error && (
            <p
              className="w-full text-sm dark:text-yellow-300 text-center"
              style={{ maxWidth: "200" + "px" }}
            >
              {authErrors[error.code.substring(5)]}
            </p>
          )}
          <button
            type="submit"
            className="rounded-md font-bold px-2 py-1 bg-contrast text-lmPrimaryDark dark:text-primaryLight focus:outline-none focus:ring focus:ring-contrast  focus:ring-opacity-50  "
          >
            Login
          </button>
        </form>

        <div className="text-center mt-3">
          <p className="text-sm mb-1 font-semibold">Don't have an account?</p>
          <Link
            to="/signup"
            className="text-contrast p-1 rounded-sm font-semibold outline-none focus:ring-2 focus:ring-contrast "
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
