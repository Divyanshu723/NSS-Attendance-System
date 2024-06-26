const Admin = require("../models/admin");
const OTP = require("../models/OTP")
const otpGenerator = require('otp-generator');
require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");

const SECRET_KEY = process.env.secretKey;

//login
exports.login = async (req, res) => {
    try {
        const { email, password, isAdmin } = req.body;
        console.log("IS ADMIN---->", isAdmin);
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: `Please Fill up All the Required Fields`,
            })
        }

       if(isAdmin){
           const admin = await Admin.findOne({ email });

           if (!admin) {
               console.log("Good");
               return res.status(401).json({
                   success: false,
                   message: `Admin is not Registered with Us Please SignUp to Continue`,
               })
           }

           if (await bcrypt.compare(password, admin.password)) {
               res.json({ success: true, message: "Login successful" });
           } else {
               res.json({ success: false, message: "Invalid credentials" });
           }
       } else{
          const user = await User.findOne({ email });

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: `User is not Registered with Us Please SignUp to Continue`,
                })
            }
            if (await bcrypt.compare(password, user.password)) {
                res.json({ success: true, message: "Login successful" });
            } else {
                res.json({ success: false, message: "Invalid credentials" });
            }
       }
    } catch (error) {
        res.status(500).json({ success: false, message: "An error occurred" });
    }
}

// sendOTP
exports.sendotp = async (req, res) => {
    console.log("BACK OTP");
    try {
        const { email, isAdmin } = req.body;
        console.log("Email: " + email);

        // Check if user is already present
        // Find user with provided email
        let checkUserPresent;
       if(isAdmin){
            checkUserPresent = await Admin.findOne({ email });
       }
       else{
            console.log("Check kr rha h");
            checkUserPresent = await User.findOne({ email });

       }
        // to be used in case of signup
        console.log("User check: " + checkUserPresent);
        // If user found with provided email
        if (!checkUserPresent) {
            // Return 401 Unauthorized status code with error message
            return res.status(401).json({
                success: false,
                message: `Email is not registered`,
            });
        }

        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });
        const result = await OTP.findOne({ otp: otp });
        console.log("Result is Generate OTP Func");
        console.log("OTP", otp);
        console.log("Result", result);
        while (result) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
            });
        }
        const otpPayload = { email, otp };
        console.log("OTP Payload", otpPayload);
        const otpBody = await OTP.create(otpPayload);
        console.log("OTP Body", otpBody);
        res.status(200).json({
            success: true,
            message: `OTP Sent Successfully`,
            otp,
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, error: error.message, message: "Something went wrong" });
    }
};

// Check OTP is correct or not
exports.checkOTP = async (req, res) => {
    try {
        const { email, otp, isAdmin } = req.body;
        
        if (!email || !otp) {
            return res.status(500).json({
                success: false,
                message: `All fields are required`,
            });
         }

        let checkUserPresent;
        if(isAdmin === 'true'){
            console.log("Email: ", email);
            checkUserPresent = await Admin.findOne({ email });
        }else{
            checkUserPresent = await User.findOne({email});
        }
        
        // to be used in case of signup
        console.log("User check: " + checkUserPresent);
        // If user found with provided email
        if (!checkUserPresent) {
            // Return 401 Unauthorized status code with error message
            return res.status(401).json({
                success: false,
                message: `Email is not registered`,
            });
        }

        // find most recent otp for the user
        const recentOtp = await OTP.find(({ email })).sort({ createdAt: -1 }).limit(1);

        // validate OTP
        if (recentOtp.length === 0) {
            // OTP not foound
            return res.status(400).json({
                success: false,
                message: "OTP not found",
            })
        } else if (otp !== recentOtp[0].otp) {
            // invalid OTP
            return res.status(400).json({
                success: false,
                message: "OTP not matched"
            })
        }

        // Token generated
        let token;
        if(isAdmin === 'true'){
               token = jwt.sign(
                { email: checkUserPresent.email, adminType: checkUserPresent.adminType, isAdmin: true },
                SECRET_KEY,
                { expiresIn: "24h" } // Token expires in 24 hours
            );
        }else{
               token = jwt.sign(
                { email: checkUserPresent.email, isAdmin: false},
                SECRET_KEY,
                { expiresIn: "24h" } // Token expires in 24 hours
            );
        }

        return res.status(200).json({
            success: true,
            message: "Email Verified",
            token
        })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, error: error.message, message: "Something went wrong" });
    }
}

//create an admin
exports.addAdmin = async (req, res) => {
    console.log("Enters in /addAdmin Route");
    const {
        name,
        registrationNumber,
        email,
        adminType,
        position,
        course,
        branch,
        year,
    } = req.body;

    // Code to chack whether the registration number is already exists or not
    const isAlreadyExists = await Admin.findOne({ registrationNumber });
    console.log("response of registration number ", isAlreadyExists);
    if (isAlreadyExists) {
        return res.status(500).json({
            success: false,
            message: "This registration number already exist"
        })
    }

    const password = registrationNumber;
    try {
        let admin = new Admin({
            name,
            registrationNumber,
            email,
            password,
            position,
            adminType,
            course,
            branch,
            year,
        });
        await admin.save();
        res.json({ success: true, message: "Admin created successfully", admin });
    } catch (error) {
        res.json({ success: false, message: "Error occured" });
    }
}

//show Admins
exports.showAdmins = async (req, res) => {
    // Fetch all fields except the 'password' field
    const adminData = await Admin.find().select("-password");
    try {
        if (adminData.length > 0) {
            res.json(adminData);
        } else {
            res.json([]);
        }
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}

//update Admin
exports.updateAdmin = async (req, res) => {
    const { id } = req.params;
    console.log("/updateAdmin");

    try {
        const admin = await Admin.findOne({ _id: id });
        console.log(admin);

        if (!admin) {
            return res.json({ success: false, message: "User not found" });
        }

        // Update the user properties
        admin.name = req.body.name;
        admin.registrationNumber = req.body.registrationNumber;
        admin.email = req.body.email;
        admin.position = req.body.position;
        admin.adminType = req.body.adminType;
        admin.course = req.body.course;
        admin.branch = req.body.branch;
        admin.year = req.body.year;
        console.log(
            admin.name,
            admin.registrationNumber,
            admin.email,
            admin.adminType,
            admin.course,
            admin.branch,
            admin.year
        );

        await admin.save();

        res.json({ success: true, message: "User updated successfully" });
    } catch (error) {
        console.log("hey, error occurred");
        res.json({ success: false, message: "Error occurred" });
    }
}

//delete Admin
exports.deleteAdmin = async (req, res) => {
    const { id } = req.params;
    console.log(id);

    try {
        const deletedUser = await Admin.findByIdAndRemove(id);

        if (deletedUser) {
            // console.log("deletedUser")
            console.log(deletedUser)
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

//Controller for Admin2
//take attendance
exports.takeAttendance = async (req, res) => {
    try {
        // Retrieve the eventName and userEmail from the request body
        const { eventName, userEmail } = req.body;
        const user = await User.findOne({ email: userEmail }); 
        console.log("Event Name: ", eventName);
        console.log("Email: ", userEmail);

        // Check if the eventName and userEmail are valid and not empty
        if (!eventName || !user) {
            return res
                .status(400)
                .json({ success: false, message: "Invalid request data" });
        }

        const exist = user?.events?.includes(eventName);

        if (exist) {
            return res.json({
                success: true,
                message: "Attendance already recorded",
            });
        }

        user.events.push(eventName); 
        console.log("User: ", user);   
        await user.save();

        // Assuming the attendance logic is successful, send a success response
        res.json({ success: true, message: "Attendance recorded successfully" });
    } catch (error) {
        // Handle any error that occurred during the process
        console.error("Error while recording attendance:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

//delete attendance
exports.deleteAttendance = async (req, res) => {
    try {
        // Retrieve the studentID
        const { eventName, userEmail } = req.body;
        const user = await User.findOne({ email: userEmail });

        if (!user || !eventName) {
            return res
                .status(400)
                .json({ success: false, message: "Error in deleting attendance" });
        }

        const exist = user.events.includes(eventName);
        if (!exist) {
            return res.json({ success: true, message: "Attendance already deleted" });
        }

        // Find the index of the element to delete
        let index = user.events.indexOf(eventName);

        if (index !== -1) {
            // Delete the element using splice()
            user.events.splice(index, 1);
        }
        await user.save();

        res.json({ success: true, message: "Deleted Successfully" });
    } catch (error) {
        // Handle any error that occurred during the process
        console.error("Error deleting attendance:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}