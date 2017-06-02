const APIException = require("./Exception");
const Language = require("../core/Language");

module.exports = class Guard{
	constructor(namespace) {
		this.namespace = namespace;
	}

	protect(...roles){
		return (req, res, next) => {
			let canPass = true;
			let missingRoles = [];

			//Check if !req.user -> canPass = false immediately
			if(!req.user) canPass = false;

			//Check namespace
			let hasNamespace = req.user.roles[this.namespace];
			if(!hasNamespace) return this._triggerException(res, `Namespace ${this.namespace} is missing`);

			//Check if user is manager of this module then pass without ask any things
			let hasManageRole = req.user.roles[this.namespace]["manage"];
			if(hasManageRole) return next();

			//Check roles(user must have all roles that passed to this function)
			for(let r of roles){
				let hasRole = req.user.roles[this.namespace][r];
				if(!hasRole){
					missingRoles.push(r);
					canPass = false;
				}
			}

			canPass ? next() : this._triggerException(res, `Missing roles: ${missingRoles.join(", ")}`);
		}
	}

	_triggerException(res, missingRoles){
		res.status(200).send((new APIException(1002, Language("AUTHORIZATION_EXCEPTION"), null, missingRoles)).toObject());
	}
}