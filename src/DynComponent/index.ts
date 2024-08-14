import BaseComponent from "./BaseComponent";

const MODEL_STACKS: WebComponent[] = [];
class WebComponent extends BaseComponent {
	// open?: boolean; // 是否打开
	// modal: boolean = false; // 是否为模态对话框
	// draggable: boolean = false; // 是否可拖拽
	// closeable: boolean = false; // 是否可关闭
	// width: string = "auto"; // 对话框宽度
	// height: string = "auto"; // 对话框高度
	// minWidth: string = "auto"; // 对话框最小宽度
	// minHeight: string = "auto"; // 对话框最小高度

	private dialog: HTMLDialogElement;
	private dialogHeader: HTMLElement;
	private isDragging: boolean = false;
	private dragInfo: { startLeft: number, startTop: number, startClentX: number, startClentY: number } = { startLeft: 0, startTop: 0, startClentX: 0, startClentY: 0 };

	private boundMouseDown: (event: MouseEvent) => void;
	private boundMouseMove: (event: MouseEvent) => void;
	private boundMouseUp: () => void;
	private boundKeydown: (e: KeyboardEvent) => void;
	private boundFitDialogPosition: (e?: Event) => void;
	static get modelStatcks() { return MODEL_STACKS; }
	static get observedAttributes(): string[] {
		return [/*"open", "modal", "draggable", "closeable", "width", "min-width", "height", "min-height"*/];
	}
	constructor() {
		super();

		let container = document.createElement("div");
		container.classList.add("dyn-component--web-components", "dyn-dialog");
		container.innerHTML = `<dialog>
			<div class="header">
				<slot	name="drag-handle">
					<svg class="svg-icon drag-handle" height="200" viewBox="0 0 1024 1024" width="200" xmlns="http://www.w3.org/2000/svg"><path d="m469.333333 256a85.333333 85.333333 0 1 1 -85.333333-85.333333 85.333333 85.333333 0 0 1 85.333333 85.333333zm-85.333333 170.666667a85.333333 85.333333 0 1 0 85.333333 85.333333 85.333333 85.333333 0 0 0 -85.333333-85.333333zm0 256a85.333333 85.333333 0 1 0 85.333333 85.333333 85.333333 85.333333 0 0 0 -85.333333-85.333333zm256-341.333334a85.333333 85.333333 0 1 0 -85.333333-85.333333 85.333333 85.333333 0 0 0 85.333333 85.333333zm0 85.333334a85.333333 85.333333 0 1 0 85.333333 85.333333 85.333333 85.333333 0 0 0 -85.333333-85.333333zm0 256a85.333333 85.333333 0 1 0 85.333333 85.333333 85.333333 85.333333 0 0 0 -85.333333-85.333333z"/></svg>
				</slot>
				<slot name="header"></slot>
				<svg class="svg-icon close hidden" t="1722240617848" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4245" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200"><path d="M557.312 513.248l265.28-263.904c12.544-12.48 12.608-32.704 0.128-45.248-12.512-12.576-32.704-12.608-45.248-0.128L512.128 467.904l-263.04-263.84c-12.448-12.48-32.704-12.544-45.248-0.064-12.512 12.48-12.544 32.736-0.064 45.28l262.976 263.776L201.6 776.8c-12.544 12.48-12.608 32.704-0.128 45.248a31.937 31.937 0 0 0 22.688 9.44c8.16 0 16.32-3.104 22.56-9.312l265.216-263.808 265.44 266.24c6.24 6.272 14.432 9.408 22.656 9.408a31.94 31.94 0 0 0 22.592-9.344c12.512-12.48 12.544-32.704 0.064-45.248L557.312 513.248z" fill="" p-id="4246"></path></svg>
			</div>
			<div class="body">
				<slot></slot>
			</div>
			<div class="footer">
			 	<slot name="footer"></slot>
			</div>
		</dialog>`;
		this.shadowRoot!.appendChild(container);
		this.dialog = this.shadowRoot!.querySelector('dialog') as HTMLDialogElement;;
		this.dialogHeader = this.shadowRoot!.querySelector('.header') as HTMLElement;
		this.shadowRoot!.querySelector('.close')?.addEventListener('click', () => {
			this.close();
		})

		// Binding event handlers to 'this' instance
		this.boundMouseDown = this.onMouseDown.bind(this);
		this.boundMouseMove = this.onMouseMove.bind(this);
		this.boundMouseUp = this.onMouseUp.bind(this);
		this.boundKeydown = this.onKeydown.bind(this);
		this.boundFitDialogPosition = this.fitDialogPosition.bind(this);
		window.addEventListener('keydown', this.boundKeydown);
	}
	// open
	set open(value: boolean) {
		if (value) {
			this.setAttribute('open', '');
			if (this._isConnected) {
				setTimeout(() => {
					this.checkShouldShowDilaog()
				})
			}
		} else {
			this.removeAttribute('open');
		}
	}
	get open() {
		return this.hasAttribute('open');
	}
	// modal
	set modal(value: boolean) {
		if (value) {
			this.setAttribute('modal', '');
		} else {
			this.removeAttribute('modal');
		}
	}
	get modal() {
		return this.hasAttribute('modal');
	}
	// draggable
	set draggable(value: boolean) {
		if (value && !this.fullscreen) {
			this.setAttribute('draggable', '');
			this.dialog.classList.add('draggable');
			this.initDraggable();
		} else {
			this.removeAttribute('draggable');
			this.dialog.classList.remove('draggable');
		}
	}
	get draggable() {
		return this.hasAttribute('draggable') && !this.fullscreen;
	}
	// closeable
	set closeable(value: boolean) {
		if (value) {
			this.setAttribute('closeable', '');
			this.shadowRoot!.querySelector('.close')?.classList.remove('hidden');
		} else {
			this.removeAttribute('closeable');
			this.shadowRoot!.querySelector('.close')?.classList.add('hidden');
		}
	}
	get closeable() {
		return this.hasAttribute('closeable');
	}
	// fullscreen
	set fullscreen(value: boolean) {
		if (value) {
			this.setAttribute('fullscreen', '');
			this.dialog.classList.add('fullscreen');
		} else {
			this.removeAttribute('fullscreen');
			this.dialog.classList.remove('fullscreen');
		}
	}
	get fullscreen() {
		return this.dialog.classList.contains('fullscreen');
	}
	// width
	set width(value: string) {
		this.dialog.style.width = value || 'auto';
	}
	//	minWidth
	set minWidth(value: string) {
		this.dialog.style.minWidth = value || 'auto';
	}
	// height
	set height(value: string) {
		this.dialog.style.height = value || 'auto';
	}
	// minHeight
	set minHeight(value: string) {
		this.dialog.style.minHeight = value || 'auto';
	}

	connectedCallback() {
		super.connectedCallback();

		this.open = this.hasAttribute('open');
		this.fullscreen = this.hasAttribute('fullscreen');
		this.closeable = this.hasAttribute('closeable');
		this.draggable = this.hasAttribute('draggable');
		this.modal = this.hasAttribute('modal');
		this.width = this.getAttribute('width') || 'auto';
		this.minWidth = this.getAttribute('minWidth') || 'auto';
		this.height = this.getAttribute('height') || 'auto';
		this.minHeight = this.getAttribute('minHeight') || 'auto';

		window.addEventListener('resize', this.boundFitDialogPosition);
		this.checkShouldShowDilaog()
	}


	disconnectedCallback() {
		this.dialogHeader.removeEventListener('mousedown', this.boundMouseDown);
		window.removeEventListener('mousemove', this.boundMouseMove);
		window.removeEventListener('mouseup', this.boundMouseUp);
		window.removeEventListener('keydown', this.boundKeydown);
		window.removeEventListener('resize', this.boundFitDialogPosition);
	}


	checkShouldShowDilaog() {
		if (this.open) {
			if (this.modal) {
				this.showModal();
			} else {
				this.show();
			}
		}
		this.boundFitDialogPosition();
	}

	// 模态对话框
	showModal() {
		WebComponent.modelStatcks.push(this);
		this.dialog.showModal();
	}
	// 非模态对话框
	show() {
		WebComponent.modelStatcks.push(this);
		this.dialog.show();
	}
	// 关闭
	close() {
		this.dialog.close();
		this.dialog.removeAttribute("open");
		WebComponent.modelStatcks.splice(WebComponent.modelStatcks.indexOf(this), 1);
		// 关闭事件
		this.dispatchEvent(new CustomEvent('close', {
			bubbles: true
		}))
	}

	private onKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && WebComponent.modelStatcks.length > 0) {
			WebComponent.modelStatcks[WebComponent.modelStatcks.length - 1].close();
			WebComponent.modelStatcks.splice(WebComponent.modelStatcks.length - 1, 1);
		}
	}

	private initDraggable() {
		this.dialogHeader.addEventListener('mousedown', this.boundMouseDown);
		window.addEventListener('mousemove', this.boundMouseMove);
		window.addEventListener('mouseup', this.boundMouseUp);
	}

	private onMouseDown(event: MouseEvent) {
		if (!this.draggable) { return; }

		this.isDragging = true;
		// 如果拖拽过，则禁用默认自适应dialog位置功能
		window.removeEventListener('resize', this.boundFitDialogPosition);
		const rect = this.dialog.getBoundingClientRect();
		Object.assign(this.dragInfo, {
			startLeft: rect.left,
			startTop: rect.top,
			startClentX: event.clientX,
			startClentY: event.clientY,
		});
		event.preventDefault();
	}

	private onMouseMove(event: MouseEvent) {
		if (this.isDragging) {
			this.dialog.style.left = `${event.clientX - this.dragInfo.startClentX + this.dragInfo.startLeft}px`;
			this.dialog.style.top = `${event.clientY - this.dragInfo.startClentY + this.dragInfo.startTop}px`;
		}
	}

	private onMouseUp() {
		this.isDragging = false;

		const rect = this.dialog.getBoundingClientRect();
		if (rect.top < 0) {
			this.dialog.style.top = `${parseInt(this.dialog.style.top || '0') - rect.top}px`;
		}
		if (rect.top + rect.height > document.documentElement.clientHeight) {
			this.dialog.style.top = `${parseInt(this.dialog.style.top || '0') - (rect.top + rect.height - document.documentElement.clientHeight)}px`;
		}
		if (rect.left < 0) {
			this.dialog.style.left = `${parseInt(this.dialog.style.left || '0') - rect.left}px`;
		}
		if (rect.left + rect.width > document.documentElement.clientWidth) {
			this.dialog.style.left = `${parseInt(this.dialog.style.left || '0') - (rect.left + rect.width - document.documentElement.clientWidth)}px`;
		}
	}

	private fitDialogPosition() {
		const rect = this.dialog.getBoundingClientRect();
		this.dialog.style.top = `${document.documentElement.clientHeight * 0.3}px`;
		this.dialog.style.left = `${(document.documentElement.clientWidth - rect.width) * 0.5}px`;
	}
}

const define = (name: string, options?: ElementDefinitionOptions) => {
	if (!customElements.get(name)) {
		customElements.define(name, WebComponent, options);
	}
};

export { define };
export default WebComponent;
