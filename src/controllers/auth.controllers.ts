import { RequestHandler } from "express";
import pool from "../config/db";
import { hashSync, compareSync } from "bcrypt";
import jwtGenerator from "../utils/jwtGenerator";

const signin: RequestHandler = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const res2 = await pool.query(
      "SELECT * FROM users where username = $1",
      [username]
    );

    if (res2.rows.length === 0) {
      return res.status(404).json("User not found");
    }

    const isValidPassword = compareSync(password, res2.rows[0].hash);

    if (!isValidPassword) return res.status(401).json("Invalid Credentials");

    const userData = {
      token: jwtGenerator(res2.rows[0].id),
      username: res2.rows[0].username,
      full_name: res2.rows[0].full_name,
      profile_pic: res2.rows[0].profile_pic,
      description: res2.rows[0].description,
      web_site: res2.rows[0].web_site,
      total_posts: res2.rows[0].total_posts,
      total_followers: res2.rows[0].total_followers,
      total_followed: res2.rows[0].total_followed
    }

    res.json(userData);
  } catch (error) {
    next(error);
  }
};

const register: RequestHandler = async (req, res, next) => {
  const { username, fullName, password } = req.body;

  try {
    const hash = hashSync(password, 10);
    const res2 = await pool.query(
      "INSERT INTO users (username, full_name, hash) values ($1, $2, $3) RETURNING *",
      [username, fullName, hash]
    );

    const userData = {
      token: jwtGenerator(res2.rows[0].id),
      username: res2.rows[0].username,
      full_name: res2.rows[0].full_name,
      profile_pic: res2.rows[0].profile_pic,
      description: res2.rows[0].description,
      total_posts: res2.rows[0].total_posts,
      total_followers: res2.rows[0].total_followers,
      total_followed: res2.rows[0].total_followed
    }

    res.json(userData);
  } catch (error) {
    next(error);
  }
};

const isVerified: RequestHandler = (req, res, next) => {
  res.send({ isValid: true });
};

const getUserData: RequestHandler = async (req, res, next) => {
  const { user_id } = req.body;

  try {
    const resUserData = await pool.query(
      "SELECT username, description, full_name, web_site, profile_pic, total_posts, total_followers, total_followed FROM users WHERE id = $1",
      [user_id]
    );

    if (resUserData.rows.length === 0) {
      return res.status(404).json("User not found");
    }

    res.json(resUserData.rows[0]);
  } catch (error) {
    next(error);
  }
};

const getSelectedUserData: RequestHandler = async (req, res, next) => {
  const { user_id } = req.body;
  const { username } = req.params;

  try {
    const resUserData = await pool.query(
      "SELECT username, description, full_name, web_site, profile_pic, total_posts, total_followers, total_followed, id FROM users WHERE username = $1",
      [username]
    );

    if (resUserData.rows.length === 0) {
      return res.status(404).json("User not found");
    }

    const userData = resUserData.rows[0];

    const isFollowing = await pool.query(
      "SELECT following FROM followed WHERE follower = $1 AND following = $2",
      [user_id, userData.id]
    );

    isFollowing.rows.length === 0? userData.isFollowing = false : userData.isFollowing = true;

    userData.id = '';

    res.json(userData);
  } catch (error) {
    next(error);
  }
};

const getUsers: RequestHandler = async (req, res, next) => {
  const { user_id } = req.body;
  const { amount, offset } = req.query;

  try {
    const res2 = await pool.query(
      "SELECT username, profile_pic, full_name, follower FROM users LEFT JOIN followed ON users.id = followed.following AND $1 = followed.follower WHERE users.id != $1 ORDER BY total_posts DESC, total_followers DESC LIMIT $2 OFFSET $3",
      [user_id, amount, offset]
    );

    res2.rows.forEach((item, index) => {
      if (item.follower){
        item.isFollowing = true;
        delete item.follower
        res2.rows.push(res2.rows.splice(index, 1)[0]);
      }
    })

    res.json(res2.rows);
  } catch (error) {
    next(error);
  }
};

const updateUserPhoto: RequestHandler = async (req, res, next) => {
  const { newProfilePic, user_id } = req.body;

  try {
    await pool.query("UPDATE users SET profile_pic = $1 WHERE id = $2", [
      newProfilePic,
      user_id,
    ]);

    res.sendStatus(203);
  } catch (error) {
    next(error);
  }
};

const updateUser: RequestHandler = async (req, res, next) => {
  const { user_id, full_name, username, description, web_site } = req.body;

  const iswebSiteValid = !Boolean(web_site) || Boolean(web_site.match(new RegExp(/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi)));
  const isUsernameValid = username.length > 4 && username.length < 35;
  const isFullNameValid = full_name.length > 4 && full_name.length < 35;
  const isDescriptionValid = !Boolean(description) || description.length < 255;

  let isInfoValid = {
    full_name: isFullNameValid,
    username: isUsernameValid,
    web_site: iswebSiteValid,
    description: isDescriptionValid
  };

if (!(Object.values(isInfoValid).every(Boolean))) return

  try {
    const res2 = await pool.query(
      'UPDATE users SET (full_name, username, description, web_site) = ($1, $2, $3, $4) WHERE id = $5',
      [full_name, username, description, web_site, user_id]
    );

    res.json(res2);
  } catch (error) {
    next(error);
  }
}

export {
  signin,
  register,
  isVerified,
  getUserData,
  getUsers,
  updateUserPhoto,
  getSelectedUserData,
  updateUser
};
