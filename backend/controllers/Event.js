const Event = require("../models/event");
const Admin = require("../models/admin");

const moment = require("moment-timezone");

//Create a new event
exports.addEvent = async (req, res) => {
    const { name, startDate, endDate } = req.body;
    // console.log(startDate + " " + endDate);

    try {
        // Convert start and end dates to Indian Standard Time (IST) using moment-timezone
        const indiaTimeZone = "Asia/Kolkata";
        const format = "YYYY-MM-DDTHH:mm";
        const convertedStartDate = moment
            .tz(startDate, format, indiaTimeZone)
            .toDate();
        const convertedEndDate = moment.tz(endDate, format, indiaTimeZone).toDate();
        // console.log(convertedStartDate+" "+convertedEndDate)
        // Create a new Event instance with the correct date format
        let event = new Event({
            eventName: name,
            startDate: convertedStartDate,
            endDate: convertedEndDate,
        });

        await event.save();
        res.json({ success: true, message: "Event created successfully" });
    } catch (error) {
        console.error("Error saving event:", error);
        res.json({ success: false, message: "Error occurred" });
    }
}

// Show All Events
exports.showEvents = async (req, res) => {
    const eventData = await Event.find();
    try {
        if (eventData) {
            res.json(eventData);
        }
        else {
            res.json([]);
        }
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}

// Update the event
exports.updateEvent = async (req, res) => {
    const { id } = req.params;
    console.log(id);
    console.log("/updateEvent");

    try {
        const event = await Event.findOne({ _id: id });
        console.log(event);

        if (!event) {
            return res.json({ success: false, message: "Event not found" });
        }

        // Convert startDate and endDate to Indian Standard Time (IST)
        const indiaTimeZone = "Asia/Kolkata";
        event.eventName = req.body.eventName;
        event.startDate = moment.tz(req.body.startDate, indiaTimeZone).toDate();
        event.endDate = moment.tz(req.body.endDate, indiaTimeZone).toDate();

        console.log(
            "hello " + event.eventName + "  " + event.startDate + "  " + event.endDate
        );
        await event.save();

        res.json({ success: true, message: "Event updated successfully" });
    } catch (error) {
        console.log("Error occurred:", error);
        res.json({ success: false, message: "Error occurred" });
    }
}

//Delete the event
exports.deleteEvent = async (req, res) => {
    const { id } = req.params;
    console.log(id);

    try {
        const deletedEvent = await Event.findByIdAndRemove(id);
        if (deletedEvent) {
            return res.json({ success: true, message: "Event deleted successfully" });
        } else {
            return res.json({ success: false, message: "Event not found" });
        }
    } catch (error) {
        return res.json({
            success: false,
            message: "Error occurred while deleting event",
        });
    }
}
