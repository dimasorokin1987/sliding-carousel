export const applyLoopedSlidingCarousel = (element, nDisplaySlides = 1) => {
  if (typeof element === 'string') element = document.querySelector(element);

  const id = Date.now();

  const $prevButton = element.querySelector('.prevButton');
  const $nextButton = element.querySelector('.nextButton');
  const $slides = element.querySelector('.slides');
  const $radios = element.querySelector('.radios');

  const axMax = 0.01;
  const vxMax = 0.3;
  const dtStep = 25;

  let n = $slides.children.length;


  let userScroll = false;
  let hasPrev = false;
  let hasNextPosition = false;
  let index = 0;

  let prevX;
  let prevTime;
  let vx;
  let interval;
  //let userIteractionTime;

  const positions = i => {
    if (typeof i === 'undefined') {
      return Array
        .from($slides.children)
        .map(el => el.offsetLeft);
    } else {
      return $slides.children[i].offsetLeft;
    }
  };


  const smoothScrollToIndex = (toIndex) => {
    $slides.children[toIndex].scrollIntoView({
      behavior: 'smooth', block: 'nearest', inline: 'start'
    });
    index = toIndex;
    $radios.children[origIndex()].checked = true;
  };

  const prevIndex = () => {
    return (index + n - 1) % n;
  };

  const nextIndex = () => {
    return (index + 1) % n;
  };

  const origIndex = () => {
    //0,1,2=>2,3,4
    if (index < nDisplaySlides) return n - nDisplaySlides + index;
    //3,4,5,6,7=>0,1,2,3,4
    else if (index < n + nDisplaySlides) return index - nDisplaySlides;
    //8,9,10=>0,1,2
    else if (index < n + nDisplaySlides * 2) return index - n - nDisplaySlides;
  }


  const updateIndexFromPosition = () => {
    let currentPosition = $slides.scrollLeft;
    let nearestIndex = 0;
    let minDistance = Infinity;
    positions().forEach((pos, i) => {
      let dist = Math.abs(pos - currentPosition);
      if (dist < minDistance) {
        minDistance = dist;
        nearestIndex = i;
      }
    });
    index = nearestIndex;
    $radios.children[origIndex()].checked = true;
  };


  //pre and post slides
  let preSlides = [];
  let postSlides = [];
  for (let i = 0; i < nDisplaySlides; i++) {
    postSlides[i] = $slides.children[i].cloneNode(true);
    preSlides[i] = $slides.children[n - 1 - i].cloneNode(true);
  }

  for (let i = 0; i < nDisplaySlides; i++) {
    $slides.insertBefore(preSlides[i], $slides.firstElementChild);
    $slides.appendChild(postSlides[i]);
  }

  Array.from($slides.children).forEach(slide => {
    slide.style.width = `${100 / nDisplaySlides}%`;
  });

  index = nDisplaySlides;
  $slides.scrollLeft = positions(index);

  //create radios
  $radios.innerHTML = '';
  for (let i = 0; i < n; i++) {
    let radio = document.createElement("input");
    radio.type = 'radio';
    radio.name = 'position'+id;
    $radios.appendChild(radio);
  };

  Array.from($radios.children).forEach((radio, i) => {
    radio.onclick = () => {
      smoothScrollToIndex(nDisplaySlides + i);
    };
  });

  console.log('aaaa', origIndex(), $radios.children[origIndex()])
  if ($radios.children[origIndex()]) {
    console.log($radios.children[origIndex()].checked)
    $radios.children[origIndex()].checked = true;
    console.log($radios.children[origIndex()].checked)
    window.aaa = $radios.children[origIndex()]
  }

  //append handlers
  $prevButton.onclick = () => {
    $slides.scrollLeft -= 0.001;
    vx = -vxMax;
    hasNextPosition = true;
  };
  $nextButton.onclick = () => {
    vx = vxMax;
    hasNextPosition = true;
  };
  $slides.onmousewheel = e => {
    //userIteractionTime = Date.now();
    userScroll = true;
    vx = 0;
    hasNextPosition = false;
  };
  $slides.ontouchmove = e => {
    //userIteractionTime = Date.now();
    userScroll = true;
    vx = 0;
    hasNextPosition = false;
  };
  $slides.onscroll = e => {
    if (!userScroll) return;
    userScroll = false;

    let currentPosition = $slides.scrollLeft;
    let currentTime = Date.now();

    if (hasPrev && !hasNextPosition) {
      let dx = currentPosition - prevX;
      let dt = currentTime - prevTime;
      vx = dx / dt;
      hasNextPosition = true;
    }

    prevX = currentPosition;
    prevTime = currentTime;
    hasPrev = true;
  };


  //addEventListener('resize', e=>document.body.appendChild(document.createTextNode('r...')));
  //addEventListener('orientationchange', e=>document.body.appendChild(document.createTextNode('o...')));

  addEventListener('resize', () => {
    $slides.scrollLeft = positions(index);
    //$slides.scrollLeft = $slides.scrollWidth * relPosition;
  });
  addEventListener('orientationchange', () => {
    $slides.scrollLeft = positions(index);
    //$slides.scrollLeft = $slides.scrollWidth * relPosition;
  });

  clearInterval(interval);
  interval = setInterval(() => {
    //let currentTime = Date.now();
    //if (currentTime < userIteractionTime + 100) return;

    if (userScroll) return;
    if (!hasNextPosition) return;
    console.log('interval')

    updateIndexFromPosition();
    let currentPosition = $slides.scrollLeft;
    let indexRight = positions().findIndex(x => x > currentPosition);
    if (indexRight === -1) indexRight = n - 1;

    let indexLeft = indexRight - 1;
    let indexNext = vx < 0 ? indexLeft : vx > 0 ? indexRight : index;
    let nextPosition = positions(indexNext);
    let d = nextPosition - currentPosition;
    let ax = Math.abs(1 / d * dtStep * 10);
    ax = Math.min(ax, axMax);
    vx += Math.sign(d) * ax;
    vx = Math.min(vx, vxMax);

    if (Math.abs(d) > 50) $slides.scrollLeft += vx * dtStep;
    else if (Math.abs(d) > 5) $slides.scrollLeft += 0.5 * d;
    else {
      $slides.scrollLeft = nextPosition;
      vx = 0;
      hasPrev = false;
      hasNextPosition = false;
    }

    //0,1,2| 3,4,5,6,7| 8,9,10
    //2,3,4| 0,1,2,3,4| 0,1,2
    let deltaOverFirst = currentPosition - positions(nDisplaySlides);
    let deltaOverLast = currentPosition - positions(nDisplaySlides - 1 + n);
    if (deltaOverFirst < 0 && vx < 0) {
      $slides.scrollLeft = positions(nDisplaySlides + n) + deltaOverFirst;
    }
    if (deltaOverLast > 0 && vx > 0) {
      $slides.scrollLeft = positions(nDisplaySlides - 1) + deltaOverLast;
    }
  }, dtStep);
};
