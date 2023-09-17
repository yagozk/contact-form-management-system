import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [colorMode, setColorMode] = useState("dark");
  const [language, setLanguage] = useState("en");
  const [userRole, setUserRole] = useState("");
  const [userName, setUserName] = useState("");
  const [userImgBase64, setUserImgBase64] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("theme")) {
      setColorMode(localStorage.getItem("theme"));
    }
    if (localStorage.getItem("language")) {
      setLanguage(localStorage.getItem("language"));
    }
    setUserRole(JSON.parse(localStorage.getItem("user"))?.role ?? "");
    setUserName(JSON.parse(localStorage.getItem("user"))?.username ?? "");
    setUserImgBase64(
      JSON.parse(localStorage.getItem("user"))?.base64Photo ?? ""
    );

    console.log(userImgBase64);
  }, [userRole, userName, userImgBase64, colorMode]);

  const handleLogout = () => {
    const token = localStorage.getItem("token");

    axios
      .post("http://localhost:5165/api/user/logout", null, {
        headers: {
          token,
        },
      })
      .then((res) => {
        console.log(res);
        setUserRole("");
        localStorage.removeItem("user");
        navigate("/login");
      })
      .catch((err) => {
        console.error("Could not log out: ", err);
      });
  };

  return (
    <div>
      {(userRole == "admin" || userRole == "reader") && (
        <nav
          className={`navbar navbar-expand-lg ${
            colorMode === "dark"
              ? "navbar-dark bg-dark text-white"
              : "navbar-light bg-light text-dark"
          } `}
        >
          <div className="container-fluid">
            <Link className="navbar-brand text-warning fw-bold" to="/">
              🐻 {language === "en" ? "CFM Home" : "CFM Anasayfa"}
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              {userRole == "admin" && (
                <ul className="navbar-nav me-auto">
                  <li className="nav-item">
                    <Link className="nav-link" to="/messages">
                      {language === "en" ? "Messages" : "Mesajlar"}
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/users">
                      {language === "en" ? "Users" : "Kullanıcılar"}
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/reports">
                      {language === "en" ? "Reports" : "Raporlar"}
                    </Link>
                  </li>
                </ul>
              )}
              {userRole == "reader" && (
                <ul className="navbar-nav me-auto">
                  <li className="nav-item">
                    <Link className="nav-link" to="/messages">
                      {language === "en" ? "Messages" : "Mesajlar"}
                    </Link>
                  </li>
                </ul>
              )}
              <ul className="navbar-nav mb-2 mb-lg-0">
                <li className="nav-item dropdown me-5 dropstart">
                  <Link
                    className="nav-link dropdown-toggle"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <img
                      src={userImgBase64}
                      alt="Profile Pic"
                      className="rounded-circle img-fluid"
                      style={{ width: "30px", height: "30px" }}
                    />
                  </Link>
                  <ul className="dropdown-menu dropstart">
                    <li className="text-center">
                      <span className="dropdown-item-text">{userName}</span>
                    </li>
                    <hr />
                    <li className="dropdown-item d-flex justify-content-center">
                      <SwitchThemeBtn />
                    </li>
                    <hr />
                    <li className="dropdown-item">
                      <label>
                        {language === "en" ? "Change Language" : "Dil Değiştir"}
                      </label>
                      <SwitchLanguageBtn />
                    </li>
                    <hr />
                    <li className="dropdown-item d-grid">
                      <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={handleLogout}
                      >
                        {language === "en" ? "Log Out" : "Çıkış Yap"}
                      </button>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      )}
      {!userRole && (
        <nav
          className={`navbar navbar-expand-lg ${
            colorMode === "dark"
              ? "navbar-dark bg-dark text-white"
              : "navbar-light bg-light text-dark"
          } `}
        >
          <div className="container-fluid">
            <Link className="navbar-brand text-warning fw-bold" to="/">
              🐻 {language === "en" ? "CFM Home" : "CFM Anasayfa"}
            </Link>
            <div className="collapse navbar-collapse" id="navbarNav">
              <button type="button" className="btn btn-outline-primary">
                <Link className="nav-link" to="/login">
                  {language === "en" ? "Log In" : "Giriş Yap"}
                </Link>
              </button>
            </div>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <ul className="navbar-nav mb-2 mb-lg-0">
              <SwitchLanguageBtn />
              <SwitchThemeBtn />
            </ul>
          </div>
        </nav>
      )}
    </div>
  );

  function SwitchLanguageBtn() {
    return (
      <button
        type="button"
        className="btn btn-outline-primary mx-4"
        onClick={() => {
          if (language === "en") {
            localStorage.setItem("language", "tr");
            setLanguage("tr");
            window.location.reload();
          } else {
            localStorage.setItem("language", "en");
            setLanguage("en");
            window.location.reload();
          }
        }}
      >
        {language === "en" ? "🇹🇷" : "🇬🇧"}
      </button>
    );
  }

  function SwitchThemeBtn() {
    return (
      <button
        type="button"
        className={`btn btn-outline-${colorMode === "dark" ? "light" : "dark"}`}
        onClick={() => {
          if (colorMode === "dark") {
            localStorage.setItem("theme", "light");
            setColorMode("light");
          } else {
            localStorage.setItem("theme", "dark");
            setColorMode("dark");
          }
          window.location.reload();
        }}
      >
        {colorMode === "dark" ? (
          <span class="material-symbols-outlined">light_mode</span>
        ) : (
          <span class="material-symbols-outlined">dark_mode</span>
        )}
      </button>
    );
  }
}
