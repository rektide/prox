export class PropProx{
	get( ctx){
		if( ctx.args[1]=== "_prox"){
			ctx.output= ctx.prox
		}
		ctx.next()
	}
	static install( prox){
		prox.chain("get").install( singleton.get)
	}
	static uninstall( prox){
		prox.chain("get").uninstall( singleton.get)
	}
}
PropProx.prototype.get.phase= "postrun"

export default PropProx

export const singleton = new PropProx()
