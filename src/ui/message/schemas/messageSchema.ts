import { z } from 'zod';

export const createMessageValidationSquema = z.object({
    content: z.string().trim().min(1, "Message content is required"),
    multimediaUrl: z.url().optional()
});