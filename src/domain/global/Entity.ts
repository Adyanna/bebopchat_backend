export interface EntityProps {
  id: number;
  createAt: Date;
}

export class Entity {
  readonly id: number;
  readonly createAt: Date;

  //creamos interface para tipar los argumentos y no colocar todo aqui
  constructor(props: EntityProps) {
    this.id = props.id;
    this.createAt = props.createAt;
  }
}
