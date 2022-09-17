<?php
if ( ! defined( 'ABSPATH' ) ) 
	exit;

global $wpdb;
$_POST = stripslashes_deep($_POST);
$_GET = stripslashes_deep($_GET);

$xyz_ics_snippetId = intval($_GET['snippetId']);
$xyz_ics_pageno = intval($_GET['pageno']);
$xyz_ics_type = intval($_GET['type']);

if (! isset( $_REQUEST['_wpnonce'] ) || ! wp_verify_nonce( $_REQUEST['_wpnonce'], 'snipp-del_'.$xyz_ics_snippetId )) 
{
	wp_nonce_ays( 'snipp-del_'.$xyz_ics_snippetId );
	exit;
} 
else 
{
	if($xyz_ics_snippetId=="" || !is_numeric($xyz_ics_snippetId))
	{
		header("Location:".admin_url('admin.php?page=xyz-wp-insert-code-snippet-manage&type='.$xyz_ics_type.'&pagenum='.$xyz_ics_pageno));
		exit();
	}
	
	$snippetCount = $wpdb->query($wpdb->prepare( 'SELECT * FROM '.$wpdb->prefix.'xyz_ics_short_code WHERE id=%d LIMIT 0,1',$xyz_ics_snippetId )) ;
	if($snippetCount==0)
	{
		header("Location:".admin_url('admin.php?page=xyz-wp-insert-code-snippet-manage&xyz_ics_msg=2&type='.$xyz_ics_type.'&pagenum='.$xyz_ics_pageno));
		exit();
	}
	else
	{
	    $snippet_type=xyz_ics_get_snippet_type($xyz_ics_snippetId);
		$wpdb->query($wpdb->prepare( 'DELETE FROM  '.$wpdb->prefix.'xyz_ics_short_code  WHERE id=%d',$xyz_ics_snippetId)) ;
		apply_filters('xyz_ics_after_snippet_delete', array('snippet_id'=>$xyz_ics_snippetId,'snippet_type'=>$snippet_type));
		
		header("Location:".admin_url('admin.php?page=xyz-wp-insert-code-snippet-manage&xyz_ics_msg=3&type='.$xyz_ics_type.'&pagenum='.$xyz_ics_pageno));
		exit();
	}
}
?>