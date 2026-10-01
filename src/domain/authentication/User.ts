import { Entity, EntityProps } from '../global/Entity';

interface UserProps extends EntityProps {
    phone: string;
    fullname: string;
    password: string;
    isActive: boolean;
}

export class User extends Entity {
  readonly phone: string;
  readonly fullname: string;
  readonly password: string;
  readonly isActive: boolean;

  constructor(props: UserProps) {
    super({ id: props.id, createAt: props.createAt });
    this.phone = props.phone;
    this.fullname = props.fullname;
    this.password = props.password;
    this.isActive = props.isActive;
  }
}
