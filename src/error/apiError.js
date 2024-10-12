const { httpStatusCode } = require("../utils/httpStatusCode");

class ApiError extends Error {
    constructor(status, message) {
        super();
        this.status = status;
        this.message = message;
    }

    static badRequest(message) {
        return new ApiError(httpStatusCode.BAD_REQUEST, message)
    }

    static internal(message) {
        return new ApiError(httpStatusCode.INTERNAL_SERVER, message)
    }

    static forbidden(message) {
        return new ApiError(httpStatusCode.FORBIDDEN, message)
    }
}

module.exports = ApiError;