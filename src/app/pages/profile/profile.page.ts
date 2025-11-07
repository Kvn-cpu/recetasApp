import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonInput,
  IonButton, IonIcon, IonFooter } from '@ionic/angular/standalone';
import { updateProfile, getAuth, signOut } from 'firebase/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonFooter, IonIcon, 
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonInput,
    IonButton,
  ],
})
export class ProfilePage implements OnInit {
  user: any = {
    displayName: '',
    email: '',
    photoURL: '',
  };

  editMode = false;

  constructor(public router: Router) {}

  ngOnInit(): void {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (currentUser) {
      this.user.displayName = currentUser.displayName || 'Usuario';
      this.user.email = currentUser.email || '';
      this.user.photoURL = currentUser.photoURL || 'assets/default-profile.png';
    }
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
  }

  async saveChanges() {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (currentUser) {
      await updateProfile(currentUser, {
        displayName: this.user.displayName,
        photoURL: this.user.photoURL,
      });
      this.editMode = false;
      alert('Perfil actualizado correctamente.');
    }
  }

  async logout() {
    const auth = getAuth();
    await signOut(auth);
    this.router.navigate(['/login']);
  }

}
