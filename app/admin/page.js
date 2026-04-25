import { cookies } from "next/headers";

export default async function AdminPage() {
  const cookieStore = cookies();
  const password = cookieStore.get("admin_password")?.value;

  if (password !== process.env.ADMIN_PASSWORD) {
    return (
      <main style={{ textAlign: "center", marginTop: 100 }}>
        <h2>Admin Access</h2>
        <form method="POST" action="/api/admin-login">
          <input
            type="password"
            name="password"
            placeholder="Enter password"
            style={{ padding: 10, marginRight: 10 }}
          />
          <button type="submit">Enter</button>
        </form>
      </main>
    );
  }

  const usersRes = await fetch(
    `${process.env.SUPABASE_URL}/rest/v1/users?select=*&order=created_at.desc`,
    {
      headers: {
        apikey: process.env.SUPABASE_SECRET_KEY,
        Authorization: `Bearer ${process.env.SUPABASE_SECRET_KEY}`,
      },
      cache: "no-store",
    }
  );

  const eventsRes = await fetch(
    `${process.env.SUPABASE_URL}/rest/v1/user_events?select=*&order=created_at.desc`,
    {
      headers: {
        apikey: process.env.SUPABASE_SECRET_KEY,
        Authorization: `Bearer ${process.env.SUPABASE_SECRET_KEY}`,
      },
      cache: "no-store",
    }
  );

  const users = await usersRes.json();
  const events = await eventsRes.json();

  return (
    <main style={{ padding: 30 }}>
      <h1>MagMasV Admin Dashboard</h1>

      <h2>Summary</h2>
      <p>Total Users: {users.length}</p>
      <p>Total Events: {events.length}</p>

      <h2>Latest Users</h2>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Source</th>
            <th>Joined</th>
          </tr>
        </thead>
        <tbody>
          {users.slice(0, 10).map((user) => (
            <tr key={user.id}>
              <td>{user.full_name}</td>
              <td>{user.email}</td>
              <td>{user.source}</td>
              <td>{user.created_at}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Latest Activity</h2>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>User ID</th>
            <th>Event</th>
            <th>Path</th>
            <th>Content</th>
            <th>Status</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {events.slice(0, 20).map((event) => (
            <tr key={event.id}>
              <td>{event.user_id}</td>
              <td>{event.event_type}</td>
              <td>{event.path_name}</td>
              <td>{event.content_name}</td>
              <td>{event.status}</td>
              <td>{event.created_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
