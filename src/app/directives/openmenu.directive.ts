import { Directive, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[appOpenmenu]',
  exportAs:'openMenuRef'
})
export class OpenmenuDirective {

  @HostBinding('class.side-menu--open') toggle = false;
  
  @HostListener('click') dropdownToggle() {
      this.toggle = !this.toggle;
  }

  constructor() { }

}
