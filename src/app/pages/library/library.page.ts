import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firestore, collection, collectionData, doc, deleteDoc } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import {
  IonContent, IonSearchbar, IonButton,
  IonIcon, IonHeader, IonToolbar, IonButtons, IonTitle
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { trash, arrowForward, personCircleOutline, searchOutline } from 'ionicons/icons';

@Component({
  selector: 'app-library',
  templateUrl: './library.page.html',
  styleUrls: ['./library.page.scss'],
  standalone: true,
  imports: [
    CommonModule, IonContent, IonSearchbar, IonButton,
    IonIcon, IonHeader, IonToolbar, IonButtons, IonTitle
  ],
})
export class LibraryPage implements OnInit {
  private favSource = new BehaviorSubject<any[]>([]);
  recetasFav$ = this.favSource.asObservable();
  private todasFavs: any[] = [];
  userId: string | null = null;

  constructor(
    private firestore: Firestore,
    private auth: Auth,
    public router: Router
  ) {
    addIcons({ personCircleOutline, trash, arrowForward, searchOutline });
  }

  async ngOnInit() {
    const user = this.auth.currentUser;
    this.userId = user ? user.uid : null;

    if (this.userId) {
      const favRef = collection(this.firestore, `usuarios/${this.userId}/favoritos`);
      collectionData(favRef, { idField: 'id' })
        .pipe(map((data) => data as any[]))
        .subscribe((favs) => {
          this.todasFavs = favs;
          this.favSource.next(favs);
        });
    }
  }

  private normalizarTexto(texto: string): string {
    return texto
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  onSearchChange(event: any) {
    const termino = this.normalizarTexto(event.detail.value || '');

    if (!termino.trim()) {
      this.favSource.next(this.todasFavs);
      return;
    }

    const filtrados = this.todasFavs.filter((r) => {
      const titulo = this.normalizarTexto(r.titulo || '');
      const descripcion = this.normalizarTexto(r.descripcion || '');
      const ingredientesTexto = Array.isArray(r.ingredientes)
        ? r.ingredientes.join(' ')
        : r.ingredientes || '';
      const ingredientes = this.normalizarTexto(ingredientesTexto);

      return (
        titulo.includes(termino) ||
        descripcion.includes(termino) ||
        ingredientes.includes(termino)
      );
    });

    this.favSource.next(filtrados);
  }

  verDetalle(id: string) {
    this.router.navigate(['/receta-detalle', id]);
  }

  async eliminarFavorito(id: string) {
    if (!this.userId) return;
    const favRef = doc(this.firestore, `usuarios/${this.userId}/favoritos/${id}`);
    await deleteDoc(favRef);
    // Actualiza el array reactivo local para efectos inmediatos en UI
    this.todasFavs = this.todasFavs.filter(r => r.id !== id);
    this.favSource.next(this.todasFavs);
  }
}