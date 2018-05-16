export function getPropProx( ctx){
	if( ctx.args[1]=== "_prox"){
		ctx.output= ctx.prox
	}
	ctx.next()
}
getPropProx.phase= "postrun"

export class PropProx{
	get get(){
		return getPropProx
	}
	static install( prox){
		prox.chain("get").install( singleton.get)
	}
	static uninstall( prox){
		prox.chain("get").uninstall( singleton.get)
	}
	static get name(){
		return "prop-proxy"
	}
}

export default PropProx

export const singleton = new PropProx()
