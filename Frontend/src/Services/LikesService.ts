import axios from "axios";
import { LikeModel } from "../Models/LikeModel";
import { appConfig } from "../Utils/AppConfig";
import { genericFormData } from "../Utils/GenericFormData";

class LikesService {
    public async addLike(like: LikeModel): Promise<Map<string, LikeModel>> {
        const data = genericFormData.createFormData(like);
        const response = await axios.post<Record<string, LikeModel>>(
            `${appConfig.likesUrl}add-like`,
            data
        );
        // appStore.dispatch(postActionCreators.addLike(response.data));
        const likesMap = new Map<string, LikeModel>(
            Object.entries(response.data)
        );
        return likesMap;
    }

    public async removeLike(like: LikeModel): Promise<Map<string, LikeModel>> {
        // const data = genericFormData.createFormData(like);
        const response = await axios.post<Record<string, LikeModel>>(`${appConfig.likesUrl}delete-like/${like._id}`);
        const likesMap = new Map<string, LikeModel>(
            Object.entries(response.data)
        );
        return likesMap;
        // appStore.dispatch(postActionCreators.removeLike(like));
    }
}

export const likesService = new LikesService();
