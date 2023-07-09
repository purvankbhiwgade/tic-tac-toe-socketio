import React from "react";

export default function Alert(props) {
  return (
    <div className={`rounded-md ${props.status === "error" ? "bg-[#EB5757]" : "bg-[#6FCF97]"} p-4 ${props.className}`}>
      <div className="flex">
        <div className="ml-3">
          <div className="text-sm text-white">
            <p>
              {props.message}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
