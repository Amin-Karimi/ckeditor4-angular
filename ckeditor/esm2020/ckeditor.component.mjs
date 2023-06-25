/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */
import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { getEditorNamespace } from 'ckeditor4-integrations-common';
import * as i0 from "@angular/core";
export class CKEditorComponent {
    constructor(elementRef, ngZone) {
        this.elementRef = elementRef;
        this.ngZone = ngZone;
        /**
         * CKEditor 4 script url address. Script will be loaded only if CKEDITOR namespace is missing.
         *
         * Defaults to 'https://cdn.ckeditor.com/4.21.0/standard-all/ckeditor.js'
         */
        this.editorUrl = 'https://cdn.ckeditor.com/4.21.0/standard-all/ckeditor.js';
        /**
         * Tag name of the editor component.
         *
         * The default tag is `textarea`.
         */
        this.tagName = 'textarea';
        /**
         * The type of the editor interface.
         *
         * By default editor interface will be initialized as `classic` editor.
         * You can also choose to create an editor with `inline` interface type instead.
         *
         * See https://ckeditor.com/docs/ckeditor4/latest/guide/dev_uitypes.html
         * and https://ckeditor.com/docs/ckeditor4/latest/examples/fixedui.html
         * to learn more.
         */
        this.type = "classic" /* CLASSIC */;
        /**
         * Fired when the CKEDITOR https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR.html namespace
         * is loaded. It only triggers once, no matter how many CKEditor 4 components are initialised.
         * Can be used for convenient changes in the namespace, e.g. for adding external plugins.
         */
        this.namespaceLoaded = new EventEmitter();
        /**
         * Fires when the editor is ready. It corresponds with the `editor#instanceReady`
         * https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#event-instanceReady
         * event.
         */
        this.ready = new EventEmitter();
        /**
         * Fires when the editor data is loaded, e.g. after calling setData()
         * https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#method-setData
         * editor's method. It corresponds with the `editor#dataReady`
         * https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#event-dataReady event.
         */
        this.dataReady = new EventEmitter();
        /**
         * Fires when the content of the editor has changed. It corresponds with the `editor#change`
         * https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#event-change
         * event. For performance reasons this event may be called even when data didn't really changed.
         * Please note that this event will only be fired when `undo` plugin is loaded. If you need to
         * listen for editor changes (e.g. for two-way data binding), use `dataChange` event instead.
         */
        this.change = new EventEmitter();
        /**
         * Fires when the content of the editor has changed. In contrast to `change` - only emits when
         * data really changed thus can be successfully used with `[data]` and two way `[(data)]` binding.
         *
         * See more: https://angular.io/guide/template-syntax#two-way-binding---
         */
        this.dataChange = new EventEmitter();
        /**
         * Fires when the native dragStart event occurs. It corresponds with the `editor#dragstart`
         * https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#event-dragstart
         * event.
         */
        this.dragStart = new EventEmitter();
        /**
         * Fires when the native dragEnd event occurs. It corresponds with the `editor#dragend`
         * https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#event-dragend
         * event.
         */
        this.dragEnd = new EventEmitter();
        /**
         * Fires when the native drop event occurs. It corresponds with the `editor#drop`
         * https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#event-drop
         * event.
         */
        this.drop = new EventEmitter();
        /**
         * Fires when the file loader response is received. It corresponds with the `editor#fileUploadResponse`
         * https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#event-fileUploadResponse
         * event.
         */
        this.fileUploadResponse = new EventEmitter();
        /**
         * Fires when the file loader should send XHR. It corresponds with the `editor#fileUploadRequest`
         * https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#event-fileUploadRequest
         * event.
         */
        this.fileUploadRequest = new EventEmitter();
        /**
         * Fires when the editing area of the editor is focused. It corresponds with the `editor#focus`
         * https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#event-focus
         * event.
         */
        this.focus = new EventEmitter();
        /**
         * Fires after the user initiated a paste action, but before the data is inserted.
         * It corresponds with the `editor#paste`
         * https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#event-paste
         * event.
         */
        this.paste = new EventEmitter();
        /**
         * Fires after the `paste` event if content was modified. It corresponds with the `editor#afterPaste`
         * https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#event-afterPaste
         * event.
         */
        this.afterPaste = new EventEmitter();
        /**
         * Fires when the editing view of the editor is blurred. It corresponds with the `editor#blur`
         * https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#event-blur
         * event.
         */
        this.blur = new EventEmitter();
        /**
         * If the component is read–only before the editor instance is created, it remembers that state,
         * so the editor can become read–only once it is ready.
         */
        this._readOnly = null;
        this._data = null;
        this._destroyed = false;
    }
    /**
     * Keeps track of the editor's data.
     *
     * It's also decorated as an input which is useful when not using the ngModel.
     *
     * See https://angular.io/api/forms/NgModel to learn more.
     */
    set data(data) {
        if (data === this._data) {
            return;
        }
        if (this.instance) {
            this.instance.setData(data);
            // Data may be changed by ACF.
            this._data = this.instance.getData();
            return;
        }
        this._data = data;
    }
    get data() {
        return this._data;
    }
    /**
     * When set to `true`, the editor becomes read-only.
     *
     * See https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#property-readOnly
     * to learn more.
     */
    set readOnly(isReadOnly) {
        if (this.instance) {
            this.instance.setReadOnly(isReadOnly);
            return;
        }
        // Delay setting read-only state until editor initialization.
        this._readOnly = isReadOnly;
    }
    get readOnly() {
        if (this.instance) {
            return this.instance.readOnly;
        }
        return this._readOnly;
    }
    ngAfterViewInit() {
        getEditorNamespace(this.editorUrl, namespace => {
            this.namespaceLoaded.emit(namespace);
        }).then(() => {
            // Check if component instance was destroyed before `ngAfterViewInit` call (#110).
            // Here, `this.instance` is still not initialized and so additional flag is needed.
            if (this._destroyed) {
                return;
            }
            this.ngZone.runOutsideAngular(this.createEditor.bind(this));
        }).catch(window.console.error);
    }
    ngOnDestroy() {
        this._destroyed = true;
        this.ngZone.runOutsideAngular(() => {
            if (this.instance) {
                this.instance.destroy();
                this.instance = null;
            }
        });
    }
    writeValue(value) {
        this.data = value;
    }
    registerOnChange(callback) {
        this.onChange = callback;
    }
    registerOnTouched(callback) {
        this.onTouched = callback;
    }
    createEditor() {
        const element = document.createElement(this.tagName);
        this.elementRef.nativeElement.appendChild(element);
        const userInstanceReadyCallback = this.config?.on?.instanceReady;
        const defaultConfig = {
            delayIfDetached: true
        };
        const config = { ...defaultConfig, ...this.config };
        if (typeof config.on === 'undefined') {
            config.on = {};
        }
        config.on.instanceReady = evt => {
            const editor = evt.editor;
            this.instance = editor;
            // Read only state may change during instance initialization.
            this.readOnly = this._readOnly !== null ? this._readOnly : this.instance.readOnly;
            this.subscribe(this.instance);
            const undo = editor.undoManager;
            if (this.data !== null) {
                undo && undo.lock();
                editor.setData(this.data, { callback: () => {
                        // Locking undoManager prevents 'change' event.
                        // Trigger it manually to updated bound data.
                        if (this.data !== editor.getData()) {
                            undo ? editor.fire('change') : editor.fire('dataReady');
                        }
                        undo && undo.unlock();
                        this.ngZone.run(() => {
                            if (typeof userInstanceReadyCallback === 'function') {
                                userInstanceReadyCallback(evt);
                            }
                            this.ready.emit(evt);
                        });
                    } });
            }
            else {
                this.ngZone.run(() => {
                    if (typeof userInstanceReadyCallback === 'function') {
                        userInstanceReadyCallback(evt);
                    }
                    this.ready.emit(evt);
                });
            }
        };
        if (this.type === "inline" /* INLINE */) {
            CKEDITOR.inline(element, config);
        }
        else {
            CKEDITOR.replace(element, config);
        }
    }
    subscribe(editor) {
        editor.on('focus', evt => {
            this.ngZone.run(() => {
                this.focus.emit(evt);
            });
        });
        editor.on('paste', evt => {
            this.ngZone.run(() => {
                this.paste.emit(evt);
            });
        });
        editor.on('afterPaste', evt => {
            this.ngZone.run(() => {
                this.afterPaste.emit(evt);
            });
        });
        editor.on('dragend', evt => {
            this.ngZone.run(() => {
                this.dragEnd.emit(evt);
            });
        });
        editor.on('dragstart', evt => {
            this.ngZone.run(() => {
                this.dragStart.emit(evt);
            });
        });
        editor.on('drop', evt => {
            this.ngZone.run(() => {
                this.drop.emit(evt);
            });
        });
        editor.on('fileUploadRequest', evt => {
            this.ngZone.run(() => {
                this.fileUploadRequest.emit(evt);
            });
        });
        editor.on('fileUploadResponse', evt => {
            this.ngZone.run(() => {
                this.fileUploadResponse.emit(evt);
            });
        });
        editor.on('blur', evt => {
            this.ngZone.run(() => {
                if (this.onTouched) {
                    this.onTouched();
                }
                this.blur.emit(evt);
            });
        });
        editor.on('dataReady', this.propagateChange, this);
        if (this.instance.undoManager) {
            editor.on('change', this.propagateChange, this);
        }
        // If 'undo' plugin is not loaded, listen to 'selectionCheck' event instead. (#54).
        else {
            editor.on('selectionCheck', this.propagateChange, this);
        }
    }
    propagateChange(event) {
        this.ngZone.run(() => {
            const newData = this.instance.getData();
            if (event.name === 'change') {
                this.change.emit(event);
            }
            else if (event.name === 'dataReady') {
                this.dataReady.emit(event);
            }
            if (newData === this.data) {
                return;
            }
            this._data = newData;
            this.dataChange.emit(newData);
            if (this.onChange) {
                this.onChange(newData);
            }
        });
    }
}
CKEditorComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: CKEditorComponent, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Component });
CKEditorComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.4.0", type: CKEditorComponent, selector: "ckeditor", inputs: { config: "config", editorUrl: "editorUrl", tagName: "tagName", type: "type", data: "data", readOnly: "readOnly" }, outputs: { namespaceLoaded: "namespaceLoaded", ready: "ready", dataReady: "dataReady", change: "change", dataChange: "dataChange", dragStart: "dragStart", dragEnd: "dragEnd", drop: "drop", fileUploadResponse: "fileUploadResponse", fileUploadRequest: "fileUploadRequest", focus: "focus", paste: "paste", afterPaste: "afterPaste", blur: "blur" }, providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => CKEditorComponent),
            multi: true,
        }
    ], ngImport: i0, template: '<ng-template></ng-template>', isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: CKEditorComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ckeditor',
                    template: '<ng-template></ng-template>',
                    providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => CKEditorComponent),
                            multi: true,
                        }
                    ]
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.NgZone }]; }, propDecorators: { config: [{
                type: Input
            }], editorUrl: [{
                type: Input
            }], tagName: [{
                type: Input
            }], type: [{
                type: Input
            }], data: [{
                type: Input
            }], readOnly: [{
                type: Input
            }], namespaceLoaded: [{
                type: Output
            }], ready: [{
                type: Output
            }], dataReady: [{
                type: Output
            }], change: [{
                type: Output
            }], dataChange: [{
                type: Output
            }], dragStart: [{
                type: Output
            }], dragEnd: [{
                type: Output
            }], drop: [{
                type: Output
            }], fileUploadResponse: [{
                type: Output
            }], fileUploadRequest: [{
                type: Output
            }], focus: [{
                type: Output
            }], paste: [{
                type: Output
            }], afterPaste: [{
                type: Output
            }], blur: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2tlZGl0b3IuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NrZWRpdG9yL2NrZWRpdG9yLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0dBR0c7QUFFSCxPQUFPLEVBQ04sU0FBUyxFQUVULEtBQUssRUFDTCxNQUFNLEVBQ04sWUFBWSxFQUNaLFVBQVUsRUFHVixNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBRU4saUJBQWlCLEVBQ2pCLE1BQU0sZ0JBQWdCLENBQUM7QUFFeEIsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sK0JBQStCLENBQUM7O0FBa0JuRSxNQUFNLE9BQU8saUJBQWlCO0lBMk43QixZQUFxQixVQUFzQixFQUFVLE1BQWM7UUFBOUMsZUFBVSxHQUFWLFVBQVUsQ0FBWTtRQUFVLFdBQU0sR0FBTixNQUFNLENBQVE7UUFsTm5FOzs7O1dBSUc7UUFDTSxjQUFTLEdBQUcsMERBQTBELENBQUM7UUFFaEY7Ozs7V0FJRztRQUNNLFlBQU8sR0FBRyxVQUFVLENBQUM7UUFFOUI7Ozs7Ozs7OztXQVNHO1FBQ00sU0FBSSwyQkFBc0Q7UUFvRG5FOzs7O1dBSUc7UUFDTyxvQkFBZSxHQUFHLElBQUksWUFBWSxFQUF1QixDQUFDO1FBRXBFOzs7O1dBSUc7UUFDTyxVQUFLLEdBQUcsSUFBSSxZQUFZLEVBQXVCLENBQUM7UUFFMUQ7Ozs7O1dBS0c7UUFDTyxjQUFTLEdBQUcsSUFBSSxZQUFZLEVBQXVCLENBQUM7UUFFOUQ7Ozs7OztXQU1HO1FBQ08sV0FBTSxHQUFHLElBQUksWUFBWSxFQUF1QixDQUFDO1FBRTNEOzs7OztXQUtHO1FBQ08sZUFBVSxHQUFHLElBQUksWUFBWSxFQUF1QixDQUFDO1FBRS9EOzs7O1dBSUc7UUFDTyxjQUFTLEdBQUcsSUFBSSxZQUFZLEVBQXVCLENBQUM7UUFFOUQ7Ozs7V0FJRztRQUNPLFlBQU8sR0FBRyxJQUFJLFlBQVksRUFBdUIsQ0FBQztR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QkFBZCxNQUFNO2dCQVFHLEtBQUs7c0JBQWQsTUFBTTtnQkFPRyxVQUFVO3NCQUFuQixNQUFNO2dCQU9HLElBQUk7c0JBQWIsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBAbGljZW5zZSBDb3B5cmlnaHQgKGMpIDIwMDMtMjAyMywgQ0tTb3VyY2UgSG9sZGluZyBzcC4geiBvLm8uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcbiAqIEZvciBsaWNlbnNpbmcsIHNlZSBMSUNFTlNFLm1kLlxyXG4gKi9cclxuXHJcbmltcG9ydCB7XHJcblx0Q29tcG9uZW50LFxyXG5cdE5nWm9uZSxcclxuXHRJbnB1dCxcclxuXHRPdXRwdXQsXHJcblx0RXZlbnRFbWl0dGVyLFxyXG5cdGZvcndhcmRSZWYsXHJcblx0RWxlbWVudFJlZixcclxuXHRBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3lcclxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbmltcG9ydCB7XHJcblx0Q29udHJvbFZhbHVlQWNjZXNzb3IsXHJcblx0TkdfVkFMVUVfQUNDRVNTT1JcclxufSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XHJcblxyXG5pbXBvcnQgeyBnZXRFZGl0b3JOYW1lc3BhY2UgfSBmcm9tICdja2VkaXRvcjQtaW50ZWdyYXRpb25zLWNvbW1vbic7XHJcblxyXG5pbXBvcnQgeyBDS0VkaXRvcjQgfSBmcm9tICcuL2NrZWRpdG9yJztcclxuXHJcbmRlY2xhcmUgbGV0IENLRURJVE9SOiBhbnk7XHJcblxyXG5AQ29tcG9uZW50KCB7XHJcblx0c2VsZWN0b3I6ICdja2VkaXRvcicsXHJcblx0dGVtcGxhdGU6ICc8bmctdGVtcGxhdGU+PC9uZy10ZW1wbGF0ZT4nLFxyXG5cclxuXHRwcm92aWRlcnM6IFtcclxuXHRcdHtcclxuXHRcdFx0cHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXHJcblx0XHRcdHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCAoKSA9PiBDS0VkaXRvckNvbXBvbmVudCApLFxyXG5cdFx0XHRtdWx0aTogdHJ1ZSxcclxuXHRcdH1cclxuXHRdXHJcbn0gKVxyXG5leHBvcnQgY2xhc3MgQ0tFZGl0b3JDb21wb25lbnQgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3ksIENvbnRyb2xWYWx1ZUFjY2Vzc29yIHtcclxuXHQvKipcclxuXHQgKiBUaGUgY29uZmlndXJhdGlvbiBvZiB0aGUgZWRpdG9yLlxyXG5cdCAqXHJcblx0ICogU2VlIGh0dHBzOi8vY2tlZGl0b3IuY29tL2RvY3MvY2tlZGl0b3I0L2xhdGVzdC9hcGkvQ0tFRElUT1JfY29uZmlnLmh0bWxcclxuXHQgKiB0byBsZWFybiBtb3JlLlxyXG5cdCAqL1xyXG5cdEBJbnB1dCgpIGNvbmZpZz86IENLRWRpdG9yNC5Db25maWc7XHJcblxyXG5cdC8qKlxyXG5cdCAqIENLRWRpdG9yIDQgc2NyaXB0IHVybCBhZGRyZXNzLiBTY3JpcHQgd2lsbCBiZSBsb2FkZWQgb25seSBpZiBDS0VESVRPUiBuYW1lc3BhY2UgaXMgbWlzc2luZy5cclxuXHQgKlxyXG5cdCAqIERlZmF1bHRzIHRvICdodHRwczovL2Nkbi5ja2VkaXRvci5jb20vNC4yMS4wL3N0YW5kYXJkLWFsbC9ja2VkaXRvci5qcydcclxuXHQgKi9cclxuXHRASW5wdXQoKSBlZGl0b3JVcmwgPSAnaHR0cHM6Ly9jZG4uY2tlZGl0b3IuY29tLzQuMjEuMC9zdGFuZGFyZC1hbGwvY2tlZGl0b3IuanMnO1xyXG5cclxuXHQvKipcclxuXHQgKiBUYWcgbmFtZSBvZiB0aGUgZWRpdG9yIGNvbXBvbmVudC5cclxuXHQgKlxyXG5cdCAqIFRoZSBkZWZhdWx0IHRhZyBpcyBgdGV4dGFyZWFgLlxyXG5cdCAqL1xyXG5cdEBJbnB1dCgpIHRhZ05hbWUgPSAndGV4dGFyZWEnO1xyXG5cclxuXHQvKipcclxuXHQgKiBUaGUgdHlwZSBvZiB0aGUgZWRpdG9yIGludGVyZmFjZS5cclxuXHQgKlxyXG5cdCAqIEJ5IGRlZmF1bHQgZWRpdG9yIGludGVyZmFjZSB3aWxsIGJlIGluaXRpYWxpemVkIGFzIGBjbGFzc2ljYCBlZGl0b3IuXHJcblx0ICogWW91IGNhbiBhbHNvIGNob29zZSB0byBjcmVhdGUgYW4gZWRpdG9yIHdpdGggYGlubGluZWAgaW50ZXJmYWNlIHR5cGUgaW5zdGVhZC5cclxuXHQgKlxyXG5cdCAqIFNlZSBodHRwczovL2NrZWRpdG9yLmNvbS9kb2NzL2NrZWRpdG9yNC9sYXRlc3QvZ3VpZGUvZGV2X3VpdHlwZXMuaHRtbFxyXG5cdCAqIGFuZCBodHRwczovL2NrZWRpdG9yLmNvbS9kb2NzL2NrZWRpdG9yNC9sYXRlc3QvZXhhbXBsZXMvZml4ZWR1aS5odG1sXHJcblx0ICogdG8gbGVhcm4gbW9yZS5cclxuXHQgKi9cclxuXHRASW5wdXQoKSB0eXBlOiBDS0VkaXRvcjQuRWRpdG9yVHlwZSA9IENLRWRpdG9yNC5FZGl0b3JUeXBlLkNMQVNTSUM7XHJcblxyXG5cdC8qKlxyXG5cdCAqIEtlZXBzIHRyYWNrIG9mIHRoZSBlZGl0b3IncyBkYXRhLlxyXG5cdCAqXHJcblx0ICogSXQncyBhbHNvIGRlY29yYXRlZCBhcyBhbiBpbnB1dCB3aGljaCBpcyB1c2VmdWwgd2hlbiBub3QgdXNpbmcgdGhlIG5nTW9kZWwuXHJcblx0ICpcclxuXHQgKiBTZWUgaHR0cHM6Ly9hbmd1bGFyLmlvL2FwaS9mb3Jtcy9OZ01vZGVsIHRvIGxlYXJuIG1vcmUuXHJcblx0ICovXHJcblx0QElucHV0KCkgc2V0IGRhdGEoIGRhdGE6IHN0cmluZyApIHtcclxuXHRcdGlmICggZGF0YSA9PT0gdGhpcy5fZGF0YSApIHtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICggdGhpcy5pbnN0YW5jZSApIHtcclxuXHRcdFx0dGhpcy5pbnN0YW5jZS5zZXREYXRhKCBkYXRhICk7XHJcblx0XHRcdC8vIERhdGEgbWF5IGJlIGNoYW5nZWQgYnkgQUNGLlxyXG5cdFx0XHR0aGlzLl9kYXRhID0gdGhpcy5pbnN0YW5jZS5nZXREYXRhKCk7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLl9kYXRhID0gZGF0YTtcclxuXHR9XHJcblxyXG5cdGdldCBkYXRhKCk6IHN0cmluZyB7XHJcblx0XHRyZXR1cm4gdGhpcy5fZGF0YTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIFdoZW4gc2V0IHRvIGB0cnVlYCwgdGhlIGVkaXRvciBiZWNvbWVzIHJlYWQtb25seS5cclxuXHQgKlxyXG5cdCAqIFNlZSBodHRwczovL2NrZWRpdG9yLmNvbS9kb2NzL2NrZWRpdG9yNC9sYXRlc3QvYXBpL0NLRURJVE9SX2VkaXRvci5odG1sI3Byb3BlcnR5LXJlYWRPbmx5XHJcblx0ICogdG8gbGVhcm4gbW9yZS5cclxuXHQgKi9cclxuXHRASW5wdXQoKSBzZXQgcmVhZE9ubHkoIGlzUmVhZE9ubHk6IGJvb2xlYW4gKSB7XHJcblx0XHRpZiAoIHRoaXMuaW5zdGFuY2UgKSB7XHJcblx0XHRcdHRoaXMuaW5zdGFuY2Uuc2V0UmVhZE9ubHkoIGlzUmVhZE9ubHkgKTtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIERlbGF5IHNldHRpbmcgcmVhZC1vbmx5IHN0YXRlIHVudGlsIGVkaXRvciBpbml0aWFsaXphdGlvbi5cclxuXHRcdHRoaXMuX3JlYWRPbmx5ID0gaXNSZWFkT25seTtcclxuXHR9XHJcblxyXG5cdGdldCByZWFkT25seSgpOiBib29sZWFuIHtcclxuXHRcdGlmICggdGhpcy5pbnN0YW5jZSApIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMuaW5zdGFuY2UucmVhZE9ubHk7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHRoaXMuX3JlYWRPbmx5O1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogRmlyZWQgd2hlbiB0aGUgQ0tFRElUT1IgaHR0cHM6Ly9ja2VkaXRvci5jb20vZG9jcy9ja2VkaXRvcjQvbGF0ZXN0L2FwaS9DS0VESVRPUi5odG1sIG5hbWVzcGFjZVxyXG5cdCAqIGlzIGxvYWRlZC4gSXQgb25seSB0cmlnZ2VycyBvbmNlLCBubyBtYXR0ZXIgaG93IG1hbnkgQ0tFZGl0b3IgNCBjb21wb25lbnRzIGFyZSBpbml0aWFsaXNlZC5cclxuXHQgKiBDYW4gYmUgdXNlZCBmb3IgY29udmVuaWVudCBjaGFuZ2VzIGluIHRoZSBuYW1lc3BhY2UsIGUuZy4gZm9yIGFkZGluZyBleHRlcm5hbCBwbHVnaW5zLlxyXG5cdCAqL1xyXG5cdEBPdXRwdXQoKSBuYW1lc3BhY2VMb2FkZWQgPSBuZXcgRXZlbnRFbWl0dGVyPENLRWRpdG9yNC5FdmVudEluZm8+KCk7XHJcblxyXG5cdC8qKlxyXG5cdCAqIEZpcmVzIHdoZW4gdGhlIGVkaXRvciBpcyByZWFkeS4gSXQgY29ycmVzcG9uZHMgd2l0aCB0aGUgYGVkaXRvciNpbnN0YW5jZVJlYWR5YFxyXG5cdCAqIGh0dHBzOi8vY2tlZGl0b3IuY29tL2RvY3MvY2tlZGl0b3I0L2xhdGVzdC9hcGkvQ0tFRElUT1JfZWRpdG9yLmh0bWwjZXZlbnQtaW5zdGFuY2VSZWFkeVxyXG5cdCAqIGV2ZW50LlxyXG5cdCAqL1xyXG5cdEBPdXRwdXQoKSByZWFkeSA9IG5ldyBFdmVudEVtaXR0ZXI8Q0tFZGl0b3I0LkV2ZW50SW5mbz4oKTtcclxuXHJcblx0LyoqXHJcblx0ICogRmlyZXMgd2hlbiB0aGUgZWRpdG9yIGRhdGEgaXMgbG9hZGVkLCBlLmcuIGFmdGVyIGNhbGxpbmcgc2V0RGF0YSgpXHJcblx0ICogaHR0cHM6Ly9ja2VkaXRvci5jb20vZG9jcy9ja2VkaXRvcjQvbGF0ZXN0L2FwaS9DS0VESVRPUl9lZGl0b3IuaHRtbCNtZXRob2Qtc2V0RGF0YVxyXG5cdCAqIGVkaXRvcidzIG1ldGhvZC4gSXQgY29ycmVzcG9uZHMgd2l0aCB0aGUgYGVkaXRvciNkYXRhUmVhZHlgXHJcblx0ICogaHR0cHM6Ly9ja2VkaXRvci5jb20vZG9jcy9ja2VkaXRvcjQvbGF0ZXN0L2FwaS9DS0VESVRPUl9lZGl0b3IuaHRtbCNldmVudC1kYXRhUmVhZHkgZXZlbnQuXHJcblx0ICovXHJcblx0QE91dHB1dCgpIGRhdGFSZWFkeSA9IG5ldyBFdmVudEVtaXR0ZXI8Q0tFZGl0b3I0LkV2ZW50SW5mbz4oKTtcclxuXHJcblx0LyoqXHJcblx0ICogRmlyZXMgd2hlbiB0aGUgY29udGVudCBvZiB0aGUgZWRpdG9yIGhhcyBjaGFuZ2VkLiBJdCBjb3JyZXNwb25kcyB3aXRoIHRoZSBgZWRpdG9yI2NoYW5nZWBcclxuXHQgKiBodHRwczovL2NrZWRpdG9yLmNvbS9kb2NzL2NrZWRpdG9yNC9sYXRlc3QvYXBpL0NLRURJVE9SX2VkaXRvci5odG1sI2V2ZW50LWNoYW5nZVxyXG5cdCAqIGV2ZW50LiBGb3IgcGVyZm9ybWFuY2UgcmVhc29ucyB0aGlzIGV2ZW50IG1heSBiZSBjYWxsZWQgZXZlbiB3aGVuIGRhdGEgZGlkbid0IHJlYWxseSBjaGFuZ2VkLlxyXG5cdCAqIFBsZWFzZSBub3RlIHRoYXQgdGhpcyBldmVudCB3aWxsIG9ubHkgYmUgZmlyZWQgd2hlbiBgdW5kb2AgcGx1Z2luIGlzIGxvYWRlZC4gSWYgeW91IG5lZWQgdG9cclxuXHQgKiBsaXN0ZW4gZm9yIGVkaXRvciBjaGFuZ2VzIChlLmcuIGZvciB0d28td2F5IGRhdGEgYmluZGluZyksIHVzZSBgZGF0YUNoYW5nZWAgZXZlbnQgaW5zdGVhZC5cclxuXHQgKi9cclxuXHRAT3V0cHV0KCkgY2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxDS0VkaXRvcjQuRXZlbnRJbmZvPigpO1xyXG5cclxuXHQvKipcclxuXHQgKiBGaXJlcyB3aGVuIHRoZSBjb250ZW50IG9mIHRoZSBlZGl0b3IgaGFzIGNoYW5nZWQuIEluIGNvbnRyYXN0IHRvIGBjaGFuZ2VgIC0gb25seSBlbWl0cyB3aGVuXHJcblx0ICogZGF0YSByZWFsbHkgY2hhbmdlZCB0aHVzIGNhbiBiZSBzdWNjZXNzZnVsbHkgdXNlZCB3aXRoIGBbZGF0YV1gIGFuZCB0d28gd2F5IGBbKGRhdGEpXWAgYmluZGluZy5cclxuXHQgKlxyXG5cdCAqIFNlZSBtb3JlOiBodHRwczovL2FuZ3VsYXIuaW8vZ3VpZGUvdGVtcGxhdGUtc3ludGF4I3R3by13YXktYmluZGluZy0tLVxyXG5cdCAqL1xyXG5cdEBPdXRwdXQoKSBkYXRhQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxDS0VkaXRvcjQuRXZlbnRJbmZvPigpO1xyXG5cclxuXHQvKipcclxuXHQgKiBGaXJlcyB3aGVuIHRoZSBuYXRpdmUgZHJhZ1N0YXJ0IGV2ZW50IG9jY3Vycy4gSXQgY29ycmVzcG9uZHMgd2l0aCB0aGUgYGVkaXRvciNkcmFnc3RhcnRgXHJcblx0ICogaHR0cHM6Ly9ja2VkaXRvci5jb20vZG9jcy9ja2VkaXRvcjQvbGF0ZXN0L2FwaS9DS0VESVRPUl9lZGl0b3IuaHRtbCNldmVudC1kcmFnc3RhcnRcclxuXHQgKiBldmVudC5cclxuXHQgKi9cclxuXHRAT3V0cHV0KCkgZHJhZ1N0YXJ0ID0gbmV3IEV2ZW50RW1pdHRlcjxDS0VkaXRvcjQuRXZlbnRJbmZvPigpO1xyXG5cclxuXHQvKipcclxuXHQgKiBGaXJlcyB3aGVuIHRoZSBuYXRpdmUgZHJhZ0VuZCBldmVudCBvY2N1cnMuIEl0IGNvcnJlc3BvbmRzIHdpdGggdGhlIGBlZGl0b3IjZHJhZ2VuZGBcclxuXHQgKiBodHRwczovL2NrZWRpdG9yLmNvbS9kb2NzL2NrZWRpdG9yNC9sYXRlc3QvYXBpL0NLRURJVE9SX2VkaXRvci5odG1sI2V2ZW50LWRyYWdlbmRcclxuXHQgKiBldmVudC5cclxuXHQgKi9cclxuXHRAT3V0cHV0KCkgZHJhZ0VuZCA9IG5ldyBFdmVudEVtaXR0ZXI8Q0tFZGl0b3I0LkV2ZW50SW5mbz4oKTtcclxuXHJcblx0LyoqXHJcblx0ICogRmlyZXMgd2hlbiB0aGUgbmF0aXZlIGRyb3AgZXZlbnQgb2NjdXJzLiBJdCBjb3JyZXNwb25kcyB3aXRoIHRoZSBgZWRpdG9yI2Ryb3BgXHJcblx0ICogaHR0cHM6Ly9ja2VkaXRvci5jb20vZG9jcy9ja2VkaXRvcjQvbGF0ZXN0L2FwaS9DS0VESVRPUl9lZGl0b3IuaHRtbCNldmVudC1kcm9wXHJcblx0ICogZXZlbnQuXHJcblx0ICovXHJcblx0QE91dHB1dCgpIGRyb3AgPSBuZXcgRXZlbnRFbWl0dGVyPENLRWRpdG9yNC5FdmVudEluZm8+KCk7XHJcblxyXG5cdC8qKlxyXG5cdCAqIEZpcmVzIHdoZW4gdGhlIGZpbGUgbG9hZGVyIHJlc3BvbnNlIGlzIHJlY2VpdmVkLiBJdCBjb3JyZXNwb25kcyB3aXRoIHRoZSBgZWRpdG9yI2ZpbGVVcGxvYWRSZXNwb25zZWBcclxuXHQgKiBodHRwczovL2NrZWRpdG9yLmNvbS9kb2NzL2NrZWRpdG9yNC9sYXRlc3QvYXBpL0NLRURJVE9SX2VkaXRvci5odG1sI2V2ZW50LWZpbGVVcGxvYWRSZXNwb25zZVxyXG5cdCAqIGV2ZW50LlxyXG5cdCAqL1xyXG5cdEBPdXRwdXQoKSBmaWxlVXBsb2FkUmVzcG9uc2UgPSBuZXcgRXZlbnRFbWl0dGVyPENLRWRpdG9yNC5FdmVudEluZm8+KCk7XHJcblxyXG5cdC8qKlxyXG5cdCAqIEZpcmVzIHdoZW4gdGhlIGZpbGUgbG9hZGVyIHNob3VsZCBzZW5kIFhIUi4gSXQgY29ycmVzcG9uZHMgd2l0aCB0aGUgYGVkaXRvciNmaWxlVXBsb2FkUmVxdWVzdGBcclxuXHQgKiBodHRwczovL2NrZWRpdG9yLmNvbS9kb2NzL2NrZWRpdG9yNC9sYXRlc3QvYXBpL0NLRURJVE9SX2VkaXRvci5odG1sI2V2ZW50LWZpbGVVcGxvYWRSZXF1ZXN0XHJcblx0ICogZXZlbnQuXHJcblx0ICovXHJcblx0QE91dHB1dCgpIGZpbGVVcGxvYWRSZXF1ZXN0ID0gbmV3IEV2ZW50RW1pdHRlcjxDS0VkaXRvcjQuRXZlbnRJbmZvPigpO1xyXG5cclxuXHQvKipcclxuXHQgKiBGaXJlcyB3aGVuIHRoZSBlZGl0aW5nIGFyZWEgb2YgdGhlIGVkaXRvciBpcyBmb2N1c2VkLiBJdCBjb3JyZXNwb25kcyB3aXRoIHRoZSBgZWRpdG9yI2ZvY3VzYFxyXG5cdCAqIGh0dHBzOi8vY2tlZGl0b3IuY29tL2RvY3MvY2tlZGl0b3I0L2xhdGVzdC9hcGkvQ0tFRElUT1JfZWRpdG9yLmh0bWwjZXZlbnQtZm9jdXNcclxuXHQgKiBldmVudC5cclxuXHQgKi9cclxuXHRAT3V0cHV0KCkgZm9jdXMgPSBuZXcgRXZlbnRFbWl0dGVyPENLRWRpdG9yNC5FdmVudEluZm8+KCk7XHJcblxyXG5cdC8qKlxyXG5cdCAqIEZpcmVzIGFmdGVyIHRoZSB1c2VyIGluaXRpYXRlZCBhIHBhc3RlIGFjdGlvbiwgYnV0IGJlZm9yZSB0aGUgZGF0YSBpcyBpbnNlcnRlZC5cclxuXHQgKiBJdCBjb3JyZXNwb25kcyB3aXRoIHRoZSBgZWRpdG9yI3Bhc3RlYFxyXG5cdCAqIGh0dHBzOi8vY2tlZGl0b3IuY29tL2RvY3MvY2tlZGl0b3I0L2xhdGVzdC9hcGkvQ0tFRElUT1JfZWRpdG9yLmh0bWwjZXZlbnQtcGFzdGVcclxuXHQgKiBldmVudC5cclxuXHQgKi9cclxuXHRAT3V0cHV0KCkgcGFzdGUgPSBuZXcgRXZlbnRFbWl0dGVyPENLRWRpdG9yNC5FdmVudEluZm8+KCk7XHJcblxyXG5cdC8qKlxyXG5cdCAqIEZpcmVzIGFmdGVyIHRoZSBgcGFzdGVgIGV2ZW50IGlmIGNvbnRlbnQgd2FzIG1vZGlmaWVkLiBJdCBjb3JyZXNwb25kcyB3aXRoIHRoZSBgZWRpdG9yI2FmdGVyUGFzdGVgXHJcblx0ICogaHR0cHM6Ly9ja2VkaXRvci5jb20vZG9jcy9ja2VkaXRvcjQvbGF0ZXN0L2FwaS9DS0VESVRPUl9lZGl0b3IuaHRtbCNldmVudC1hZnRlclBhc3RlXHJcblx0ICogZXZlbnQuXHJcblx0ICovXHJcblx0QE91dHB1dCgpIGFmdGVyUGFzdGUgPSBuZXcgRXZlbnRFbWl0dGVyPENLRWRpdG9yNC5FdmVudEluZm8+KCk7XHJcblxyXG5cdC8qKlxyXG5cdCAqIEZpcmVzIHdoZW4gdGhlIGVkaXRpbmcgdmlldyBvZiB0aGUgZWRpdG9yIGlzIGJsdXJyZWQuIEl0IGNvcnJlc3BvbmRzIHdpdGggdGhlIGBlZGl0b3IjYmx1cmBcclxuXHQgKiBodHRwczovL2NrZWRpdG9yLmNvbS9kb2NzL2NrZWRpdG9yNC9sYXRlc3QvYXBpL0NLRURJVE9SX2VkaXRvci5odG1sI2V2ZW50LWJsdXJcclxuXHQgKiBldmVudC5cclxuXHQgKi9cclxuXHRAT3V0cHV0KCkgYmx1ciA9IG5ldyBFdmVudEVtaXR0ZXI8Q0tFZGl0b3I0LkV2ZW50SW5mbz4oKTtcclxuXHJcblx0LyoqXHJcblx0ICogQSBjYWxsYmFjayBleGVjdXRlZCB3aGVuIHRoZSBjb250ZW50IG9mIHRoZSBlZGl0b3IgY2hhbmdlcy4gUGFydCBvZiB0aGVcclxuXHQgKiBgQ29udHJvbFZhbHVlQWNjZXNzb3JgIChodHRwczovL2FuZ3VsYXIuaW8vYXBpL2Zvcm1zL0NvbnRyb2xWYWx1ZUFjY2Vzc29yKSBpbnRlcmZhY2UuXHJcblx0ICpcclxuXHQgKiBOb3RlOiBVbnNldCB1bmxlc3MgdGhlIGNvbXBvbmVudCB1c2VzIHRoZSBgbmdNb2RlbGAuXHJcblx0ICovXHJcblx0b25DaGFuZ2U/OiAoIGRhdGE6IHN0cmluZyApID0+IHZvaWQ7XHJcblxyXG5cdC8qKlxyXG5cdCAqIEEgY2FsbGJhY2sgZXhlY3V0ZWQgd2hlbiB0aGUgZWRpdG9yIGhhcyBiZWVuIGJsdXJyZWQuIFBhcnQgb2YgdGhlXHJcblx0ICogYENvbnRyb2xWYWx1ZUFjY2Vzc29yYCAoaHR0cHM6Ly9hbmd1bGFyLmlvL2FwaS9mb3Jtcy9Db250cm9sVmFsdWVBY2Nlc3NvcikgaW50ZXJmYWNlLlxyXG5cdCAqXHJcblx0ICogTm90ZTogVW5zZXQgdW5sZXNzIHRoZSBjb21wb25lbnQgdXNlcyB0aGUgYG5nTW9kZWxgLlxyXG5cdCAqL1xyXG5cdG9uVG91Y2hlZD86ICgpID0+IHZvaWQ7XHJcblxyXG5cdC8qKlxyXG5cdCAqIFRoZSBpbnN0YW5jZSBvZiB0aGUgZWRpdG9yIGNyZWF0ZWQgYnkgdGhpcyBjb21wb25lbnQuXHJcblx0ICovXHJcblx0aW5zdGFuY2U6IGFueTtcclxuXHJcblx0LyoqXHJcblx0ICogSWYgdGhlIGNvbXBvbmVudCBpcyByZWFk4oCTb25seSBiZWZvcmUgdGhlIGVkaXRvciBpbnN0YW5jZSBpcyBjcmVhdGVkLCBpdCByZW1lbWJlcnMgdGhhdCBzdGF0ZSxcclxuXHQgKiBzbyB0aGUgZWRpdG9yIGNhbiBiZWNvbWUgcmVhZOKAk29ubHkgb25jZSBpdCBpcyByZWFkeS5cclxuXHQgKi9cclxuXHRwcml2YXRlIF9yZWFkT25seTogYm9vbGVhbiA9IG51bGw7XHJcblxyXG5cdHByaXZhdGUgX2RhdGE6IHN0cmluZyA9IG51bGw7XHJcblxyXG5cdHByaXZhdGUgX2Rlc3Ryb3llZDogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuXHRjb25zdHJ1Y3RvciggcHJpdmF0ZSBlbGVtZW50UmVmOiBFbGVtZW50UmVmLCBwcml2YXRlIG5nWm9uZTogTmdab25lICkge31cclxuXHJcblx0bmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xyXG5cdFx0Z2V0RWRpdG9yTmFtZXNwYWNlKCB0aGlzLmVkaXRvclVybCwgbmFtZXNwYWNlID0+IHtcclxuXHRcdFx0dGhpcy5uYW1lc3BhY2VMb2FkZWQuZW1pdCggbmFtZXNwYWNlICk7XHJcblx0XHR9ICkudGhlbiggKCkgPT4ge1xyXG5cdFx0XHQvLyBDaGVjayBpZiBjb21wb25lbnQgaW5zdGFuY2Ugd2FzIGRlc3Ryb3llZCBiZWZvcmUgYG5nQWZ0ZXJWaWV3SW5pdGAgY2FsbCAoIzExMCkuXHJcblx0XHRcdC8vIEhlcmUsIGB0aGlzLmluc3RhbmNlYCBpcyBzdGlsbCBub3QgaW5pdGlhbGl6ZWQgYW5kIHNvIGFkZGl0aW9uYWwgZmxhZyBpcyBuZWVkZWQuXHJcblx0XHRcdGlmICggdGhpcy5fZGVzdHJveWVkICkge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoIHRoaXMuY3JlYXRlRWRpdG9yLmJpbmQoIHRoaXMgKSApO1xyXG5cdFx0fSApLmNhdGNoKCB3aW5kb3cuY29uc29sZS5lcnJvciApO1xyXG5cdH1cclxuXHJcblx0bmdPbkRlc3Ryb3koKTogdm9pZCB7XHJcblx0XHR0aGlzLl9kZXN0cm95ZWQgPSB0cnVlO1xyXG5cclxuXHRcdHRoaXMubmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCAoKSA9PiB7XHJcblx0XHRcdGlmICggdGhpcy5pbnN0YW5jZSApIHtcclxuXHRcdFx0XHR0aGlzLmluc3RhbmNlLmRlc3Ryb3koKTtcclxuXHRcdFx0XHR0aGlzLmluc3RhbmNlID0gbnVsbDtcclxuXHRcdFx0fVxyXG5cdFx0fSApO1xyXG5cdH1cclxuXHJcblx0d3JpdGVWYWx1ZSggdmFsdWU6IHN0cmluZyApOiB2b2lkIHtcclxuXHRcdHRoaXMuZGF0YSA9IHZhbHVlO1xyXG5cdH1cclxuXHJcblx0cmVnaXN0ZXJPbkNoYW5nZSggY2FsbGJhY2s6ICggZGF0YTogc3RyaW5nICkgPT4gdm9pZCApOiB2b2lkIHtcclxuXHRcdHRoaXMub25DaGFuZ2UgPSBjYWxsYmFjaztcclxuXHR9XHJcblxyXG5cdHJlZ2lzdGVyT25Ub3VjaGVkKCBjYWxsYmFjazogKCkgPT4gdm9pZCApOiB2b2lkIHtcclxuXHRcdHRoaXMub25Ub3VjaGVkID0gY2FsbGJhY2s7XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIGNyZWF0ZUVkaXRvcigpOiB2b2lkIHtcclxuXHRcdGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCB0aGlzLnRhZ05hbWUgKTtcclxuXHRcdHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmFwcGVuZENoaWxkKCBlbGVtZW50ICk7XHJcblxyXG5cdFx0Y29uc3QgdXNlckluc3RhbmNlUmVhZHlDYWxsYmFjayA9IHRoaXMuY29uZmlnPy5vbj8uaW5zdGFuY2VSZWFkeTtcclxuXHRcdGNvbnN0IGRlZmF1bHRDb25maWc6IFBhcnRpYWw8Q0tFZGl0b3I0LkNvbmZpZz4gPSB7XHJcblx0XHRcdGRlbGF5SWZEZXRhY2hlZDogdHJ1ZVxyXG5cdFx0fTtcclxuXHRcdGNvbnN0IGNvbmZpZzogUGFydGlhbDxDS0VkaXRvcjQuQ29uZmlnPiA9IHsgLi4uZGVmYXVsdENvbmZpZywgLi4udGhpcy5jb25maWcgfTtcclxuXHJcblx0XHRpZiAoIHR5cGVvZiBjb25maWcub24gPT09ICd1bmRlZmluZWQnICkge1xyXG5cdFx0XHRjb25maWcub24gPSB7fTtcclxuXHRcdH1cclxuXHJcblx0XHRjb25maWcub24uaW5zdGFuY2VSZWFkeSA9IGV2dCA9PiB7XHJcblx0XHRcdGNvbnN0IGVkaXRvciA9IGV2dC5lZGl0b3I7XHJcblxyXG5cdFx0XHR0aGlzLmluc3RhbmNlID0gZWRpdG9yO1xyXG5cclxuXHRcdFx0Ly8gUmVhZCBvbmx5IHN0YXRlIG1heSBjaGFuZ2UgZHVyaW5nIGluc3RhbmNlIGluaXRpYWxpemF0aW9uLlxyXG5cdFx0XHR0aGlzLnJlYWRPbmx5ID0gdGhpcy5fcmVhZE9ubHkgIT09IG51bGwgPyB0aGlzLl9yZWFkT25seSA6IHRoaXMuaW5zdGFuY2UucmVhZE9ubHk7XHJcblxyXG5cdFx0XHR0aGlzLnN1YnNjcmliZSggdGhpcy5pbnN0YW5jZSApO1xyXG5cclxuXHRcdFx0Y29uc3QgdW5kbyA9IGVkaXRvci51bmRvTWFuYWdlcjtcclxuXHJcblx0XHRcdGlmICggdGhpcy5kYXRhICE9PSBudWxsICkge1xyXG5cdFx0XHRcdHVuZG8gJiYgdW5kby5sb2NrKCk7XHJcblxyXG5cdFx0XHRcdGVkaXRvci5zZXREYXRhKCB0aGlzLmRhdGEsIHsgY2FsbGJhY2s6ICgpID0+IHtcclxuXHRcdFx0XHRcdC8vIExvY2tpbmcgdW5kb01hbmFnZXIgcHJldmVudHMgJ2NoYW5nZScgZXZlbnQuXHJcblx0XHRcdFx0XHQvLyBUcmlnZ2VyIGl0IG1hbnVhbGx5IHRvIHVwZGF0ZWQgYm91bmQgZGF0YS5cclxuXHRcdFx0XHRcdGlmICggdGhpcy5kYXRhICE9PSBlZGl0b3IuZ2V0RGF0YSgpICkge1xyXG5cdFx0XHRcdFx0XHR1bmRvID8gZWRpdG9yLmZpcmUoICdjaGFuZ2UnICkgOiBlZGl0b3IuZmlyZSggJ2RhdGFSZWFkeScgKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHVuZG8gJiYgdW5kby51bmxvY2soKTtcclxuXHJcblx0XHRcdFx0XHR0aGlzLm5nWm9uZS5ydW4oICgpID0+IHtcclxuXHRcdFx0XHRcdFx0aWYgKCB0eXBlb2YgdXNlckluc3RhbmNlUmVhZHlDYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJyApIHtcclxuXHRcdFx0XHRcdFx0XHR1c2VySW5zdGFuY2VSZWFkeUNhbGxiYWNrKCBldnQgKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0dGhpcy5yZWFkeS5lbWl0KCBldnQgKTtcclxuXHRcdFx0XHRcdH0gKTtcclxuXHRcdFx0XHR9IH0gKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR0aGlzLm5nWm9uZS5ydW4oICgpID0+IHtcclxuXHRcdFx0XHRcdGlmICggdHlwZW9mIHVzZXJJbnN0YW5jZVJlYWR5Q2FsbGJhY2sgPT09ICdmdW5jdGlvbicgKSB7XHJcblx0XHRcdFx0XHRcdHVzZXJJbnN0YW5jZVJlYWR5Q2FsbGJhY2soIGV2dCApO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdHRoaXMucmVhZHkuZW1pdCggZXZ0ICk7XHJcblx0XHRcdFx0fSApO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCB0aGlzLnR5cGUgPT09IENLRWRpdG9yNC5FZGl0b3JUeXBlLklOTElORSApIHtcclxuXHRcdFx0Q0tFRElUT1IuaW5saW5lKCBlbGVtZW50LCBjb25maWcgKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdENLRURJVE9SLnJlcGxhY2UoIGVsZW1lbnQsIGNvbmZpZyApO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBzdWJzY3JpYmUoIGVkaXRvcjogYW55ICk6IHZvaWQge1xyXG5cdFx0ZWRpdG9yLm9uKCAnZm9jdXMnLCBldnQgPT4ge1xyXG5cdFx0XHR0aGlzLm5nWm9uZS5ydW4oICgpID0+IHtcclxuXHRcdFx0XHR0aGlzLmZvY3VzLmVtaXQoIGV2dCApO1xyXG5cdFx0XHR9ICk7XHJcblx0XHR9ICk7XHJcblxyXG5cdFx0ZWRpdG9yLm9uKCAncGFzdGUnLCBldnQgPT4ge1xyXG5cdFx0XHR0aGlzLm5nWm9uZS5ydW4oICgpID0+IHtcclxuXHRcdFx0XHR0aGlzLnBhc3RlLmVtaXQoIGV2dCApO1xyXG5cdFx0XHR9ICk7XHJcblx0XHR9ICk7XHJcblxyXG5cdFx0ZWRpdG9yLm9uKCAnYWZ0ZXJQYXN0ZScsIGV2dCA9PiB7XHJcblx0XHRcdHRoaXMubmdab25lLnJ1biggKCkgPT4ge1xyXG5cdFx0XHRcdHRoaXMuYWZ0ZXJQYXN0ZS5lbWl0KCBldnQgKTtcclxuXHRcdFx0fSApO1xyXG5cdFx0fSApO1xyXG5cclxuXHRcdGVkaXRvci5vbiggJ2RyYWdlbmQnLCBldnQgPT4ge1xyXG5cdFx0XHR0aGlzLm5nWm9uZS5ydW4oICgpID0+IHtcclxuXHRcdFx0XHR0aGlzLmRyYWdFbmQuZW1pdCggZXZ0ICk7XHJcblx0XHRcdH0gKTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdGVkaXRvci5vbiggJ2RyYWdzdGFydCcsIGV2dCA9PiB7XHJcblx0XHRcdHRoaXMubmdab25lLnJ1biggKCkgPT4ge1xyXG5cdFx0XHRcdHRoaXMuZHJhZ1N0YXJ0LmVtaXQoIGV2dCApO1xyXG5cdFx0XHR9ICk7XHJcblx0XHR9ICk7XHJcblxyXG5cdFx0ZWRpdG9yLm9uKCAnZHJvcCcsIGV2dCA9PiB7XHJcblx0XHRcdHRoaXMubmdab25lLnJ1biggKCkgPT4ge1xyXG5cdFx0XHRcdHRoaXMuZHJvcC5lbWl0KCBldnQgKTtcclxuXHRcdFx0fSApO1xyXG5cdFx0fSApO1xyXG5cclxuXHRcdGVkaXRvci5vbiggJ2ZpbGVVcGxvYWRSZXF1ZXN0JywgZXZ0ID0+IHtcclxuXHRcdFx0dGhpcy5uZ1pvbmUucnVuKCAoKSA9PiB7XHJcblx0XHRcdFx0dGhpcy5maWxlVXBsb2FkUmVxdWVzdC5lbWl0KGV2dCk7XHJcblx0XHRcdH0gKTtcclxuXHRcdH0gKTtcclxuXHJcblx0XHRlZGl0b3Iub24oICdmaWxlVXBsb2FkUmVzcG9uc2UnLCBldnQgPT4ge1xyXG5cdFx0XHR0aGlzLm5nWm9uZS5ydW4oICgpID0+IHtcclxuXHRcdFx0XHR0aGlzLmZpbGVVcGxvYWRSZXNwb25zZS5lbWl0KGV2dCk7XHJcblx0XHRcdH0gKTtcclxuXHRcdH0gKTtcclxuXHJcblx0XHRlZGl0b3Iub24oICdibHVyJywgZXZ0ID0+IHtcclxuXHRcdFx0dGhpcy5uZ1pvbmUucnVuKCAoKSA9PiB7XHJcblx0XHRcdFx0aWYgKCB0aGlzLm9uVG91Y2hlZCApIHtcclxuXHRcdFx0XHRcdHRoaXMub25Ub3VjaGVkKCk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHR0aGlzLmJsdXIuZW1pdCggZXZ0ICk7XHJcblx0XHRcdH0gKTtcclxuXHRcdH0gKTtcclxuXHJcblx0XHRlZGl0b3Iub24oICdkYXRhUmVhZHknLCB0aGlzLnByb3BhZ2F0ZUNoYW5nZSwgdGhpcyApO1xyXG5cclxuXHRcdGlmICggdGhpcy5pbnN0YW5jZS51bmRvTWFuYWdlciApIHtcclxuXHRcdFx0ZWRpdG9yLm9uKCAnY2hhbmdlJywgdGhpcy5wcm9wYWdhdGVDaGFuZ2UsIHRoaXMgKTtcclxuXHRcdH1cclxuXHRcdC8vIElmICd1bmRvJyBwbHVnaW4gaXMgbm90IGxvYWRlZCwgbGlzdGVuIHRvICdzZWxlY3Rpb25DaGVjaycgZXZlbnQgaW5zdGVhZC4gKCM1NCkuXHJcblx0XHRlbHNlIHtcclxuXHRcdFx0ZWRpdG9yLm9uKCAnc2VsZWN0aW9uQ2hlY2snLCB0aGlzLnByb3BhZ2F0ZUNoYW5nZSwgdGhpcyApO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBwcm9wYWdhdGVDaGFuZ2UoIGV2ZW50OiBhbnkgKTogdm9pZCB7XHJcblx0XHR0aGlzLm5nWm9uZS5ydW4oICgpID0+IHtcclxuXHRcdFx0Y29uc3QgbmV3RGF0YSA9IHRoaXMuaW5zdGFuY2UuZ2V0RGF0YSgpO1xyXG5cclxuXHRcdFx0aWYgKCBldmVudC5uYW1lID09PSAnY2hhbmdlJyApIHtcclxuXHRcdFx0XHR0aGlzLmNoYW5nZS5lbWl0KCBldmVudCApO1xyXG5cdFx0XHR9IGVsc2UgaWYgKCBldmVudC5uYW1lID09PSAnZGF0YVJlYWR5JyApIHtcclxuXHRcdFx0XHR0aGlzLmRhdGFSZWFkeS5lbWl0KCBldmVudCApO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoIG5ld0RhdGEgPT09IHRoaXMuZGF0YSApIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuX2RhdGEgPSBuZXdEYXRhO1xyXG5cdFx0XHR0aGlzLmRhdGFDaGFuZ2UuZW1pdCggbmV3RGF0YSApO1xyXG5cclxuXHRcdFx0aWYgKCB0aGlzLm9uQ2hhbmdlICkge1xyXG5cdFx0XHRcdHRoaXMub25DaGFuZ2UoIG5ld0RhdGEgKTtcclxuXHRcdFx0fVxyXG5cdFx0fSApO1xyXG5cdH1cclxuXHJcbn1cclxuIl19