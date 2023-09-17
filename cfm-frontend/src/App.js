import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  useNavigate,
} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NoPage from "./pages/NoPage";
import useAuthentication from "./components/useAuthentication";
import Users from "./pages/Users";
import Reports from "./pages/Reports";
import Messages from "./pages/Messages";
import { useEffect, useState } from "react";
import NotAuthorized from "./pages/NotAuthorized";
import MessageDetails from "./pages/MessageDetails";
import EditUser from "./pages/EditUser";
import AddUser from "./pages/AddUser";

function App() {
  const userRoles = {
    ADMIN: "admin",
    READER: "reader",
  };
  const [colorMode, setColorMode] = useState("dark");
  useEffect(() => {
    if (localStorage.getItem("theme")) {
      setColorMode(localStorage.getItem("theme"));
      document
        .getElementsByTagName("html")[0]
        .setAttribute("data-bs-theme", colorMode);
    }
  }, [colorMode]);

  return (
    <BrowserRouter>
      <Routes>
        // Public Pages
        <Route index element={<Home />} />
        <Route path="/login" element={<Login />} />
        // Admin and reader pages
        <Route
          path="/messages"
          element={<PrivateRoute roles={[userRoles.ADMIN, userRoles.READER]} />}
        >
          <Route path="/messages" element={<Messages />} />
        </Route>
        <Route
          path="/messages/:messageId"
          element={<PrivateRoute roles={[userRoles.ADMIN, userRoles.READER]} />}
        >
          <Route path="/messages/:messageId" element={<MessageDetails />} />
        </Route>
        // Admin pages
        <Route
          path="/users"
          element={<PrivateRoute roles={[userRoles.ADMIN]} />}
        >
          <Route path="/users" element={<Users />} />
        </Route>
        <Route
          path="/users/:id"
          element={<PrivateRoute roles={[userRoles.ADMIN]} />}
        >
          <Route path="/users/:id" element={<EditUser />} />
        </Route>
        <Route
          path="/users/add-new-user"
          element={<PrivateRoute roles={[userRoles.ADMIN]} />}
        >
          <Route path="/users/add-new-user" element={<AddUser />} />
        </Route>
        <Route
          path="/reports"
          element={<PrivateRoute roles={[userRoles.ADMIN]} />}
        >
          <Route path="/reports" element={<Reports />} />
        </Route>
        // Error pages
        <Route path="/*" element={<NoPage />} />
        <Route path="/unauthorized" element={<NotAuthorized />} />
      </Routes>
    </BrowserRouter>
  );
}

function PrivateRoute(props) {
  const { authenticated, isLoading } = useAuthentication();
  const navigate = useNavigate();
  const userRole = JSON.parse(localStorage.getItem("user"))?.role ?? "";

  useEffect(() => {
    // If authentication is not done yet and not loading, redirect to login
    if (!isLoading && !authenticated) {
      navigate("/login");
    }
  }, [authenticated, isLoading, navigate]);

  // Show a loading state if the validation is still in progress
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // If the authentication is finished but not successful, redirect the user to the return page
  if (!authenticated) {
    return <Navigate to="/login" />;
  }
  // Else, if the authentication is successful but the user is not allowed to enter this page, redirect to Not Authorized page
  else if (!props.roles.includes(userRole)) {
    return <Navigate to="/unauthorized" />;
  }
  // Else, there is no problem. Navigate to the desired page.
  else {
    return <Outlet />;
  }
}

export default App;
