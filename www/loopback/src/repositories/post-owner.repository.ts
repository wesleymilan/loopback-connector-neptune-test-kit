import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {NeptuneDataSource} from '../datasources';
import {PostOwner, PostOwnerRelations} from '../models';

export class PostOwnerRepository extends DefaultCrudRepository<
  PostOwner,
  typeof PostOwner.prototype.id,
  PostOwnerRelations
> {
  constructor(
    @inject('datasources.neptune') dataSource: NeptuneDataSource,
  ) {
    super(PostOwner, dataSource);
  }
}
