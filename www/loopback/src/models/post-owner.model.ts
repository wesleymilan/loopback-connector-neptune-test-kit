import {Entity, model, property} from '@loopback/repository';

@model({ settings: { type: 'edge' } })
export class PostOwner extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
    neptune: {
      columnName: 'from'
    },
  })
  owner: string;

  @property({
    type: 'string',
    required: true,
    neptune: {
      columnName: 'to'
    },
  })
  post: string;

  constructor(data?: Partial<PostOwner>) {
    super(data);
  }
}

export interface PostOwnerRelations {
  // describe navigational properties here
}

export type PostOwnerWithRelations = PostOwner & PostOwnerRelations;
