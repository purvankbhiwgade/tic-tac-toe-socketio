import React from "react";

export default function SmallCross() {
  return (
    <div className="flex relative w-[38.4px] h-[38.4px]">
      <span
        className="rounded-full -rotate-45 bg-[#2C8DFF] inline-block absolute left-4 -top-1"
        style={{ width: "9.86px", height: "44.39px" }}
      ></span>
      <span
        className="rounded-full rotate-45 bg-[#2C8DFF] inline-block absolute left-4 -top-1"
        style={{ width: "9.86px", height: "44.39px" }}
      ></span>
    </div>
  );
}
