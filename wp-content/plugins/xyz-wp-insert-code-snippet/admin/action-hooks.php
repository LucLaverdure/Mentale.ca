<?php
if ( ! defined( 'ABSPATH' ) )
    exit;


add_action("xyz_ics_before_page_excecute","xyz_ics_verify_user_permission");

function xyz_ics_verify_user_permission($page_info)
{
	global $wpdb;
	$page='';
	
	if(isset($_GET['page']))
		$page=$_GET['page'];
	
	//master pwd check
	$xyz_ics_rm_master_pwd=get_option('xyz_ics_rm_master_pwd');
	if($page==="xyz-wp-insert-code-snippet-settings" || $page==="xyz-wp-insert-code-snippet-about" || $page==="xyz-wp-insert-code-snippet-manage-privileges")
	{
		if($xyz_ics_rm_master_pwd!='')
		{
			if(!(isset($_COOKIE['xyz_ics_rm_page_access_password'])) || strcmp($_COOKIE['xyz_ics_rm_page_access_password'],$xyz_ics_rm_master_pwd)!=0)
			{
				header("Location:".admin_url('admin.php?page=xyz-wp-insert-code-snippet-manage-privileges&call=enter-pwd&xyz_ics_page='.$page));
				exit();
			}
		}
	}
	
	$current_user_role='';
	$permission='';

	$current_user_info= wp_get_current_user();
	$current_user_id=$current_user_info->ID;

	if ( !empty( $current_user_info->roles ) && is_array( $current_user_info->roles ) ) {
		foreach ( $current_user_info->roles as $role )
		{
			$current_user_role= $role;
			break;
		}
	}
	if(isset($page_info['permission']))
	{
		$permission=$page_info['permission'];
	}
	elseif($page==="xyz-wp-insert-code-snippet-manage")
	{
		$permission='snippet_manage';
	}
	elseif($page==="xyz-wp-insert-code-snippet-export")
	{
	    $permission='snippet_manage';
	}
	elseif($page==="xyz-wp-insert-code-snippet-import")
	{
	    $permission='snippet_manage';
	}
	
	if($permission!='')
	{
		$permission_flag=0;
		$role_permission = $wpdb->get_row( $wpdb->prepare("SELECT * FROM ".$wpdb->prefix."xyz_ics_role_privileges WHERE role=%s and privilege=%s and value=%d",array($current_user_role,$permission,1)));
		
		if(!empty($role_permission))
			$permission_flag=1;
		else
		{
			$user_permission = $wpdb->get_row( $wpdb->prepare("SELECT * FROM ".$wpdb->prefix."xyz_ics_user_privileges WHERE user=%d and privilege=%s",array($current_user_id,$permission)));
			
			if(!empty($user_permission))
				$permission_flag=1;
		}
		
		if($permission_flag==0)
			wp_die( "You don't have permission to access this page." );

		$page_info['permission_flag']=$permission_flag;
	}
	if(isset($_GET['action']) && isset($_GET['page']))
	{
		$edit_del_permission_flag=0;
		$action=$_GET['action'];
		
		if($page==="xyz-wp-insert-code-snippet-manage" && ($action==="snippet-edit" || $action==="snippet-delete" || $action==="snippet-status"))
		{
			$xyz_ics_allow_snippet_manage_own_only=get_option('xyz_ics_allow_snippet_manage_own_only');
			if($xyz_ics_allow_snippet_manage_own_only==1)
			{
				if(isset($_GET['snippetId']))
					$xyz_ics_snippetId = $_GET['snippetId'];
				
				$table = "xyz_ics_short_code";
				$media_acc_info = $wpdb->get_row( $wpdb->prepare( 'SELECT * FROM '.$wpdb->prefix.$table.' WHERE id=%d',array($xyz_ics_snippetId) ));

				if($media_acc_info->user==$current_user_id)
					$edit_del_permission_flag=1;
			}
			else
				$edit_del_permission_flag=1;

			if($edit_del_permission_flag==0)
			{
				if($action==="snippet-status")
					wp_die( "The creator can only change the snippet status." );
				else
					wp_die( "The creator can only edit or delete the snippet." );
			}
		}
	}
	
	return $page_info;
}


add_action("xyz_ics_after_snippet_create","xyz_ics_add_snippet_owner");
add_action("xyz_ics_after_snippet_update","xyz_ics_add_snippet_owner");

function xyz_ics_add_snippet_owner($snippet_info)
{
    global $wpdb;
	
	if(isset($_GET['snippetId']))
		$xyz_ics_snippetId = $_GET['snippetId'];
	else {
		$xyz_ics_snippetId =$snippet_info[0];
	}
	
	if(isset($_GET['snippet_type']))
	    $xyz_ics_snippetType = $_GET['snippet_type'];
	else {
	    $xyz_ics_snippetType =$snippet_info[1];
	}
	    
	if(!isset($_GET['snippetId']))
	{
		$table = "xyz_ics_short_code";
		$current_user_id= get_current_user_id();
		$wpdb->query($wpdb->prepare("UPDATE ".$wpdb->prefix.$table." SET user=%d
				WHERE `id`=%d",array($current_user_id,$xyz_ics_snippetId)));
	}
	
	$wpdb->update(
	    $wpdb->prefix."xyz_ics_short_code",
	    array('usage_privilege_type'	=>	$_POST['xyz_ics_usage_privilege_type']),
	    array( 'id' => $xyz_ics_snippetId));
	
	if(isset($_POST['xyz_ics_usage_privilege_type']) && $_POST['xyz_ics_usage_privilege_type']==0)
	{
	    $wpdb->query("DELETE FROM  ".$wpdb->prefix."xyz_ics_user_privileges WHERE privilege='single_snippet_usage' and snippet_id=".$xyz_ics_snippetId." and snippet_type=".$xyz_ics_snippetType);
	    $wpdb->query("DELETE FROM  ".$wpdb->prefix."xyz_ics_role_privileges WHERE privilege='single_snippet_usage' and snippet_id=".$xyz_ics_snippetId." and snippet_type=".$xyz_ics_snippetType);
	}
	else 
	{
    	global $wp_roles;
    	$cap='publish_posts';
    	$roles = array_keys( $wp_roles->roles );
    	
    	if( !is_array( $roles ) )
    		$roles = array( $roles );
    	
    	$hascap = array();
    	
    	foreach( $roles as $role ) {
    		if( !isset( $wp_roles->roles[$role]['capabilities'][$cap] ) || ( 1 != $wp_roles->roles[$role]['capabilities'][$cap] ) )
    			continue;
    		$hascap[] = $role;
    	}
    	if( empty( $hascap ) )
    		return false;
    
    	foreach ($hascap as $role_value => $role_name) {
    
    		if(isset($_POST['xyz_ics_premium_snippet_usage_'.$role_value]))
    		{
    			$permission_mode_snippet_usage=$_POST['xyz_ics_premium_snippet_usage_'.$role_value];
    			$col_exist = $wpdb->get_row( $wpdb->prepare("SELECT * FROM ".$wpdb->prefix."xyz_ics_role_privileges WHERE role=%s and privilege=%s and snippet_id=%d and snippet_type=%d",array($role_name,'single_snippet_usage',$xyz_ics_snippetId,$xyz_ics_snippetType)));
    
    			if(count($col_exist)>0)
    			{
    				$wpdb->update(
    						$wpdb->prefix."xyz_ics_role_privileges",
    						array('value'	=>	$permission_mode_snippet_usage),
    						array( 'id' => $col_exist->id));
    			}
    			else {
    
    				$wpdb->insert($wpdb->prefix."xyz_ics_role_privileges",array(
    						'role'	=>	$role_name,
    						'privilege'	=>	'single_snippet_usage',
    						'value'	=>	$permission_mode_snippet_usage,
    				        'snippet_id'	=>	$xyz_ics_snippetId,
    				        'snippet_type' => $xyz_ics_snippetType));
    			}
    			
    			$wpdb->query("DELETE FROM  ".$wpdb->prefix."xyz_ics_user_privileges WHERE privilege='single_snippet_usage' and role='".$role_name."' and snippet_id=".$xyz_ics_snippetId." and snippet_type=".$xyz_ics_snippetType);
    			
    			if($permission_mode_snippet_usage==2)
    			{
    				$user_search_snippet_usage=$_POST['xyz_ics_premium_users_added_snippet_usage_'.$role_value];
    				$user_search_snippet_usage=rtrim($user_search_snippet_usage,",");
    				$user_search_snippet_usage_array=explode(',', $user_search_snippet_usage);
    
    				$user_name_search_snippet_usage=$_POST['xyz_ics_premium_users_added_name_snippet_usage_'.$role_value];
    				$user_name_search_snippet_usage=rtrim($user_name_search_snippet_usage,",");
    				$user_name_search_snippet_usage_array=explode(',', $user_name_search_snippet_usage);
    
    				for($i=0;$i<count($user_search_snippet_usage_array);$i++)
    				{
    					$user_permission_exist = $wpdb->get_row( $wpdb->prepare("SELECT * FROM ".$wpdb->prefix."xyz_ics_user_privileges WHERE user=%d and privilege=%s and snippet_id=%d and snippet_type=%d",array($user_search_snippet_usage_array[$i],'single_snippet_usage',$xyz_ics_snippetId,$xyz_ics_snippetType)));
    					
    					if(count($user_permission_exist)==0 && $user_search_snippet_usage_array[$i]!='')
    					{
    						$wpdb->insert($wpdb->prefix."xyz_ics_user_privileges",array(
    								'user'	=>	$user_search_snippet_usage_array[$i],
    								'privilege'	=>	'single_snippet_usage',
    								'user_name'	=>	$user_name_search_snippet_usage_array[$i],
    								'role' => $role_name,
    						        'snippet_id' => $xyz_ics_snippetId,
    								'snippet_type' => $xyz_ics_snippetType));
    					}
    				}
    			}
    		}
    	}
    }
	return $snippet_info;
}


add_action('xyz_ics_after_snippet_delete','xyz_ics_snippet_delete_permissions');

function xyz_ics_snippet_delete_permissions($snippet_details)
{
    global $wpdb;
    $snippet_id=$snippet_details['snippet_id'];
    $snippet_type=$snippet_details['snippet_type'];
    
    $wpdb->query("DELETE FROM  ".$wpdb->prefix."xyz_ics_user_privileges WHERE snippet_id=".$snippet_id." and snippet_type=".$snippet_type);
    $wpdb->query("DELETE FROM  ".$wpdb->prefix."xyz_ics_role_privileges WHERE snippet_id=".$snippet_id." and snippet_type=".$snippet_type);
    
    return $snippet_details;
}

add_action("xyz_ics_before_widget_display","xyz_ics_verify_widget_display");

function xyz_ics_verify_widget_display($info)
{
    global $wpdb;    
    $snippet_id_array0=apply_filters('xyz_ics_before_snippet_fetching', array());
    
    $permitted_snippet_ids=$snippet_id_array0['permitted_snippet_ids'];
    $permitted_snippet_ids_array=explode(",", $permitted_snippet_ids);
    
    return $permitted_snippet_ids_array;                
}

add_action('xyz_ics_before_snippet_fetching','xyz_ics_fetch_permitted_snippets');

function xyz_ics_fetch_permitted_snippets($snippet_details)
{
    global $wpdb;
    $snippet_string='';
    $snippet_type=0;
    $snippet_manage_flag=0;
    $all_snippet_id_array=array();
    $all_logs_array=array();
    $current_user_role='';
    $permitted_snippet_ids='';
    $current_user_info= wp_get_current_user();
    $current_user_id=$current_user_info->ID;
    $allowed_snippet_id_array=array();
    
    $snippet_ids_without_spec_perm_array=array();
    $role_perm_snippet_ids_array=array();
    $user_perm_snippet_ids_array=array();
    $owner_string='';
    $owner_snippet_ids_array=array();
    
    $snippet_ids_without_spec_perm_array1=array();
    $role_perm_snippet_ids_array1=array();
    $user_perm_snippet_ids_array1=array();
    
    $snippet_ids_with_spec_perm_str="";
        
    if ( !empty( $current_user_info->roles ) && is_array( $current_user_info->roles ) ) {
        foreach ( $current_user_info->roles as $role )
        {
            $current_user_role= $role;
            break;
        }
    }
        
    if(isset($snippet_details['snippet_type']))
    {
        $snippet_type=$snippet_details['snippet_type'];
    }
    
    if(isset($snippet_details['snippet_manage']))
    {
        $snippet_manage_flag=1;
    }
        
    $snippet_usage_permission_flag=0;
    
    $xyz_ics_enable_snippet_usage_setting=get_option('xyz_ics_single_snippet_usage_setting_permission');
    
    if(get_option('xyz_ics_allow_snippet_usage_own_only')==0)
    {
        $role_permission = $wpdb->get_row( $wpdb->prepare("SELECT * FROM ".$wpdb->prefix."xyz_ics_role_privileges WHERE role=%s and privilege=%s and value=%d",array($current_user_role,"snippet_usage",1)));
            
        if(!empty($role_permission))
            $snippet_usage_permission_flag=1;
        else
        {
            $user_permission = $wpdb->get_row( $wpdb->prepare("SELECT * FROM ".$wpdb->prefix."xyz_ics_user_privileges WHERE user=%d and privilege=%s",array($current_user_id,"snippet_usage")));
                    
            if(!empty($user_permission))
                $snippet_usage_permission_flag=1;
        }
    }
    else
    {
        $snippet_usage_permission_flag=1;
        $owner_string=' AND t.user='.$current_user_id;
    }
        
    if($snippet_manage_flag==1)
    {
        if($snippet_type>0)
        {
            $snippet_string=" AND snippet_type=".$snippet_type;
            $snippet_string2=" AND r.snippet_type=".$snippet_type;
        }
        else
        {
            $snippet_string="";
            $snippet_string2="";
        }
        
        $table = "xyz_ics_short_code";
        
        //if($snippet_usage_permission_flag==1)
            //$snippet_ids_without_spec_perm_array = $wpdb->get_col('SELECT t.id FROM '.$wpdb->prefix.$table.' t WHERE t.status=1 '.$snippet_string.$owner_string.' NOT EXISTS(SELECT r.snippet_id FROM '.$wpdb->prefix.'xyz_ics_role_privileges r WHERE r.snippet_id=t.id '.$snippet_string2.' AND r.privilege="single_snippet_usage" AND r.role="'.$current_user_role.'")');
        
        if($xyz_ics_enable_snippet_usage_setting==1)
        {    
            $role_perm_snippet_ids_array = $wpdb->get_col("SELECT snippet_id FROM ".$wpdb->prefix."xyz_ics_role_privileges WHERE privilege='single_snippet_usage' and value=1 and role='".$current_user_role."'".$snippet_string);
            $user_perm_snippet_ids_array = $wpdb->get_col("SELECT snippet_id FROM ".$wpdb->prefix."xyz_ics_user_privileges WHERE privilege='single_snippet_usage' AND user=".$current_user_id.$snippet_string);
       
            $snippet_ids_with_spec_perm_str=' AND NOT EXISTS(SELECT r.snippet_id FROM '.$wpdb->prefix.'xyz_ics_role_privileges r WHERE r.snippet_id=t.id '.$snippet_string2.' AND r.privilege="single_snippet_usage")';
            
        }
        $owner_snippet_ids_array = $wpdb->get_col("SELECT id FROM ".$wpdb->prefix.$table." WHERE user=".$current_user_id.$snippet_string);
        
        if($snippet_usage_permission_flag==1)
        {
            $snippet_ids_without_spec_perm_array = $wpdb->get_col('SELECT t.id FROM '.$wpdb->prefix.$table.' t WHERE 1 '.$snippet_string.$owner_string.$snippet_ids_with_spec_perm_str);
        }
        
        $all_snippet_id_array0 = array_merge($snippet_ids_without_spec_perm_array, $role_perm_snippet_ids_array,$user_perm_snippet_ids_array,$owner_snippet_ids_array,$owner_snippet_ids_array);
        $all_snippet_id_array = array_unique($all_snippet_id_array0);
    }
    else
    {        
        if($snippet_type>0)
        {
            $snippet_string=" AND snippet_type=".$snippet_type;
            $snippet_string2=" AND r.snippet_type=".$snippet_type;
        }
        else
        {
            $snippet_string="";
            $snippet_string2="";
        }
        
        $table = "xyz_ics_short_code";
            
        //if($snippet_usage_permission_flag==1)
            //$snippet_ids_without_spec_perm_array1 = $wpdb->get_col('SELECT t.id FROM '.$wpdb->prefix.$table.' t WHERE t.status=1 AND '.$owner_string.' NOT EXISTS(SELECT r.snippet_id FROM '.$wpdb->prefix.'xyz_ics_role_privileges r WHERE r.snippet_id=t.id '.$snippet_string2.' AND r.privilege="single_snippet_usage" AND r.role="'.$current_user_role.'")');
            
        if($xyz_ics_enable_snippet_usage_setting==1)
        {
            $role_perm_snippet_ids_array1 = $wpdb->get_col("SELECT snippet_id FROM ".$wpdb->prefix."xyz_ics_role_privileges WHERE privilege='single_snippet_usage' and value=1 and role='".$current_user_role."'".$snippet_string);
            $user_perm_snippet_ids_array1 = $wpdb->get_col("SELECT snippet_id FROM ".$wpdb->prefix."xyz_ics_user_privileges WHERE privilege='single_snippet_usage' AND user=".$current_user_id.$snippet_string);
        
            $snippet_ids_with_spec_perm_str=' AND NOT EXISTS(SELECT r.snippet_id FROM '.$wpdb->prefix.'xyz_ics_role_privileges r WHERE r.snippet_id=t.id '.$snippet_string2.' AND r.privilege="single_snippet_usage")';
        }
        
        /*$snippet_type_id_array0 = array_merge($snippet_ids_without_spec_perm_array1, $role_perm_snippet_ids_array1,$user_perm_snippet_ids_array1);
        $snippet_type_id_array1 = array_unique($snippet_type_id_array0);
            
        if(!empty($snippet_type_id_array1))
            $snippet_type_id_array[$i] = $snippet_type_id_array1;*/
        
        if($snippet_usage_permission_flag==1)
        {
            $snippet_ids_without_spec_perm_array1 = $wpdb->get_col('SELECT t.id FROM '.$wpdb->prefix.$table.' t WHERE t.status=1 '.$owner_string.$snippet_ids_with_spec_perm_str);
        }
        
        $all_snippet_id_array0 = array_merge($snippet_ids_without_spec_perm_array1, $role_perm_snippet_ids_array1,$user_perm_snippet_ids_array1);
        $all_snippet_id_array = array_unique($all_snippet_id_array0);
        
    }
            
    if (!empty($all_snippet_id_array)) 
    {
        $permitted_snippet_ids = implode (",", $all_snippet_id_array);
    }
        
    if($permitted_snippet_ids!='')
        $permitted_snippet_ids=rtrim($permitted_snippet_ids,',');
    else
        $permitted_snippet_ids=0;
                
    $snippet_details['permitted_snippet_ids']=$permitted_snippet_ids;
    //$snippet_details['snippet_type_id_array']=$snippet_type_id_array;
    
    /*$snippet_details['snippet_ids_without_spec_perm']=$snippet_ids_without_spec_perm_array;
    $snippet_details['role_perm_snippet_ids']=$role_perm_snippet_ids_array;
    $snippet_details['user_perm_snippet_ids']=$user_perm_snippet_ids_array;
    $snippet_details['owner_snippet_ids']=$owner_snippet_ids_array;*/
    
    return $snippet_details;
}

add_action('xyz_ics_add_snippet_fields','xyz_ics_set_snippet_usage_permisions');
add_action('xyz_ics_edit_snippet_fields','xyz_ics_set_snippet_usage_permisions');
	
function xyz_ics_set_snippet_usage_permisions($snippet_info)
{
	global $wp_roles;
	global $wpdb;
	
	$role_permission="";	
	$xyz_ics_snippetId=0;
	
	$current_user_info= wp_get_current_user();
	$current_user_id=$current_user_info->ID;
		
	if ( !empty( $current_user_info->roles ) && is_array( $current_user_info->roles ) ) {
		foreach ( $current_user_info->roles as $role )
		{
			$current_user_role= $role;
			break;
		}
	}
	
	$usage_privilege_type=0;
	
	if(isset($_GET['snippetId']))
	    $xyz_ics_snippetId = $_GET['snippetId'];
	
	if($xyz_ics_snippetId>0)
	{
	    $usage_privilege_type=xyz_ics_get_snippet_usage_privilege_type($xyz_ics_snippetId);
	}
	
	$snippet_uasage_setting_permission_flag=0;
	$xyz_ics_single_snippet_usage_setting_permission=get_option('xyz_ics_single_snippet_usage_setting_permission');
	
	if($xyz_ics_single_snippet_usage_setting_permission==1)
	    $snippet_uasage_setting_permission_flag=1;
	
	/*$role_permission = $wpdb->get_row( $wpdb->prepare("SELECT * FROM ".$wpdb->prefix."xyz_ics_role_privileges WHERE role=%s and privilege=%s",array($current_user_role,"snippet_manage")));
		
	if(!empty($role_permission))
	{
		if($role_permission->value==1)
			$snippet_uasage_setting_permission_flag=1;
		else if($role_permission->value==2)
		{
			$user_permission = $wpdb->get_row( $wpdb->prepare("SELECT * FROM ".$wpdb->prefix."xyz_ics_user_privileges WHERE user=%d and privilege=%s",array($current_user_id,"snippet_manage")));
			
			if(!empty($user_permission))
				$snippet_uasage_setting_permission_flag=1;
		}
	}*/
	   
	if($snippet_uasage_setting_permission_flag==1)
	{
		$xyz_ics_snippetId='';
		$xyz_ics_snippetType='';
		
		if(isset($_GET['snippetId']))
			$xyz_ics_snippetId = $_GET['snippetId'];
		if(isset($_GET['snippet_type']))
		    $xyz_ics_snippetType = $_GET['snippet_type'];
		
		if($xyz_ics_snippetId!='')
		{
		    $role_permissions = $wpdb->get_results('SELECT * FROM '.$wpdb->prefix.'xyz_ics_role_privileges where snippet_id='.$xyz_ics_snippetId.' and snippet_type='.$xyz_ics_snippetType);
			$snippet_usage_permissions=array();
			
			foreach ($role_permissions as $role_permission)
			{
			    $snippet_usage_permissions[$role_permission->role]=$role_permission->value;
			}	
		}
		
		$cap='publish_posts';
		$roles = array_keys( $wp_roles->roles );
		
		if( !is_array( $roles ) )
			$roles = array( $roles );
		
		$hascap = array();
		
		foreach( $roles as $role ) {
			if( !isset( $wp_roles->roles[$role]['capabilities'][$cap] ) || ( 1 != $wp_roles->roles[$role]['capabilities'][$cap] ) )
				continue;
			$hascap[] = $role;
		}
		
		if( empty( $hascap ) )
			return false;
		?>
		<tr><td colspan="3"><h2>&nbsp;&nbsp;&nbsp;Snippet Usage privileges</h2></td><tr>
		
		<tr valign="top">
			<td colspan="3">
				<input type="radio" name="xyz_ics_usage_privilege_type" id="xyz_ics_usage_privilege_type_default" value="0" <?php if($usage_privilege_type==0)echo "checked";?> onclick="xyz_ics_usage_privilege_type_change();">
				Use default privilege
				<br>
				<input type="radio" name="xyz_ics_usage_privilege_type" id="xyz_ics_usage_privilege_type_override" value="1" <?php if($usage_privilege_type==1)echo "checked";?> onclick="xyz_ics_usage_privilege_type_change();">
				Override default privilege
			</td>
		</tr>
		<tr><td colspan="3" style="height:20px;"></td></tr>
						
		<?php 
		foreach ($hascap as $role_value => $role_name) 
		{
		    $users_selected_snippet_usage=xyz_ics_get_all_selected_users('single_snippet_usage',$role_name,$xyz_ics_snippetId,$xyz_ics_snippetType);
			$snippet_usage_permission_mode=1;
			
			if(isset($snippet_usage_permissions[$role_name]))
			     $snippet_usage_permission_mode=$snippet_usage_permissions[$role_name];
			?>
			<tr valign="top" class="xyz_ics_tr_user" style="display:none;">
    			<td scope="row" colspan="2" width="30%">&nbsp;&nbsp;&nbsp;<?php echo $role_name;?></td>
    			<td scope="row" width="50%">
        			<input type="radio" name="xyz_ics_premium_snippet_usage_<?php echo $role_value;?>" onclick="loadSearchfield('snippet_usage',<?php echo $role_value;?>,0)" value="0" <?php if($snippet_usage_permission_mode=='0') echo "checked"?> >
        			No permission<br>
        			<input type="radio" name="xyz_ics_premium_snippet_usage_<?php echo $role_value;?>" onclick="loadSearchfield('snippet_usage',<?php echo $role_value;?>,1)" value="1" <?php if($snippet_usage_permission_mode=='1') echo "checked"?>>
        			Permitted for all users in the role<br>
        			<input type="radio" name="xyz_ics_premium_snippet_usage_<?php echo $role_value;?>" onclick="loadSearchfield('snippet_usage',<?php echo $role_value;?>,2)" value="2" <?php  if($snippet_usage_permission_mode=='2') echo "checked"?>>
        			Permitted for specific users in the role<br>
        			<div>
            			<p style="margin-left:18px;margin-top:8px;" id="xyz_ics_premium_user_search_result_snippet_usage_<?php echo $role_value;?>" >
                			<?php
                		    $user_ids_array=explode(',',$users_selected_snippet_usage['user_ids']);
                		    $user_names_array=explode(',',$users_selected_snippet_usage['user_names']);
                		
                		    if($users_selected_snippet_usage['user_names']!='')
                		    {
                		        for($m=0;$m<count($user_names_array);$m++)
                		        {
                		            $uname=$user_names_array[$m];
                		            $uid=$user_ids_array[$m];
                		            ?>
                					<span id="user_span_snippet_usage_<?php echo $role_value;?>_<?php echo $uid;?>" class='xyz_ics_user_added'><?php echo $uname;?><span><span class='xyz_ics_remove_user' onclick="removeUser('<?php echo $uname;?>','snippet_usage',<?php echo $role_value;?>,<?php echo $uid;?>,'<?php echo $role_name;?>')" >x</span></span></span>
                			  		<?php 
                		        }
                		    }
                		    ?>
            			</p>
            			<div style="clear:both;padding-top:5px;">
            				<input style="display:none;margin-left: 23px;" value="" id="xyz_ics_premium_user_search_snippet_usage_<?php echo $role_value;?>" name="xyz_ics_premium_user_search_snippet_usage_<?php echo $role_value;?>" onkeyup="Load_UserSuggestion('snippet_usage',<?php echo $role_value;?>,'<?php echo $role_name;?>');" onblur="clearSearchbox('snippet_usage',<?php echo $role_value;?>)">
            				<input type="hidden" value="<?php echo $users_selected_snippet_usage['user_ids']?>"id="xyz_ics_premium_users_added_snippet_usage_<?php echo $role_value;?>" name="xyz_ics_premium_users_added_snippet_usage_<?php echo $role_value;?>">
            				<input type="hidden" value="<?php echo $users_selected_snippet_usage['user_names']?>" id="xyz_ics_premium_users_added_name_snippet_usage_<?php echo $role_value;?>" name="xyz_ics_premium_users_added_name_snippet_usage_<?php echo $role_value;?>">
            			</div>
            			<div class="xyz_ics_suggestionDiv" style="display:none;" id="suggestDiv_snippet_usage_<?php echo $role_value;?>" onmouseleave="hideSuggestion('snippet_usage',<?php echo $role_value;?>)"></div>
        			</div>
    			</td>
			</tr>
			<tr><td colspan="3" style="height:10px;"></td></tr>
		<?php 
		}
		?>
        
        <script type="text/javascript">

		jQuery(document).ready(function() {

			xyz_ics_usage_privilege_type_change();
			
			<?php foreach ($hascap as $role_value => $role_name) {
			
				$snippet_usage_permission_mode=1;
				
				if(isset($snippet_usage_permissions[$role_name]))
					$snippet_usage_permission_mode=$snippet_usage_permissions[$role_name];
				?>
			 	loadSearchfield('snippet_usage',<?php echo $role_value;?>,<?php echo $snippet_usage_permission_mode;?>);
			<?php }?>
		});

		function xyz_ics_usage_privilege_type_change()
		{
			var type=jQuery('input[name=xyz_ics_usage_privilege_type]:checked').val();
			if(type==0)
			{
				jQuery('.xyz_ics_tr_user').hide();
			}
			else
			{
				jQuery('.xyz_ics_tr_user').show();
			}
		}
					
		function Load_UserSuggestion(permission,role,role_name)
		{
			var xyz_suggestion_nonce= '<?php echo wp_create_nonce('xyz_ics_suggestion_nonce');?>';
		
			var search=jQuery("#xyz_ics_premium_user_search_"+permission+"_"+role).val();
			search=jQuery.trim(search);
		
			var searchResult=jQuery("#xyz_ics_premium_users_added_name_"+permission+"_"+role).val();

			var dataString = {
					action:'xyz_ics_load_user_suggestion',
					searchval:search,
					permission:permission,
					role:role,
					role_name:role_name,
					searchresult:searchResult,
					_wpnonce:xyz_suggestion_nonce
						};
			
			jQuery.post(ajaxurl, dataString, function(response) {
    			if(response!='')
    			{
    				jQuery("#suggestDiv_"+permission+"_"+role).html(response);
    				jQuery("#suggestDiv_"+permission+"_"+role).show();
    			}
    			else
    			{
    				jQuery("#suggestDiv_"+permission+"_"+role).hide();	
    			}
			});
		}
		
		function LoadSearchValue(id,permission,role,userid,role_name)
		{
			jQuery("#xyz_ics_premium_user_search_"+permission+"_"+role).val(id);
		
			var currentValue=jQuery("#xyz_ics_premium_users_added_name_"+permission+"_"+role).val();
			if(currentValue!='')
			    jQuery("#xyz_ics_premium_users_added_name_"+permission+"_"+role).val(currentValue+","+id);
			else
				jQuery("#xyz_ics_premium_users_added_name_"+permission+"_"+role).val(id+",");	
		
			var currentRes=jQuery("#xyz_ics_premium_user_search_result_"+permission+"_"+role).html();
			//var usrrmv="onclick='removeUser("+'"'+id+'"'+")'";
		
			var usrdel="onclick='removeUser("+'"'+id+'","'+permission+'",'+role+','+userid+',"'+role_name+'"'+")'";
			var userLabl="<span class='xyz_ics_user_added' id='user_span_"+permission+"_"+role+"_"+userid+"'>"+id+"<span><span class='xyz_ics_remove_user' "+usrdel+" >x</span></span></span>";
			jQuery("#xyz_ics_premium_user_search_result_"+permission+"_"+role).html(currentRes+userLabl);
		
			var usersAdded=jQuery("#xyz_ics_premium_users_added_"+permission+"_"+role).val();
		
			if(usersAdded!='')
				jQuery("#xyz_ics_premium_users_added_"+permission+"_"+role).val(usersAdded+","+userid);
			else
				jQuery("#xyz_ics_premium_users_added_"+permission+"_"+role).val(userid+",");
			
			Load_UserSuggestion(permission,role,role_name);
			//if(click==1)
			//jQuery("#suggestDiv_"+permission+"_"+role).hide();
			jQuery("#xyz_ics_premium_user_search_"+permission+"_"+role).val('');
		}
		
		function loadSearchfield(permission,role,value)
		{
			if(value==2)
			{
				jQuery("#xyz_ics_premium_user_search_"+permission+"_"+role).show();
				jQuery("#xyz_ics_premium_user_search_result_"+permission+"_"+role).show();
			}
			else
			{
				jQuery("#xyz_ics_premium_user_search_"+permission+"_"+role).hide();
				jQuery("#suggestDiv_"+permission+"_"+role).hide();
				jQuery("#xyz_ics_premium_user_search_result_"+permission+"_"+role).hide();
			}					
		}
		
		function clearSearchbox(permission,role)
		{
			searchValue=jQuery("#xyz_ics_premium_user_search_"+permission+"_"+role).val();
			if (searchValue.indexOf(",") >= 0)
			{
				var n = searchValue.lastIndexOf(",");
				var nsearchValue=searchValue.slice(0,n+1);
				jQuery("#xyz_ics_premium_user_search_"+permission+"_"+role).val(nsearchValue);
			}
			else
				jQuery("#xyz_ics_premium_user_search_"+permission+"_"+role).val('');
			//jQuery("#suggestDiv_"+permission+"_"+role).hide();
		}
		
		function hideSuggestion(permission,role)
		{
			jQuery("#suggestDiv_"+permission+"_"+role).hide();
		}
		
		function removeUser(uname,permission,role,userid,role_name)
		{
			var currentValue=jQuery("#xyz_ics_premium_users_added_name_"+permission+"_"+role).val();
		
			userNames = currentValue.replace(/(^,)|(,$)/g, "");
			if(userNames.indexOf(",")!==-1)
			{
				var userNamesArray=userNames.split(",");
				var nFlag=0;
				for (i = 0; i < userNamesArray.length; i++){
					if (userNamesArray[i] === uname)
					{
						userNamesArray.splice(i, 1);
						nFlag=1;
						userNames=userNamesArray.join();						
					}
				}
			}
			else if(userNames==uname)
			{
				userNames='';
			}
			jQuery("#xyz_ics_premium_users_added_name_"+permission+"_"+role).val(userNames);
		
			var usersAdded=jQuery("#xyz_ics_premium_users_added_"+permission+"_"+role).val();
			userIds = usersAdded.replace(/(^,)|(,$)/g, "");
			
			if(userIds.indexOf(",")!==-1)
			{
				var userIdArray=userIds.split(",");
				var iFlag=0;
				for (i = 0; i < userIdArray.length; i++){
					if (userIdArray[i] == userid)
					{
						userIdArray.splice(i, 1);
						iFlag=1;
						userIds=userIdArray.join();
					}
				}
			}
			else if(userIds==userid)
			{
				userIds='';
			}
			
			jQuery("#xyz_ics_premium_users_added_"+permission+"_"+role).val(userIds);//alert("#user_span_"+permission+"_"+role+"_"+userid);
			jQuery("#user_span_"+permission+"_"+role+"_"+userid).remove();				
		}
		</script>
		<?php 
	}
    return $snippet_info;
}
?>