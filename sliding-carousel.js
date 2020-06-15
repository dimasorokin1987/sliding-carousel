class SlidingCarousel extends HTMLElement {
  constructor() {
    super();
    console.log("created");
  }

  connectedCallback() {
    console.log("connected");
  }

  disconnectedCallback() {
    console.log("disconnected");
  }

  static get observedAttributes() {
    return [];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log(name, oldValue, newValue);
  }

  adoptedCallback() {

  }


}

customElements.define("sliding-carousel", SlidingCarousel);



