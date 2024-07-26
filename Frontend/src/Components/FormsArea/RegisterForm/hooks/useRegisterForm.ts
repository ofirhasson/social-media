import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { UserModel } from "../../../../Models/UserModel";
import { authService } from "../../../../Services/AuthService";
import { tokenDetails } from "../../../../Utils/TokenDetails";
import { notify } from "../../../../Utils/Notify";

export const useRegisterForm = () => {
  const { register, handleSubmit, setValue } = useForm<UserModel>();
  const navigate = useNavigate();

  const navigateToLogin = (): void => {
    navigate("/login");
  };

  const methods = useForm<UserModel>();

  const registerUser = async (user: UserModel): Promise<void> => {
    try {
      user.userDetails.roleId = 2;
      await authService.register(user);

      const token = tokenDetails.getDetailsFromToken("token");
      if (token) {
        const { user } = token;

        notify.success(
          user?.userDetails?.firstName + " " + user?.userDetails?.lastName
        );
      }

      navigate("/home");
    } catch (err: any) {
      notify.error(err);
    }
  };

  return {
    handleSubmit,
    setValue,
    register,
    registerUser,
    navigateToLogin,
    methods
  };
};
