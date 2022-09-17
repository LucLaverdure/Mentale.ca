<?php
if ( ! defined( 'ABSPATH' ) )
	 exit;

global $wpdb;
$_POST = stripslashes_deep($_POST);
$_GET = stripslashes_deep($_GET);

$xyz_ics_snippetId = intval($_GET['snippetId']);
$xyz_ics_snippetStatus = intval($_GET['status']);
$xyz_ics_pageno = intval($_GET['pageno']);
$xyz_ics_type = intval($_GET['type']);

if (! isset( $_REQUEST['_wpnonce'] ) || ! wp_verify_nonce( $_REQUEST['_wpnonce'], 'snipp-stat_'.$xyz_ics_snippetId )) 
{
	wp_nonce_ays( 'snipp-stat_'.$xyz_ics_snippetId );
	exit;
} 
else 
{
	if($xyz_ics_snippetId=="" || !is_numeric($xyz_ics_snippetId))
	{
		header("Location:".admin_url('admin.php?page=xyz-wp-insert-code-snippet-manage'));
		exit();
	}
	
	$snippetCount = $wpdb->query($wpdb->prepare( 'SELECT * FROM '.$wpdb->prefix.'xyz_ics_short_code WHERE id=%d LIMIT 0,1' ,$xyz_ics_snippetId)) ;
	if($snippetCount==0)
	{
		header("Location:".admin_url('admin.php?page=xyz-wp-insert-code-snippet-manage&xyz_ics_msg=2'));
		exit();
	}
	else
	{
		$wpdb->update($wpdb->prefix.'xyz_ics_short_code', array('status'=>$xyz_ics_snippetStatus), array('id'=>$xyz_ics_snippetId));
		header("Location:".admin_url('admin.php?page=xyz-wp-insert-code-snippet-manage&xyz_ics_msg=4&type='.$xyz_ics_type.'&pagenum='.$xyz_ics_pageno));
		exit();
	}
}
?>