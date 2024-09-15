const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

var categories = ["Personal", "Work"];
var listItems = [];

app.listen(3000, function () {
    console.log("The server is running on port 3000");
});

app.get("/", function (req, res) {
    var today = new Date();
    var options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    var message = today.toLocaleString("en-US", options);
    res.render("list", { listTitle: message, newListItems: listItems, categories: categories });
});

app.post("/", function (req, res) {
    let item = req.body.t1;
    let category = req.body.category;
    let priority = req.body.priority;
    let dueDate = req.body.dueDate;

    listItems.push({ name: item, category: category, priority: priority, dueDate: dueDate });
    res.redirect("/");
});

app.post("/addCategory", function (req, res) {
    const newCategory = req.body.newCategory;
    if (newCategory && !categories.includes(newCategory)) {
        categories.push(newCategory);
    }
    res.redirect("/");
});

app.post("/delete", function (req, res) {
    const itemIndex = req.body.itemIndex;
    listItems.splice(itemIndex, 1); 
    res.redirect("/");
});
