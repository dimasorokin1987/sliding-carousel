class SlidingCarousel extends HTMLElement {
  constructor() {
    super();
    this.positions = [];
    this.index = 0;
    let shadowRoot = this.attachShadow({mode: "open"});
    this.container = document.createElement("div");
    Object.assign(this.container.style,{
      position: 'relative',
      width: this.style.width,
      height: '100%'
    });

    this.prevButton = document.createElement("button");
    Object.assign(this.prevButton.style,{
      position: 'absolute',
      zIndex: 1,
      height: '93%',
      opacity: '50%',
      fontSize: '36px'
    });
    this.prevButton.innerHTML = '<';
    this.container.appendChild(this.prevButton);

    this.slides = document.createElement("div");
    Object.assign(this.slides.style,{
      position: 'absolute',
      whiteSpace: 'nowrap',
      overflowX: 'scroll',
      width: '100%',
      height: '100%'
    });
    this.slides.innerHTML = '<slot></slot>';
    this.container.appendChild(this.slides);

    this.nextButton = document.createElement("button");
    Object.assign(this.nextButton.style,{
      position: 'absolute',
      right: 0,
      zIndex: 1,
      height: '93%',
      opacity: '50%',
      fontSize: '36px'
    });
    this.nextButton.innerHTML = '>';
    this.container.appendChild(this.nextButton);

    shadowRoot.appendChild(this.container);
    console.log("created");
  }

  connectedCallback() {
    this.childNodes.forEach(figure=>{
      if(figure.tagName!=='FIGURE') return;
      console.log(figure);
      Object.assign(figure.style,{
        position: 'relative',
        display: 'inline-block',
        width: this.style.width,
        height: '93%',
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

      this.positions.push(figure.offsetLeft);
      console.dir(figcaption)
    });

    this.prevButton.onclick = ()=>{
      this.index = (this.index + this.positions.length - 1)%this.positions.length;
      this.slides.scrollTo(this.positions[this.index],0)
    };
    this.nextButton.onclick = ()=>{
      this.index = (this.index + 1)%this.positions.length;
      this.slides.scrollTo(this.positions[this.index],0);
      
    };
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