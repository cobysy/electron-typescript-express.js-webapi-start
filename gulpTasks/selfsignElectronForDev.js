/****
* selfsignElectronForDev ('selfsign')
* Self-sign the electron app for development on OSX so that we dont constantly have to click on
* the allow incomming connections alert that pops up each time we run electron.
* (note: may still need to confirm the accept incomming connections dialog once after this).
* (OSX only).
*/
// https://raw.githubusercontent.com/Darkle/MarkSearch/master/gulpTasks/selfsignElectronForDev.js

"use strict";

var path = require("path");

var gulp = require("gulp");
var exeq = require("exeq");

var basePath = path.resolve(__dirname, "..");

gulp.task("selfsign", () => {
	var electronAppPath = path.join(basePath, "node_modules", "electron", "dist", "Electron.app");
	var shellTask = `codesign -s - -f ${ electronAppPath }`;
	/****
   * I'm not sure why, but signing it with or without --deep on it's own doesn't
   * seem to work, however signing it with --deep first and then signing it a
   * second time without --deep seems to work. ¯\_(?)_/¯
   */
	return exeq(
		`${ shellTask } --deep`,
		shellTask
	)
		.then(function() {
			console.log("selfsign completed successfully");
		})
		.catch(function(err) {
			console.error("there was an error self signing the electron app", err);
		});

});