import { writeFile as WriteFile } from "fs"
import { join } from "path"
import { promisify } from "util"

const writeFile= promisify( WriteFile)

class WriteFs{
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
		
		const paths= []
		if( this.basePath){
			paths.push( this.basePath)
		}
		// walk up all proxies
		let walk= val
		while( walk._prox){
			paths.push( walk._prox.parentKey)
			walk= walk._prox.parent
		}
		const path= join( paths)

		// queue a write on the tail
		this.tail= this.tail.then(function(){
			return writeFile( path, val)
		})
	}
}
