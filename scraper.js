var http = require("http");
var fs = require("fs");

var cheerio = require("cheerio"); //npm module
var request = require("request"); //npm module
var json2csv = require("json2csv"); //npm module

const url =  "http://shirts4mike.com/shirt.php";
var links = [];
var storedInfo = [];		
var csvFields = ["Title", "Price", "ImageURL", "URL", "Time"];	


request (url,  function(error, response, body) { //this request is just to retrieve the rest of the links for the next request.
	
	if (!error) {
		
	var $ = cheerio.load(body);
		$('.products li').each(function(item){
			 var href = $(this).find('a').attr('href');
			var fullURL = `${url}/${href}`
			links.push(fullURL) 
			//all links are now stored in var links
			
		})
		
		
		for (var i = 0; i < links.length; i++) {
					
		request(links[i], function(error, response, body) {
			
			
				if (!error) {
					var $ = cheerio.load(body);
										
				  var product= {}
                            product.Title = $('.shirt-details h1').text(),
							product.Price = $('.shirt-details h1 span').text(),
                            product.ImageURL = $('.shirt-picture span img').attr('src'),
                            product.URL = response.request.uri.href,                    
                            product.Time = new Date()
                        
						
				} //end if
				
				storedInfo.push(product);
				
				 var dir = "./data"; // Create the data directory
                        if(!fs.existsSync(dir)) { 
                          fs.mkdirSync(dir);
                        }
				
								var year = new Date().getFullYear();
				var month = new Date().getMonth();
				var day = new Date().getDate();
				var fullDate = `${year}-${month}-${day}`;		
		
				json2csv({data: storedInfo, fields: csvFields}, function(error, csv) {

										if (error) throw error;
										fs.writeFile(`./data/${fullDate}.csv`, csv, function(error) {
											if (error) throw error;
												console.log(`${fullDate} file updated`);
										}); //End fo writeFile

									}); // End of json2csv method
					
		//createCSV(storedInfo, fullDate);
				
			}); //end request
			
		} //end for loop
		
	} else {//end if 
	
	console.log(`Sorry there was an error trying with this process, please try again, or contact program administrator. Error info: (${error})`)
	}
	
}); //end request

function createCSV(file, filename) {
		
		fs.writeFile(`./data/${filename}.csv`, JSON.stringify(file, null, 2), 'utf-8', (error) => {
						  if (error) {
							  console.log(`Oh no, there was an error with this operation (${error})`)
						  };
						  console.log(`./data/${filename}.csv file updated`);
						});
						
		} // end createCSV



