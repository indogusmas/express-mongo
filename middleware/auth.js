import jwt from 'jsonwebtoken';


export const auth = async (req, res, next) => {
    const token = req.header("token");
    if(!token) {
        return res.status(401).json({
            message: "Token Empty"
        });
    }
    try {
        const decode = jwt.verify(token, "randomString");
        req.user = decode.user;
        next();
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Invalid Token"
        });
    }
  };