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
	set( exec){
		const
		  self= exec.pluginState,
		  target= exec.prox.proxied, // arg's target is the unproxied object
		  [ _, prop, val ]= exec.args,
		  t= typeof( val)

		// assert this is a primitive
		if( t!== "string"&& t!== "number"){
			// TODO: crawl this value
			//console.log("TODO COMPLEX OBJECT")
			return exec.next()
		}

		const
		  paths= [],
		  localPath= self.localPath!== undefined? self.localPath: exec.prox.localPath
		if( localPath){
			paths.push( localPath)
		}
		// walk up all proxies
		let walk= target
		while( walk&& walk._prox){
			paths.push( walk._prox.parentKey)
			walk= walk._prox.parent
		}
		paths.push( prop)

		// replace ~ with HOME
		if( paths[ 0]&& paths[0][0]=== "~"&& process.env.HOME){
			paths[ 0]= process.env.HOME+ paths[0].substr( 1)
		}
		const path= resolve( ...paths)

		// queue a write on the tail
		self.writeFile( path, val)
		exec.next()
	}
	writeFile( path, val){
		this.tail= this.tail.then( writeFile.bind(null, path, val))
	}
}
WriteFs.prototype.set.phase= "postrun"

export default WriteFs
