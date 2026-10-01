import { Entity, EntityProps } from '../global/Entity';

interface ProfileProps extends EntityProps {
  userId: number;
  photoUrl?: string | null;
  estadoCivil?: number | null;
  genero?: number | null;
  estadoAnimo?: number | null;
  Descripcion?: string | null;
}

export interface ProfileWithUser {
  id: number;
  phone: string;
  fullname: string;
  isActive: boolean;
  createdAt: Date;
  perfil: {
    id: number;
    photoUrl: string | null;
    estadoCivil: number | null;
    genero: number | null;
    estadoAnimo: number | null;
    descripcion: string | null;
    createdAt: Date;
  } | null;
}

export class Profile extends Entity {
  readonly userId: number;
  readonly photoUrl: string | null;
  readonly estadoCivil: number | null;
  readonly genero: number | null;
  readonly estadoAnimo: number | null;
  readonly Descripcion: string | null;

  constructor(props: ProfileProps) {
    super({
      id: props.id,
      createAt: props.createAt,
    });

    this.userId = props.userId;
    this.photoUrl = props.photoUrl ?? null;
    this.estadoCivil = props.estadoCivil ?? null;
    this.genero = props.genero ?? null;
    this.estadoAnimo = props.estadoAnimo ?? null;
    this.Descripcion = props.Descripcion ?? null;
  }
}

