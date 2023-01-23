import React from "react";
import useSetDocument from "../../../hooks/useSetDocument";
import StarRatingComponent from "react-star-rating-component";
import { auth } from "../../../backend/config";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { serverTimestamp } from "@firebase/firestore";
import "react-toastify/dist/ReactToastify.css";

export default function ResultCards({
  book,
  setSelectedIndex,
  selectedIndex,
  selectedSeries,
  selectedStatus,
  queryText,
}) {
  const navigate = useNavigate();
  const [addBooks, loadingAddBook, errorAddbook] = useSetDocument();

  // if (loadingAddBook) {
  //   return (
  //     <div className="bg-primaryDark h-full min-h-screen w-full text-primaryText">
  //       <div className="flex justify-around items-center h-screen">
  //         <ReactLoading type="bars" color="#FC687B" />
  //       </div>
  //     </div>
  //   );
  // }

  if (errorAddbook) {
    console.log(loadingAddBook);
    return (
      <div className=" text-lmPrimaryText dark:text-primaryText">
        Fatal Error {errorAddbook.message}
      </div>
    );
  }

  try {
    return (
      <div
        className=" bg-lmPrimaryDark shadow-md dark:bg-primaryDark rounded-md w-72 mb-3 mx-1 flex drop-shadow-lg cursor-pointer overflow-hidden"
        style={{ minHeight: 13 + "rem" }}
        onClick={() => {
          navigate("/details/" + book.id);
          localStorage.setItem("tempQuery", queryText);
        }}
      >
        {book.volumeInfo.imageLinks && (
          <img
            className="w-36 object-cover "
            src={book.volumeInfo.imageLinks.thumbnail.replace("&edge=curl", "")}
            alt=""
          />
        )}
        <div className="p-2 relative">
          <h5 className="font-bold text-lg text-lmPrimaryText dark:text-primaryText ">
            {book.volumeInfo.title.substring(0, 32)}
          </h5>
          <h6 className="uppercase text-xs font-semibold mb-2 text-lmPrimaryText dark:text-primaryText ">
            {book.volumeInfo.authors && book.volumeInfo.authors[0]}
          </h6>

          <div className="flex items-center my-1">
            <StarRatingComponent
              name="rate2"
              starCount={5}
              value={book.volumeInfo.averageRating}
            />
            <span className=" text-xs ml-1 text-lmPrimaryText dark:text-white">
              ({book.volumeInfo.ratingsCount})
            </span>
          </div>
          <div onClick={(e) => e.stopPropagation()}>
            <button
              className="absolute bottom-2 p-2 mt-6 rounded-md border-2 border-secondary text-secondary font-bold hover:bg-secondary hover:text-primaryLight"
              onClick={() => {
                addBooks(`Library/${auth.currentUser.uid}/books/${book.id}`, {
                  id: book.id,
                  booktype: "Physical",
                  format: "Digital",
                  index: selectedIndex,
                  series: selectedSeries,
                  status: selectedStatus,
                  createdAt: serverTimestamp(),
                  title: book.volumeInfo.title,
                  authors: book.volumeInfo.authors,
                  pageCount: book.volumeInfo.pageCount,
                  publisher: book.volumeInfo.publisher,
                  imageLinks: book.volumeInfo.imageLinks,
                  ratingsCount: book.volumeInfo.ratingsCount,
                  averageRating: book.volumeInfo.averageRating,
                  publishedDate: book.volumeInfo.publishedDate,
                  industryIdentifiers: book.volumeInfo.industryIdentifiers,
                });
                toast.success(
                  `Book "${book.volumeInfo.title}" add to your library`,
                  {
                    theme: "dark",
                    autoClose: 5000,
                    draggable: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    progress: undefined,
                    hideProgressBar: true,
                    position: "bottom-right",
                  }
                );

                setSelectedIndex(selectedIndex + 1);
              }}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    );
  } catch (err) {
    console.log(err);
    return <div></div>;
  }
}
