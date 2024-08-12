import styles from './styles/index.scss?inline'
class BaseComponent extends HTMLElement {
  protected _isConnected = false;
  static getBooleanValue(value: any) {
    return !!value && value !== "false" || value === "";
  }
  static get observedAttributes(): string[] {
    return [];
  }
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.injectStyles();
  }
  render() {
    this.shadowRoot!.innerHTML = ``;
  }

  attributeChangedCallback(_name: string, _oldValue: string | null, _newValue: string | null) { }

  connectedCallback() {
    this._isConnected = true;
  }

  disconnectedCallback() { }

  set<K extends keyof this>(key: K, value: this[K]) {
    this[key] = value;
  }

  get<K extends keyof this>(key: K) {
    return this[key];
  }

  private injectStyles() {
    const style = document.createElement("style");
    style.textContent = `${styles}`;
    this.shadowRoot!.appendChild(style);
  }
}

export default BaseComponent;
