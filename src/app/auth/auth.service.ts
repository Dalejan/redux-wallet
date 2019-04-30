import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { User } from './user.model';
import { AngularFirestore } from '@angular/fire/firestore';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afAuth: AngularFireAuth, private router: Router, private afDb: AngularFirestore) { }

  initAuthListener() {
    this.afAuth.authState.subscribe(fbUser => {

    });
  }

  createUser(name: string, email: string, password: string) {
    this.afAuth.auth.createUserWithEmailAndPassword(email, password).then(res => {
      const user: User = {
        uid: res.user.uid,
        name: res.additionalUserInfo.username,
        email: res.user.email
      };

      this.afDb.doc(`${user.uid}/user`)
        .set({ user })
        .then(() => {

          this.router.navigate(['/']);
        }, err => {
          Swal.fire({
            title: 'Error!',
            text: err.message,
            type: 'error',
            confirmButtonText: 'Cool'
          });
        });

    }, err => {
      Swal.fire({
        title: 'Error!',
        text: err.message,
        type: 'error',
        confirmButtonText: 'Cool'
      });
    });

  }

  loginUser(email: string, password: string) {
    this.afAuth.auth.signInWithEmailAndPassword(email, password).then(user => {
      this.router.navigate(['/']);
    }, err => {
      Swal.fire({
        title: 'Error!',
        text: err.message,
        type: 'error',
        confirmButtonText: 'Cool'
      });
    });
  }

  logout() {
    this.router.navigate(['login']);
    this.afAuth.auth.signOut();

  }

  isAuth(): Observable<boolean> {
    return this.afAuth.authState.pipe(
      map(fbUser => {
        if (fbUser == null) {
          this.router.navigate(['/login']);
        }
        return fbUser != null;
      })
    );
  }
}
