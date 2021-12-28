
const {ConstraintTracker, ConstraintItem} = require('./models');


// ConstraintTracker.insertMany({
//     trackerName: "Electrical Weekly Meeting",
//     group: [
//         {
//         name: "Justin",
//         company: "WT"
//     },
//     {
//         name: "Sonja",
//         company: "WT"
//     }
//     ],
//     constraintOpen: 1
// })
// .then((newConstraintTracker) => {
//     console.log(newConstraintTracker);
// })
// .catch((error) => {
//     console.log(error);
// })



// ConstraintItem.insertMany({
//     itemName: "constraint item 1"
// })
// .then((newConstraintItem) => {
//     console.log(newConstraintItem);
// })
// .catch((error) => {
//     console.log(error);
// })

ConstraintTracker.findById('61c7f612454271758799d540')
.then((tracker) => {
    ConstraintItem.insertMany({
        itemName: "Constraint 55", 
        trackerId: tracker.id
    })
    .then((item) => {
        console.log(item);
    })
    .catch((err) => {
        console.log(err)
    })
})
.catch((error) => {
    console.log(error);
})

// ConstraintTracker.findById('61c7f612454271758799d540')
// .then((tracker) => {
//     console.log(tracker);
// })
// .catch((error) => {
//     console.log(error);
// })