/**
 * Title: task.service.ts
 * Author: Richard Krasso
 * Contributor: Walter McCue
 * Date: 03/30/23
 * Description: ts for the nodebucket project
*/

// Import statements
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Item } from './models/item.interface';

@Injectable({
  providedIn: 'root'
})

export class TaskService {

  constructor(private http: HttpClient) { }

  // Path to findAllTasks()
  findAllTasks(empId: number): Observable<any> {
    return this.http.get(`/api/employees/${empId}/tasks`)
  }

  // Path to createTask()
  createTask(empId: number, task: string): Observable<any> {
    return this.http.post(`api/employees/${empId}/tasks`, {
      text: task
    })
  }

  // Path to updateTask()
  updateTask(empId: number, todo: Item[], doing: Item[], done: Item[]): Observable<any> {
    return this.http.put(`/api/employees/${empId}/tasks`, {
      todo,
      doing,
      done
    })
  }

  // Path to deleteTask()
  deleteTask(empId: number, taskId: string): Observable<any> {
    return this.http.delete(`api/employees/${empId}/tasks/${taskId}`)
  }




}







