import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'https://localhost:7058/api/Authentication/login';

  constructor(private http: HttpClient) {}

  login(data: any) {
    return this.http.post(this.apiUrl, data);
  }

  getEmployees(page: number, size: number) {
  return this.http.get(
    `https://localhost:7058/api/employee?pageNumber=${page}&pageSize=${size}`
  );
}
addEmployee(data: any) {
  console.log('Adding employee with data:', data);
  return this.http.post('https://localhost:7058/api/employee', data);
}
deleteEmployee(id: number) {
  console.log('Deleting employee with id:', id);
  return this.http.delete(`https://localhost:7058/api/employee/${id}`);
}
updateEmployee(id: number, data: any) {
  console.log('Updating employee with id:', id, 'and data:', data);
  return this.http.put(`https://localhost:7058/api/employee/${id}`, data);
}
}