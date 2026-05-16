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

  // =========================================================
  // CHECK LOGIN TOKEN
  // =========================================================

  useEffect(() => {

    const token =
      localStorage.getItem("token");

    if (token) {

      setIsLoggedIn(true);

    }

  }, []);

  // =========================================================
  // NOT LOGGED IN
  // =========================================================

  if (!isLoggedIn) {

    return (

      <Login
        setIsLoggedIn={setIsLoggedIn}
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
          element={<UserDashboard />}
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

        {/* FALLBACK */}

        <Route
          path="*"
          element={<Navigate to="/" />}
        />

      </Routes>

    </BrowserRouter>

  );
}

export default App;