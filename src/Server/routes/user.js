const router = require("express").Router();
const { User, validate } = require("../models/user");
const Token = require("../models/token");
const crypto = require("crypto");
const sendEmail = require("../utils/SendEmail");
const bcrypt = require("bcrypt");
const dotenv = require('dotenv');
const path = require('path');  // Ensure path is required
const baseURL =  'https://habits-development.netlify.app/';
// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../utils/.env') });

router.post("/token", async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error) return res.status(400).send({ message: error.details[0].message });

        let user = await User.findOne({ email: req.body.email });
        if (user) return res.status(409).send({ message: "User with given email already exists!" });

        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashPassword = await bcrypt.hash(req.body.password, salt);

        user = await new User({ ...req.body, password: hashPassword }).save();

        const token = await new Token({
            userId: user._id,
            token: crypto.randomBytes(32).toString("hex"),
        }).save();

        const url = `https://mustang-central-eb5dd97b4796.herokuapp.com/api/users/${user._id}/verify/${token.token}`;
        await sendEmail(user.email, "Verify Email", url);

        res.status(201).send({ message: "An email was sent to your account. Please verify." });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal Server Error", error: error.message });
    }
});

router.get("/:id/verify/:token/", async (req, res) => {
    try {
        
        const user = await User.findOne({ _id: req.params.id });
        if (!user) return res.status(400).send({ message: "Invalid link" });

        const token = await Token.findOne({
            userId: user._id,
            token: req.params.token,
        });
        if (!token) {res.redirect('https://habits-development.netlify.app');
            console.log(console.log("Token Issue"));
        };
        if(user && token) {
        res.redirect('https://habits-development.netlify.app');
        }
        await User.updateOne({ _id: user._id }, { $set: { verified: true } });
        await Token.deleteOne({ _id: token._id });

        // Redirect to login page after successful verification
        res.redirect('https://habits-development.netlify.app');
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Server Error", error: error.message });
    }
});


module.exports = router;
