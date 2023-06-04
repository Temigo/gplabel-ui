import axios from "./axios.js"

export function getUser(userId) {
    return axios.get(`/user/${userId}`)
        .then((response) => response.data)
        .catch((error) => {
            if (error.response.status == 404) {
                return null;
            }
            throw new Error(error);
        });
}

export function createUser(user) {
    return axios.post(`/user/new`, user)
        .then((response) => response.data)
        .catch((error) => {
            throw new Error(error);
        })
}

export function getUserByEmail(email) {
    return axios.get(`/user/email/?email=${email}`)
        .then((response) => response.data)
        .catch((error) => {
            if (error.response.status == 404) {
                return null;
            }
            throw new Error(error);
        });
}

export function getUserByAccount(providerAccountId, provider) {
    return axios.get(`/user/account/?provider_account_id=${providerAccountId}&provider=${provider}`)
        .then((response) => response.data)
        .catch((error) => {
            if (error.response.status == 404) {
                return null;
            }
            throw new Error(error);
        });
}

export function updateUser(user) {
    return axios.post(`/user/update`, user)
        .then((response) => response.data)
        .catch((error) => {
            console.log(error);
            throw new Error(error);
        });
}

export function createAccount(account) {
    return axios.post(`/account/new`, account)
        .then((response) => response.data)
        .catch((error) => {
            console.log(error);
            throw new Error(error);
        })
}

export function createSession(session) {
    console.log("session is", session)
    return axios.post(`/session/new`, session) // todo convert expires to str?
        .then((response) => {
            var session = response.data;
            session.expires = new Date(session.expires);
            console.log("final session", session)
            return session;
        })
        .catch((error) => {
            console.log(error);
            throw new Error(error);
        })
}

export function getSessionAndUser(sessionToken) {
    return axios.get(`/session/${sessionToken}`)
        .then((response) => {
            var session = response.data;
            session.expires = new Date(session.expires);
            console.log("get session and user returns ", session)
            return {
                user: session.user,
                session: {
                    expires: session.expires,
                    sessionToken: session.sessionToken,
                    userId: session.userId
                }
            }
        })
        .catch((error) => {
            if (error.response.status == 404) {
                return null;
            }
            throw new Error(error);
        });
}

export function updateSession(session) {
    return axios.post(`/session/update`, session) // todo convert expires to str?
        .then((response) => {
            var session = response.data;
            session.expires = new Date(session.expires);
            return session;
        })
        .catch((error) => {
            throw new Error(error);
        })
}

export function deleteSession(sessionToken) {
    console.log('delete session', sessionToken)
    return axios.post(`/session/delete/?sessionToken=${sessionToken}`) // todo convert expires to str?
        .then((response) => {
            var session = response.data;
            session.expires = new Date(session.expires);
            return session;
        })
        .catch((error) => {
            throw new Error(error);
        })
}

export function createVerificationToken(verificationToken) {
    return axios.post(`/verificationToken/new`, verificationToken) // todo convert expires to str?
        .then((response) => response.data)
        .catch((error) => {
            throw new Error(error);
        })
}

export function useVerificationToken(verificationToken) {
    return axios.post(`/verificationToken/use`, verificationToken) // todo convert expires to str?
        .then((response) => {
            token = response.data;
            token.expires = new Date(token.expires);
            return token;
        })
        .catch((error) => {
            throw new Error(error);
        })
}

export function downloadImage(filename) {
    return axios.get(`/static/${filename}`,{
            responseType: 'blob'
        })
        .then((response) => response.data)
        .catch((error) => {
            throw new Error(error);
        })
}

export function getImage(imageId) {
    return axios.get(`/image/${imageId}`)
        .then((response) => response.data)
        .catch((error) => {
            throw new Error(error);
        })
}
