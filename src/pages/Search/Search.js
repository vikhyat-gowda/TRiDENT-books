import React, { useState, useEffect } from "react";
import Loading from "../../components/Loading/Loading";
import ResultCards from "./partials/ResultCards";
import { db, auth } from "../../backend/config";
import { collection } from "@firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useParams } from "react-router-dom";

export default function Search() {
  let { seriesName } = useParams();
  const prevQuery = localStorage.getItem("tempQuery");
  const [searchResults, setsearchResults] = useState();
  const [queryText, setQueryText] = useState(prevQuery ? prevQuery : "");
  const [selectedSeries, setSelectedSeries] = useState(seriesName);
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState("Completed");
  const [seriesList, loadingSeriesListt, errorSeriesList] = useCollectionData(
    collection(db, "Library", auth.currentUser.uid, "SeriesList"),
    {
      idField: "id",
    }
  );

  useEffect(() => {
    const getBookList = async () => {
      let res = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${queryText.replace(
          /\s/g,
          "+"
        )}&startIndex=0&maxResults=18`
      );
      const data = await res.json();
      console.log(data);
      setsearchResults(data.items);
    };

    if (queryText.length > 0) {
      getBookList();
    } else {
      setsearchResults();
    }
  }, [queryText]);

  if (loadingSeriesListt) {
    return <Loading status={"Initilizing Books Database"} />;
  }

  if (errorSeriesList) {
    return (
      <div className="text-primaryText">
        Fatal Error {errorSeriesList.message}
      </div>
    );
  }

  console.log(selectedSeries, selectedIndex, selectedStatus);

  return (
    <div>
      <div className="py-10 bg-loginBack4 flex flex-col items-center justify-center bg-center		 ">
        <div className="flex flex-col items-center min-w-min max-w-md justify-center space-y-2 w-1/2 p-2 rounded-md shadow-2xl">
          <input
            type="search"
            autoFocus
            value={queryText}
            placeholder="Search by Title, Author, ISBN.."
            onChange={(e) => setQueryText(e.target.value)}
            className="border border-primaryText overflow-hidden w-full rounded-md dark:bg-lmPrimaryLight "
          />
          {/* Options flex */}
          <div className="flex flex-col justify-center items-center sm:flex-row space-x-2 w-full">
            <div className="flex flex-col">
              <label htmlFor="defaultStatus" className="text-lmPrimaryDark ">
                Status
              </label>
              <select
                name="defaultStatus"
                id="defaultStatus"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="border border-primaryText rounded-md py-1 dark:bg-lmPrimaryLight"
              >
                <option value="Reading">Reading</option>
                <option value="Completed">Completed</option>
                <option value="Waiting">Waiting</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label htmlFor="defaultSeries" className="text-lmPrimaryDark">
                Series
              </label>
              <select
                name="defaultSeries"
                value={selectedSeries}
                onChange={(e) => setSelectedSeries(e.target.value)}
                id="defaultSeries"
                className="border border-primaryText rounded-md py-1 dark:bg-lmPrimaryLight"
              >
                {seriesList.map((item) => (
                  <option key={item.id} value={item.Name}>
                    {item.Name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col w-14">
              <label htmlFor="defaultIndex" className="text-lmPrimaryDark">
                Index
              </label>
              <input
                name="defaultIndex"
                defaultValue="1"
                type="number"
                id="defaultIndex"
                min="0"
                value={selectedIndex}
                onChange={(e) => {
                  setSelectedIndex(parseInt(e.target.value, 10));
                }}
                className="border border-primaryText rounded-md py-1 w-full dark:bg-lmPrimaryLight"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="dark:bg-primaryLight p-3 m-3 flex justify-around flex-wrap">
        {searchResults &&
          searchResults.map((book) => (
            <ResultCards
              book={book}
              setSelectedIndex={setSelectedIndex}
              selectedIndex={selectedIndex}
              selectedSeries={selectedSeries}
              selectedStatus={selectedStatus}
              queryText={queryText}
            />
          ))}
      </div>
    </div>
  );

  // return (
  //   <React.Fragment>
  //     <div className="p-5 ">
  //       <div className="flex justify-center items-center ">
  //         <input
  //           type="search"
  //           autoFocus
  //           value={queryText}
  //           placeholder="Search by Title, Author, ISBN.."
  //           onChange={(e) => setQueryText(e.target.value)}
  //           className="border-0 focus:ring-secondary bg-lmPrimaryDark dark:bg-primaryLight text-lg w-8/12 text-lmPrimaryText dark:text-primaryText outline-none p-3 rounded-md shadow-sm hover:shadow-md focus:shadow-md"
  //         />
  //       </div>

  //       <div className="flex justify-around mt-4 text-lmPrimaryText dark:text-primaryText w-1/2 mx-auto ">
  //         <div className="mx-1">
  //           <label className="font-bold text-secondary" htmlFor="status">
  //             Status
  //           </label>
  //           <select
  //             name="status"
  //             id="status"
  //             className="border-0  focus:ring-secondary bg-lmPrimaryDark dark:bg-primaryLight p-1 w-32 rounded-md ml-1"
  //             value={selectedStatus}
  //             onChange={(e) => {
  //               setSelectedStatus(e.target.value);
  //             }}
  //           >
  //             <option value="Reading">Reading</option>
  //             <option value="Completed">Completed</option>
  //             <option value="Waiting">Waiting</option>
  //           </select>
  //         </div>
  //         <div className="mx-1">
  //           <label className="font-bold text-secondary" htmlFor="series">
  //             Series
  //           </label>
  //           <select
  //             name="series"
  //             id="series"
  //             className="border-0  focus:ring-secondary bg-lmPrimaryDark dark:bg-primaryLight p-1 w-32 rounded-md ml-1"
  //             value={selectedSeries}
  //             onChange={(e) => {
  //               setSelectedSeries(e.target.value);
  //             }}
  //           >
  //             {!loadingSeriesListt &&
  //               seriesList.map((item) => (
  //                 <option key={item.id} value={item.Name}>
  //                   {item.Name}
  //                 </option>
  //               ))}
  //           </select>
  //         </div>
  //         <div className="mx-1">
  //           <label className="font-bold text-secondary" htmlFor="index">
  //             Index
  //           </label>
  //           <input
  //             name="index"
  //             id="index"
  //             type="number"
  //             min={1}
  //             className="border-0  focus:ring-secondary bg-lmPrimaryDark dark:bg-primaryLight p-1 w-14 rounded-md ml-1 text-center"
  //             value={selectedIndex}
  //             onChange={(e) => {
  //               setSelectedIndex(parseInt(e.target.value, 10));
  //             }}
  //           />
  //         </div>
  //       </div>
  //     </div>

  //     <div className="dark:bg-primaryLight p-3 m-3 flex justify-around flex-wrap">
  //       {searchResults &&
  //         searchResults.map((book) => (
  //           <ResultCards
  //             book={book}
  //             setSelectedIndex={setSelectedIndex}
  //             selectedIndex={selectedIndex}
  //             selectedSeries={selectedSeries}
  //             selectedStatus={selectedStatus}
  //             queryText={queryText}
  //           />
  //         ))}
  //     </div>
  //   </React.Fragment>
  // );
}
