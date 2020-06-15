class SlidingCarousel extends HTMLElement {
  constructor() {
    super();
    console.log("created");
  }

  connectedCallback() {
    console.log("connected");
    this.style.whiteSpace = 'nowrap';
    this.childNodes.forEach(el=>{
      if(el.tagName!=='FIGURE') return;
      console.log(el);
      el.style.display='inline-block';
    });
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
