const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-Parser');
const { readdirSync } = require('fs');
const cors = require('cors');

require('dotenv').config()

//import the routes
//const authRoutes = require('./routes/auth')

const app = express();

//database connection for Url
mongoose.connect(process.env.DATABASE, {

    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,

})

    //bug warning
    .then(() => console.log("Connection Succesful"))
    .catch(error => console.log(`DB Connection Error ${error}`));

//to run between the url and post routes
app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "2mb" }));
app.use(cors());

//routes middle
//route
//request from client to our server
//server will the send the respon
readdirSync("./routes").map((r) =>
    app.use("/api", require("./routes/" + r))
);




//port to run the web;
const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Server is running on port ${port}`));
