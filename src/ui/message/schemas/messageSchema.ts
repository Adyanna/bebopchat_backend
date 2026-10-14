import { z } from 'zod';

// export const createMessageValidationSquema = z.object({
//     content: z.string().trim().min(1, "Message content is required"),
//     multimediaUrl: z.url().optional()
// });


export const createMessageValidationSquema = z.object({
    //TO DO: Usar superRefine para evitar mensajes vacios, temporalmente
    //puesto asi para implementar multimedia sin content
    content: z.string().trim(),
    multimediaUrl: z.url().optional()
}).superRefine((data, ctx) => {
    if (!data.content && !data.multimediaUrl) {
        ctx.addIssue({
            code: "custom",
            message: "The message must contain text or a multimedia file",
            path: ["content"]
        });
    }
})
