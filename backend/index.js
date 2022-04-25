const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
app.use(cors());


const users = [
    {   
        id:"1",
        username:"john",
        password:"123",
        isAdmin:true,
    },
    {   
        id:"2",
        username:"dae",
        password:"123",
        isAdmin:false,
    },
    {   
        id:"3",
        username:"ana",
        password:"anita1",
        isAdmin:false,
    },
];

const generateAccessToken =(user)=>{
    return jwt.sign({id:user.id, isAdmin:user.isAdmin}, "mySecretKey", /*{expiresIn:"2m"}*/ );
}

let generatedTokens=[];

app.post("/api/login",(req,res)=>{
    const {username,password} = req.body;
    const user = users.find(u=>{
        return u.username === username && u.password === password;
    });
    if (user){
       const accessToken=generateAccessToken(user);
       generatedTokens.push(accessToken);
        res.json({
            username:user.username,
            isAdmin:user.isAdmin,
            accessToken,
        })
    }else{
        res.status(400).json("Username or password incorrect");
    }
});

const verify = (req,res,next) =>{
    const authHeader = req.headers.authorization;
    if(authHeader){
        const token = authHeader.split(" ")[1];
        jwt.verify(token,"mySecretKey",(err,user)=>{
            if(err){
                return res.status(401).json("Token is not valid!")
            }
            req.user = user;
            next();
        });
    }else{
        res.status(401).json("you not authenticated")
    }
};


app.delete("/api/users/:userId", verify, (req,res)=>{
    if(req.user.id === req.params.userId || req.user.isAdmin){
        res.status(200).json("User has been deleted")
    }else{
        res.status(403).json("you are not the admin")
    }
});

app.post("/api/logout",verify,(req,res)=>{
    const caca = req.body.token;
    generatedTokens = generatedTokens.filter((token)=>token !== caca);
    res.status(200).json("you are logout");
});

app.listen(5000,()=>{
    console.log("server runs on port 5000")
});