import { useState, useEffect } from "react";

import MapComponent from "./components/MapComponent";

import Login from "./components/Login";

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // =========================================================
  // CHECK EXISTING JWT TOKEN
  // =========================================================

  useEffect(() => {

    const token = localStorage.getItem("token");

    if(token){

      setIsLoggedIn(true);

    }

  }, []);

  // =========================================================
  // MAIN UI
  // =========================================================

  return (

    <div>

      {

        isLoggedIn

        ?

        <MapComponent />

        :

        <Login setIsLoggedIn={setIsLoggedIn} />

      }

    </div>

  );

}

export default App;