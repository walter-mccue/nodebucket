/**
 * Title: home.component.ts
 * Author: Richard Krasso
 * Contributor: Walter McCue
 * Date: 03/19/23
 * Description: ts for the nodebucket project
*/

// Import statements
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { Message } from 'primeng/api/message';
import { Employee } from 'src/app/shared/models/employee.interface';
import { Item } from 'src/app/shared/models/item.interface';
import { TaskService } from 'src/app/shared/task.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  // Variables
  serverMessages: Message[] = [];
  employee: Employee;
  todo: Item[];
  doing: Item[];
  done: Item[];
  empId: number;
  newTaskId: string;
  newTaskMessage: string;

  // Creates FormGroup and sets Validators
  taskForm: FormGroup = this.fb.group({
    task:[null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(35)])]
  })

  constructor(private taskService: TaskService, private cookieService: CookieService, private fb: FormBuilder,
    private dialog: MatDialog) {

    // Initializers
    this.empId = parseInt(this.cookieService.get('session_user'), 10)
    this.employee = {} as Employee
    this.todo = []
    this.doing = []
    this.done = []
    this.newTaskId = ''
    this.newTaskMessage = ''

    // Finds all tasks for the current user and stores them in the defined variables
    this.taskService.findAllTasks(this.empId).subscribe({
      next: (res) => {
        this.employee = res
        console.log('--Employee Data--')
        console.log(this.employee)
      },
      error: (err) => {
        console.error(err.message)
        this.serverMessages = [
          {
            severity: 'error',
            summary: 'Error',
            detail: err.message
          }
        ]
      },
      complete: () => {
        this.todo = this.employee.todo
        this.doing = this.employee.doing
        this.done = this.employee.done
        console.log('--ToDo, Doing, and Done Data--')
        console.log(this.todo)
        console.log(this.doing)
        console.log(this.done)
      }
    })
  }

  ngOnInit(): void {
  }

  // Creates a new task and adds it to the todo array
  createTask() {
    const newTask = this.taskForm.controls['task'].value
    this.taskService.createTask(this.empId, newTask).subscribe({

      // Successful task creation
      next: (res) => {
        this.newTaskId = res.data.id
        this.newTaskMessage = res.message
        console.log('newTaskId', this.newTaskId)
      },

      // Error if Unsuccessful
      error: (err) => {
        console.error(err.message)
        this.serverMessages = [
          {
            severity: 'error',
            summary: 'Error',
            detail: err.message
          }
        ]
      },

      // Function completes and informs user of success
      complete: () => {
        let task = {
          _id: this.newTaskId,
          text: newTask
        } as Item
        this.todo.push(task)
        this.newTaskId = ''
        this.taskForm.controls['task'].setErrors({'incorrect': false})
        this.serverMessages = [
          {
            severity: 'success',
            summary: 'Success',
            detail: this.newTaskMessage
          }
        ]
      }
    })
  }

  // deleteTask
  deleteTask(taskId: string) {

    // Confirmation box to ask user to confirm or deny deletion of a task
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        header: 'Delete Task Dialog',
        body: 'Are you sure you want to delete this task?'
      },

      // User has to click one of the buttons in the dialog box to get it to close
      disableClose: true
    })

    // Subscribe event from dialog box
    dialogRef.afterClosed().subscribe({
      next: (result) => {

        // If delete is confirmed, the task item is deleted
        if (result === 'confirm') {
          this.taskService.deleteTask(this.empId, taskId).subscribe({
            next: (res) => {

              // The arrays filter out the deleted task item and inform user of success
              this.todo = this.todo.filter(task => task._id !== taskId)
              this.doing = this.doing.filter(task => task._id !== taskId)
              this.done = this.done.filter(task => task._id !== taskId)
              this.serverMessages = [
                {
                  severity: 'success',
                  summary: 'Success',
                  detail: 'Task Deleted Successfully'
                }
              ]
            },

            // Error if failure
            error: (err) => {
              this.serverMessages = [
                {
                  severity: 'error',
                  summary: 'Error',
                  detail: err.message
                }
              ]
            }
          })
          
        } else {

          // If delete is canceled, inform user of cancellation
          this.serverMessages = [
            {
              severity: 'info',
              summary: 'Info',
              detail: 'Deletion Canceled'
            }
          ]
        }
      }
    })
  }

  // updateTaskList subscribe event
  updateTaskList(empId: number, todo: Item[], doing: Item[], done: Item[]) {
    this.taskService.updateTask(empId, todo, doing, done).subscribe({
      next: (res) => {

        // Defines the 3 arrays
        this.todo = todo
        this.doing = doing
        this.done = done
      },

      // Error if failure
      error: (err) => [
        {
          severity: 'error',
          summary: 'Error',
          detail: err.message
        }
      ]
    })
  }

  // Drag and Drop event
  drop(event: CdkDragDrop<any[]>) {

    // If tasks are reordered in the same column,
    // update the server to the new order and refresh the API call
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex)
      console.log("Reordered tasks in the existing list")
      this.updateTaskList(this.empId, this.todo, this.doing, this.done)

    } else {

      // If tasks are moved from one container to another,
      // update the server to the current task items in each container and refresh the API call
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      )
        console.log('Moved task item to new container')
        this.updateTaskList(this.empId, this.todo, this.doing, this.done)
    }
  }

}
