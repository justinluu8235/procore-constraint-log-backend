const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const {ConstraintTracker, ConstraintItem} = require('./models')
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

const PORT = process.env.PORT || 3000;

app.get("/constraintTracker" , async (request, response) => {
    try{
        const constraintTrackerArray = await ConstraintTracker.find({});
        response.json({constraintTrackerArray});
    }
    catch(error){
        response.status(500).send(error);
    }

});

app.get("/constraintTracker/:id" , async (request, response) => {
    try{
        const constraintTracker = await ConstraintTracker.findById(request.params.id);
        response.json({constraintTracker});
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
         //if both fields are empty, skip this one
         if(memberNameArr[i] === '' && memberCompanyArr[i] === '' ){
            continue;
        }
        //if company is empty, make it N/A
        else if (memberCompanyArr[i] === '' ){
            memberCompanyArr[i] = 'N/A';
        }
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



//Update an existing tracker
app.post("/constraintTracker/:id", async (request, response) => {
    let trackerId = request.params.id;
  
    let memberNameArr = request.body.memberName;
    let memberCompanyArr = request.body.memberCompany;

    //parse data into 'group' object    
    let groupArr = [memberNameArr.length];
    for(let i=0; i<memberNameArr.length; i++){
        //if both fields are empty, skip this one
        if(memberNameArr[i] === '' && memberCompanyArr[i] === '' ){
            continue;
        }
        //if company is empty, make it N/A
        else if (memberCompanyArr[i] === '' ){
            memberCompanyArr[i] = 'N/A';
        }
        let memberObj = {
            name: memberNameArr[i],
            company: memberCompanyArr[i]
        }
        groupArr[i] = memberObj;
    }

    try{
       let updatedTracker =  await ConstraintTracker.updateOne({
            _id: trackerId
        },{
            $set: {
                trackerName: request.body.trackerName,
                group: groupArr,
                constraintOpen: 1
            }
        });

        response.redirect("http://localhost:3001")
    }
    catch(err) {
        response.status(500).send(error);
    }
    
});

app.delete("/constraintTracker/:id" , async (request, response) => {
    try{

        let deletedItems = await ConstraintItem.remove({
            trackerId: request.params.id
        });

        console.log(deletedItems);
        
        let deletedTracker = await ConstraintTracker.remove({
            _id: request.params.id
        });
        console.log(deletedTracker);
        
        response.redirect(`http://localhost:3001/`)
    }
    catch(error){
        response.status(500).send(error);
    }
});


//route to get information for a single constraint item for editing
app.get("/constraintItem/edit/:id" , async (request, response) => {
    try{
        let constraintItem = await ConstraintItem.findOne({
            _id: request.params.id
        })
       response.json({constraintItem})
    }
    catch(error){
        response.status(500).send(error);
    }
});

//Route to get all the constraint items for a trakcer
app.get("/constraintItem/:id" , async (request, response) => {
    
    try{
        const constraintItemArr = await ConstraintItem.find({
            trackerId: request.params.id
        });

        let stats = await getStats(request.params.id);


        const constraintTracker = await ConstraintTracker.findById(request.params.id);
        let trackerName = constraintTracker.trackerName;
        response.json({constraintItemArr, trackerName, stats});
    }
    catch(error){
        response.status(500).send(error);
    }

});


//Edit an existing constraint item
app.post("/constraintItem/edit/:id" , async (request, response) => {
    try{
        
        let updatedConstraintItem = await ConstraintItem.updateOne({
            _id: request.params.id

        },{
            $set: {
                driver: request.body.driver,
                itemName: request.body.itemName,
                emailSubject: request.body.emailSubject,
                bICTeam: request.body.bICTeam,
                bICName: request.body.bICName,
                description: request.body.description,
                nextStep: request.body.nextStep,
                targetDate: request.body.targetDate,
                priorityLevel: request.body.priorityLevel,
            }
        })

        let item = await ConstraintItem.findOne({
            _id: request.params.id
        })
        let trackerId = item.trackerId;


        response.redirect(`http://localhost:3001/constraints/${trackerId}`)
    }
    catch(error){
        response.status(500).send(error);
    }


});

//Create a constraint item
app.post("/constraintItem/:id" , async (request, response) => {
    try{
        await ConstraintItem.insertMany({
            driver: request.body.driver,
            itemName: request.body.itemName,
            emailSubject: request.body.emailSubject,
            bICTeam: request.body.bICTeam,
            bICName: request.body.bICName,
            description: request.body.description,
            nextStep: request.body.nextStep,
            targetDate: request.body.targetDate,
            priorityLevel: request.body.priorityLevel,
            trackerId: request.params.id
        })


    }
    catch(error){
        response.status(500).send(error);
    }

    response.redirect(`http://localhost:3001/constraints/${request.params.id}`)

});


app.delete("/constraintItem/:id" , async (request, response) => {
    try{

        let item = await ConstraintItem.findOne({
            _id: request.params.id
        })
        let trackerId = item.trackerId;


        
        let deletedItem = await ConstraintItem.remove({
            _id: request.params.id
        });
        console.log(deletedItem);
        response.redirect(`http://localhost:3001/constraints/${trackerId}`)
    }
    catch(error){
        response.status(500).send(error);
    }
});

async function getStats(trackerID){
    let stats = {};
    let urgentCount = await ConstraintItem.find({
        trackerId: trackerID,
        priorityLevel: "Urgent"
    }).count();
    stats.urgentCount = urgentCount;
    let highCount = await ConstraintItem.find({
        trackerId: trackerID,
        priorityLevel: "High"
    }).count();
    stats.highCount = highCount;

    let mediumCount = await ConstraintItem.find({
        trackerId: trackerID,
        priorityLevel: "Medium"
    }).count();
    stats.mediumCount = mediumCount;

    let lowCount = await ConstraintItem.find({
        trackerId: trackerID,
        priorityLevel: "Low"
    }).count();
    stats.lowCount = lowCount;

    let designTeamCount = await ConstraintItem.find({
        trackerId: trackerID,
        bICTeam: "Design Team"
    }).count();
    stats.designTeamCount = designTeamCount;

    let gcCount = await ConstraintItem.find({
        trackerId: trackerID,
        bICTeam: "General Contractor"
    }).count();
    stats.gcCount = gcCount;

    let tradePartnerCount = await ConstraintItem.find({
        trackerId: trackerID,
        bICTeam: "Trade Partner"
    }).count();
    stats.tradePartnerCount = tradePartnerCount;

    let ownerCount = await ConstraintItem.find({
        trackerId: trackerID,
        bICTeam: "Owner"
    }).count();
    stats.ownerCount = ownerCount;


    let items = await ConstraintItem.find({
        trackerId: trackerID,
    })
    let driverObj = {};
    for(let i=0; i<items.length; i++){
        let driver = items[i].driver;
        if(driver == ''){
            continue;
        }

        if(driverObj[driver] == null){
            driverObj[driver] = 1;
        }
        else{
            driverObj[driver] ++;
        }
    }
    stats.driverObj = driverObj;

    return stats;
}

app.listen(PORT, () =>{
    console.log("Server is running at port 3000");
})