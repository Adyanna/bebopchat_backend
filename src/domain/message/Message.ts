
import { MessageType, StatusType } from "@prisma/client";
import { EntityProps, Entity } from "../global/Entity";

export interface MessageUserProps {
    id: number;
    fullname: string;
    photoUrl: string | null;
}

export interface PartialMessageProps {
    content?: string;
    multimediaUrl?: string;
    type: MessageType;
    updatedAt: Date;
    status: StatusType;
}

type MessageProps = PartialMessageProps & EntityProps & {
    chatId: number;
    senderId: number;
    user?: MessageUserProps;
    chatType?: string;
};

export class Message extends Entity {
    readonly content?: string;
    readonly multimediaUrl?: string;
    readonly type: MessageType;
    readonly status: StatusType;
    readonly chatId: number;
    readonly senderId: number;
    readonly updatedAt: Date;
    readonly chatType?: string;
    readonly user?: MessageUserProps;

    constructor(props: MessageProps) {
        super({ id: props.id, createAt: props.createAt });
        this.content = props.content;
        this.multimediaUrl = props.multimediaUrl;
        this.type = props.type;
        this.status = props.status;
        this.chatId = props.chatId;
        this.senderId = props.senderId;
        this.updatedAt = props.updatedAt;
        this.chatType = props.chatType;
        this.user = props.user;
    }
}
