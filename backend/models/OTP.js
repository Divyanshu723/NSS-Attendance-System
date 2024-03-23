const mongoose = require('mongoose');
const mailSender = require('../utils/mailSender');
const emailTemplate = require("../mail/emailVerificationTemplate");

const OTPSchema = new mongoose.Schema({
    email: {
        type: String,
        required : true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires : 60 * 5,
    }
});

// a function to send  emails
async function sendVerificationEmail(email, otp) {
    try {
        const mailResponce = await mailSender(email, "Verification Email from NSS NIT Jamshedpur", emailTemplate(otp));
        console.log("Email sent successfully: ", mailResponce.response);

    } catch (error) {
        console.log("Error occured while sending mail");
        console.log(error.message);
        throw error;
    }
}

// pre middleware
OTPSchema.pre("save", async function (next) {
    console.log("New document saved to database");

	// Only send an email when a new document is created
	if (this.isNew) {
		await sendVerificationEmail(this.email, this.otp);
	}
    next();
})

const OTP = mongoose.model("OTP", OTPSchema);

module.exports = OTP;