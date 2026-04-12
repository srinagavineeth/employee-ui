import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  login(data: any) {
  return this.http.post(`${this.baseUrl}/Authentication/login`, data);
}

  getEmployees(page: number, size: number) {
  return this.http.get(
    `${this.baseUrl}/employee?pageNumber=${page}&pageSize=${size}`
  );
}
addEmployee(data: any) {
  return this.http.post(`${this.baseUrl}/employee`, data);
}
deleteEmployee(id: number) {
  return this.http.delete(`${this.baseUrl}/employee/${id}`);
}
updateEmployee(id: number, data: any) {
  return this.http.put(`${this.baseUrl}/employee/${id}`, data);
}
}