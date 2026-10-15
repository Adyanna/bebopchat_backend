import { Entity, EntityProps } from "../global/Entity";

export interface ContactProps extends EntityProps {
    userId: number;
    userContactId: number;
}

export class Contact extends Entity {
    readonly userId: number;
    readonly userContactId: number;

    constructor(props: ContactProps) {
        super({
            id: props.id,
            createAt: props.createAt,
        });

        this.userId = props.userId;
        this.userContactId = props.userContactId;
    }
}