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

@Component({
  selector: 'app-base-layout',
  templateUrl: './base-layout.component.html',
  styleUrls: ['./base-layout.component.css']
})

export class BaseLayoutComponent implements OnInit {

  sessionName: string
  year: number

  // Constructor retrieves the name of the session from the Cookie
  constructor(private cookieService: CookieService, private router: Router) {
    this.sessionName = this.cookieService.get('session_name')
    this.year = Date.now()
  }

  ngOnInit(): void {
  }

  // Function to delete the current cookie and navigates the user back to the login component
  logout() {
    this.cookieService.deleteAll()
    this.router.navigate(['/session/login'])
  }

}
