module.exports = class ErrorResponse{
	constructor(code, message, responseObject){
		let errorCode = code ? code : 9999;
		let errorMessage = message ? message : "Lỗi không xác định";
		return {
			code : errorCode,
			message : errorMessage,
			response: responseObject
		}
	}
}