import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:5000/api/auth';
 
  constructor(private http: HttpClient, private router: Router ) {}

  //Signup api
  signUp(payload: {name: string;email: string;password: string;}): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, payload);
  }

  //login api
  login(payload: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, payload);
  }
   logout(){
   localStorage.clear();
    this.router.navigate(['/login']);
   }
  //get user info
    getMe(): Observable<any> {
    return this.http.get(`${this.baseUrl}/me`);
  }
}
