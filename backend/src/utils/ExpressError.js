class ExpressError extends Error {
    constructor(statusCode, message) {
        super(message); // 🔥 Puraane Error class ko message bhej diya
        this.statusCode = statusCode; // CamelCase use kiya
    }
}

module.exports = ExpressError;