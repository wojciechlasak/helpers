$('.video-play').click(function() {
  var $t = $(this);
  var video = $(this)
    .siblings('video')
    .get(0);
  if (video.paused) {
    video.play();
    $t.addClass('hidden');
    $(this)
      .siblings('.video-frame')
      .fadeOut(300);
  }
  else {
    video.pause();
    $t.removeClass('hidden');
  }
});



$('.video-slider').each(function() {
  this.addEventListener('videoStop', function() {
    let videoPlay = $(this).find('.video-play');
    let video = $(this).find('video');

    video.each(function() {
      this.pause();
    });
    videoPlay.each(function() {
      $(this).removeClass('hidden');
    });
  });
});
