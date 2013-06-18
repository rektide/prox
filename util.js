var Q= require("q"),
  Qfs= require("q-io/fs")

module.exports.jsonFile= function(path, options){
	return Qfs.read(path,options).then(JSON.parse)
}

module.exports.jsFile= function(path, options){
	return Qfs.read(path,options).then(eval)
}
