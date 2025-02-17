require("dotenv").config();
const express = require("express");
const cors = require("cors");
const referRoutes = require("./routes/referRoute");

const app = express();
app.use(express.json()); 

app.use(cors({
    origin: "https://accrediantask-rho.vercel.app",
}));

app.use("/api/referrals", referRoutes);
app.get("/", (req, res) => {
    res.send("Server running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
