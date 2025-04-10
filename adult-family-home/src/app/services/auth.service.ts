<<<<<<< HEAD
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, authState, signInWithEmailAndPassword, signOut, User } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
=======
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, authState, signInWithEmailAndPassword, signOut, User } from '@angular/fire/auth';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
>>>>>>> 83fb2715cd57eca82a0c70109b053b42859ddbd4

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<User | null>;

<<<<<<< HEAD
  constructor(
    private auth: Auth,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
=======
  constructor(private auth: Auth, private router: Router) {
>>>>>>> 83fb2715cd57eca82a0c70109b053b42859ddbd4
    this.user$ = authState(this.auth);
  }

  login(email: string, password: string): Promise<User | null> {
    return signInWithEmailAndPassword(this.auth, email, password)
<<<<<<< HEAD
      .then(userCredential => userCredential.user)
      .catch(error => {
        console.error('Login failed:', error);
        throw error;
      });
=======
      .then((userCredential) => userCredential.user);
>>>>>>> 83fb2715cd57eca82a0c70109b053b42859ddbd4
  }

  logout(): Promise<void> {
    return signOut(this.auth).then(() => {
      this.router.navigate(['/login']);
    });
  }

  isAuthenticated(): Observable<boolean> {
    return this.user$.pipe(map(user => !!user));
  }

<<<<<<< HEAD
  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  // SSR-safe version (optional, not critical)
  isLoggedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('user');
    }
    return false;
=======
  isLoggedIn(): boolean {
    // Optional: use a more reliable state system here if needed
    return !!localStorage.getItem('user');
>>>>>>> 83fb2715cd57eca82a0c70109b053b42859ddbd4
  }
}
