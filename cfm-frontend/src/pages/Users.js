import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [colorMode, setColorMode] = useState("dark");
  const [cardBgColor, setCardBgColor] = useState("rgba(0, 0, 0, 0.5)");
  const navigate = useNavigate();
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    if (localStorage.getItem("theme")) {
      setColorMode(localStorage.getItem("theme"));
    }
    if (localStorage.getItem("language")) {
      setLanguage(localStorage.getItem("language"));
    }
  }, [colorMode, language]);

  useEffect(() => {
    if (colorMode === "light") {
      setCardBgColor("rgba(255, 255, 255, 0.5)");
    } else {
      setCardBgColor("rgba(0, 0, 0, 0.5)");
    }
  }, [colorMode]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:5165/api/users", {
        headers: {
          token,
        },
      })
      .then((res) => {
        setUsers(res.data.data.users);
        console.log("Users list received: ", res);
      })
      .catch((err) => {
        console.error("Users list could not be received: ", err);
      });
  }, []);

  const navigateToEditUser = (userId) => {
    navigate(`/users/${userId}`);
  };

  const navigateToAddUser = () => {
    navigate("/users/add-new-user");
  };

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <div className="card" style={{ backgroundColor: cardBgColor }}>
          <div className="card-header">
            <div className="row">
              <div className="col-2">
                <h3>{language === "en" ? "Users" : "Kullanıcılar"}</h3>
              </div>
              <div
                className="col offset-6 d-grid"
                style={{ textAlign: "right" }}
              >
                <button
                  className={`btn btn-outline-${
                    colorMode === "dark" ? "warning" : "primary"
                  }`}
                  onClick={navigateToAddUser}
                >
                  {language === "en" ? "Add New User" : "Yeni Kullanıcı Ekle"}
                </button>
              </div>
            </div>
          </div>
          <div className="card-body">
            <table
              className={`table table-${colorMode} align-middle table-borderless`}
            >
              <thead>
                <tr>
                  <th style={{ width: "100px" }}></th>
                  <th>{language === "en" ? "Username" : "Kullanıcı Adı"}</th>
                  <th>{language === "en" ? "Role" : "Rol"}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <img
                        className="rounded-circle img-fluid"
                        style={{ width: "50px", height: "auto" }}
                        src={user.base64Photo}
                        alt="Profile Pic"
                      />
                    </td>
                    <td>{user.username}</td>
                    <td style={{ textTransform: "capitalize" }}>
                      {language === "en"
                        ? user.role
                        : user.role === "reader"
                        ? "Okuyucu"
                        : "Yönetici"}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <span
                        className={`material-symbols-outlined text-${
                          colorMode === "dark" ? "warning" : "primary"
                        } fs-2 clickable-row`}
                        onClick={() => {
                          navigateToEditUser(user.id);
                        }}
                      >
                        manage_accounts
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
