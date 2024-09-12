const express = require("express");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

// Token configurations
const ACCESS_TOKEN_SECRET = "youraccesstokensecret";
const REFRESH_TOKEN_SECRET = "yourrefreshtokensecret";
const ACCESS_TOKEN_EXPIRATION = "10s";
const REFRESH_TOKEN_EXPIRATION = "3m";

// mocking databases
let refreshTokens = [];
const user = {
    id: 1, username: "sampleUser", email: "sampleuser@example.com",
};

// Error definition
const ERROR = {
    INVALID_ACCESS_TOKEN: {
        code: 'INVALID_ACCESS_TOKEN', message: 'The provided token is invalid. Please authenticate again.',
    }, ACCESS_TOKEN_EXPIRED: {
        code: "ACCESS_TOKEN_EXPIRED", message: "Access token expired",
    }, REFRESH_TOKEN_EXPIRED: {
        code: "REFRESH_TOKEN_EXPIRED", message: "Refresh token expired",
    }, INVALID_REFRESH_TOKEN: {
        code: "INVALID_REFRESH_TOKEN", message: 'The provided token is invalid. Please authenticate again.',
    },
};

// Access Token Generate function
function generateAccessToken(user) {
    // Very short expiry date: 1m
    return jwt.sign(user, ACCESS_TOKEN_SECRET, {
        expiresIn: ACCESS_TOKEN_EXPIRATION,
    });
}

// Refresh Token Generate function
function generateRefreshToken(user) {
    const refreshToken = jwt.sign(user, REFRESH_TOKEN_SECRET, {
        expiresIn: REFRESH_TOKEN_EXPIRATION,
    });
    refreshTokens.push(refreshToken);
    return refreshToken;
}

// Access Token Validation Middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        return res.status(401).json(ERROR.INVALID_ACCESS_TOKEN);
    }

    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) return res.status(401).json(ERROR.INVALID_ACCESS_TOKEN);

    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(401).json(ERROR.ACCESS_TOKEN_EXPIRED);
        req.user = user;
        next();
    });
}

// Generate tokens for a specific user
app.post("/api/sign-in", (req, res) => {
    const refreshToken = generateRefreshToken(user);
    const accessToken = generateAccessToken(user);
    res.json({accessToken, refreshToken});
});

// Sample API
app.get("/api/me", authenticateToken, (req, res) => {
    res.json({message: "Here is your protected data", user: req.user});
});

app.get("/api/test1", authenticateToken, (req, res) => {
    res.json({message: "Here is your protected test data (1)"});
});
app.get("/api/test2", authenticateToken, (req, res) => {
    res.json({message: "Here is your protected test data (2)"});
});
app.get("/api/test3", authenticateToken, (req, res) => {
    res.json({message: "Here is your protected test data (3)"});
});

// New Access Token Issue with a Refresh Token
app.post("/api/refresh-token", (req, res) => {
    const {refreshToken} = req.body;
    // refresh token validation check
    if (refreshToken == null) return res.status(401).json(ERROR.INVALID_REFRESH_TOKEN);
    if (!refreshTokens.includes(refreshToken)) return res.status(403).json(ERROR.INVALID_REFRESH_TOKEN);

    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) {
            console.error(err);
            return res.status(403).json(ERROR.REFRESH_TOKEN_EXPIRED)
        }

        const accessToken = generateAccessToken({username: user.username});
        res.json({accessToken});
    });
});

app.listen(4000, () => {
    console.log("Server is running on port 4000");
});
