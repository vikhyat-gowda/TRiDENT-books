import React, { useState } from "react";
import StarRatingComponent from "react-star-rating-component";
import { useNavigate } from "react-router-dom";
import { Edit2, Trash2, Download } from "react-feather";
import useDeleteBook from "../../hooks/useDeleteBook";
import { ControlledMenu, useMenuState, MenuItem } from "@szhsin/react-menu";
import useSingleAndDoubleClick from "../../hooks/useSingleAndDoubleClick";

export default function Table({ books, darkMode }) {
  return (
    <table className=" w-full " style={{ borderCollapse: "collapse" }}>
      <thead>
        <tr className="text-lg font-semibold text-contrast">
          <th>Title</th>
          <th>Author</th>
          <th>Series</th>
          <th>Ratings</th>
          <th>ISBN 10</th>
          <th>ISBN 13</th>
          <th>Total Pages</th>
        </tr>
      </thead>
      <tbody className="">
        {books.map((book) => (
          <TableRows key={book.id} book={book} darkMode={darkMode} />
        ))}
      </tbody>
    </table>
  );
}

function TableRows({ book, darkMode }) {
  const {
    imageLinks,
    title,
    authors,
    series,
    index,
    averageRating,
    industryIdentifiers,
    id,
  } = book;
  const navigate = useNavigate();
  const { toggleMenu, ...menuProps } = useMenuState();

  const [handleDelete, loadingHandleDelete] = useDeleteBook();
  const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });

  const click = useSingleAndDoubleClick(
    () => navigate("/details/" + id),
    () => navigate(`/edit/${id}`)
  );
  return (
    <>
      <tr
        className="p-3 border-b-2 border-lmTableDivider dark:border-primaryLight cursor-pointer text-lmPrimaryText dark:text-primaryText"
        // onDoubleClick={() => {
        //   navigate("/details/" + id);
        // }}
        onClick={click}
        onContextMenu={(e) => {
          e.preventDefault();
          setAnchorPoint({ x: e.clientX, y: e.clientY });
          toggleMenu(true);
        }}
      >
        <td className="flex  items-center space-x-2 font-bold text-xl px-2">
          <img
            className="w-14 rounded-md shadow-lg m-3"
            src={imageLinks.thumbnail.replace("&edge=curl", "")}
            alt={title}
          />
          <div>{title}</div>
          {/* <span className="flex justify-start mt-10 mb-3 text-secondary">
          {book.hasOwnProperty("epubDownloadUrl") && (
            <a
              href={book.epubDownloadUrl}
              rel="noreferrer"
              className="mr-4 "
              target="_blank"
            >
              <Download />
            </a>
          )}
          <Link className="mr-4" to={`edit/${id}`}>
            <Edit2 />
          </Link>
          <button type="button" onClick={() => handleDelete(book)}>
            <Trash2 />
          </button>
        </span> */}
        </td>
        <td className="text-center">
          {authors && authors.map((author) => <p key={author}>{author}</p>)}
        </td>
        <td className="text-center">
          {series} #{index}
        </td>
        <td className="w-20">
          <StarRatingComponent
            name="tableRatings"
            starCount={5}
            value={parseInt(averageRating, 10)}
          />
        </td>
        <td className="text-center">
          <p className="whitespace-nowrap">
            #
            {
              industryIdentifiers.find((ojb) => {
                return (ojb.type = "ISBN_10");
              }).identifier
            }
          </p>
        </td>
        <td className="text-center pl-2">
          <p className="whitespace-nowrap">
            #
            {
              industryIdentifiers.find((ojb) => {
                return (ojb.type = "ISBN_13");
              }).identifier
            }
          </p>
        </td>
        <td className="text-center">{book.pageCount}</td>
      </tr>
      <ControlledMenu
        {...menuProps}
        theming={darkMode ? "dark" : undefined}
        anchorPoint={anchorPoint}
        onClose={() => toggleMenu(false)}
      >
        <MenuItem onClick={() => navigate(`edit/${id}`)}>
          <i className="mr-2">
            <Edit2 size={20} />
          </i>
          Edit
        </MenuItem>
        {book.hasOwnProperty("epubDownloadUrl") && (
          <MenuItem
            onClick={() => window.open(book.epubDownloadUrl, "_newtab")}
          >
            <i className="mr-2">
              <Download size={20} />
            </i>
            Download
          </MenuItem>
        )}
        <MenuItem onClick={() => handleDelete(book)}>
          <i className="mr-2">
            <Trash2 size={20} />
          </i>
          Delete
        </MenuItem>
      </ControlledMenu>
    </>
  );
}
