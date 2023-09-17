import { useEffect, useState } from "react";
import axios from "axios";

//const JWT_SECRET_KEY = "contact-form-manager-server-secret-key";

export default function useAuthentication() {
  const [authenticated, setAuthenticated] = useState(false);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          // Check if the user is logged in
          const response = await axios.post(
            "http://localhost:5165/api/user/check-login",
            null,
            {
              headers: {
                token,
              },
            }
          );
          console.log(response.status);

          if (response.status == 200) {
            // User is logged in, token is valid
            setAuthenticated(true);
          }
        } catch (error) {
          // Token is invalid or expired.
          console.error("Token validation failed:", error);
          setAuthenticated(false);
          localStorage.removeItem("token");
        }
      } else {
        // Token is missing.
        setAuthenticated(false);
      }
      // Initial run is completed
      setLoading(false);
    };

    validateToken();
  }, []);

  if (!isLoading) {
    return { authenticated };
  } else {
    return { isLoading: true };
  }
}
