import { Types } from "mongoose";
import { z } from "zod";
import { generalFeilds } from "../../common/utils/index.js";

export const getUserByIdSchema = z.object({
  params: z
    .strictObject({
      userId: generalFeilds.id,
    })
    .refine(
      (data) => {
        return Types.ObjectId.isValid(data.userId);
      },
      {
        message: "Invalid objectId",
        path: ["params.userId"],
      },
    ),
  headers: generalFeilds.headers,
  query: z.strictObject({
    phoneNumber: generalFeilds.stringBool().optional(),
  }),
});

export const pagginationSchema = z.object({
  query: z.strictObject({
    page: generalFeilds.page,
    limit: generalFeilds.limit,
  }),
});

export const updateSchema = z.object({
  params: z.strictObject({
    id: generalFeilds.id,
  }),
  body: z.strictObject({
    phoneNumber: generalFeilds.phoneNumber,
    name: generalFeilds.name,
    gender: generalFeilds.gender,
    DOB: generalFeilds.DOB,
  }),
});
