import { MessageType } from "@prisma/client";
import { ValidationError } from "@/domain/errors/ValidationError";

interface GetMessageTypeInput {
    multimediaUrl?: string;
}

export function getMessageType({
    multimediaUrl
}: GetMessageTypeInput): MessageType {

    if (!multimediaUrl) {
        return MessageType.TEXT;
    }

    const ext = multimediaUrl.split(".").pop()?.toLowerCase();

    if (!ext) {
        throw new ValidationError("Invalid multimedia file");
    }

    if (["jpg", "png", "webp"].includes(ext)) {
        return MessageType.IMAGE;
    }

    if (["mp4", "mov"].includes(ext)) {
        return MessageType.VIDEO;
    }

    if (["mp3", "ogg", "wav"].includes(ext)) {
        return MessageType.AUDIO;
    }

    throw new ValidationError("Unsupported multimedia format");
}