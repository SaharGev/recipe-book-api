export async function login(identifier: string, password: string) {
  const isEmail = identifier.includes("@");

  const response = await fetch("http://localhost:3000/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...(isEmail ? { email: identifier } : { phone: identifier }),
      password,
    }),
  });

  const data = await response.json();
  return data;
}