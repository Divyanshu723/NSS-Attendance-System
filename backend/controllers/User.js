const Event = require("../models/event");
const User = require("../models/user");

//Create a new user
exports.addUser = async (req, res) => {
    console.log("Enters in /addUser Route");
    const { name, registrationNumber, email, course, branch, year } = req.body;
    const password = registrationNumber;
    // console.log(name, registrationNumber, password, course, branch, year);

    // Code to chack whether the registration number is already exists or not
    const isAlreadyExists = await User.findOne({ registrationNumber });
    console.log("response of registration number ", isAlreadyExists);
    if (isAlreadyExists) {
        return res.status(500).json({
            success: false,
            message: "This registration number already exist"
        })
    }

    try {
        let user = new User({
            name,
            registrationNumber,
            password,
            email,
            course,
            branch,
            year,
        });
        console.log(user);
        await user.save();
        res.json({ success: true, message: "User created successfully" });
    } catch (error) {
        res.json({ success: false, message: "Error occured" });
    }
}

//show All Users
exports.showUsers = async (req, res) => {
    const userData = await User.find();
    try {
        if (userData) {
            res.json(userData);
        } else {
            res.json([]);
        }
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}

//Update the user
exports.updateUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findOne({ _id: id });

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        // Update the user properties
        user.name = req.body.name;
        user.registrationNumber = req.body.registrationNumber;
        user.email = req.body.email;
        user.course = req.body.course;
        user.branch = req.body.branch;
        user.year = req.body.year;

        await user.save();

        res.json({ success: true, message: "User updated successfully" });
    } catch (error) {
        console.log("hey, error occurred");
        res.json({ success: false, message: "Error occurred" });
    }
}

//Delete the user
exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    console.log(id);

    try {
        const deletedUser = await User.findByIdAndRemove(id);

        if (deletedUser) {
            return res.json({ success: true, message: "User deleted successfully" });
        } else {
            return res.json({ success: false, message: "User not found" });
        }
    } catch (error) {
        return res.json({
            success: false,
            message: "Error occurred while deleting user",
        });
    }
}

// get user details by id
exports.getUserDetailsWithAttendance = async (req, res) => {
    const { userId } = req.params;

    try {
        // Find the user by ID and populate the events array
        const user = await User.findById(userId).populate({
            path: 'events',
            populate: {
                path: 'assignedTo',
                select: 'name',
                model: 'Admin' // Make sure you have an Admin model defined
            }
        });

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        // Find the total number of events
        const totalEvents = await Event.countDocuments();

        // Calculate the attendance percentage
        const attendedEvents = user.events.length;
        const attendancePercentage = (attendedEvents / totalEvents) * 100;

        // Prepare the response
        const userDetails = {
            name: user.name,
            registrationNumber: user.registrationNumber,
            email: user.email,
            course: user.course,
            branch: user.branch,
            year: user.year,
            attendedEvents: user.events,
            attendancePercentage: attendancePercentage.toFixed(2) // to limit to 2 decimal places
        };

        return res.json({ success: true, data: userDetails });
    } catch (error) {
        return res.json({
            success: false,
            message: "Error occurred while fetching user details",
        });
    }
};