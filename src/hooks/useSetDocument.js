import { setDoc, doc } from "@firebase/firestore";
import { useState } from "react";
import { db } from "../backend/config";

const useSetDocument = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const checkObject = (obj) => {
    for (var key in obj) {
      if (obj[key] === undefined) {
        obj[key] = 0;
      }
    }
    return obj;
  };

  const execute = async (path, payload) => {
    const filterdPayload = checkObject(payload);
    setLoading(true);
    const pathRef = await doc(db, path);
    await setDoc(pathRef, filterdPayload)
      .then(() => {
        console.log("written to db");
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return [execute, loading, error];
};

export default useSetDocument;
