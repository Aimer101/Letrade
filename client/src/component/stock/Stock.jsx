import React, { useContext, useEffect } from "react";
import Navbar from "../navbar/Navbar";
import "./stock.scss";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { nFormatter } from "../../helper";
import Buy from "../action/Buy";
import Sell from "../action/Sell";
import { UserContext } from "../../context/UserContext";

export default function Stock() {
  const location = useLocation();
  const ticker = location.pathname.split("/")[2];
  const [data, setData] = useState({});
  const [err, setErr] = useState(false);
  const [action, setAction] = useState("");
  const { user } = useContext(UserContext);
  const allStock = Object.keys(JSON.parse(user.user.stock));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `https://cloud.iexapis.com/stable/stock/${ticker}/quote?token=${process.env.REACT_APP_iexToken}`
        );
        err && setErr(false);
        setData(res.data);
      } catch (e) {
        setErr(true);
      }
    };
    fetchData();
  }, [ticker]);

  return (
    <div className="stock-container">
      <Navbar />
      {action === "BUY" && (
        <Buy
          display={"flex"}
          setAction={setAction}
          details={{ name: data.symbol, price: data.latestPrice }}
        />
      )}
      {action === "SELL" && (
        <Sell
          display={"flex"}
          setAction={setAction}
          details={{ name: data.symbol, price: data.latestPrice }}
        />
      )}
      <div className="stock-wrapper">
        {Object.keys(data).length > 0 && !err && (
          <>
            <div className="pageTitle">
              <h1>{data.symbol}</h1>
              <span>{data.companyName}</span>
            </div>
            <div className="stock-detail">
              <div className="left">
                <h1>{data.latestPrice.toFixed(2)}</h1>
                <div className="leftDetail">
                  <p>{data.change}</p>
                  <p>{(data.changePercent * 100).toFixed(2)} %</p>
                </div>
              </div>
              <div className="center">
                <div className="center-1">
                  <span>Open</span>
                  <span>{data.iexOpen ? data.iexOpen.toFixed(2) : "N/A"}</span>
                </div>
                <div className="center-1">
                  <span>Low</span>
                  <span>{data.low ? data.low : "N/A"}</span>
                </div>
                <div className="center-1">
                  <span>Prev. Close</span>
                  <span>{data.previousClose ? data.previousClose : "N/A"}</span>
                </div>
              </div>
              <div className="right">
                <div className="right-1">
                  <span>High</span>
                  <span>{data.high ? data.high : "N/A"}</span>
                </div>
                <div className="right-1">
                  <span>Volume</span>
                  <span>
                    {data.latestVolume
                      ? nFormatter(data.latestVolume, 2)
                      : "N/A"}
                  </span>
                </div>
                <div className="right-1">
                  <span>Market Cap</span>
                  <span>
                    {data.marketCap ? nFormatter(data.marketCap, 2) : "N/A"}
                  </span>
                </div>
              </div>
            </div>
            <div className="stock-action">
              <button onClick={() => setAction("BUY")}>BUY</button>
              <button
                onClick={() => setAction("SELL")}
                disabled={allStock.includes(data.symbol) ? false : true}
              >
                SELL
              </button>
            </div>
          </>
        )}
        {Object.keys(data).length === 0 && !err && (
          <div className="loading">
            <CircularProgress style={{ textAlign: "center" }} />
            <br></br>
            <span className="loadingText">Loading...</span>
          </div>
        )}
        {err && (
          <div className="loading" style={{ fontSize: "3rem" }}>
            Ticker does not exist
          </div>
        )}
      </div>
    </div>
  );
}
