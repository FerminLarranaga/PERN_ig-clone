import { RequestHandler } from "express";
import pool from "../config/db";

const getPosts: RequestHandler = async (req, res, next) => {
  const { username } = req.params;

  try {
    const posts = await pool.query(
      "SELECT posts.id, image_url, caption, file_format, post_date, vid_duration FROM posts INNER JOIN users ON posts.user_id = users.id WHERE users.username = $1 ORDER BY post_date DESC",
      [username]
    );

    if (posts.rows.length === 0)
      return res.status(404).json(`No posts found for ${username}`);

    res.json(posts.rows);
  } catch (error) {
    next(error);
  }
};

const getSinglePost: RequestHandler = async (req, res, next) => {
  const { postId } = req.params;

  try {
    const post = await pool.query(
      "SELECT posts.id, image_url, caption, file_format, vid_duration, username, profile_pic FROM posts INNER JOIN users ON posts.user_id = users.id WHERE posts.id = $1",
      [postId]
    );

    if (post.rows.length === 0) return res.status(404).json("Post not found");

    res.json(post.rows[0]);
  } catch (error) {
    next(error);
  }
};

const uploadPost: RequestHandler = async (req, res, next) => {
  const { user_id, image_url, caption, file_format, post_date, vid_duration } =
    req.body;

  try {
    const newPost = await pool.query(
      "INSERT INTO posts (user_id, image_url, caption, post_date, file_format, vid_duration) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [user_id, image_url, caption, post_date, file_format, vid_duration]
    );

    await pool.query(
      "UPDATE users SET total_posts = total_posts + 1 WHERE id = $1",
      [user_id]
    );

    res.json(newPost.rows[0]);
  } catch (error) {
    next(error);
  }
};

const updatePost: RequestHandler = async (req, res, next) => {
  const { postId } = req.params;
  const { caption } = req.body;

  try {
    await pool.query("UPDATE posts SET caption = $1 WHERE id = $2", [
      caption,
      postId,
    ]);

    res.sendStatus(203);
  } catch (error) {
    next(error);
  }
};

const deletePost: RequestHandler = async (req, res, next) => {
  const { user_id, postId } = req.body;

  try {
    const response = await pool.query("DELETE FROM posts WHERE id = $1", [
      postId,
    ]);

    if (response.rowCount === 0) return res.status(404).json("Post not found");

    await pool.query(
      "UPDATE users SET total_posts = total_posts - 1 WHERE id = $1",
      [user_id]
    );

    res.sendStatus(203);
  } catch (error) {
    next(error);
  }
};

const getFollowingPosts: RequestHandler = async (req, res, next) => {
  const { user_id } = req.body;
  const { limit, offset } = req.query;

  try {
    const peopleFollowing = await pool.query(
      "SELECT username, profile_pic, full_name, users.id FROM followed LEFT JOIN users ON followed.following = users.id WHERE followed.follower = $1",
      [user_id]
    );

    if (peopleFollowing.rows.length === 0) {
      return res.status(404).json(`Not following anyone`);
    }

    const peopleFollowingIds = peopleFollowing.rows.map(e => e.id);

    const posts = await pool.query(
      "SELECT posts.id, image_url, caption, file_format, post_date, vid_duration, username, profile_pic, full_name FROM posts INNER JOIN users ON posts.user_id = users.id WHERE posts.user_id = ANY ($1::uuid[]) ORDER BY post_date DESC LIMIT $2 OFFSET $3",
      [peopleFollowingIds, limit, offset]
    );

    if (posts.rows.length === 0) return res.status(404).json(`No posts found`);

    res.json(posts.rows);
  } catch (error) {
    next(error);
  }
};

export {
  getPosts,
  getSinglePost,
  uploadPost,
  updatePost,
  deletePost,
  getFollowingPosts,
};
