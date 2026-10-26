import { conversationMessageModel } from "../../db/model/conversationMessage.model.js";
import BaseRepo from "./base.repo.js";

class ConversationMessageRepo extends BaseRepo {
  constructor() {
    super(conversationMessageModel);
  }
}

export const conversationMessageRepo = new ConversationMessageRepo();
