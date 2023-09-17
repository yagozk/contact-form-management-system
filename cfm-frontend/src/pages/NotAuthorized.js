import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function NotAuthorized() {
  const [language, setLanguage] = useState("en");
  useEffect(() => {
    if (localStorage.getItem("language")) {
      setLanguage(localStorage.getItem("language"));
    }
  }, [language]);

  return (
    <div className="container m-5">
      <h1>
        {language === "en"
          ? "You are not authorized to view this page."
          : "Bu sayfaya giriş iznine sahip değilsiniz."}
      </h1>
      <h4>
        <Link to="/">
          {language === "en" ? "Take me back home" : "Anasayfaya dön"}
        </Link>
      </h4>
    </div>
  );
}
