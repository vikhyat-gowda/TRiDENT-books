import { storage } from "../backend/config";
import { ref, deleteObject } from "@firebase/storage";

export const deletefile = async (bookInfo) => {
  if (bookInfo.hasOwnProperty("epubFileRef")) {
    const bookRef = ref(storage, bookInfo.epubFileRef);

    deleteObject(bookRef).then(() => {
      console.log("file successfully deleted");
    });
  }
};
