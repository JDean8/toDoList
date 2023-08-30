import express from "express";
import mongoose from "mongoose";

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

//connect to MongoDB and create default items
mongoose.connect("mongodb://127.0.0.1:27017/todolistDB");

const listSchema = new mongoose.Schema({
  list: {
    type: String,
    required: [true, "List item must have a parent list"],
  },
  text: {
    type: String,
    required: [true, "List item must have content"],
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

const ListItem = mongoose.model("ListItem", listSchema);

//Defining deafult actions
const listItemOne = new ListItem({
  list: "work",
  text: "Update Linux servers",
});

const listItemTwo = new ListItem({
  list: "work",
  text: "Check for CVEs",
});
const listItemThree = new ListItem({
  list: "personal",
  text: "Buy new bathroom mirror",
});

const listItemFour = new ListItem({
  list: "personal",
  text: "Restring guitars",
});

//Add back the below if DB gets wiped (deafult values already in DB (22/08/23)
//ListItem.insertMany([listItemOne, listItemTwo, listItemThree, listItemFour])

function getListItems(page, res) {
  const list = [];
  ListItem.find({ list: page })
    .then((listitems) => {
      listitems.forEach((listitem) => {
        list.push(listitem.text);
      });
      res.render("index.ejs", { toDoList: list, page: page });
    })
    .catch(function (err) {
      console.log(err);
    });
}

app.get("/", (req, res) => {
  res.redirect("/work");
});

app.get("/work", (req, res) => {
  getListItems("work", res);
});

app.get("/personal", (req, res) => {
  getListItems("personal", res);
});

app.post("/work", (req, res) => {
  const workListItem = new ListItem({
    list: "work",
    text: req.body.item,
  });
  workListItem.save().then(res.redirect("/work"));
});

app.post("/personal", (req, res) => {
  const personalListItem = new ListItem({
    list: "personal",
    text: req.body.item,
  });
  personalListItem.save().then(res.redirect("/personal"));
});

app.post("/delete", (req, res) => {
  console.log(req.body.checkbox);
});

app.listen(port, () => {
  console.log(`server is running on ${port}`);
});
