import express, { Response, Request, NextFunction, json } from "express";
import { config } from "dotenv";
import morgan from 'morgan';
import authRoutes from "./routes/auth.routes";
import postsRoutes from "./routes/posts.routes";
import commentsRoutes from "./routes/comments.routes";
import followingRoutes from "./routes/following.routes";
import path from "path";

const app = express();

const PORT = process.env.PORT || 5000;
config();
app.use(json());

if (process.env.NODE_ENV === 'production'){
  app.use(express.static(path.join(__dirname, '../client/build')));
} else {
  app.use(morgan('dev'));
}

app.use("/", authRoutes);
app.use("/posts", postsRoutes);
app.use("/comments", commentsRoutes);
app.use("/", followingRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(400).json({ message: err.message });
});

app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
