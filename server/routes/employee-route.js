/**
 * Title: employee-route.js
 * Author: Richard Krasso
 * Contributor: Walter McCue
 * Date: 03/25/23
 * Description: employee routing for the nodebucket project
*/

// Importing and routing
const express = require('express');
const Employee = require('../models/employee');
const router = express.Router();

/**
 * findEmployeeById
 * @openapi
 * /api/employees/{id}:
 *   get:
 *     tags:
 *       - Employees
 *     description:  API for returning an employee document
 *     summary: returns an employee document
 *     parameters:
 *       - name: empId
 *         in: path
 *         required: true
 *         description: Employee ID
 *         schema:
 *           type: number
 *     responses:
 *       '200':
 *         description: Composer document
 *       '500':
 *         description: Server exception
 *       '501':
 *         description: MongoDB Exception
 */

// GET method
router.get('/:id' , (req, res, next) => {

  let empId = req.params.id
  empId = parseInt(empId, 10)

  // If entered value is not a number return a bad request
  if (isNaN(empId)) {
    const err = new Error('Bad Request')
    err.status = 400
    console.error('empId could not be parsed: ', err.message)
    next(err)
  } else {

    // If entered value is a number, uses findOne() to attempt to retrieve the empId from mongoDB
    Employee.findOne({'empId' : req.params.id}, function(err, emp) {
      if (err) {
        console.error('mongodb error: ', err)
        next(err)
      } else {
        console.log('emp: ', emp)
        res.send(emp)
      }
    })
  }
});

// Export statement
module.exports = router;
