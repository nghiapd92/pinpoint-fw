const langData = require(process.cwd() + "/language");

module.exports = (attr, ...args) => {

  let str = langData.hasOwnProperty(attr) ? langData[attr] : attr;

  if(args.length > 0){
    for(let i = 1; i <= args.length; i++){
      let arg = args[i-1];
      str = str.replace(new RegExp("\\$\\{"+ i +"\\}", "g"), arg);
    }
  }

  return str;
}
