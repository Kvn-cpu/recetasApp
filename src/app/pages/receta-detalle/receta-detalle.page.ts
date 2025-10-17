import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-receta-detalle',
  templateUrl: './receta-detalle.page.html',
  styleUrls: ['./receta-detalle.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent],
})
export class RecetaDetallePage implements OnInit {
  receta: any = null;
  mostrarVideo = false; // 👈 Controla si se muestra el iframe

  constructor(private route: ActivatedRoute, private firestore: Firestore) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const docRef = doc(this.firestore, `recetas/${id}`);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        this.receta = docSnap.data();
      }
    }
  }
}
