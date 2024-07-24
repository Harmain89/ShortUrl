const express = require('express')
const { connectToMongoDB } = require('./connect.js');

const app = express();
const PORT = 8000;


connectToMongoDB('mongodb://localhost:27017/short-url')
    .then(() => console.log('mongoDB Connected!.'))

app.use(express.json())

const urlRoute = require('./routes/url.route.js');

app.use('/url', urlRoute);


app.listen(PORT, () => console.log('Server Started Successfully!.'));