import { resolve } from "path"
import serialize from "caminus/serialize.js"
import { $instantiate} from "phased-middleware/symbol.js"
import { $manager, $pathFor, $serializeOptions, $symbol} from "../symbol.js"
import { PipelineSymbol} from "../pipeline.js"
import ManagerSingleton from "./fs/manager.js"

const writeFile= promisify( WriteFile)

export class WriteFs{
	static get phases(){
		return {
			postrun: {
				set: WriteFs.prototype.set
			}
		}
	}
	constructor({ manager}={ manager: ManagerSingleton}, cursor){
		if (!manager&& cursor){
			manager= cursor.get( $manager)
		}
		if( !manager){
			manager= ManagerSingleton
		}
		this[ $manager]= manager
	}
	get manager(){
		return this[ $manager]
	}

	set( cursor){
		const
		  self= cursor.plugin,
		  [ target, prop, val ]= cursor.inputs,
		  t= typeof( val),
		  path= self.pathFor( target, prop),
		  opts= cursor.get( $serializeOptions),
		  task= ()=> serialize( path, val, opts)
		if( task){
			self.manager.push( task)
		}
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
	static get name(){
		return "write-fs"
	}
}
WriteFs.prototype.set.phase= { pipeline: "set", phase: "postrun"}
WriteFs.prototype[ $pathFor]= WriteFs.prototype.pathFor

export const singleton= new WriteFs()
singleton[ $instantiate]= true
export default singleton
