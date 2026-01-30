const API_BASE = "https://rxventory.onrender.com";

export async function createOrder(idToken) {
  const res = await fetch(`${API_BASE}/create-order`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ idToken }),
  });

  if (!res.ok) {
    throw new Error("Create order failed");
  }

  return res.json();
}
