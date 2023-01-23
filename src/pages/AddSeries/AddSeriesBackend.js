import { db, auth, storage } from "./../../backend/config";
import { toast } from "react-toastify";
import {
  collection,
  doc,
  getDocs,
  query,
  where,
  writeBatch,
} from "@firebase/firestore";
import { ref, deleteObject } from "@firebase/storage";

export const deleteSeries = async (docid, seriesName) => {
  const batch = writeBatch(db);
  const filterBooks = await query(
    collection(db, "Library", auth.currentUser.uid, "books"),
    where("series", "==", seriesName)
  );
  const querySnapshot = await getDocs(filterBooks);

  batch.delete(doc(db, "Library", auth.currentUser.uid, "SeriesList", docid));

  querySnapshot.forEach(async (documents) => {
    if (documents.data().hasOwnProperty("epubDownloadUrl")) {
      const bookRef = ref(storage, documents.data().epubFileRef);
      deleteObject(bookRef).then(() => {
        console.log("deleted", documents.data().epubFileRef);
      });
    }

    batch.delete(
      doc(db, "Library", auth.currentUser.uid, "books", documents.id)
    );
  });

  // batch.commit().then(() => {
  //   toast.success(`Series "${seriesName}" has been removed from your library`, {
  //     position: "bottom-right",
  //     autoClose: 5000,
  //     hideProgressBar: true,
  //     closeOnClick: true,
  //     pauseOnHover: true,
  //     draggable: true,
  //     progress: undefined,
  //     theme: "dark",
  //   });
  // });

  toast.promise(batch.commit(), {
    pending: {
      render: "Updating You Series",
      theme: "dark",
    },
    success: {
      render: `Removed ${seriesName} Series from your Library`,
      theme: "dark",
    },
    error: {
      render: `Error Could not delete ${seriesName} Series`,
      theme: "dark",
    },
  });
};
