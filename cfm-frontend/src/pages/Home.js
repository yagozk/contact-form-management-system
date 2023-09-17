import axios from "axios";
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

export default function Home() {
  const [formData, setFormData] = useState({
    name: "",
    message: "",
    gender: "male",
    country: "",
  });
  const [colorMode, setColorMode] = useState("dark");
  const [cardBgColor, setCardBgColor] = useState("rgba(0, 0, 0, 0.4)");
  const [countries, setCountries] = useState([]);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
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
      setCardBgColor("rgba(255, 255, 255, 0.4)");
    } else {
      setCardBgColor("rgba(0, 0, 0, 0.4)");
    }
  }, [colorMode]);

  useEffect(() => {
    axios
      .get("http://localhost:5165/api/countries")
      .then((res) => {
        setCountries(res.data.data.countries);
      })
      .catch((err) => {
        console.error("Error while fetching the countries", err);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form is being submitted:", formData);

    axios
      .post("http://localhost:5165/api/message/add", formData)
      .then((res) => {
        console.log("Form submitted succesffully:", res.data);
        setShowSuccessAlert(true);
      })
      .catch((err) => {
        console.error("Error sending form data:", err);
        setShowErrorAlert(true);
      });
  };

  return (
    <div>
      <Navbar />
      <div className="container mt-5 d-flex justify-content-center align-items-center">
        <div className="card w-50" style={{ backgroundColor: cardBgColor }}>
          <div className="card-header">
            <h2 className="card-title">
              {language === "en" ? "Contact Us" : "Bizimle İletişime Geçin"}
            </h2>
          </div>
          <div className="card-body">
            {showSuccessAlert && (
              <div
                className="alert alert-primary alert-dismissible fade show mt-3 mb-3"
                role="alert"
              >
                {language === "en"
                  ? "Form submitted successfully."
                  : "Form başarıyla gönderildi."}
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="alert"
                  aria-label="Close"
                  onClick={() => setShowSuccessAlert(false)}
                ></button>
              </div>
            )}

            {showErrorAlert && (
              <div
                className="alert alert-danger alert-dismissible fade show mt-3 mb-3"
                role="alert"
              >
                {language === "en"
                  ? "An error occurred while submitting the form."
                  : "Form gönderilirken hata oluştu."}
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="alert"
                  aria-label="Close"
                  onClick={() => setShowErrorAlert(false)}
                ></button>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  {language === "en" ? "Full Name" : "İsim Soyisim"}
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  maxLength="50"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">
                  {language === "en" ? "Gender" : "Cinsiyet"}
                </label>
                <div className="form-check">
                  <input
                    type="radio"
                    className="form-check-input"
                    id="male"
                    name="gender"
                    value="male"
                    checked={formData.gender === "male"}
                    onChange={handleInputChange}
                  />
                  <label className="form-check-label" htmlFor="male">
                    {language === "en" ? "Male" : "Erkek"}
                  </label>
                </div>
                <div className="form-check">
                  <input
                    type="radio"
                    className="form-check-input"
                    id="female"
                    name="gender"
                    value="female"
                    checked={formData.gender === "female"}
                    onChange={handleInputChange}
                  />
                  <label className="form-check-label" htmlFor="female">
                    {language === "en" ? "Female" : "Kadın"}
                  </label>
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="country" className="form-label">
                  {language === "en" ? "Country" : "Ülke"}
                </label>
                <select
                  className="form-select"
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  required
                >
                  <option value="" disabled>
                    {language === "en" ? "Select a country" : "Bir ülke seçin"}
                  </option>
                  {countries.map((country, index) => (
                    <option key={index} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="message" className="form-label">
                  {language === "en" ? "Message" : "Mesaj"}
                </label>
                <textarea
                  className="form-control"
                  id="message"
                  name="message"
                  rows="5"
                  maxLength="500"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>
              <div className="d-grid">
                <button type="submit" className="btn btn-outline-primary">
                  {language === "en" ? "Submit" : "Gönder"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
