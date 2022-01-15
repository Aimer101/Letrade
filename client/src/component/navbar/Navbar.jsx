import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../helper";
import "./navbar.scss";
export default function Navbar() {
  const [ticker, setTicker] = useState("");
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem("data"))?.token;

  const handleSubmit = e => {
    e.preventDefault();
    navigate(`/search/${ticker}`);
    setTicker("");
  };

  const handleClick = async () => {
    const res = await axiosInstance.post(
      "/logout",
      {},
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    window.localStorage.removeItem("data");
    window.location.reload();
  };

  return (
    <div className="navbar-container">
      <div className="navbar-wrapper">
        <div className="navbar-left">
          <Link to="/" style={{ textDecoration: "none", color: "white" }}>
            <div className="logo">LETRADE.</div>
          </Link>
        </div>
        <div className="navbar-center">
          <form className="navbar-form" onSubmit={handleSubmit}>
            <input
              type="text"
              className="navbar-input"
              placeholder="Search Ticker"
              value={ticker}
              onChange={e => setTicker(e.target.value)}
            />
          </form>
        </div>
        <div className="navbar-right">
          <div
            className="navbar-menuItem"
            onClick={() => navigate(`/history/1`)}
          >
            HISTORY
          </div>
          <div className="navbar-menuItem" onClick={handleClick}>
            LOGOUT
          </div>
        </div>
      </div>
    </div>
  );
}
