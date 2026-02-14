import {Router} from "express";
 export const userRouter = Router();
import {client} from "../db";
import { userSchema } from "../db";

userRouter.post("/signup", async(req,res)=>{
    const parsedBody = userSchema.safeParse(req.body);
    console.log( "parsedBody =" , parsedBody);
    if(!parsedBody.success){
        return res.status(400).json({
            message : "Invalid cridentials",
            error : parsedBody.error.message
        })
    }
    const {name , email} = parsedBody.data;
    try{
     const response = await client.user.create({
        data : {
            name : name,
            email : email
        }
     })

     res.json({
        message : "User signed up",
        userId : response.id
     })
    }
   catch(error : any){
    if(error.message.includes("Unique constraint failed on the fields: (`email`)")){
        return res.status(400).json({
            message : "Email already exists"
        })
    }
    else {
        return res.status(500).json({
            message : 'Internal server error'
        })
    }
   }
})


userRouter.get("/:id", async (req,res)=>{
    const userId = req.params.id;
    if(!userId){
        return res.status(400).json({
            message : "Bad request"
        })
    }
    try{
    const response = await client.user.findFirst({
        where :{
            id : userId
        }
    })
    if(!response){
        return res.status(409).json({
            message : "user not found"
        })
    }
    res.json({
        response
    })
}
 catch(err){
    return res.status(500).json({
        message : 'Internal server error'
    })
 }
})