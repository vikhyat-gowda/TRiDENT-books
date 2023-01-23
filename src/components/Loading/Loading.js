import React from "react";
import ReactLoading from "react-loading";

export default function Loading({ status }) {
  return (
    <div className="h-full min-h-screen w-full bg-lmPrimaryLight dark:bg-primaryDark text-primaryText">
      <div className="flex flex-col justify-center items-center h-screen">
        <ReactLoading type="bars" color="#FC687B" />
        <p className="text-center font-semibold text-lmPrimaryText dark:text-primaryText">
          {status}
        </p>
      </div>
    </div>
  );
}
