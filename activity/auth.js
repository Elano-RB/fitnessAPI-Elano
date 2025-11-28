const jwt = require("jsonwebtoken");

module.exports.createAccessToken = (user) => {

    const data = {
        id: user._id,
        email: user.email
    };

    return jwt.sign(
        data,
        process.env.JWT_SECRET_KEY || "secret",
        { expiresIn: "1d" }
    );
};


module.exports.verify = (req, res, next) => {

    let token = req.headers.authorization;

    if (typeof token === "undefined") {
        return res.status(401).send({
            auth: "Failed",
            message: "No token provided"
        });
    }


    token = token.slice(7, token.length);

    jwt.verify(token, process.env.JWT_SECRET_KEY || "secret", (err, decodedToken) => {

        if (err) {
            return res.status(403).send({
                auth: "Failed",
                message: err.message
            });
        } else {
            req.user = decodedToken;
            next();
        }

    });
};


module.exports.errorHandler = (err, req, res, next) => {

    console.error(err);

    const statusCode = err.status || 500;
    const errorMessage = err.message || "Internal Server Error";

    res.status(statusCode).json({
        error: {
            message: errorMessage,
            errorCode: err.code || "SERVER_ERROR",
            details: err.details || null
        }
    });
};


module.exports.isLoggedIn = (req, res, next) => {

    if (req.user) {
        next();
    } else {
        res.sendStatus(401);
    }

};
