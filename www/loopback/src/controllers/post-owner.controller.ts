import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {PostOwner} from '../models';
import {PostOwnerRepository} from '../repositories';

export class PostOwnerController {
  constructor(
    @repository(PostOwnerRepository)
    public postOwnerRepository : PostOwnerRepository,
  ) {}

  @post('/post-owners')
  @response(200, {
    description: 'PostOwner model instance',
    content: {'application/json': {schema: getModelSchemaRef(PostOwner)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PostOwner, {
            title: 'NewPostOwner',
            exclude: ['id'],
          }),
        },
      },
    })
    postOwner: Omit<PostOwner, 'id'>,
  ): Promise<PostOwner> {
    return this.postOwnerRepository.create(postOwner);
  }

  @get('/post-owners/count')
  @response(200, {
    description: 'PostOwner model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(PostOwner) where?: Where<PostOwner>,
  ): Promise<Count> {
    return this.postOwnerRepository.count(where);
  }

  @get('/post-owners')
  @response(200, {
    description: 'Array of PostOwner model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(PostOwner, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(PostOwner) filter?: Filter<PostOwner>,
  ): Promise<PostOwner[]> {
    return this.postOwnerRepository.find(filter);
  }

  @patch('/post-owners')
  @response(200, {
    description: 'PostOwner PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PostOwner, {partial: true}),
        },
      },
    })
    postOwner: PostOwner,
    @param.where(PostOwner) where?: Where<PostOwner>,
  ): Promise<Count> {
    return this.postOwnerRepository.updateAll(postOwner, where);
  }

  @get('/post-owners/{id}')
  @response(200, {
    description: 'PostOwner model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(PostOwner, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(PostOwner, {exclude: 'where'}) filter?: FilterExcludingWhere<PostOwner>
  ): Promise<PostOwner> {
    return this.postOwnerRepository.findById(id, filter);
  }

  @patch('/post-owners/{id}')
  @response(204, {
    description: 'PostOwner PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PostOwner, {partial: true}),
        },
      },
    })
    postOwner: PostOwner,
  ): Promise<void> {
    await this.postOwnerRepository.updateById(id, postOwner);
  }

  @put('/post-owners/{id}')
  @response(204, {
    description: 'PostOwner PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() postOwner: PostOwner,
  ): Promise<void> {
    await this.postOwnerRepository.replaceById(id, postOwner);
  }

  @del('/post-owners/{id}')
  @response(204, {
    description: 'PostOwner DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.postOwnerRepository.deleteById(id);
  }
}
