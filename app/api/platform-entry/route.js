export async function POST(request) {
  try {
    const body = await request.json();

    const userResponse = await fetch(`${process.env.SUPABASE_URL}/rest/v1/users`, {
      method: "POST",
      headers: {
        apikey: process.env.SUPABASE_SECRET_KEY,
        Authorization: `Bearer ${process.env.SUPABASE_SECRET_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        full_name: body.full_name,
        email: body.email,
        source: "MagMasV Notion Entry",
      }),
    });

    const userData = await userResponse.json();
    const user = userData[0];

    await fetch(`${process.env.SUPABASE_URL}/rest/v1/user_events`, {
      method: "POST",
      headers: {
        apikey: process.env.SUPABASE_SECRET_KEY,
        Authorization: `Bearer ${process.env.SUPABASE_SECRET_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        user_id: user.id,
        event_type: "platform_accessed",
        path_name: "MagMasV Workforce Platform",
        content_name: "Notion Platform Entry",
        status: "entered",
        notes: "User entered MagMasV platform through tracked gateway",
      }),
    });

    return Response.json({ success: true, user_id: user.id });
  } catch (error) {
    return Response.json(
      { error: "Failed to register platform entry", detail: String(error) },
      { status: 500 }
    );
  }
}
