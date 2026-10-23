import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseURL = `http://localhost:3000/`;
  token: any = `Hamada__` + localStorage.getItem('token');
  constructor(
    private _HttpClient: HttpClient,
    private _Router: Router,
  ) {
    this.token = `Hamada__` + localStorage.getItem('token');
  }
  loginWithGmail(data: any): Observable<any> {
    return this._HttpClient.post(this.baseURL + 'auth/loginWithGmail', data);
  }
}
