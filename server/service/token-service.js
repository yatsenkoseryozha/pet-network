const jwt = require('jsonwebtoken')

class TokenService {
    generateAccessToken = (id, username) => {
        const payload = {
            id,
            username
        }
        return jwt.sign(payload, process.env.SECRET, {expiresIn: "24h"})
    }
}

module.exports = new TokenService()