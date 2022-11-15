const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  console.log(req.headers)
  if(!req.headers.authorization){
    res.status(403).json({message:"token required"})
  }else{
    const token = req.headers.authorization;
    jwt.verify(token, process.env.SECRET || "shhhhh", function(err, decoded) {
       if(err){
        res.status(403).json({message:"token invalid"})
       }else{
        next();
       }
    });
  }

  
  /*
    IMPLEMENT

    1- On valid token in the Authorization header, call next.

    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".

    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */
};

