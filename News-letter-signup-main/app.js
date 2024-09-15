const express = require("express");
const bodyParser = require("body-parser");
const https=require("https");
const { Server } = require("http");
// const cheerio=require("cheerio");
// const fs = require("fs");
// const html = fs.readFileSync("failure.html");
// const $=cheerio.load(html);
const app=express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.listen(process.env.PORT || 3000,function(){
    console.log("the server is running on port 3000");
});

app.post("/failure",function(req,res){
    res.redirect("/");
})

app.get("/",function(req,res){
    res.sendFile(__dirname+"/signup.html");
});

app.post("/",function(req,res){
    const userFirstName = req.body.first;
    const userLastName = req.body.last;
    const userEmail = req.body.email;
    res.set("Content-Type", "text/html");
    const data = {
        members: [
          {
            email_address:userEmail,
            status: "subscribed",
            merge_fields: {
              FNAME: userFirstName,
              LNAME: userLastName
            }
          }
        ]
      };
    const jsonData = JSON.stringify(data);
    const url = "https://us14.api.mailchimp.com/3.0/lists/5982787a0c";
    const options={
        method:"POST",
        auth:"Hiaml:35e44bec20fc19a7bb8ee462e2d59822-us17"
    };
    const request =https.request(url,options,function(response){
        response.on("data",function(data){
            console.log(response.statusCode);
            const dataParsed = JSON.parse(data);
            console.log(dataParsed);
            const error = dataParsed.errors[0].field_message;
        if(response.statusCode>=400 && response.statusCode<=450)
        {
            
            res.sendFile(__dirname+"/failure.html");
            // const div=$("#error");
            // const h1_="Type of error: "+ response.statusCode;
            // div.text(h1_);
            // console.log(typeof(h1_));
            // // console.log(div);
            // res.write("Type of error: "+ response.statusCode);
        }
        else if(dataParsed.errors[0].error_code=="ERROR_GENERIC"){
            // res.write("<h1>Type of error: "+ response.statusCode +"</h1>");
            res.sendFile(__dirname+"/failure.html");
            // res.write("<h1>EMAIL ALREADY EXISTS</h1>");
            // res.send();
        }
        else{
            res.sendFile(__dirname+"/success.html");
        }
        });
        
    });
    request.write(jsonData);
    request.end();
});





//api key - 35e44bec20fc19a7bb8ee462e2d59822-us17
//audienct id - 5982787a0c