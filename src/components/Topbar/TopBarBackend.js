import { deleteDoc, doc, setDoc } from "@firebase/firestore";
import { auth, db } from "../../backend/config";

const deleteNotifications = async (id) => {
  const notificationRef = doc(db, `Shared/${auth.currentUser.uid}/books/${id}`);
  await deleteDoc(notificationRef);
};

const addBookToLibrary = async (book) => {
  delete book.sentByUid;
  delete book.sentByName;

  const LibraryRef = doc(
    db,
    `Library/${auth.currentUser.uid}/books/${book.docId}`
  );

  setDoc(LibraryRef, {
    ...book,
    series: "Standalone",
    index: 0,
  })
    .then(() => {
      console.log("added to your library");
      deleteNotifications(book.docId);
    })
    .catch((err) => {
      console.log(err);
    });
};

export { deleteNotifications, addBookToLibrary };
