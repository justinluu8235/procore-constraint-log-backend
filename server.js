const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const {ConstraintTracker, ConstraintItem} = require('./models')
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

app.post("/constraintTracker", async (request, response) => {
    let memberNameArr = request.body.memberName;
    let memberCompanyArr = request.body.memberCompany;
    //parse data into 'group' object
    let groupArr = [memberNameArr.length];
    for(let i=0; i<memberNameArr.length; i++){
        let memberObj = {
            name: memberNameArr[i],
            company: memberCompanyArr[i]
        }
        groupArr[i] = memberObj;
    }


    try{
        await ConstraintTracker.insertMany({
            trackerName: request.body.trackerName,
            group: groupArr,
            constraintOpen: 1
        })
    }
    catch(error){
        response.status(500).send(error);
    }


    response.redirect("http://localhost:3001");
})



app.get("/constraintItem/:id" , async (request, response) => {
    try{


        const constraintItemArr = await ConstraintItem.find({
            trackerId: request.params.id
        });
        response.json({constraintItemArr});
    }
    catch(error){
        response.status(500).send(error);
    }

});

app.post("/constraintItem/:id" , async (request, response) => {
    try{
        await ConstraintItem.insertMany({
            driver: request.body.driver,
            itemName: request.body.itemName,
            bICTeam: request.body.bICTeam,
            bICName: request.body.bICName,
            description: request.body.description,
            nextStep: request.body.nextStep,
            targetDate: request.body.targetDate,
            priorityLevel: request.body.targetDate,
            trackerId: request.params.id
        })


    }
    catch(error){
        response.status(500).send(error);
    }

    response.redirect(`http://localhost:3001/constraints/${request.params.id}`)

});










app.listen(3000, () =>{
    console.log("Server is running at port 3000");
})