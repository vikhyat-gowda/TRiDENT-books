import { collection } from "@firebase/firestore";
import Logo from "../assets/img/logos trident/Trident.svg";
import React, { useCallback } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { auth, db } from "../backend/config";
import {
  Moon,
  Sun,
  Bell,
  User,
  Edit,
  Menu as MenuIcon,
  LogOut,
} from "react-feather";
import {
  Menu,
  MenuButton,
  FocusableItem,
  MenuDivider,
  MenuItem,
  MenuHeader,
} from "@szhsin/react-menu";
import StarRatingComponent from "react-star-rating-component";
import { signOut } from "@firebase/auth";
import { addBookToLibrary, deleteNotifications } from "./Topbar/TopBarBackend";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/theme-dark.css";
import { formatDistanceToNow, toDate } from "date-fns";

export default function Nav({ darkMode, setDarkMode }) {
  const location = useLocation();
  const navigate = useNavigate();

  const [notifications, loadingNotifications, errorNotifications] =
    useCollectionData(collection(db, `Shared/${auth.currentUser.uid}/books`), {
      idField: "docId",
    });

  const apperanceHandler = () => {
    setDarkMode(!darkMode);
    if (darkMode) {
      localStorage.setItem("isDark", "0");
    } else {
      localStorage.setItem("isDark", "1");
    }
  };

  console.log(errorNotifications);

  const authHandler = useCallback(async () => {
    signOut(auth)
      .then(() => {
        console.log("logged successfully");
        navigate("/");
      })
      .catch((error) => {
        console.log(error.message);
      });
  }, []);

  const handleActiveLinkStyle = (link) => {
    if (
      location.pathname.substring(0, location.pathname.lastIndexOf("/")) ===
      link
    ) {
      return "text-secondary font-semibold";
    } else return "hover:text-secondary";
  };

  return (
    <div className="flex justify-between items-center px-2 py-1 shadow-md text-lmPrimaryText dark:text-primaryText">
      <div className="flex items-center text-sm md:text-base py-1 sm:py-0 ">
        <img
          src={Logo}
          alt="trident logo"
          className="w-10 h-10 sm:w-14 sm:h-14"
        />
        <ul className="hidden sm:visible sm:flex space-x-4 ml-2  uppercase">
          <li className={handleActiveLinkStyle("")}>
            <Link to={{ pathname: "/" }}>Home</Link>
          </li>
          <li className={handleActiveLinkStyle("/search")}>
            <Link to={{ pathname: "/search/Standalone" }}>Add Books</Link>
          </li>
          <li className={handleActiveLinkStyle("/addseries")}>
            <Link to={{ pathname: "/addseries/" }}>Manage Series</Link>
          </li>
        </ul>
        <h5 className="text-base font-bold sm:hidden">TRiDENT BOOKS</h5>
      </div>
      <div className="hidden sm:visible sm:flex space-x-2 items-center">
        <button
          onClick={apperanceHandler}
          className="w-10 h-10 outline-none focus:ring-2 focus:ring-secondary focus:text-secondary bg-lmPrimaryDark rounded-full dark:bg-primaryLight flex items-center justify-center hover:text-secondary cursor-pointer"
        >
          {darkMode ? <Sun /> : <Moon />}
        </button>

        {notifications && notifications[0] && (
          <Menu
            arrow={true}
            theming={darkMode ? "dark" : undefined}
            menuButton={
              <MenuButton className=" outline-none focus:ring-2  focus:ring-secondary focus:text-secondary w-10 h-10 bg-lmPrimaryDark rounded-full dark:bg-primaryLight flex items-center justify-center hover:text-secondary cursor-pointer relative">
                <Bell />
              </MenuButton>
            }
          >
            <FocusableItem className="font-bold justify-between text-lg">
              {() => (
                <>
                  <span>Notifications</span>
                  <button
                    onClick={() => {
                      notifications.map((notification) =>
                        deleteNotifications(notification.docId)
                      );
                    }}
                    className="text-xs uppercase hover:text-secondary font-bold"
                  >
                    Clear All
                  </button>
                </>
              )}
            </FocusableItem>
            <MenuDivider />

            {notifications.map((notification) => (
              <>
                <FocusableItem
                  className="flex space-x-4 items-center"
                  key={notification.docId}
                >
                  {() => (
                    <>
                      <img
                        src={notification.imageLinks.thumbnail}
                        className="w-12"
                        alt=""
                      />
                      <div className="flex flex-col">
                        <div className="font-semibold text-sm">
                          Hey {notification.sentByName} sent you a book
                        </div>
                        <p className="text-sm">
                          <b> {notification.title}</b> by{" "}
                          {notification.authors[0]}
                        </p>
                        <div>
                          <StarRatingComponent
                            name="rate2"
                            starCount={5}
                            value={parseInt(notification.averageRating, 10)}
                          />
                        </div>
                        <div className="flex space-x-3 text-xs ">
                          <button
                            onClick={() => addBookToLibrary(notification)}
                            className="uppercase font-semibold hover:text-secondary"
                          >
                            Add to Library
                          </button>
                          <button
                            onClick={() =>
                              deleteNotifications(notification.docId)
                            }
                            className="uppercase font-semibold hover:text-secondary"
                          >
                            Dismiss
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </FocusableItem>
                <MenuDivider />
              </>
            ))}
          </Menu>
        )}

        <Menu
          offsetY={10}
          arrow={true}
          align="end"
          theming={darkMode ? "dark" : undefined}
          menuButton={
            <MenuButton className="border-2 border-opacity-0 hover:border-opacity-100 border-secondary w-10 h-10 bg-lmPrimaryDark rounded-full  dark:bg-primaryLight flex items-center justify-center hover:text-secondary cursor-pointer overflow-hidden">
              {auth.currentUser.photoURL !== null ? (
                <img src={auth.currentUser.photoURL} alt="" />
              ) : (
                <User />
              )}
            </MenuButton>
          }
        >
          {console.log(auth.currentUser)}
          <FocusableItem className="flex flex-col text-center">
            {() => (
              <>
                <p className="font-semibold">{auth.currentUser.displayName}</p>
                <p className="text-sm ">{auth.currentUser.email}</p>
                <p className="text-sm">
                  Last Login{" "}
                  {formatDistanceToNow(
                    new Date(
                      parseInt(auth.currentUser.metadata.lastLoginAt, 10)
                    ),
                    {
                      addSuffix: true,
                    }
                  )}
                </p>
              </>
            )}
          </FocusableItem>
          <MenuDivider />
          <MenuItem
            onClick={() => {
              navigate("/editprofile");
            }}
          >
            <i className="mr-2">
              <Edit size={20} />
            </i>
            Edit Profile
          </MenuItem>

          <MenuItem onClick={authHandler}>
            <i className="mr-2">
              <LogOut size={20} />
            </i>
            Logout
          </MenuItem>
        </Menu>
      </div>

      {/* Small Screen */}
      <div className="flex sm:hidden">
        <div
          onClick={apperanceHandler}
          className="w-10 mr-2 h-10 hover:shadow-md bg-lmPrimaryDark rounded-full dark:bg-primaryLight flex items-center justify-center hover:text-secondary cursor-pointer"
        >
          {darkMode ? <Sun /> : <Moon />}
        </div>
        {notifications && notifications[0] && (
          <Menu
            arrow={true}
            theming={darkMode ? "dark" : undefined}
            menuButton={
              <MenuButton className="border-2 mr-2 border-opacity-0 hover:border-opacity-100 border-secondary w-10 h-10 bg-lmPrimaryDark rounded-full dark:bg-primaryLight flex items-center justify-center hover:text-secondary cursor-pointer relative">
                <Bell />
              </MenuButton>
            }
          >
            <FocusableItem className="font-bold justify-between text-lg">
              {() => (
                <>
                  <span>Notifications</span>

                  <button
                    onClick={() => {
                      notifications.map((notification) =>
                        deleteNotifications(notification.docId)
                      );
                    }}
                    className="text-xs uppercase hover:text-secondary font-bold"
                  >
                    Clear All
                  </button>
                </>
              )}
            </FocusableItem>
            <MenuDivider />

            {notifications.map((notification) => (
              <>
                <FocusableItem
                  className="flex space-x-4 items-center"
                  key={notification.docId + "1"}
                >
                  {() => (
                    <>
                      <img
                        src={notification.imageLinks.thumbnail}
                        className="w-12"
                        alt=""
                      />
                      <div className="flex flex-col">
                        <div className="font-semibold text-sm">
                          Hey {notification.sentByName} sent you a book
                        </div>
                        <p className="text-sm">
                          <b> {notification.title}</b> by{" "}
                          {notification.authors[0]}
                        </p>
                        <div>
                          <StarRatingComponent
                            name="rate2"
                            starCount={5}
                            value={parseInt(notification.averageRating, 10)}
                          />
                        </div>
                        <div className="flex space-x-3 text-xs ">
                          <button
                            onClick={() => addBookToLibrary(notification)}
                            className="uppercase font-semibold hover:text-secondary"
                          >
                            Add to Library
                          </button>
                          <button
                            onClick={() =>
                              deleteNotifications(notification.docId)
                            }
                            className="uppercase font-semibold hover:text-secondary"
                          >
                            Dismiss
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </FocusableItem>
                <MenuDivider />
              </>
            ))}
          </Menu>
        )}
        <Menu
          theming={darkMode ? "dark" : undefined}
          menuButton={
            <MenuButton className="border-2 border-opacity-0 hover:border-opacity-100 border-secondary w-10 h-10 bg-lmPrimaryDark rounded-full dark:bg-primaryLight flex items-center justify-center hover:text-secondary cursor-pointer relative">
              <MenuIcon />
            </MenuButton>
          }
        >
          {auth.currentUser.photoURL !== null && (
            <FocusableItem className="flex justify-center items-center">
              {() => (
                <img
                  className=" w-14 rounded-full"
                  src={auth.currentUser.photoURL}
                  alt=""
                />
              )}
            </FocusableItem>
          )}
          <FocusableItem className="flex flex-col text-center">
            {() => (
              <>
                <p className="font-semibold">{auth.currentUser.displayName}</p>
                <p className="text-sm ">{auth.currentUser.email}</p>
                <p className="text-sm">
                  Last Login{" "}
                  {formatDistanceToNow(
                    new Date(
                      parseInt(auth.currentUser.metadata.lastLoginAt, 10)
                    ),
                    {
                      addSuffix: true,
                    }
                  )}
                </p>
              </>
            )}
          </FocusableItem>
          <MenuDivider />
          <MenuItem onClick={() => navigate("/")}>Home</MenuItem>
          <MenuItem onClick={() => navigate("/search/Standalone")}>
            Add Books
          </MenuItem>
          <MenuItem onClick={() => navigate("/addseries")}>
            Manage Series
          </MenuItem>
          <MenuDivider />
          <MenuHeader>Account</MenuHeader>
          <MenuItem
            onClick={() => {
              navigate("/editprofile");
            }}
          >
            <i className="mr-2">
              <Edit size={20} />
            </i>
            Edit Profile
          </MenuItem>
          <MenuItem onClick={authHandler}>
            <i className="mr-2">
              <LogOut size={20} />
            </i>
            Logout
          </MenuItem>
        </Menu>
      </div>
    </div>
  );
}
