import React from "react";
import "./LoadingSkeleton.css";

const LoadingSkeleton = ({ width = "100%", height = "2rem", style = {} }) => (
  <div
    className="loading-skeleton"
    style={{ width, height, ...style }}
    aria-busy="true"
    aria-label="Loading..."
    role="status"
  />
);

export default LoadingSkeleton;
