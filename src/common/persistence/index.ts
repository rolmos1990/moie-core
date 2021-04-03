import MySQLPersistence from './mysql.persistence';
import MySQLMoiePersistence from './mysql-moie.persistence';
import MySQLStorePersistence from './mysql-store.persistence';

export const MySQLPersistenceConnection = MySQLPersistence;
export const MySQLMoiePersistenceConnection = MySQLMoiePersistence;
export const MySQLMoieStorePersistenceConnection = MySQLStorePersistence;

export const OriginalDatabaseName = MySQLMoiePersistenceConnection.database.toString();
export const StoreDatabaseName = MySQLMoieStorePersistenceConnection.database.toString();
export const NewDatabaseName = MySQLPersistenceConnection.database.toString();
