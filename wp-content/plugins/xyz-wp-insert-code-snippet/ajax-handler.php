<?php
if ( ! defined( 'ABSPATH' ) ) 
	exit;

add_action("wp_ajax_xyz_ics_load_user_suggestion","xyz_ics_load_user_suggestion");
	
function xyz_ics_load_user_suggestion()
{
    global $wpdb;
	    
	if (! isset( $_POST['_wpnonce'] )|| ! wp_verify_nonce( $_POST['_wpnonce'],'xyz_ics_suggestion_nonce' ))
	{
	    echo 1;die;
	}
	    
	$users_added=array();
	$search=$_POST['searchval'];
	$search_res=$_POST['searchresult'];
	$users_added=explode(',', $search_res);
	    
	$permission=$_POST['permission'];
	$permission_value="'".$permission."'";
	$role=$_POST['role'];
	$role_name=$_POST['role_name'];
	$role_name_val="'".$role_name."'";
	$suggeststring="";
	$user_list = $wpdb->get_results("SELECT * FROM ".$wpdb->prefix."users WHERE display_name REGEXP '[[:<:]]".$search.".*[[:>:]]'");
	    
	if(count($user_list)>0)
	{
	    foreach ($user_list as $user)
	    {
	        $user_meta=get_userdata($user->ID);
	        $user_roles=$user_meta->roles;
	        $user_role=$user_roles[0];
	            
	        if((strcmp($user_role,$role_name)==0) && !in_array($user->display_name,$users_added))
	            $suggeststring.='<li value="'.$user->ID.'" style="cursor:pointer" onclick="LoadSearchValue(this.id,'.$permission_value.','.$role.',this.value,'.$role_name_val.')" id="'.$user->display_name.'">'.$user->display_name.'</li>';
	    }
	}
	// 		if($suggeststring=='')
	// 			$suggeststring="No match found";
	echo $suggeststring;die;
}



?>