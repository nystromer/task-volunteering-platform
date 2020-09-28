const mongoose = require('mongoose')
const mongo_url = process.env.MONGODB_URL
console.log(mongo_url)

mongoose.connect(mongo_url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});

const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully")
});