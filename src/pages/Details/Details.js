import React, { useState, useMemo } from "react";
import Loading from "../../components/Loading/Loading";
import useUploadBook from "../../hooks/useUploadBook";
import ReactHtmlParser from "react-html-parser";
import StarRatingComponent from "react-star-rating-component";
import { db, auth } from "../../backend/config";
import { toast } from "react-toastify";
import { Home, ArrowLeft } from "react-feather";
import { Link, useParams } from "react-router-dom";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { doc } from "@firebase/firestore";

export default function Details() {
  let { bookId } = useParams();
  const [uploadFile, setUploadFile] = useState();
  const [bookData, setBookData] = useState();
  const [uploadEbook] = useUploadBook();
  const [userBookInfo, loadingUserBookInfo, errorUserBookInfo] =
    useDocumentData(doc(db, "Library", auth.currentUser.uid, "books", bookId));
  useMemo(async () => {
    const res = await fetch(
      "https://www.googleapis.com/books/v1/volumes/" + bookId
    );
    const data = await res.json();

    setBookData(data);
  }, [bookId]);

  if (!bookData || loadingUserBookInfo) {
    return <Loading status={"Loading More Info"} />;
  }

  if (errorUserBookInfo) {
    console.log("HI", errorUserBookInfo.code);
  }

  try {
    return (
      <>
        <div className="p-10 flex justify-between">
          <Link to={-1}>
            <ArrowLeft color="#FC687B" size={35} />
          </Link>
          <h4 className=" text-3xl font-semibold text-center text-lmPrimaryText dark:text-primaryText">
            More Info
          </h4>
          <Link to="/">
            <Home color="#FC687B" size={35} />
          </Link>
        </div>
        <div className="flex justify-center p-10 flex-col md:flex-row align-middle">
          {bookData.volumeInfo.imageLinks !== undefined && (
            <img
              src={bookData.volumeInfo.imageLinks.thumbnail.replace(
                "&edge=curl",
                ""
              )}
              alt={bookData.volumeInfo.title}
              className="object-contain w-1/4  mx-auto md:mx-0"
            />
          )}
          <div className="text-lmPrimaryText dark:text-primaryText md:ml-20 ">
            {userBookInfo !== undefined ? (
              <h5 className="text-3xl ">{userBookInfo.title}</h5>
            ) : (
              <h5 className="text-3xl ">{bookData.volumeInfo.title}</h5>
            )}

            <span className="mb-3">
              {bookData.volumeInfo.authors &&
                bookData.volumeInfo.authors.map((author) => (
                  <h6 key={author} className="">
                    By {author}
                  </h6>
                ))}
            </span>

            <div className="flex items-center my-1">
              <StarRatingComponent
                name="rate2"
                starCount={5}
                value={
                  userBookInfo !== undefined
                    ? userBookInfo.averageRating
                    : bookData.volumeInfo.averageRating
                }
              />
              <span className=" text-xs ml-1 text-lmPrimaryText dark:text-white">
                {bookData.volumeInfo.ratingsCount}
              </span>
            </div>

            <div>
              {bookData.volumeInfo.categories &&
                bookData.volumeInfo.categories.map((categorie) => (
                  <p key={categorie}>{categorie}</p>
                ))}
            </div>

            <div
              className="grid grid-cols-1 sm:grid-cols-2 my-3"
              style={{ width: "600" + "px" }}
            >
              {userBookInfo !== undefined && (
                <div>
                  <p>
                    <b> Series:</b> {userBookInfo.series} #{userBookInfo.index}
                  </p>
                </div>
              )}
              <div className="">
                <p>
                  <b>Author: </b> {bookData.volumeInfo.authors[0]}
                </p>
              </div>
              {userBookInfo !== undefined && (
                <div>
                  <p>
                    <b>Page Count:</b> {userBookInfo.pageCount}
                  </p>
                </div>
              )}
              <div>
                <p>
                  <b>Publisher:</b> {bookData.volumeInfo.publisher}
                </p>
              </div>
              <div>
                <p>
                  <b>Release Date:</b> {bookData.volumeInfo.publishedDate}
                </p>
              </div>
              <div>
                <p>
                  <b>Google Books Id:</b> #{bookData.id}
                </p>
              </div>
              <div>
                <p>
                  <b>ISBN 10:</b>
                  {" #"}
                  {
                    bookData.volumeInfo.industryIdentifiers.find((ojb) => {
                      return (ojb.type = "ISBN_10");
                    }).identifier
                  }
                </p>
              </div>
              <div>
                <p>
                  <b>ISBN 13:</b>
                  {" #"}
                  {
                    bookData.volumeInfo.industryIdentifiers.find((ojb) => {
                      return (ojb.type = "ISBN_13");
                    }).identifier
                  }
                </p>
              </div>
              {userBookInfo !== undefined && (
                <div>
                  <p>
                    <b>Format:</b> {userBookInfo.format}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-5 md:w-full text-justify">
              {ReactHtmlParser(bookData.volumeInfo.description)}
            </div>
          </div>
        </div>

        {userBookInfo !== undefined ? (
          <div className="px-5">
            {userBookInfo.hasOwnProperty("epubDownloadUrl") ? (
              <h5 className="text-secondary font-bold text-2xl underline">
                <a href={userBookInfo.epubDownloadUrl}> Download Epub</a>
              </h5>
            ) : (
              <>
                <h5 className="dark:text-primaryText font-bold text-2xl underline">
                  Upload Ebook
                </h5>
                <div className="m-2">
                  <label
                    htmlFor="epub"
                    accept=".epub"
                    className="dark:text-primaryText font-semibold text-lg"
                  >
                    Epub:
                  </label>
                  <input
                    type="file"
                    name="epub"
                    accept=".epub"
                    className="ml-4 dark:text-primaryText"
                    onChange={(e) => {
                      setUploadFile(e.target.files[0]);
                    }}
                  />
                  <button
                    onClick={() => {
                      if (!uploadFile) {
                        console.log("please select file");
                        toast.error("Please select a file", {
                          position: "bottom-right",
                          autoClose: 5000,
                          hideProgressBar: true,
                          closeOnClick: true,
                          pauseOnHover: true,
                          draggable: true,
                          progress: undefined,
                          theme: "dark",
                        });
                      } else if (
                        uploadFile &&
                        uploadFile.type === "application/epub+zip"
                      ) {
                        console.log(uploadFile);
                        uploadEbook(
                          `ebooks/${auth.currentUser.uid}/${userBookInfo.series}/epub/${userBookInfo.authors[0]} - [${userBookInfo.series} ${userBookInfo.index}] - ${userBookInfo.title}.epub`,
                          uploadFile,
                          `Library/${auth.currentUser.uid}/books/${bookId}`,
                          "epubDownloadUrl",
                          "epubFileRef"
                        );
                      } else {
                        toast.error("Only epub formats are allowed", {
                          position: "bottom-right",
                          autoClose: 5000,
                          hideProgressBar: true,
                          closeOnClick: true,
                          pauseOnHover: true,
                          draggable: true,
                          progress: undefined,
                          theme: "dark",
                        });
                      }
                    }}
                    className="border-2 border-secondary p-2 rounded-lg bg-secondary dark:text-primaryDark dark:text-primaryDark uppercase font-bold dark:hover:bg-primaryDark dark:hover:text-secondary"
                  >
                    Upload
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          ""
        )}
      </>
    );
  } catch (error) {
    console.log(error);
    return (
      <div className="text-lmPrimaryText dark:text-primaryText">
        There seems and error
      </div>
    );
  }
}
