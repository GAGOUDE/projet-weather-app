const mongoose = require('mongoose');

const options = {
    connectTimeoutMS: 5000,
    useUnifiedTopology : true,
    useNewUrlParser: true,
}

mongoose.connect('mongodb+srv://weather_App1:weather_App1_Portfolio@cluster0.xzqpz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    options,
    function (err) {
        console.log(err);
    }
);