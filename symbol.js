// prox.js
export const
  fork= Symbol.for( "prox:fork"),
  Fork= fork,
  $fork= fork

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
