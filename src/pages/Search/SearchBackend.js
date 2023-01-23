// import {
//   doc,
//   setDoc,
//   serverTimestamp,
//   collection,
//   onSnapshot,
// } from "firebase/firestore";
// import { db, auth } from "../../backend/config";

export const AddBook = async (
  volumeInfo,
  id,
  selectedSeries,
  selectedIndex,
  selectedStatus
) => {
  const {
    ratingsCount = 1,
    title,
    authors,
    averageRating = 1,
    imageLinks,
    industryIdentifiers,
    publishedDate = 0,
    publisher = "null",
    pageCount = 0,
  } = volumeInfo;

  const libraryRef = await doc(
    db,
    "Library",
    auth.currentUser.uid,
    "books",
    id
  );

  try {
    await setDoc(libraryRef, {
      id,
      title,
      authors,
      booktype: "Physical",
      status: selectedStatus,
      series: selectedSeries,
      pageCount,
      ratingsCount,
      averageRating: averageRating,
      publishedDate,
      publisher,
      imageLinks,
      industryIdentifiers,
      index: selectedIndex,
      createdAt: serverTimestamp(),
    }).then(() => {
      console.log("Added to Library");
    });
  } catch (err) {
    console.log(err);
  }
};

export const getSeriesList = (setSeriesList) => {
  const seriesRef = collection(
    db,
    "Library",
    auth.currentUser.uid,
    "SeriesList"
  );

  const detachSeriesRef = onSnapshot(seriesRef, (querySnapshot) => {
    let tempSeries = [];
    querySnapshot.forEach((doc) => {
      tempSeries.push({ ...doc.data(), id: doc.id });
    });
    setSeriesList(tempSeries);
  });

  return detachSeriesRef;
};
