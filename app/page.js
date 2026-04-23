"use client";

import { useState, useEffect } from "react";
import { RetellWebClient } from "retell-client-js-sdk";

export default function Home() {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    let storedUserId = localStorage.getItem("user_id");

    if (!storedUserId) {
      storedUserId = Date.now().toString();
      localStorage.setItem("user_id", storedUserId);
    }

    setUserId(storedUserId);
  }, []);

  async function logEvent(eventType, contentName, statusValue) {
    await fetch("/api/start-call", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event: eventType,
        user_id: userId,
        content_name: contentName,
        status: statusValue,
      }),
    });
  }

  async function startCourse() {
    setStatus("Course started.");

    await logEvent(
      "course_started",
      "Introduction to Customer Service",
      "started"
    );
  }

  async function completeLesson() {
    setStatus("Lesson completed.");

    await logEvent(
      "lesson_completed",
      "Customer Interaction Skills",
      "completed"
    );
  }

  async function startCall() {
    setLoading(true);
    setStatus("Starting call...");

    try {
      const res = await fetch("/api/start-call", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          content_name: "Angry Customer Simulation",
        }),
      });

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

      client.on("call_ended", async () => {
        setStatus("Call ended.");
        setLoading(false);

        try {
          await logEvent(
            "simulation_completed",
            "Angry Customer Simulation",
            "completed"
          );
        } catch (err) {
          console.error("Failed to log completion:", err);
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
    <main style={{ textAlign: "center", marginTop: 80 }}>
      <h1>Customer Service Path</h1>

      <button onClick={startCourse}>Start Course</button>

      <br />
      <br />

      <button onClick={completeLesson}>Complete Lesson</button>

      <br />
      <br />

      <button onClick={startCall}>
        {loading ? "Starting..." : "Start Simulation"}
      </button>

      <p>{status}</p>
    </main>
  );
}
