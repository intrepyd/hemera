# Hemera

## Simple provider resolver library

### gist

```ts
interface DatabaseDriver<Connection> {
  databaseName: string;
  connection: Connection;

  connect(uri: string, databaseName: string): Promise<void>;
  getTables(): Promise<Table[]>;
  getRows(tableName: string): Promise<Row[]>;
}

const BaseDatabaseDriver: DatabaseDriver<any> = {
  databaseName: "",
  connection: ...,

  connect(uri, databaseName) { ... },

  getTables() { ... },

  getRows(tableName) { ... },
};

const MySqlDatabaseDriver: DatabaseDriver<any> = {
  ...BaseDatabaseDriver,

  connect(uri, databaseName) { ... },

  getTables() { ... },

  getRows(tableName) { ... },
};

const PostgresDatabaseDriver: DatabaseDriver<any> = {
  ...BaseDatabaseDriver,

  connect(uri, databaseName) { ... },

  getTables() { ... },

  getRows(tableName) { ... },
};

const databaseDriver = new Hemera(
  [DriverType.MYSQL, MySqlDatabaseDriver],
  [DriverType.POSTGRES, PostgresDatabaseDriver]
);

const driver = databaseDriver.get(DriverType.POSTGRES);

await driver.connect(...);

const tables = await driver.getTables();
```
