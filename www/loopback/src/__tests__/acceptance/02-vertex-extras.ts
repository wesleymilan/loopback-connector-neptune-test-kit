import {Client} from '@loopback/testlab';
import {NeptuneApplication} from '../..';
import {setupApplication, errorToMessage} from './test-helper';
import { strict as assert } from 'assert';
import {PeopleType} from "../specs/types";


describe('Neptune Vertex Extra Methods', () => {
  let app: NeptuneApplication;
  let client: Client;

  let people: PeopleType;
  //let peopleList: PeopleType[];

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
  });

  before('clean up DB', async () => {
    await client
        .get('/test-helper/cleanup-db')
        .expect(204);
  });

  after(async () => {
    await app.stop();
  });

  it('Create People', async () => {

    const data = {
      name: 'John Smith',
      status: true,
      age: 23,
      interests: ['primary','secondary'],
      collection: {'bike':'Harley','items':21,'cars':['ford','gm']},
      createdAt: (new Date()).toISOString()
    };

    const res = await client
      .post('/people')
      .send(data);

    assert.equal(res.status, 200, errorToMessage(res.body.error));

    people = res.body;

  });

  it('Get People', async () => {

    const get = JSON.parse(JSON.stringify(people));

    const res = await client
        .get('/people/' + get.id);

    assert.equal(res.status, 200, errorToMessage(res.body.error));
    assert.deepEqual(res.body, people);

  });

  it('Update People using Save', async () => {

    const peopleData = JSON.parse(JSON.stringify(people));

    peopleData.name = 'Ed Saving';

    const res = await client
        .put('/people/save/' + peopleData.id)
        .send(peopleData);

    assert.equal(res.status, 200, errorToMessage(res.body.error));

    people = res.body;

  });


});
