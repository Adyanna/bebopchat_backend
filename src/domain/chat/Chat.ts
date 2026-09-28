import { Entity, EntityProps } from "../global/Entity";
import { ChatType } from "@prisma/client";

export interface PartialChatProps {
    name?: string;
    description?: string;
    type: ChatType;
}

type ChatProps = PartialChatProps & EntityProps;

export class Chat extends Entity {
    readonly name?: string;
    readonly description?: string;
    readonly type: ChatType;

    constructor(props: ChatProps) {
        super({ id: props.id, createAt: props.createAt });
        this.name = props.name;
        this.description = props.description;
        this.type = props.type
    }
}