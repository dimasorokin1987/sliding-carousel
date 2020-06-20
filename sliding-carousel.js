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
      width: this.width,
      height: this.height,
      overflow: 'hidden'
    });

    this.prevButton = document.createElement("button");
    Object.assign(this.prevButton.style,{
      position: 'absolute',
      zIndex: 1,
      height: this.hideRadios? '100%': '93%',
      opacity: '50%',
      fontSize: '36px'
    });
    if(this.hidePrevButton) this.prevButton.style.display = 'none';
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
      height: this.hideRadios? '100%': '93%',
      opacity: '50%',
      fontSize: '36px'
    });
    if(this.hideNextButton) this.nextButton.style.display = 'none';
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
    if(this.hideRadios) this.radiosContainer.style.display='none';
    this.container.appendChild(this.radiosContainer);

    shadowRoot.appendChild(this.container);
    console.log("created");
  }

  scrollToIndex(nextIndex){
    this.slides.scrollTo(this.positions[nextIndex],0);
    this.radios[nextIndex].checked=true;
    this.index = nextIndex;
  };

  smoothScrollToIndex(nextIndex){
    this.children[nextIndex].scrollIntoView({
      behavior: 'smooth', block: 'nearest', inline: 'start'
    });
    this.radios[nextIndex].checked=true;
    this.index = nextIndex;
  };

  get prevIndex(){
    if(this.loopSlides) return (this.index + this.positions.length - 1)%this.positions.length;
    else return Math.max(this.index - 1, 0);
  };

  get nextIndex(){
    if(this.loopSlides) return (this.index + 1)%this.positions.length;
    else return Math.min(this.index + 1, this.positions.length - 1);
  };

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
      console.log(currentPosition,pos,dist,i)
    });
    this.index = nearestIndex;
    this.radios[this.index].checked=true;
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
      radio.onclick = ()=>{
        if(this.smoothScroll) this.smoothScrollToIndex(i);
        else this.scrollToIndex(i);
      };
    });
    this.slides.onmousewheel = e => { 
      this.userScroll = true; 
    };
    //this.slides.addEventListener("scroll", e => {}, {passive: true});
    this.slides.onscroll = e => {
      if(!this.userScroll) return;
      this.userScroll = false;
      console.log('user scroll',e);

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
        let indexLeft = indexRight - 1;
        let indexNext = this.vx<0?indexLeft: this.vx>0?indexRight: this.index;
        let nextPosition = this.positions[indexNext];
        let d = nextPosition - currentPosition;
        //console.log('inter',d)
        let ax = Math.abs(1/d*100*10);
        ax = Math.min(ax, 0.02);
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
  }

  connectedCallback() {
    if(!this.hasAttribute('n_display_slides')){
      this.setAttribute('n_display_slides',1);
    }
    console.log(this.getAttribute('n_display_slides'));

    Array.from(this.children).forEach(slide=>{
      console.log(slide);
      let nDisplaySlides = this.getAttribute('n_display_slides');
      nDisplaySlides = Number(nDisplaySlides);
      console.log(nDisplaySlides)
      Object.assign(slide.style,{
        position: 'relative',
        display: 'inline-block',
        width: `${100/nDisplaySlides}%`,
        height: this.hideRadios? '100%': '93%',
        padding: 0,
        margin: 0
      });
      let img = slide.querySelector('img');
      Object.assign(img.style,{
        width:'100%',
        height: '100%'
      });
      let figcaption = slide.querySelector('figcaption')
      Object.assign(figcaption.style,{
        position:'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      });

      this.positions.push(slide.offsetLeft);
      console.dir(figcaption)
    });
    this.positions.splice(1-this.nDisplaySlides);
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
          this.positions.splice(1-this.nDisplaySlides);
        }
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
      break;
      case 'height':
        this.container.style.height = newValue;
      break;
      default:
        throw 'attempt to change unknown attribute';
      case 'smooth_scroll':
      case 'loop_slides':
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

  }
}

customElements.define("sliding-carousel", SlidingCarousel);





document.querySelector('#logo').innerHTML += `
<sliding-carousel width='700px' height='300px' n_display_slides=2 hide_prev_button>
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


//container = document.querySelector('sliding-carousel').shadowRoot.querySelector('div')
//container.scrollTo($$('figure')[1].offsetLeft,0)
//document.querySelector('sliding-carousel').setAttribute('n_display_slides',3)
document.querySelector('sliding-carousel').setAttribute('hide_prev_button','')
//document.querySelector('sliding-carousel').setAttribute('hide_radios','true')
document.querySelector('sliding-carousel').setAttribute('height','100px')
document.querySelector('sliding-carousel').setAttribute('smooth_scroll','true')
//document.querySelector('sliding-carousel').setAttribute('loop_slides','true')

