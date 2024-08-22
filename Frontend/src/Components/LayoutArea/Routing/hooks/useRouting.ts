import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../../Redux/Store";
import { usersService } from "../../../../Services/UsersService";
import { notify } from "../../../../Utils/Notify";

type useRouting = {
  Login: JSX.Element;
  Layout: JSX.Element;
  Register: JSX.Element;
};

export const useRouting = ({ Layout, Login, Register }: useRouting) => {
  const userId = useAppSelector((state) => state?.auth?._id);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        await usersService.getAllUsers();
      } catch (err: any) {
        notify.error(err);
      }
    };
    fetchAllUsers();
  }, [userId]);

  //   const isLogin = userId ?  <Layout /> : <Login />;

  const routes = [
    { path: "/login", element: Login },
    { path: "/register", element: Register },
    { path: "/home", element: userId ? Layout : Login || Register },
    { path: "/", element: Login },
    { path: "*", element: Layout },
  ];

  useEffect(() => {
    // Redirect to login if userId is not present and trying to access protected routes
    if (!userId) {
      if (window.location.pathname === "/home") {
        navigate("/login");
      }
      //   navigate("/register");
    }
  }, [userId, navigate]);

  return {
    userId,
    routes,
  };
};
