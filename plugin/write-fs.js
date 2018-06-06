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

		// queue a write
		const path= self.pathFor( target, prop)
		self.writeFile( path, val)
		// continue
		exec.next()
	}
	pathFor( target, prop){
		const
		  paths= [],
		  rootPath= this.localPath
		if( rootPath){
			// this plugin has a specific path set for itself, nothing else required
			paths.push( rootPath)
		}else{
			// otherwise walk prox's getting names until one of them has a localPath
			// walk up all proxies
			let walk= target&& target._prox
			while( walk){
				if( walk.localPath){
					paths.unshift( walk.localPath)
					// localPath means end of iteration:
					break
				}

				// add our property namee here
				const parentKey= walk.parentKey
				if( !parentKey){
					throw new Error("could not calculate write-fs path")
				}
				paths.push( parentKey)

				// walk up
				walk= walk.parent
			}
		}

		// add optional prop
		if( prop!== undefined){
			paths.push( prop)
		}

		// replace ~ with HOME
		if( paths[ 0]&& paths[0][0]=== "~"&& process.env.HOME){
			paths[ 0]= process.env.HOME+ paths[0].substr( 1)
		}
		return resolve( ...paths)
	}
	writeFile( path, val){
		this.tail= this.tail.then( writeFile.bind(null, path, val))
	}
}
WriteFs.prototype.set.phase= "postrun"

export default WriteFs
