const express = require('express');
const app = express();
app.use(express.json());
const {ConstraintTracker} = require('./models')
// const methodOverride = require('method-override');
// app.use(methodOverride('_method'));

app.get("/constraintTracker" , async (request, response) => {
    try{
        const constraintTrackerArray = await ConstraintTracker.find({});
        response.json({constraintTrackerArray});
    }
    catch(error){
        response.status(500).send(error);
    }

});





app.listen(3000, () =>{
    console.log("Server is running at port 3000");
})