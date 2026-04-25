"use client";

import { useState, useEffect } from "react";

export default function EntryPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  const notionLink =
    "https://www.notion.so/End-to-End-Processes_MagMas-V-32e0081441a0802ca4f0de39def3c4cf?source=copy_link";

  useEffect(() => {
    const existingUser = localStorage.getItem("user_data");

    if (existingUser) {
      const user = JSON.parse(existingUser);

      // log returning access
      fetch("/api/platform-entry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: user.full_name,
          email: user.email,
        }),
      });

      // redirect immediately
      window.location.href = notionLink;
    } else {
      setLoading(false);
    }
  }, []);

  async function enterPlatform() {
    if (!fullName || !email) {
      setStatus("Please enter your full name and email.");
      return;
    }

    setStatus("Entering platform...");

    // save locally
    localStorage.setItem(
      "user_data",
      JSON.stringify({
        full_name: fullName,
        email: email,
      })
    );

    const res = await fetch("/api/platform-entry", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        full_name: fullName,
        email: email,
      }),
    });

    if (!res.ok) {
      setStatus("Something went wrong.");
      return;
    }

    window.location.href = notionLink;
  }

  if (loading) {
    return <p style={{ textAlign: "center", marginTop: 100 }}>Loading...</p>;
  }

  return (
    <main style={{ maxWidth: 500, margin: "80px auto", textAlign: "center" }}>
      <h1>MagMasV Workforce Platform</h1>
      <p>Enter your details to access the platform.</p>

      <input
        placeholder="Full name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        style={{ display: "block", width: "100%", padding: 12, marginBottom: 12 }}
      />

      <input
        placeholder="Email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ display: "block", width: "100%", padding: 12, marginBottom: 12 }}
      />

      <button onClick={enterPlatform} style={{ padding: "12px 20px" }}>
        Enter Platform
      </button>

      <p>{status}</p>
    </main>
  );
}
