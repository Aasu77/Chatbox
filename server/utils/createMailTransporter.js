const nodemailer = require("nodemailer");

const createMailTransporter = () => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "aashishpokharel58@gmail.com",
            pass : process.env.Email_Pass,
        },
    });

    return transporter;
};

module.exports ={ createMailTransporter }; 