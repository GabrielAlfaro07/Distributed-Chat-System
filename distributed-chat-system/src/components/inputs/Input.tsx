// Input.tsx
import React, { useState, useRef, useEffect } from "react";

interface InputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  onInputResize?: (height: number) => void;
}

const Input: React.FC<InputProps> = ({ onInputResize, ...props }) => {
  const [text, setText] = useState("");
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto"; // Reset height to auto
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`; // Set to scroll height
      if (onInputResize) onInputResize(textAreaRef.current.scrollHeight);
    }
  };

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  }, [text]);

  return (
    <textarea
      ref={textAreaRef}
      value={text}
      onChange={handleChange}
      className="w-full p-2 border border-gray-300 rounded focus:outline-none resize-none overflow-hidden"
      rows={1}
      {...props}
    />
  );
};

export default Input;
