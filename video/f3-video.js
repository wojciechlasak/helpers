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
