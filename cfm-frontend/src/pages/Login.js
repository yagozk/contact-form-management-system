import axios from "axios";
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    if (localStorage.getItem("language")) {
      setLanguage(localStorage.getItem("language"));
    }
  }, [language]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5165/api/user/login",
        {
          username,
          password,
        }
      );

      if (response.status === 200) {
        const { user, token } = response.data.data;

        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);

        window.location.href = "/";
        console.log("User: " + localStorage.getItem("user"));
        console.log("Token: " + localStorage.getItem("token"));
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        console.error("Error occurred while logging in:", error);
        if (language === "en") {
          setError("An error occurred while logging in");
        } else {
          setError("Giriş yapılırken hatayla karşılaşıldı");
        }
      }
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="d-flex justify-content-center align-items-center">
          <div className="card m-5 p-5">
            <div className="card-body">
              <h1
                className="card-title fw-bold text-center text-warning text-strong"
                style={{ fontSize: "80px" }}
              >
                🐻 CFM
              </h1>
              <h4>Contact Form Management</h4>
              <hr className="mb-5" />
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label htmlFor="loginUsername" className="form-label">
                    {language === "en" ? "Username" : "Kullanıcı Adı"}
                  </label>
                  <input
                    className="form-control"
                    id="loginUsername"
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="loginPassword" className="form-label">
                    {language === "en" ? "Password" : "Şifre"}
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="loginPassword"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                {error && (
                  <div className="alert alert-danger d-grid mb-2">{error}</div>
                )}
                <div className="d-grid">
                  <button type="submit" className="btn btn-outline-primary">
                    {language === "en" ? "Log In" : "Giriş Yap"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
