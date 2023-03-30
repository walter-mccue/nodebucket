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
  done: Item[];
  empId: number;
  newTaskId: string;
  newTaskMessage: string;

  // Creates FormGroup and sets Validators
  taskForm: FormGroup = this.fb.group({
    task:[null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(35)])]
  })

  constructor(private taskService: TaskService, private cookieService: CookieService, private fb: FormBuilder) {

    // Initializers
    this.empId = parseInt(this.cookieService.get('session_user'), 10)
    this.employee = {} as Employee
    this.todo = []
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
        this.done = this.employee.done
        console.log('--ToDo and Done Data--')
        console.log(this.todo)
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
      next: (res) => {
        this.newTaskId = res.data.id
        this.newTaskMessage = res.message
        console.log('newTaskId', this.newTaskId)
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

}
