export async function POST() {
  const cookieValue = `token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;

  return Response.json(
    { success: true, data: { message: "Sesión cerrada" } },
    {
      status: 200,
      headers: {
        "Set-Cookie": cookieValue,
      },
    }
  );
}
