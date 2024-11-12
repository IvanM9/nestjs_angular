import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MaterialModule } from 'src/app/material.module';

@Component({
  selector: 'app-my-information',
  templateUrl: './my-information.component.html',
  styleUrls: ['./my-information.component.css'],
  standalone: true,
  imports: [MaterialModule]
})
export class MyInformationComponent implements OnInit {

  data: {
    firstName: string,
    lastName: string,
    email: string,
    identification: string,
  } = {
    firstName: '',
    lastName: '',
    email: '',
    identification: '',
  }

  constructor(private api: HttpClient) { }

  ngOnInit() {
    this.api.get('http://localhost:3000/users/my-information', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }).subscribe((res: any) => {
      this.data = res.data;
    })
  }

}
