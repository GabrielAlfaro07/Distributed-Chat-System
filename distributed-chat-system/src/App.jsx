// App.tsx
import React from "react";
import HomeScreen from "./components/screens/HomeScreen";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import default Toastify styles

export default function App() {
  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />
      <HomeScreen />
    </div>
  );
}
