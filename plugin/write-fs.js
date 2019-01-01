import { writeFile as WriteFile } from "fs"
import { resolve } from "path"
import { promisify } from "util"
import serialize from "caminus/serialize.js"
import { $instantiate} from "phased-middleware/symbol.js"
import { $pathFor, $manager, $writeFile} from "../symbol.js"
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
		  t= typeof( val)

		const path= self.pathFor( target, prop)

		// assert this is a primitive
		if( t=== "string"|| t=== "number"){
			// queue a write of this primitive
			self.writeFile( path, val)
			return
		}else{
			// aggro should 
			const basePath= self.pathFor( target)
			for( var i of val){
				
			}
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
	writeFile( path, val){
		this.tail= this.tail.then( writeFile.bind(null, path, val))
	}
	
	static get name(){
		return "write-fs"
	}
}
WriteFs.prototype.set.phase= "postrun"
WriteFs.prototype[ $pathFor]= WriteFs.prototype.pathFor
WriteFs.prototype[ $writeFile]= WriteFs.prototype.writeFile

export const singleton= new WriteFs()
singleton[ $instantiate]= true
export default singleton
