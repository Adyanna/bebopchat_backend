import { MessageType } from "@prisma/client";
import { EntityProps, Entity } from "../global/Entity";


export interface PartialMessageProps {
    content: string;
    multimediaUrl?: string;
    type: MessageType;
    updatedAt: Date;
}

type MessageProps = PartialMessageProps & EntityProps & {
    chatId: number;
    senderId: number;
};

export class Message extends Entity {
    readonly content: string;
    readonly multimediaUrl?: string;
    readonly type: MessageType;
    readonly chatId: number;
    readonly senderId: number;
    readonly updatedAt: Date;

    constructor(props: MessageProps) {
        super({ id: props.id, createAt: props.createAt });
        this.content = props.content;
        this.multimediaUrl = props.multimediaUrl;
        this.type = props.type;
        this.chatId = props.chatId;
        this.senderId = props.senderId;
        this.updatedAt = props.updatedAt;
    }
}