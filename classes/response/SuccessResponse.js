module.exports = class SuccessResponse{
	constructor(message, responseObject){
		let successMessage = message ? message : "Thành công";
		return {
			code : 0,
			message : successMessage,
			response: responseObject
		}
	}
}