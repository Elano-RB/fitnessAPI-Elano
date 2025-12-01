const User = require("../models/User");
const bcrypt = require("bcrypt");
const { createAccessToken } = require("../auth");

module.exports.register = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password)
            return res.status(400).send({ message: "Email and password required" });

        const existing = await User.findOne({ email });
        if (existing)
            return res.status(409).send({ message: "Email already registered" });

        const hashed = await bcrypt.hash(password, 10);

        await User.create({ email, password: hashed });

        return res.status(201).send({ message: "Registered Successfully" });

    } catch (err) {
        return res.status(500).send({ message: err.message });
    }
};

module.exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user)
            return res.status(401).send({ message: "Invalid credentials" });

        const valid = await bcrypt.compare(password, user.password);
        if (!valid)
            return res.status(401).send({ message: "Invalid credentials" });

        const token = createAccessToken(user);

        return res.status(200).send({ access: token });

    } catch (err) {
        return res.status(500).send({ message: err.message });
    }
};

module.exports.getUserDetails = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if (!user)
            return res.status(404).send({ message: "User not found" });

        return res.status(200).send({ user: user });

    } catch (err) {
        return res.status(500).send({ message: err.message });
    }
};
