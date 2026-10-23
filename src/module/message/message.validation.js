import z from "zod";
import { generalFeilds } from "../../common/utils/generalFeilds.js";

export const sendMessageSchema = (lang) =>
  z.object({
    body: z.object({
      content: z.string().min(5).max(5000).optional(),
      senderId: generalFeilds.id(lang).optional(),
      receiverId: generalFeilds.id(lang),
    }),
    files: z.array(generalFeilds.file(lang).optional()),
  });
