export async function api(path, options = {}) {
  const isForm = options.body instanceof FormData;
  const response = await fetch("/api" + path, {
    credentials: "include",
    ...options,
    headers: {
      ...(!isForm && options.body
        ? { "Content-Type": "application/json" }
        : {}),
      ...options.headers,
    },
    body: options.body && !isForm ? JSON.stringify(options.body) : options.body,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok)
    throw new Error(
      data.message || "Could not complete the request. Please try again.",
    );
  return data;
}
export function safeUrl(url) {
  return typeof url === "string" && /^(https?:\/\/|\/(?!\/))/.test(url)
    ? url
    : "";
}
