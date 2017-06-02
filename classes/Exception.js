const appConfig = require("../core/Config");
const Language = require("../core/Language");

let ErrorLog = appConfig("app").ERRORLOG;

class APIException extends Error{
	constructor(code, message, traceMessage, responseObject){
		super(message);

		this.name = this.constructor.name;
		this.code = code;
		this.message = message;
		this.traceMessage = traceMessage;
		this.responseObject = responseObject;

		console.log(`
-------<Exception>-------
Code: ${this.code} | Message: ${this.message}

<---- ${new Date} ---->

${this.stack}
-------</Exception>-------
		`);
		
		if(ErrorLog){
			let log = new ErrorLog({
				name : this.name,
				code : this.code,
				message : this.message,
				trace : this.traceMessage,
				response : this.responseObject,
				created_at : new Date()
			});

			log.save(err => {});
		}
	}

	toObject(){
    return {
      code 			: this.code,
      message 	: this.message,
      response 	: this.responseObject
    }
  }

	static resolve(err){
		if(err.traceMessage) return err

		let e = (err.constructor.name == "MongooseError" || err.name == "MongoError") 
								? new this(2000, Language("UNDEFINED_DATABASE_EXCEPTION"), err.code + " | " + err.message, err.stack)
								: new this(9999, Language("UNDEFINED_EXCEPTION"), err.message, err.stack);

		return e;
	}
}

module.exports = APIException;