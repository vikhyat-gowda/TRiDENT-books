import { useState } from "react";
import { updateDoc, doc } from "@firebase/firestore";
import { toast } from "react-toastify";

const useUpdateDocument = (db, path) => {
  const [loading, setLoading] = useState();
  const [error, setError] = useState();

  const upload = async (payload) => {
    const bookRef = await doc(db, path);
    setLoading(true);
    let getStatus = updateDoc(bookRef, payload)
      .then(() => {})
      .catch((error) => {
        setError(error);
      })
      .finally(() => {
        setLoading(false);
      });

    toast.promise(getStatus, {
      pending: {
        render: "Saving Changes...",
        theme: "dark",
      },
      success: { render: "Changes Saved", theme: "dark" },
      error: { render: "Error Saving", theme: "dark" },
    });
  };

  return [upload, loading, error];
};

export default useUpdateDocument;
