const express= require("express");
require('./database/db');
const User = require('./database/user_db');
const cors=require("cors");
// const audioModel = require('./database/audioSchema');
// const multer = require("multer");
// const fs=require("fs");


const app=express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// var storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, 'uploads')
//     },
//     filename: function (req, file, cb) {
//       cb(null, file.fieldname + '-' + Date.now() )
//     }
//   })
 
// var upload = multer({ storage: storage });


// app.post("/uploadphoto",upload.single('myAudio'),(req,res)=>{
//     console.log(req.file.path);
//     var img = fs.readFileSync(req.file.path);
//     var encode_img = img.toString('base64');
//     var final_img = {
//         name:req.file.path,
//         img:{
//             data: Buffer.from(encode_img,'base64'),
//             contentType: req.file.mimetype
//         }
//     };
    
//     audioModel.create(final_img,function(err,result){
//         if(err){
//             console.log(err);
//         }else{
//             console.log("Saved To database");
//             res.contentType(final_img.img.contentType);
//             res.send(final_img.img.data);
//         }
//     })
// })




app.post("/login", (req,res)=>{
    const { username, password} = req.body
    User.findOne({ username: username}, (err, user) => {
        if(user){
            if(password === user.password )
                res.send({message: "Login Successfull", user: user})
            else 
                res.send({ message: "Wrong password !!!"})
        }
        else{
            res.send({message: "No User found"});
            
        }
    })
});

app.post("/signup", (req,res)=>{
    const { name, username, password} = req.body;
    console.log(req.body);
    User.findOne({username: username}, (err, user) => {
        if(user){  
            res.send({message: "Username already exists !!!"});
        }  
        else {
            const user = new User({
                name : name,
                username : username,
                password : password
            });

            user.save(err => {
                if(err) res.send(err);
                else res.send( { message: "Sign Up Successfull" });
            });
        }
    });
});

const PORT = 3001;
app.listen(PORT, () => console.log(`App running on port ${PORT}`));