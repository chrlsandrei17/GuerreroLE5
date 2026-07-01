using Dapper;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using Microsoft.Extensions.Configuration;

namespace BlogDataLibrary.DataBase
{
    public class SqlDataAccess : ISqlDataAccess
    {
        private readonly IConfiguration _config;

        public SqlDataAccess(IConfiguration config)
        {
            _config = config;
        }

        public List<T> LoadData<T, U>(
            string sqlStatement,
            U parameters,
            string connectionStringName,
            bool isStoredProcedure)
        {
            CommandType commandType = isStoredProcedure
                ? CommandType.StoredProcedure
                : CommandType.Text;

            string connectionString =
                _config.GetConnectionString(connectionStringName);

            using IDbConnection connection =
                new SqlConnection(connectionString);

            return connection.Query<T>(
                sqlStatement,
                parameters,
                commandType: commandType)
                .ToList();
        }

        public void SaveData<T>(
            string sqlStatement,
            T parameters,
            string connectionStringName,
            bool isStoredProcedure)
        {
            CommandType commandType = isStoredProcedure
                ? CommandType.StoredProcedure
                : CommandType.Text;

            string connectionString =
                _config.GetConnectionString(connectionStringName);

            using IDbConnection connection =
                new SqlConnection(connectionString);

            connection.Execute(
                sqlStatement,
                parameters,
                commandType: commandType);
        }
    }
}