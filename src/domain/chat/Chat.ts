import { Entity, EntityProps } from "../global/Entity";
import { ParticipantRole, ChatType, MessageType } from "@prisma/client";

export interface ChatParticipant {
    userId: number;
    fullname: string;
    role: ParticipantRole;
}

export interface LastMessage {
    id: number;
    content: string;
    multimediaUrl?: string;
    type: MessageType;
    senderId: number;
    chatId: number;
    createdAt: Date;
}


export interface PartialChatProps {
    name?: string;
    description?: string;
    type: ChatType;
    participants: ChatParticipant[];
    lastMessage?: LastMessage;
}



type ChatProps = PartialChatProps & EntityProps;

export class Chat extends Entity {
    readonly name?: string;
    readonly description?: string;
    readonly type: ChatType;
    readonly participants: ChatParticipant[];
    readonly lastMessage?: LastMessage;


    constructor(props: ChatProps) {
        super({ id: props.id, createAt: props.createAt });
        this.name = props.name;
        this.description = props.description;
        this.type = props.type;
        this.participants = props.participants;
        this.lastMessage = props.lastMessage
    }
}