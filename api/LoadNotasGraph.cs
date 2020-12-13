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
    public static class LoadNotasGraph
    {
        [FunctionName("LoadNotasGraph")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = null)] HttpRequest req,
            ILogger log, ExecutionContext context)
        {
            try {
                var config = new ConfigurationBuilder()
                    .SetBasePath(context.FunctionAppDirectory)
                    .AddJsonFile("local.settings.json", optional:true, reloadOnChange: true)
                    .AddEnvironmentVariables()
                    .Build();

                string connection = config["sqldb_connection"];
                //string connection = config.GetConnectionString("sqldb_connection");//["SQLSERVERCONNSTR_"];
                //string connection2 = config.

                var json = await req.ReadAsStringAsync();
                var externalUserID = JsonConvert.DeserializeObject<string>(json);

                var graph = new Graph();
                graph.Energy = 1000;
                graph.NodeDictionary = new Dictionary<string, Node>();
                graph.TopicDictionary = new Dictionary<string, BaseNode>();

                //SQL insert user and graph
                var SQL_GET_GRAPH = @"
                --Load nodes
                select 
                n.ExternalID as StartExternalID,
                n.Name,
                n.Text,
                n.GraphID,
                n.PositionX,
                n.PositionY,
                n.Type
                from nodes n
                inner join graphs g on g.GraphID = n.GraphID
                inner join users u on u.UserID = g.UserID
                where u.ExternalID = @ExternalUserID

                --Load links
                select 
                ns.ExternalID as StartExternalID,
                ne.ExternalID as EndExternalID,
                ns.Type StartNodeType,
                ne.Type EndNodeType
                from links l
                inner join nodes ns on ns.NodeID = l.StartNodeID
                inner join nodes ne on ne.NodeID = l.EndNodeID
                inner join graphs g on g.GraphID = l.GraphID
                inner join users u on u.UserID = g.UserID
                where u.ExternalID = @ExternalUserID
                ";

                using (SqlConnection conn = new SqlConnection(connection)){
                    conn.Open();

                    SqlCommand cmd = conn.CreateCommand();
                    cmd.Connection = conn;

                    cmd.CommandText = SQL_GET_GRAPH;
                    cmd.Parameters.Add("@ExternalUserID", SqlDbType.VarChar).Value = externalUserID;
                    SqlDataReader reader = cmd.ExecuteReader();

                    //Nodes
                    if(reader.HasRows){
                        while (reader.Read()){

                            var type = (NotasGraph.Type)reader.GetFieldValue<Byte>("Type");

                            if(type == NotasGraph.Type.Note){
                                var node = new Node();
                                node.ID = reader.GetFieldValue<string>("StartExternalID");
                                node.Name = reader.GetFieldValue<string>("Name");
                                node.Text = reader.GetFieldValue<string>("Text");
                                node.X = reader.GetFieldValue<decimal>("PositionX");
                                node.Y = reader.GetFieldValue<decimal>("PositionY");
                                node.Hashtags = new List<string>();
                                node.LinksTowards = new List<Link>();
                                node.LinksFrom = new List<Link>();
                                graph.NodeDictionary.TryAdd(node.ID, node);
                            }
                            else if(type == NotasGraph.Type.Hashtag){
                                var node = new BaseNode();
                                node.ID = reader.GetFieldValue<string>("StartExternalID");
                                node.Name = reader.GetFieldValue<string>("Name");
                                node.X = reader.GetFieldValue<decimal>("PositionX");
                                node.Y = reader.GetFieldValue<decimal>("PositionY");
                                node.LinksTowards = new List<Link>();
                                graph.TopicDictionary.TryAdd(node.ID, node);
                            }
                            else{
                                Console.WriteLine("Error: Wrong node type. Continuing with the next node.");
                            }                            
                        }
                    }

                    reader.NextResult();

                    //Links
                    if(reader.HasRows){
                        while (reader.Read()){
                            var startExternalID = reader.GetFieldValue<string>("StartExternalID");
                            var startNodeType = (NotasGraph.Type)reader.GetFieldValue<Byte>("StartNodeType");
                            var endExternalID = reader.GetFieldValue<string>("EndExternalID");
                            var endNodeType = (NotasGraph.Type)reader.GetFieldValue<Byte>("EndNodeType");

                            if(startNodeType == NotasGraph.Type.Note && endNodeType == NotasGraph.Type.Note){
                                if(graph.NodeDictionary.ContainsKey(startExternalID) && graph.NodeDictionary.ContainsKey(endExternalID)){
                                    var link1 = new Link();
                                    link1.ID = endExternalID;
                                    link1.Name = "";
                                    graph.NodeDictionary[startExternalID].LinksTowards.Add(link1);

                                    var link2 = new Link();
                                    link2.ID = startExternalID;
                                    link2.Name = "";
                                    graph.NodeDictionary[endExternalID].LinksFrom.Add(link2);
                                }
                            }
                            else if(startNodeType == NotasGraph.Type.Hashtag && endNodeType == NotasGraph.Type.Note){
                                if(graph.TopicDictionary.ContainsKey(startExternalID) && graph.NodeDictionary.ContainsKey(endExternalID)){
                                    var link = new Link();
                                    link.ID = endExternalID;
                                    link.Name = "";
                                    graph.TopicDictionary[startExternalID].LinksTowards.Add(link);

                                    graph.NodeDictionary[endExternalID].Hashtags.Add(startExternalID);
                                }
                            }
                            else{
                                Console.WriteLine("Error: Wrong node type combination for a link. Continuing with next link.");
                            }
                        }
                    }
                    reader.Close();
                    cmd.Dispose();

                    return new OkObjectResult(JsonConvert.SerializeObject(graph));
                     
                }
            }
            catch (Exception ex){
                Console.WriteLine("Message: {0}", ex.Message);
                return new OkObjectResult(ex.Message);
            }
        }
    }
}
