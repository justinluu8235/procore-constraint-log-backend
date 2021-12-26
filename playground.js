
const {ConstraintTracker} = require('./models');

ConstraintTracker.insertMany({
    trackerName: "Electrical Weekly Meeting",
    group: [
        {
        name: "Justin",
        company: "WT"
    },
    {
        name: "Sonja",
        company: "WT"
    }
    ],
    constraintOpen: 1
})
.then((newConstraintTracker) => {
    console.log(newConstraintTracker);
})
.catch((error) => {
    console.log(error);
})