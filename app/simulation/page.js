"use client";

import { useState } from "react";
import { RetellWebClient } from "retell-client-js-sdk";

export default function SimulationPage() {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [startTime, setStartTime] = useState(null);

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
        setStartTime(Date.now());
        setStatus("Call started! Speak now.");
      });

     client.on("call_ended", async () => {
  const endTime = Date.now();
  const duration = startTime
    ? Math.floor((endTime - startTime) / 1000)
    : 0;

  setStatus(`Simulation ended. Duration: ${duration} seconds`);
  setLoading(false);

  try {
    await fetch("/api/start-call", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event: "simulation_completed",
        duration_seconds: duration,
      }),
    });
  } catch (err) {
    console.error("Failed to log duration:", err);
  }
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
