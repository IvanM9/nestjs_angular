import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { LastSessionsComponent } from "../../components/last-sessions/last-sessions.component";
import { UsersLastSessionsComponent } from "../../components/users-last-sessions/users-last-sessions.component";



@Component({
  selector: 'app-starter',
  standalone: true,
  imports: [
    MaterialModule,
    LastSessionsComponent,
    UsersLastSessionsComponent
],
  templateUrl: './starter.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class StarterComponent{
  constructor() { }

  roles = JSON.parse(localStorage.getItem('role') || '[]');

}