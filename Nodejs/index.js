
  const express = require("express");
  const cors= require("cors");
  require('./config.js');
  const User = require("./User");
  const Product=require('./product');
  const Jwt= require('jsonwebtoken')
  const jwtkey ='e-commerce';
  const app = express();

  app.use(express.json());
  app.use(cors());

  app.post("/register", async (req, res) => {
    const user = new User(req.body);
    let  result = await user.save();
    result=result.toObject();
    delete result.password;
    
    
      Jwt.sign({result},jwtkey,{expiresIn:"2h"},(err,token)=>{
        if(err){
        res.send("something went Wrong")
        }
        res.send({result,auth:token});
      });
    
    
  });
  
  app.post("/login",async(req,res)=>{
    if(req.body.password && req.body.email)
    {
    let user =await  User.findOne(req.body).select("-password");
    if (user){
      Jwt.sign({user},jwtkey,{expiresIn:"2h"},(err,token)=>{
        if(err){
        res.send("something went Wrong")
        }
        res.send({user,auth:token});
      })
    
    }
    else{
      res.send({result:'NO user found'})
    }

  }else
{
  res.send({result:' please input both fields'});
}

});

app.post("/add",async (req,res)=>{
let  product=new Product(req.body);
let  result= await product.save();
res.send(result);
});

app.get("/products",async(req,res)=>{
  let products= await Product.find();
  if(products.length>0){
    res.send(products)
  }else{
    res.send({result:"no REcords FOund"})
  }
});

app.delete("/product/:id",async(req,res)=>{
 
 const result = await Product.deleteOne({_id:req.params.id});
  res.send(result);
});


app.get("/product/:id",async(req,res)=>{
let result=await Product.findOne({_id:req.params.id});
if(result){
  res.send(result);
}else{
  res.send({result:"No result found"})
}
});
app.put("/product/:id",async(req,res)=>{
  let result= await Product.updateOne(
    {_id:req.params.id},
    {
  $set:req.body
    }
  )
  res.send(result);
});

app.get("/search/:key",verifyToken, async(req,res)=>{
  let result= await Product.find({
    "$or":[
     { name:{$regex:req.params.key}},
       {category:{$regex:req.params.key}}

    ]
  });
  res.send(result);
});

function verifyToken(req,res,next) {
 
  let token= req.headers['authorization'];
  console.warn("Middleware  called",token);
  {/*if(token){
   token= token.split(' ');
   console.warn("Middleware  called",token);
    Jwt.veify(token,jwtkey,(err,valid)=>{
      if(err){
        res.send({result:"please Add Token valid token"});
      }else{
     next();
      }
    });
  }else{
 res.send({result:"please Add Token with Header"});
  }
*/}
  next();
  
}

  app.listen(5000);


