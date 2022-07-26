import MySQLPersistence from './mysql.persistence';
import MySQLMoiePersistence from './mysql-moie.persistence';
import MySQLStorePersistence from './mysql-store.persistence';

export const MySQLPersistenceConnection = MySQLPersistence;
export const MySQLMoiePersistenceConnection = MySQLMoiePersistence;
export const MySQLMoieStorePersistenceConnection = MySQLStorePersistence;

export const OriginalDatabaseName = MySQLMoiePersistenceConnection.database.toString();
export const StoreDatabaseName = MySQLMoieStorePersistenceConnection.database.toString();
export const NewDatabaseName = MySQLPersistenceConnection.database.toString();

console.log(' ------------ DATABASES ------')
console.log('1. OriginalDatabaseName: ', OriginalDatabaseName);
console.log('2. StoreDatabaseName: ', StoreDatabaseName);
console.log('3. NewDatabaseName: ', NewDatabaseName);
console.log(' ---------------------------- ')
