import { readFile as ReadFile, unlink as Unlink, mkdir as Mkdir, stat as Stat} from "fs"
import { sep} from "path"
import tape from "tape"
import { promisify} from "util"

import prox from "../prox.js"
import { defaultPlugins} from "../defaults.js"
import aggro from "../plugin/aggro.js"
import writeFs from "../plugin/write-fs.js"
import ManagerSingleton from "../plugin/fs/manager.js"

const
  mkdir= promisify( Mkdir),
  stat= promisify( Stat),
  readFile= promisify( ReadFile),
  unlink= promisify( Unlink)

const testOutputDirectory= `${__dirname}${sep}testOutput`

const ready= (async function(){
	try{
		const stat_= await stat( testOutputDirectory)
		return
	}catch{
		return mkdir( testOutputDirectory)
	}
})()

tape( "object field gets written", async function( t){
	t.plan( 2)
	const
	  plugins= [ ...defaultPlugins, aggro, writeFs],
	  output= prox({},{ plugins}),
	  writeFsSymbol= output._prox.symbol( plugins.length- 1)
	// set path
	output._prox[ writeFsSymbol]= {path: testOutputDirectory}
	// get needed directory created
	await ready

	// write our value, queueing fs work
	output.n = 2
	t.equal( output.n, 2, "value set on object & can be read")

	// wait for manager work queue to drain
	await ManagerSingleton.awaitEmpty()

	// read file results
	let file
	try{
		file= await readFile( `${testOutputDirectory}${sep}n`, "utf8")
	}catch{}
	t.equal( file, "2", "the `n` file was created as 2")
	t.end()
})

tape( "deep objects written", async function( t){
	t.plan( 3)
	const
	  plugins= [ ...defaultPlugins, aggro, writeFs],
	  output= prox({},{ plugins}),
	  writeFsSymbol= output._prox.symbol( plugins.length- 1)
	// set path
	output._prox[ writeFsSymbol]= {path: testOutputDirectory}
	// get needed directory created
	await ready

	// write our value, queueing fs work
	output.payload= {alpha: {status: "begin"}, omega: {status: "end"}}
	output.payload.gamma = { status: "middle" }
	// wait for manager work queue to drain
	await ManagerSingleton.awaitEmpty()

	// read file results
	let files
	try{
		files= await Promise.all([
			readFile( `${testOutputDirectory}${sep}payload${sep}alpha${sep}status`, "utf8"),
			readFile( `${testOutputDirectory}${sep}payload${sep}omega${sep}status`, "utf8"),
			readFile( `${testOutputDirectory}${sep}payload${sep}gamma${sep}status`, "utf8")
		])
	}catch{}
	t.equal( files&& files[0], "begin", "alpha status is begin")
	t.equal( files&& files[1], "end", "omega status is end")
	t.equal( files&& files[2], "middle", "gamma status is middle")
	t.end()
})

//tape( "array field gets written", function( t){
//	t.end()
//})
