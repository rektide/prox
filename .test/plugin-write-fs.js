import { readFile as ReadFile, unlink as Unlink } from "fs"
import { sep } from "path"
import tape from "tape"
import { promisify } from "util"
import prox from ".."
import AggroPlugin from "../plugin/aggro"
import WriteFsPlugin from "../plugin/write-fs"

const
  readFile= promisify( ReadFile),
  unlink= promisify( Unlink)

tape( "object field gets written", function( t){
	t.plan( 2)
	const o= prox.make()
	o._prox.addPlugin( AggroPlugin)
	const
	  symbol= o._prox.addPlugin( WriteFsPlugin),
	  pluginState= o._prox[ symbol]
	pluginState.localPath= __dirname
	o.n = 2
	t.equal( o.n, 2, "value set & can be read")

	// TODO: loop for a couple ms waiting for this file
	readFile( __dirname + sep + "n", "utf8")
		.then( function( file){
			t.equal( file, "2", "the `n` file was created as 2")
			t.end()
		})
})

tape( "array field gets written", function( t){
	t.end()
})
