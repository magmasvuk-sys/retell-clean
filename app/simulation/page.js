"use client";

import { useState } from "react";
import { RetellWebClient } from "retell-client-js-sdk";

export default function SimulationPage() {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function startCall() {
    setLoading(true);
    setStatus("Starting simulation...");

    try {
      const res = await fetch("/api/start-call", {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to start call");
      }

      const client = new RetellWebClient();

      client.on("call_started", () => {
        setStatus("Call started! Speak now.");
      });

      client.on("call_ended", () => {
        setStatus("Simulation ended.");
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
    <main style={{ textAlign: "center", marginTop: 100 }}>
      <h1>Customer Service Simulation</h1>
      <p>Click below to start your live call.</p>

      <button onClick={startCall}>
        {loading ? "Starting..." : "Start Simulation"}
      </button>

      <p>{status}</p>
    </main>
  );
}
