# Noncestatistics Automation Script
_______
###Details
**Author**: CyberiumShadow
**Language**: Node.JS (JavaScript)
**Requirements**:

 - Node.JS
	 - Windows
		 - 32 Bit: https://nodejs.org/dist/v7.4.0/node-v7.4.0-x86.msi
		 - 64 Bit: https://nodejs.org/dist/v7.4.0/node-v7.4.0-x64.msi
	 - Mac OSX: https://nodejs.org/en/download/package-manager/#osx
	 - Linux (Debian/Ubuntu): ```curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -
sudo apt-get install -y nodejs```
 - Tihmstar's Tools
	 - Noncestatistics: http://api.tihmstar.net/builds/noncestatistics/noncestatistics-latest.zip
	 - TSSChecker: http://api.tihmstar.net/builds/tsschecker/tsschecker-latest.zip
	 - img4tool: http://api.tihmstar.net/builds/img4tool/img4tool-latest.zip

###Installation Instructions

1. Install Node.JS via one of the steps given in **Requirements**
2. Create a folder for this script
3. In your console or terminal, navigate to the new folder and run ```git clone CyberiumShadow/autononce``` and ```npm install```
- This will install both the scripts and its dependency
4. Download and extract the respective files for nonceStatistics, TSSChecker and img4tool into the same folder.
5. Installation Complete.

### Usage Instructions
1. Navigate to the same folder that the scripts were installed in.
2. If you haven't already, Run nonceStatistics for your device for as long as you need. (7+ hours recommended)
- You can also use a Top 10 Collision list if its available
3. Run ```node autoblob.js -d <DeviceIdentifier> -v <iOS Version> -e <ECID> -l <nonceStatistics Log File>```
4. Upon completion, your blobs will be saved in a `ApNonce` Folder.
5. Run ```node autoverify.js -d <DeviceIdentifier> -v <iOS Version> -l <nonceStatistics Log File>```
6. Upon completion, you will have a Logs folder which will contain the valid blobs, invalid blobs and verification report.
7. If you have invalid/missing blobs, Feel free to repeat steps 3-6 to attempt to obtain valid/missing blobs.
