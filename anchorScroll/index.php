<!DOCTYPE html>
<html>
	<head>
		<title></title>
		<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
		<meta name="viewport" content="width=device-width" />
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
		<link rel="stylesheet" type="text/css" href="../style.css" />
    <style>
      .nav-single.current{
        background-color:rgb(50,0,0);
      }

      #nav{
        position:fixed;
        background-color:#ccc;
        width:200px;
      }

      #nav.disable{
        opacity:0;
      }
    </style>
	</head>
	<body>
    <nav id="nav">
      <ul>
        <li class="nav-single" data-anchor="1">1</li>
        <li class="nav-single" data-anchor="2">2</li>
        <li class="nav-single" data-anchor="3">3</li>
        <li class="nav-single" data-anchor="4">4</li>

      </ul>
    </nav>
    <main>
      <div class="anchor" data-ref="1" style="height:900px;background-color:rgb(120,0,0)"></div>
      <div class="anchor" data-ref="2" style="height:600px;background-color:black"></div>
      <div class="anchor" data-ref="3" style="height:700px;background-color:rgb(0,0,120)"></div>
      <div class="anchor" data-ref="4" style="height:800px;background-color:rgb(34,23,120)"></div>
    </main>

    <script src="../f3.js"></script>
    <script src="../scrollItem/f3-scrollItem.js"></script>
		<script src="f3-anchorScroll.js"></script>
	</body>
</html>
