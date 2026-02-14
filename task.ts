import { Router } from "express";
export const taskRouter = Router();
import { client, taskSchema } from "./db";
import { updateTaskSchema } from "./db";
import { ta } from "zod/locales";


taskRouter.post("/:projectId",async(req,res)=>{
    const parsedBody = taskSchema.safeParse(req.body);
    if(!parsedBody.success){
        return res.status(409).json({
            message :"Invalid cridentials",
            error : parsedBody.error.message
        })
    }
    const {title , description , status , priority} = parsedBody.data;

    try{

        const response1 =await client.project.findFirst({
            where : {
               id : req.params.projectId
            }
        })
        console.log("responsse1 =", response1)
        if(!response1){
            return res.status(409).json({
                message : "project not found"
            })
        }
        const response = await client.task.create({
            data : {
                title : title,
                description : description,
                staus : status,
                priority : priority,
                projectId : response1.id
            }
        })
        res.json({
            message : "Task created",
            id : response.id
        })
    }
    catch(err){
        res.status(500).json({
            message : "Internal server error"
        })
    }
})


taskRouter.get("/:id", async(req,res)=>{
    const taskId = req.params.id;
    try{
    const response = await client.task.findFirst({
        where : {
            id : taskId
        }
    })
    if(!response){
        return res.status(409).json({
            message : 'task not found'
        })  
}
    res.json({
        response
    })
}
catch(err){
    return res.status(500).json({
        message : "Internal server error"
    })
}
       
})


taskRouter.patch("/:id",async(req,res)=>{
    const parsedBody = updateTaskSchema.safeParse(req.body);
    if(!parsedBody.success){
        return res.status(409).json({
            message : "Invalid cridentials",
            error : parsedBody.error.message
        })
    }
    const {status , priority, title ,description} = parsedBody.data;
    const taskId = req.params.id;
   try{
    const response = await client.task.update({
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
    if(!response){
        res.status(409).json({
            message : "task not found"
        })
    }
    res.json({
        message : "task updated"
    })
}
         catch(err){
            return res.status(500).json({
                message : "Internal server error"
            })
         }
})


taskRouter.delete("/:id", async(req,res)=>{
    const taskId = req.params.id;
    try {
    const response = await client.task.delete({
       where : {
        id : taskId
       } 
    })
    if(!response){
        return res.status(500).json({
            message : "task not found"
        })
    }
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


taskRouter.get("/projects/:projectId/tasks", async(req,res)=>{
    const projectId = req.params.projectId;
    if(typeof projectId != 'string'){
        return res.status(401).json({
            message : "Bad request"
        })
    }
    if(!projectId){
        return res.status(409).json({
            message : "Bad request"
        })
    }
    const project = await client.project.findFirst({
        where : {
            id : projectId
        }
    })
    if(!project){
        return res.status(403).json({
            message : "Project not found"
        })
    }
    const task = await client.task.findMany({
        where : {
            projectId : project.id
        }
    })
    if(!task){
        return res.status(409).json({
            message : "No task found"
        })
    }
    res.json({
      project :  project,
      task : task
    })
})