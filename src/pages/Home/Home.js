import React from "react";
import Card from "../../components/Cards/Card";
import Table from "../../components/Tables/Table";
import Loading from "../../components/Loading/Loading";
import { auth, db } from "../../backend/config";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { List, Grid, Filter } from "react-feather";
import { useParams, useNavigate } from "react-router-dom";
import { query, collection, orderBy } from "@firebase/firestore";
import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Menu,
  MenuItem,
  MenuButton,
  MenuHeader,
  MenuDivider,
  SubMenu,
} from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/theme-dark.css";

export default function Home({ darkMode }) {
  const { q } = useParams();
  const navigate = useNavigate();
  const viewStylePref = localStorage.getItem("viewStyle");
  const [searchText, setSearchText] = useState(q !== undefined ? q : "");
  const [viewStyle, setViewStyle] = useState(
    viewStylePref ? viewStylePref : "CARDS"
  );
  const [library, loadingLibrary, errorLibrary] = useCollectionData(
    query(
      collection(db, "Library", auth.currentUser.uid, "books"),
      orderBy("series"),
      orderBy("index")
    )
  );
  const [seriesList, loadingSeriesListt, errorSeriesList] = useCollectionData(
    collection(db, `Library/${auth.currentUser.uid}/SeriesList`),
    {
      idField: "id",
    }
  );
  const [users, loadingUsers, errorsUsers] = useCollectionData(
    collection(db, "Users"),
    { idField: "id" }
  );

  useEffect(() => {
    if (q !== undefined && !q.toString().includes(":")) {
      navigate("/");
      setSearchText("");
    }
  }, [q, navigate]);

  useEffect(() => {
    localStorage.setItem("tempQuery", "");
  }, []);

  const cleanedBooks = useMemo(() => {
    let tempText = searchText.split(":");

    try {
      if (tempText.length === 1) {
        return library.filter((book) =>
          book.title.toLowerCase().includes(searchText.toLowerCase())
        );
      } else {
        switch (tempText[0]) {
          case "author":
            return library.filter((book) =>
              book.authors[0].toLowerCase().includes(tempText[1].toLowerCase())
            );
          case "index":
          case "averageRating":
            return library.filter((book) =>
              book[tempText[0]].toString().includes(tempText[1])
            );
          default:
            return library.filter((book) =>
              book[tempText[0]]
                .toLowerCase()
                .includes(tempText[1].toLowerCase())
            );
        }
      }
    } catch (error) {
      return library;
    }
  }, [searchText, library]);

  const handleFilter = useCallback((query) => {
    setSearchText(query);
  }, []);

  if (loadingLibrary || loadingSeriesListt || loadingUsers) {
    return (
      <Loading
        status={`Loading ${
          auth.currentUser.displayName.split(" ")[0]
        }'s' Library`}
      />
    );
  }

  if (errorLibrary || errorSeriesList || errorsUsers) {
    return <div className="text-primaryText">Fatal Error Reload</div>;
  }

  return (
    <>
      <div className="flex h-full flex-row justify-between items-center p-5 text-lmPrimaryText dark:text-primaryText">
        <div className="flex items-end space-x-4">
          <p className="text-xl sm:text-3xl font-medium text-left">My Books</p>
          <div>
            <Menu
              theming={darkMode ? "dark" : undefined}
              menuButton={
                <MenuButton className="hidden sm:visible p-1 rounded-md shadow-sm bg-lmPrimaryDark dark:bg-primaryLight sm:flex items-center justify-center hover:text-secondary">
                  <Filter />
                </MenuButton>
              }
            >
              {searchText !== "" && (
                <>
                  <MenuItem onClick={() => handleFilter("")}>
                    Clear Filters
                  </MenuItem>
                  <MenuDivider />
                </>
              )}
              <MenuHeader>By Status</MenuHeader>
              <MenuItem onClick={() => handleFilter("status:Reading")}>
                Reading
              </MenuItem>
              <MenuItem onClick={() => handleFilter("status:Completed")}>
                Completed
              </MenuItem>
              <MenuItem onClick={() => handleFilter("status:Waiting")}>
                Waiting
              </MenuItem>
              <MenuDivider />
              <SubMenu label="By Series">
                {seriesList &&
                  seriesList.map((item) => (
                    <MenuItem
                      key={item.id}
                      onClick={() => handleFilter(`series:${item.Name}`)}
                    >
                      {item.Name}
                    </MenuItem>
                  ))}
              </SubMenu>
            </Menu>
          </div>
        </div>
        <div className="flex space-x-2 ">
          <input
            list="titleSearch"
            id="titleSearchField"
            type="search"
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
            }}
            placeholder="Search in My Books"
            className="p-1 border-0 focus:ring-0 pl-3 outline-none dark:bg-primaryLight rounded-md hover:shadow-md focus:shadow-lg "
          />

          <div className="hidden sm:visible sm:flex p-1 rounded-md space-x-2 shadow-sm bg-lmPrimaryDark dark:bg-primaryLight">
            <button
              className={viewStyle === "TABLE" ? "text-secondary " : ""}
              onClick={() => {
                setViewStyle("TABLE");
                localStorage.setItem("viewStyle", "TABLE");
              }}
            >
              <List size={25} />
            </button>
            <button
              className={viewStyle === "CARDS" ? "text-secondary" : ""}
              onClick={() => {
                setViewStyle("CARDS");
                localStorage.setItem("viewStyle", "CARDS");
              }}
            >
              <Grid size={25} />
            </button>
          </div>
        </div>
      </div>

      {viewStyle === "CARDS" ? (
        <div className=" mx-3 pt-2 rounded-md flex justify-around flex-wrap extralarge:grid-cols-5 large:grid-cols-4 medium:grid medium:grid-cols-3">
          {cleanedBooks.map((book) => (
            <Card key={book.id} book={book} users={users} darkMode={darkMode} />
          ))}
        </div>
      ) : (
        // <div className=" dark:bg-primaryLight mx-3 pt-2 rounded-md flex justify-around flex-wrap extralarge:grid-cols-5 large:grid-cols-4 medium:grid medium:grid-cols-3">
        //   {cleanedBooks.map((book) => (
        //     <Card key={book.id} book={book} />
        //   ))}
        // </div>
        <div className="p-3">
          <Table books={cleanedBooks} darkMode={darkMode} />
        </div>
      )}
    </>
  );
}

// <div className="bg-primaryLight pt-2 flex flex-wrap justify-around  align-middle mx-3 rounded relative lg:grid lg:gap-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-2 2xl:grid-cols-5 2xl:gap-2">
//   {cleanedBooks.map((book) => (
//     <Card key={book.id} book={book} />
//   ))}
// </div>

// //old topbar
// <div className="flex justify-between p-5 align-middle ">
// <div className="relative">
//   {searchText.length === 0 ? (
//     <div className="absolute right-3 top-2">
//       <Search color="#f3f3f3" />
//     </div>
//   ) : (
//     <div
//       className="absolute right-3 top-3 cursor-pointer text-primaryText"
//       onClick={() => {
//         setSearchText("");
//       }}
//     >
//       <X size="20" />
//     </div>
//   )}

//   <input
//     autoFocus
//     type="text"
//     value={searchText}
//     placeholder="Search"
//     onChange={(e) => {
//       setSearchText(e.target.value);
//     }}
//     className="max-w-96 outline-none text-lg p-2 pl-4 rounded-full bg-lmPrimaryDark dark:bg-primaryLight text-lmPrimaryText dark:text-primaryText"
//   />
// </div>
// <div className="">
//   <ul
//     className="text-sm flex items-center flex-col-reverse sm:flex-row"
//     style={{ alignItems: "center" }}
//   >
//     <li className="mx-1 text-xs sm:text-base">
//       <Link to="/addseries">
//         <span className=" text-lmPrimaryText dark:text-primaryText hover:text-secondary dark:hover:text-secondary font-semibold uppercase">
//           Add Series
//         </span>
//       </Link>
//     </li>
//     <li className="mx-1 text-xs sm:text-base">
//       <Link to="/search/Standalone">
//         <span className=" text-lmPrimaryText dark:text-primaryText hover:text-secondary dark:hover:text-secondary font-semibold uppercase">
//           Add books
//         </span>
//       </Link>
//     </li>
//     <li className="mx-1 ">
//       <button
//         onClick={apperanceHandler}
//         className="text-lmPrimaryText dark:text-primaryText hover:text-secondary dark:hover:text-secondary font-semibold uppercase p-1"
//       >
//         {darkMode ? <Sun /> : <Moon />}
//       </button>
//     </li>

//     <li className=" text-secondary font-bold mx-2 border-2 rounded p-2 pb-1 drop-shadow-sm border-secondary hover:border-0  hover:bg-secondary  hover:text-primaryLight">
//       <Menu
//         theming={darkMode ? "dark" : ""}
//         menuButton={
//           <MenuButton>
//             <User size={20} />
//           </MenuButton>
//         }
//       >
//         <MenuItem>
//           <Link to="/editprofile">
//             <span className="ml-3 text-base">Edit Profile</span>
//           </Link>
//         </MenuItem>
//         <MenuItem onClick={authHandler}>
//           <span className="ml-3 text-base">Logout</span>
//         </MenuItem>
//       </Menu>
//     </li>
//   </ul>
// </div>
// </div>
