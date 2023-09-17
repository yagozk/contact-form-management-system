import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function NoPage() {
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
          ? "The page you are looking for does not exist"
          : "Aradığınız sayfa mevcut değil"}
      </h1>
      <h4>
        <Link to="/">
          {language === "en" ? "Take me back home" : "Anasayfaya dön"}
        </Link>
      </h4>
    </div>
  );
}
