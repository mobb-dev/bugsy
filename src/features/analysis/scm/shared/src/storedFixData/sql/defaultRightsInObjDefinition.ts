export const defaultRightsInObjDefinition = {
  guidance: () =>
    '***Make sure the user who is supposed to run the procedure has sufficient permissions.***\n\n' +
    'Read more details about the `EXECUTE AS` statement in [the official Microsoft documentation](https://learn.microsoft.com/en-us/sql/t-sql/statements/execute-as-clause-transact-sql?view=sql-server-ver16&tabs=sqlserver).\n\n' +
    '`EXECUTE AS CALLER` is the default behavior for SQL Server 2005 and later.',
}
