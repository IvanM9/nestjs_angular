import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private api: HttpClient) { }
  apiUrl = environment.API_URL;

  login(user: string, password: string){
    return this.api.post(`${this.apiUrl}/auth/login`, null, {
      headers: {
        'user': user,
        'password': password
      }
    }) 
  }

  logout(){
    return this.api.post(`${this.apiUrl}/auth/logout`,null,{
      headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}
    })
  }

  getLastSessions(){
    return this.api.get(`${this.apiUrl}/auth/last-sessions`,{
      headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}
    })
  }
}
