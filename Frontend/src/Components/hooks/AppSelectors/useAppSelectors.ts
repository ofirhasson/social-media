import { useAppSelector } from "../../../Redux/Store";

export const useAppSelectors = () => {
//   const posts = useAppSelector((state) => state?.posts);
  const userId = useAppSelector((state) => state?.auth?._id);
  const user = useAppSelector((state) => state?.auth);
  const currentUser = useAppSelector((state) => state?.auth);
//   const users = useAppSelector((state) => state?.users);

  return {
    // posts,
    userId,
    user,
    currentUser,
    // users
  };
};


