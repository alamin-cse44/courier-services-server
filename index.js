const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// midddleware : for posting 
app.use(cors());
app.use(express.json());


// user : courierServices
// password : f2TyyotEbiIxMGrU
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zslia.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        const database = client.db("courierServices");
        const serviceCollection = database.collection("services");

        // post api : express post site done
      app.post('/services', async(req, res) =>{
        
        const newUser = req.body;
        const result = await serviceCollection.insertOne(newUser);
        console.log('got new service',req.body);
        console.log('added service', result); 
        res.json(result);
    });

        //   Get api
        app.get('/services', async(req, res)=>{
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });

        //   get single user by id
            app.get('/services/:id', async(req, res) => {
                const id = req.params.id;
                const query = {_id: ObjectId(id)};
                const service = await serviceCollection.findOne(query);
                console.log('load service with id ', id);
                res.send(service);
            });

            //  update api
        app.put('/services/:id', async(req, res) =>{
            const id = req.params.id;
            const updatedService = req.body;
            const filter = { _id:ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
            $set: {
                name: updatedService.name,
                description: updatedService.description,
                price: updatedService.price,
                img: updatedService.img
            },
            };
            const result = await serviceCollection.updateOne(filter, updateDoc, options);
            console.log('updating service ',id);
            res.json(result);
        })

        //   delete api
        app.delete('/users/:id', async(req, res )=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await serviceCollection.deleteOne(query);
        
            console.log('deleting user with id ',result);
            res.json(result);
        })

    }
    finally{
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req,res)=>{
    res.send('Courier server is running');
})

app.listen(port, ()=>{
    console.log('Running server on port', port);
})