import {Client} from '@loopback/testlab';
import {NeptuneApplication} from '../..';
import {setupApplication, errorToMessage} from './test-helper';
import { strict as assert } from 'assert';
import {PeopleType} from "../specs/types";

describe('Neptune Raw Queries', () => {
  let app: NeptuneApplication;
  let client: Client;

  //let followList: FollowType[];
  let peopleList: PeopleType[];

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
    peopleList = [];
    //followList = [];
  });

  before('clean up DB', async () => {
    await client
        .get('/test-helper/cleanup-db')
        .expect(204);
  });

  after(async () => {
    await app.stop();
  });

  it('Create 20 People For Raw Queries Tests', async () => {

    peopleList = [];

    const data = JSON.stringify({
      name: 'alpha ',
      status: true,
      age: 0,
      createdAt: (new Date()).toISOString()
    });

    let createData;
    peopleList = [];

    for(let c=0; c < 20; c++) {

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

  it('Check 20 People For Raw Queries Tests', async () => {

    const res = await client
        .get('/people/count');

    assert.equal(res.status, 200, errorToMessage(res.body.error));

    assert.equal(res.body.count, 20);

  });

  it('Create 19 Following Between People For Raw Queries Tests',  async() => {

    for(let i=1; i<peopleList.length-1; i++) {

      let followData = {
        follower: 'People/' + peopleList[i].id,
        followee: 'People/' + peopleList[i-1].id,
        notification: true,
        createdAt: (new Date()).toISOString()
      };

      let res = await client
          .post('/follows')
          .send(followData);

      assert.equal(res.status, 200, errorToMessage(res.body.error));

      followData = {
        follower: 'People/' + peopleList[i].id,
        followee: 'People/' + peopleList[i+1].id,
        notification: true,
        createdAt: (new Date()).toISOString()
      };

      res = await client
          .post('/follows')
          .send(followData);

      assert.equal(res.status, 200, errorToMessage(res.body.error));

    }

  });

  it('Get Followers By Age Using Promise', async () => {

    const res = await client
        .get('/people/promise-followers-greater-than?age=15');

    assert.equal(res.status, 200, errorToMessage(res.body.error));

    for(const i of res.body) {
      assert.equal((i.age > 15), true);
    }

  });

  it('Get Followers By Age Using Bytecode', async () => {

    const res = await client
        .get('/people/bytecode-followers-greater-than?age=15');

    assert.equal(res.status, 200, errorToMessage(res.body.error));

    for(const i of res.body) {
      assert.equal((i.age > 15), true);
    }

  });

});

