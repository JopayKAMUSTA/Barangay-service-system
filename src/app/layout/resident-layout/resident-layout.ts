import { Component } from '@angular/core';
import { RouterOutlet} from '@angular/router';
import { Sidebar } from '../sidebar/sidebar';

@Component({
  selector: 'app-resident-layout',
  imports: [RouterOutlet,Sidebar],
  templateUrl: './resident-layout.html',
  styleUrl: './resident-layout.css',
})
export class ResidentLayout {

}
