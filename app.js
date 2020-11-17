const express = require("express");
const bodyParser = require("body-parser");
const { json } = require("body-parser");
const app = express();
const date = require(__dirname + "/date.js");
const itemDao = require(__dirname + "/itemsDAO.js");
const listsDao = require(__dirname + "/listsDAO.js");
const connection = require(__dirname + "/dbConnection.js");
const _ = require('lodash')
const day = date.getDate();
connection.startConnection();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const newItem = itemDao.newItem("Welcome to our todo list!");
const newItem2 = itemDao.newItem("Click the + button to add a new item");
const newItem3 = itemDao.newItem(
  "<--- Click on the checkbox to delete the item"
);
const defaultItems = [newItem, newItem2, newItem3];

app.get("/", function (req, res) {
  itemDao.getItem().find({}, (error, results) => {
    if (results.length === 0) {
      itemDao.saveManyItems(defaultItems);
      res.redirect("/");
    } else {
      res.render("list", { listTitle: day, newListItems: results });
    }
  });
});

app.post("/", function (req, res) {
  const newItem = itemDao.newItem(req.body.newItem);
  const listName = req.body.list;

  if(listName === day){
    itemDao.saveItem(newItem);
    res.redirect("/");
  }else{
    
    listsDao.addItem(listName, newItem);
    res.redirect(`/${listName}`);
  }
});

app.post("/delete", function (req, res) {
  const itemId = req.body.checked;
  const listName = req.body.listName;
  if(listName === day){
    itemDao.deleteItem(itemId);
    res.redirect("/");
  }else{
    listsDao.deleteItem(listName, itemId);
    res.redirect(`/${listName}`);
  }
});

app.get("/:route", function (req, res) {
  const listName = _.capitalize(req.params.route);
  const search = listsDao.findList(listName);
  search
    .then((list) => {
      if (list === null) {
        const newList = listsDao.newList(listName, defaultItems);
        newList.save();
        res.redirect(`/${listName}`);
      } else {
        res.render("list", {
          listTitle: list.name,
          newListItems: list.items,
        });
      }
    })
    .catch((err) => console.log(err));
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
