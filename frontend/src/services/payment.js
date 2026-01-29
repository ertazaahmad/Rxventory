export async function createOrder(amount, idToken) {
  const res = await fetch("http://localhost:5000/create-order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount,
      idToken,
    }),
  });

  const data = await res.json();
  return data;
}
