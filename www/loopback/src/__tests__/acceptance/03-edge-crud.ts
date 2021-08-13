import {Client} from '@loopback/testlab';
import {NeptuneApplication} from '../..';
import {setupApplication, errorToMessage} from './test-helper';
import { strict as assert } from 'assert';
import {FollowType, PeopleType} from "../specs/types";

describe('Neptune Edge CRUD', () => {
  let app: NeptuneApplication;
  let client: Client;

  let followList: FollowType[];
  let peopleList: PeopleType[];

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
    peopleList = [];
    followList = [];
  });

  before('clean up DB', async () => {
    await client
        .get('/test-helper/cleanup-db')
        .expect(204);
  });

  after(async () => {
    await app.stop();
  });

  it('Create User One', async () => {

    const data = {
      name: 'User One',
      status: true,
      age: 23,
      createdAt: (new Date()).toISOString()
    };

    const res = await client
      .post('/people')
      .send(data);

    assert.equal(res.status, 200, errorToMessage(res.body.error));

    peopleList[0] = res.body;

  });

  it('Create User Two', async () => {

    const data = {
      name: 'User Two',
      status: true,
      age: 23,
      createdAt: (new Date()).toISOString()
    };

    const res = await client
        .post('/people')
        .send(data);

    assert.equal(res.status, 200, errorToMessage(res.body.error));

    peopleList[1] = res.body;

  });

  it('User One Follows User Two', async () => {

    const data: FollowType = {
      "follower": 'People/' + peopleList[0].id,
      "followee": 'People/' + peopleList[1].id,
      "notification": true,
      "createdAt": (new Date()).toISOString()
    };

    const res = await client
        .post('/follows')
        .send(data);

    assert.equal(res.status, 200, errorToMessage(res.body.error));

    followList[0] = res.body;

  });

  it('Check User One Follows User Two', async () => {

    const get = JSON.parse(JSON.stringify(followList[0]));

    const res = await client
        .get('/follows/' + get.id);

    assert.equal(res.status, 200, errorToMessage(res.body.error));
    assert.deepEqual(res.body, followList[0]);

  });

  it('User Two Follows User One', async () => {

    const data: FollowType = {
      "follower": 'People/' + peopleList[1].id,
      "followee": 'People/' + peopleList[0].id,
      "notification": true,
      "createdAt": (new Date()).toISOString()
    };

    const res = await client
        .post('/follows')
        .send(data);

    assert.equal(res.status, 200, errorToMessage(res.body.error));

    followList[1] = res.body;

  });

  it('Check User Two Follows User One', async () => {

    const get = JSON.parse(JSON.stringify(followList[1]));

    const res = await client
        .get('/follows/' + get.id);

    assert.equal(res.status, 200, errorToMessage(res.body.error));
    assert.deepEqual(res.body, followList[1]);

  });

  it('List Follows', async () => {

    const filter = {};

    const res = await client
        .get('/follows?filter=' + JSON.stringify(filter));

    assert.equal(res.status, 200, errorToMessage(res.body.error));

    assert.equal(res.body.length, 2);

  });

  it('Update Follow', async () => {

    const update = JSON.parse(JSON.stringify(followList[0]));

    update.notification = false;

    const res = await client
        .put('/follows/' + update.id)
        .send(update);

    assert.equal(res.status, 204, errorToMessage(res.body.error));

    followList[0] = update;

  });

  it('Check Follow Update', async () => {

    const get = JSON.parse(JSON.stringify(followList[0]));

    const res = await client
        .get('/follows/' + get.id);

    assert.equal(res.status, 200, errorToMessage(res.body.error));
    assert.deepEqual(followList[0], res.body);

  });

  it('Update Follow Partially', async () => {

    const update = JSON.parse(JSON.stringify(followList[0]));

    const updateData = {
      notification: true
    };

    const res = await client
        .patch('/follows/' + update.id)
        .send(updateData);

    assert.equal(res.status, 204, errorToMessage(res.body.error));

    followList[0].notification = updateData.notification;

  });

  it('Check Follow Partially Updated', async () => {

    const get = JSON.parse(JSON.stringify(followList[0]));

    const res = await client
        .get('/follows/' + get.id);

    assert.equal(res.status, 200, errorToMessage(res.body.error));

    assert.deepEqual(followList[0], res.body);

  });

  it('Update Follow Partially With Where', async () => {

    const update = JSON.parse(JSON.stringify(followList[0]));

    const updateData = {
      createdAt: (new Date()).toISOString()
    };

    const res = await client
        .patch('/follows?where=' + JSON.stringify({id:update.id}))
        .send(updateData);

    assert.equal(res.status, 200, errorToMessage(res.body.error));
    assert.equal(res.body.count, 1, 'Count error');

    followList[0].createdAt = updateData.createdAt;

  });

  it('Check Follow Partially Update With Where', async () => {

    const get = JSON.parse(JSON.stringify(followList[0]));

    const res = await client
        .get('/follows/' + get.id);

    assert.equal(res.status, 200, errorToMessage(res.body.error));

    assert.deepEqual(followList[0], res.body);

  });

  it('Delete Follow', async () => {

    const get = JSON.parse(JSON.stringify(followList[0]));

    const res = await client
        .delete('/follows/' + get.id);

    assert.equal(res.status, 204, errorToMessage(res.body.error));

  });

  it('Check Deleted People', async () => {

    const get = JSON.parse(JSON.stringify(followList[0]));

    const res = await client
        .get('/follows/' + get.id);

    assert.equal(res.status, 404, errorToMessage(res.body.error));

  });

  it('Cleanup DB For Following Tests', async () => {
    await client
        .get('/test-helper/cleanup-db')
        .expect(204);
  });

  it('Create 50 People For Following Tests', async () => {

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

  it('Check 50 People For Following Tests', async () => {

    const res = await client
        .get('/people/count');

    assert.equal(res.status, 200, errorToMessage(res.body.error));

    assert.equal(res.body.count, 50);

  });

  it('Create 49 Following Between People',  async() => {

    followList = [];

    for(let i=0; i<peopleList.length-1; i++) {

      const followData = {
        follower: 'People/' + peopleList[i].id,
        followee: 'People/' + peopleList[i+1].id,
        notification: true,
        createdAt: (new Date()).toISOString()
      };

      const res = await client
          .post('/follows')
          .send(followData);

      assert.equal(res.status, 200, errorToMessage(res.body.error));

    }

  });

  it('List 49 Follows', async () => {

    const filter = {};

    const res = await client
        .get('/follows?filter=' + JSON.stringify(filter));

    assert.equal(res.status, 200, errorToMessage(res.body.error));

    assert.equal(res.body.length, 49);

  });

});
