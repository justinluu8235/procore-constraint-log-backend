const mongoose = require('mongoose');

//define schema
const constraintItemSchema = new mongoose.Schema({
    itemName: String, 
    trackerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ConstraintTracker'
    },
})


//name the model
const ConstraintItem = mongoose.model("ConstraintItem", constraintItemSchema);

module.exports = ConstraintItem;