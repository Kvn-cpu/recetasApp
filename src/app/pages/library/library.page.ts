import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonButton,
} from '@ionic/angular/standalone';
import { Firestore, collection, collectionData, doc, deleteDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-library',
  templateUrl: './library.page.html',
  styleUrls: ['./library.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonButton],
})
export class LibraryPage implements OnInit {
  favoritos: any[] = [];
  userId: string | null = null;

  constructor(
    private firestore: Firestore,
    private auth: Auth,
    private router: Router
  ) {}

  ngOnInit() {
    const user = this.auth.currentUser;
    if (user) {
      this.userId = user.uid;
      this.cargarFavoritos();
    }
  }

  cargarFavoritos() {
    if (!this.userId) return;
    const favoritosRef = collection(this.firestore, `users/${this.userId}/favoritos`);
    collectionData(favoritosRef, { idField: 'id' }).subscribe((data) => {
      this.favoritos = data;
    });
  }

  async eliminarFavorito(id: string) {
    if (!this.userId) return;
    const recetaDoc = doc(this.firestore, `users/${this.userId}/favoritos/${id}`);
    await deleteDoc(recetaDoc);
  }

  verDetalle(receta: any) {
    this.router.navigate(['/receta-detalle', receta.id]);
  }
}
