const {Config} = require("@Pinpoint/core");
const {HttpModule} = require("@Pinpoint/module");

let PinpointApplication = require("@pinpoint/application");
let express = require("express");
let expressApp = express();

let app = new PinpointApplication({
	dbBootstrap : () => Promise.resolve(),
	express : expressApp,
	httpPort : Config("app").HTTP_PORT,
	modules : [
		new HttpModule({name : "main", endpoint : "/user"})
	]
});

/**
	 * Undefined Error Handler
	 * - unhandledRejection
	 * - uncaughtException
	 */
	process.on('unhandledRejection', error => console.log("-------<unhandledRejection>-------\n\n", error.stack, "\n\n-------</ unhandledRejection>-------"));
	process.on('uncaughtException', error => console.log("-------<uncaughtException>-------\n\n", error.stack, "\n\n-------</ uncaughtException>-------"));
	
app.bootstrap().then(() => {
	console.log(`APPLICATION IS RUNNING ON PORT ${app.httpPort}`);
});