import {Entity, model, property} from '@loopback/repository';

@model({ settings: { type: 'vertex' } })
export class Page extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  location: string;

  @property({
    type: 'array',
    itemType: 'string',
    required: true,
  })
  categories: string[];

  @property({
    type: 'date',
    required: true,
  })
  createdAt: string;

  constructor(data?: Partial<Page>) {
    super(data);
  }
}

export interface PageRelations {
  // describe navigational properties here
}

export type PageWithRelations = Page & PageRelations;
