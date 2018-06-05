import { writeFile as WriteFile } from "fs"
import { resolve } from "path"
import { promisify } from "util"

const writeFile= promisify( WriteFile)

export class WriteFs{
	static get phases(){
		return {
			postrun: {
				setWriteFs: WriteFs.prototype.set
			}
		}
	}
	constructor( prox, symbol){
		this.symbol= symbol // why would we need this? chain looks up our state.
		this.tail= Promise.resolve()
	}
	set( ctx){
		const
		  val= ctx.args[ 2],
		  t= typeof( val)
		// assert this is a primitive
		if( t!== "string"&& t!== "number"){
			return ctx.next()
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
		const path= resolve.apply( paths)

		// queue a write on the tail
		ctx.symbol.tail= ctx.symbol.tail.then(function(){
			return writeFile( path, val)
		})
		ctx.next()
	}
}
WriteFs.prototype.set.phase= "postrun"

export default WriteFs
