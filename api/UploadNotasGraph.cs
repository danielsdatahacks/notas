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

namespace Notas.Function
{
    public static class UploadNotasGraph
    {
        [FunctionName("UploadNotasGraph")]
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
            var graphID = 7;

            //SQL query to insert and update
            var SQL_NODE_UPSERT = @"
            insert into dbo.Nodes (ExternalID, Name, Text, GraphID, PositionX, PositionY, Type, EditDate)
            select
            n.ExternalID,
            n.Name,
            n.Text,
            n.GraphID,
            n.PositionX,
            n.PositionY,
            n.Type,
            GETUTCDATE()
            from @Nodes n
            where not exists (
                select 1 
                from nodes ns
                where ns.ExternalID = n.ExternalID
            )

            update n
            set n.Name = nnew.Name, n.Text = nnew.Text, n.PositionX = nnew.PositionX, n.PositionY = nnew.PositionY, n.Type = nnew.Type
            from nodes n
            inner join @Nodes nnew on nnew.ExternalID = n.ExternalID and nnew.GraphID = n.GraphID
            where n.Name <> nnew.Name or n.Text <> nnew.Text or n.PositionX <> nnew.PositionX or n.PositionY <> nnew.PositionY or n.Type <> nnew.Type
            ";

            var SQL_UPSERT_LINKS = @"
                --INSERT
                insert into dbo.Links (StartNodeID, EndNodeID, Text, GraphID, EditDate)
                select
                ns.NodeID,
                ne.NodeID,
                '',
                l.GraphID,
                GETUTCDATE()
                from @Links l
                inner join nodes ns on ns.ExternalID = l.StartExternalID and ns.GraphID = l.GraphID
                inner join nodes ne on ne.ExternalID = l.EndExternalID and ne.GraphID = l.GraphID
                where not exists (
                    select 1 
                    from links lo
                    where lo.StartNodeID = ns.NodeID and lo.EndNodeID = ne.NodeID and lo.GraphID = l.GraphID
                )";

            // var SQL_UPSERT_HASHTAGS = @"
            //     --Insert statement
            //     insert into dbo.hashtags (ExternalID, Name, GraphID, EditDate)
            //     select
            //     hn.ExternalID,
            //     hn.Name,
            //     hn.GraphID,
            //     GETUTCDATE()
            //     from @Hashtags hn
            //     where not exists (
            //         select 1 
            //         from hashtags h
            //         where h.ExternalID = hn.ExternalID and h.GraphID = hn.GraphID
            //     )

            //     --Update statement
            //     update h
            //     set h.Name = hn.Name
            //     from hashtags h
            //     inner join @Hashtags hn on hn.ExternalID = h.ExternalID
            //     where hn.Name <> h.Name and h.GraphID = hn.GraphID
            // ";

            // var SQL_INSERT_HASHTAGNODES = @"
            //     --Insert statement
            //     insert into dbo.hashtagnodes (HashtagID, NodeID, EditDate)
            //     select
            //     h.HashtagID,
            //     n.NodeID,
            //     GETUTCDATE()
            //     from @HasthtagNodes hn
            //     inner join hashtags h on h.ExternalID = hn.HasthtagExternalID and h.GraphID = hn.GraphID
            //     inner join nodes n on n.ExternalID = hn.NodeExternalID and h.GraphID = hn.GraphID
            //     where not exists (
            //         select 1 
            //         from hashtagnodes ho
            //         where ho.HashtagID = h.HashtagID and ho.NodeID = n.NodeID
            // )";

            using (SqlConnection conn = new SqlConnection(connection)){
                conn.Open();

                SqlCommand cmd = conn.CreateCommand();
                SqlTransaction tran;
                
                tran = conn.BeginTransaction("SampleTransaction");

                cmd.Connection = conn;
                cmd.Transaction = tran;

                try
                {   
                    //Upsert nodes
                    var dtn = new DataTable();
                    dtn.Columns.Add("ExternalID");
                    dtn.Columns.Add("Name");
                    dtn.Columns.Add("Text");
                    dtn.Columns.Add("PositionX", typeof(decimal));
                    dtn.Columns.Add("PositionY", typeof(decimal));
                    dtn.Columns.Add("GraphID", typeof(Int32));
                    dtn.Columns.Add("Type", typeof(Int32));

                    //Note nodes
                    foreach(var externalID in graph.NodeDictionary.Keys){
                        var name = graph.NodeDictionary[externalID].Name;
                        var text = graph.NodeDictionary[externalID].Text;
                        var positionX = graph.NodeDictionary[externalID].X;
                        var positionY = graph.NodeDictionary[externalID].Y;
                        dtn.Rows.Add(externalID, name, text, positionX, positionY, graphID, NotasGraph.Type.Note);
                    }

                    //Hashtag nodes
                    foreach(var externalID in graph.TopicDictionary.Keys){
                        var name = graph.TopicDictionary[externalID].Name;
                        var text = "";
                        var positionX = graph.TopicDictionary[externalID].X;
                        var positionY = graph.TopicDictionary[externalID].Y;
                        dtn.Rows.Add(externalID, name, text, positionX, positionY, graphID, NotasGraph.Type.Hashtag);
                    }

                    cmd.CommandText = SQL_NODE_UPSERT;
                    var nodeTvpParameter = cmd.Parameters.AddWithValue("@Nodes", dtn);
                    nodeTvpParameter.SqlDbType = SqlDbType.Structured;
                    nodeTvpParameter.TypeName = "dbo.Nodes";
                    cmd.ExecuteNonQuery();
                    cmd.Parameters.Remove(nodeTvpParameter);


                    //Insert links
                    var dtl = new DataTable();
                    dtl.Columns.Add("StartExternalID");
                    dtl.Columns.Add("EndExternalID");
                    dtl.Columns.Add("GraphID", typeof(Int32));
                    //Note links
                    foreach(var startExternalID in graph.NodeDictionary.Keys){
                        foreach(var endNode in graph.NodeDictionary[startExternalID].LinksTowards){
                            dtl.Rows.Add(startExternalID, endNode.ID, graphID);
                        }
                    }
                    //Hashtag note links
                    foreach(var hashtagExternalID in graph.TopicDictionary.Keys){
                        foreach(var noteLink in graph.TopicDictionary[hashtagExternalID].LinksTowards){
                            dtl.Rows.Add(hashtagExternalID, noteLink.ID, graphID);
                        }
                    }
                    cmd.CommandText = SQL_UPSERT_LINKS;
                    var linkTvpParameter = cmd.Parameters.AddWithValue("@Links", dtl);
                    linkTvpParameter.SqlDbType = SqlDbType.Structured;
                    linkTvpParameter.TypeName = "dbo.Links";
                    cmd.ExecuteNonQuery();
                    cmd.Parameters.Remove(linkTvpParameter);

                    tran.Commit();

                    //Upsert hashtags
                    // var dth = new DataTable();
                    // dth.Columns.Add("ExternalID");
                    // dth.Columns.Add("Name");
                    // dth.Columns.Add("GraphID", typeof(Int32));
                    // foreach(var externalID in graph.TopicDictionary.Keys){
                    //     dth.Rows.Add(externalID, graph.TopicDictionary[externalID].Name, graphID);
                    // }
                    // cmd.CommandText = SQL_UPSERT_HASHTAGS;
                    // var hashtagTvpParameter = cmd.Parameters.AddWithValue("@Hashtags", dth);
                    // hashtagTvpParameter.SqlDbType = SqlDbType.Structured;
                    // hashtagTvpParameter.TypeName = "dbo.Hashtags";
                    // cmd.ExecuteNonQuery();
                    // cmd.Parameters.Remove(hashtagTvpParameter);


                    // //Insert hashtagnodes
                    // var dthn = new DataTable();
                    // dthn.Columns.Add("HashtagExternalID");
                    // dthn.Columns.Add("NodeExternalID");
                    // dthn.Columns.Add("GraphID", typeof(Int32));
                    // foreach(var hashtagExternalID in graph.TopicDictionary.Keys){
                    //     foreach(var node in graph.TopicDictionary[hashtagExternalID].LinksTowards){
                    //         dthn.Rows.Add(hashtagExternalID, node.ID, graphID);
                    //     }
                    // }
                    // cmd.CommandText = SQL_INSERT_HASHTAGNODES;
                    // var hashtagnodesTvpParameter = cmd.Parameters.AddWithValue("@HasthtagNodes", dthn);
                    // hashtagnodesTvpParameter.SqlDbType = SqlDbType.Structured;
                    // hashtagnodesTvpParameter.TypeName = "dbo.Hashtagnodes";
                    // cmd.ExecuteNonQuery();
                }
                catch (Exception ex)
                {
                    Console.WriteLine("Message: {0}", ex.Message);
                    tran.Rollback();
                }              
            }

            //return new OkObjectResult(JsonConvert.SerializeObject(customers));
            return new OkObjectResult("Finished graph upsert.");
        }
    }
}
