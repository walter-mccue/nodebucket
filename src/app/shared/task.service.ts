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
}
