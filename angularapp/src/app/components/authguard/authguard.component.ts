// import { Injectable } from '@angular/core';
// import {
//   ActivatedRouteSnapshot,
//   CanActivate,
//   RouterStateSnapshot
// } from '@angular/router';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthGuard implements CanActivate {

//   constructor() {}

//   canActivate(
//     route: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot
//   ): boolean {
//     return true;
//   }
// }
import { Component } from '@angular/core';

@Component({
  selector: 'app-authguard',
  templateUrl: './authguard.component.html',
  styleUrls: ['./authguard.component.css']
})
export class AuthguardComponent {
  constructor() {}
}