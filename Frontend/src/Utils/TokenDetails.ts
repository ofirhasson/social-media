import { jwtDecode, JwtPayload } from "jwt-decode";
import { UserModel } from "../Models/UserModel";
import { notify } from "./Notify";

interface CustomTokenPayload extends JwtPayload {
  lat: number;
  lon: number;
  user: UserModel;
}

class TokenDetails {
  public getDetailsFromToken = (token:string): CustomTokenPayload | null => {
    const getToken = sessionStorage.getItem(token);
    if (!getToken) {
      return null;
    }
    try {
      const tokenDetails = jwtDecode<CustomTokenPayload>(getToken);
      return tokenDetails;
    } catch (err: any) {
      notify.error(err);
    }
  };
}

export const tokenDetails = new TokenDetails();
