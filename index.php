<!DOCTYPE html>
<html>
	<head>
		<title></title>
		<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
		<meta name="viewport" content="width=device-width" />
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
		<link rel="stylesheet" type="text/css" href="./style.css" />
		<link rel="stylesheet" type="text/css" href="./base.css" />
	</head>
	<body>
		<div class="links">
			<?php
			$dir = array_diff(scandir(__DIR__), array(".git", ".", ".."));
			$dir = array_filter($dir, function($element){
				if(!is_dir(__DIR__ . "/" . $element)) return false;
				return file_exists(__DIR__ . "/" . $element . "/index.php");
			});
			foreach ($dir as $value) { ?>
				<div class="link">
					<a href="<?=$value?>"><?=$value?></a>
				</div>
			<?php } ?>
		</div>
		<script src="f3.js"></script>
	</body>
</html>
