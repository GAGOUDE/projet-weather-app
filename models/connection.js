const mongoose = require('mongoose');

const dotenv = require("dotenv");
dotenv.config();

const BDD_URL = process.env.BDD_URL;

const options = {
    connectTimeoutMS: 30000,
    useUnifiedTopology : true,
    useNewUrlParser: true,
}

mongoose.connect(BDD_URL,
    options,
    function (err) {
        console.log(err);
    }
);