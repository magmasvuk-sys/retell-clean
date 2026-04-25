"use client";

import { useState } from "react";

export default function EntryPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const notionLink =
    "https://www.notion.so/End-to-End-Processes_MagMas-V-32e0081441a0802ca4f0de39def3c4cf?source=copy_link";

  async function enterPlatform() {
    if (!fullName || !email) {
      setStatus("Please enter your full name and email.");
      return;
    }

    setStatus("Entering platform...");

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
      setStatus("Something went wrong. Please try again.");
      return;
    }

    window.location.href = notionLink;
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
