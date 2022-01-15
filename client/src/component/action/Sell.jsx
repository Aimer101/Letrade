import "./action.scss";
import { Add, Remove } from "@mui/icons-material";
import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../../context/UserContext";
import { axiosInstance } from "../../helper";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";

export default function Sell({ setAction, details }) {
  const [total, setTotal] = useState(1);
  const container = useRef();
  const { user, dispatch } = useContext(UserContext);
  const max = JSON.parse(user.user.stock)[details.name]?.quantity;
  const [isDisable, setIsDisable] = useState(false);
  const token = JSON.parse(localStorage.getItem("data"))?.token;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    total > max ? setIsDisable(true) : setIsDisable(false);
  }, [total]);

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

  const handleSubmit = async () => {
    setLoading(true);
    const data = {
      userId: user.user.id,
      stock: details.name,
      quantity: total,
      marketPrice: details.price,
    };
    const res = await axiosInstance.put("/sell", data, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

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
        <h1 className="top top-sell">
          <span></span>
          <span>SELL {details.name}</span>
          <span className="close-action" onClick={handleClick}>
            &times;
          </span>
        </h1>
        <div className="middle">
          <h1>${details.price}</h1>
        </div>

        <div className="bottom">
          <div className="amount-top">
            <span className="label-action">Amount: </span>
            <Add
              style={{ fontSize: "2rem" }}
              className="action-icon"
              onClick={() => setTotal(prev => (prev += 1))}
            />
            <input type="number" value={total} />
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
              className="button-sell"
              disabled={isDisable}
              onClick={handleSubmit}
            >
              SELL
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
