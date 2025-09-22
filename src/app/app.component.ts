import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterOutlet } from '@angular/router';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,  // 👈 NECESARIO para standalone
  imports: [IonicModule, RouterOutlet],  // 👈 Importa Ionic y RouterOutlet
})
export class AppComponent {
  constructor(private firestore: Firestore) {
    this.testConnection();
  }

  async testConnection() {
    const querySnapshot = await getDocs(collection(this.firestore, 'test'));
    querySnapshot.forEach(doc => {
      console.log(doc.id, ' => ', doc.data());
    });
  }
}
