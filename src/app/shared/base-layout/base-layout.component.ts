/**
 * Title: base-layout.component.ts
 * Author: Richard Krasso
 * Contributor: Walter McCue
 * Date: 03/19/23
 * Description: ts for the nodebucket project
*/

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-base-layout',
  templateUrl: './base-layout.component.html',
  styleUrls: ['./base-layout.component.css']
})
export class BaseLayoutComponent implements OnInit {

  year: number = Date.now();

  constructor() { }

  ngOnInit(): void {
  }
}
