export const fetchProblems = async () => {
  const response = await fetch(
    "https://quantercise-api.vercel.app/api/questions"
  );
  return response.json();
};

export const fetchProgress = async (mongoId) => {
  const response = await fetch(
    `https://quantercise-api.vercel.app/api/user/progress/${mongoId}`
  );
  return response.json();
};

export const updateProgress = async (mongoId, problemId, progress) => {
  await fetch("https://quantercise-api.vercel.app/api/user/update-progress", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mongoId, problemId, progress }),
  });
};
