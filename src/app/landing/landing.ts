import { AfterViewInit, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  imports: [CommonModule, RouterLink],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class Landing implements AfterViewInit {

  ngAfterViewInit(): void {

    const elements = document.querySelectorAll(
      '.scroll-reveal, .scroll-left, .scroll-right'
    );

    const observer = new IntersectionObserver(
      (entries) => {

        entries.forEach((entry) => {

          if (entry.isIntersecting) {
            entry.target.classList.add('show');
          }

        });

      },
      {
        threshold: 0.15
      }
    );

    elements.forEach((element) => {
      observer.observe(element);
    });

  }

  scrollTo(sectionId: string): void {
    const element = document.getElementById(sectionId);

    if(element)
       {
        element.scrollIntoView({
          behavior:'smooth',
          block:'start'
        });
       }
  }
}