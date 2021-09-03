import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'neptune',
  connector: 'loopback-connector-neptune',
  url: process.env.NEPTUNE_URL,
  host: process.env.NEPTUNE_HOST,
  port: process.env.NEPTUNE_PORT,
  iam: process.env.NEPTUNE_IAM,
  secure: false,
  transactionClearTimeout: 5000,
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class NeptuneDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'neptune';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.neptune', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
