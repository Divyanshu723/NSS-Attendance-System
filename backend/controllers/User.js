const Admin = require("../models/admin");
const User = require("../models/user");

//Create a new user
exports.addUser = async (req, res) => {
    console.log("Enters in /addUser Route");
    const { name, registrationNumber, email, course, branch, year } = req.body;
    const password = registrationNumber;
    // console.log(name, registrationNumber, password, course, branch, year);
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