const express = require("express");
const { submitReferral, getAllReferrals } = require("../controllers/referController");

const router = express.Router();

router.post("/", submitReferral);
router.get("/", getAllReferrals);

module.exports = router;
