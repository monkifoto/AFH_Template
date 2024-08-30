import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { map } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const afAuth = inject(AngularFireAuth);
  const router = inject(Router);

  return afAuth.authState.pipe(
    map(user => {
      console.log('User:', user);
      console.log('Router State:', state);
      if (user) {
        return true;
      } else {
        router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
      }
    })
  );
};

// import { inject } from '@angular/core';
// import { CanActivateFn, Router } from '@angular/router';
// import { AngularFireAuth } from '@angular/fire/compat/auth';
// import { map } from 'rxjs/operators';

// export const authGuard: CanActivateFn = (route, state) => {
//   const afAuth = inject(AngularFireAuth);
//   const router = inject(Router);

//   return afAuth.authState.pipe(
//     map(user => {
//       if (user) {
//         return true;
//       } else {
//         router.navigate(['/login']);
//         return false;
//       }
//     })
//   );
// };

// import { inject } from '@angular/core';
// import { Router } from '@angular/router';
// import { AuthService } from './services/auth.service';

// // This is the replacement for the deprecated CanActivate interface.
// export const authGuard = () => {
//   const authService = inject(AuthService);
//   const router = inject(Router);

//   if (authService.isLoggedIn()) {
//     return true;
//   } else {
//     router.navigate(['/login']);
//     return false;
//   }
// };
