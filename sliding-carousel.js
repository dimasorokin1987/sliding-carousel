class SlidingCarousel extends HTMLElement {
  constructor() {
    super();
    let shadowRoot = this.attachShadow({mode: "open"});
    this.container = document.createElement("div");
    Object.assign(this.container.style,{
      position: 'relative',
      width: this.style.width,
      height: this.style.height
    });

    this.prevButton = document.createElement("button");
    Object.assign(this.prevButton.style,{
      position: 'absolute',
      zIndex: 1
    });
    this.prevButton.innerHTML = 'prev';
    this.container.appendChild(this.prevButton);

    this.slides = document.createElement("div");
    Object.assign(this.slides.style,{
      position: 'absolute',
      whiteSpace: 'nowrap',
      overflow: 'scroll',
      width: this.style.width,
      height: this.style.height
    });
    this.slides.innerHTML = '<slot></slot>';
    this.container.appendChild(this.slides);

    this.nextButton = document.createElement("button");
    Object.assign(this.nextButton.style,{
      position: 'absolute',
      right: 0,
      zIndex: 1
    });
    this.nextButton.innerHTML = 'next';
    this.container.appendChild(this.nextButton);

    shadowRoot.appendChild(this.container);
    console.log("created");
  }

  connectedCallback() {
    console.log("connected");
    this.childNodes.forEach(figure=>{
      if(figure.tagName!=='FIGURE') return;
      console.log(figure);
      Object.assign(figure.style,{
        position: 'relative',
        display: 'inline-block',
        width: this.style.width,
        height: this.container.clientHeight-20+'px',
        padding: 0,
        margin: 0
      });
      let img = figure.querySelector('img');
      Object.assign(img.style,{
        width:'100%',
        height: '100%'
      });
      let figcaption = figure.querySelector('figcaption')
      Object.assign(figcaption.style,{
        position:'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      });
      console.dir(figcaption)
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





document.querySelector('#logo').innerHTML += `
<sliding-carousel style='width: 300px; height: 300px;'>
  <figure>
    <img src="https://picsum.photos/200/300" />
    <figcaption>random image 1</figcaption>
  </figure>
  <figure>
    <img src="https://picsum.photos/200/300" />
    <figcaption>random image 2</figcaption>
  </figure>
  <figure>
    <img src="https://picsum.photos/200/300" />
    <figcaption>random image 3</figcaption>
  </figure>
  <figure>
    <img src="https://picsum.photos/200/300" />
    <figcaption>random image 4</figcaption>
  </figure>
</sliding-carousel>
`;


container = document.querySelector('sliding-carousel').shadowRoot.querySelector('div')
container.scrollTo($$('figure')[1].offsetLeft,0)