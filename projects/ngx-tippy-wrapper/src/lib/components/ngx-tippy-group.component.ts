import { isPlatformServer } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Inject, Input, PLATFORM_ID, ViewChild } from '@angular/core';
import tippy from 'tippy.js';
import { NgxTippyMessagesDict, NgxTippyProps } from '../interfaces';
import { NGX_TIPPY_MESSAGES } from '../tokens';

/**
 * Different tooltip content to many different elements, but only one tippy instance
 */
@Component({
  selector: 'ngx-tippy-group',
  template: `
    <div #contentWrapper>
      <ng-content></ng-content>
    </div>
  `,
})
export class NgxTippyGroupComponent implements AfterViewInit {
  @Input() groupedProps?: NgxTippyProps;
  @ViewChild('contentWrapper', { read: ElementRef, static: false }) contentWrapper!: ElementRef;

  constructor(
    @Inject(PLATFORM_ID) private platform: Object,
    @Inject(NGX_TIPPY_MESSAGES) private messagesDict: NgxTippyMessagesDict
  ) {}

  ngAfterViewInit() {
    if (isPlatformServer(this.platform)) return;
    this.setTooltips();
  }

  setTooltips() {
    const contentWrapperNativeEl: HTMLElement = this.contentWrapper.nativeElement;
    const tooltips: HTMLElement[] = Array.from(contentWrapperNativeEl.querySelectorAll('[data-tippy-grouped]'));

    if (tooltips?.length) {
      this.initTippy(tooltips);
    } else {
      throw new Error(this.messagesDict.childrenInstancesNotFoundGrouped);
    }
  }

  initTippy(tooltips: HTMLElement[]) {
    tippy(tooltips, this.groupedProps);
  }
}
