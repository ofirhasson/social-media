import axios from "axios";
import { ReplyModel } from "../Models/ReplyModel";
import { appConfig } from "../Utils/AppConfig";
import { genericFormData } from "../Utils/GenericFormData";

class RepliesService {
  public async addReply(reply: ReplyModel): Promise<void> {
    const data = genericFormData.createFormData(reply);
    await axios.post<ReplyModel>(appConfig.repliesUrl, data);
  }

  public async updateReply(reply: ReplyModel): Promise<void> {
    const data = genericFormData.createFormData(reply);
    await axios.put<ReplyModel>(appConfig.repliesUrl + reply._id, data);
  }

  public async deleteReply(_id: string): Promise<void> {
    await axios.delete<ReplyModel>(appConfig.repliesUrl + _id);
  }
}

export const repliesService = new RepliesService();
