/**
 * Find all Tasks in the employee collection;
 * but no response within 500ms, let's return a 500 server error
 * for timeout
 */

const { promisify } = require('util');
const ac = new AbortController();
const { signal } = ac;

const timeout = promisify(setTimeout)

setTimeout(() => {
  ac.abort()
}, 500)

router.get('/:id/alltasks', async(req, res, next) => {
  let empId = req.params.empId
  empId = parseInt(empId)
  if (isNaN(id)) {
    const err = Error('Bad Request')
    err.status = 400
    console.log('isNaN failure')
    next(err)
    return
  }
  try {
    const timer = 600
    await timeout(timer, 'pausing execution', {signal})
    const emp = await employee.findOne({'empId': req.params.empId})
    if (!emp) {
      res.send(createError(404))
      return
    }
    res.send(emp)
  } catch {
    if (error.code ==='ABORT_ERR') {
      console.log("Abort Failure")
      const err = Error('Abort Error')
      err.status = 500
      next(err)
      return
    }
    console.log('catch failure')
    next(err)
  }
})

