import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000";

export default function Verify() {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const id = localStorage.getItem("identifier");

  const handleVerify = async () => {
    if (!otp.trim()) {
      alert("Enter the OTP");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: id, otp })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.msg || "Invalid OTP");
        return;
      }

      localStorage.setItem("token", data.token);
      navigate("/welcome");

    } catch (err) {
      console.error(err);
      alert("Network issue. Try again.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Verify OTP</h2>

      <input
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter OTP"
        maxLength={6}
      />

      <button
        onClick={handleVerify}
        style={{ marginLeft: "10px" }}
      >
        Verify
      </button>
    </div>
  );
}
