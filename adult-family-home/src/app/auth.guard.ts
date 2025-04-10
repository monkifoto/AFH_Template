<<<<<<< HEAD
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private auth: Auth,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  canActivate(): Promise<boolean> {
    // SSR bypass
    if (!isPlatformBrowser(this.platformId)) {
      console.log('⛔ SSR: skipping AuthGuard');
      return Promise.resolve(true);
    }

=======
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Auth, getAuth, onAuthStateChanged } from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  private auth: Auth = inject(Auth);
  constructor(private router: Router) {}

  async canActivate(): Promise<boolean> {
>>>>>>> 83fb2715cd57eca82a0c70109b053b42859ddbd4
    return new Promise((resolve) => {
      onAuthStateChanged(this.auth, (user) => {
        if (user) {
          resolve(true);
        } else {
          this.router.navigate(['/login']);
          resolve(false);
        }
      });
    });
  }
}
