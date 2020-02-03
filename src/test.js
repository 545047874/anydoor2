function test (value){
	return new Promise(function(resolve, reject){
		//做一些异步操作
		setTimeout(function(){
			console.log('执行完成Promise')
			resolve(value)
		}, 2000)
	})
}
// // ffg.then(()=>{ssconsole.log('aaaa')}).catch(()=>{console.log('cccc')})
async function acc() {
	console.log(bb)
	var bb = test('oop')
	console.log(bb)
	console.log('111')
}

acc()
