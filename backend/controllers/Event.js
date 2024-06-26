const Event = require("../models/event");
const Admin = require("../models/admin");

const moment = require("moment-timezone");

//Create a new event
exports.addEvent = async (req, res) => {
    const { name, startDate, endDate, admin2Id } = req.body;
    // console.log(startDate + " " + endDate);

    try {

        // check validation
        if (!name || !startDate || !endDate || !admin2Id) {
            return res.json({ success: false, message: "Please fill all fields" });
        }

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
            assignedTo: admin2Id,
        });

        await event.save();

        // Check if admin exists and push the event to the admin's assigned events
        const admin = await Admin.findById(admin2Id);
        admin.event.push(event._id);
        await admin.save();

        res.json({ success: true, message: "Event created successfully" });
    } catch (error) {
        console.error("Error saving event:", error);
        res.json({ success: false, message: "Error occurred" });
    }
}

// Show All Events
exports.showEvents = async (req, res) => {

    const { userId } = req.params;
    console.log("event ID------", userId);

    try {
        // check admin exists or not 
        const admin = await Admin.findById(userId);
        if (!admin) {
            return res.json({ success: false, message: "Admin not found" });
        }

        let eventData;

        // check type of admin
        if (admin.adminType !== "Admin2") {
            eventData = await Event.find().populate("assignedTo");
        } else {
            eventData = await Event.find({ assignedTo: userId }).populate("assignedTo");
        }

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
    const { admin2Id, eventName, startDate, endDate } = req.body;

    try {
        const event = await Event.findOne({ _id: id });

        if (!event) {
            return res.json({ success: false, message: "Event not found" });
        }

        const oldAdmin2Id = event.assignedTo;

        // check old and new admin2Id are same or not
        if (oldAdmin2Id.toString() !== admin2Id.toString()) {
            const oldAdmin = await Admin.findById(oldAdmin2Id)
            const newAdmin = await Admin.findById(admin2Id)
            if (!oldAdmin || !newAdmin) {
                return res.json({ success: false, message: "Admin not found" });
            }

            // Remove event from old admin's assigned events
            oldAdmin.event = oldAdmin.event.filter((eventId) => eventId.toString() !== id);
            await oldAdmin.save();

            // Add event to new admin's assigned events
            newAdmin.event.push(id);
            await newAdmin.save();
        }

        // Convert startDate and endDate to Indian Standard Time (IST)
        const indiaTimeZone = "Asia/Kolkata";
        event.eventName = eventName;
        event.startDate = moment.tz(startDate, indiaTimeZone).toDate();
        event.endDate = moment.tz(endDate, indiaTimeZone).toDate();
        event.assignedTo = admin2Id; // Update assignedTo field

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
        // remove from admin's assigned events
        const event = await Event.findById(id);
        const admin = await Admin.findById(event.assignedTo);
        admin.event = admin.event.filter((eventId) => eventId.toString() !== id);
        await admin.save();


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
