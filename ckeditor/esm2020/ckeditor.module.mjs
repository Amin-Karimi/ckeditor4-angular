/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CKEditorComponent } from './ckeditor.component';
import * as i0 from "@angular/core";
export class CKEditorModule {
}
CKEditorModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: CKEditorModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
CKEditorModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: CKEditorModule, declarations: [CKEditorComponent], imports: [FormsModule, CommonModule], exports: [CKEditorComponent] });
CKEditorModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: CKEditorModule, imports: [[FormsModule, CommonModule]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: CKEditorModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [FormsModule, CommonModule],
                    declarations: [CKEditorComponent],
                    exports: [CKEditorComponent]
                }]
        }] });
export * from './ckeditor';
export { CKEditorComponent } from './ckeditor.component';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2tlZGl0b3IubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NrZWRpdG9yL2NrZWRpdG9yLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0dBR0c7QUFFSCxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDN0MsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sc0JBQXNCLENBQUM7O0FBT3pELE1BQU0sT0FBTyxjQUFjOzsyR0FBZCxjQUFjOzRHQUFkLGNBQWMsaUJBSFYsaUJBQWlCLGFBRHRCLFdBQVcsRUFBRSxZQUFZLGFBRXpCLGlCQUFpQjs0R0FFaEIsY0FBYyxZQUpqQixDQUFFLFdBQVcsRUFBRSxZQUFZLENBQUU7MkZBSTFCLGNBQWM7a0JBTDFCLFFBQVE7bUJBQUU7b0JBQ1YsT0FBTyxFQUFFLENBQUUsV0FBVyxFQUFFLFlBQVksQ0FBRTtvQkFDdEMsWUFBWSxFQUFFLENBQUUsaUJBQWlCLENBQUU7b0JBQ25DLE9BQU8sRUFBRSxDQUFFLGlCQUFpQixDQUFFO2lCQUM5Qjs7QUFHRCxjQUFjLFlBQVksQ0FBQztBQUMzQixPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBAbGljZW5zZSBDb3B5cmlnaHQgKGMpIDIwMDMtMjAyMywgQ0tTb3VyY2UgSG9sZGluZyBzcC4geiBvLm8uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcbiAqIEZvciBsaWNlbnNpbmcsIHNlZSBMSUNFTlNFLm1kLlxyXG4gKi9cclxuXHJcbmltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XHJcbmltcG9ydCB7IEZvcm1zTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xyXG5pbXBvcnQgeyBDS0VkaXRvckNvbXBvbmVudCB9IGZyb20gJy4vY2tlZGl0b3IuY29tcG9uZW50JztcclxuXHJcbkBOZ01vZHVsZSgge1xyXG5cdGltcG9ydHM6IFsgRm9ybXNNb2R1bGUsIENvbW1vbk1vZHVsZSBdLFxyXG5cdGRlY2xhcmF0aW9uczogWyBDS0VkaXRvckNvbXBvbmVudCBdLFxyXG5cdGV4cG9ydHM6IFsgQ0tFZGl0b3JDb21wb25lbnQgXVxyXG59IClcclxuZXhwb3J0IGNsYXNzIENLRWRpdG9yTW9kdWxlIHtcclxufVxyXG5leHBvcnQgKiBmcm9tICcuL2NrZWRpdG9yJztcclxuZXhwb3J0IHsgQ0tFZGl0b3JDb21wb25lbnQgfSBmcm9tICcuL2NrZWRpdG9yLmNvbXBvbmVudCc7XHJcbiJdfQ==