import React from "react";

export default function Cross() {
  return (
    <div className="flex relative w-[63px] h-[63px]">
      <span
        className="rounded-full -rotate-45 bg-[#2C8DFF] inline-block absolute left-6 -top-2"
        style={{ width: "16.2px", height: "73px" }}
      ></span>
      <span
        className="rounded-full rotate-45 bg-[#2C8DFF] inline-block absolute left-6 -top-2"
        style={{ width: "16.2px", height: "73px" }}
      ></span>
    </div>
  );
}
