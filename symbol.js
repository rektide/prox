// prox.js
export const
  fork= Symbol.for( "prox:fork"),
  Fork= fork,
  $fork= fork,
  obj= Symbol.for( "prox:obj"),
  Obj= obj,
  $obj= obj,
  proxied= Symbol.for( "prox:proxied"),
  Proxied= proxied,
  $proxied= proxied

// plugin/write-fs.js
export const
  localPath= Symbol.for( "prox:fs:localPath"),
  LocalPath= localPath,
  $localPath= localPath,
  manager= Symbol.for( "prox:fs:manager"),
  Manager= manager,
  $manager= manager,
  pathFor= Symbol.for( "prox:pathFor"),
  PathFor= pathFor,
  $pathFor= pathFor,
  serializeOptions= Symbol.for( "prox:serializeOptions"),
  SerializeOptions= serializeOptions,
  $serializeOptions= serializeOptions

// plugin/aggro
export const
  parent= Symbol.for( "prox:aggro:parent"),
  Parent= parent,
  $parent= parent
