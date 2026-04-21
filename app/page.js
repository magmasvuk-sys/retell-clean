"use client";

import { useState } from "react";
import { RetellWebClient } from "retell-client-js-sdk";

export default function Home() {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function startCall() {
    setLoading(true);
    setStatus("Starting call...");

    try {
      const res = await fetch("/api/start-call", { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
  throw new Error(
    data.error ||
    data.message ||
    data.detail ||
    JSON.stringify(data)
  );
}

      const client = new RetellWebClient();

      client.on("call_started", () => {
        setStatus("Call started! Allow mic if prompted.");
      });

      client.on("call_ended", () => {
        setStatus("Call ended.");
        setLoading(false);
      });

      client.on("error", (err) => {
        setStatus("Error: " + err.message);
        setLoading(false);
      });

      await client.startCall({
        accessToken: data.access_token,
      });
    } catch (err) {
      setStatus("Error: " + err.message);
      setLoading(false);
    }
  }

  return (
    <main style={{ textAlign: "center", marginTop: 80 }}>
      <h1>Customer Service Simulation</h1>
      <button onClick={startCall}>
        {loading ? "Starting..." : "Start Simulation"}
      </button>
      <p>{status}</p>
    </main>
  );
}
