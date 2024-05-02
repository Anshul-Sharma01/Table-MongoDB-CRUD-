const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();


app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(__dirname + "/views"));
app.set("view engine", "ejs");


const mongodb = require("mongodb");
const client = mongodb.MongoClient;
const object = mongodb.ObjectId;

let dbinstance;

client.connect("mongodb://127.0.0.1:27017").then((database) => {
    console.log("connected")
    dbinstance = database.db("table");
}).catch((err) => {
    console.log("Error occurred : ",err);
})



app.get("/",async (req,res) => {
    try{
        const collection = dbinstance.collection("product_table");
        const products = await collection.find({},{ projection: {
            _id:1,
            name:1,
            price:1
        }}).toArray();
        res.render("home",{products})
    }catch(error){
        console.log("Error fetching data : ",error);
        res.status(500).json("An error occurred while fetching data ");
    }
})

app.get("/view/:productId", async (req, res) => {
    try {
        const collection = dbinstance.collection("product_table");
        const productId = req.params.productId;

        const productInfo = await collection.find({}, {
            projection: {
                _id: 1,
                name: 1,
                price: 1
            }
        }).toArray();

        res.render("viewProduct", { productInfo,productId });

    } catch (err) {
        console.error(`Error occurred while fetching the data: ${err}`);
        // Respond with a 500 status code and an error message
        res.status(500).json({
            success: false,
            message: "Error fetching data for view"
        });
    }
});





app.get("/update/:productId",async (req,res) => {
    try{
        const productId = req.params.productId; 
        const collection = dbinstance.collection("product_table");
        const productInfo = await collection.find({},{project:{
            _id:1,
            name:1,
            price:1
        }}).toArray();
        res.render("updateProduct",{productInfo,productId})
    }catch(err){
        console.log(`Error occurred while fetching data : ${err}`);
        return res.status(400).json({
            success:false,
            message:"Error fetching data for updation !!"
        })
    }
})

// app.get("/delete/:productId",(req,res) => {
//     const productId = req.params.productId;
//     return res.status(200).json({
//         success:true,
//         productId
//     })
// })

app.listen(3000, () => {
    console.log(`Server is listening at https://localhost:3000`);
})
