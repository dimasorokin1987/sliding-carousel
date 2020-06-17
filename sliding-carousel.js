class SlidingCarousel extends HTMLElement {
  constructor() {
    super();
    this.positions = [];
    this.radios = [];
    this.index = 0;
    let shadowRoot = this.attachShadow({mode: "open"});
    this.container = document.createElement("div");
    Object.assign(this.container.style,{
      position: 'relative',
      width: this.style.width,
      height: '100%',
      overflow: 'hidden'
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
      height: '100%',
      paddingBottom: '17px'
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

    this.radiosContainer = document.createElement("div");
    Object.assign(this.radiosContainer.style,{
      position: 'absolute',
      bottom: 0,
      zIndex: 1,
      width: '100%',
      textAlign: 'center'
    });
    this.container.appendChild(this.radiosContainer);

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

    this.positions.forEach(()=>{
      let radio = document.createElement("input");
      radio.type='radio';
      radio.name='position';
      this.radiosContainer.appendChild(radio);
      this.radios.push(radio);
    });
    if(this.radios[this.index]){
      this.radios[this.index].checked=true;
    }

    this.prevButton.onclick = ()=>{
      this.index = (this.index + this.positions.length - 1)%this.positions.length;
      this.slides.scrollTo(this.positions[this.index],0);
      this.radios[this.index].checked=true;
    };
    this.nextButton.onclick = ()=>{
      this.index = (this.index + 1)%this.positions.length;
      this.slides.scrollTo(this.positions[this.index],0);
      this.radios[this.index].checked=true;
    };
    this.radios.forEach((radio,i)=>{
      radio.onclick = ()=>{
        this.index = i;
        this.slides.scrollTo(this.positions[i],0);
      };
    });
    this.slides.onscroll = ()=>{
      let currentPosition = this.slides.scrollLeft;
      console.log('currentPosition',currentPosition);
      let nearestIndex = 0;
      let minDistance = Infinity;
      this.positions.forEach((pos,i)=>{
        let dist = Math.abs(pos-currentPosition);
        if(dist<minDistance){
          minDistance = dist;
          nearestIndex = i;
        }
      });
      this.index = nearestIndex;
      this.radios[this.index].checked=true;
    }
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




/*
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
*/