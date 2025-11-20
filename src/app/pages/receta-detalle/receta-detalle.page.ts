import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Firestore, doc, getDoc, setDoc, deleteDoc } from '@angular/fire/firestore';
import { IonContent, IonButton, IonIcon } from '@ionic/angular/standalone';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Auth } from '@angular/fire/auth';
import { addIcons } from 'ionicons';
import { heart, heartOutline } from 'ionicons/icons';

@Component({
  selector: 'app-receta-detalle',
  templateUrl: './receta-detalle.page.html',
  styleUrls: ['./receta-detalle.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonButton, IonIcon],
})
export class RecetaDetallePage implements OnInit {
  receta: any = null;
  mostrarVideo = false;
  videoSeguro: SafeResourceUrl | null = null;
  esFavorito = false;
  userId: string | null = null;
  recetaId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private firestore: Firestore,
    private sanitizer: DomSanitizer,
    private auth: Auth
  ) {
    addIcons({ heart, heartOutline });
  }

  async ngOnInit() {
    const user = this.auth.currentUser;
    this.userId = user ? user.uid : null;

    this.recetaId = this.route.snapshot.paramMap.get('id');

    if (this.recetaId) {
      const docRef = doc(this.firestore, `recetas/${this.recetaId}`);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        this.receta = {
          id: this.recetaId,
          ...docSnap.data()
        };

        if (this.receta.videoUrl) {
          this.videoSeguro = this.sanitizer.bypassSecurityTrustResourceUrl(this.receta.videoUrl);
        }

        if (this.userId) {
          await this.verificarFavorito(this.recetaId);
        }
      }
    }
  }

  async verificarFavorito(id: string) {
    if (!this.userId) return;

    const favRef = doc(this.firestore, `usuarios/${this.userId}/favoritos/${id}`);
    const favSnap = await getDoc(favRef);

    this.esFavorito = favSnap.exists();
  }

  async toggleFavorito() {
    if (!this.userId) {
      return alert('Debes iniciar sesión para guardar favoritos.');
    }

    if (!this.recetaId || !this.receta) return;

    const favRef = doc(this.firestore, `usuarios/${this.userId}/favoritos/${this.recetaId}`);

    if (this.esFavorito) {
      await deleteDoc(favRef);
      this.esFavorito = false;
    } else {
      await setDoc(favRef, {
        id: this.recetaId, // ← NECESARIO
        titulo: this.receta.titulo,
        imagen: this.receta.imagen,
        descripcion: this.receta.descripcion,
        fechaGuardado: new Date(),
      });
      this.esFavorito = true;
    }
  }
}
