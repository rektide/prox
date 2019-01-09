import { $plugins, $symbols} from "phased-middleware/symbol.js"
import { Prox} from "../prox.js"
import { $parent} from "../symbol.js"
import { PipelineNames, PipelineSymbols} from "../pipeline.js"

function recurse( prox){
	return prox.parent? recurse( prox.parent): prox
}

function useParentOptions( parent, extra, { recurse: _recurse= true}= {}){
	// if we are a sub ... sub child of a real prox, point to that real prox, not our parent.
	// this implies that moving an object will have to re-tree all the children too, so
	// either don't move objects a lot or disable reucrse
	if( _recurse){
		parent= (typeof _recurse=== "function"? _recurse: recurse)( parent)
	}
	extra= {
	  ...extra,
	  [ $parent]:{ value: parent}
	}
	return {
	  [ $plugins]: false,
	  [ $symbols]: false,
	  extra
	}
}

export function extend( klass= Prox,{ name, recurse: _recurse= true}= {}){
	const
	  // compute a class name
	  klassName= name|| "Aggro"+ klass.name,
	  // generate a new class (of specified klassName), that borrows most state from parent.
	  wrapper={[ klassName]: class extends klass{
		constructor( obj, parent){
			super( obj, useParentOptions( parent))
		}
		get alias(){
			return this.parent.cursor
		}
		get cursor(){
			return this.parent.cursor
		}
		get parent(){
			return this[ $parent]
		}
		get pipelines(){
			return this.parent.pipelines
		}
		get plugins(){
			return this.parent.plugins
		}
		get symbols(){
			return this.parent.symbols
		}
	  }},
	  unwrapped= wrapper[ klassName]

	// create additional getters for each pipeline too
	const pipelineGetters= {}
	for( let i= 0; i< PipelineNames.length; ++i){
		const
		  name= PipelineNames[ i],
		  symbol= PipelineSymbols[ i]
		pipelineGetters[ symbol]= {
			get: function(){
				return this.parent[ symbol]
			}
		}
	}
	Object.defineProperties( unwrapped.prototype, pipelineGetters)

	return unwrapped
}

let singleton

export const
  factory= function(){
	if( !singleton){
		singleton= extend( Prox)
	}
	return singleton
  },
  aggroProxFactory= factory,
  AggroProxFactory= factory
export default factory
