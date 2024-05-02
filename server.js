const express = require("express");
const app = express();
const session = require("express-session");
const mongodb = require("mongodb");

const client = mongodb.MongoClient;

let dbinstance;
client.connect("mongodb+srv://anshul5010be22:ansh123@cluster0.luebml7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0").then((database) => {
    console.log("connected");
    dbinstance = database.db("table");
})
.catch((err) => {
    console.log("Error occurred while connecting to database");
})


app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.set("view engine","ejs");


app.get("/", (req, res) => {
    dbinstance.collection("table_data").find({}).toArray().then((data) => {
        console.log({success:true,message:"Data fetched from database to show on Home page"});
        res.render("home",{message:"",data});
    }).catch((err) => {
        console.log({success:false, message:"Error in fetching data from database"});
    })
})

app.get("/addproduct/:name/:price", (req,res) => {
    const { name, price } = req.params;
    dbinstance.collection("table_data").insertOne({name,price}).then((data) => {
        console.log({success:true,message:"One insertion successfull"});
        res.send(data);
    }).catch((err) => {
        console.log({success:false, message:"Error in inserting in database",error : err.message});
    })
})

app.get("/showproduct/:productid", (req,res) => {
    const productid = req.params.productid;
    dbinstance.collection("table_data").findOne({_id : new mongodb.ObjectId(productid)}).then((data) => {
        console.log({success:true,message:"Product fetched Successfully"});
        res.render("viewProduct",{data});
    }).catch((err) => {
        console.log({success:false,message:"Error in fetching the required product.."});
    })
})

app.get("/editproduct/:productid", (req, res) => {
    const productid = req.params.productid;
    dbinstance.collection("table_data").findOne({_id:new mongodb.ObjectId(productid)}).then((data) => {
        if (data) {
            console.log({success:true, message:"Product fetched successfully for updation"});
            res.render("updateProduct",{data});
        } else {
            console.log({success:false, message:"Product not found"});
            res.redirect("/");
        }
        }).catch((err) => {
            console.log({success:false,message:"Error in fetching the required product.."});
            res.redirect("/");
        })
})

app.post("/editproduct/:productid", (req, res) => {
    const productid = req.params.productid;
    const { name, price } = req.body;
    dbinstance.collection("table_data").updateOne({_id:new mongodb.ObjectId(productid)}, { $set:{ name, price }}).then((data) => {
        if(data.modifiedCount === 1){
            console.log({success:true,message:"Product updated successfully"});
            res.redirect("/");
        }else{
            console.log({success:false,message:"Data not updated"});
            res.redirect("/");
        }
    }).catch((err) => {
        console.log({success:false,message:"Error in data updation.."});
        res.redirect("/");
    })
})

app.get("/deleteproduct/:productid",(req, res) => {
    const productid = req.params.productid;
    dbinstance.collection("table_data").deleteOne({_id:new  mongodb.ObjectId(productid)}).then((data) => {
        console.log({success:true,message:"Data deleted successfully"});
        res.redirect("/");
    }).catch((err) => {
        console.log({success:false,message:"Error in deleting data"});
        res.redirect("/");
    })
})

app.listen(3000, (err) => {
    if(err){
        console.log("Error Occurred while starting the server..");
    }else{
        console.log("Server is listening at http://localhost:3000");
    }
})