<?php 
if ( ! defined( 'ABSPATH' ) ) 
	exit;

global $wpdb;
global $current_user;

$xyz_ics_snippetId = intval($_GET['snippetId']);
$xyz_ics_pageno = 1;//intval($_GET['pageno']);
$xyz_ics_stype = intval($_GET['type']);

if (! isset( $_REQUEST['_wpnonce'] ) || ! wp_verify_nonce( $_REQUEST['_wpnonce'], 'snipp-dup_'.$xyz_ics_snippetId ))
{
    wp_nonce_ays( 'snipp-dup_'.$xyz_ics_snippetId );
    exit;
} 
else 
{
    $snippetDetails = $wpdb->get_results($wpdb->prepare( 'SELECT * FROM '.$wpdb->prefix.'xyz_ics_short_code WHERE id=%d LIMIT 0,1',$xyz_ics_snippetId )) ;
    $snippetDetails = $snippetDetails[0];
    
    $xyz_ics_title_new=xyz_ics_get_distinct_snippetinfo($snippetDetails->title,'title');
    
    $temp_xyz_ics_title = str_replace(' ', '', $xyz_ics_title_new);
    $temp_xyz_ics_title = str_replace('-', '', $temp_xyz_ics_title);
    
    $xyz_ics_title = str_replace(' ', '-', $xyz_ics_title_new);
    
    $xyz_ics_type=abs(intval($snippetDetails->snippet_type));
    $xyz_ics_content = $snippetDetails->content;
    
    $user_ID = get_current_user_id();
    
    if($xyz_ics_type!="0" && $xyz_ics_title != "" && $xyz_ics_content != "")
    {
    	if(ctype_alnum($temp_xyz_ics_title))
    	{
    		$snippet_count = $wpdb->query($wpdb->prepare( 'SELECT * FROM '.$wpdb->prefix.'xyz_ics_short_code WHERE id!=%d AND title=%s LIMIT 0,1',$xyz_ics_snippetId,$xyz_ics_title)) ;
    
    		if($snippet_count == 0)
    		{
    			$xyz_shortCode = '[xyz-ics snippet="'.$xyz_ics_title.'"]';
    			
    			$status=xyz_ics_get_snippet_status($xyz_ics_snippetId);
    			$wpdb->insert($wpdb->prefix.'xyz_ics_short_code', array('title' =>$xyz_ics_title,'content'=>$xyz_ics_content,'short_code'=>$xyz_shortCode,'status'=>$status,'snippet_type'=>$xyz_ics_type,'user'=>$user_ID),array('%s','%s','%s','%d','%d'));
    			
    			header("Location:".admin_url('admin.php?page=xyz-wp-insert-code-snippet-manage&xyz_ics_msg=6&type='.$xyz_ics_stype.'&pagenum='.$xyz_ics_pageno));
    			exit();
    		}
    	}
    }
}
?>