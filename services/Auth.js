const sessionIdToUser = new Map();

function setUser(id, user) {
    sessionIdToUser.set(id, user)
}

function getUser(id) {
    return sessionIdToUser.get(id)
}

function deleteUserSession(id) {
    console.log(sessionIdToUser.get(id))
    if(!sessionIdToUser.get(id)) {
        return false;
    }
    sessionIdToUser.delete(id)
    return true;
}

module.exports = {
    setUser,
    getUser,
    deleteUserSession
}