import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ApiLaravelService } from '../services/api-laravel.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(  private auth: ApiLaravelService,
    private router: Router ) {}


  canActivate(): boolean {
    // debugger;
    if (this.auth.authenticate()){
      return true;
    }
    else {
      this.router.navigateByUrl('/intro');
    }
  }
}
