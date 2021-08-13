import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {NeptuneDataSource} from '../datasources';
import {Follow, FollowRelations} from '../models';

export class FollowRepository extends DefaultCrudRepository<
  Follow,
  typeof Follow.prototype.id,
  FollowRelations
> {
  constructor(
    @inject('datasources.neptune') dataSource: NeptuneDataSource
  ) {
    super(Follow, dataSource);
  }
}
