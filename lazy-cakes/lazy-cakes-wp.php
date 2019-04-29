<?php // trim to a standard cake ?>
<div class="lazy-cake" data-bg="<?php $t=get_field('main_photo'); echo $t['url']; ?>">
  <div class="cake cake-16-9"></div>
  <svg class="loading-icon" viewBox="0 0 100 100"><path d="M10 50a40 40 0 1 1 0 0.1" /></svg>
</div>


<?php // real size ?>
<div class="lazy-cake" data-bg="<?php $t=get_field('main_photo'); echo $t['url']; ?>">
  <div class="cake" style="padding-bottom:<?=$t['height']/$t['width']*100?>%;"></div>
  <svg class="loading-icon" viewBox="0 0 100 100"><path d="M10 50a40 40 0 1 1 0 0.1" /></svg>
</div>
