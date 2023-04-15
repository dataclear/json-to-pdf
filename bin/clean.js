/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */
const { existsSync, lstatSync, readdirSync, unlinkSync, rmdirSync } = require('fs');

function deleteFolderRecursive(path) {
  if (existsSync(path) && lstatSync(path).isDirectory()) {
    readdirSync(path).forEach(function(file, _index){
      let curPath = path + '/' + file;
      
      if (lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        //console.log(`Deleting file "${curPath}"...`);
        unlinkSync(curPath);
      }
    });
    
    console.log(`Deleting directory "${path}"...`);
    rmdirSync(path);
  } else {
    console.log(`Skipping invalid path "${path}"`);
  }
}

console.log('Cleaning dist folder...');

deleteFolderRecursive('dist\\lib');

console.log('Successfully cleaned dist folder!');