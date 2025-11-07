import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Firestore, doc, getDoc, setDoc, deleteDoc } from '@angular/fire/firestore';
import { IonContent, IonButton, IonIcon } from '@ionic/angular/standalone';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { getAuth } from '@angular/fire/auth';

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

  constructor(
    private route: ActivatedRoute,
    private firestore: Firestore,
    private sanitizer: DomSanitizer
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const docRef = doc(this.firestore, `recetas/${id}`);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        this.receta = docSnap.data();
        if (this.receta.videoUrl) {
          this.videoSeguro = this.sanitizer.bypassSecurityTrustResourceUrl(this.receta.videoUrl);
        }

        // Verificar si ya es favorito
        await this.verificarFavorito(id);
      }
    }
  }

  async verificarFavorito(id: string) {
    const user = getAuth().currentUser;
    if (!user) return;

    const favRef = doc(this.firestore, `usuarios/${user.uid}/favoritos/${id}`);
    const favSnap = await getDoc(favRef);
    this.esFavorito = favSnap.exists();
  }

  async toggleFavorito() {
    const user = getAuth().currentUser;
    if (!user) return alert('Debes iniciar sesión para guardar favoritos.');

    const favRef = doc(this.firestore, `usuarios/${user.uid}/favoritos/${this.route.snapshot.paramMap.get('id')}`);

    if (this.esFavorito) {
      await deleteDoc(favRef);
      this.esFavorito = false;
    } else {
      await setDoc(favRef, {
        titulo: this.receta.titulo,
        imagen: this.receta.imagen,
        descripcion: this.receta.descripcion,
        fechaGuardado: new Date(),
      });
      this.esFavorito = true;
    }
  }
}
