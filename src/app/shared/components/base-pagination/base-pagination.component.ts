import { Component, OnInit, ElementRef, OnDestroy } from '@angular/core';
import { fromEvent } from 'rxjs';
import { map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';


export abstract class BasePaginationComponent implements OnDestroy {

  currentPage = 0;
  isLoading = true;

  ngOnDestroy(): void {
  }

  constructor() { }

  filterDebounce(nativeElement: ElementRef, debounceTimeDuration: number = 500) {
    fromEvent(nativeElement.nativeElement, 'keyup').pipe(
      map((event: Event) => (<HTMLInputElement>event.target).value),
      debounceTime(debounceTimeDuration),
      distinctUntilChanged(),
      untilComponentDestroyed(this))
      .subscribe(data => {
        this.setPaginationOption(0);
        this.fetchPage();
      });
  }

  abstract fetchPage(): void;

  abstract setPaginationOption(page: number, pageSize?: number);

}
