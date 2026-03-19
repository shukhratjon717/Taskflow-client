import { useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const submit = async () => {
  if (!email || !password) {
    return alert("Email va password kiriting!");
  }

  try {
    setLoading(true);

    if (isLogin) {
      // ✅ LOGIN
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      console.log("LOGIN RESPONSE:", res.data);

      localStorage.setItem("token", res.data.token);

      navigate("/dashboard");
    } else {
      // ✅ REGISTER
      await API.post("/auth/register", {
        email,
        password,
      });

      alert("Account yaratildi! Endi login qiling.");

      setIsLogin(true); // login mode ga o‘tadi
    }
  } catch (err) {
    console.log(err);

    if (err.response) {
      alert(err.response.data.message || "Xatolik!");
    } else {
      alert("Server bilan ulanishda xatolik!");
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-500 to-indigo-600">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-80">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {isLogin ? "Login" : "Sign Up"}
        </h2>

        <input
          className="w-full mb-3 p-2 border rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full mb-4 p-2 border rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={submit}
          disabled={loading}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? "Loading..." : isLogin ? "Login" : "Sign Up"}
        </button>

        <p className="mt-4 text-center text-sm">
          {isLogin ? "Account yo‘qmi?" : "Account bormi?"}
          <span
            className="text-blue-500 cursor-pointer ml-1"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Sign up" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
}