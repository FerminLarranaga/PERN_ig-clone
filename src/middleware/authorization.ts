import { JwtPayload, verify } from 'jsonwebtoken';
import { Handler } from 'express';

const isAuthorized: Handler = (req, res, next) => {
    const { token } = req.headers;

    if (!token || typeof token !== 'string')
        return res.status(401).json('Not authorized: no token');

    const payload = verify(token, process.env.JWTSECRET!) as JwtPayload;
    
    req.body.user_id = payload.user_id;

    next();
}

export default isAuthorized;