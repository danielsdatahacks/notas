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
using NotasGraph;
using NotasGraphDB;
using System.Linq;


namespace CreateUser.Function
{
    public static class CreateUser
    {
        [FunctionName("CreateUser")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = null)] HttpRequest req,
            ILogger log, ExecutionContext context)
        {
            log.LogInformation("C# HTTP trigger function processed a request.");

            var config = new ConfigurationBuilder()
                .SetBasePath(context.FunctionAppDirectory)
                .AddJsonFile("local.settings.json", optional:true, reloadOnChange: true)
                .AddEnvironmentVariables()
                .Build();

            string connection = config["sqldb_connection"];
            //string connection = config.GetConnectionString("sqldb_connection");//["SQLSERVERCONNSTR_"];

            var json = await req.ReadAsStringAsync();
            var graph = JsonConvert.DeserializeObject<Graph>(json);
            //var userID = 7;
            //var graphID = 7;

            var ScreenName = "danielborcherding";
            var FirstName = "Daniel";
            var LastName = "Borcherding";


            //SQL insert user and graph
            var SQL_INSERT_USER_GRAPH = @"
            if not exists(select 1 from users where ScreenName like @ScreenName)
            begin
                insert into users (ScreenName, FirstName, LastName, EditDate)
                values (@ScreenName, @FirstName, @LastName, GETUTCDATE())
            end

            if not exists(
                select 1 
                from graphs g
                inner join users u on u.UserID = g.UserID
                where u.ScreenName = @ScreenName
            )
            begin
                insert into graphs (UserID, EditDate)
                select 
                    u.UserID,
                    GETUTCDATE()
                from users u
                where u.ScreenName = @ScreenName
            end
            ";

            using (SqlConnection conn = new SqlConnection(connection)){
                conn.Open();

                SqlCommand cmd = conn.CreateCommand();
                SqlTransaction tran;
                
                tran = conn.BeginTransaction("SampleTransaction");

                cmd.Connection = conn;
                cmd.Transaction = tran;

                try{
                    cmd.CommandText = SQL_INSERT_USER_GRAPH;
                    cmd.Parameters.Add("@ScreenName", SqlDbType.VarChar).Value = ScreenName;
                    cmd.Parameters.Add("@FirstName",SqlDbType.VarChar).Value = FirstName;
                    cmd.Parameters.Add("@LastName", SqlDbType.VarChar).Value = LastName;
                    cmd.ExecuteNonQuery();

                    tran.Commit();
                }
                catch (Exception ex)
                {
                    Console.WriteLine("Message: {0}", ex.Message);
                    tran.Rollback();
                }              
            };

            return new OkObjectResult("Finished creating user.");
        }
    }
}
