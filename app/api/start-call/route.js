export async function POST() {
  try {
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
      { error: "Failed to create web call" },
      { status: 500 }
    );
  }
}
