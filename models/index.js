require("dotenv").config();
const mongoose = require("mongoose");

const {MONGO_URI} = process.env;

const configOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

//connect to mongoDB
mongoose.connect(MONGO_URI, configOptions)
.then(() => console.log("MongoDB successfully connected..."))
.catch((error)=> console.log("MongoDB connection error:", error));

const db = mongoose.connection;
db.once("open", () => {
    console.log(`Connected to MongoDB on ${db.host}:${db.port}`);
});

db.on("error", ()=>{
    console.log('MongoDB Error');
})


module.exports = {
    ConstraintTracker: require("./constraintTracker"),
    ConstraintItem: require("./constraintItem")
}