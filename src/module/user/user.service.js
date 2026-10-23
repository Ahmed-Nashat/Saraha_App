import { enums, userRepo, verifyToken } from "../../common/index.js";

// ---------------------- GET USER BY ID ---------------------
export const getUserById = async (userId) =>
  await userRepo.findById({
    id: userId,
    select: "-password -__v -role -provider -confirmEmail",
  });

// ---------------------- UPDATE -----------------------------
export const updateUser = async ({ userToken, updatedData }) => {
  const user = await verifyToken({
    token: userToken,
    tokenType: enums.tokenTypesEnum.access,
  });

  return await userRepo.findByIdAndUpdate({
    id: user.id,
    data: updatedData,
    options: { new: true },
  });
};

// ---------------------- GET ALL USERS ----------------------
export const getAllusers = async () => await userRepo.find();
