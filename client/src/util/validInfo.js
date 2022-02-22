const validInfo = (userData) => {
    if (!userData.every(Boolean))
        return {
            isValid: false,
            message: 'Missing credentials'
        }

    if (!userData.every(p => p.length > 4 && p.length < 35))
        return {
            isValid: false,
            message: 'Invalid credentials'
        }
    
    if (!userData[3])
        return {isValid: true}
    
    if (userData[2] !== userData[3])
        return {
            isValid: false,
            message: 'Passwords must be the same'
        }
    
    return {isValid: true}
}

export default validInfo;