import pool from "../config/db";
import { RequestHandler } from "express";

const getRecommended: RequestHandler = async (req, res, next) => {
    const { user_id } = req.body;
    try {
        const query = 'SELECT username, profile_pic, full_name, total_posts, total_followers, follower FROM users LEFT JOIN followed ON users.id = followed.following AND $1 = followed.follower WHERE users.id != $1 ORDER BY total_posts DESC, total_followers DESC';
        const dbRes = await pool.query(query, [user_id]);

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

        recommendedUsers.forEach((item, index) => {
            if (item.follower){
                item.isFollowing = true
            }

            item.follower = ''

            if (!item.profile_pic){
                recommendedUsers.push(recommendedUsers.splice(index, 1)[0])
            }
        });

        recommendedUsers.forEach((item, index) => {
            if (item.isFollowing){
                recommendedUsers.push(recommendedUsers.splice(index, 1)[0])
            }
        })

        res.json(recommendedUsers);

    } catch (error) {
        next(error);
    }
}

export {
    getRecommended
}