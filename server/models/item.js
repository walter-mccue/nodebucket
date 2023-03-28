/**
 * Title: item.js
 * Author: Richard Krasso
 * Contributor: Walter McCue
 * Date: 03/27/23
 * Description: item mongoose model for the nodebucket project
*/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let itemSchema = new Schema({
  text: { type: String }
})

module.exports = itemSchema;

