import { Route, Routes } from "react-router-dom";
import { useRouting } from "./hooks/useRouting";
import { Login } from "../../Pages/LoginArea/Login/Login";
import { Layout } from "../Layout/Layout";
import { Register } from "../../Pages/RegisterArea/Register/Register";
import { memo } from "react";

 function RoutingComponent(): JSX.Element {
  const { routes } = useRouting({ Login: <Login />, Layout: <Layout />, Register: <Register /> });
  return (
    <div className="h-full bg-gray-300 w-full">
      <Routes>
        {routes?.map((route, index) => (
          <Route key={index} path={route?.path} element={route?.element} />
        ))}
      </Routes>
    </div>
  );
}

export const Routing = memo(RoutingComponent)
