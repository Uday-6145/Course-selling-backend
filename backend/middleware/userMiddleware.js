const jwt = require('jsonwebtoken')

const userMiddleware = (req, res, next) => {
    const token = req.headers.token;
    if (!token) {
        return res.status(403).json({
            message: "You are not signed in"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_USER_SECRET);
        if (decoded) {
            req.userId = decoded.id;
            next();
        } else {
            return res.status(403).json({
                message: "You are not signed in"
            });
        }
    } catch (err) {
        return res.status(403).json({
            message: "Invalid or expired token"
        });
    }
}

module.exports = userMiddleware;