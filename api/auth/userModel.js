const db = require("../../data/dbConfig.js");

module.exports = {
  get,
  create, 
  getByUsername, 
  
};

function get(id) {
    
        return db("users").where("id", id).first().then((user)=>{
            return user;
        })
    
}

function create(user) {
  return db("users")
    .insert(user)
    .then(([id]) => {
        return get(id)
    });

}

function getByUsername(username){
    
    return db("users").where("username", username).then((user)=>{
        return user;
    })
}