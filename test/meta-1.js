var 
  chai= require("chai"),
  mocha= require("mocha"),
  expect= chai.expect,
  assert= chai.assert,
  chaiAsPromise= require("chai-as-promised"),
  mochaAsPromise= require("mocha-as-promised"),
  prox= require("../prox"),
  util= require("../util")

// install -as-promised-core to our testing libraries
(function(){
	chai.use(chaiAsPromise)
	mochaAsPromise()
})()

// load sample data
var meta= util.jsonFile("fixture-meta.json").sample1

// make our first prox
var proxed= prox.prox(meta)

// "use"
expect(proxed).to.have.property("righteous")
expect(proxed).to.have.property("retribution")
expect(proxed).to.have.property("reaper")
expect(proxed).to.have.property("_meta")
