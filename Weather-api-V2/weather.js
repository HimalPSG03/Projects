const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const app = express();
const http = require("https");

app.use(bodyParser.urlencoded({ extended: true }));


app.use(express.static("public"));

app.listen(3000, function () {
    console.log("The server is running on port 3000");
});

app.post("/", function (req, res) {
    const city = req.body.c_name;
    const apiKey = "18da51005c7f198059d5b703ed4f596d";
    const unit = "metric";
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey + "&units=" + unit;

    http.get(url, function (response) {
        if (response.statusCode === 404) {  
            fs.readFile(__dirname + "/result.html", "utf8", function (err, html) {
                if (err) {
                    res.send("Error loading the result page");
                    return;
                }
                let finalHtml = html
                    .replace("{{city}}", city)
                    .replace("{{iconUrl}}", "")
                    .replace("{{temperature}}", "N/A")
                    .replace("{{weatherDescription}}", "City not found. Please try again.");
                res.send(finalHtml);
            });
        } else {
            response.on("data", function (data) {
                const weatherResult = JSON.parse(data);

                const weatherDescription = weatherResult.weather[0].description;
                if (weatherDescription == "") {
                    res.send("City not found. Please try again.");
                    return;
                }
                const weatherIcon = weatherResult.weather[0].icon;
                const iconUrl = "https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png";
                const temperature = weatherResult.main.temp;

                fs.readFile(__dirname + "/result.html", "utf8", function (err, html) {
                    if (err) {
                        res.send("Error loading the result page");
                        return;
                    }

                    let finalHtml = html
                        .replace("{{city}}", city)
                        .replace("{{iconUrl}}", iconUrl)
                        .replace("{{temperature}}", temperature)
                        .replace("{{weatherDescription}}", weatherDescription);

                    res.send(finalHtml);
                });
            });
        }
    }).on("error", function (e) {
        res.send("Error connecting to the weather service. Please try again later.");
    });
});

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});
