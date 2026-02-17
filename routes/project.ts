import { Router } from "express";
export const projectRouter = Router();
import { projectSchema } from "../db";
import {client} from "../db";
import { errorHandler, errorMiddleware } from "../middleware";
projectRouter.use(errorMiddleware)

projectRouter.post("/",async (req,res , next)=>{
    const parsedProjectbody = projectSchema.safeParse(req.body);
    if(!parsedProjectbody.success){
        return next(new errorHandler("Bad request", 400))
    }
    const {title , description , email } = parsedProjectbody.data;
    try{
        const user = await client.user.findFirst({
            where : {
                email : email 
            }
        })
        if(!user){
            return next(new errorHandler("user not logged in", 404))
        }
        const project = await client.project.create({
            data : {
                title : title,
                description  : description,
                userId :    user.id
            }
        })
        res.json({
            message : "Project created successfully",
            id : project.id
        })
    }
    catch(err){
        next(err)
    }
})

projectRouter.get("/:userId", async(req,res , next)=>{
    const userId =req.params.userId;
    try{
    if(typeof userId != 'string'){
         return next (new errorHandler("Bad request", 400 ))
    }
    
    const project = await client.project.findFirst({
      where : {
        userId : userId
      }
    })
    if(!project){
        return next (new errorHandler("Project not found", 404))
    }
    res.json({
        project
    })
}   catch(err){
    next(err)
}
})


projectRouter.get("/projects/:id" , async(req,res, next)=>{
    const projectId = req.params.id;
    try{
    if(typeof projectId != "string"){
      return next(new errorHandler("Bad request", 400))
    }
    
    const projects = await client.project.findFirst({
        where : {
            id : projectId
        }
    })
     if(!projects){
        return next (new errorHandler("project not fouund", 404))
     }
     const task = await client.task.findMany({
        where : {
            projectId : projects.id
        }
     })
     res.json({
        project : projects,
        task : task
     })
    } catch(err){
         next(err)
    }
})
