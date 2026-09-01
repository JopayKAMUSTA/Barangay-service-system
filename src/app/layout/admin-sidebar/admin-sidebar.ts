import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive,Router} from '@angular/router';
import { Auth, signOut} from '@angular/fire/auth';

@Component({
  selector: 'app-admin-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './admin-sidebar.html',
  styleUrl: './admin-sidebar.css',
})
export class AdminSidebar {

  private auth = inject(Auth);
  private router = inject(Router);

  async logout()
  {

    try
    {

      await signOut(this.auth);

      this.router.navigate(['/login']);
    }
    catch (error)
    {

      console.error('Logout error: ', error);
    }
  }
}
