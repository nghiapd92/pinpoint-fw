const Exception = require("./Exception");

module.exports = class ExceptionHandler{
	constructor(){}

	static ajax(expressResponse){
		return err => {
			expressResponse.send(Exception.resolve(err));
		}
	}
}