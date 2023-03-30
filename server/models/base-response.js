/**
 * Title: base-response.js
 * Author: Richard Krasso
 * Contributor: Walter McCue
 * Date: 03/30/23
 * Description: js for the nodebucket project
*/

// Allows us to store server responses
class BaseResponse {
  constructor (httpCode, message, data) {
    this.httpCode = httpCode;
    this.message = message;
    this.data = data;
  }
  toObject () {
    return {
      httpCode: this.httpCode,
      message: this.message,
      data: this.data,
      timestamp: new Date().toLocaleString('en-US')
    }
  }
}

module.exports = BaseResponse;
