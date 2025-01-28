import axios from "axios";

const BACKEND_DOMAIN =
  process.env.NODE_ENV === "production"
    ? "https://quantercise-api.vercel.app"
    : "http://localhost:4242";

export const fetchProblems = async () => {
  const response = await fetch(`${BACKEND_DOMAIN}/api/questions`);
  return response.json();
};

export const fetchProgress = async (mongoId) => {
  const response = await fetch(
    `${BACKEND_DOMAIN}/api/user/progress/${mongoId}`
  );
  return response.json();
};

export const updateProgress = async (mongoId, problemId, progress) => {
  await fetch(`${BACKEND_DOMAIN}/api/user/update-progress`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mongoId, problemId, progress }),
  });
};
