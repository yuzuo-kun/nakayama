const API_URL = "https://api-kpw4qpfpoq-uc.a.run.app";

// ユーザー登録
export const registerUser = async (email, password) => {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return response.json();
};

// ログイン
export const loginUser = async (email, password) => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return response.json();
};

// 認証状態をチェック
export const verifyUser = async (token) => {
  const response = await fetch(`${API_URL}/verify`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.json();
};

// test
export const test = async () => {
  const response = await fetch(`${API_URL}/test`, {
    method: "POST",
  });
  return response.json();
};