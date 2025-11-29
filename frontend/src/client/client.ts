//! USE LOGIN IN SESSION CONTEXT INSTEAD
export async function login(username: string, password: string) {
  const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/api/user/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status}, ${await response.text()}`);
  }

  return response.json();
}

export async function getAllPatients() {
  const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/api/patient", {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status}, ${await response.text()}`);
  }

  return response.json();
}
