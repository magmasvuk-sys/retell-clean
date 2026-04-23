export async function POST(request) {
  try {
    const event = await request.json().catch(() => ({}));
    await fetch(`${process.env.SUPABASE_URL}/rest/v1/user_events`, {
      method: "POST",
      headers: {
        apikey: process.env.SUPABASE_SECRET_KEY,
        Authorization: `Bearer ${process.env.SUPABASE_SECRET_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal"
      },
      body: JSON.stringify({
        user_id: 1,
event_type:
  event?.event === "simulation_completed"
    ? "simulation_completed"
    : "simulation_started",
path_name: "Customer Service",
content_name: "Angry Customer Simulation",
status:
  event?.event === "simulation_completed"
    ? "completed"
    : "started",
notes:
  event?.event === "simulation_completed"
    ? "Completed from retell-clean web simulation"
    : "Started from retell-clean web simulation"
      })
    });

    const response = await fetch("https://api.retellai.com/v2/create-web-call", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RETELL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        agent_id: process.env.RETELL_AGENT_ID,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return Response.json(data, { status: response.status });
    }

    return Response.json({
      access_token: data.access_token,
      call_id: data.call_id,
    });
  } catch (error) {
    return Response.json(
      {
        error: "Failed to create web call",
        detail: String(error),
      },
      { status: 500 }
    );
  }
}
