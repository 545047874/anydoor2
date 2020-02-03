var promise = function (resolve,reject){
	this.then = function(callback){
		callback()
	}
	this.catch = function(callback){
		callback()
	}
	return this
}
