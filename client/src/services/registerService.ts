export async function register(
  username: string,
  email: string,
  phone: string,
  password: string
) {
  const response = await fetch("http://localhost:3000/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      email,
      phone: phone || undefined,
      password,
    }),
  });

  const data = await response.json();
  return data;
}