import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonFooter } from '@ionic/angular/standalone';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

interface Receta {
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
    IonHeader,
    IonTitle,
    IonToolbar,
    IonList,
    IonItem,
    IonLabel,
    IonFooter
  ]
})
export class HomePage implements OnInit {
  recetas$!: Observable<Receta[]>;

  constructor(private firestore: Firestore) {}

  ngOnInit() {
    const recetasRef = collection(this.firestore, 'recetas');
    this.recetas$ = collectionData(recetasRef, { idField: 'id' }) as Observable<Receta[]>;
  }
}
