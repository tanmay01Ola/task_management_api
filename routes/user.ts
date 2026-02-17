import { Router} from "express";
 export const userRouter = Router();
import {client} from "../db";
import { userSchema } from "../db";
import { errorHandler } from "../middleware";
import {errorMiddleware} from "../middleware";
userRouter.use(errorMiddleware);
userRouter.post("/signup",async(req ,res  , next )=>{
    try{
    const parsedBody = userSchema.safeParse(req.body);
    if(!parsedBody.success){
        const error = new errorHandler ("bad request", 400);
        return next(error);
    }
    const {name, email} = parsedBody.data;
    
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
   catch(err : any){
    if(err.code === 'P2002'){
        console.log()
        const error = new errorHandler("Email already exists", 400);
        return next(error)
    }
    next(err)
   }
})


userRouter.get("/:id", async (req ,res , next)=>{
    const userId = req.params.id;
    console.log("userID =",typeof userId);
    try{
    if(typeof userId !== "string"){
        console.log("here")
        const error =  new errorHandler("bad request", 400);
        return next(error)
         
    }
    
    const response = await client.user.findFirst({
        where :{
            id : userId
        }
    })
    if(!response){
        return next(new errorHandler("User not signed up" , 404))
    }
    res.json({
        response
    })
}
 catch(err){
    next(err)
 }
})