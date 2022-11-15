const router = require("express").Router();
const { create, getByUsername } = require("./userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message : "username and password required"})
  }
  const user = await getByUsername(req.body.username);
  console.log(user);
  if (user.length === 0) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    const newUser = await create({username : req.body.username, password : hash});

    res.json(newUser);
  }else{
    res.status(400).json({message : "username taken"})
  }

  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.
    DO NOT EXCEED 2^8 ROUNDS OF HASHING!

    1- In order to register a new account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel", // must not exist already in the `users` table
        "password": "foobar"          // needs to be hashed before it's saved
      }

    2- On SUCCESSFUL registration,
      the response body should have `id`, `username` and `password`:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }

    3- On FAILED registration due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED registration due to the `username` being taken,
      the response body should include a string exactly as follows: "username taken".
  */
});

router.post("/login", async (req, res) => {
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message : "username and password required"})
  }
  const noUser = await getByUsername(req.body.username)
  if (noUser.length === 1) {
   const isValid = bcrypt.compareSync(req.body.password, noUser[0].password )
   if(isValid){
    const token = jwt.sign({ id: noUser[0].id }, process.env.SECRET || "shhhhh");
    res.status(200).json({message : `Welcome, ${noUser[0].username}`, token : token} )

   } else {
    res.status(403).json({message :"invalid credentials"})
   }
  }
  
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */
});

module.exports = router;
