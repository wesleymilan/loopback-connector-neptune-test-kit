import {NeptuneApplication} from '../..';
import {
  createRestAppClient,
  givenHttpServerConfig,
  Client,
} from '@loopback/testlab';

export async function setupApplication(): Promise<AppWithClient> {
  const restConfig = givenHttpServerConfig({
    // Customize the server configuration here.
    // Empty values (undefined, '') will be ignored by the helper.
    //
    // host: process.env.API_HOST,
    // port: +process.env.API_PORT,
  });

  const app = new NeptuneApplication({
    rest: restConfig,
  });

  await app.boot();
  await app.start();

  const client = createRestAppClient(app);

  return {app, client};
}

export function errorToMessage(bodyError: object): string {
  return JSON.stringify(bodyError, null, 2);
}

export interface AppWithClient {
  app: NeptuneApplication;
  client: Client;
}
