const express = require('express');
const cors = require('cors')
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config()

//Middlewar
app.use(cors())
app.use(express.json())



const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lg6jp.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
      await client.connect();
      const candidatesCollection = client.db("DeskalaTask").collection("candidates")

      // store candidates in database and issue jwt token
      app.put('/candidates/:email', async(req, res)=>{
        const email = req.params.email;
        const user = req.body;
        const filter = {email : email};
        const options = { upsert: true };
        const updateDoc = {
          $set: user,
        }
        const candidates = await candidatesCollection.updateOne(filter,updateDoc,options)
        
        res.send(candidates)
      })

      // get all candidates
      app.get('/candidates', async(req, res)=>{
        const query = {}
        const result = await candidatesCollection.find(query).toArray()
        res.send(result)
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