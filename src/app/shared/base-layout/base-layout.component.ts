/**
 * Title: base-layout.component.ts
 * Author: Richard Krasso
 * Contributor: Walter McCue
 * Date: 03/19/23
 * Description: ts for the nodebucket project
*/


// Import statements
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-base-layout',
  templateUrl: './base-layout.component.html',
  styleUrls: ['./base-layout.component.css'],
  providers: [MessageService]
})

export class BaseLayoutComponent implements OnInit {

  sessionName: string
  year: number
  navbar: any
  mobileToggle: any

  // Constructor retrieves the name of the session from the Cookie
  constructor(private cookieService: CookieService, private router: Router, private messageService: MessageService) {
    this.sessionName = this.cookieService.get('session_name')
    this.year = Date.now()
    this.navbar = document.getElementById('navbar-container')
    this.mobileToggle = document.getElementById('mobile-toggle')
  }

  ngOnInit(): void {
  }

  // Function to delete the current cookie and navigates the user back to the login component
  logout() {
    this.messageService.add({
      severity: 'info',
      summary: 'Logged Out',
      detail: 'Successfully Logged Out'
    })
    this.cookieService.deleteAll()
    this.router.navigate(['/session/login'])
  }

}
