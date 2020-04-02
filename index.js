const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

// const dbUsername = process.env.DB_USER;
// const dbPassword = process.env.DB_PASS;
// const uri = process.env.DB_PATH;
const uri = 'mongodb+srv://fDemoDB:eghAc6DGEGbVuH9f@cluster0-i9tn9.mongodb.net/test?retryWrites=true&w=majority';
let client = new MongoClient(uri, { useNewUrlParser: true });


// Get
app.get('/', (req, res) => {
    res.send('<a href="/products">Products</a>');
});

app.get('/products', (req, res) => {
    client = new MongoClient(uri, { useNewUrlParser: true });

    client.connect(err => {
        const collection = client.db("onlineStore").collection("products");
        collection.find().toArray((err, documents) => {
            if (err) {
                console.log(err);
                res.status(500).send({ message: err });
            } else {
                res.send(documents);
            }
        });
        console.log('connected');
        client.close();
    });
});

const users = ['Asadul', 'Wasek', 'Lokman', 'Alamin', 'Alamgir']
app.get('/users/:id', (req, res) => {
    const id = req.params.id;
    const name = users[id];
    res.send({ id, name });

    console.log(req.query);
});

// Post
app.post('/addProduct', (req, res) => {
    const product = req.body;

    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("onlineStore").collection("products");
        collection.insert(product, (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send({ message: err });
            } else {
                res.send(result.ops[0]);
            }
        });
        client.close();
    });
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening to port ${port}`));