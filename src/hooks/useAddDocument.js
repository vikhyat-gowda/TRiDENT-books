import { addDoc, collection } from "@firebase/firestore";
import { useState } from "react";
import { db } from "../backend/config";

const useAddDocument = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const execute = async (path, payload) => {
    setLoading(true);
    const pathRef = await collection(db, path);
    await addDoc(pathRef, payload)
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

export default useAddDocument;
