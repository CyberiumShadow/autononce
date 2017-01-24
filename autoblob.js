const fs = require('fs-extra');
const cp = require('child_process');
const os = require('os');

const deviceID = args('device') || errors('device');
const iosVersion = args('version') || errors('version');
const deviceECID = args('ecid') || errors('ecid');
const nonceLog = args('log') || errors('log');
const platform = oscheck()
const command = (os.type() == "Windows_NT" ? "tsschecker" : "./tsschecker")

 /*
console.log(nonceLog);
console.log(iosVersion);
console.log(deviceID);
console.log(deviceECID);
console.log(platform)
process.exit()
// */

fs.readFile(nonceLog, (err, data) => {
  if (err) {console.log('\nInvalid Log File Provided\n'); process.exit()};

  const nonceArray = data.toString().match(/\w{40}/g);
  if (!nonceArray) {console.log('\nLog File has no collisions contained within it\n'); process.exit()}

  console.log(`\nPreparing to save SHSH blobs for [${nonceArray.length}] nonce collisions\n`);
  setTimeout(() => {
    nonceArray.forEach((nonce, i) => {
      console.log(`\nEnsuring Directory [${i +1} of ${nonceArray.length}] exists\n`);
      fs.ensureDir(`./apnonces/${iosVersion}/apnonce-${nonce}/`, (err) => {
        console.log("\n################################################################################################");
        console.log(`Saving SHSH Blob [${i +1} of ${nonceArray.length}]\n`);
          cp.exec(`${command}_${platform} -d ${deviceID} -i ${iosVersion} -s -e ${deviceECID} --apnonce ${nonce} --save-path ./apnonces/${iosVersion}/apnonce-${nonce}/`, (e, o, err) => {
            if (e) {
              console.log("An Error has occurred. Most likely, your specified iOS Version is no longer being signed.\n");
              process.exit()
            }
            console.log(`[${i + 1} of ${nonceArray.length}] Saved SHSH Blob for APNonce ${nonce}`);
            console.log("################################################################################################\n");

          })
          setTimeout(() => {
            if (i == nonceArray.length - 1) {
              console.log(`All SHSH Blobs are saved!`)
            }
          }, 1000)
      })
    })
  }, 3000)
});

function oscheck() {
  switch (os.type()){
    case 'Linux':
      return 'linux';
      break;

    case 'Darwin':
      return 'macos';
      break;

    case 'Windows_NT':
      return 'windows.exe'
      break;
  }
}

function args(type) {
  switch (type) {
      case 'device':
        if (process.argv.indexOf('-d') != -1){ return process.argv[process.argv.indexOf('-d') + 1]}
      break;

      case 'version':
        if (process.argv.indexOf('-v') != -1){ return process.argv[process.argv.indexOf('-v') + 1]}
      break;

      case 'ecid':
        if (process.argv.indexOf('-e') != -1){ return process.argv[process.argv.indexOf('-e') + 1]}
      break;

      case 'log':
        if (process.argv.indexOf('-l') != -1){ return process.argv[process.argv.indexOf('-l') + 1]}
      break;
      }
  }

function errors(type) {
  switch (type) {
      case 'device':
        console.log('You did not specify a Device Identifier');
        return process.exit();
      break;

      case 'version':
        console.log('You did not specify an iOS Version');
        return process.exit();
      break;

      case 'ecid':
        console.log('You did not specify an ECID');
        return process.exit();
      break;

      case 'log':
        console.log('You did not specify a noncestatistics log.');
        return process.exit();
      break;
  }
}
