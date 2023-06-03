import {
    createUser,
    getUser,
    getUserByEmail,
    getUserByAccount,
    updateUser,
    createAccount,
    createSession,
    getSessionAndUser,
    updateSession,
    deleteSession,
    createVerificationToken,
    useVerificationToken
} from "../../../../api.js"

export default function Adapter(client, options = {}) {
  return {
    async createUser(user) {
        console.log("create user")
      return createUser(user);
    },
    async getUser(id) {
        console.log("get user")
      return getUser(id);
    },
    async getUserByEmail(email) {
        console.log("get user by email")
      return getUserByEmail(email);
    },
    async getUserByAccount({ providerAccountId, provider }) {
        console.log("get user by account")
      return getUserByAccount(providerAccountId, provider);
    },
    async updateUser(user) {
        console.log("update user")
      return updateUser(user);
    },
    // async deleteUser(userId) {
    //   return
    // },
    async linkAccount(account) {
        console.log("link account")
      return createAccount(account);
    },
    // async unlinkAccount({ providerAccountId, provider }) {
    //   return
    // },
    async createSession(session) { // { sessionToken, userId, expires }
        console.log("create session")
      return createSession(session);
    },
    async getSessionAndUser(sessionToken) {
        console.log("get session")
      return getSessionAndUser(sessionToken);
    },
    async updateSession(session) { // { sessionToken }
        console.log("update session")
      return updateSession(session);
    },
    async deleteSession(sessionToken) {
      return deleteSession(sessionToken);
    },
    async createVerificationToken(verificationToken) { // { identifier, expires, token }
      return createVerificationToken(verificationToken);
    },
    async useVerificationToken(verificationToken) { // { identifier, token }
      return useVerificationToken(verificationToken);
    },
  }
}
