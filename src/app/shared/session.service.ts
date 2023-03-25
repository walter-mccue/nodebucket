/**
 * Title: session.service.ts
 * Author: Richard Krasso
 * Contributor: Walter McCue
 * Date: 03/26/23
 * Description: ts for the nodebucket project
*/

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor(private http: HttpClient) {

  }
  findEmployeeById(empId: number): Observable<any> {
    return this.http.get('/api/employees/' + empId)
  }
}
