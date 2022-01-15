import { useContext, useState, useEffect } from "react";
import Navbar from "../../component/navbar/Navbar";
import { UserContext } from "../../context/UserContext";
import { axiosInstance } from "../../helper";
import dateFormat from "dateformat";
import CircularProgress from "@mui/material/CircularProgress";

import "./history.scss";

const TableContent = ({ props }) => {
  const [textcolor, setColor] = useState(
    props.action === "BUY" ? "green" : "red"
  );
  return (
    <>
      <div className="tableContent">
        <span>{props.ticker}</span>
        <span>{props.quantity}</span>
        <span>${props.price}</span>
        <span style={{ textAlign: "center" }}>
          {dateFormat(props.created_at)}
        </span>
        <span style={{ color: props.action === "BUY" ? "green" : "red" }}>
          {props.action}
        </span>
        <span style={{ color: props.action === "BUY" ? "red" : "green" }}>
          {props.action === "BUY" ? "- " : "+ "}$
          {(props.price * props.quantity).toFixed(2)}
        </span>
      </div>
      <hr />
    </>
  );
};

export default function History() {
  const { user } = useContext(UserContext);
  const [item, setItem] = useState([]);
  const token = user.token;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const res = await axiosInstance.get(
        `/history/${user.user.id}`,

        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setItem(res.data);
      setLoading(false);
    };

    fetch();
  }, [user]);

  return (
    <div className="hitory-container">
      <Navbar />
      <div className="history-wrapper">
        {loading && (
          <div className="loading">
            <CircularProgress style={{ textAlign: "center" }} />
            <br></br>
            <span className="loadingText">Loading...</span>
          </div>
        )}
        {!loading && (
          <>
            <div className="top">
              <h1>HISTORY</h1>
            </div>

            <div className="bottom">
              <div className="tableTitle">
                <span>Symbol</span>
                <span>Shares</span>
                <span>Market Price</span>
                <span>Time</span>
                <span>Action</span>
                <span>Total</span>
              </div>
              {item?.map(i => (
                <TableContent props={i} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
