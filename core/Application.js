const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const co = require("co");
const Config = require("./Config");
const APIException = require("../classes/Exception");
const Language = require("./Language");

const BaseModule = require("./BaseModule");


/**
 * Bootstrap class
 * 
 * @export
 * @class Bootstrap
 */
module.exports = class Application{
	constructor(options){
		// DB Setup
		this.dbSetup 						= options.dbSetup ? options.dbSetup : Promise.resolve();
		
		//HTTP Server setup
		if(!options.httpServer || !options.httpPort) throw new Error("Missing httpServer or httpPort");
		this.httpServer 				= options.httpServer;
		this.httpPort 					= options.httpPort;
		this.httpAuth 					= options.httpAuth;

		this.socketServer 			= options.socketServer;

		this.modules 						= options.modules;

		this.registeredModules 	= {};
	}

	_auth(req, res, next){
		let token = req.body.token || req.query.token || req.headers['x-access-token'];

		if (token) {
			jwt.verify(token, Config('app').TOKEN_SECRET, function(err, decoded) {      
				if (err) {
					let exception = new APIException(1000, Language("INVALID_TOKEN"));
					res.send(exception.toObject()); 
				} else {

					req.user = decoded;    
					next();
				}
			});

		} else {
			let exception = new APIException(1000, Language("INVALID_TOKEN"));
			res.send(exception.toObject());
		}
	}

	_registerModule(endpoint, basePath, auth){
		//Khởi tạo Module Object
		let confs = require(process.cwd() + basePath + "/module");	
		let plugableModule = new BaseModule(confs);
		let authMiddleware = this.httpAuth ? this.httpAuth : this._auth;

		if(!this.registeredModules[confs.name]){
			//Đăng kí module vào trong application
			this.registeredModules[confs.name] = true;
			
			//Đăng kí http server
			if(plugableModule.auth){
				if(plugableModule.auth instanceof Array){
					for(let moduleRoute of plugableModule.auth){
						this.httpServer.use(endpoint + moduleRoute, authMiddleware);
					}
				}

				if(plugableModule.auth == "*")
					this.httpServer.use(endpoint, authMiddleware);
			}

			this.httpServer.use(endpoint, plugableModule.router);
		} else {
			throw new Error(`Module "${confs.name}" đã được đăng kí`);
		}
	}

	_registerModules(){
		for(let module of this.modules){ 
			this._registerModule(module.endpoint, module.path, module.auth);
		}
	}

	_databaseBootstrap(){
		return new Promise((resolve, reject) => {
			mongoose.connect(Config("database").MONGO_URI, Config("database").MONGO_OPTIONS, err => {
				if(err) reject("Lỗi kết nối cơ sở dữ liệu\n--\n", err.stack);
				else resolve();
			});
		});
	}

	_enableDebugMode(){
		mongoose.set('debug', true); // turn on mongoose debug
	}

	bootstrap(){
		if(Config("app").DEBUG) this._enableDebugMode();
		return this.dbSetup().then(() => {
			this._registerModules();
			this.httpServer.listen(this.httpPort);
		});
	}
}