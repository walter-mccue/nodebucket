/**
 * Title: employee-route.js
 * Author: Richard Krasso
 * Contributor: Walter McCue
 * Date: 03/25/23
 * Description: employee routing for the nodebucket project
*/

// Require statements
const express = require('express');
const Employee = require('../models/employee');
const router = express.Router();
const { debugLogger, errorLogger } = require('../logs/logger');
const createError = require('http-errors');
const Ajv = require('ajv');
const BaseResponse = require('../models/base-response');

// Logging and Validation
const myFile = 'employee-route.js';
const ajv = new Ajv();

// Reusable function to determine if empId is a number
const checkNum = (id) => {
  id = parseInt(id, 10)
  if (isNaN(id)) {
    // Error handling if id is not a number
    const err = new Error('Bad Request')
    err.status = 400
    console.error('id could not be parsed: ', id)
    errorLogger({filename: myFile, message: `id could note be parsed: ${id}`})
    return err
  } else {
    // Return false if the id value is a number
    return false
  }
}

// Schema for Validation
const taskSchema = {
  type: 'object',
  properties: {
    text: {type: 'string'}
  },
  required: ['text'],
  additionalProperties: false
}

// Schema for Validation
const tasksSchema = {
  type: 'object',
  required: ['todo', 'done'],
  additionalProperties: false,
  properties: {
    todo: {
      type: 'array',
      additionalProperties: false,
      items: taskSchema
    },
    done: {
      type: 'array',
      additionalProperties: false,
      items: taskSchema
    }
  }
}

// function to getTasks
function getTask(id, tasks) {
  const task = tasks.find(item => item._id.toString() === id)
  return task
}


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
 *         description: Employee document
 *       '400':
 *         description: Bad Request
 *       '404':
 *         description: Null Record
 *       '500':
 *         description: Server exception
 *       '501':
 *         description: MongoDB Exception
 */

// findEmployeeById
router.get('/:id' , (req, res, next) => {

  let empId = req.params.id
  const err = checkNum(empId)

  if (err === false ) {

    // If entered value is a number, uses findOne() to attempt to retrieve the empId from mongoDB
    Employee.findOne({'empId': req.params.id}, function(err, emp) {

      // Error handling if there is a server error
      if (err) {
        console.error('mongodb error: ', err)
        errorLogger({filename: myFile, message: `mongodb error: ${err.message}`})
        next(err)

      // Not Found if MongoDB returns a null record
      } else if (null) {
        console.error(createError(404))
        errorLogger({filename: myFile, message: createError(404)})
        next(createError(404))

      // Successful Query
      } else {
        console.log('emp: ', emp)
        debugLogger({filename: myFile, message: emp})
        res.send(emp)
      }
    })

  // Error handling for an invalid empId
  } else {
    console.error('id could not be parsed: ', empId)
    errorLogger({filename: myFile, message: `id could not be parsed: ${empId}`})
    next(err)
  }
})


/**
 * @openapi
 * /api/employees/{empId}/tasks:
 *   get:
 *     tags:
 *       - Employees
 *     name: findAllTasks
 *     description: API to show all tasks by empId
 *     summary: Find all tasks by empId
 *     parameters:
 *       - name: empId
 *         in: path
 *         required: true
 *         description: empId to filter results from MongoDB
 *         schema:
 *           type: number
 *     responses:
 *       '200':
 *         description: All tasks listed given the empId
 *       '400':
 *         description: Bad Request
 *       '404':
 *         description: Null Record
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */

// findAll Tasks
router.get('/:empId/tasks', async(req, res, next) => {

  let empId = req.params.empId
  const err = checkNum(empId)

  if (err === false) {

    // try/catch block
    try {

      // If entered value is a number, uses findOne() to attempt to retrieve the empId from mongoDB
      const emp = await Employee.findOne({'empId': empId}, 'empId todo done')

      // Successful Query
      if (emp) {
        console.log(emp)
        debugLogger({filename: myFile, message: emp})
        res.send(emp)

      // Not Found if MongoDB returns a null record
      } else {
        console.error(createError(404))
        errorLogger({filename: myFile, message: createError(404)})
        next(createError(404))
      }

    // Error handling if there is a server error
    } catch (err) {
      errorLogger({filename: myFile, message: err})
      next(err)
    }

  // Error handling for an invalid empId
  } else {
    const errorString = `req.params must be a number: ${empId}`
    console.error(errorString)
    errorLogger({filename: myFile, message: errorString})
    next(err)
  }
})


/**
 * @openapi
 * /api/employees/{empId}/tasks:
 *   post:
 *     tags:
 *       - Employees
 *     name: createTask
 *     summary: Creates a new task by empId
 *     parameters:
 *        - name: empId
 *          in: path
 *          required: true
 *          description: empId to filter results from MongoDB
 *          schema:
 *            type: number
 *     requestBody:
 *       description: Creates a new task by empId
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *     responses:
 *       '200':
 *         description: New task added to MongoDB
 *       '400':
 *         description: Bad Request
 *       '404':
 *         description: Null Record
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */

// createTask
router.post('/:empId/tasks', async(req, res, next) => {

  let empId = req.params.empId
  const err = checkNum(empId)

  if (err === false) {

    // try/catch block
    try{

      // If entered value is a number, uses findOne() to attempt to retrieve the empId from mongoDB
      let emp = await Employee.findOne({'empId': empId})

      // Successful Query
      if (emp) {
        const newTask = req.body
        const validator = ajv.compile(taskSchema)
        const valid = validator(newTask)

        // Error handling for a failed validation
        if (!valid) {
          const err = Error('Bad Request')
          err.status = 400
          console.error('Bad Request. Unable to validate req.body against the defined schema')
          errorLogger({filename: myFile, message: errorString})
          next(err)

        // Successful Validation pushes new task item to the DB
        } else {
          emp.todo.push(newTask)
          const result = await emp.save()
          console.log(result)
          debugLogger({filename: myFile, message: result})
          // Response to Client
          const task = result.todo.pop()
          const newTaskResponse = new BaseResponse(201, 'Task item added successfully', {id: task._id})
          res.status(201).send(newTaskResponse)
        }

      // Not Found if MongoDB returns a null record
      } else {
        console.error(createError(404))
        errorLogger({filename: myFile, message: createError(404)})
        next(createError(404))
      }

    // Error handling if there is a server error
    } catch (err) {
      next(err)
    }

  // Error handling for an invalid empId
  } else {
    console.error('req.params.empId must be a number', empId)
    errorLogger({filename: myFile, message: `req.params.empId must be a number ${empId}`})
  }
})




router.put('/:empId/tasks', async(req, res, next) => {
  let empId = req.params.empId
  empId = parseInt(empId, 10)
  if (isNaN(empId)) {
    const err = Error('input must be a number')
    err.status = 400
    console.error('input must be a number: ', empId)
    errorLogger({filename: myFile, message: `input must be a number: ${empId}`})
    next(err)
    return
  }
  try {
    let emp = await Employee.findOne({'empId': empId})
    if (!emp) {
      console.error(createError(404))
      errorLogger({filename: myFile, message: createError(404)})
      next(createError(404))
      return
    }
    const tasks = req.body
    const validator = ajv.compile(tasksSchema)
    const valid = validator(tasks)

    if (!valid) {
      const err = Error('Bad Request')
      err.status = 400
      console.log('Bad Request. Unable to validate req.body schema against tasksSchema')
      errorLogger({filename: myFile, message: `Bad Request. Unable to verify req.body schema against tasksSchema`})
      next(err)
      return
    }
    emp.set({
      todo: req.body.todo,
      done: req.body.done
    })
    const result = await emp.save()
    console.log(result)
    debugLogger({filename: myFile, message: result})
    res.status(204).send()

  } catch (err) {
    next(err)
  }
})



router.delete('/:empId/tasks/:taskId', async(req, res, next) => {
  let taskId = req.params.taskId
  let empId = req.params.empId
  empId = parseInt(empId, 10)

  if (isNaN(empId)) {
    const err = Error('input must be a number')
    err.status = 400
    console.error('re.param.empId must be a number: ', empId)
    errorLogger({filename: myFile, message: `re.param.empId must be a number: ${empId}`})
    next(err)
    return
  }
  try {
    let emp = await( Employee.findOne({'empId': empId}))
    if (!emp) {
      next(createError(404))
      console.error(createError(404))
      errorLogger({filename: myFile, message: createError(404)})
      next(err)
      return
    }
    const todoTask = getTask(taskId, emp.todo)
    const doneTask = getTask(taskId, emp.done)

    if (todoTask !== undefined) {
      emp.todo.id(todoTask._id).remove()
    }
    if (doneTask !== undefined) {
      emp.done.id(doneTask._id).remove()
    }

    if (todoTask === undefined && doneTask === undefined) {
      const err = Error('NOt Found')
      err.status = 404
      console.error('TaskId not Found',  taskId)
      errorLogger({filename: myFile, message: `TaskId not found ${taskId}`})
      next(err)
      return
    }
    const result = await emp.save()
    debugLogger({filename: myFile, message: result})
    res.status(204).send()


  } catch (err) {
    next(err)
  }

})

// Export statement
module.exports = router;
