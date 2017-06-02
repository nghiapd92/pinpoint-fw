module.exports = class ErrorResponse{
	constructor(error, responseObject){
		let errorCode = error.code;
		let errorMessage = error.message;
		return {
			code : errorCode,
			message : errorMessage,
			response: responseObject
		}
	}
}