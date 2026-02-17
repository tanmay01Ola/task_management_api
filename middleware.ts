import { Request, Response , NextFunction } from "express";
export class errorHandler extends Error{
    statusCode? : number

    constructor(message : string , statusCode ? : number){
        super(message)
        this.statusCode = statusCode
    }
}
export function errorMiddleware(err : errorHandler, req : Request, res : Response, next : NextFunction){
        console.log("error =",err.stack);
        console.log("message =", err.message);
        res.status(err.statusCode ?? 500).json({
            message : err.message || "Internal server error"
        })
}