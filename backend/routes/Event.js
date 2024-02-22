// Import the required modules
const express = require("express")
const router = express.Router()

//Import the Controllers

const {
    addEvent,
    showEvents,
    updateEvent,
    deleteEvent
} = require("../controllers/Event")

//Route for creation of an event
router.post("/addEvent",addEvent)

//Route to show all events
router.get("/showEvents",showEvents)

//Route to update an event
router.put("/updateEvent/:id",updateEvent)

//Route for deletion of an event
router.delete("/deleteEvent/:id",deleteEvent)

module.exports = router