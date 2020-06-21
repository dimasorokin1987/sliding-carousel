class SlidingCarousel extends HTMLElement {
  static templateHtml = `
    <style>
      .container {
        position: relative;
        overflow: hidden;
      }
      .prevButton {
        position: absolute;
        z-index: 1;
        opacity: 50%;
        font-size: 36px;
      }
      .slides {
        position: absolute;
        white-space: nowrap;
        overflow-x: scroll;
        width: 100%;
        height: 100%;
        padding-bottom: 17px;
        font-size: 0;
      }
      .nextButton {
        position: absolute;
        right: 0;
        z-index: 1;
        opacity: 50%;
        font-size: 36px;
      }
      .radiosContainer {
        position: absolute;
        bottom: 0;
        z-index: 1;
        width: 100%;
        text-align: center;
      }
    </style>
    <div class="container">
      <button class='prevButton'>&lt;</button>
      <div class='slides'>
          <slot></slot>
      </div>
      <button class='nextButton'>&gt;</button>
      <div class='radiosContainer'></div>
    </div>
  `;
  static template;

  constructor() {
    super();
    this.positions = [];
    this.radios = [];
    this.index = 0;
    this.shift = 0;
    console.log('constructor1 this.children', this.children);
    console.log('constructor1 this.childNodes ', this.childNodes);
    console.log('constructor1 this.childNodes length', this.childNodes.length);

    if(!SlidingCarousel.template){
      SlidingCarousel.template = document.createElement('template');
      SlidingCarousel.template.innerHTML = SlidingCarousel.templateHtml;
    }

    let shadowRoot = this.attachShadow({mode: "open"});
    //const shadowRoot = this.attachShadow({mode: 'closed'});
    shadowRoot.appendChild(SlidingCarousel.template.content.cloneNode(true));

    this.container = shadowRoot.querySelector('.container');
    this.prevButton = this.container.querySelector('.prevButton');
    this.slides = this.container.querySelector('.slides');
    this.nextButton = this.container.querySelector('.nextButton');
    this.radiosContainer = this.container.querySelector('.radiosContainer');





    console.log('constructor2 this.children', this.children);
    console.log('constructor2 this.childNodes ', this.childNodes);
    console.log('constructor2 this.childNodes length', this.childNodes.length);

    console.log("created");
  }

  correctBoundNextIndex(nextIndex){
    let n = this.children.length;
    let m = n - this.nDisplaySlides + 1;
    console.log(this.index,nextIndex,n-1,this.index===n-1 && nextIndex===0)
    if(this.index===0 && nextIndex===n-1){
      if(this.loopSlides){
        this.slides.scrollTo(this.positions[1],0)
        this.insertBefore(this.children[n-1], this.children[0]); 
        this.shift = (this.shift+1)%n;
        nextIndex = 0;
      }
    }
    console.log(n-this.nDisplaySlides<this.index && this.index<n,nextIndex===(this.index+1)%n,nextIndex,this.index,n)
    if(true
      && n-this.nDisplaySlides<=this.index && this.index<n
      && nextIndex===(this.index+1)%n
    ){
      //2->3,3->0
      console.log(111)
      if(this.loopSlides){
        this.appendChild(this.children[0]);
        this.slides.scrollTo(this.positions[m-2],0)  
        this.shift = (this.shift+n-1)%n;
        nextIndex = m-1;
      }
    }
    return nextIndex;
  }

  scrollToIndex(nextIndex){
    nextIndex = this.correctBoundNextIndex(nextIndex);

    this.slides.scrollTo(this.positions[nextIndex],0);
    this.index = nextIndex;
    this.radios[this.origIndex].checked=true;
  };

  smoothScrollToIndex(nextIndex){
    nextIndex = this.correctBoundNextIndex(nextIndex);

    this.children[nextIndex].scrollIntoView({
      behavior: 'smooth', block: 'nearest', inline: 'start'
    });
    this.index = nextIndex;
    this.radios[this.origIndex].checked=true;
  };

  get prevIndex(){
    if(this.loopSlides) return (this.index + this.positions.length - 1)%this.positions.length;
    else return Math.max(this.index - 1, 0);
  };

  get nextIndex(){
    if(this.loopSlides) return (this.index + 1)%this.positions.length;
    else return Math.min(this.index + 1, this.positions.length - 1);
  };

  get origIndex(){
    let n = this.children.length;
    return (this.index-this.shift+n)%n;
  }


  updateIndexFromPosition(){
    let currentPosition = this.slides.scrollLeft;
    let nearestIndex = 0;
    let minDistance = Infinity;
    this.positions.forEach((pos,i)=>{
      let dist = Math.abs(pos-currentPosition);
      if(dist<minDistance){
        minDistance = dist;
        nearestIndex = i;
      }
      //console.log(currentPosition,pos,dist,i)
    });
    this.index = nearestIndex;
    this.radios[this.origIndex].checked=true;
  };

  appendHandlers(){
    this.prevButton.onclick = ()=>{
      if(this.smoothScroll) this.smoothScrollToIndex(this.prevIndex);
      else this.scrollToIndex(this.prevIndex);
    };
    this.nextButton.onclick = ()=>{
      if(this.smoothScroll) this.smoothScrollToIndex(this.nextIndex);
      else this.scrollToIndex(this.nextIndex);
    };
    this.radios.forEach((radio,i)=>{
      console.log('radio',i)
      radio.onclick = ()=>{
        console.log('radio handler',i)
        let n = this.children.length;
        let j = (i+this.shift+n)%n;
        if(this.smoothScroll) this.smoothScrollToIndex(j);
        else this.scrollToIndex(j);
      };
    });
    this.slides.onmousewheel = e => { 
      this.userScroll = true; 
    };
    //this.slides.addEventListener("scroll", e => {}, {passive: true});
    this.slides.onscroll = e => {
      if(!this.userScroll) return;
      this.userScroll = false;
      //console.log('user scroll',e);

      if(this.smoothScroll){
        let currentPosition = this.slides.scrollLeft;
        let currentTime = Date.now();
       // console.log('currentPosition',currentPosition);
       // console.log('currentTime',currentTime);

        if(this.hasPrev&&!this.hasNextPosition){
          let dx = currentPosition-this.prevX;
          let dt = currentTime - this.prevTime;
          this.vx = dx/dt;
          this.hasNextPosition = true;
        }
  
        this.prevX = currentPosition;
        this.prevTime = currentTime;
        this.hasPrev = true;
      }else{
        let currentScrollTime = Date.now();
        let isScrollingTimeout = this.prevUserScrollTime && currentScrollTime<this.prevUserScrollTime+100;
        this.prevUserScrollTime = currentScrollTime;
        if(isScrollingTimeout) {
          this.slides.scrollLeft = this.positions[this.index];
        }else{
          let currentPosition = this.slides.scrollLeft;
          let prevPosition = this.positions[this.index];
          if(currentPosition<prevPosition) this.scrollToIndex(this.prevIndex);
          else if(currentPosition>prevPosition) this.scrollToIndex(this.nextIndex);
        }
      }
    }
    clearInterval(this.interval);
    this.interval = setInterval(()=>{
      if(this.hasNextPosition){
        this.updateIndexFromPosition();
        let currentPosition = this.slides.scrollLeft;
        let indexRight = this.positions.findIndex(x=>x>currentPosition);
        if(indexRight===-1)indexRight = this.positions.length - 1;

        let indexLeft = indexRight - 1;
        let indexNext = this.vx<0?indexLeft: this.vx>0?indexRight: this.index;
        let nextPosition = this.positions[indexNext];
        let d = nextPosition - currentPosition;
        console.log('inter',indexRight,currentPosition,this.positions)
        let ax = Math.abs(1/d*100*10);
        ax = Math.min(ax, 0.02);
       // console.log(ax);
        this.vx += Math.sign(d)*ax;
        this.vx = Math.min(this.vx, 0.15);
        console.log(this.vx);
        
        if(Math.abs(d)>100) this.slides.scrollLeft+=this.vx*100;
        else if(Math.abs(d)>5) this.slides.scrollLeft+=0.3*d;
        else {
          this.slides.scrollLeft = nextPosition;
          this.hasPrev = false;
          this.hasNextPosition = false;
        }
      }
    }, 100);
  };

  updateSlideStyle(slide){
    let nDisplaySlides = this.getAttribute('n_display_slides');
    nDisplaySlides = Number(nDisplaySlides);
    console.log(nDisplaySlides)
    Object.assign(slide.style,{
      position: 'relative',
      display: 'inline-block',
      padding: 0,
      margin: 0,
      width: `${100/nDisplaySlides}%`,
      height: this.hideRadios? '100%': '93%'
    });
    let img = slide.querySelector('img');
    Object.assign(img.style,{
      width: '100%',
      height: '100%'
    });
    let figcaption = slide.querySelector('figcaption');
    Object.assign(figcaption.style,{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      fontSize: '32px'
    });
  }

  connectedCallback() {
    if(!this.hasAttribute('n_display_slides')){
      this.setAttribute('n_display_slides',1);
    }
    console.log('n_display_slides',this.getAttribute('n_display_slides'));

    Object.assign(this.container.style,{
      width: this.width,
      height: this.height,
    });

    this.prevButton.style.height = this.hideRadios? '100%': '93%';
    if(this.hidePrevButton) this.prevButton.style.display = 'none';
    this.nextButton.style.height = this.hideRadios? '100%': '93%';
    if(this.hideNextButton) this.nextButton.style.display = 'none';
    if(this.hideRadios) this.radiosContainer.style.display='none';

    console.log('connectedCallback this.children', this.children);
    console.log('connectedCallback this.childNodes ', this.childNodes);
    console.log('connectedCallback this.childNodes length', this.childNodes.length);
    console.log('connectedCallback slot.assignedElements', this.container.querySelector('slot').assignedElements());

    //Array.from(this.childNodes)
    //.filter(node=>node.nodeType===1)
    const slot = this.shadowRoot.querySelector('slot');
    slot.assignedElements()
    .forEach(slide=>{
      console.log('connectedCallback', slide);
      this.updateSlideStyle(slide);
      this.positions.push(slide.offsetLeft);
    });
    slot.addEventListener('slotchange', (event) => {
      event.target.assignedElements().forEach(slide => {
        console.log('slotchange handler', slide);
        this.updateSlideStyle(slide);
        this.positions.push(slide.offsetLeft);
      });
    });


    if(!this.loopSlides){
      this.positions.splice(1-this.nDisplaySlides);
    }
    this.positions.forEach(()=>{
      let radio = document.createElement("input");
      radio.type='radio';
      radio.name='position';
      this.radiosContainer.appendChild(radio);
      this.radios.push(radio);
    });

    if(this.radios[this.origIndex]){
      this.radios[this.origIndex].checked=true;
    }
    this.appendHandlers();
    this.isReady = true;
    console.log('connected');
  }

  disconnectedCallback() {
    console.log('disconnected');
  }

  static get observedAttributes() {
    return [
      'width','height','n_display_slides',
      'hide_prev_button','hide_next_button','hide_radios',
      'smooth_scroll','loop_slides'
    ];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log(name, oldValue, newValue);
    if(!this.isReady)return;
    switch(name) {
      case 'n_display_slides':
        this.positions = [];
        this.radiosContainer.innerHTML = '';
        this.radios = [];

        Array.from(this.children).forEach(slide=>{
          console.log(slide)
          slide.style.width=`${100/newValue}%`;
          this.positions.push(slide.offsetLeft);
        });
        if(this.nDisplaySlides>1){
          if(!this.loopSlides){
            this.positions.splice(1-this.nDisplaySlides);
          }
        }
        this.positions.forEach(()=>{
          let radio = document.createElement("input");
          radio.type='radio';
          radio.name='position';
          this.radiosContainer.appendChild(radio);
          this.radios.push(radio);
        });
        if(this.radios[this.origIndex]){
          this.radios[this.origIndex].checked=true;
        }
        console.log(this.positions)
        this.appendHandlers();
      break;
      case 'hide_prev_button':
        if(this.hidePrevButton) this.prevButton.style.display = 'none';
        else this.prevButton.style.display = '';
      break;
      case 'hide_next_button':
        if(this.hideNextButton) this.nextButton.style.display = 'none';
        else this.nextButton.style.display = '';
      break;
      case 'hide_radios':
        this.radiosContainer.style.display = this.hideRadios? 'none': '';
        this.prevButton.style.height = this.hideRadios? '100%': '93%';
        this.nextButton.style.height = this.hideRadios? '100%': '93%';
        Array.from(this.children).forEach(slide=>{
          console.log(slide)
          slide.style.height=this.hideRadios? '100%': '93%';
        });
      break;
      case 'width':
        this.container.style.width = newValue;
        this.positions = [];

        Array.from(this.children).forEach(slide=>{
          this.positions.push(slide.offsetLeft);
        });
        if(this.nDisplaySlides>1){
          if(!this.loopSlides){
            this.positions.splice(1-this.nDisplaySlides);
          }
        }
      break;
      case 'loop_slides':
        this.positions = [];
        this.radiosContainer.innerHTML = '';
        this.radios = [];

        Array.from(this.children).forEach(slide=>{
          this.positions.push(slide.offsetLeft);
        });
        if(this.nDisplaySlides>1){
          if(!this.loopSlides){
            this.positions.splice(1-this.nDisplaySlides);
          }
        }
        this.positions.forEach(()=>{
          let radio = document.createElement("input");
          radio.type='radio';
          radio.name='position';
          this.radiosContainer.appendChild(radio);
          this.radios.push(radio);
        });
        if(this.radios[this.origIndex]){
          this.radios[this.origIndex].checked=true;
        }
        this.appendHandlers();
      break;
      case 'height':
        this.container.style.height = newValue;
      break;
      default:
        throw 'attempt to change unknown attribute';
      case 'smooth_scroll':
    }
  }

  get nDisplaySlides() {
    return this.getAttribute('n_display_slides');
  }
  set nDisplaySlides(newValue) {
    this.setAttribute('n_display_slides', newValue);
  }

  get hidePrevButton() {
    let mustHidePrevButton = this.hasAttribute('hide_prev_button')
    &&this.getAttribute('hide_prev_button')!=='false';
    return mustHidePrevButton;
  }
  set hidePrevButton(newValue) {
    this.setAttribute('hide_prev_button', newValue);
  }
  get hideNextButton() {
    let mustHideNextButton = this.hasAttribute('hide_next_button')
    &&this.getAttribute('hide_next_button')!=='false';
    return mustHideNextButton;
  }
  set hideNextButton(newValue) {
    this.setAttribute('hide_next_button', newValue);
  }
  get hideRadios() {
    let mustHideRadios = this.hasAttribute('hide_radios')
    &&this.getAttribute('hide_radios')!=='false';
    return mustHideRadios;
  }
  set hideRadios(newValue) {
    this.setAttribute('hide_radios', newValue);
  }

  get width() {
    return this.getAttribute('width');
  }
  set width(newValue) {
    this.setAttribute('width', newValue);
  }
  get height() {
    return this.getAttribute('height');
  }
  set height(newValue) {
    this.setAttribute('height', newValue);
  }

  get smoothScroll() {
    let smooth = this.hasAttribute('smooth_scroll')
    &&this.getAttribute('smooth_scroll')!=='false';
    return smooth;
  }
  set smoothScroll(newValue) {
    this.setAttribute('smooth_scroll', newValue);
  }

  get loopSlides() {
    let loop = this.hasAttribute('loop_slides')
    &&this.getAttribute('loop_slides')!=='false';
    return loop;
  }
  set loopSlides(newValue) {
    this.setAttribute('loop_slides', newValue);
  }

  adoptedCallback() {
    console.log('adoptedCallback this.children', this.children);
    console.log('adoptedCallback this.childNodes ', this.childNodes);
    console.log('adoptedCallback this.childNodes length', this.childNodes.length);
  }
}

customElements.define("sliding-carousel", SlidingCarousel);


/*


document.querySelector('#logo').innerHTML += `
<sliding-carousel width='700px' height='300px' n_display_slides=3 smooth_scroll loop_slides>
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
  <figure>
    <img src="https://picsum.photos/200/300" />
    <figcaption>random image 5</figcaption>
  </figure>
</sliding-carousel>
`;


//container = document.querySelector('sliding-carousel').shadowRoot.querySelector('div')
//container.scrollTo($$('figure')[1].offsetLeft,0)
//document.querySelector('sliding-carousel').setAttribute('n_display_slides',3)
document.querySelector('sliding-carousel').setAttribute('hide_prev_button','false')
//document.querySelector('sliding-carousel').setAttribute('hide_radios','true')
document.querySelector('sliding-carousel').setAttribute('height','100px')
document.querySelector('sliding-carousel').setAttribute('smooth_scroll','true')
document.querySelector('sliding-carousel').setAttribute('loop_slides','true')

*/