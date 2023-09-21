import express from "express";
import mongoose from "mongoose";

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true, strict: false }));
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

//Add back the below if DB gets wiped
//ListItem.insertMany([listItemOne, listItemTwo, listItemThree, listItemFour]);

function getListItems(page, res) {
  const list = [];
  ListItem.find({ list: page })
    .then((listitems) => {
      listitems.forEach((listitem) => {
        list.push(listitem.text);
      });
      res.render("index.ejs", { toDoList: listitems, page: page });
    })
    .catch(function (err) {
      console.log(err);
    });
}

app.get("/", (req, res) => {
  res.redirect("/work");
});

app.get("/:page", (req, res) => {
  const { page } = req.params;
  getListItems(page, res);
});

app.post("/delete", (req, res) => {
  ListItem.findByIdAndRemove(req.body.checkbox)
    .then(res.redirect("back"))
    .catch((err) => console.log(err.body));
});

app.post("/:page", (req, res) => {
  const { page } = req.params;
  const listItem = new ListItem({
    list: page,
    text: req.body.item,
  });
  listItem.save().then(res.redirect(`/${page}`));
});

app.listen(port, () => {
  console.log(`server is running on ${port}`);
});
