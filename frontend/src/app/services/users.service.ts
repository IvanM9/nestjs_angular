import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  apiUrl = environment.API_URL;
  headers = {}

  constructor(private api: HttpClient) {
    this.headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` };
  }

  getUsers(searchValue: string, currentPage: number, pageSize: number) {
    return this.api.get(`${this.apiUrl}/users/all`, {
      headers: this.headers,
      params: { search: searchValue, page: currentPage.toString(), items: pageSize.toString() }
    });
  }

  updateStatus(id: string, status: boolean) {
    return this.api.patch(`${this.apiUrl}/users/update-status/${id}/${status}`, null, { headers: this.headers });
  }

  updateUser(id: number, data: any) {
    return this.api.put(`${this.apiUrl}/users/update/${id}`, data, { headers: this.headers });
  }

  importExcel(file: FormData) {
    return this.api.post(`${this.apiUrl}/users/import-from-excel`, file, { headers: this.headers });
  }

  getUserById(id: number) {
    return this.api.get(`${this.apiUrl}/users/by-id/${id}`, { headers: this.headers });
  }

  createUser(data: any) {
    return this.api.post(`${this.apiUrl}/users/create`, data, { headers: this.headers });
  }

  getMyInformation(){
    return this.api.get(`${this.apiUrl}/users/my-information`, { headers: this.headers })
  }
}
