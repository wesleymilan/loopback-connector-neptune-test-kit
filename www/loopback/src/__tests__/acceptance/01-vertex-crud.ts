import {Client} from '@loopback/testlab';
import {NeptuneApplication} from '../..';
import {setupApplication, errorToMessage} from './test-helper';
import { strict as assert } from 'assert';
import {PeopleType} from "../specs/types";

describe('Neptune Vertex CRUD', () => {
  let app: NeptuneApplication;
  let client: Client;

  let people: PeopleType;
  let peopleList: PeopleType[];

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
    peopleList = [];
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

  it('Update People', async () => {

    const update = JSON.parse(JSON.stringify(people));

    update.name = 'Jack Shepard';

    const res = await client
        .put('/people/' + update.id)
        .send(update);

    assert.equal(res.status, 204, errorToMessage(res.body.error));

    people = update;

  });

  it('Check People Update', async () => {

    const get = JSON.parse(JSON.stringify(people));

    const res = await client
        .get('/people/' + get.id);

    assert.equal(res.status, 200, errorToMessage(res.body.error));
    assert.deepEqual(people, res.body);

  });

  it('Update People Partially', async () => {

    const update = JSON.parse(JSON.stringify(people));

    const updateData = {
      name: 'Eliot Parker'
    };

    const res = await client
        .patch('/people/' + update.id)
        .send(updateData);

    assert.equal(res.status, 204, errorToMessage(res.body.error));

    people.name = updateData.name;

  });

  it('Check People Partially Update', async () => {

    const get = JSON.parse(JSON.stringify(people));

    const res = await client
        .get('/people/' + get.id);

    assert.equal(res.status, 200, errorToMessage(res.body.error));

    assert.deepEqual(people, res.body);

  });

  it('Update People Partially With Where', async () => {

    const update = JSON.parse(JSON.stringify(people));

    const updateData = {
      name: 'Eduard Patcher'
    };

    const res = await client
        .patch('/people?where=' + JSON.stringify({id:update.id}))
        .send(updateData);

    assert.equal(res.status, 200, errorToMessage(res.body.error));

    people.name = updateData.name;

  });

  it('Check People Partially Update With Where', async () => {

    const get = JSON.parse(JSON.stringify(people));

    const res = await client
        .get('/people/' + get.id);

    assert.equal(res.status, 200, errorToMessage(res.body.error));

    assert.deepEqual(people, res.body);

  });

  it('Delete People', async () => {

    const get = JSON.parse(JSON.stringify(people));

    const res = await client
        .delete('/people/' + get.id);

    assert.equal(res.status, 204, errorToMessage(res.body.error));

  });

  it('Check Deleted People', async () => {

    const get = JSON.parse(JSON.stringify(people));

    const res = await client
        .get('/people/' + get.id);

    assert.equal(res.status, 404, errorToMessage(res.body.error));

  });

  it('Create 50 People', async () => {

    peopleList = [];

    const data = JSON.stringify({
      name: 'alpha ',
      status: true,
      age: 0,
      createdAt: (new Date()).toISOString()
    });

    let createData;
    peopleList = [];

    for(let c=0; c < 50; c++) {

      createData = JSON.parse(data);
      createData.name = createData.name + c;
      createData.age = c;

      peopleList.push(createData);

    }

    const res = await client
        .post('/people/many')
        .send(peopleList);

    assert.equal(res.status, 200, errorToMessage(res.body.error));

    peopleList = res.body;

  });

  it('Check 50 People', async () => {

    const res = await client
        .get('/people/count');

    assert.equal(res.status, 200, errorToMessage(res.body.error));

    assert.equal(res.body.count, 50);

  });

  it('List People Limit 10', async () => {

    const filter = {
      fields: [
        'id',
        'status',
        'createdAt'
      ],
      limit: 10
    };

    const res = await client
        .get('/people?filter=' + JSON.stringify(filter));

    assert.equal(res.status, 200, errorToMessage(res.body.error));

    assert.equal(res.body.length, 10);

    const keys = Object.keys(res.body[0]);
    assert.deepEqual(keys, ['id','status','createdAt']);

  });

  it('List People Limit 10 Offset 10', async () => {

    const filter = {
      fields: [
        'name',
        'age'
      ],
      order: 'age ASC',
      limit: 10,
      skip: 10
    };

    const res = await client
        .get('/people?filter=' + JSON.stringify(filter));

    assert.equal(res.status, 200, errorToMessage(res.body.error));
    assert.equal(res.body.length, 10);
    assert.equal(res.body[0].age, 10);
  });

  it('Update One People in 50', async () => {

    const update = JSON.parse(JSON.stringify(peopleList[5]));

    update.status = false;

    const res = await client
        .put('/people/' + update.id)
        .send(update);

    assert.equal(res.status, 204, errorToMessage(res.body.error));

    people = update;

  });

  it('Check If People Updated In 50 Did Not Update Other Entries', async () => {

    const filter = {
      limit: 50,
      order: 'age ASC'
    };

    const res = await client
        .get('/people?filter=' + JSON.stringify(filter));

    assert.equal(res.status, 200, errorToMessage(res.body.error));
    assert.equal(res.body.length, 50);

    for(let r = 0; r < peopleList.length; r++) {
      if(r !== 5) {
        assert.deepEqual(peopleList[r], res.body[r]);
      } else {
        peopleList[r] = res.body[r];
      }
    }

  });

  it('Update One People In 50 Partially With Where', async () => {

    const update = JSON.parse(JSON.stringify(peopleList[8]));

    const updateData = {
      name: 'Eduard Patcher'
    };

    const res = await client
        .patch('/people?where=' + JSON.stringify({id:update.id}))
        .send(updateData);

    assert.equal(res.status, 200, errorToMessage(res.body.error));

    peopleList[8].name = updateData.name;

  });

  it('Check If One People Partially Updated In 50 Did Not Update Other Entries', async () => {

    const filter = {
      limit: 50,
      order: 'age ASC'
    };

    const res = await client
        .get('/people?filter=' + JSON.stringify(filter));

    assert.equal(res.status, 200, errorToMessage(res.body.error));
    assert.equal(res.body.length, 50);

    for(let r = 0; r < peopleList.length; r++) {
      assert.deepEqual(peopleList[r], res.body[r]);
    }

  });

  // it('List People Offset 10', async () => {
  //
  //   const filter = {
  //     where: {
  //       'name': 'John Smith'
  //     },
  //     fields: [
  //       'name'
  //     ],
  //     order: 'name ASC',
  //     limit: 10,
  //     skip: 10
  //   };
  //
  //   const res = await client
  //       .get('/people?filter=' + JSON.stringify(filter));
  //   //.expect(200);
  //
  //   console.log('Test Result: ', JSON.stringify(res.body, null, 2));
  //
  //   assert.equal(res.status, 200, errorToMessage(res.body.error));
  //
  // });

});
