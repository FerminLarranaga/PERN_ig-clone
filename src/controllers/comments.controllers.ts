import { RequestHandler } from 'express';
import pool from '../config/db';

const getComments: RequestHandler = async (req, res, next) => {
    const { post_id } = req.params;

    try {
        const comments = await pool.query(
            'SELECT comment, username, profile_pic FROM comments INNER JOIN users ON comments.user_id = users.id WHERE post_id = $1 ORDER BY comment_date DESC',
            [post_id]
        );
        res.json(comments.rows);
    } catch (error) {
        next(error);
    }
}

const getSingleComment: RequestHandler = async (req, res, next) => {
    const { post_id, comment_id } = req.params;

    console.log(req.params);

    try {
        const comment = await pool.query(
            'SELECT * FROM comments WHERE post_id = $1 AND id = $2',
            [post_id, comment_id]
        );

        if (comment.rows.length === 0)
            return res.status(404).json('Comment not found');

        res.json(comment.rows[0]);
    } catch (error) {
        next(error);
    }
}

const postComment: RequestHandler = async (req, res, next) => {
    const { post_id } = req.params;
    const { user_id, comment, comment_date } = req.body;

    try {
        await pool.query(
            'INSERT INTO comments (comment, comment_date, post_id, user_id) VALUES ($1, $2, $3, $4)',
            [comment, comment_date, post_id, user_id]
        );

        res.sendStatus(203);
    } catch (error) {
        next(error);
    }
}

const updateComment: RequestHandler = async (req, res, next) => {
    const { comment_id } = req.params;
    const { comment } = req.body;

    try {
        await pool.query(
            'UPDATE comments SET comment = $1 WHERE id = $2',
            [comment, comment_id]
        );

        res.sendStatus(203);
    } catch (error) {
        next(error);
    }
}

const deleteComment: RequestHandler = async (req, res, next) => {
    const { comment_id } = req.params;

    try {
        const response = await pool.query(
            'DELETE FROM comments WHERE id = $1',
            [comment_id]
        );

        res.json(response);
    } catch (error) {
        next(error);
    }
}

export {
    getComments,
    getSingleComment,
    postComment,
    updateComment,
    deleteComment
}