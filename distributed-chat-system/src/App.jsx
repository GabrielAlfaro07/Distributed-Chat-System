// App.tsx
import React from "react";
import HomeScreen from "./components/screens/HomeScreen";

export default function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <HomeScreen />
    </>
  );
}
