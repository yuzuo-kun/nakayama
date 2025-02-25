import { useState } from "react";
import { loginUser, registerUser } from "../api";
import { useAuth } from "../context/AuthProvider";
import { Navigate } from "react-router-dom";

const Login = () => {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (user) return <Navigate to="/recipe" />;

  const handleLogin = async () => {
    const data = await loginUser(email, password);
    if (data.success) {
      localStorage.setItem("authToken", data.token);
      window.location.href = "/recipe";
    } else {
      console.error("Login Error:", data.error);
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <input type="email" placeholder="メールアドレス" onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="パスワード" onChange={(e) => setPassword(e.target.value)} />
        <button onClick={handleLogin}>ログイン</button>
      </div>
    </div>
  );
};

export default Login;