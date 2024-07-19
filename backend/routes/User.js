// Import the required modules
const express = require("express")
const router = express.Router()

//Import Controllers
const {
    addUser,
    showUsers,
    updateUser,
    deleteUser,
    getUserDetailsWithAttendance
} = require("../controllers/User")


//Route for create a user
router.post("/addUser", addUser)

//Route to show the user
router.get("/showUsers",showUsers)

//Route to update the user
router.put("/updateUser/:id",updateUser)

//Route to delete the user
router.delete("/deleteUser/:id", deleteUser)


// Router to get details of user by id
router.get("/getUserDetails/:userId", getUserDetailsWithAttendance);



module.exports = router

