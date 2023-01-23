import { useState } from "react";
import { db, auth, storage } from "../backend/config";
import { deleteDoc, doc } from "@firebase/firestore";
import { deleteObject, ref } from "@firebase/storage";

const useDeleteBook = () => {
  const [loading, setLoading] = useState(false);

  const execute = async (book) => {
    setLoading(true);
    if (book.hasOwnProperty("epubFileRef")) {
      const bookRef = await ref(storage, book.epubFileRef);
      deleteObject(bookRef).then(() => {
        console.log("file successfully deleted");
      });
    }

    const bookdbRef = doc(
      db,
      `Library/${auth.currentUser.uid}/books/${book.id}`
    );
    await deleteDoc(bookdbRef)
      .then(() => {
        console.log("file deleted");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return [execute, loading];
};

export default useDeleteBook;
