const express = require('express');
const cors = require('cors')
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config()

//Middlewar
app.use(cors())
app.use(express.json())



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lg6jp.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
      await client.connect();
      const usersCollection = client.db("DeskalaTask").collection("users")
      const candidatesCollection = client.db("DeskalaTask").collection("candidates")

      // store users in database
      app.put('/users/:email', async(req, res)=>{
        const email = req.params.email;
        const user = req.body;
        const filter = {email : email};
        const options = { upsert: true };
        const updateDoc = {
          $set: user,
        }
        const candidates = await usersCollection.updateOne(filter,updateDoc,options)
        
        res.send(candidates)
      })

      // Create candidates
      app.post('/candidates', async(req, res)=>{
        const data = req.body;
        const result = await candidatesCollection.insertOne(data)
        res.send(result);
      })

      // get all candidates
      app.get('/candidates', async(req, res)=>{
        const query = {}
        const result = await candidatesCollection.find(query).toArray()
        res.send(result)
      })

      //* delete candidates
      app.delete('/candidates/:id', async(req, res)=>{
        const id = req.params.id;
        const query = {_id:ObjectId(id)}
        const result = await candidatesCollection.deleteOne(query);
        res.send(result)
    })

    // get single candidate
    app.get('/candidate/:id', async(req,res)=>{
      const id = req.params.id;
      const query = {_id:ObjectId(id)};
      const result = await candidatesCollection.findOne(query)
      res.send(result);
    })

    // Update candidates
    app.put('/candidate/:id', async(req, res)=>{
      const id = req.params.id;
      const candidate = req.body;
      const filter = {_id:ObjectId(id)};
      const updateDoc = {
        $set: candidate,
      }
      const candidates = await candidatesCollection.updateOne(filter,updateDoc)
      
      res.send(candidates)
    })


    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);



app.get('/', (req, res)=>{
    res.send('deskala task backend code runnig')
})
app.listen(port, ()=>{
    console.log('successfuly deskala task running code', port);
})