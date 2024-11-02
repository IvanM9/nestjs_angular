import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MaterialModule } from 'src/app/material.module';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-users-last-sessions',
  standalone: true,
  imports: [CommonModule, MatMenuModule, MatButtonModule, MaterialModule, FormsModule],
  templateUrl: './users-last-sessions.component.html',
  styleUrl: './users-last-sessions.component.scss'
})
export class UsersLastSessionsComponent implements OnInit {
deleteData(_t92: any) {
throw new Error('Method not implemented.');
}
editData(_t92: any) {
throw new Error('Method not implemented.');
}
  constructor(private api: HttpClient){}
  async ngOnInit(): Promise<void> {
    await this.getUsers();
  }

searchValue: string = '';
addData() {
throw new Error('Method not implemented.');
}
  displayedColumns: string[] = ['position','firstName', 'lastName', 'logged', 'status', 'actions'];
  dataSource = [];

  async getUsers() {
    this.api.get('http://localhost:3000/users/all',{
      headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}
    }).subscribe((res:any)=>{
      this.dataSource = res.data.map((session: any)=>({
        logged: session.logged,
        firstName: session.firstName,
        lastName: session.lastName,
        status: session.status
      }))
    });
  }
}
