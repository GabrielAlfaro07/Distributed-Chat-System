// LoginForm.tsx
import React, { useState } from "react";
import Input from "../inputs/Input";
import LoginButton from "../buttons/LoginButton";

const LoginForm: React.FC = () => {
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
      <LoginButton email={email} password={password} />
    </div>
  );
};

export default LoginForm;
