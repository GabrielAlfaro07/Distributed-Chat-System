import React, { useState } from "react";
import Input from "../inputs/Input";
import RegisterButton from "../buttons/RegisterButton"; // Import RegisterButton
import ToLoginFormButton from "../buttons/ToLoginFormButton"; // Import ToLoginFormButton
import { UserInfo } from "../../services/authService"; // Import UserInfo interface

// Update the interface to accept onToggleForm prop
interface RegisterFormProps {
  onToggleForm: () => void;
  onRegisterSuccess: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  onToggleForm,
  onRegisterSuccess,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [information, setInformation] = useState("");
  const [profilePictureUrl, setProfilePictureUrl] = useState("");

  const _userInfo: UserInfo = {
    username,
    phone_number: phoneNumber,
    information,
    profile_picture_url: profilePictureUrl,
  };

  return (
    <div>
      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Input
        label="Username"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <Input
        label="Phone Number"
        type="text"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
      />
      <Input
        label="Information"
        type="text"
        value={information}
        onChange={(e) => setInformation(e.target.value)}
      />
      <Input
        label="Profile Picture URL (optional)"
        type="text"
        value={profilePictureUrl}
        onChange={(e) => setProfilePictureUrl(e.target.value)}
      />

      {/* Pass all values, including email and password, to RegisterButton */}
      <RegisterButton
        email={email}
        password={password}
        userInfo={_userInfo}
        onRegisterSuccess={onRegisterSuccess}
      />

      {/* Button to toggle to login form */}
      <ToLoginFormButton onClick={onToggleForm} />
    </div>
  );
};

export default RegisterForm;
