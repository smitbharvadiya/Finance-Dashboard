import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
    const token = req.cookies.token;

    if(!token) return res.status(401).json({error : "Unauthorized!"});

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    }catch(error){
        res.status(403).json({error: "Invalid token"});
    }
}

export default verifyToken;