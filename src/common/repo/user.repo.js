import { userModel } from "../../db/model/index.js";
import BaseRepo from "./base.repo.js";

class UserRepo extends BaseRepo {
  constructor() {
    super(userModel);
  }

  async findByEmail({ email, projection = null }) {
    const user = await this.model.findOne({ email }, projection);
    return user;
  }
}

export const userRepo = new UserRepo();
