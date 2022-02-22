const trimUserData = (userData) => {
    const trimedUserData = {};

    Object.keys(userData).forEach(key => {
        trimedUserData[key] = userData[key].trim();
    });

    return trimedUserData;
}

export default trimUserData;