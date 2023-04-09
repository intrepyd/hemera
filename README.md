# Hemera

## Simple provider resolver library

### gist

```ts
export class DatabaseDriver<Connection = any> {
  public declare static type: DriverType;
  public static base = DatabaseDriver;
  public databaseName = "";
  public declare connection: Connection;

  connect(_uri: string, _databaseName: string): Promise<void> {...}

  getTables(): Promise<Table[]> {...}

  getRows(_tableName: string): Promise<Row[]> {...}
}

export class MySqlDatabaseDriver extends DatabaseDriver<KnexType> {
  public static type: DriverType = DriverType.MYSQL;

  connect(uri: string, databaseName: string) {...}

  getTables(): Promise<Table[]> {...}

  getRows(tableName: string): Promise<Row[]> {...}
}

export class PostgresDatabaseDriver extends DatabaseDriver<KnexType> {
  public static type: DriverType = DriverType.POSTGRES;

  connect(uri: string, databaseName: string) {...}

  getTables(): Promise<Table[]> {...}

  getRows(tableName: string): Promise<Row[]> {...}
}

import hemera from "hemera";

const databaseDriver = hemera(
  MySqlDatabaseDriver,
  PostgresDatabaseDriver
);

const driver = databaseDriver.get(DriverType.POSTGRES);

await driver.connect(...);

const tables = await driver.getTables();
```
