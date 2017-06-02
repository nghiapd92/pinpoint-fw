const Exception = require("../Exception");

module.exports = class ErrorResponse{
	constructor(_error){
		let error =  Exception.parse(_error);

		return {
			code : error.code,
			message : error.message,
			response : error.responseObject
		}
	}
}