import mongoose from "mongoose";
import * as enums from "../../common/enum/index.js";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: true,
      minlength: [3, "First name must be more than 3 charachters"],
      maxlength: [10, "First name must be less than 20 charachters"],
    },
    lastName: {
      type: String,
      trim: true,
      required: true,
      minlength: [3, "Last name must be more than 3 charachters"],
      maxlength: [10, "Last name must be less than 20 charachters"],
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      required: true,
      lowercase: true,
    },
    password: {
      type: String,
      trim: true,
      required: function () {
        return this.provider == enums.providerEnum.system;
      },
      minlength: [6, "Password name must be more than 6 charachters"],
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,
      enum: Object.values(enums.genderEnum),
    },
    provider: {
      type: Number,
      enum: Object.values(enums.providerEnum),
      default: enums.providerEnum.system,
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: Object.values(enums.roleEnum),
      default: enums.roleEnum.user,
    },
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
    credintialsChangedAt: Number,
    confirmEmail: Boolean,
    deletedAt: Date,
    image: String,
    DOB: Date,
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    strictQuery: true,
    timestamps: true,
    strict: true,
  },
);

userSchema
  .virtual("name")
  .set(function (fullName) {
    const [firstName, lastName] = fullName.split(" ");
    this.firstName = firstName;
    this.lastName = lastName;
  })
  .get(function () {
    return `${this.firstName} ${this.lastName}`;
  });

export const userModel = mongoose.model("user", userSchema, "user");
