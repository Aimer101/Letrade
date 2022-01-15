import {
  BrowserRouter as Router,
  Routes,
  Route,
  Redirect,
  Navigate,
} from "react-router-dom";
import "./app.scss";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Stock from "./component/stock/Stock";
import History from "./pages/history/History";
import { useContext } from "react";
import { UserContext } from "./context/UserContext";

function App() {
  const { user } = useContext(UserContext);

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
        <Route
          path="/search/:ticker"
          element={user ? <Stock /> : <Navigate to="/login" />}
        />
        <Route
          path="/history/:userId"
          element={user ? <History /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={user === null ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/register"
          element={user === null ? <Register /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
