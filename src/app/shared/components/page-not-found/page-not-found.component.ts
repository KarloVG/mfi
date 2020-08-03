import { Component } from '@angular/core';

@Component({
  template: `
    <div class="not-found-wrap text-center">
        <h1>
        <i>Stranicu koju ste tražili nije moguće pronaći</i>  
        </h1>
        <img src="assets/lego_404.jpg" style="height: 55vh;" alt="Slika #stranicaNijePronađena">
    </div>
    `
})
export class PageNotFoundComponent { }
