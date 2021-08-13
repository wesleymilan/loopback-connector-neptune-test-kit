import {inject} from '@loopback/core';
import {DefaultCrudRepository, repository} from '@loopback/repository';
import {NeptuneDataSource} from '../datasources';
import {Post, PostRelations} from '../models';
import {PostRequestType} from "../specs/posts.schema";
import { v4 as uuidv4 } from 'uuid';
import {PostOwnerRepository} from "./post-owner.repository";

export class PostRepository extends DefaultCrudRepository<
  Post,
  typeof Post.prototype.id,
  PostRelations
> {

  t;
  g;
  order;

  constructor(
    @inject('datasources.neptune') dataSource: NeptuneDataSource,
    @repository(PostOwnerRepository) public postOwnerRepository: PostOwnerRepository
  ) {
    super(Post, dataSource);

    this.g = this.dataSource.connector?.g;
    this.order = this.dataSource.connector?.process.order;
    this.t = this.dataSource.connector?.process.t;

  }

  async createRelatedPost(post: PostRequestType) {

    const transaction = await this.dataSource.beginTransaction({
      timeout: 1000 // 1000ms = 1s
    });

    const postData = {
      id: uuidv4(),
      content: post.content,
      createdAt: post.createdAt
    };

    const postOwnerData = {
      owner: 'People/' + post.userId,
      post: 'Post/' + postData.id
    };

    const resPost = [];

    resPost.push(await this.create(postData, {transaction}));

    await this.postOwnerRepository.create(postOwnerData, {transaction});

    const postData2 = {
      id: uuidv4(),
      content: post.content,
      createdAt: post.createdAt
    };

    const postOwnerData2 = {
      owner: 'People/' + post.userId,
      post: 'Post/' + postData2.id
    };

    resPost.push(await this.create(postData2, {transaction}));

    await this.postOwnerRepository.create(postOwnerData2, {transaction});

    await transaction.commit();

    return resPost;

  }

  async getPostsByUser(id: string) {

    const bytecode = this.g.V().hasLabel('People').has(this.t.id, id).out("PostOwner").elementMap().dedup().order().by('createdAt', this.order.asc);

    const res = await this.execute(bytecode, null, { method: 'toList' });

    return res;

  }

}
