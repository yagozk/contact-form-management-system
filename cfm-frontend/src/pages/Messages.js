import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Modal } from "react-bootstrap";

export default function Messages() {
  const [userRole, setUserRole] = useState("");
  const [messages, setMessages] = useState([]);
  const [colorMode, setColorMode] = useState("dark");
  const [outerCardBgColor, setOuterCardBgColor] =
    useState("rgba(0, 0, 0, 0.2)");
  const [innerCardBgColor, setInnerCardBgColor] =
    useState("rgba(0, 0, 0, 0.4)");
  const navigate = useNavigate();
  const [language, setLanguage] = useState("en");
  const [showModal, setShowModal] = useState(false);
  const [messageIdToBeDeleted, setMessageIdToBeDeleted] = useState("");
  const [messageDeleteErrorAlert, setMessageDeleteErrorAlert] = useState(false);
  const [sortBy, setSortBy] = useState("date_desc");
  const [filterOptions, setFilterOptions] = useState({
    gender: [],
    status: [],
  });
  const [messageLimit, setMessageLimit] = useState(10);

  const openModal = () => {
    setShowModal(true);
    setMessageDeleteErrorAlert(false);
  };

  const closeModal = () => {
    setShowModal(false);
    setMessageIdToBeDeleted("");
    setMessageDeleteErrorAlert(false);
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

  const fetchMessages = () => {
    setUserRole(JSON.parse(localStorage.getItem("user"))?.role ?? "");
    const token = localStorage.getItem("token");
    const requestData = {
      sortBy,
      filterOptions,
      messageLimit,
    };

    axios
      .post("http://localhost:5165/api/messages/filter", requestData, {
        headers: {
          token,
        },
      })
      .then((res) => {
        setMessages(res.data.data.messages);
        console.log("Messages received: ", res);
      })
      .catch((err) => {
        console.error("Error while receiving messages: ", err);
      });
  };

  useEffect(() => {
    fetchMessages();
  }, [messageIdToBeDeleted, sortBy, filterOptions, messageLimit]);

  const navigateToMessageDetails = (messageId) => {
    navigate(`/messages/${messageId}`);
  };

  const handleDeleteMessage = () => {
    const token = localStorage.getItem("token");

    axios
      .post(
        `http://localhost:5165/api/message/delete/${messageIdToBeDeleted}`,
        null,
        {
          headers: { token },
        }
      )
      .then((res) => {
        console.log("Message succesfully deleted: ", res);
        setMessageIdToBeDeleted("");
        closeModal();
      })
      .catch((err) => {
        console.error("Error while deleting the message: ", err);
        setMessageIdToBeDeleted("");
        setMessageDeleteErrorAlert(true);
      });
  };

  const handleGenderFilterChange = (value) => {
    const updatedGenderOptions = filterOptions.gender.includes(value)
      ? filterOptions.gender.filter((item) => item !== value)
      : [...filterOptions.gender, value];

    setFilterOptions({
      ...filterOptions,
      gender: updatedGenderOptions,
    });
  };

  const handleReadStatusFilterChange = (value) => {
    const updatedReadOptions = filterOptions.status.includes(value)
      ? filterOptions.status.filter((item) => item !== value)
      : [...filterOptions.status, value];

    setFilterOptions({
      ...filterOptions,
      status: updatedReadOptions,
    });
  };

  useEffect(() => {
    const scrollContainer = document.querySelector(".scrollable-table") ?? null;

    function handleScroll() {
      if (scrollContainer) {
        console.log("Scrolling...");
        const isBottom =
          scrollContainer.scrollTop + scrollContainer.clientHeight + 50 >=
          scrollContainer.scrollHeight;

        if (isBottom) {
          console.log("Bottom of the container reached. New messages fetched.");
          setMessageLimit((prevMessageLimit) => prevMessageLimit + 5);
        }
      }
    }

    scrollContainer.addEventListener("scroll", handleScroll);
    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <div
          className="card"
          style={{
            backgroundColor: outerCardBgColor,
          }}
        >
          <div className="card-header">
            <h3>{language === "en" ? "Messages" : "Mesajlar"}</h3>
          </div>
          <div className="card-body">
            <div className="row mb-4 d-flex align-items-center">
              <div className="col-3">
                <div className="form-group">
                  <label htmlFor="sortBy">
                    {language === "en" ? "Sort by:" : "Sırala:"}
                  </label>
                  <select
                    id="sortBy"
                    className="form-control"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="date_desc">
                      {language === "en"
                        ? "Date - Descending"
                        : "Tarih - Büyükten Küçüğe"}
                    </option>
                    <option value="date_asc">
                      {language === "en"
                        ? "Date - Ascending"
                        : "Tarih - Küçükten Büyüğe"}
                    </option>
                    <option value="sender_name_asc">
                      {language === "en"
                        ? "Sender Name - Ascending"
                        : "Gönderici Adı - Küçükten Büyüğe"}
                    </option>
                    <option value="sender_name_desc">
                      {language === "en"
                        ? "Sender Name - Descending"
                        : "Gönderici Adı - Büyükten Küçüğe"}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-4">
                <div className="form-group">
                  <label>
                    {language === "en" ? "Filter by:" : "Filtrele:"}
                  </label>
                  <div>
                    <div className="form-check form-check-inline">
                      <input
                        type="checkbox"
                        id="male"
                        value="male"
                        checked={filterOptions.gender.includes("male")}
                        onChange={() => handleGenderFilterChange("male")}
                        className="form-check-input"
                      />
                      <label htmlFor="male" className="form-check-label">
                        {language === "en" ? "Male" : "Erkek"}
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        type="checkbox"
                        id="female"
                        value="female"
                        checked={filterOptions.gender.includes("female")}
                        onChange={() => handleGenderFilterChange("female")}
                        className="form-check-input"
                      />
                      <label htmlFor="female" className="form-check-label">
                        {language === "en" ? "Female" : "Kadın"}
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        type="checkbox"
                        id="read"
                        value="read"
                        checked={filterOptions.status.includes("read")}
                        onChange={() => handleReadStatusFilterChange("read")}
                        className="form-check-input"
                      />
                      <label htmlFor="read" className="form-check-label">
                        {language === "en" ? "Read" : "Okundu"}
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        type="checkbox"
                        id="unread"
                        value="unread"
                        checked={filterOptions.status.includes("unread")}
                        onChange={() => handleReadStatusFilterChange("unread")}
                        className="form-check-input"
                      />
                      <label htmlFor="unread" className="form-check-label">
                        {language === "en" ? "Unread" : "Okunmadı"}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="table-responsive card scrollable-table"
              style={{
                backgroundColor: innerCardBgColor,
                maxHeight: "400px",
                overflowY: "scroll",
              }}
            >
              <table
                className={`table table-hover table-${colorMode} table-borderless`}
              >
                <thead>
                  <tr>
                    <th>{language === "en" ? "Status" : "Durum"}</th>
                    <th>{language === "en" ? "Name" : "İsim"}</th>
                    <th>{language === "en" ? "Message" : "Mesaj"}</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {messages.map((message) => (
                    <tr
                      key={message.id}
                      className="clickable-row"
                      onClick={() => {
                        navigateToMessageDetails(message.id);
                      }}
                    >
                      <td
                        className={
                          message.read == "true"
                            ? "text-secondary"
                            : "text-warning"
                        }
                      >
                        {language === "en"
                          ? message.read == "true"
                            ? "Read"
                            : "Unread"
                          : message.read == "true"
                          ? "Okundu"
                          : "Okunmadı"}
                      </td>
                      <td
                        className={
                          message.read == "true" ? "text-secondary" : ""
                        }
                      >
                        {message.name}
                      </td>
                      <td
                        className={
                          message.read == "true" ? "text-secondary" : ""
                        }
                      >
                        {message.message}
                      </td>
                      <td
                        className={
                          message.read == "true" ? "text-secondary" : ""
                        }
                      >
                        {userRole === "admin" && (
                          <span
                            className="material-symbols-outlined delete-icon"
                            onClick={(event) => {
                              event.stopPropagation();
                              setMessageIdToBeDeleted(message.id);
                              openModal();
                            }}
                          >
                            delete
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
          {messageDeleteErrorAlert && (
            <div className="alert alert-danger">
              {language === "en"
                ? "Message could not be deleted. Please check server connection"
                : "Mesaj silinemedi. Lütfen sunucu bağlantısını kontrol edin."}
            </div>
          )}
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
}
