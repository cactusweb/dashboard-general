import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../../tools/interfaces/user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  user!: Observable<User|null>

  constructor(
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.user = this.userService.getUser()
  }

}
