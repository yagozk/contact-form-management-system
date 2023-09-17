import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";
import { Modal } from "react-bootstrap";

const MessageDetails = () => {
  const { messageId } = useParams();
  const [message, setMessage] = useState({});
  const [colorMode, setColorMode] = useState("dark");
  const [outerCardBgColor, setOuterCardBgColor] =
    useState("rgba(0, 0, 0, 0.2)");
  const [innerCardBgColor, setInnerCardBgColor] =
    useState("rgba(0, 0, 0, 0.4)");
  const [formattedDate, setFormattedDate] = useState("");
  const [userRole, setUserRole] = useState("");
  const [messageDeletedAlert, setMessageDeletedAlert] = useState(false);
  const [messageDeletedErrorAlert, setMessageDeletedErrorAlert] =
    useState(false);
  const [language, setLanguage] = useState("en");
  const [showModal, setShowModal] = useState(false);

  //This is for formatting the dateTime
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    timeZoneName: "short",
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

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
      setOuterCardBgColor("rgba(255, 255, 255, 0.2)");
      setInnerCardBgColor("rgba(255, 255, 255, 0.4)");
    } else {
      setOuterCardBgColor("rgba(0, 0, 0, 0.2)");
      setInnerCardBgColor("rgba(0, 0, 0, 0.4)");
    }
  }, [colorMode]);

  useEffect(() => {
    setUserRole(JSON.parse(localStorage.getItem("user"))?.role ?? "");
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get(`http://localhost:5165/api/message/${messageId}`, {
        headers: { token },
      })
      .then((res) => {
        setMessage(res.data.data.message);
        console.log(
          "Message with ID " + messageId + " retrieved successfully: ",
          res
        );
      })
      .catch((err) => {
        console.error("Message could not be received: ", err);
      });

    axios
      .post(`http://localhost:5165/api/message/read/${messageId}`, null, {
        headers: { token },
      })
      .then((res) => {
        console.log("Message is now marked as read: ", res);
      })
      .catch((err) => {
        console.log("Message could not be marked as read: ", err);
      });
  }, []);

  useEffect(() => {
    if (message.creationDate) {
      const dateTimeLang = language === "en" ? "en-US" : "tr-TR";
      const dateTime = new Date(message.creationDate);
      const dateTimeFormatted = new Intl.DateTimeFormat(
        dateTimeLang,
        options
      ).format(dateTime);
      setFormattedDate(dateTimeFormatted);
    }
  }, [message]);

  const handleDeleteMessage = () => {
    const token = localStorage.getItem("token");

    axios
      .post(`http://localhost:5165/api/message/delete/${messageId}`, null, {
        headers: { token },
      })
      .then((res) => {
        console.log("Message succesfully deleted: ", res);
        setMessageDeletedAlert(true);
        setMessageDeletedErrorAlert(false);
        closeModal();
      })
      .catch((err) => {
        console.error("Error while deleting the message: ", err);
        setMessageDeletedAlert(false);
        setMessageDeletedErrorAlert(true);
        closeModal();
      });
  };

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <div className="card" style={{ backgroundColor: outerCardBgColor }}>
          <div className="card-header">
            <h3 className="card-title">
              {language === "en" ? "Message Details" : "Mesaj Detayları"}
            </h3>
          </div>
          <div className="card-body">
            <div className="container">
              <div className="row m-2">
                <div className="col-2 text-warning">
                  {language === "en" ? "Message ID:" : "Mesaj ID'si"}
                </div>
                <div className="col-10">{message.id}</div>
              </div>
              <hr />
              <div className="row m-2">
                <div className="col-2 text-warning">
                  {language === "en" ? "Sender Name:" : "Gönderici Adı:"}
                </div>
                <div className="col-10">{message.name}</div>
              </div>
              <hr />
              <div className="row m-2">
                <div className="col-2 text-warning">
                  {language === "en" ? "Message Details:" : "Mesaj Detayları:"}
                </div>
                <div className="col-10">
                  <textarea
                    className="form-control readonly"
                    id="floatingTextarea"
                    value={message.message}
                    style={{ backgroundColor: innerCardBgColor }}
                  />
                </div>
              </div>
              <hr />
              <div className="row m-2">
                <div className="col-2 text-warning">
                  {language === "en" ? "Gender:" : "Cinsiyet:"}
                </div>
                <div className="col-10" style={{ textTransform: "capitalize" }}>
                  {message.gender &&
                    (language === "en"
                      ? message.gender
                      : message.gender === "female"
                      ? "Kadın"
                      : "Erkek")}
                </div>
              </div>
              <hr />
              <div className="row m-2">
                <div className="col-2 text-warning">
                  {language === "en" ? "Country:" : "Ülke:"}
                </div>
                <div className="col-10">{message.country}</div>
              </div>
              <hr />
              <div className="row m-2">
                <div className="col-2 text-warning">
                  {language === "en" ? "Sent Date:" : "Gönderilme Tarihi:"}
                </div>
                <div className="col-10">{formattedDate}</div>
              </div>
              {userRole == "admin" && (
                <>
                  <hr />
                  <div className="d-grid">
                    <button
                      className="btn btn-outline-warning"
                      onClick={() => {
                        openModal();
                      }}
                      disabled={messageDeletedAlert}
                    >
                      {language === "en" ? "Delete Message" : "Mesajı Sil"} 
                    </button>
                  </div>
                  {messageDeletedAlert && (
                    <>
                      <div className="d-grid mt-4 alert alert-warning">
                        {language === "en"
                          ? "Message deleted"
                          : "Mesaj silindi"}
                      </div>
                    </>
                  )}
                  {messageDeletedErrorAlert && (
                    <>
                      <div className="d-grid mt-4 alert alert-danger">
                        {language === "en"
                          ? "Message could not be deleted"
                          : "Mesaj silinemedi"}
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {language === "en" ? "Confirm Deletion" : "Silmeyi Onaylayın"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {language === "en"
            ? "Are you sure you want to delete this message?"
            : "Bu mesajı silmek istediğinizden emin misiniz?"}
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={closeModal}>
            {language === "en" ? "Cancel" : "İptal"}
          </button>
          <button className="btn btn-danger" onClick={handleDeleteMessage}>
            {language === "en" ? "Delete" : "Sil"}
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MessageDetails;
