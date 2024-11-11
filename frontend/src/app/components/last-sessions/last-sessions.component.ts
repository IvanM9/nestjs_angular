import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MaterialModule } from 'src/app/material.module';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-last-sessions',
  standalone: true,
  imports: [CommonModule, MatMenuModule, MatButtonModule, MaterialModule],
  templateUrl: './last-sessions.component.html',
  styleUrl: './last-sessions.component.scss'
})
export class LastSessionsComponent implements OnInit {
  constructor(private api: HttpClient){}
  displayedColumns: string[] = ['firstDate', 'lastDate', 'logged'];
  dataSource = [];

  ngOnInit(){
    this.api.get('http://localhost:3000/auth/last-sessions',{
      headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}
    }).subscribe((res:any)=>{
      this.dataSource = res.data.map((session: any)=>({
        logged: session.failed ? 'No' : 'Sí',
        firstDate: session.firstDate,
        lastDate: session.lastDate
      }))
    })
  }
}
