import React, { useState } from "react";
import Loading from "../../components/Loading/Loading";
import useAddDocument from "../../hooks/useAddDocument";
import { db, auth } from "../../backend/config";
import { collection, query, orderBy } from "@firebase/firestore";
import { deleteSeries } from "./AddSeriesBackend";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useNavigate } from "react-router-dom";
import { Trash2, Info } from "react-feather";

export default function AddSeries() {
  const navigate = useNavigate();
  const [seriesName, setSeriesName] = useState("");
  const [seriesList, loadingSeriesList, errorSeriesList] = useCollectionData(
    query(
      collection(db, "Library", auth.currentUser.uid, "SeriesList"),
      orderBy("Name")
    ),
    {
      idField: "id",
    }
  );
  const [addSeries, loadingAddSeries, errorAddSeries] = useAddDocument();

  if (loadingSeriesList) {
    return <Loading status={`Loading your Series`} />;
  }

  if (errorSeriesList || errorAddSeries) {
    return <div className="text-primaryText">Fatal Error</div>;
  }

  return (
    <div>
      <div className="text-center py-14 bg-loginBack2 bg-center">
        <h4 className="text-3xl sm:text-5xl font-bold text-white  blur-2xl ">
          Manage Your Series
        </h4>
      </div>
      <section className="flex  justify-center text-lmPrimaryText dark:text-primaryText ">
        <div className=" w-96 bg-lmPrimaryDark dark:bg-primaryLight p-2 mt-4 shadow-lg rounded-md">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addSeries("Library/" + auth.currentUser.uid + "/SeriesList", {
                Name: seriesName,
              });
              setSeriesName("");
            }}
            className="flex justify-around space-x-2 py-2 border-b-2 dark:border-lmTableDivider "
          >
            <input
              type="text"
              id="seriesText"
              minLength="3"
              autoComplete="off"
              value={seriesName}
              onChange={(e) => setSeriesName(e.target.value)}
              placeholder="Create Series"
              className="py-1 border-primaryText dark:border-lmTableDivider dark:bg-primaryLight rounded-md focus:outline-none focus:ring-contrast dark:focus:ring-contrast"
            />
            <button
              type="submit"
              className="py-1 px-2 rounded-md bg-contrast text-white  focus:outline-none focus:ring focus:ring-contrast  focus:ring-opacity-50"
            >
              Create
            </button>
          </form>
          <div className="py-2 mx-1">
            <ul className="divide-y dark:divide-lmTableDivider  ">
              {seriesList.map((series, id) => (
                <li
                  onClick={() => navigate("/series%3A" + series.Name)}
                  key={series.id}
                  className="font-bold text-lg py-1 cursor-pointer"
                >
                  <p className="py-1">{series.Name}</p>
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="flex justify-around space-x-2 text-sm"
                  >
                    <button
                      onClick={() => navigate("/search/" + series.Name)}
                      className=" uppercase bg-contrast w-full py-1 rounded-md text-white  focus:outline-none focus:ring focus:ring-contrast  focus:ring-opacity-50"
                    >
                      Add Book
                    </button>
                    <button
                      onClick={() => deleteSeries(series.id, series.Name)}
                      className="uppercase bg-contrast w-full py-1 rounded-md text-white  focus:outline-none focus:ring focus:ring-contrast  focus:ring-opacity-50"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );

  // return (
  //   <>
  //     <div className="p-5">
  //       <div className="flex justify-center m-3">
  //         <h4 className=" text-3xl font-semibold text-center text-lmPrimaryText dark:text-primaryText">
  //           Manage your Series
  //         </h4>
  //       </div>

  //       <div className="p-2 max-w-md mx-auto mt-5 rounded-lg drop-shadow-lg flex flex-col bg-lmPrimaryDark dark:bg-primaryLight">
  //         <form
  //           className="my-2 flex justify-around"
  //           onSubmit={(e) => {
  //             e.preventDefault();
  //             addSeries("Library/" + auth.currentUser.uid + "/SeriesList", {
  //               Name: seriesName,
  //             });
  //           }}
  //         >
  //           <input
  //             required
  //             type="text"
  //             minLength="3"
  //             id="addseries"
  //             name="seriesName"
  //             value={seriesName}
  //             autoComplete="off"
  //             onChange={(e) => {
  //               setSeriesName(e.target.value);
  //             }}
  //             placeholder="Create A New Series"
  //             className="p-1 rounded outline-none bg-lmPrimaryLight dark:bg-primaryDark text-lmPrimaryText dark:text-primaryText"
  //           />
  //           <button
  //             type="submit"
  //             className="border-2 border-secondary p-2 rounded-md text-secondary font-bold hover:border-0 hover:text-lmPrimaryText hover:bg-secondary"
  //           >
  //             Add series
  //           </button>
  //         </form>

  //         <h5 className="text-2xl font-semibold text-center mb-2 text-lmPrimaryText dark:text-primaryText">
  //           Current Series
  //         </h5>
  //         <ul className="text-primaryText">
  //           {seriesList &&
  //             seriesList.map((series) => (
  //               <li
  //                 key={series.id}
  //                 className="my-2 flex justify-between max-w-md mx-auto p-3 rounded drop-shadow-lg bg-lmPrimaryLight dark:bg-primaryDark text-lmPrimaryText dark:text-primaryText"
  //               >
  //                 <div
  //                   className="cursor-pointer"
  //                   onClick={() => {
  //                     navigate("/series%3A" + series.Name);
  //                   }}
  //                 >
  //                   <p className="font-semibold text-lg">{series.Name}</p>
  //                 </div>
  //                 <div className="flex space-x-2">
  //                   <button
  //                     className="text-sm border-secondary border-2 p-1 rounded-md font-bold text-secondary hover:border-0 hover:text-primaryDark hover:bg-secondary"
  //                     onClick={() => {
  //                       navigate("/search/" + series.Name);
  //                     }}
  //                   >
  //                     Add Books
  //                   </button>

  //                   {series.Name === "Standalone" ? (
  //                     ""
  //                   ) : (
  //                     <div
  //                       className="p-1 cursor-pointer"
  //                       onClick={() => {
  //                         deleteSeries(series.id, series.Name);
  //                       }}
  //                     >
  //                       <Trash2 color="#FC687B" />
  //                     </div>
  //                   )}
  //                 </div>
  //               </li>
  //             ))}
  //         </ul>
  //         <div className="flex mx-4 text-center text-sm text-yellow-700 dark:text-yellow-300 ">
  //           <Info size="25" />
  //           <span className="">
  //             Deleting series will result in deleteing all books belonging to
  //             that series
  //           </span>
  //         </div>
  //       </div>
  //     </div>
  //   </>
  // );
}
