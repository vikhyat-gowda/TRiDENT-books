import React, { useState, useEffect } from "react";
import { Star } from "react-feather";

export default function Rating({ rating }) {
  const [ratingsInStars, setRatingsInStars] = useState(
    <Star color="#03A4F6" />
  );

  useEffect(() => {
    let tempStart = [];
    for (let i = 0; i < Math.round(parseInt(rating, 10)); i++) {
      tempStart.push(<Star color="#03A4F6" />);
    }
    setRatingsInStars(tempStart);
  }, [rating]);

  return <div className="flex mt-3 ">{ratingsInStars}</div>;
}
