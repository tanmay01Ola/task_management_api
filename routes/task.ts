import { Router } from "express";
export const taskRouter = Router();
import { client, taskSchema } from "../db";
import { updateTaskSchema } from "../db";
import { errorHandler } from "../middleware";
import { errorMiddleware } from "../middleware";
taskRouter.use(errorMiddleware)
taskRouter.post("/:projectId",async(req,res, next)=>{
    const projectId = req.params.projectId;
    try{
    if(typeof projectId != "string"){
        console.log("here");
        return next(new errorHandler("Bad request", 400))
    }
    const parsedBody = taskSchema.safeParse(req.body);
    if(!parsedBody.success){
        return next(new errorHandler("Bad request", 400))
    }
    const {title , description , status , priority} = parsedBody.data;

    
        const project =await client.project.findFirst({
            where : {
               id : projectId
            }
        })
        if(!project){
            return next(new errorHandler("Project not found" , 404))
        }
        const response = await client.task.create({
            data : {
                title : title,
                description : description,
                staus : status,
                priority : priority,
                projectId : project.id
            }
        })
        res.json({
            message : "Task created",
            id : response.id
        })
    }
    catch(err){
        next(err)
    }
})


taskRouter.get("/:id", async(req,res, next)=>{
    const taskId = req.params.id;
    try{
        if(typeof taskId !== "string"){
            return next (new errorHandler("Bad request", 400))
        }
    const response = await client.task.findFirst({
        where : {
            id : taskId
        }
    })
    if(!response){
        return next (new errorHandler("Task not present", 404))
}
    res.json({
        response
    })
}
catch(err){
    next(err)
}
       
})


taskRouter.patch("/:id",async(req,res , next)=>{
    const parsedBody = updateTaskSchema.safeParse(req.body);
    if(!parsedBody.success){
        return next (new errorHandler("Bad request", 400))
    }
    const {status , priority, title ,description} = parsedBody.data;
    const taskId = req.params.id;
    if(typeof taskId !== "string"){
        return next(new errorHandler("Bad request", 400))
    }
   try{
    const task = await client.task.update({
        where : {
            id : taskId
        },
        data : {
            staus : status,
            priority : priority,
            title :  title ,
            description : description  
        }
    })
   
    res.json({
        message : "task updated"
    })
}
         catch(err){
            next(err)
         }
})


taskRouter.delete("/:id", async(req,res , next)=>{
    const taskId = req.params.id;
    if(typeof taskId !== "string"){
        return next (new errorHandler("bad request",400))
    }
    try {
    const response = await client.task.delete({
       where : {
        id : taskId
       } 
    })
 
    res.json({
        message : "Task deleted"
    })
}
    catch(err){
        return res.status(500).json({
            message : "Internal server error"
        })
    }
})


taskRouter.get("/projects/:projectId/tasks", async(req,res, next)=>{
    const projectId = req.params.projectId;
    try{
    if(typeof projectId != 'string'){
        return next (new errorHandler("Bad request", 400))
    }
    
    const project = await client.project.findFirst({
        where : {
            id : projectId
        }
    })
    if(!project){
        return next(new errorHandler("project not found", 404))
    }
    const task = await client.task.findMany({
        where : {
            projectId : project.id
        }
    })
    
    res.json({
      project :  project,
      task : task
    })
}
  catch(err){
    next(err)
  }
})