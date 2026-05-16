import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import "./App.css";

import MapComponent from "./components/MapComponent";

import UserDashboard from "./components/UserDashboard";

import MyComplaints from "./components/MyComplaints";

function App() {

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

        {/* ALL COMPLAINTS PAGE */}

        <Route
          path="/complaints"
          element={<MyComplaints />}
        />

      </Routes>

    </BrowserRouter>

  );
}

export default App;