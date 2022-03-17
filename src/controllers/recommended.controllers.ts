import pool from "../config/db";
import { RequestHandler } from "express";

const getRecommended: RequestHandler = async (req, res, next) => {
    const { user_id } = req.body;
    const {limit, offset} = req.query;

    try {
        let query = 'SELECT username, profile_pic, full_name, total_posts, total_followers FROM users WHERE users.id NOT IN (SELECT users.id FROM followed LEFT JOIN users ON followed.following = users.id WHERE followed.follower = $1) AND users.id != $1 ORDER BY total_posts DESC, total_followers DESC LIMIT $2 OFFSET $3';

        const dbRes = await pool.query(query, [user_id, limit, offset]);

        interface RecommendedUser {
            username: String,
            profile_pic: String | null,
            full_name: String,
            total_posts: number,
            total_followers: number,
            follower: String | null,
            isFollowing: Boolean
        }

        const recommendedUsers: RecommendedUser[] = [...dbRes.rows];

        dbRes.rows.forEach((item, index) => {
            if (!item.profile_pic){
                recommendedUsers.push(recommendedUsers.splice(index, 1)[0])
            }
        });

        res.json(recommendedUsers);

    } catch (error) {
        next(error);
    }
}

export {
    getRecommended
}