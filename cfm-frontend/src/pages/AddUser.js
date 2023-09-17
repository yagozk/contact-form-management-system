import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";

export default function AddUser() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [userName, setUserName] = useState("");
  const [photo, setPhoto] = useState(null);
  const [fillAllFieldsAlert, setFillAllFieldsAlert] = useState(false);
  const [userAddedAlert, setUserAddedAlert] = useState(false);
  const [userAddedAlertErr, setUserAddedAlertErr] = useState(false);
  const [colorMode, setColorMode] = useState("dark");
  const [cardBgColor, setCardBgColor] = useState("rgba(0, 0, 0, 0.5)");
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
      setCardBgColor("rgba(255, 255, 255, 0.75)");
    } else {
      setCardBgColor("rgba(0, 0, 0, 0.5)");
    }
  }, [colorMode]);

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value.slice(0, 10)); // Limit password to max 10 characters
  };

  const handleUserNameChange = (event) => {
    setUserName(event.target.value);
  };

  const handlePhotoChange = (event) => {
    const selectedPhoto = event.target.files[0];
    setPhoto(selectedPhoto);
  };

  const handleAddUser = () => {
    if (userName && password && photo) {
      const token = localStorage.getItem("token");
      const reader = new FileReader();

      reader.readAsDataURL(photo);
      reader.onloadend = () => {
        const base64Photo = reader.result;

        const newUser = {
          username: userName,
          password: password,
          base64Photo: base64Photo,
        };

        axios
          .post("http://localhost:5165/api/user/add-reader", newUser, {
            headers: { token },
          })
          .then((res) => {
            setUserAddedAlert(true);
            setUserAddedAlertErr(false);
            setFillAllFieldsAlert(false);
            setUserName("");
            setPassword("");
            setPhoto(null);

            console.log("New user successfully added: ", res);
          })
          .catch((err) => {
            setUserAddedAlert(false);
            setUserAddedAlertErr(true);
            setFillAllFieldsAlert(false);

            console.error("User could not be added: ", err);
          });
      };
    } else {
      setFillAllFieldsAlert(true);
      return;
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <div className="card" style={{ backgroundColor: cardBgColor }}>
          <div className="card-header">
            <h3>
              {language === "en" ? "Add New User" : "Yeni Kullanıcı Ekle"}
            </h3>
          </div>
          <div className="card-body">
            <div className="container m-2">
              <div className="row mb-2">
                <div
                  className={`col-3 text-${
                    colorMode === "dark" ? "warning" : "primary"
                  } d-flex align-items-center`}
                >
                  {language === "en" ? "Username:" : "Kullanıcı Adı:"}
                </div>
                <div className="col-9">
                  <input
                    type="text"
                    id="text"
                    className="form-control"
                    value={userName}
                    onChange={handleUserNameChange}
                    maxLength={10}
                    minLength={1}
                  />
                </div>
              </div>
              <hr />
              <div className="row mb-2">
                <div
                  className={`col-3 text-${
                    colorMode === "dark" ? "warning" : "primary"
                  }`}
                >
                  {language === "en" ? "Role:" : "Rol:"}
                </div>
                <div className="col-9" style={{ textTransform: "capitalize" }}>
                  {language === "en" ? "Reader" : "Okuyucu"}
                </div>
              </div>
              <hr />
              <div className="row mb-2">
                <div
                  className={`col-3 text-${
                    colorMode === "dark" ? "warning" : "primary"
                  } d-flex align-items-center`}
                >
                  {language === "en" ? "Password:" : "Şifre:"}
                </div>
                <div className="col-8 d-flex align-items-center">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className="form-control"
                    value={password}
                    onChange={handlePasswordChange}
                    maxLength={10}
                  />
                </div>
                <div className="col d-flex align-items-center justify-content-center clickable-row">
                  <span
                    className="material-symbols-outlined"
                    onClick={handlePasswordToggle}
                  >
                    visibility
                  </span>
                </div>
              </div>
              <hr />
              <div className="row mb-2">
                <div
                  className={`col-3 text-${
                    colorMode === "dark" ? "warning" : "primary"
                  } d-flex align-items-center`}
                >
                  {language === "en" ? "Profile Picture:" : "Profil Fotoğrafı:"}
                </div>
                {photo && (
                  <div className="col-2">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt="Selected Profile Pic"
                      className="rounded-circle img-fluid"
                      style={{ width: "100px", height: "100px" }}
                    />
                  </div>
                )}
                <div className="col d-flex align-items-center">
                  <input
                    type="file"
                    id="photo"
                    className="form-control"
                    accept=".jpg, .jpeg, .png"
                    onChange={handlePhotoChange}
                  />
                </div>
                <div className="row mb-2 mt-4">
                  <button
                    className={`btn btn-outline-${
                      colorMode === "dark" ? "warning" : "primary"
                    }`}
                    onClick={handleAddUser}
                  >
                    {language === "en" ? "Add User" : "Kullanıcı Ekle"}
                  </button>
                </div>
                {fillAllFieldsAlert && (
                  <div className="row mb-2 mt-4">
                    <div className="col">
                      <div className="alert alert-primary">
                        {language === "en"
                          ? "Please make sure to fill all of the fields."
                          : "Lütfen tüm alanları doldurduğunuzdan emin olun."}
                      </div>
                    </div>
                  </div>
                )}
                {userAddedAlert && (
                  <div className="row mb-2 mt-4">
                    <div className="col">
                      <div className="alert alert-success">
                        {language === "en"
                          ? "User added successfully."
                          : "Kullanıcı başarıyla eklendi."}
                      </div>
                    </div>
                  </div>
                )}
                {userAddedAlertErr && (
                  <div className="row mb-2 mt-4">
                    <div className="col">
                      <div className="alert alert-danger">
                        {language === "en"
                          ? "User could not be added."
                          : "Kullanıcı eklenemedi."}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
