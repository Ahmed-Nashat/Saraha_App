import { isValidObjectId } from "mongoose";
import { badRequestException, notFoundException } from "../exceptions/index.js";

export default class BaseRepo {
  constructor(model) {
    this.model = model;
  }

  async create({ data }) {
    try {
      return await this.model.create(data);
    } catch (e) {
      ({ e });

      badRequestException(e.message || "Something went wrong");
    }
  }

  async find({
    where = {},
    projection = null,
    options = {},
    skip,
    limit,
    sort,
    select,
    page,
  }) {
    const object = await this.model
      .find(where, projection, options)
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .select(select);

    const count = await this.model.countDocuments(where);
    const totalPages = count / limit;
    const hasNextPage = page != totalPages;

    return {
      object,
      meta: {
        count,
        totalPages,
        currenPage: page,
        hasNextPage,
        hasPreviousPage: page != 1,
      },
    };
  }

  async findOne({ filter = {}, projection = null, options = {} }) {
    const object = await this.model.findOne(filter, projection, options);
    return object;
  }

  async findById({ id, projection = null, options = {}, select }) {
    if (!isValidObjectId(id)) {
      badRequestException("Invalid ID");
    }
    const object = await this.model.findById(id).select(select);
    return object;
  }

  async updateOne({ filter = {}, data = {}, options = {} }) {
    const object = await this.model.updateOne(filter, data, {
      returnDocument: "after",
    });
    if (!object) notFoundException("Object not found");
    return object;
  }

  async findByIdAndUpdate({ id, data = {}, options = { new: true } }) {
    if (!isValidObjectId(id)) {
      badRequestException("Invalid ID");
    }
    const object = await this.model.findByIdAndUpdate(id, data, options);
    if (!object) notFoundException("Object not found");
    return object;
  }

  async findByIdAndDelete({ id, options = {} }) {
    if (!isValidObjectId(id)) {
      badRequestException("Invalid ID");
    }
    const object = await this.model.findByIdAndDelete(id, options);
    if (!object) notFoundException("Object not found");
    return object;
  }

  async deleteOne({ filter = {}, options = {} }) {
    const object = await this.model.deleteOne(filter, options);
    if (!object) notFoundException("Object not found");
    return object;
  }
}
