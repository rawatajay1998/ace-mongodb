"use client"; // if you're on Next.js 13/14 App Router

import React, { useState } from "react";

const ReadMoreText = ({
  text,
  maxLength = 400,
}: {
  text: string;
  maxLength?: number;
}) => {
  const [expanded, setExpanded] = useState(false);

  const toggleReadMore = () => {
    setExpanded(!expanded);
  };

  const displayedText = expanded
    ? text
    : `${text.substring(0, maxLength)}${text.length > maxLength ? "..." : ""}`;

  return (
    <div>
      <p style={{ marginBottom: "8px" }}>{displayedText}</p>
      {text.length > maxLength && (
        <button className="p-0 read_more_btn" onClick={toggleReadMore}>
          {expanded ? "Read Less" : "Read More"}
        </button>
      )}
    </div>
  );
};

export default ReadMoreText;
