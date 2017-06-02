const Application = require("./core/Application");

exports = module.exports = Application;

//Application Utils
exports.Config = require("./core/Config");
exports.Language = require("./core/Language");

//Authorization
exports.Guard = require("./classes/Guard");

//Validation
exports.Validator = require("./classes/Validator");

//Exception and Error Handle
exports.PPException = exports.APIException = require("./classes/Exception");
exports.ExceptionHandler = require("./classes/ExceptionHandler");

//Abstract Response
exports.SuccessResponse = require("./classes/response/SuccessResponse");
exports.ErrorResponse = require("./classes/response/ErrorResponse");
