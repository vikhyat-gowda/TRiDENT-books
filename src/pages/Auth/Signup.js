import React, { useState, useCallback } from "react";
import Loading from "../../components/Loading/Loading";
import { User } from "react-feather";
import { Link } from "react-router-dom";
import { auth, db } from "../../backend/config";
import { authErrors } from "./Errors/ErrorMessages";
import {
  doc,
  serverTimestamp,
  setDoc,
  addDoc,
  collection,
} from "@firebase/firestore";
import { updateProfile, createUserWithEmailAndPassword } from "@firebase/auth";
import { authWithGoogle } from "./handleThirdPartyAuth";
import { FcGoogle } from "react-icons/fc";

export default function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const handleSubmit = useCallback(async () => {
    setLoading(true);
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCred) => {
        //create a copy in users collection
        return setDoc(doc(db, "Users", userCred.user.uid), {
          firstName,
          lastName,
          email,
          createdAt: serverTimestamp(),
        });
      })
      .then(() => {
        //setting display name
        console.log("created standalone");
        return updateProfile(auth.currentUser, {
          displayName: `${firstName} ${lastName}`,
        });
      })
      .then(() => {
        console.log("updated display name");
        return addDoc(
          collection(db, "Library", auth.currentUser.uid, "SeriesList"),
          {
            Name: "Standalone",
          }
        );
      })
      .then(() => {
        console.log("initial setup completed");
      })
      .catch((e) => {
        setError(e.code);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [firstName, lastName, email, password]);

  if (loading) {
    return <Loading status={`Welcome to TRiDENT Books ${firstName}`} />;
  }

  return (
    <div className="flex justify-center items-center h-screen max-w-md mx-auto text-lmPrimaryText dark:text-primaryText">
      <div className="px-10 py-5 rounded-lg drop-shadow-md bg-lmPrimaryDark dark:bg-primaryLight">
        <div className="border-b-2 dark:border-lmPrimaryText ">
          <h4 className="text-xl font-bold text-center">Sign up</h4>
          <button
            onClick={() => authWithGoogle()}
            className="flex py-2 w-full justify-center space-x-2 items-center ring-2 ring-lmPrimaryLight dark:ring-lmPrimaryText p-1 font-semibold my-4 rounded-md text-lg dark:bg-primaryDark focus:outline-none focus:ring-contrast hover:shadow-md dark:focus:ring-contrast"
          >
            <FcGoogle size={20} />
            <span className="text-sm">Sign up with Google</span>
          </button>
        </div>
        <form
          className="flex flex-col py-3 space-y-3 border-b-2 dark:border-lmPrimaryText"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <input
            autoFocus
            required
            minLength="3"
            type="text"
            value={firstName}
            placeholder="First Name"
            onChange={(e) => setFirstName(e.target.value)}
            className="px-2 py-1 border-0 rounded-md ring-2 ring-lmPrimaryLight dark:ring-lmPrimaryText dark:bg-primaryDark text-lmPrimaryText dark:text-primaryText focus:outline-none focus:ring-contrast dark:focus:ring-contrast"
          />
          <input
            required
            type="text"
            minLength="3"
            value={lastName}
            placeholder="Last Name"
            onChange={(e) => setLastName(e.target.value)}
            className="px-2 py-1 border-0 rounded-md ring-2 ring-lmPrimaryLight dark:ring-lmPrimaryText dark:bg-primaryDark text-lmPrimaryText dark:text-primaryText focus:outline-none focus:ring-contrast dark:focus:ring-contrast"
          />
          <input
            required
            type="email"
            value={email}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            className="px-2 py-1 border-0 rounded-md ring-2 ring-lmPrimaryLight dark:ring-lmPrimaryText dark:bg-primaryDark text-lmPrimaryText dark:text-primaryText focus:outline-none focus:ring-contrast dark:focus:ring-contrast"
          />
          <input
            required
            type="password"
            minLength="8"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            className="px-2 py-1 border-0 rounded-md ring-2 ring-lmPrimaryLight dark:ring-lmPrimaryText dark:bg-primaryDark text-lmPrimaryText dark:text-primaryText focus:outline-none focus:ring-contrast dark:focus:ring-contrast"
          />
          {error && (
            <p className="text-yellow-300 text-justify mb-2">
              {authErrors[error.code.substring(5)]}
            </p>
          )}
          <button
            type="submit"
            className="rounded-md font-bold px-2 py-1 bg-contrast text-lmPrimaryDark dark:text-primaryLight focus:outline-none focus:ring focus:ring-contrast  focus:ring-opacity-50  "
          >
            SignUp
          </button>
        </form>

        {/* <button
          onClick={() => authWithGoogle(true)}
          className="flex items-center space-x-2 p-2 font-semibold mt-3 text-black dark:text-primaryText rounded-md shadow-sm text-lg bg-lmPrimaryLight dark:bg-primaryDark hover:shadow-lg p-"
        >
          <FcGoogle />
          <span>Sign In With Google</span>
        </button> */}
        <div className="text-center mt-3">
          <p className="text-sm mb-1 font-semibold">Already have an account?</p>
          <Link
            to={-1}
            className="text-contrast p-1 rounded-sm font-semibold outline-none focus:ring-2 focus:ring-contrast "
          >
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
