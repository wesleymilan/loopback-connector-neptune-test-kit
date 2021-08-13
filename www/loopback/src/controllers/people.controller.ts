import {
  AnyObject,
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
import {People} from '../models';
import {PeopleRepository} from '../repositories';
import {PeopleManyRequestBody, PeopleRequestBody} from '../specs/people.schema';

export class PeopleController {
  constructor(
    @repository(PeopleRepository)
    public peopleRepository : PeopleRepository,
  ) {}

  @post('/people')
  @response(200, {
    description: 'People model instance',
    content: {'application/json': {schema: getModelSchemaRef(People)}},
  })
  async create(
    @requestBody(PeopleRequestBody)
    people: Omit<People, 'id'>,
  ): Promise<People> {
    return this.peopleRepository.create(people);
  }

  @post('/people/many')
  @response(200, {
    description: 'People model instance',
    content: {'application/json': {schema: getModelSchemaRef(People)}},
  })
  async createMany(
      @requestBody(PeopleManyRequestBody)
          people: Omit<People[], 'id'>,
  ): Promise<People[]> {
    return this.peopleRepository.createAll(people);
  }

  @get('/people/count')
  @response(200, {
    description: 'People model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(People) where?: Where<People>,
  ): Promise<Count> {
    return this.peopleRepository.count(where);
  }

  @get('/people')
  @response(200, {
    description: 'Array of People model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(People, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(People) filter?: Filter<People>,
  ): Promise<People[]> {
    return this.peopleRepository.find(filter);
  }

  @patch('/people')
  @response(200, {
    description: 'People PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(People, {partial: true}),
        },
      },
    })
    people: People,
    @param.where(People) where?: Where<People>,
  ): Promise<Count> {
    return this.peopleRepository.updateAll(people, where);
  }

  @get('/people/{id}')
  @response(200, {
    description: 'People model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(People, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(People, {exclude: 'where'}) filter?: FilterExcludingWhere<People>
  ): Promise<People> {
    return this.peopleRepository.findById(id, filter);
  }

  @patch('/people/{id}')
  @response(204, {
    description: 'People PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(People, {partial: true}),
        },
      },
    })
    people: People,
  ): Promise<void> {
    await this.peopleRepository.updateById(id, people);
  }

  @put('/people/{id}')
  @response(204, {
    description: 'People PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() people: People,
  ): Promise<void> {
    await this.peopleRepository.replaceById(id, people);
  }

  @put('/people/save/{id}')
  @response(200, {
    description: 'Update People Using Save success',
  })
  async replaceByIdUsingSave(
      @param.path.string('id') id: string,
      @requestBody() people: People,
  ): Promise<People> {

    const peopleData = await this.peopleRepository.findById(id);

    const keys = Object.keys(people);

    for(const k in keys) {
      // @ts-ignore
      peopleData[keys[k]] = people[keys[k]];
    }

    await this.peopleRepository.save(peopleData);

    return peopleData;

  }

  @del('/people/{id}')
  @response(204, {
    description: 'People DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.peopleRepository.deleteById(id);
  }

  @get('/people/followers')
  @response(200, {
    description: 'Get followers from user ID',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(People),
        },
      },
    },
  })
  async findFollowers(
      @param.query.string('id') id: string,
  ): Promise<People[]> {
    return this.peopleRepository.findFollower(id);
  }

  @get('/people/promise-followers-greater-than')
  @response(200, {
    description: 'Get followers by age',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(People),
        },
      },
    },
  })
  async findFollowerGreaterThanAgePromise(
      @param.query.number('age') age: number,
  ): Promise<AnyObject> {
    return this.peopleRepository.findFollowerGreaterThanAgePromise(age);
  }

  @get('/people/bytecode-followers-greater-than')
  @response(200, {
    description: 'Get followers by age',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(People),
        },
      },
    },
  })
  async findFollowerGreaterThanAgeBytecode(
      @param.query.number('age') age: number,
  ): Promise<AnyObject> {
    return this.peopleRepository.findFollowerGreaterThanAgeBytecode(age);
  }

}
