// Message.tsx
import React from "react";

interface MessageProps {
  content: string;
  time: string;
  alignment: "left" | "right";
}

const Message: React.FC<MessageProps> = ({ content, time, alignment }) => {
  const isLeftAligned = alignment === "left";
  return (
    <div className={`mb-4 flex ${isLeftAligned ? "" : "justify-end"}`}>
      <div
        className={`p-2 rounded w-2/3 ${
          isLeftAligned ? "bg-gray-300" : "bg-blue-500 text-white"
        }`}
      >
        <div>{content}</div>
        <div
          className={`text-xs mt-1 ${
            isLeftAligned ? "text-gray-600" : "text-gray-200"
          } text-right`}
        >
          {time}
        </div>
      </div>
    </div>
  );
};

export default Message;
