// Import the required modules
const express = require("express")
const router = express.Router()

//Import Controllers
const {
    addAdmin,
    showAdmins,
    updateAdmin,
    deleteAdmin,
    takeAttendance,
    deleteAttendance,
    login,
    sendotp,
    checkOTP
} = require("../controllers/Admin")


//Route for login
router.post("/login", login);

// Rouote for sendotp
router.post("/sendotp", sendotp);

// Rouote for sendotp
router.post("/checkOTP", checkOTP);

//Route for create an admin
router.post("/addAdmin", addAdmin)

//Route to show the admin
router.get("/showAdmins",showAdmins)

//Route to update the admin
router.put("/updateAdmin/:id",updateAdmin)

//Route to delete the admin
router.delete("/deleteAdmin/:id",deleteAdmin)

//Route to take attendance
router.post("/takeAttendance", takeAttendance)  

//Route to delete attendance
router.post("/deleteAttendance",deleteAttendance)


module.exports = router