import axios from "axios";
import { LikeModel } from "../Models/LikeModel";
import { appConfig } from "../Utils/AppConfig";
import { genericFormData } from "../Utils/GenericFormData";

class LikesService {
  public async addLike(like: LikeModel): Promise<void> {
    const data = genericFormData.createFormData(like);
    await axios.post<LikeModel>(`${appConfig.likesUrl}add-like`, data);
  }

  public async removeLike(like: LikeModel): Promise<void> {
    const data = genericFormData.createFormData(like);
    await axios.post<LikeModel>(`${appConfig.likesUrl}delete-like`, data);
  }
}

export const likesService = new LikesService();
