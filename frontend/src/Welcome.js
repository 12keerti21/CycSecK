import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:5000";

export default function Welcome() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.log("No token found");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await res.json();

        if (!res.ok) {
          alert(data.msg || "Failed to fetch user");
          return;
        }

        setUser(data.user);

      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchUser();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Welcome</h2>

      {user ? (
        <p>User ID: {user.id}</p>
      ) : (
        <p>Loading user...</p>
      )}
    </div>
  );
}
