import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";

export default function EditUser() {
  const { id } = useParams();
  const [user, setUser] = useState({});
  const [password, setPassword] = useState("");
  const [photo, setPhoto] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordUpdatedAlert, setPasswordUpdatedAlert] = useState(false);
  const [passwordUpdatedAlertErr, setPasswordUpdatedAlertErr] = useState(false);
  const [imgChangedAlert, setImgChangedAlert] = useState(false);
  const [imgChangedErr, setImgChangedErr] = useState(false);
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

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get(`http://localhost:5165/api/user/${id}`, { headers: { token } })
      .then((res) => {
        setUser(res.data.data.user);
        setPassword(res.data.data.user.password);
        console.log("User with id " + id + " successfully retrieved: ", res);
      })
      .catch((err) => {
        console.error("Error while retrieving user: ", err);
      });
  }, []);

  const handlePasswordChange = (event) => {
    setPassword(event.target.value.slice(0, 10)); // Limit password to max 10 characters
  };

  const handlePhotoChange = (event) => {
    const selectedPhoto = event.target.files[0];
    setPhoto(selectedPhoto);
  };

  const handlePhotoUpload = () => {
    const token = localStorage.getItem("token");

    const reader = new FileReader();
    reader.readAsDataURL(photo);
    reader.onloadend = () => {
      const base64Photo = reader.result;

      const updatedUser = {
        ...user,
        base64Photo,
      };
      console.log(updatedUser);

      axios
        .post(`http://localhost:5165/api/user/update/${id}`, updatedUser, {
          headers: { token },
        })
        .then((res) => {
          setUser(updatedUser);
          console.log(
            "User's profile picture has been succesfully updated: ",
            res
          );
          setImgChangedAlert(true);
          setImgChangedErr(false);
        })
        .catch((err) => {
          console.error("Error while updating profile picture: ", err);
          setImgChangedAlert(false);
          setImgChangedErr(true);
        });
    };
  };

  const handleSavePassword = () => {
    if (!password) {
      setPasswordUpdatedAlert(false);
      setPasswordUpdatedAlertErr(true);
      return;
    }

    const token = localStorage.getItem("token");
    const updatedUser = {
      ...user,
      password,
    };

    axios
      .post(`http://localhost:5165/api/user/update/${id}`, updatedUser, {
        headers: { token },
      })
      .then((res) => {
        setUser(updatedUser);
        console.log("User's password have been succesfully updated: ", res);
        setPasswordUpdatedAlert(true);
        setPasswordUpdatedAlertErr(false);
      })
      .catch((err) => {
        console.error("Error while updating user password: ", err);
        setPasswordUpdatedAlert(false);
        setPasswordUpdatedAlertErr(true);
      });
  };

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <div className="card" style={{ backgroundColor: cardBgColor }}>
          <div className="card-header">
            <h3>{language === "en" ? "User Page" : "Kullanıcı Sayfası"}</h3>
          </div>
          <div className="card-body">
            <div className="container m-2">
              <div className="row mb-2">
                <div
                  className={`col-3 text-${
                    colorMode === "dark" ? "warning" : "primary"
                  }`}
                >
                  {language === "en" ? "Username:" : "Kullanıcı Adı:"}
                </div>
                <div className="col-9">{user.username}</div>
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
                  {language === "en"
                    ? user.role
                    : user.role === "admin"
                    ? "Yönetici"
                    : "Okuyucu"}
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
                <div className="col-6 d-flex align-items-center">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className="form-control"
                    value={password}
                    onChange={handlePasswordChange}
                    maxLength={10}
                  />
                </div>
                <div className="col-1 d-flex align-items-center justify-content-center clickable-row">
                  <span
                    className="material-symbols-outlined"
                    onClick={handlePasswordToggle}
                  >
                    visibility
                  </span>
                </div>
                <div className="col d-flex justify-content-center">
                  <button
                    className="btn btn-outline-info"
                    onClick={handleSavePassword}
                  >
                    {language === "en" ? "Change Password" : "Şifreyi Değiştir"}
                  </button>
                </div>
              </div>
              {passwordUpdatedAlert && (
                <>
                  <div className="row mb-2 mt-4">
                    <div className="col offset-3">
                      <div className="alert alert-info">
                        {language === "en"
                          ? "Password changed"
                          : "Şifre değiştirildi"}
                      </div>
                    </div>
                  </div>
                </>
              )}
              {passwordUpdatedAlertErr && (
                <>
                  <div className="row mb-2 mt-4">
                    <div className="col offset-3">
                      <div className="alert alert-danger">
                        {language === "en"
                          ? "New password could not be saved. Make sure the password field is not empty."
                          : "Şifre değiştirilemedi. Şifre alanının boş olmadığından emin olun."}
                      </div>
                    </div>
                  </div>
                </>
              )}
              <hr />
              <div className="row mb-2">
                <div
                  className={`col-3 text-${
                    colorMode === "dark" ? "warning" : "primary"
                  } d-flex align-items-center`}
                >
                  {language === "en" ? "Profile Picture:" : "Profil Resmi:"}
                </div>
                <div className="col-9">
                  <img
                    src={user.base64Photo}
                    className="rounded-circle"
                    alt="Profile Picture"
                    style={{ width: "100px", height: "100px" }}
                  />
                </div>
              </div>
              <hr />
              <div className="row mb-2">
                <div
                  className={`col-3 text-${
                    colorMode === "dark" ? "warning" : "primary"
                  } d-flex align-items-center`}
                >
                  {language === "en"
                    ? "Change Profile Picture:"
                    : "Profil Resmini Değiştir:"}
                </div>
                <div className="col">
                  <input
                    type="file"
                    id="photo"
                    className="form-control"
                    accept=".jpg, .jpeg, .png"
                    onChange={handlePhotoChange}
                  />
                </div>
              </div>
              {photo && (
                <div className="row mb-2 mt-4">
                  <div className="col-2 offset-3">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt="Selected Profile Pic"
                      className="rounded-circle img-fluid"
                      style={{ width: "100px", height: "100px" }}
                    />
                  </div>
                  <div className="col d-flex align-items-center">
                    <button
                      className="btn btn-outline-info"
                      onClick={handlePhotoUpload}
                    >
                      {language === "en"
                        ? "Set as Profile Picture"
                        : "Profil Resmi Olarak Ayarla"}
                    </button>
                  </div>
                  {imgChangedAlert && (
                    <div className="col d-flex align-items-center">
                      <div className="alert alert-info">
                        {language === "en"
                          ? "Profile picture has been changed."
                          : "Profil resmi değiştirildi."}
                      </div>
                    </div>
                  )}
                  {imgChangedErr && (
                    <div className="col d-flex align-items-center">
                      <div className="alert alert-danger">
                        {language === "en"
                          ? "Profile image could not be changed."
                          : "Profil resmi değiştirilemedi."}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
