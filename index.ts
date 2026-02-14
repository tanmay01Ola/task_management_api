import  express  from "express";
const app = express();
app.use(express.json());
import { userRouter } from "./routes/user";
import { projectRouter } from "./routes/project";
import {taskRouter} from "./routes/task"
app.use("/api/users", userRouter);
app.use("/api/projects",projectRouter);
app.use("/api/tasks",taskRouter);

app.listen(3000);