import { RequestHandler } from "express";
import pool from "../config/db";

const getFollowers: RequestHandler = async (req, res, next) => {
    const { username } = req.body;

    try {
        const userId = await pool.query(
            'SELECT id FROM users WHERE username = $1',
            [username]
        );

        if (userId.rows.length === 0){
            return res.status(404).json('User not found');
        }

        const res2 = await pool.query(
            'SELECT username, profile_pic, full_name FROM followed LEFT JOIN users ON followed.follower = users.id WHERE followed.following = $1',
            [userId.rows[0].id]
        );

        if (res2.rows.length === 0){
            return res.status(404).json('No followers');
        }

        res.json(res2.rows);
    } catch (error) {
        next(error);
    }
}

const getFollowing: RequestHandler = async (req, res, next) => {
    const { username } = req.body;

    try {
        const userId = await pool.query(
            'SELECT id FROM users WHERE username = $1',
            [username]
        );

        if (userId.rows.length === 0){
            return res.status(404).json('User not found');
        }

        const res2 = await pool.query(
            'SELECT username, profile_pic, full_name FROM followed LEFT JOIN users ON followed.following = users.id WHERE followed.follower = $1',
            [userId.rows[0].id]
        );

        if (res2.rows.length === 0){
            return res.status(404).json(`${username} is not following anyone`);
        }

        res.json(res2.rows);
    } catch (error) {
        next(error);
    }
}

const isFollowing: RequestHandler = async (req, res, next) => {
    const { user_id, followedUsername } = req.body;

    try {
        const followedId = await pool.query(
            'SELECT id FROM users WHERE username = $1',
            [followedUsername]
        );

        if (followedId.rows.length === 0){
            return res.status(404).json('User not found');
        }

        const res2 = await pool.query(
            'SELECT following FROM followed WHERE follower = $1 AND following = $2',
            [user_id, followedId.rows[0].id]
        );

        res2.rows.length === 0? res.json({isFollowing: false}) : res.json({isFollowing: true});
    } catch (error) {
        next(error);
    }
}

const isFollowed: RequestHandler = async (req, res, next) => {
    const { user_id, followedUsername } = req.body;

    try {
        const followedId = await pool.query(
            'SELECT id FROM users WHERE username = $1',
            [followedUsername]
        );

        if (followedId.rows.length === 0){
            return res.status(404).json('User not found');
        }

        const res2 = await pool.query(
            'SELECT follower FROM followed WHERE following = $1 AND follower = $2',
            [user_id, followedId.rows[0].id]
        );

        res2.rows.length === 0? res.json({isFollowing: false}) : res.json({isFollowing: true});
    } catch (error) {
        next(error);
    }
}

const startFollowing: RequestHandler = async (req, res, next) => {
    const { user_id, followedUsername } = req.body;
    
    try {
        const followed_id = await pool.query(
            'SELECT id FROM users WHERE username = $1',
            [followedUsername]
        );

        if (followed_id.rows.length === 0) {
            return res.status(404).json('User to start follow not found');
        }

        const newId = user_id.substr(0, 14) + followed_id.rows[0].id.substr(14);
        await pool.query(
            'INSERT INTO followed (id, follower, following) VALUES ($1, $2, $3)',
            [newId, user_id, followed_id.rows[0].id]
        )

        await pool.query(
            'UPDATE users SET total_followed = total_followed + 1 WHERE id = $1',
            [user_id]
        );

        await pool.query(
            'UPDATE users SET total_followers = total_followers + 1 WHERE id = $1',
            [followed_id.rows[0].id]
        );
    
        res.sendStatus(203);
    } catch (error) {
        next(error);
    }
}

const stopFollowing: RequestHandler = async (req, res, next) => {
    const { user_id, followedUsername } = req.body;

    try {
        const followed_id = await pool.query(
            'SELECT id FROM users WHERE username = $1',
            [followedUsername]
        );

        if (followed_id.rows.length === 0) {
            return res.status(404).json('User to start following not found');
        }

        const regId = user_id.substr(0, 14) + followed_id.rows[0].id.substr(14);
        await pool.query(
            'DELETE FROM followed WHERE id = $1',
            [regId]
        );

        await pool.query(
            'UPDATE users SET total_followed = total_followed - 1 WHERE id = $1',
            [user_id]
        );

        await pool.query(
            'UPDATE users SET total_followers = total_followers - 1 WHERE id = $1',
            [followed_id.rows[0].id]
        );

        res.sendStatus(203);
    } catch (error) {
        next(error);
    }
}

export {startFollowing, stopFollowing, getFollowers, getFollowing, isFollowed, isFollowing}