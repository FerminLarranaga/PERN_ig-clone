import { Handler } from 'express';

const validInfo: Handler = (req, res, next) => {
    const { username, password } = req.body;

    if (![username, password].every(Boolean))
        return res.status(401).json('Missing credentials');
    
    if (![username, password].every(p => p.length > 4 && p.length < 35))
        return res.status(401).json('Invalid credentials: username or password out of length range');
        
    next();
}

export default validInfo;