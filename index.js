const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const dotenv=require('dotenv');
const UserRoute = require('./app/routes/user');
const mongoose = require('mongoose');
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
dotenv.config({ path: './config.env' });

// Database Connectivity
const DB=process.env.DATABASE.replace('<password>',process.env.DATABASE_PASSWORD);
// const dbConfig = require('./config/database.config.js');

mongoose.Promise = global.Promise;
mongoose.connect(DB
).then(() => {
    console.log("Database Connected Successfully!!");
}).catch(err => {
    console.log('Could not connect to the database', err);
    process.exit();
});

//Define Routings
app.get('/', (req, res) => {
    res.json({ "message": "Hello Crud Node Express" });
});

app.use('/user',UserRoute);

app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});