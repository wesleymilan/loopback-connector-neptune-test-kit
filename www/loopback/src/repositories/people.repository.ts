import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {NeptuneDataSource} from '../datasources';
import {People, PeopleRelations} from '../models';

export class PeopleRepository extends DefaultCrudRepository<
  People,
  typeof People.prototype.id,
  PeopleRelations
> {
  g;
  statics;
  EnumValue;
  P;
  TextP;
  Traversal;
  TraversalSideEffects;
  TraversalStrategies;
  TraversalStrategy;
  Traverser;
  barrier;
  cardinality;
  column;
  direction;
  operator;
  order;
  pick;
  pop;
  scope;
  t;
  GraphTraversal;
  GraphTraversalSource;
  traversal;
  withOptions;

  constructor(
    @inject('datasources.neptune') dataSource: NeptuneDataSource
  ) {
    super(People, dataSource);

    this.g = this.dataSource.connector?.g;
    this.statics = this.dataSource.connector?.process.statics;

    //this.connector = this.dataSource;
    //console.log(this.transaction);

    this.EnumValue = this.dataSource.connector?.process.EnumValue;
    this.P = this.dataSource.connector?.process.P;
    this.TextP = this.dataSource.connector?.process.TextP;
    this.Traversal = this.dataSource.connector?.process.Traversal;
    this.TraversalSideEffects = this.dataSource.connector?.process.TraversalSideEffects;
    this.TraversalStrategies = this.dataSource.connector?.process.TraversalStrategies;
    this.TraversalStrategy = this.dataSource.connector?.process.TraversalStrategy;
    this.Traverser = this.dataSource.connector?.process.Traverser;
    this.barrier = this.dataSource.connector?.process.barrier;
    this.cardinality = this.dataSource.connector?.process.cardinality;
    this.column = this.dataSource.connector?.process.column;
    this.direction = this.dataSource.connector?.process.direction;
    this.operator = this.dataSource.connector?.process.operator;
    this.order = this.dataSource.connector?.process.order;
    this.pick = this.dataSource.connector?.process.pick;
    this.pop = this.dataSource.connector?.process.pop;
    this.scope = this.dataSource.connector?.process.scope;
    this.t = this.dataSource.connector?.process.t;
    this.GraphTraversal = this.dataSource.connector?.process.GraphTraversal;
    this.GraphTraversalSource = this.dataSource.connector?.process.GraphTraversalSource;
    this.traversal = this.dataSource.connector?.process.traversal;
    this.withOptions = this.dataSource.connector?.process.withOptions;

  }

  async findFollower(userId: string) {

    return this.g.V(userId).hasLabel('People').out('Follow').path().toList();

  }

  async findFollowerGreaterThanAgePromise(age: number) {

    const promise = this.g.V().hasLabel('People').out("Follow").has('age', this.P.gt(age)).elementMap().dedup().order().by('age', this.order.asc).toList();

    const res = await this.execute(promise);

    return res;

  }

  async findFollowerGreaterThanAgeBytecode(age: number) {

    const bytecode = this.g.V().hasLabel('People').out("Follow").has('age', this.P.gt(age)).elementMap().dedup().order().by('age', this.order.asc);

    const res = await this.execute(bytecode, null, { method: 'toList' });

    return res;

  }

}
