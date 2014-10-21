var observerLog= module.exports.enhance= module.exports.observerLog= function(o, opts){
	o._enhance("observerLog", function(o){
		o._log= []
		o._chains.set.chain.push(function(ctx){
			var name= ctx.args[1],
			  oldValue= ctx.obj[name]
			var entry= {
				object: o,
				type: null,
				name: name,
				value: ctx.args[2]
			}
			if(entry.value === undefined){
				entry.type= 'delete'
			}else if(oldValue === undefined){
				entry.type= 'add'
			}else{
				entry.type= 'update'
				entry.oldValue= oldValue
			}
			o._log.push(entry)
		})
	})
}
