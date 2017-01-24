const fs = require('fs-extra');
const cp = require('child_process');
const os = require('os');
const path = require('path');

const deviceID = args('device') || errors('device');
const iosVersion = args('version') || errors('version');
const nonceLog = args('log') || errors('log');
const buildManifest = `${os.tmpdir()}${path.sep}tsschecker${path.sep}${deviceID}_${iosVersion}`;
const platform = oscheck()
const command = (os.type() == "Windows_NT" ? "img4tool" : "./img4tool")

 /*
console.log(nonceLog);
console.log(iosVersion);
console.log(deviceID);
console.log(buildManifest);
console.log(platform);
process.exit()
*/

fs.readFile(nonceLog, (err, data) => {
  if (err) {console.log('\nInvalid Log File Provided\n'); process.exit()};

  const nonceArray = data.toString().match(/\w{40}/g);
  if (!nonceArray) {console.log('\nLog File has no collisions contained within it\n'); process.exit()}

  fs.access(`./apnonces/${iosVersion}/`, (err) => {
    if (err) {console.log('iOS Version specified has no SHSH Blobs Saved'); process.exit()}
    fs.access(buildManifest, (err) => {
      if (err) {
      console.log(`\nBuild Manifest for ${deviceID}, iOS ${iosVersion} does not Exist! (This means you have given an Invalid Device ID)\n`);
      process.exit()
      }

      console.log(`\nPreparing to verify [${nonceArray.length}] blobs\n`);
      setTimeout(() => {
        let invalidCount = 0;
        const invalidBlob = [];
        let validCount = 0;
        const validBlob = [];

        nonceArray.forEach((nonce, i) => {
          fs.readdir(`./apnonces/${iosVersion}/apnonce-${nonce}/`, (err, files) => {
            if (err || files == null) {return console.log(`SHSH Blob for ${nonce} does not exist`);} //process.exit()
            cp.exec(`${command}_${platform} -s ./apnonces/${iosVersion}/apnonce-${nonce}/${files[0]} -v "C:\\Users\\johns\\AppData\\Local\\Temp\\tsschecker\\iPad4,1_10.2"`, (e, o, err) => {
              if (e) {
                invalidBlob.push(`apnonce-${nonce}`);
                return invalidCount++
              }
              // console.log(o)
              const invalidResult = o.match(/(IM4M is not valid for any restore within the Buildmanifest\n\n\[IMG4TOOL\] file is invalid!)/g);
              //console.log(o.match(/(DeviceClass : )(\S\w*)/g))
              const validResult = o.match(/(DeviceClass : )(\S\w*)/g);
              //console.log(validResult)
              if (invalidResult) {
                console.log('\n------------------------------------------------------------------------------\n');
                console.log(`SHSH Blob for ${deviceID} (${iosVersion}) is INVALID\n[APNonce] ${nonce}\n`)
                console.log('\n------------------------------------------------------------------------------');
                invalidBlob.push(`apnonce-${nonce}`);
                return invalidCount++;
              }
            console.log('\n++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++\n');
            console.log(`\nSHSH Blob for ${deviceID} (${iosVersion}) is VALID\n[Board Config] ${validResult.slice(14)}\n`)
            console.log('\n++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
            validBlob.push(`apnonce-${nonce}\nBuildConfig:[${validResult.slice(14)}]`);
              return validCount++;
            })
            setTimeout(() => {
              if (i == nonceArray.length - 1) {
                saveOutputLogs(invalidCount, invalidBlob, validCount, validBlob);
              }
            }, 1000)
          })
        })
      }, 2000)
    })
  })
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

      case 'log':
        console.log('You did not specify a noncestatistics log.');
        return process.exit();
      break;
  }
}

function saveOutputLogs(ic, ib, vc, vb) {
  const verificationLog = `\n#########################\nVerification Report\n\nInvalid SHSH Blobs: ${ic}\nValid SHSH Blobs: ${vc}\nTotal SHSH Blobs: ${ic + vc}\n##########################\n`
  console.log(verificationLog)
  fs.outputFile(`./logs/verificationlog.txt`, verificationLog, () => {
    console.log(`Verfication Log has been saved at ${process.cwd()}/logs/verificationlog.txt\n`)
    fs.outputFile(`./logs/validBlobs.txt`, vb.join(`${os.EOL}${os.EOL}`), () => {console.log(`List of Valid blobs have been saved at ${process.cwd()}/logs/validBlobs.txt\n`)})
    fs.outputFile(`./logs/invalidBlobs.txt`, ib.join(`${os.EOL}`), () => {console.log(`List of Invalid blobs have been saved at ${process.cwd()}/logs/invalidBlobs.txt\n`)})
  });



  //fs.outputFile(`${process.cwd()}/verificationlog.txt`, invalidBlob.join(os.EOL), () => {console.log('Verfication Log has been saved!')})
}
