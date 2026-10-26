import BaseRepo from "./base.repo.js";
import { conversationModel } from "../../db/model/conversation.model.js";

class ConversationRepo extends BaseRepo {
  constructor() {
    super(conversationModel);
  }
}

export const conversationRepo = new ConversationRepo();
