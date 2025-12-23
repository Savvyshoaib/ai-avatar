export const getStoredUserName = (): string | null => {
  if (typeof window === "undefined") {
    return null;
  }

  // 1️⃣ Direct flat keys (old support)
  const tryValue = (...keys: string[]) => {
    for (const key of keys) {
      const value = localStorage.getItem(key);
      if (value && value !== "undefined" && value !== "null") {
        return value;
      }
    }
    return null;
  };

  const direct = tryValue("user_name", "username", "agent_id");
  if (direct) {
    return direct;
  }

  // 2️⃣ New nested structure
  const olivData = localStorage.getItem("olivData");
  if (!olivData) {
    return "dev14";
  }

  try {
    const parsed = JSON.parse(olivData);

    if (parsed && typeof parsed === "object") {
      // ✅ NEW: candidate.username priority
      if (parsed.candidate?.username) {
        return parsed.candidate.username;
      }

      // fallback (old structure support)
      return (
        parsed.user_name ||
        parsed.agent_id ||
        parsed.handle ||
        parsed.username ||
        "shoaib"
      );
    }
  } catch (error) {
    console.error("Invalid olivData JSON", error);
  }

  return "shoaib";
};
