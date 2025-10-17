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
import { Router } from '@angular/router';

interface Receta {
  id: string; // 👈 ahora obligatorio para evitar undefined
  titulo: string;
  descripcion: string;
  ingredientes: string;
  tiempo: string;
  imagen: string;
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
    IonIcon,
  ],
})
export class HomePage implements OnInit {
  private recetasSource = new BehaviorSubject<Receta[]>([]);
  recetas$ = this.recetasSource.asObservable();
  private todasRecetas: Receta[] = [];

  constructor(private firestore: Firestore, private router: Router) {}

  ngOnInit() {
    const recetasRef = collection(this.firestore, 'recetas');
    collectionData(recetasRef, { idField: 'id' })
      .pipe(map((data) => data as Receta[]))
      .subscribe((recetas) => {
        this.todasRecetas = recetas;
        this.recetasSource.next(recetas);
      });
  }

  /** 🔍 Normaliza texto: quita tildes y pasa a minúsculas */
  private normalizarTexto(texto: string): string {
    return texto
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, ''); // elimina acentos
  }

  /** 🔎 Filtra recetas según el texto ingresado */
  onSearchChange(event: any) {
    const termino = this.normalizarTexto(event.detail.value || '');

    if (!termino.trim()) {
      this.recetasSource.next(this.todasRecetas);
      return;
    }

    const recetasFiltradas = this.todasRecetas.filter((r) => {
      const titulo = this.normalizarTexto(r.titulo);
      const ingredientes = this.normalizarTexto(r.ingredientes);
      return titulo.includes(termino) || ingredientes.includes(termino);
    });

    this.recetasSource.next(recetasFiltradas);
  }

  /** 📄 Abre el detalle de la receta seleccionada */
  abrirDetalle(id?: string) {
    if (!id) return; // 👈 evita error si algún id llega vacío
    this.router.navigate(['/receta', id]);
  }
}
