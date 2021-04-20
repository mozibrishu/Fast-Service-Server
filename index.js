const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId;

const port = 5000;
const app = express()
app.use(bodyParser.json());
app.use(cors());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.isyks.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    console.log(err);
    const serviceCollection = client.db("fastService").collection("services");
    const adminCollection = client.db("fastService").collection("admin");
    const reviewCollection = client.db("fastService").collection("review");
    const orderedServiceCollection = client.db("fastService").collection("orderedService");

    app.post('/addService', (req, res) => {
        const service = req.body;
        serviceCollection.insertOne(service)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    });

    app.get('/service', (req, res) => {
        serviceCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })
    app.get('/service/:id', (req, res) => {
        serviceCollection.find({ _id: ObjectId(req.params.id) })
            .toArray((err, documents) => {
                res.send(documents[0]);
            })
    })

    app.delete('/deleteService/:id', (req, res) => {
        serviceCollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then(result => {
                res.send(result.deletedCount > 0);
            })
    })
    app.post('/isAdmin', (req, res) => {
        const email = req.body.email;
        adminCollection.find({ email: email })
            .toArray((err, admin) => {
                res.send(admin.length>0);
            })
    })
    app.post('/addAdmin', (req, res) => {
        const admin = req.body;
        adminCollection.insertOne(admin)
            .then(result => {
                res.send(result.insertedCount)
            })
    })
    app.get('/review', (req, res) => {
        reviewCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })
    app.post('/addReview', (req, res) => {
        const review = req.body;
        reviewCollection.insertOne(review)
            .then(result => {
                res.send(result.insertedCount)
            })
    })

    app.get('/', (req, res) => {
        res.send("It's Working")
    })

    app.get('/orderedService', (req, res) => {
        orderedServiceCollection.find({ email: req.query.email }).sort({ orderTime: -1 })
            .toArray((err, documents) => {
                res.send(documents);
            })
    });
    app.post('/addOrderService', (req, res) => {
        const order = req.body;
        orderedServiceCollection.insertOne(order)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    app.get('/allOrders', (req, res) => {
        orderedServiceCollection.find({}).sort({ orderTime: -1 })
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    

});



app.listen(process.env.PORT || port)