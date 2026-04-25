export async function POST(request) {
  try {
    const body = await request.json();

    const email = body.email?.trim().toLowerCase();
    const fullName = body.full_name?.trim();

    if (!email || !fullName) {
      return Response.json(
        { error: "Full name and email are required" },
        { status: 400 }
      );
    }

    const existingUserResponse = await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/users?email=eq.${encodeURIComponent(email)}&select=*`,
      {
        headers: {
          apikey: process.env.SUPABASE_SECRET_KEY,
          Authorization: `Bearer ${process.env.SUPABASE_SECRET_KEY}`,
        },
      }
    );

    const existingUsers = await existingUserResponse.json();

    let user = existingUsers[0];

    if (!user) {
      const createUserResponse = await fetch(`${process.env.SUPABASE_URL}/rest/v1/users`, {
        method: "POST",
        headers: {
          apikey: process.env.SUPABASE_SECRET_KEY,
          Authorization: `Bearer ${process.env.SUPABASE_SECRET_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify({
          full_name: fullName,
          email: email,
          source: "MagMasV Notion Entry",
        }),
      });

      const createdUsers = await createUserResponse.json();
      user = createdUsers[0];
    }

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
      {
        error: "Failed to register platform entry",
        detail: String(error),
      },
      { status: 500 }
    );
  }
}
