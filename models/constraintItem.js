const mongoose = require('mongoose');

//define schema
const constraintItemSchema = new mongoose.Schema({
    driver:String,
    itemName: String, 
    bICTeam: String, 
    bICName: String,
    description: String, 
    nextStep: String, 
    targetDate: String,
    priorityLevel: String,
    trackerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ConstraintTracker'
    },
})


//name the model
const ConstraintItem = mongoose.model("ConstraintItem", constraintItemSchema);

module.exports = ConstraintItem;