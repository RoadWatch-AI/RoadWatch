import { useState } from "react";

import "./login.css";

function Login({
  setIsLoggedIn,
  setRole
}) {

  const [isSignup, setIsSignup] = useState(false);

  // =========================================================
  // LOGIN STATE
  // =========================================================

  const [loginData, setLoginData] = useState({

    email: "",

    password: ""

  });

  // =========================================================
  // SIGNUP STATE
  // =========================================================

  const [signupData, setSignupData] = useState({

    name: "",

    email: "",

    phone: "",

    password: "",

    confirmPassword: ""

  });

  // =========================================================
  // LOGIN
  // =========================================================

  const handleLogin = async (e) => {

    e.preventDefault();

    try {

      const response = await fetch(

        "https://roadwatch-backend-2umx.onrender.com/login",

        {

          method: "POST",

          headers: {

            "Content-Type": "application/json"

          },

          body: JSON.stringify({

            email: loginData.email,

            password: loginData.password

          })

        }

      );

      const result = await response.json();

      if(response.ok){

        localStorage.setItem(
          "token",
          result.token
        );

        localStorage.setItem(
          "role",
          result.role
        );

        localStorage.setItem(
          "name",
          result.name
        );

        alert("Login Successful 🚀");

        setIsLoggedIn(true);
        setRole(result.role);

      }

      else {

        alert(result.message);

      }

    }

    catch(error){

      console.log(error);

      alert("Login Failed");

    }

  };

  // =========================================================
  // SIGNUP
  // =========================================================

  const handleSignup = async (e) => {

    e.preventDefault();

    // PASSWORD MATCH VALIDATION

    if(

      signupData.password !==
      signupData.confirmPassword

    ){

      alert("Passwords do not match");

      return;

    }

    try {

      const response = await fetch(

        "https://roadwatch-backend-2umx.onrender.com/signup",

        {

          method: "POST",

          headers: {

            "Content-Type": "application/json"

          },

          body: JSON.stringify({

            name: signupData.name,

            email: signupData.email,

            phone: signupData.phone,

            password: signupData.password

          })

        }

      );

      const result = await response.json();

      alert(result.message);

      if(response.ok){

        setIsSignup(false);

      }

    }

    catch(error){

      console.log(error);

      alert("Signup Failed");

    }

  };

  return (

    <div className="login-page">

      {/* BACKGROUND */}

      <div className="background">

        <div className="orb orb1"></div>

        <div className="orb orb2"></div>

        <div className="orb orb3"></div>

      </div>

      <div className="container">

        {/* LEFT PANEL */}

        <div className="left-panel">

          <div className="brand-box">

            <h1>RoadWatch AI</h1>

            <p>
              AI Powered Smart Civic Intelligence Platform
            </p>

            <div className="features">

              <div className="feature-card">

                <span>🛣️ AI Road Detection</span>

              </div>

              <div className="feature-card">

                <span>📊 Budget Analytics</span>

              </div>

              <div className="feature-card">

                <span>📍 Smart Complaint Routing</span>

              </div>

              <div className="feature-card">

                <span>🤖 Real-Time Damage Prediction</span>

              </div>

            </div>

          </div>

        </div>

        {/* RIGHT PANEL */}

        <div className="right-panel">

          <div className="glass-card">

            {/* LOGIN FORM */}

            {

              !isSignup

              ?

              <form onSubmit={handleLogin}>

                <h2>Welcome Back</h2>

                <div className="input-box">

                  <input
                    type="email"
                    placeholder="Email Address"
                    value={loginData.email}
                    onChange={(e) =>
                      setLoginData({

                        ...loginData,

                        email: e.target.value

                      })
                    }
                    required
                  />

                </div>

                <div className="input-box">

                  <input
                    type="password"
                    placeholder="Password"
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData({

                        ...loginData,

                        password: e.target.value

                      })
                    }
                    required
                  />

                </div>

                <button
                  type="submit"
                  className="main-btn"
                >
                  Login
                </button>

                <p className="switch-text">

                  New User?

                  <span onClick={() => setIsSignup(true)}>

                    Sign Up Here

                  </span>

                </p>

              </form>

              :

              /* SIGNUP FORM */

              <form onSubmit={handleSignup}>

                <h2>Create Account</h2>

                <div className="input-box">

                  <input
                    type="text"
                    placeholder="Full Name"
                    value={signupData.name}
                    onChange={(e) =>
                      setSignupData({

                        ...signupData,

                        name: e.target.value

                      })
                    }
                    required
                  />

                </div>

                <div className="input-box">

                  <input
                    type="email"
                    placeholder="Email Address"
                    value={signupData.email}
                    onChange={(e) =>
                      setSignupData({

                        ...signupData,

                        email: e.target.value

                      })
                    }
                    required
                  />

                </div>

                <div className="input-box">

                  <input
                    type="text"
                    placeholder="Phone Number"
                    value={signupData.phone}
                    onChange={(e) =>
                      setSignupData({

                        ...signupData,

                        phone: e.target.value

                      })
                    }
                    required
                  />

                </div>

                <div className="input-box">

                  <input
                    type="password"
                    placeholder="Password"
                    value={signupData.password}
                    onChange={(e) =>
                      setSignupData({

                        ...signupData,

                        password: e.target.value

                      })
                    }
                    required
                  />

                </div>

                <div className="input-box">

                  <input
                    type="password"
                    placeholder="Confirm Password"
                    value={signupData.confirmPassword}
                    onChange={(e) =>
                      setSignupData({

                        ...signupData,

                        confirmPassword: e.target.value

                      })
                    }
                    required
                  />

                </div>

                <button
                  type="submit"
                  className="main-btn"
                >
                  Create Account
                </button>

                <p className="switch-text">

                  Already have an account?

                  <span onClick={() => setIsSignup(false)}>

                    Login Here

                  </span>

                </p>

              </form>

            }

          </div>

        </div>

      </div>

    </div>

  );

}

export default Login;