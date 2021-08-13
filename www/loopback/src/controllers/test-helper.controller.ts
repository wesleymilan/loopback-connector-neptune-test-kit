// Uncomment these imports to begin using these cool features!

// import {inject} from '@loopback/core';


import {get, response} from "@loopback/rest";
import {repository} from "@loopback/repository";
import {PeopleRepository} from "../repositories";

export class TestHelperController {
  constructor(
      @repository(PeopleRepository) public peopleRepository : PeopleRepository,
  ) {}

  @get('/test-helper/cleanup-db')
  @response(204, {
    description: 'Cleanup DB'
  })
  async cleanupDb(): Promise<void> {

    const g = this.peopleRepository.dataSource.connector?.g;

    if(g) {
      await g.V().hasLabel('PostOwner').drop().iterate();
      await g.V().hasLabel('Post').drop().iterate();
      await g.V().hasLabel('People').drop().iterate();
      await g.V().hasLabel('Page').drop().iterate();
    }

  }

}
