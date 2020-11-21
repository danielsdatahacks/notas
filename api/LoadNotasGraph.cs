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

namespace Notas.Function
{
    public static class LoadNotasGraph
    {
        [FunctionName("LoadNotasGraph")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)] HttpRequest req,
            ILogger log)
        {
            // log.LogInformation("C# HTTP trigger function processed a request.");

            // string name = req.Query["name"];

            // string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            // dynamic data = JsonConvert.DeserializeObject(requestBody);
            // name = name ?? data?.name;

            // string responseMessage = string.IsNullOrEmpty(name)
            //     ? "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response."
            //     : $"Hello, {name}. This HTTP triggered function executed successfully.";

            // return new OkObjectResult(responseMessage);

            log.LogInformation("C# HTTP trigger function processed a request.");

            var products = new List<Product>
            {
                new Product
                {
                    Name = "Phone",
                    Price = 999.90m,
                    Description = "This is the description of the phone"
                },
                new Product
                {
                    Name = "Book",
                    Price = 99.90m,
                    Description = "The best book you will ever read"
                },
                new Product
                {
                    Name = "TV",
                    Price = 15.49m,
                    Description = "Here you can see an awesome TV"
                }
            };
    
            return new OkObjectResult(JsonConvert.SerializeObject(products));
        }
    }
}
