const jwt = require("jsonwebtoken");

//request header looks like this
// {
//     "host": "example.com",
//     "connection": "keep-alive",
//     "authorization": "Bearer <token>",
//     "user-agent": "Mozilla/5.0",
//     "accept": "application/json",
//     "content-type": "application/json",
//     "content-length": "123"
//   }


const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    //this will ensure either actual token or an falsy value returned. req.header.authorization will work if 100% token is there else UNDEFINED value is given ( cause errors in case)
    const token = authHeader && authHeader.split(" ")[1]; // return either falsy value or TOKEN only
    if (!token) {
        return res.status(401).json({ error: true, message: "No token found" });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, userData) => {  // userdata is nothing but User ID
        if (err) {
            return res.status(401).json({ error: true, messgae: "Token not valid" });   // invalid token then error
        }
        req.user = userData; //else PayLoad data
        next(); // if token valid then next will runn else it will create an error during token verification itself
    })

};
module.exports = { authenticateToken, };