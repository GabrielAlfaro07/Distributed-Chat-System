import React from "react";

const Timestamp: React.FC<{
  time: string;
  isEdited: boolean;
  alignment: "left" | "right";
}> = ({ time, isEdited, alignment }) => (
  <div
    className={`text-xs mt-1 ${
      alignment === "left" ? "text-gray-500 ml-2 text-right" : "text-right pt-4"
    }`}
  >
    {time} {isEdited && <span className="italic ml-1">Edited</span>}
  </div>
);

export default Timestamp;
