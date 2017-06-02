const Exception = require("../Exception");

module.exports = class ErrorResponse{
	constructor(_error){
		return Exception.resolve(_error);
	}
}