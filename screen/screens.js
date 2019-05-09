let currentScreen = 0;
const nScreens = 2;
$('#screen-prev').on('click', () => {
  if (currentScreen - 1 < 0) return;
  currentScreen--;
  applyScreenPos();
});
$('#screen-next').on('click', () => {
  if (currentScreen + 1 >= nScreens) return;
  currentScreen++;
  applyScreenPos();
});

function applyScreenPos() {
  $('.screen').map((index, element) => {
    if (index <= currentScreen) {
      $(element).addClass('active');
    }
    else {
      $(element).removeClass('active');
    }
  });
}
