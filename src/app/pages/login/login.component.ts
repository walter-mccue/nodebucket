/**
 * Title: login.component.ts
 * Author: Richard Krasso
 * Contributor: Walter McCue
 * Date: 03/26/23
 * Description: ts for the nodebucket project
*/

// Import Statements
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Message } from 'primeng/api';
import { Employee } from '../../shared/models/employee.interface';
import { SessionService } from '../../shared/session.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  // Initializers
  errorMessages: Message[] = []
  employee: Employee;

  // Creates the FormGroup and sets validators
  loginForm: FormGroup = this.fb.group({
    empId: [null, Validators.compose([Validators.required, Validators.pattern('^[0-9]*$')])]
  })

  constructor(private fb: FormBuilder, private router: Router, private cookieService: CookieService, private sessionService: SessionService) {
    this.employee = {} as Employee;
  }

  ngOnInit(): void {
  }

  // Logs user in if they have a correct empId and collects the users information to store in the cookie
  // Will throw error if user does not enter correct empId
  login() {
    const empId = this.loginForm.controls['empId'].value
    this.sessionService.findEmployeeById(empId).subscribe({

      next: (res) => {
        if (res) {
        this.employee = res;
        this.cookieService.set('session_user', this.employee.empId.toString(), 1)
        this.cookieService.set('session_name', `${this.employee.firstName} ${this.employee.lastName}`, 1)
        this.router.navigate(['/'])
      } else {
        this.errorMessages = [
          {severity: 'error', summary: 'Error', detail: 'Please enter a valid empId to continue.'}
        ]
      }
      },
      error: (err) => {
        console.error(err)
        this.errorMessages = [
          {severity: 'error', summary: 'Error', detail: err.message}
        ]
      }
    })
  }

}
