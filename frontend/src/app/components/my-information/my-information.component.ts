import { Component, OnInit } from '@angular/core';
import { MaterialModule } from 'src/app/material.module';
import { UsersService } from 'src/app/services/users.service';

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

  constructor(private service: UsersService) { }

  ngOnInit() {
    this.service.getMyInformation().subscribe((res:any)=>{
      this.data = res.data;
    })
  }
}
