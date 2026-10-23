import { Component } from '@angular/core';
import { SocialAuthService } from "@abacritt/angularx-social-login";
import { AuthService } from './auth.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'socialLoginApp';
  user: any;
  loggedIn: any;

  constructor(private authService: SocialAuthService, public _authService: AuthService) {

  }

  ngOnInit() {
    this.authService.authState.subscribe((user: any) => {
      this.user = user;
      this.loggedIn = (user != null);
      console.log({ user });
      this.handelSignIn(this.user.idToken)
    });

  }

  handelSignIn(idToken: any) {

    this._authService.loginWithGmail({ idToken }).subscribe(data => {
      console.log({ data });
    }
    )
  }
}
