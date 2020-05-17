var dgToggle = document.querySelector('.dg--toggle'),
    dgGrid = document.querySelector('.dg--wrap'),
    dgBody = document.querySelector('body');

function dummyGrid(toggler, target, body) {
  toggler.addEventListener('click', function(e) {
    target.classList.toggle('dg--on');
    body.classList.toggle('dg--on');
  });
}

dummyGrid(dgToggle, dgGrid, dgBody);