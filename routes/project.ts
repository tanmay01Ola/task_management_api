import { Router } from "express";
export const projectRouter = Router();
import { projectSchema } from "../db";
import {client} from "../db";

projectRouter.post("/",async (req,res)=>{
    const parsedProjectbody = projectSchema.safeParse(req.body);
    if(!parsedProjectbody.success){
        return res.status(409).json({
            message :"Invalid cridentials",
            error : parsedProjectbody.error.message
        })
    }
    const {title , description , email } = parsedProjectbody.data;
    try{
        const user = await client.user.findFirst({
            where : {
                email : email 
            }
        })
        if(!user){
            return res.status(409).json({
                message : "email not found "
            })
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
        return res.status(500).json({
            message : "Internal server error"
        })
    }
})

projectRouter.get("/:userId", async(req,res)=>{
    const userId =req.params.userId;
    console.log("userId =" ,userId);
  
    console.log("dfidshf")
    if(typeof userId != 'string'){
         return res.status(400).json({
            message : "Bad request"
         })
    }
    if(!userId){
        return res.status(409).json({
            message : "Bad request"
        })
    }
    const response = await client.project.findFirst({
      where : {
        userId : userId
      }
    })
    if(!response){
        return res.status(404).json({
            message : "project not found"
        })
    }
    res.json({
        response
    })
})


projectRouter.get("/projects/:id" , async(req,res)=>{
    const projectId = req.params.id;
    if(!projectId || projectId == ":id"){
        return res.status(400).json({
            message : "Bad request"
        })
    }
    try{
    const projects = await client.project.findFirst({
        where : {
            id : projectId
        }
    })
     if(!projects){
        return res.status(404).json({
            message : "Project not found"
        })
     }
     const task = await client.task.findMany({
        where : {
            projectId : projects.id
        }
     })
    //  console.log("task =", task);
     res.json({
        project : projects,
        task : task
     })
    } catch(err){
         return res.status(500).json({
            message : "Internal server error"
         })
    }
})
