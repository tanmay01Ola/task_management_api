import  express  from "express";
const app = express();
app.use(express.json());
import { userRouter } from "./user";
import { projectRouter } from "./project";
import {taskRouter} from "./task"
app.use("/api/users", userRouter);
app.use("/api/projects",projectRouter);
app.use("/api/tasks",taskRouter);

app.listen(3000);