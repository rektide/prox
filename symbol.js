// prox.js
export const
  fork= Symbol.for( "prox:fork"),
  Fork= fork,
  $fork= fork,
  proxied= Symbol.for( "prox:proxied"),
  Proxied= proxied,
  $proxied= proxied,
  target= Symbol.for( "prox:target"),
  Target= target,
  $target= target

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
  aggro= Symbol.for( "prox:aggro"),
  Aggro= aggro,
  $aggro= aggro,
  parent= Symbol.for( "prox:aggro:parent"),
  Parent= parent,
  $parent= parent
