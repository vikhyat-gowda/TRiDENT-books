import { ref, uploadBytesResumable, getDownloadURL } from "@firebase/storage";
import { storage, db } from "../backend/config";
import { toast } from "react-toastify";
import { setDoc, doc } from "@firebase/firestore";

const useUploadBook = () => {
  const uploadFile = async (path, file, dbPath, fileLinkName, fileRef) => {
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);

    toast.promise(uploadTask, {
      pending: "Uploading your Book",
      success: "File Uploaded",
      error: "Something went wrong",
      theme: "Dark",
    });

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
          default:
            console.log("Something is going");
        }
      },
      (error) => {
        console.log(error.code);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          const bookRef = await doc(db, dbPath);
          const url = await downloadURL;
          setDoc(
            bookRef,
            { [fileLinkName]: url, [fileRef]: path },
            { merge: true }
          ).then(() => {
            console.log("book uploaded");
          });
        });
      }
    );
  };

  return [uploadFile];
};

export default useUploadBook;
