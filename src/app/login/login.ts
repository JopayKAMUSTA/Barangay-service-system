import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Auth, signInWithEmailAndPassword, user } from '@angular/fire/auth';
import { Router, RouterLink} from '@angular/router';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-login',
  imports: [FormsModule,RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  private auth = inject(Auth);
  private router = inject(Router);
  private firestore = inject(Firestore);

  email = '';
  password = '';
  message = '';

  async login(){

    try{
      const credentials = await signInWithEmailAndPassword(
        this.auth,
        this.email,
        this.password
      );

      const uid = credentials.user.uid;

      const userDoc = await getDoc(
        doc(this.firestore, 'users', uid)
      );

      if(!userDoc.exists()){
        this.message = 'User profile not found.';
        return;
      }
      
      const userData = userDoc.data();
      
      if(userData['role'] === 'admin'){

        await this.router.navigate(['/admin-dashboard']);

      } else{

        await this.router.navigate(['/dashboard']);
        
      }

    } catch (error:any){

      console.error(error);
    }
  }
}
