<?php
	session_start();
	header('Content-Type: image/gif');
	
	//error_reporting(-1);
	// Same as error_reporting(E_ALL);
	//ini_set('error_reporting', E_ALL);

	$imgname = "looch".mt_rand(1,10).".gif";
	if (isset($_GET["model"])) {
		$idx = (int) $_GET["model"];
		$imgname = "looch".$idx.".gif";
	}
	$im = imagecreatefromgif ($imgname);

	if (!isset($_GET["model"])) {
		// COL 1
		$index = imagecolorclosest ( $im,  255, 0, 0 ); // get White COlor
		imagecolorset($im,$index, mt_rand(0,255), mt_rand(0,255), mt_rand(0,255)); // SET NEW COLOR

		// COL 2
		$index = imagecolorclosest ( $im,  0, 255, 0 ); // get White COlor
		imagecolorset($im,$index, mt_rand(0,255), mt_rand(0,255), mt_rand(0,255)); // SET NEW COLOR

		// COL 3
		$index = imagecolorclosest ( $im,  0, 0, 255 ); // get White COlor
		imagecolorset($im,$index, mt_rand(0,255), mt_rand(0,255), mt_rand(0,255)); // SET NEW COLOR

		// COL 4
		$index = imagecolorclosest ( $im,  255, 0, 255 ); // get White COlor
		imagecolorset($im,$index, mt_rand(0,255), mt_rand(0,255), mt_rand(0,255)); // SET NEW COLOR
	} else {
		// COL 1
		$index = imagecolorclosest ( $im,  255, 0, 0 ); // get White COlor
		imagecolorset($im,$index, 255, 255, 255); // SET NEW COLOR

		// COL 2
		$index = imagecolorclosest ( $im,  0, 255, 0 ); // get White COlor
		imagecolorset($im,$index, 255, 255, 255); // SET NEW COLOR

		// COL 3
		$index = imagecolorclosest ( $im,  0, 0, 255 ); // get White COlor
		imagecolorset($im,$index, 255, 255, 255); // SET NEW COLOR

		// COL 4
		$index = imagecolorclosest ( $im,  255, 0, 255 ); // get White COlor
		imagecolorset($im,$index, 255, 255, 255); // SET NEW COLOR
	}

	//$black = imagecolorallocate($im, 0, 0, 0);
	//imagecolortransparent($im, $black);

	// egg hatch
	
	if (!isset($_GET["model"])) {
		if (mt_rand(1,100) > 50) {
			$overlay_file = "egg".mt_rand(1,2).".gif";
			$overlay = imagecreatefromgif ($overlay_file);
			$w = imagesx ($overlay);
			$h = imagesy ($overlay);

			//$black2 = imagecolorallocate($overlay, 0, 0, 0);
			//imagecolortransparent($overlay, $black2);
			
			imagecopymerge ($im, $overlay , 0, 0, 0, 0, $w, $h, 100);
		}
	}

	$my_id = (int) $_SESSION["egguserid"];
	$newimgname = "cache/egg-".$my_id .".gif";
	if (isset($_GET["model"])) {
		$idx = (int) $_GET["model"];
		$newimgname = "cache/model".$idx.".gif";
	} 

	if (!file_exists($newimgname)) {
		imagegif($im, $newimgname ); // save image as gif
	}

	echo file_get_contents($newimgname);

	imagedestroy($im);

?>