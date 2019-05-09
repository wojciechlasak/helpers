<div id="main-overlay" class="loading" style="display:none;">
	<svg class="loading-icon" viewBox="0 0 100 100"><path d="M10 50a40 40 0 1 1 0 0.1" /></svg>
</div>
<script>
jQuery('#main-overlay').show(0);
jQuery(window).load(function(){$("#main-overlay").fadeOut(300);});
</script>
