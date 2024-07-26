import { Route, Routes, useNavigate } from "react-router-dom";
import { Login } from "../../Pages/LoginArea/Login/Login";
import { Register } from "../../Pages/RegisterArea/Register/Register";
import "./Routing.css";
import { Layout } from "../Layout/Layout";
import { useAppSelector } from "../../../Redux/Store";
import { useEffect } from "react";

export function Routing(): JSX.Element {
  const userId = useAppSelector((state) => state.auth?._id);

  //   const isLogin = userId ?  <Layout /> : <Login />;

  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login if userId is not present and trying to access protected routes
    if (!userId) {
      if (window.location.pathname === "/home") {
        navigate("/login");
      }
    //   navigate("/register");
    }
  }, [userId, navigate]);

  const routes = [
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
    { path: "/home", element: userId ? <Layout /> : <Login /> || <Register /> },
    { path: "/", element: <Login /> },
    { path: "*", element: <Layout /> },
  ];

  return (
    <div className="h-full">
      <Routes>
        {routes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
      </Routes>
    </div>
  );
}
