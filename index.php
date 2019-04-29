<!DOCTYPE html>
<html>
	<head>
		<title></title>
		<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
		<meta name="viewport" content="width=device-width" />
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
		<link rel="stylesheet" type="text/css" href="./style.css" />
	</head>
	<body>
		<?php $dir=array_diff(scandir(__DIR__),array(".git",".",".."));
			$dir = array_filter($dir, function($element){
				return is_dir(__DIR__."/".$element) && file_exists(__DIR__."/".$element."/index.php");
			});
			foreach ($dir as $value) {  ?>
				<a href="<?=$value?>"><?=$value?></a>
			<?php }
		?>
		
		<script src="f3.js"></script>
	</body>
</html>
