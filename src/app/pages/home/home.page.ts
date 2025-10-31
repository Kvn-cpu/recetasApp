import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonSearchbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonFooter,
  IonToolbar,
  IonButton,
  IonIcon,
} from '@ionic/angular/standalone';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router, RouterModule } from '@angular/router';

interface Receta {
  id: string;
  titulo: string;
  descripcion: string;
  ingredientes: string[] | string;
  tiempo: number | string;
  imagen: string;
  pasos?: string[];
  videoUrl?: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonSearchbar,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonFooter,
    IonToolbar,
    IonButton,
    IonIcon, RouterModule
  ],
})
export class HomePage implements OnInit {
  private recetasSource = new BehaviorSubject<Receta[]>([]);
  recetas$ = this.recetasSource.asObservable();
  private todasRecetas: Receta[] = [];

  constructor(private firestore: Firestore, public router: Router) {}

  ngOnInit() {
    const recetasRef = collection(this.firestore, 'recetas');
    collectionData(recetasRef, { idField: 'id' })
      .pipe(map((data) => data as Receta[]))
      .subscribe((recetas) => {
        this.todasRecetas = recetas;
        this.recetasSource.next(recetas);
      });
  }

  /** 🔠 Normaliza texto: elimina tildes y pasa a minúsculas */
  private normalizarTexto(texto: string): string {
    return texto
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  /** 🔎 Filtra recetas según el texto ingresado en el buscador */
  onSearchChange(event: any) {
    const termino = this.normalizarTexto(event.detail.value || '');

    if (!termino.trim()) {
      this.recetasSource.next(this.todasRecetas);
      return;
    }

    const recetasFiltradas = this.todasRecetas.filter((r) => {
      const titulo = this.normalizarTexto(r.titulo);

      // 🔹 Convierte ingredientes a texto (array o string)
      const ingredientesTexto = Array.isArray(r.ingredientes)
        ? r.ingredientes.join(' ')
        : r.ingredientes;
      const ingredientes = this.normalizarTexto(ingredientesTexto);

      // 🔹 Normaliza descripción y pasos (si existen)
      const descripcion = this.normalizarTexto(r.descripcion || '');
      const pasos = this.normalizarTexto(r.pasos?.join(' ') || '');

      // ✅ Busca coincidencias en varios campos
      return (
        titulo.includes(termino) ||
        ingredientes.includes(termino) ||
        descripcion.includes(termino) ||
        pasos.includes(termino)
      );
    });

    this.recetasSource.next(recetasFiltradas);
  }

  /** 📄 Abre el detalle de la receta seleccionada */
  abrirDetalle(id?: string) {
    if (!id) return;
    this.router.navigate(['/receta', id]);
  }
}
