import React from "react";

export default function MinimalCard({ book }) {
  const { title, imageLinks, authors } = book;

  return (
    <div className="">
      <img
        className="object-cover max-h-48"
        src={imageLinks.thumbnail.replace("&edge=curl", "")}
        alt=""
      />
      <p className="text-base font-semibold truncate  w-28 ">{title}</p>
      <p className="text-sm ">{authors[0]}</p>
    </div>
  );
}
