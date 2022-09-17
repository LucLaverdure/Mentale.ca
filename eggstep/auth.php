<?php
define("INEGG", true);

require_once "eggconf.php";

if ($_POST) {
	$res = file_get_contents("https://www.google.com/recaptcha/api/siteverify?secret=".SECRET_KEYGOO."&response=".$_POST["gcap"]);
	$ret = json_decode($res);
	if ($ret->success == true) {
		
		// passed google captcha
		$_SESSION["nobot"] = true;
		
		// get all users
		$stmt = $EGGconn->prepare("SELECT id, nickname, password FROM egg_user;");
		$stmt->execute(); 
		$stmt->bind_result($myid, $mypseudo, $mypass);
		
		$idfound = -1;

		// cycle through all users
		while ($stmt->fetch()) {
			// cycle through to see if nickname exists
			if (password_verify($_POST["pseudo"], $mypseudo)) {
				// user found
				$idfound = $myid;
				break;
			}
			
		}
		
		// resume break OR user not found
		if ($idfound == -1) {
			// user not found, create it
			
			// hash nickname:
			$pseudo_hash = password_hash($_POST["pseudo"], PASSWORD_BCRYPT);
			// hash password
			$pass_hash = password_hash($_POST["password"], PASSWORD_BCRYPT);
			
			$stmtC = $EGGconn->prepare("INSERT INTO egg_user (nickname, password) VALUES (?, ?);");
			$stmtC->bind_param("ss", $pseudo_hash, $pass_hash);
			$stmtC->execute(); 
			
			// get created id (from auto increment)
			$idfound = $stmtC->insert_id;
			
			$stmtC->close();
			
		}
		
		// user must exist at this point.
		// $idfound should be set
		
		$stmt->close();
		
		// verify passwords
		if ($stmtP = $EGGconn->prepare("SELECT `password` FROM egg_user WHERE id = ? ;")) {
			$stmtP->bind_param("i", $idfound);
			$stmtP->execute(); 
			$stmtP->bind_result($pass_encrypted);
			
			while ($stmtP->fetch()) {
				if (password_verify($_POST["password"], $pass_encrypted)) {

					// Login Success
					$_SESSION["egguserid"] = $idfound;
					$_SESSION["pseudo"] = $_POST["pseudo"];
					
					header("Location: /en/eggstep-tailor/");
					
				} else {
					
					// login FAIL
					header("Location: /en/eggstep/?fail");
					
				}
			}		
			$stmtP->close();
		}
		
	} else {
		// robot attempt
		$_SESSION["nobot"] = false;
		
		echo "Skynet Failure.";
		
		// prompt back login screen
		header("Location: /en/eggstep/");
	}
}
die();
?>