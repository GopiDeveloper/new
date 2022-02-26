var express = require('express');
var cors = require('cors');
var dotenv = require('dotenv');
var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;

var app = express();
app.use(cors());


dotenv.config();
var mongoUrl = 'mongodb+srv://143gopi_247:P.Gopi143@cluster0.vss3u.mongodb.net/VSL?retryWrites=true&w=majority';


const bodyParser = require('body-parser')
var port = process.env.PORT || 1432;

//save the database connection
var db;

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());



app.get('/',(req, res) => {
    res.send("hii from the from express")
})


app.get('/',(req, res) => {
    res.send("Hii from LPU")
})
app.get('/category',(req, res) => {
    db.collection('productitem').find().toArray((err,result) =>{
        if(err) throw err;
        res.send(result)
    })
})

app.get('/products',(req, res) => {
    db.collection('productname').find().toArray((err,result) =>{
        if(err) throw err;
        res.send(result)
    })
})

app.get('/product/:id',(req,res) => {
    var id = parseInt(req.params.id);
    db.collection('productname').find({"product_id":id}).toArray((err,result) =>{
        if(err) throw err;
        res.send(result)
    })
})


app.get('/filter/:itemid',(req, res) =>{
    var id = parseInt(req.params.itemid);
    db.collection('productname').find({"categoryType.categorytype_id":id}).toArray((err,result) =>{
        if(err) throw err;
        res.send(result)
    })
})
app.get('/menu',(req, res) => {
    db.collection('productmenu').find().toArray((err,result) =>{
        if(err) throw err;
        res.send(result)
    })
})

app.get('/menu/:proid',(req,res) => {
    var proid = Number(req.params.proid);
    db.collection('productmenu').find({"product_id":proid}).toArray((err,result) =>{
        if(err) throw err;
        res.send(result)
    })
})

app.post('/menuItem',(req,res) => {
    console.log(req.body);
    db.collection('productmenu').find({menu_id:{$in:req.body}}).toArray((err,result) =>{
        if(err) throw err; 
        res.send(result)
    })
    
})


app.post('/placeorder',(req,res) => {
    console.log(req.body);
    db.collection('productorders').insert(req.body,(err,result) => {
        if(err) throw err;
        res.send("order placed")
    })
})

app.get('/orders',(req, res) => {
    db.collection('productorders').find().toArray((err,result) =>{
        if(err) throw err;
        res.send(result)
    })
})



//connecting with mongodb
MongoClient.connect(mongoUrl, (err,client)=>{
    if(err) console.log("Error while connecting")
    db = client.db('VSL');
    app.listen(port,() =>{ 
        console.log(`listening on port ${port}`)
    })
})

