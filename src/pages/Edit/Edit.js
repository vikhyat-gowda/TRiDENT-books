import React, { useState, useEffect } from "react";
import Loading from "../../components/Loading/Loading";
import useUpdateDocument from "../../hooks/useUpdateDocument";
import {
  useDocumentData,
  useCollectionData,
} from "react-firebase-hooks/firestore";
import { XCircle } from "react-feather";
import { auth, db } from "../../backend/config";
import { collection, doc } from "@firebase/firestore";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function Edit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [title, setTitle] = useState();
  const [series, setSeries] = useState();
  const [index, setIndex] = useState();
  const [status, setStatus] = useState();
  const [averageRating, setAverageRating] = useState();
  const [format, setFormat] = useState();
  const [bookInfo, loadingBookInfo] = useDocumentData(
    doc(db, "Library", auth.currentUser.uid, "books", id)
  );

  const [seriesList, loadingSeriesList] = useCollectionData(
    collection(db, "Library", auth.currentUser.uid, "SeriesList"),
    {
      idField: "id",
    }
  );

  const [updateBook] = useUpdateDocument(
    db,
    `Library/${auth.currentUser.uid}/books/${id}`
  );

  useEffect(() => {
    if (!loadingBookInfo) {
      setTitle(bookInfo.title);
      setSeries(bookInfo.series);
      setIndex(bookInfo.index);
      setStatus(bookInfo.status);
      setFormat(bookInfo.format);
      setAverageRating(bookInfo.averageRating);
    }
  }, [loadingBookInfo, bookInfo]);

  console.log(title, series, index, status, averageRating, format);

  if (loadingBookInfo || loadingSeriesList) {
    return <Loading status={"Initilizing Edit Page"} />;
  }

  return (
    <section className="m-5 text-lmPrimaryText  dark:text-primaryText bg-lmPrimaryDark dark:bg-formbgDark p-3 rounded-md shadow-md  sm:w-max sm:mx-auto">
      <div className="pb-2 border-b-2 dark:border-primaryText ">
        <h3 className=" font-bold text-3xl">Edit Info</h3>
      </div>
      <div className="flex flex-col mt-2 pb-3 space-x-4 items-center">
        <img
          className="shadow-md rounded"
          src={bookInfo.imageLinks.thumbnail.replace("&edge=curl", "")}
          width="150"
          alt=""
        />
        <form
          onSubmit={(e) => {
            e.preventDefault();
            navigate(-1);
          }}
          className="flex flex-col space-y-3"
        >
          {/* Title Field */}
          <div className="flex flex-col">
            <label htmlFor="title" className=" font-semibold">
              Title
            </label>
            <input
              required
              type="text"
              name="title"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={(e) =>
                e.target.value !== bookInfo.title ? updateBook({ title }) : null
              }
              className="rounded-md py-1 border-lmPrimaryLight dark:bg-primaryDark focus:ring-contrast"
            />
          </div>
          {/* Series and Index Field */}
          <div className="flex flex-row space-x-3 justify-between">
            <div className="flex flex-col">
              <label htmlFor="series" className=" font-semibold">
                Series
              </label>
              <select
                name="series"
                id="series"
                value={series}
                onChange={(e) => {
                  setSeries(e.target.value);
                  return e.target.value !== series
                    ? updateBook({ series: e.target.value })
                    : null;
                }}
                className="rounded-md py-1 border-lmPrimaryLight bg-lmPrimaryDark dark:bg-primaryDark focus:ring-contrast"
              >
                {seriesList.map((series) => (
                  <option key={series.id} value={series.Name}>
                    {series.Name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label htmlFor="index" className=" font-semibold">
                Index
              </label>
              <input
                min={0}
                required
                id="index"
                name="index"
                type="number"
                value={index}
                onChange={(e) => setIndex(e.target.value)}
                onBlur={(e) =>
                  e.target.value !== bookInfo.index
                    ? updateBook({ index })
                    : null
                }
                className="rounded-md py-1 border-lmPrimaryLight bg-lmPrimaryDark dark:bg-primaryDark focus:ring-contrast"
              />
            </div>
          </div>
          {/* Rating Status and Formate Fields */}
          <div className="flex flex-row space-x-3 justify-between">
            <div className="flex flex-col w-full">
              <label htmlFor="ratings" className=" font-semibold">
                Rating
              </label>
              <select
                name="ratings"
                id="ratings"
                value={averageRating}
                onChange={(e) => {
                  setAverageRating(e.target.value);
                  return e.target.value !== averageRating
                    ? updateBook({ averageRating: e.target.value })
                    : null;
                }}
                className="rounded-md py-1 border-lmPrimaryLight bg-lmPrimaryDark dark:bg-primaryDark focus:ring-contrast"
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </div>
            <div className="flex flex-col w-full">
              <label htmlFor="status" className=" font-semibold">
                Status
              </label>
              <select
                name="status"
                id="status"
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  return e.target.value !== status
                    ? updateBook({ status: e.target.value })
                    : null;
                }}
                className="rounded-md py-1 border-lmPrimaryLight bg-lmPrimaryDark dark:bg-primaryDark focus:ring-contrast"
              >
                <option value="Reading">Reading</option>
                <option value="Completed">Completed</option>
                <option value="Waiting">Waiting</option>
              </select>
            </div>
            <div className="flex flex-col w-full">
              <label htmlFor="format" className=" font-semibold">
                Format
              </label>
              <select
                name="format"
                id="format"
                value={format}
                onChange={(e) => {
                  setStatus(e.target.value);
                  return e.target.value !== format
                    ? updateBook({ format: e.target.value })
                    : null;
                }}
                className="rounded-md py-1 border-lmPrimaryLight bg-lmPrimaryDark dark:bg-primaryDark focus:ring-contrast"
              >
                <option value="Hardcover">Hardcover</option>
                <option value="Paperback">Paperback</option>
                <option value="Digital">Digital</option>
              </select>
            </div>
          </div>
          {/* Buttons */}
          <div className="flex flex-row justify-between space-x-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-full outline-none bg-contrast rounded-md px-2 py-1 text-lmPrimaryLight font-semibold uppercase focus:ring focus:ring-contrast  focus:ring-opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full outline-none bg-contrast rounded-md px-2 py-1 text-lmPrimaryLight font-semibold uppercase focus:ring focus:ring-contrast  focus:ring-opacity-50"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
// return (
//   <div className="  h-screen flex justify-center items-center bg-lmPrimaryLight dark:bg-primaryDark">
//     <div className=" rounded-md bg-lmPrimaryDark dark:bg-primaryLight">
//       <div className="m-3 flex justify-between  items-middle">
//         <p className="text-secondary dark:text-yellow-400 font-semibold text-2xl">
//           Edit Books
//         </p>
//         <Link to={-1}>
//           <XCircle color="#FC687B" />
//         </Link>
//       </div>

//       <div className="flex">
//         <div className="m-4">
//           <img src={bookInfo.imageLinks.thumbnail} alt="" />
//         </div>
//         <form
//           className=" flex flex-col justify-around items-center"
//           onSubmit={(e) => {
//             e.preventDefault();
//           }}
//         >
//           <div className="text-primaryText m-2 p-2 flex w-full justify-between items-baseline text-lg">
//             <label htmlFor="title" className="font-bold text-contrast  mr-4">
//               Title
//             </label>
//             <input
//               autoFocus
//               required
//               type="text"
//               name="title"
//               value={title}
//               autoComplete="off"
//               onBlur={(e) => {
//                 if (e.target.value !== bookInfo.title) updateBook({ title });
//               }}
//               onChange={(e) => {
//                 setTitle(e.target.value);
//               }}
//               className="   bg-lmPrimaryLight dark:bg-primaryDark p-1 rounded-md text-lmPrimaryText dark:text-yellow-400 w-full"
//             />
//           </div>
//           <div className="text-primaryText m-2 mr p-2  w-full flex justify-between items-baseline text-lg">
//             <label htmlFor="series" className="font-bold text-contrast mr-4">
//               Series
//             </label>
//             <select
//               name="series"
//               value={series}
//               onBlur={(e) => {
//                 if (e.target.value !== bookInfo.series) {
//                   updateBook({ series });
//                 }
//               }}
//               onChange={(e) => {
//                 setSeries(e.target.value);
//               }}
//               className="   bg-lmPrimaryLight dark:bg-primaryDark p-1 rounded-md text-lmPrimaryText dark:text-yellow-400 w-full"
//             >
//               {seriesList.map((series) => (
//                 <option key={series.id} value={series.Name}>
//                   {series.Name}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div className="text-primaryText m-2 p-2  w-full flex justify-between items-baseline text-lg">
//             <label htmlFor="status" className="font-bold text-contrast mr-4">
//               Status
//             </label>

//             <select
//               name="status"
//               value={status}
//               onBlur={(e) => {
//                 if (e.target.value !== bookInfo.status)
//                   updateBook({ status });
//               }}
//               onChange={(e) => {
//                 setStatus(e.target.value);
//               }}
//               className="   bg-lmPrimaryLight dark:bg-primaryDark p-1 rounded-md text-lmPrimaryText dark:text-yellow-400 w-full"
//             >
//               <option value="Completed">Completed</option>
//               <option value="Reading">Reading</option>
//               <option value="Waiting">Waiting</option>
//             </select>
//           </div>
//           <div className=" m-2 p-2  w-full flex justify-between items-baseline text-lg text-primaryText">
//             <label htmlFor="index" className="font-bold text-contrast mr-4">
//               Index
//             </label>
//             <input
//               required
//               type="text"
//               name="index"
//               value={index}
//               autoComplete="off"
//               onBlur={(e) => {
//                 if (e.target.value !== bookInfo.index) updateBook({ index });
//               }}
//               onChange={(e) => {
//                 setIndex(e.target.value);
//               }}
//               className="   bg-lmPrimaryLight dark:bg-primaryDark p-1 rounded-md text-lmPrimaryText dark:text-yellow-400 w-full"
//             />
//           </div>
//           <div className="text-primaryText m-2 p-2  w-full flex justify-between items-baseline text-lg">
//             <label htmlFor="rating" className="font-bold text-contrast mr-4">
//               Rating
//             </label>

//             <select
//               name="rating"
//               value={averageRating}
//               onBlur={(e) => {
//                 if (e.target.value !== bookInfo.averageRating)
//                   updateBook({ averageRating });
//               }}
//               onChange={(e) => {
//                 setAverageRating(e.target.value);
//               }}
//               className="   bg-lmPrimaryLight dark:bg-primaryDark p-1 rounded-md text-lmPrimaryText dark:text-yellow-400 w-full"
//             >
//               <option value="1">1</option>
//               <option value="2">2</option>
//               <option value="3">3</option>
//               <option value="4">4</option>
//               <option value="5">5</option>
//             </select>
//           </div>
//         </form>
//       </div>
//       <div className="flex justify-center">
//         <button
//           type="button"
//           onClick={() => {
//             navigate(-1);
//           }}
//           className="bg-secondary mb-3 p-3 text-base font-bold uppercase rounded-md hover:bg-primaryDark hover:text-secondary focus:text-secondary focus:bg-primaryDark "
//         >
//           update
//         </button>
//       </div>
//     </div>
//   </div>
// );
