using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Test;
using System.Collections.Generic;
using Microsoft.Extensions.Configuration;
using System.Data;
using System.Data.SqlClient;
using Dapper;

namespace Notas.Function
{
    public static class LoadNotasGraph
    {
        [FunctionName("LoadNotasGraph")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)] HttpRequest req,
            ILogger log, ExecutionContext context)
        {
            log.LogInformation("C# HTTP trigger function processed a request.");

            var SQL = @"SELECT  [PersonID],
                                [LastName],
                                [FirstName],
                                [Address],
                                [City]
                        FROM [dbo].[Persons]";

            var config = new ConfigurationBuilder()
                            .SetBasePath(context.FunctionAppDirectory)
                            .AddJsonFile("local.settings.json", optional:true, reloadOnChange: true)
                            .AddEnvironmentVariables()
                            .Build();

            string appsettingvalue = config["ConnectionString"];

            List<Customer> customers = new List<Customer>();
            using (IDbConnection conn = new SqlConnection(appsettingvalue)){

                customers = conn.Query<Customer>(SQL).AsList();
            
            }

            return new OkObjectResult(JsonConvert.SerializeObject(customers));
        }
    }
}
