import React, { useState } from "react";
import Input from "../inputs/Input";
import LoginButton from "../buttons/LoginButton";
import ToRegisterFormButton from "../buttons/ToRegisterFormButton"; // Import the ToRegisterFormButton

// Update the type to accept onToggleForm prop
interface LoginFormProps {
  onToggleForm: () => void;
  onLoginSuccess: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onToggleForm,
  onLoginSuccess,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
      <LoginButton
        email={email}
        password={password}
        onLoginSuccess={onLoginSuccess}
      />
      <ToRegisterFormButton onClick={onToggleForm} />
    </div>
  );
};

export default LoginForm;
