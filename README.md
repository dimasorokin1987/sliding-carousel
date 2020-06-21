usage:
```html
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