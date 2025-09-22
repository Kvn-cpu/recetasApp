import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonInput, IonButton } from '@ionic/angular/standalone';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Router } from '@angular/router';

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
    FormsModule
  ]
})
export class RegisterPage {
  email: string = '';
  password: string = '';

  constructor(private auth: Auth, private router: Router) {}

  async register() {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        this.email,
        this.password
      );
      console.log('✅ Usuario registrado:', userCredential.user);
      alert('Registro exitoso 🎉');
      this.router.navigate(['/login']); // 👈 Redirigir al login después de registrar
    } catch (error: any) {
      console.error('❌ Error en registro:', error.message);
      alert('Error: ' + error.message);
    }
  }
}
