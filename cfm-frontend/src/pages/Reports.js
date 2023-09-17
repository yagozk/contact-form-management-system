import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import PieChart from "../components/PieChart";
import BarChart from "../components/BarChart";

export default function Reports() {
  const [messages, setMessages] = useState([]);
  const [genderCounts, setGenderCounts] = useState({});
  const [messageCountsByCountry, setMessageCountsByCountry] = useState({});
  const [colorMode, setColorMode] = useState("dark");
  const [cardBgColor, setCardBgColor] = useState("rgba(0, 0, 0, 0.2)");
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
      setCardBgColor("rgba(0, 0, 0, 0.2)");
    }
  }, [colorMode]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:5165/api/messages", { headers: { token } })
      .then((res) => {
        setMessages(res.data.data.messages);
        console.log("Messages received: ", res);
      })
      .catch((err) => {
        console.error("Error while receiving messages: ", err);
      });
  }, []);

  useEffect(() => {
    if (messages) {
      setGenderCounts(countGender(messages));
      setMessageCountsByCountry(countCountries(messages));
    }
  }, [messages]);

  function countGender(messages) {
    let maleCount = 0;
    let femaleCount = 0;

    for (const message of messages) {
      if (message.gender === "male") {
        maleCount++;
      } else if (message.gender === "female") {
        femaleCount++;
      }
    }

    return { male: maleCount, female: femaleCount };
  }

  function countCountries(messages) {
    const messageCounts = {};

    for (const message of messages) {
      const country = message.country;

      if (messageCounts[country]) {
        messageCounts[country]++;
      } else {
        messageCounts[country] = 1;
      }
    }

    return messageCounts;
  }

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <div className="card" style={{ backgroundColor: cardBgColor }}>
          <div className="card-header">
            <h3>{language === "en" ? "Reports" : "Raporlar"}</h3>
          </div>
          <div className="card-body">
            <div className="row mb-2">
              <div className="col-4 d-flex align-items-center">
                <h3 className="card-title text-warning">
                  {language === "en"
                    ? "Message counts by countries:"
                    : "Ülkelere göre mesaj sayıları:"}
                </h3>
              </div>
              <div className="col">
                <div>
                  <BarChart
                    id="country"
                    data={messageCountsByCountry}
                    language={language}
                  />
                </div>
              </div>
            </div>
            <hr />
            <div className="row">
              <div className="col-4 d-flex align-items-center">
                <h3 className="card-title text-warning">
                  {language === "en"
                    ? "Message counts by genders:"
                    : "Cinsiyete göre mesaj sayıları:"}
                </h3>
              </div>
              <div className="col">
                <div>
                  <PieChart
                    id="gender"
                    male={genderCounts.male}
                    female={genderCounts.female}
                    language={language}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
