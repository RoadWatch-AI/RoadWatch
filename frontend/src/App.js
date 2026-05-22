import AdminDashboard from "./components/AdminDashboard";
import AuthorityDashboard from "./components/AuthorityDashboard";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { useState, useEffect } from "react";

import "./App.css";

import MapComponent from "./components/MapComponent";

import UserDashboard from "./components/UserDashboard";

import MyComplaints from "./components/MyComplaints";

import Login from "./components/Login";

function App() {

  const [isLoggedIn, setIsLoggedIn] =
    useState(false);

  const [role, setRole] =
  useState("");

  // =========================================================
  // CHECK LOGIN TOKEN
  // =========================================================

  useEffect(() => {

    const token =
      localStorage.getItem("token");

    if (token) {

  setIsLoggedIn(true);

  setRole(
    localStorage.getItem("role")
  );

}

  }, []);

  // =========================================================
  // SHOW LOGIN PAGE
  // =========================================================

  if (!isLoggedIn) {

    return (

      <Login
  setIsLoggedIn={setIsLoggedIn}
  setRole={setRole}
/>

    );

  }

  // =========================================================
  // MAIN ROUTES
  // =========================================================

  return (

    <BrowserRouter>

      <Routes>

        {/* USER DASHBOARD */}

        <Route
  path="/"
  element={

    role === "ADMIN"

    ?

    <AdminDashboard />

    :

    role === "AUTHORITY"

    ?

    <AuthorityDashboard />

    :

    <UserDashboard />

  }
/>

        {/* MAP PAGE */}

        <Route
          path="/map"
          element={<MapComponent />}
        />

        {/* MY COMPLAINTS */}

        <Route
          path="/complaints"
          element={<MyComplaints />}
        />

        {/* INVALID ROUTES */}

        <Route
          path="*"
          element={<Navigate to="/" />}
        />

      </Routes>

    </BrowserRouter>

  );
}

export default App;