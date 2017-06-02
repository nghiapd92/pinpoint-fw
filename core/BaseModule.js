/**
 * BaseModule
 * 
 * @export
 * @class BaseModule
 */
module.exports = class BaseModule{
	constructor(options){
		this.name = options.name;

		this.router = options.router;

		this.auth = options.auth;

		this.SocketModule = options.SocketModule;
	}
}