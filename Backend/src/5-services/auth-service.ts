import { cyber } from "../2-utils/cyber";
import { ValidationError } from "../3-models/client-errors";
import { ICredentialsModel } from "../3-models/credentials-model";
import { RoleModel } from "../3-models/enums";
import { IUserModel, UserModel } from "../3-models/user-model";

class AuthService {
  public async register(user: IUserModel): Promise<string> {
    const errors = user.validateSync();
    if (errors) {
      throw new ValidationError(errors.message);
    }
    const isEmailTaken = await this.isEmailTaken(user.userDetails.email);
    if (isEmailTaken) {
      throw new ValidationError(
        "The email is taken choose a different email please"
      );
    }

    user.userDetails.roleId = RoleModel.User;
    user.userDetails.password = cyber.hashPassword(user.userDetails.password);

    await user.save();

    const token = cyber.getNewToken(user);

    return token;
  }

  public async login(credentials: ICredentialsModel): Promise<string> {
    const errors = credentials.validateSync();
    if (errors) {
      throw new ValidationError(errors.message);
    }

    credentials.password = cyber.hashPassword(credentials.password);

    const user = await UserModel.findOne({
      "userDetails.email": { $eq: credentials.email },
      "userDetails.password": { $eq: credentials.password },
    }).exec();

    // const user = users[0];

    if (!user) {
      throw new ValidationError("Incorrect Email or Password");
    }

    const token = cyber.getNewToken(user);

    return token;
  }

  public async isEmailTaken(email: string): Promise<boolean> {
    const allEmails = await UserModel.find({ "userDetails.email":  email });
    return allEmails.length > 0;
  }
}

export const authService = new AuthService();
