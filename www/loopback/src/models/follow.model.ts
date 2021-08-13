import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {
    type: 'edge'
  }
})
export class Follow extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'boolean',
    default: true,
  })
  notification?: boolean;

  @property({
    type: 'string',
    required: true,
    neptune: {
      columnName: 'from'
    },
  })
  follower: string;

  @property({
    type: 'string',
    required: true,
    neptune: {
      columnName: 'to'
    },
  })
  followee: string;

  @property({
    type: 'date',
    required: true,
  })
  createdAt: string;

  constructor(data?: Partial<Follow>) {
    super(data);
  }
}

export interface FollowRelations {
  // describe navigational properties here
}

export type FollowWithRelations = Follow & FollowRelations;
