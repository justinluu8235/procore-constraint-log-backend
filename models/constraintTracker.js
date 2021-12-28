const mongoose = require('mongoose');

//define schema
const constraintTrackerSchema = new mongoose.Schema({
    trackerName: String, 
    group: [{
            name: String,
            company: String
        }],
    constraintsOpen: Number,
    // constraints: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'ConstraintItem'
    // }]
})


//name the model
const ConstraintTracker = mongoose.model("ConstraintTracker", constraintTrackerSchema);

module.exports = ConstraintTracker;