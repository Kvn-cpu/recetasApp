import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonInput, IonButton } from '@ionic/angular/standalone';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonItem,
    IonInput,
    IonButton,
    CommonModule,
    FormsModule,
    RouterModule
  ]
})
export class LoginPage {
  email: string = '';
  password: string = '';

  constructor(private auth: Auth, private router: Router) {}

  async login() {
    try {
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        this.email,
        this.password
      );
      console.log('✅ Sesión iniciada:', userCredential.user);
      this.router.navigate(['/home']);
    } catch (error: any) {
      console.error('❌ Error en login:', error.message);
      alert('Error: ' + error.message);
    }
  }
}

