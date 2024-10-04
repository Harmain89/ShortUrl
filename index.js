const express = require('express')
const { connectToMongoDB } = require('./connect.js');
const cookieParser = require('cookie-parser');
const { restrictToLoggedInUserOnly } = require('./middlewares/auth.middleware.js');

const app = express();
const PORT = 8000;


connectToMongoDB('mongodb://localhost:27017/short-url')
    .then(() => console.log('mongoDB Connected!.'))

app.use(express.json())
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(cookieParser())

const urlRoute = require('./routes/url.route.js');
const authRoute = require('./routes/auth.route.js');

app.use('/url', restrictToLoggedInUserOnly, urlRoute);
app.use('/auth', authRoute);


app.listen(PORT, () => console.log('Server Started Successfully!.'));