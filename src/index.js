const http = require('http')
const path = require('path')
const Handlebars = require('handlebars')
const conf = require('./config/defaultConfig')
const mime = require('./config/mime')
const compress = require('./config/compress')
const range = require('./config/range.js')
const isFresh = require('./config/cache')
const fs = require('fs')
const tplPath = path.join(__dirname,'./template/dir.tpl')
const source = fs.readFileSync(tplPath,'utf-8')
const template = Handlebars.compile(source.toString())
const server = http.createServer((req,res)=>{
	const url = req.url
	const filePath = path.join(conf.root,url)
	fs.stat(filePath,(err,stats)=>{
		if(err){
			res.statusCode=404
			res.setHeader('Content-Type','text/plain')
			res.end(`${filePath} is not a directory or file`)
			return
		}
		if(stats.isFile()){
			const contentType = mime(filePath)
			console.log(contentType)
			res.statusCode = 200
			res.setHeader('Content-Type',contentType)
			if(isFresh(stats,req,res)){
				res.statusCode = 304
				res.end()
				return
			}
			let rs
			const {code,start,end} = range(stats.size,req,res)
			console.log(code)
			if(code === 200){
				rs = fs.createReadStream(filePath)
			}else{
				console.log('ccc')
				rs = fs.createReadStream(filePath,{start,end})
			}

			if(filePath.match(conf.compress)){
				rs = compress(rs,req,res)
			}
			rs.pipe(res)
		}else if (stats.isDirectory()){
			fs.readdir(filePath,(err,files)=>{
				res.statusCode = 200
				res.setHeader('Content-Type','text/html')
				const data = {
					title:path.basename(filePath),
					files,
					dir:path.relative(conf.root,filePath)
				}
				res.end(template(data))
			})
		}
	})
})

server.listen(conf.port,conf.hostname,()=>{
	const addr = `http://${conf.hostname}:${conf.port}`
	console.log(`Server started at ${addr}`)
})
