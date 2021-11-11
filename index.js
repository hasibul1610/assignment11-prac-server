const express = require('express');

const { MongoClient } = require('mongodb');
const cors = require("cors");
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;


const port = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ernke.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/', (req, res) => {
    res.send('Assignment 11 prac Server is sunning');
})

client.connect((err) => {
    const serviceCollection = client.db('assignment11-prac').collection('services');
    const bookingsCollection = client.db('assignment11-prac').collection('bookings');

    //Add service
    app.post('/addServices', async (req, res) => {
        const result = await serviceCollection.insertOne(req.body);
        // console.log(result);
        res.send(result);
    })

    //get all services
    app.get('/allServices', async (req, res) => {
        const result = await serviceCollection.find({}).toArray();
        res.send(result);
    })

    //get single product
    app.get('/singleProduct/:id', async (req, res) => {
        // console.log(req.params.id);
        const result = await serviceCollection.
            find({ _id: ObjectId(req.params.id) })
            .toArray();
        // console.log(result);
        res.send(result[0]);
    })

    //Confirm Order
    app.post('/confirmOrder', async (req, res) => {
        const result = await bookingsCollection.insertOne(req.body);
        // console.log(result);
        res.send(result);
    })

    //my confirmed order
    app.get('/myOrders/:email', async (req, res) => {
        const result = await bookingsCollection.find({ email: req.params.email }).toArray();
        // console.log(result);
        res.send(result);
    })

    // delete order
    app.delete('/deleteOrder/:id', async (req, res) => {
        const result = await bookingsCollection.deleteOne({
            _id: ObjectId(req.params.id),
        });
        // console.log(result);
        res.send(result);
    })
    //get all services for admin
    app.get('/services', async (req, res) => {
        const result = await serviceCollection.find({}).toArray();
        res.send(result);
    })
    // delete order
    app.delete('/deleteService/:id', async (req, res) => {
        const result = await serviceCollection.deleteOne({
            _id: ObjectId(req.params.id),
        });
        // console.log(result);
        res.send(result);
    })

    //All orders for admin to st the pending status
    app.get('/allOrders', async (req, res) => {
        const result = await bookingsCollection.find({}).toArray();
        res.send(result);
    })

    //Updating the status
    app.put('/updateStatus/:id', (req, res) => {
        const id = req.params.id;
        const updatedStatus = req.body.status;
        const filter = { _id: ObjectId(id) }
        // console.log(updatedStatus);
        const result = bookingsCollection.updateOne(filter, {
            $set: { status: updatedStatus }
        })
            .then(result => {
                // console.log(result);
                res.send(result);
            })
    })
});

app.listen(port, () => {
    console.log('Server is running on port: ', port);
})