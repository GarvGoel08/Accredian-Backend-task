const { PrismaClient } = require("@prisma/client");
const nodemailer = require("nodemailer");

const prisma = new PrismaClient();

const submitReferral = async (req, res) => {
  try {
    const { friendName, friendEmail, friendPhone, friendCourse, userName, userEmail, userPhone } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegexWithCountryCode = /^\+?\d{10,15}$/;

    if (!emailRegex.test(userEmail) || !emailRegex.test(friendEmail) || !phoneRegexWithCountryCode.test(friendPhone) || !phoneRegexWithCountryCode.test(userPhone)) {
      return res.status(400).json({ error: "Invalid email or phone number" });
    }

    if (!friendName || !friendEmail || !friendPhone || !friendCourse || !userName || !userEmail || !userPhone) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newReferral = await prisma.referral.create({
      data: { friendName, friendEmail, friendPhone, friendCourse, userName, userEmail, userPhone },
    });

    await sendReferralEmail(friendEmail, userName);

    res.status(201).json({ message: "Referral submitted successfully!", referral: newReferral });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

const getAllReferrals = async (req, res) => {
  try {
    const referrals = await prisma.referral.findMany();
    res.json(referrals);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

const sendReferralEmail = async (friendEmail, userName) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: friendEmail,
    subject: "You've Been Referred!",
    // To send: Referral Link attatched in email
    text: `Hi! ${userName} has referred you for a course. Check it out!`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { submitReferral, getAllReferrals };
