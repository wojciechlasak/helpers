<!DOCTYPE html>
<html>
	<head>
		<title></title>
		<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
		<meta name="viewport" content="width=device-width" />
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
		<link rel="stylesheet" type="text/css" href="../style.css" />
		<link rel="stylesheet" type="text/css" href="base.css" />
		<link rel="stylesheet" type="text/css" href="../lazy-cakes/lazy-cakes.css" />

	</head>
	<body>
   	<div class="video-container">
			<video src="big_buck_bunny.mp4" muted preload="none"></video>
			<div class="video-frame lazy-cake rel" data-bg="pieczywo.jpg">
				<div class="cake" style="padding:0;height:auto;position:absolute;top:0;right:0;bottom:0;left:0;"></div>
				<svg class="loading-icon" viewBox="0 0 100 100"><path d="M10 50a40 40 0 1 1 0 0.1" /></svg>
			</div>
			<div class="video-play flex flex-align-center flex-justify-center">
				<svg viewBox="-10 -10 120 120">
					<circle r="50" cx="50" cy="50" />
					<path d="M34 20L84 50L34 80z" />
				</svg>
			</div>
		</div>

    <script src="../f3.js"></script>
    <script src="../lazy-cakes/f3-lazy-cakes.js"></script>
    <script src="f3-video.js"></script>
	</body>
</html>
