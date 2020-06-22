## sliding carousel custom element usage:
```html
<script src='https://dimasorokin1987.github.io/sliding-carousel/sliding-carousel.js'></script>
...
<sliding-carousel width='700px' height='300px' n_display_slides=3>
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
```

```javascript
document.querySelector('sliding-carousel').setAttribute('n_display_slides',3)
document.querySelector('sliding-carousel').setAttribute('hide_prev_button','false')
document.querySelector('sliding-carousel').setAttribute('hide_radios','true');
document.querySelector('sliding-carousel').setAttribute('height','100px');
document.querySelector('sliding-carousel').setAttribute('smooth_scroll','true');
document.querySelector('sliding-carousel').setAttribute('loop_slides','true');
```
## looped sliding carousel usage
```html
<link rel="stylesheet" type="text/css" href="https://dimasorokin1987.github.io/sliding-carousel/sliding-carousel.css">
...
<div class='sliding-carousel' id='container1'>
    <button class='prevButton'>&lt;</button>
    <div class='slides'>
      <figure>
        <img src='https://picsum.photos/200/300?1' />
        <figcaption>image 1</figcaption>
      </figure>
      <figure>
        <img src='https://picsum.photos/200/300?2' />
        <figcaption>image 2</figcaption>
      </figure>
      <figure>
        <img src='https://picsum.photos/200/300?3' />
        <figcaption>image 3</figcaption>
      </figure>
      <figure>
        <img src='https://picsum.photos/200/300?4' />
        <figcaption>image 4</figcaption>
      </figure>
      <figure>
        <img src='https://picsum.photos/200/300?5' />
        <figcaption>image 5</figcaption>
      </figure>
    </div>
    <button class='nextButton'>&gt;</button>
    <div class='radios'></div>
  </div>
  <div class='sliding-carousel' id='container2'>
    <button class='prevButton'>&lt;</button>
    <div class='slides'>
      <figure>
        <img src='https://picsum.photos/200/300?1' />
        <figcaption>image 1</figcaption>
      </figure>
      <figure>
        <img src='https://picsum.photos/200/300?2' />
        <figcaption>image 2</figcaption>
      </figure>
      <figure>
        <img src='https://picsum.photos/200/300?3' />
        <figcaption>image 3</figcaption>
      </figure>
      <figure>
        <img src='https://picsum.photos/200/300?4' />
        <figcaption>image 4</figcaption>
      </figure>
      <figure>
        <img src='https://picsum.photos/200/300?5' />
      </figure>
    </div>
    <button class='nextButton'>&gt;</button>
    <div class='radios'></div>
  </div>

  <script type='module'>
    import {applyLoopedSlidingCarousel} from 'https://dimasorokin1987.github.io/sliding-carousel/looped-sliding-carousel.mjs';
    applyLoopedSlidingCarousel('#container1.sliding-carousel');
    applyLoopedSlidingCarousel('#container2.sliding-carousel', 3);
  </script>
```