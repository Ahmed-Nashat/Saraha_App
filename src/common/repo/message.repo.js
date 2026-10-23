import BaseRepo from "./base.repo.js";
import { messageModel } from "../../db/model/index.js";

class MessageRepo extends BaseRepo {
  constructor() {
    super(messageModel);
  }
}

export const messageRepo = new MessageRepo();
