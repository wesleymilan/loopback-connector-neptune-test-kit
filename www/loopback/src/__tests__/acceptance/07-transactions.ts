import {Client} from '@loopback/testlab';
import {NeptuneApplication} from '../..';
import {setupApplication, errorToMessage} from './test-helper';
import { strict as assert } from 'assert';
import {PeopleType, UserPosts} from "../specs/types";

describe('Neptune Transactions', () => {
  let app: NeptuneApplication;
  let client: Client;

  //let followList: FollowType[];
  let peopleList: PeopleType[];
  let posts: UserPosts;

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
    peopleList = [];
    posts = {};
  });

  before('clean up DB', async () => {
    await client
        .get('/test-helper/cleanup-db')
        .expect(204);
  });

  after(async () => {
    await app.stop();
  });

  it('Create 5 People For Transaction Tests', async () => {

    peopleList = [];

    const data = JSON.stringify({
      name: 'alpha ',
      status: true,
      age: 0,
      createdAt: (new Date()).toISOString()
    });

    let createData;
    peopleList = [];

    for(let c=0; c < 5; c++) {

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

  it('Create 5 Related Posts For Transaction Tests',  async() => {

    for(const p of peopleList) {

      if(!p?.id) continue;

      const postData = {
        userId: p.id,
        content: 'Content from ' + p.name,
        createdAt: (new Date()).toISOString()
      };

      const res = await client
          .post('/posts/related')
          .send(postData);

      assert.equal(res.status, 200, errorToMessage(res.body.error));

      posts[p.id] = res.body;

    }

  });

  it('Get posts from user', async () => {

    const keys = Object.keys(posts);

    const index = 3;

    const postIds = posts[keys[index]].map((item) => {
      return item.id;
    });

    const res = await client
        .get('/posts/by-user/' + keys[index]);

    assert.equal(res.status, 200, errorToMessage(res.body.error));
    assert.equal(res.body.length, 2, 'Wrong number of posts');

    for(const i of res.body) {
      assert.equal(postIds.indexOf(i.id) !== -1, true, 'Post ID not found (' + i.id + ')');
    }

  });

});
