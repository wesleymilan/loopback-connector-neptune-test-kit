import {Client} from '@loopback/testlab';
import {NeptuneApplication} from '../..';
import {setupApplication, errorToMessage} from './test-helper';
import { strict as assert } from 'assert';
import {PeopleType} from "../specs/types";
//import async from "async";

describe('Neptune Relations', () => {
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

  it('Create 20 People For Relation Tests', async () => {

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

  it('Check 20 People For Relation Tests', async () => {

    const res = await client
        .get('/people/count');

    assert.equal(res.status, 200, errorToMessage(res.body.error));

    assert.equal(res.body.count, 20);

  });

  it('Create 20 Following Between People For Relation Tests',  async () => {

    for(let i=1; i<peopleList.length-1; i++) {

      const followData = {
        follower: 'People/' + peopleList[i].id,
        followee: 'People/' + peopleList[i-1].id,
        notification: true,
        createdAt: (new Date()).toISOString()
      };

      const res = await client
          .post('/follows')
          .send(followData);

      assert.equal(res.status, 200, errorToMessage(res.body.error));

      // followData = {
      //   follower: 'People/' + peopleList[i].id,
      //   followee: 'People/' + peopleList[i+1].id,
      //   notification: true,
      //   createdAt: (new Date()).toISOString()
      // };
      //
      // res = await client
      //     .post('/follows')
      //     .send(followData);
      //
      // assert.equal(res.status, 200, errorToMessage(res.body.error));

    }

    // const people = Object.keys(peopleList);
    // async.each(people, (key: any, cb) => {
    //
    //   const current = Number(key);
    //   const previous = current > 0 ? current - 1 : peopleList.length - 1;
    //   const next = current < peopleList.length - 1 ? current + 1 : 0;
    //
    //   let followData = {
    //     follower: 'People/' + peopleList[current].id,
    //     followee: 'People/' + peopleList[previous].id,
    //     notification: true,
    //     createdAt: (new Date()).toISOString()
    //   };
    //
    //   client
    //       .post('/follows')
    //       .send(followData)
    //       .then((res) => {
    //
    //         assert.equal(res.status, 200, errorToMessage(res.body.error));
    //
    //         followData = {
    //           follower: 'People/' + peopleList[current].id,
    //           followee: 'People/' + peopleList[next].id,
    //           notification: true,
    //           createdAt: (new Date()).toISOString()
    //         };
    //
    //         cb();
    //
    //         // client
    //         //     .post('/follows')
    //         //     .send(followData)
    //         //     .then((res2) => {
    //         //
    //         //       assert.equal(res2.status, 200, errorToMessage(res2.body.error));
    //         //
    //         //       cb();
    //         //
    //         //     }).catch((err) => {
    //         //       cb(err);
    //         // });
    //
    //   }).catch((err) => {
    //     cb(err);
    //   });
    //
    // }, (err: any) => {
    //   if(err) return done(err);
    //
    //   done();
    // });

  });

  it('Get Followers By User Id', async () => {

    const entry = randomIntFromInterval(1, 19);

    const res = await client
        .get('/people/followers?id=' + peopleList[entry].id);

    assert.equal(res.status, 200, errorToMessage(res.body.error));

    const ids = [peopleList[entry-1].id, peopleList[entry+1].id];

    assert.notEqual(ids.indexOf(res.body[0].objects[1].id), -1);
    //assert.notEqual(ids.indexOf(res.body[1].objects[1].id), -1);

  });

});

function randomIntFromInterval(min: number, max: number) { // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min)
}
