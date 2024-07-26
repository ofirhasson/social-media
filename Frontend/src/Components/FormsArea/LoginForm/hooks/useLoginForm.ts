import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { CredentialsModel } from "../../../../Models/CredentialsModel";
import { authService } from "../../../../Services/AuthService";
import { notify } from "../../../../Utils/Notify";
import { tokenDetails } from "../../../../Utils/TokenDetails";

export const useLoginForm = () => {
  const { register, handleSubmit } = useForm<CredentialsModel>();
  const navigate = useNavigate();

  const navigateToRegister = (): void => {
    navigate("/register");
  };

  const login = async (user: CredentialsModel): Promise<void> => {
    try {
      await authService.login(user);
      
      const token = tokenDetails.getDetailsFromToken("token");
      if (token) {
        const { user } = token;
        notify.success(
          "Welcome " +
            user?.userDetails?.firstName +
            " " +
            user?.userDetails?.lastName
        );
      }
      navigate("/home");
    } catch (err: any) {
      notify.error(err);
    }
  };

  return {
    login,
    navigateToRegister,
    register,
    handleSubmit,
  };
};
