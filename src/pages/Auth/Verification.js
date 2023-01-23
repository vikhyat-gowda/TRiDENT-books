import React, { useState } from "react";
import { auth } from "../../backend/config";
import { sendEmailVerification } from "@firebase/auth";

const buttonStyle =
  "p-2 font-semibold uppercase  rounded-md hover:border-0 text-primaryDark  bg-secondary hover:bg-primaryDark hover:text-secondary outline-none drop-shadow-md";

export default function Verification({ name, email }) {
  const emailState = sessionStorage.getItem("isEmailSent");
  const [isClicked, setIsClicked] = useState(
    emailState !== null ? emailState : false
  );

  const handleClick = async () => {
    if (!isClicked) {
      setIsClicked(true);
      sessionStorage.setItem("isEmailSent", true);

      await sendEmailVerification(auth.currentUser)
        .then(() => {
          console.log("email sent");
        })
        .catch((err) => {
          console.log(err);
          setIsClicked(false);
          sessionStorage.setItem("isEmailSent", false);
        });
    }
  };

  return (
    <div className="max-w-md mx-auto p-5 flex justify-center items-center h-screen">
      <div className="bg-primaryLight p-5 rounded-lg drop-shadow-md">
        <h5 className="text-primaryText text-xl font-semibold text-center mb-3">
          One Last Step
        </h5>
        <p className="text-center font-bold text-secondary">
          Verify your email address
        </p>
        <div className="mt-4 text-sm">
          <p className="text-center text-primaryText">
            Welcome to <b> TRiDENT BOOKS</b>
          </p>
          <p className="text-center text-primaryText mt-2">
            Please click the button below to confirm your email address and
            activate your account.
          </p>
        </div>
        {isClicked && (
          <p className="text-green-400 text-center text-sm mt-4">
            Email is sent to {email} <br /> refresh the page after verification
          </p>
        )}
        <div className="flex justify-center mt-4">
          <button
            onClick={handleClick}
            className={
              isClicked === false ? buttonStyle : buttonStyle + " opacity-75"
            }
          >
            confirm email
          </button>
        </div>
      </div>
    </div>
  );
}
