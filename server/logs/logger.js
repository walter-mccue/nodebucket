/**
 * Title: logger.js
 * Author: Richard Krasso
 * Contributor: Walter McCue
 * Date: 03/27/23
 * Description: logging for the nodebucket project
*/

// Require statements
const { appendFileSync } =require('fs');
const { join } = require('path');

// Directory for logging
const debugLog = join(__dirname, 'debug.log')
const errorLog = join(__dirname, 'error.log')

// Function to collect date/time
const getDateTime = () => {
  const now = new Date()
  return now.toLocaleString('en-US')
}

// Successful operations are logged to the debug.log
module.exports.debugLogger = (data) => {
  const logString = `[${getDateTime()}] server\t ${data.filename} - ${data.message}\n`
  appendFileSync(debugLog, logString)
}

// Errors are logged to the error.log
module.exports.errorLogger = (data) => {
  const logString = `[${getDateTime()}] server\t ${data.filename} - ${data.message}\n`
  appendFileSync(errorLog, logString)
}











