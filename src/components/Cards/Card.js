import React from "react";

import StarRatingComponent from "react-star-rating-component";
import { useNavigate } from "react-router-dom";
import { Trash2, Download, MoreVertical, Edit2, Share2 } from "react-feather";
import useDeleteBook from "../../hooks/useDeleteBook";
import useSetDocument from "../../hooks/useSetDocument";
import { auth } from "../../backend/config";
import { Menu, MenuButton, MenuItem, SubMenu } from "@szhsin/react-menu";
import useSingleAndDoubleClick from "../../hooks/useSingleAndDoubleClick";

const statusColorCode = {
  Reading: "bg-secondary",
  Completed: "bg-green-600",
  Waiting: "bg-yellow-400",
};

export default function Card({ book, users, darkMode }) {
  const {
    title,
    authors,
    averageRating,
    series,
    imageLinks,
    index,
    id,
    ratingsCount,
  } = book;
  const navigate = useNavigate();
  const [handleDelete] = useDeleteBook();
  const [sendBooks, loadinSendBooks, errorSendBooks] = useSetDocument();

  const click = useSingleAndDoubleClick(
    () => navigate("/details/" + id),
    () => navigate(`/edit/${id}`)
  );

  return (
    <div
      className="flex w-80 rounded-md shadow-sm relative cursor-pointer m-2 bg-lmPrimaryDark dark:bg-primaryLight text-lmPrimaryText dark:text-primaryText"
      style={{ minHeight: 13 + "rem" }}
      onClick={click}
    >
      <div
        className={`w-3 h-3 absolute rounded-full right-2 top-2 shadow-xl ${
          statusColorCode[book.status]
        }`}
      ></div>
      {imageLinks.thumbnail && (
        <img
          className="w-36 object-cover rounded-l-md"
          src={imageLinks.thumbnail.replace("&edge=curl", "")}
          alt=""
        />
      )}

      <div className="p-5 ">
        <h5 className="font-bold text-lg leading-none">{title}</h5>
        <p className="font-semibold text-xs mt-2">{authors[0]}</p>
        <p className="mt-3 text-sm">
          {series === "Standalone" ? "" : `${series} #${index}`}
        </p>
        <div className="flex items-center">
          <StarRatingComponent
            name="rate1"
            starCount={5}
            value={parseInt(averageRating, 10)}
          />
          <span className=" text-xs ml-1">({ratingsCount})</span>
        </div>
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute flex bottom-2 right-2 bg-transparent items-center"
        >
          <Menu
            theming={darkMode ? "dark" : undefined}
            menuButton={
              <MenuButton>
                <div>
                  <MoreVertical />
                </div>
              </MenuButton>
            }
          >
            <MenuItem
              onClick={() => {
                navigate(`/edit/${id}`);
              }}
            >
              <Edit2 size={18} />
              <span className="ml-2">Edit</span>
            </MenuItem>
            <SubMenu
              label={
                <>
                  <Share2 size={18} />
                  <span className="ml-2">Share</span>
                </>
              }
            >
              {users.map((user) => {
                // if (user.id !== auth.currentUser.uid)
                return (
                  <MenuItem
                    key={user.id}
                    onClick={() =>
                      sendBooks(`Shared/${user.id}/books/${id}`, {
                        ...book,
                        sentByUid: auth.currentUser.uid,
                        sentByName: auth.currentUser.displayName,
                        type: "book",
                      })
                    }
                  >
                    {`${user.firstName} ${user.lastName}`}
                  </MenuItem>
                );
                // else return null;
              })}
            </SubMenu>
            {book.hasOwnProperty("epubDownloadUrl") && (
              <MenuItem theming="dark">
                <a
                  href={book.epubDownloadUrl}
                  rel="noreferrer"
                  className="flex"
                >
                  <Download size={18} />
                  <span className="ml-2">Download</span>
                </a>
              </MenuItem>
            )}
            <MenuItem onClick={() => handleDelete(book)}>
              <Trash2 size={18} />
              <span className="ml-2">Delete</span>
            </MenuItem>
          </Menu>
        </div>
        {book.hasOwnProperty("epubDownloadUrl") && (
          <a
            className="absolute bottom-3"
            href={book.epubDownloadUrl}
            target="_blank"
            rel="noreferrer"
          >
            <Download />
          </a>
        )}
      </div>
    </div>
  );
}
