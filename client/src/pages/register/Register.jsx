import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../helper";
export default function Login() {
  const [cred, setCred] = useState({
    username: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    await axiosInstance.post("/register", cred, {
      headers: {
        Accept: "application/json",
      },
    });
    navigate("/login");
  };

  return (
    <div className="login-container">
      <h1>LETRADE.</h1>
      <div className="login-wrapper">
        <form onSubmit={handleSubmit}>
          <input
            required
            type="text"
            placeholder="Username"
            value={cred.username}
            onChange={e => setCred({ ...cred, username: e.target.value })}
          />
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
          <input
            required
            type="password"
            placeholder="Confirm Password"
            value={cred.password_confirmation}
            onChange={e =>
              setCred({ ...cred, password_confirmation: e.target.value })
            }
          />
          <button>REGISTER</button>
          <span onClick={() => navigate("/login")}>
            Already have an account? Login here
          </span>
        </form>
      </div>
    </div>
  );
}
