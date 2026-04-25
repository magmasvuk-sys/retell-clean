import { cookies } from "next/headers";

export async function POST(request) {
  const formData = await request.formData();
  const password = formData.get("password");

  if (password === process.env.ADMIN_PASSWORD) {
    cookies().set("admin_password", password);
  }

  return Response.redirect(new URL("/admin", request.url));
}
