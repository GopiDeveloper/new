var express = require('express');
var cors = require('cors');
var dotenv = require('dotenv');
var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;

var app = express();
app.use(cors());


dotenv.config();
var mongoUrl = 'mongodb+srv://Gopi:rishi@cluster0.gfvcx.mongodb.net/augintern?retryWrites=true&w=majority';


const bodyParser = require('body-parser')
var port = process.env.PORT || 4512;

//save the database connection
var db;

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.get('/',(req, res) => {
    res.send("hii from the from express")
})

app.get('/location',(req, res) => {
    db.collection('location').find().toArray((err,result)=> {
        if(err) throw err;
        res.send(result)
    })
})

app.get('/mealType',(req, res) => {
    db.collection('mealtype').find().toArray((err,result)=> {
        if(err) throw err;
        res.send(result)
    })
})

app.get('/item',(req, res) => {
    db.collection('items').find().toArray((err,result)=> {
        if(err) throw err;
        res.send(result)
    })
})

app.get('/product',(req, res) => {
    db.collection('products').find().toArray((err,result)=> {
        if(err) throw err;
        res.send(result)
    })
})

app.get('/menu',(req, res) => {
    db.collection('menu').find().toArray((err,result)=> {
        if(err) throw err;
        res.send(result)  
    })
})

app.get('/reastaurants/:id',(req, res) => {
    var id =  parseInt(req.params.id);
    db.collection('reastaurant').find({"restaurant_id":id}).toArray((err,result) =>{
        if(err) throw err;
        res.send(result) 
    })
})

app.get('/product/:id',(req, res) => {
    var id =  parseInt(req.params.id);
    db.collection('products').find({"cate_id":id}).toArray((err,result) =>{
        if(err) throw err;
        res.send(result) 
    })
})

app.get('/category/:categoryId',(req,res) => {
    var id = parseInt(req.params.categoryId);
    db.collection('products').find({"categoryType.categorytype_id":id}).toArray((err,result) =>{
       if(err) throw err;
        res.send(result)
    })

})

//query params example
//wrt to city_name

app.get('/reastaurants',(req,res) =>{
    var query = {};
     if(req.query.city){
        query={state_id:Number(req.query.city)}
    }
    db.collection('reastaurant').find().toArray((err,result) =>{
        if(err) throw err;
        res.send(result)
    })
})

//restaurant wrt to mealid
app.get('/filter/:mealId',(req,res) =>{
    var id = parseInt(req.params.mealId);
    var sort = {cost:1}
    var limit = 1000000000000
    var query = {"mealTypes.mealtype_id":id};
    if(req.query.sortKey){
        var sortKey = req.query.sortKey
        if(sortKey>1 || sortKey<-1 || sortKey==0){
            sortKey=1
        }
        sort = {cost: Number(sortKey)}
    }
    if(req.query.skip && req.query.limit){
        skip = Number(req.query.skip)
        limit = Number(req.query.limit)
    }

    if(req.query.lcost && req.query.hcost){
        var lcost = Number(req.query.lcost);
        var hcost = Number(req.query.hcost);
    }

    if(req.query.cuisine && req.query.lcost && req.query.hcost){
        
        query = {$and:[{cost:{$gt:lcost,$lt:hcost}}],
                "cuisines.cuisine_id":Number(req.query.cuisine),
                "mealTypes.mealtype_id":id}
    }
    else if(req.query.cuisine){
        query = {"mealTypes.mealtype_id":id,"cuisines.cuisine_id":Number(req.query.cuisine)}
       // query = {"mealTypes.mealtype_id":id,"cuisines.cuisine_id":{$in:[2,5]}}
    }else if(req.query.lcost && req.query.hcost){
        query = {$and:[{cost:{$gt:lcost,$lt:hcost}}],"mealTypes.mealtype_id.mealtype_id":id}
    }
    db.collection('reastaurant').find(query).sort(sort).toArray((err,result) =>{
        if(err) throw err;
        res.send(result) 
    })
})

app.get('/menu/:restid',(req, res) => {
    var restid = Number(req.params.restid)
    db.collection('menu').find({restaurant_id:restid}).toArray((err,result)=> {
        if(err) throw err;
        res.send(result)
    })
})

app.post('/menuItem',(req,res) =>{
    console.log(req.body);
    db.collection('menu').find({menu_id:{$in:req.body}}).toArray((err,result) =>{
        if(err) throw err;
        res.send(result)
    })
})

app.put('/updateStatus/:id',(req,res) =>{
    var id= Number(req.params.id);
    var status = req.body.status?req.body.status:"Pending"
    db.collection('orders').updateOne(
        {id:id},
        {
            $set:{
                "date":req.body.date,
                "bank_status":req.body.bank_status,
                "bank":req.body.bank,
                "status": status
            }
        }
    )
    
        res.send('data updated')
})
//return orders
app.get('/orders',(req, res) => {
    db.collection('order').find().toArray((err,result)=> {
        if(err) throw err;
        res.send(result)
    })
})

app.post('/placeOrder',(req,res) =>{
    console.log(req.body);
    db.collection('order').insert(req.body,(err,result)=>{
        if(err) throw err;
        res.send("orderplaced")
    })
})

app.delete('/deleteOrders',(req,res) =>{
    db.collection('order').remove({},(err,result) =>{
        if(err) throw err;
        res.send(result)
    })
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

app.get('/products/:id',(req,res) => {
    var id = parseInt(req.params.id);
    db.collection('productname').find({"product_id":id}).toArray((err,result) =>{
        if(err) throw err;
        res.send(result)
    })
})


app.get('/filt/:itemid',(req, res) =>{
    var id = parseInt(req.params.itemid);
    db.collection('productname').find({"categoryType.categorytype_id":id}).toArray((err,result) =>{
        if(err) throw err;
        res.send(result)
    })
})
app.get('/men',(req, res) => {
    db.collection('productmenu').find().toArray((err,result) =>{
        if(err) throw err;
        res.send(result)
    })
})

app.get('/men/:proid',(req,res) => {
    var proid = Number(req.params.proid);
    db.collection('productmenu').find({"product_id":proid}).toArray((err,result) =>{
        if(err) throw err;
        res.send(result)
    })
})

app.post('/menutem',(req,res) => {
    console.log(req.body);
    db.collection('productmenu').find({menu_id:{$in:req.body}}).toArray((err,result) =>{
        if(err) throw err; 
        res.send(result)
    })
    
})


app.post('/placeorder',(req,res) => {
    console.log(req.body);
    db.collection('orders').insert(req.body,(err,result) => {
        if(err) throw err;
        res.send("order placed")
    })
})

app.get('/order',(req, res) => {
    db.collection('orders').find().toArray((err,result) =>{
        if(err) throw err;
        res.send(result)
    })
})




//connecting with mongodb
MongoClient.connect(mongoUrl, (err,client)=>{
    if(err) console.log("Error while connecting")
    db = client.db('augintern');
    app.listen(port,() =>{ 
        console.log(`listening on port ${port}`)
    })
})

