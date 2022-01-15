import "./action.scss";
import { Add, Remove } from "@mui/icons-material";
import { useContext, useEffect, useRef, useState } from "react";
import { axiosInstance } from "../../helper";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { CircularProgress } from "@mui/material";

export default function Buy({ setAction, details }) {
  const [total, setTotal] = useState(1);
  const container = useRef();
  const navigate = useNavigate();
  const balance = JSON.parse(localStorage.getItem("data"))?.user.balance;
  const token = JSON.parse(localStorage.getItem("data"))?.token;
  const [disabled, setDisabled] = useState(false);
  const { dispatch } = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  window.onclick = function (event) {
    if (event.target == container.current) {
      container.current.style.display = "none";
      setAction("");
    }
  };

  const handleClick = () => {
    container.current.style.display = "none";
    setAction("");
  };

  useEffect(() => {
    container.current.style.display = "flex";
  }, []);

  useEffect(() => {
    total * details.price > balance ? setDisabled(true) : setDisabled(false);
  }, [balance, total]);

  const handleSubmit = async () => {
    setLoading(true);
    const res = await axiosInstance.put(
      "/buy",
      {
        userId: JSON.parse(localStorage.getItem("data"))?.user.id,
        stock: details.name,
        quantity: total,
        marketPrice: details.price,
        totalPrice: details.price * total,
      },
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    dispatch({
      type: "LOGIN",
      payload: {
        user: res.data,
        token,
      },
    });

    window.localStorage.setItem(
      "data",
      JSON.stringify({
        user: res.data,
        token,
      })
    );
    navigate("/");
  };

  return (
    <div className="action-container" ref={container}>
      <div className="action-wrapper">
        <h1 className="top top-buy">
          <span></span>
          <span>BUY {details.name}</span>
          <span className="close-action" onClick={handleClick}>
            &times;
          </span>
        </h1>
        <div className="middle">
          <h1>${details.price.toFixed(2)}</h1>
        </div>

        <div className="bottom">
          <div className="amount-top">
            <span className="label-action">Amount: </span>
            <Add
              style={{ fontSize: "2rem" }}
              className="action-icon"
              onClick={() => setTotal(prev => (prev += 1))}
            />
            <input type="number" value={total} min="1" />
            <Remove
              style={{ fontSize: "2rem" }}
              className="action-icon"
              onClick={() => total > 1 && setTotal(prev => (prev -= 1))}
            />
          </div>
          <h2>
            Total: ${(Math.round(total * details.price * 100) / 100).toFixed(2)}
          </h2>
          {!loading && (
            <button
              className="button-buy"
              disabled={disabled}
              onClick={handleSubmit}
            >
              BUY
            </button>
          )}
          {loading && (
            <div>
              <CircularProgress />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
