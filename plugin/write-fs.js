import { writeFile as WriteFile } from "fs"
import { resolve } from "path"
import { promisify } from "util"

const writeFile= promisify( WriteFile)

export class WriteFs{
	static install( prox, symbol){
		prox[ s]= new WriteFs(symbol)
	}
	static uninstall( prox, symbol){
		delete prox[ symbol]
	}

	constructor(s){
		this.set= this.set.bind( this)
		this.symbol= s
		this.tail= Promise.resolve()
	}

	set( ctx){
		const
		  val= ctx.args[ 2],
		  t= typeof( val)
		// assert this is a primitive
		if( t!== "string"&& t!== "number"){
			retun ctx.next()
		}
		
		const
		  paths= [],
		  localPath= this.localPath!== undefined? this.localPath: ctx.prox.localPath
		if( localPath){
			paths.push( localPath)
		}
		// walk up all proxies
		let walk= val
		while( walk._prox){
			paths.push( walk._prox.parentKey)
			walk= walk._prox.parent
		}
		// replace ~ with HOME
		if( paths[ 0]&& paths[0][0]=== "~"&& process.env.HOME){
			paths[ 0]= process.env.HOME+ paths[0].substr( 1)
		}
		const path= resolve( paths)

		// queue a write on the tail
		this.tail= this.tail.then(function(){
			return writeFile( path, val)
		})
	}
}
WriteFs.set.phase= "postrun"

export default WriteFs
