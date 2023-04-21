import { Component, OnInit } from '@angular/core';
import { AuthModule } from '@auth0/auth0-angular';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  private roles: string[] = [];
  isLoggedIn = false;
  showAdminBoard = false;
  showModeratorBoard = false;
  username?: string;

  constructor() { }

  ngOnInit(): void {

    // Import the module into the application, with configuration
    AuthModule.forRoot({
      domain: environment.auth.domain,
      clientId: environment.auth.clientId
    })
  }
}
