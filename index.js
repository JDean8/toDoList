import express from 'express'
import mongoose from 'mongoose'


const app = express()
const port = 3000
let work2Do = []
let personal2Do = []

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'))


//connect to MongoDB and create default items
mongoose.connect('mongodb://127.0.0.1:27017/todolistDB')

const listSchema = new mongoose.Schema({
    list: {
        type: String,
        required: [true, "List item must have a parent list"]
    },
    text: {
        type: String,
        required: [true, "List item must have content"]
    },
    completed: {
        type: Boolean,
        default: false
    },
})

const ListItem = mongoose.model("ListItem", listSchema)

//Defining deafult actions
const listItemOne = new ListItem({
    list:'work',
    text:'Update Linux servers', 
})

const listItemTwo = new ListItem({
    list:'work',
    text:'Check for CVEs', 
})
const listItemThree = new ListItem({
    list:'personal',
    text:'Buy new bathroom mirror', 
})

const listItemFour = new ListItem({
    list:'personal',
    text:'Restring guitars', 
})

//Add back the below if DB gets wiped (deafult values already in DB (22/08/23)
//ListItem.insertMany([listItemOne, listItemTwo, listItemThree, listItemFour])

app.get('/', (req, res)=>{
    res.redirect('/work')
})

app.get('/work', (req, res)=>{
    res.render('index.ejs', {toDoList: work2Do, page: 'work'})
})

app.get('/personal', (req, res)=>{
    res.render('index.ejs', {toDoList: personal2Do, page: 'personal'})
})

app.post('/work',(req, res)=>{
    work2Do.push(req.body.item)
    res.render('index.ejs', {toDoList: work2Do, page: 'work'})
})

app.post('/personal',(req, res)=>{
    personal2Do.push(req.body.item)
    res.render('index.ejs', {toDoList: personal2Do, page: 'personal'})
})

app.listen(port,()=>{
    console.log(`server is running on ${port}`)
})