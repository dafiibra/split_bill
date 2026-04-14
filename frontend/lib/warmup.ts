const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

let warmupFired = false;

export function warmupServer() {
  if (typeof window === "undefined" || warmupFired) return;
  warmupFired = true;

  fetch(`${BASE_URL}/api/health`, { method: "GET", mode: "cors", cache: "no-store" })
    .catch(() => {
      fetch(BASE_URL, { method: "GET", mode: "no-cors", cache: "no-store" }).catch(() => {});
    });
}
