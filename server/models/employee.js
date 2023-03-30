/**
 * Title: employee.js
 * Author: Richard Krasso
 * Contributor: Walter McCue
 * Date: 03/25/23
 * Description: employee mongoose model for the nodebucket project
*/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const itemSchema = require('./item');

// Employee Schema
let employeeSchema = new Schema({
  empId: { type: Number, unique: true, required: true },
  firstName: { type: String },
  lastName: { type: String },
  todo: [itemSchema],
  done: [itemSchema]
}, {collection: 'employees'});

// Export statement
module.exports = mongoose.model('Employee', employeeSchema);
