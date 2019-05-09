
<!DOCTYPE html>
<html>
	<head>
		<title></title>
		<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
		<meta name="viewport" content="width=device-width" />
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
		<link rel="stylesheet" type="text/css" href="../style.css" />
		<link rel="stylesheet" type="text/css" href="base.css" />
	</head>
	<body>
		<?php include(__DIR__."/inst.svg"); ?>
		<?php include(__DIR__."/fb.svg"); ?>
		<div id="close">
			<?php include(__DIR__."/close.svg"); ?>
		</div>
		<div class="arrow">
			<?php include(__DIR__."/arrow.svg"); ?>
		</div>
		<div class="arrow">
			<?php include(__DIR__."/arrow-download.svg"); ?>
		</div>
		<div id="burger">
			<?php include(__DIR__."/burger.svg"); ?>
		</div>
		<div id="arrow-video">
			<?php include(__DIR__."/arrow-video.svg"); ?>
		</div>
		<div class="dash">
			<?php include(__DIR__."/reverse-dash.svg"); ?>
		</div>
		<div class="pin">
			<?php include(__DIR__."/pin.svg"); ?>
		</div>


		<script src="../f3.js"></script>
		<script>
			$("#burger").on('click',function(){
				$(this).toggleClass("shown")
			})
		</script>
	</body>
</html>
