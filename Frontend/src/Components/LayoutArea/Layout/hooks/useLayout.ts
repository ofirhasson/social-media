import { useAppSelector } from "../../../../Redux/Store";

export const useLayout = () => {
  const userId = useAppSelector((state) => state?.auth?._id);

  return {
    userId,
  };
};
