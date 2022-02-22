import { sign } from 'jsonwebtoken';

const jwtGenerator = (user_id: string): string => {
    const payload = {
        user_id: user_id
    }

    return sign(payload, process.env.JWTSECRET!, {expiresIn: '20hr'});
}

export default jwtGenerator;