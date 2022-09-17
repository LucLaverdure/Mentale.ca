<?php

	if(!isset($_SESSION)) {
		session_start();
	}	

	if (!defined("INEGG")) {
		die("Not in egg...");
	}

	//mysqli_report(MYSQLI_REPORT_ALL);

	define("KEYGOO", "6LeKpbsUAAAAAKm3AYhvvl5M74r4FXJedH7MjZSx");
	define("SECRET_KEYGOO", "6LeKpbsUAAAAAPk6q8-QJGMelD1Kg0X-NFKVAe7m");

	define("iDB_SERV", "db5000187887.hosting-data.io");
	define("iDB_USER", "dbu391752");
	define("iDB_PASS", "zpxg}v}2xDA=L&DC");
	define("iDB_NAME", "dbs182765");

	try {
		global $EGGconn;
		$EGGconn = new mysqli(iDB_SERV, iDB_USER, iDB_PASS, iDB_NAME);

	} catch (Exception $e) {

	}

	try {
		global $EGGconnWP;
		if (class_exists("wpdb")) {
			$EGGconnWP = new wpdb(iDB_USER, iDB_PASS, iDB_NAME, iDB_SERV);		
		}
	} catch (Exception $e) {

	}

?>