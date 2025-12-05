import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000";

export default function Login() {
  const [id, setId] = useState("");
  const navigate = useNavigate();

  const sendOtp = async () => {
    if (!id.trim()) {
      alert("Enter email / phone first");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/auth/request-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ identifier: id })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.msg || "Something went wrong");
        return;
      }

      localStorage.setItem("identifier", id);
      console.log("OTP requested");
      navigate("/verify");

    } catch (err) {
      console.error(err);
      alert("Network error");
    }
  };
  return (
    <div style={{ padding: "20px" }}>
      <h2>Login</h2>
      
      <input
        value={id}
        onChange={(e) => setId(e.target.value)}
        placeholder="Email or phone"
      />
      <button onClick={sendOtp} style={{ marginLeft: "10px" }}>
        Get OTP
      </button>
    </div>
  );
}
