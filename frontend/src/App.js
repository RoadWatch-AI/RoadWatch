import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import "./App.css";

import MapComponent from "./components/MapComponent";

import UserDashboard from "./components/UserDashboard";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<UserDashboard />}
        />

        <Route
          path="/map"
          element={<MapComponent />}
        />

      </Routes>

    </BrowserRouter>

  );
}

export default App;