import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonInput, IonButton } from '@ionic/angular/standalone';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
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
export class RegisterPage {
  name: string = '';
  email: string = '';
  confirmEmail: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';

  constructor(private auth: Auth) {}

  async register() {
    this.errorMessage = '';

    if (this.email !== this.confirmEmail) {
      this.errorMessage = '❌ Los correos no coinciden';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = '❌ Las contraseñas no coinciden';
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        this.email,
        this.password
      );
      console.log('✅ Usuario registrado:', userCredential.user);

      alert(`Bienvenido ${this.name} 🚀`);
    } catch (error: any) {
      console.error('❌ Error en registro:', error.message);
      this.errorMessage = error.message;
    }
  }
}
