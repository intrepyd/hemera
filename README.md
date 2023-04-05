# Hemera

## Simple provider resolver library

### gist

```ts
enum DatabaseDriverType {
  DEFAULT = "DEFAULT",
  POSTGRES = "POSTGRES",
  MYSQL = "MYSQL",
}

class DatabaseDriver<Connection> {
  public databaseName = "";
  public connection!: Connection;

  public connect(uri: string, databaseName: string) {
    ...
  }

  public getTables(): Promise<Table[]> {
    ...
  }

  public getRows(tableName: string): Promise<Row[]> {
    ...
  }
}

export class MySqlDatabaseDriver extends DatabaseDriver<Connection> {
  public connect(uri: string, databaseName: string) {
    ...
  }

  public async getTables(): Promise<Table[]> {
    ...
  }

  public async getRows(tableName: string): Promise<Row[]> {
    ...
  }
}

export class PostgresDatabaseDriver extends DatabaseDriver<Connection> {
  public connect(uri: string, databaseName: string) {
    ...
  }

  public async getTables(): Promise<Table[]> {
    ...
  }

  public async getRows(tableName: string): Promise<Row[]> {
    ...
  }
}

const driverResolver = hemera(
  [DatabaseDriverType.MYSQL, MySqlDatabaseDriver],
  [DatabaseDriverType.POSTGRES, PostgresDatabaseDriver],
  [DatabaseDriverType.DEFAULT, DatabaseDriver]
);

const driver = await driverResolver(DatabaseDriverType.MYSQL);

await driver.connect("some-url", "test-db");

const tables = await driver.getTables();

const rowList = await Promise.all(
  tables.map((table) => driver.getRows(table.name))
);
```
