const libValidator = require("validator");

/**
 * Lớp kiểm tra và xác thực input của người dùng
 * 
 * import Validator from "./core/classes/Validator";
 * let body = {name : "Pham Dai Nghia"}; 
 * let validator = new Validator(); 
 * validator.ensure("name", body.name, [
 * 	["Length", {min: 10, max: 20}, "String length error"],
 * 	["Required", null, "Required"],
 * ]); 
 * console.log(validator.isValid(), validator.getErrors());
 * 
 * @export Validator
 * @class Validator
 */
module.exports = class Validator{
	constructor(){
		this.errors = {};
	}
	
	/**
	 * Kiểm tra giá trị của fieldName có bị lỗi hay không
	 * 
	 * @param {any} fieldName 
	 * @param {any} validateValue 
	 * @param {any} rules 
	 * 
	 * @memberOf Validator
	 */
	ensure(fieldName, validateValue, rules) {
		let errs = [];
		for(let rule of rules){
			let [ruleType, args, message] = rule;
			let valid = true;

			try { //Do thư viện validator chỉ hỗ trợ kiểm tra String do đó cần try catch trong trường hợp dữ liệu null

				validateValue = validateValue.toString();

				//Nếu rule là "Required" và validateValue rỗng trả về lỗi luôn
				if(ruleType == "Required" && validateValue.length == 0){
					errs = [message]; break;
				}
				
				valid = libValidator["is" + ruleType](validateValue, args);

			} catch(validateError){
				let isNull = (validateValue === null || validateValue === undefined) ? true : false;

				if(isNull){
					if(ruleType == "Required"){
						errs = [message];
						break;
					} else {
						errs.push(message)
					}
				}
			}
			

			/**
			 * Nếu có kiểm tra "Required" thì và dữ liêu không hợp lệ -> return lỗi dữ liệu trống
			 * mà không cần kiểm tra các rule type khác nữa
			 */
			if(!valid){
				if(ruleType == "Required"){
					errs = [message];
					break;
				}else {
					errs.push(message)
				}
			}
		}

		//Push vào object lưu thông tin lỗi nếu có lỗi
		if(errs.length > 0 ) this.errors[fieldName] = errs;
	}

	/**
	 * Kiểm tra lỗi hay không lỗi
	 * 
	 * @returns boolean
	 * 
	 * @memberOf Validator
	 */
	isValid(){
		return Object.keys(this.errors).length == 0 ? true : false;
	}

	/**
	 * Lấy message lỗi đầu tiên của toàn bộ validate object 
	 * 
	 * @returns String
	 * 
	 * @memberOf Validator
	 */
	getError() {
		return Object.keys(this.errors).length > 0 
							? this.errors[Object.keys(this.errors)[0]][0] 
							: null;
	}

	/**
	 * Trả về toàn bộ lỗi và mã lỗi của validate object
	 * 
	 * @returns Object
	 * 
	 * @memberOf Validator
	 */
	getErrors() {
		return Object.keys(this.errors).length > 0 ? this.errors : null;
	}
}