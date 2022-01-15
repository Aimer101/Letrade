import Navbar from "../../component/navbar/Navbar";
import "./home.scss";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContext";

const StockDetail = ({ props, name }) => {
  const [api, setApi] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(
        `https://cloud.iexapis.com/stable/stock/${name}/quote?token=${process.env.REACT_APP_iexToken}`
      );
      setApi(res.data);
    };
    fetchData();
  }, []);
  return (
    <>
      <div className="tableContent">
        <span>{name}</span>
        <span style={{ textAlign: "center" }}>{api.companyName}</span>
        <span>{props.quantity}</span>
        <span>${(props.total / props.quantity).toFixed(2)}</span>
        <span>${api.latestPrice?.toFixed(2)}</span>
        <span>${props.total.toFixed(2)}</span>
      </div>
      <hr />
    </>
  );
};

export default function Home() {
  let { user } = useContext(UserContext);
  const [stock, setStock] = useState({});
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setStock(JSON.parse(user.user.stock));
  }, [user]);

  useEffect(() => {
    stock &&
      Object.keys(stock).map(i => setTotal(prev => prev + stock[i].total));
  }, [stock]);
  return (
    user && (
      <>
        <div className="test">
          <Navbar />
          <div className="Container">
            <div className="wrapper">
              <div className="top">
                <h1>PORTFOLIO</h1>
              </div>
              <div className="bottom">
                <div className="tableTitle">
                  <span>Symbol</span>
                  <span>Name</span>
                  <span>Shares</span>
                  <span>Avg. Price</span>
                  <span>Market Price</span>
                  <span>Total</span>
                </div>
                {Object.keys(stock).map(i => (
                  <StockDetail props={stock[i]} name={i} />
                ))}
                <div className="tableContent">
                  <span>CASH BALANCE</span>
                  <span> </span>
                  <span> </span>
                  <span> </span>
                  <span> </span>
                  <span>${user.user.balance.toFixed(2)}</span>
                </div>
                <hr />

                <div className="tableContent">
                  <span></span>
                  <span> </span>
                  <span> </span>
                  <span> </span>
                  <span> </span>
                  <span style={{ fontWeight: "800", fontSize: "2.2rem" }}>
                    ${(total + user.user.balance).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  );
}
