import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../helper";
import "./login.scss";
export default function Login() {
  const [cred, setCred] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await axiosInstance.post("/login", cred, {
      headers: {
        Accept: "application/json",
      },
    });

    window.localStorage.setItem("data", JSON.stringify(res.data));
    window.location.reload();
  };

  return (
    <div className="login-container">
      <h1>LETRADE.</h1>
      <div className="login-wrapper">
        <form onSubmit={handleSubmit}>
          <input
            required
            type="email"
            placeholder="Email"
            value={cred.email}
            onChange={e => setCred({ ...cred, email: e.target.value })}
          />
          <input
            required
            type="password"
            placeholder="Password"
            value={cred.password}
            onChange={e => setCred({ ...cred, password: e.target.value })}
          />
          <button>LOGIN</button>
          <span onClick={() => navigate("/register")}>
            Dont have an account? Register here
          </span>
        </form>
      </div>
    </div>
  );
}
