import WatchTreeAgen from "watch-tre-agen"

async function watch( path, base){
	for await ( let { f, cur, prev } of WatchTreeAgen( path)){
		
	}
}

export let watchFs= {

	install( prox){
		watch( prox)
	},
	uninstall( prox){
	}
}

export default watchFs
