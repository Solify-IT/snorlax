import IDatastore from './datastore';

export default class BaseRepository {
  datastore: IDatastore;

  constructor(datastore: IDatastore) {
    this.datastore = datastore;
  }
}
