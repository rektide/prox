import { resolve } from "path"
import serialize from "caminus/serialize.js"
import { $instantiate} from "phased-middleware/symbol.js"
import { $aggro, $manager, $pathFor, $serializeOptions} from "../symbol.js"
import { PipelineSymbol} from "../pipeline.js"
import ManagerSingleton from "./fs/manager.js"
import { AggroData, AggroSingleton} from "./aggro.js"

process.on( "uncaughtException", console.error)
process.on( "unhandledRejection", console.error)

const AggroIterator= AggroData.prototype[ Symbol.iterator]

export class WriteFs{
	static findAggro( prox, symbol, i){
		// try a symbol
		if( symbol!== undefined){
			const data= prox[ symbol]
			if( data&& data.parent&& data.key){
				return symbol
			}
		}
		// try a specific index
		if( i!== undefined){
			const
			  symbol= prox.symbol( i),
			  data= prox[ symbol]
			if( data&& data.parent&& data.key){
				return symbol
			}
		}
		// search all plugin data for something with the right shape
		for( let symbol of prox.symbols){
			const data= prox[ symbol]
			if( data&& data.parent&& data.key){
				return symbol
			}
		}
	}
	constructor({ manager, aggro}={ manager: ManagerSingleton, aggro: AggroSingleton}){
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
		  [ target, prop, val ]= cursor.inputs
		if( prop instanceof Symbol){
			// welp. anyone got any bright ideas?
			return
		}

		// find $aggro
		const
		  fsData= cursor.pluginData,
		  paths= fsData&& fsData.path? []: [ prop],
		  gotAggro= cursor.get( $aggro),
		  aggroSymbol= gotAggro|| WriteFs.findAggro( cursor.phasedMiddleware),
		  aggroData= cursor.phasedMiddleware[ aggroSymbol],
		  aggroIter= aggroData&& aggroData[ Symbol.iterator],
		  // iterate through parents, either via calling our pluginData iterator, or using aggro's iterator on pluginData.
		  iter= aggroIter&& aggroIter()|| AggroIterator.call( aggroData|| {})
		if( !gotAggro){
			if( !fsData){
				cursor.pluginData= {
					[$aggro]: aggroSymbol
				}
			}else{
				cursor.pluginData[ $aggro]= aggroSymbol
			}
		}
		let lastProx= cursor.phasedMiddleware
		for( let iterAggroData of iter){
			const
			  iterFsData= lastProx[ cursor.symbol],
			  path= iterFsData&& iterFsData.path
			if( path){
				// this object has a concrete path specified: prepend, & stop iterating.
				paths.unshift( path)
				break
			}
			if( !iterAggroData.key){
				// perhaps we should try to loop & make sure this is the end (else throw)?
				break
			}
			paths.unshift( iterAggroData.key)
			lastProx= iterAggroData.parent
		}
		// interpolate a leading ~ as the HOME directory
		if( paths.length&& paths[ 0][ 0]=== "~"&& process.env.HOME){
			paths[ 0]= paths[ 0].substring( 1)
			paths.unshift (process.env.HOME)
		}

		// queue task to serialize out object
		const
		  path= resolve( ...paths),
		  opts= cursor.get( $serializeOptions),
		  task= ()=> serialize( path, val, opts)
		self.manager.push( task)
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
