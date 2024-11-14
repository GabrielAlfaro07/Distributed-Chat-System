import React from "react";

const ProfilePicture: React.FC<{ url: string | undefined }> = ({ url }) => (
  <img
    src={
      url ||
      "https://static-00.iconduck.com/assets.00/avatar-default-icon-2048x2048-h6w375ur.png"
    }
    alt="Profile"
    className="w-10 h-10 rounded-full mr-2 self-start"
  />
);

export default ProfilePicture;
