import { z } from "zod";
import { generalFeilds } from "../../common/utils/generalFeilds.js";

export const sendConversationMessageSchema = (lang) =>
  z.object({
    params: z.object({
      conversationId: generalFeilds.id(lang),
    }),
    body: z.object({
      content: z.string().min(1).max(5000),
    }),
  });

export const getConversationMessagesSchema = (lang) =>
  z.object({
    params: z.object({
      conversationId: generalFeilds.id(lang),
    }),
    query: z
      .object({
        page: generalFeilds.page(lang).optional(),
        limit: generalFeilds.limit(lang).optional(),
      })
      .optional(),
  });
