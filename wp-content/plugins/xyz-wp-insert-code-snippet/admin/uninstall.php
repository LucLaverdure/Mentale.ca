<?php 
if ( ! defined( 'ABSPATH' ) ) 
	exit;
	
function xyz_ics_network_uninstall($networkwide) 
{
	global $wpdb;

	if (function_exists('is_multisite') && is_multisite()) 
	{
		// check if it is a network activation - if so, run the activation function for each blog id
		if ($networkwide) 
		{
			$old_blog = $wpdb->blogid;
			// Get all blog ids
			$blogids = $wpdb->get_col("SELECT blog_id FROM $wpdb->blogs");
			foreach ($blogids as $blog_id) 
			{
				switch_to_blog($blog_id);
				xyz_ics_uninstall();
			}
			switch_to_blog($old_blog);
			return;
		}
	}
	xyz_ics_uninstall();
}

function xyz_ics_uninstall()
{
	global $wpdb;
	
	delete_option("xyz_ics_sort_order");
	delete_option("xyz_ics_sort_field_name");
	delete_option("xyz_ics_limit");
	
	delete_option("xyz_ics_allow_snippet_manage_own_only");
	delete_option("xyz_ics_allow_snippet_usage_own_only");
	delete_option("xyz_ics_single_snippet_usage_setting_permission");
	delete_option('xyz_ics_rm_master_pwd');
	delete_option('xyz_ics_def_custom_params');
	/* table delete*/
	$wpdb->query("DROP TABLE ".$wpdb->prefix."xyz_ics_short_code");	
	$wpdb->query("DROP TABLE ".$wpdb->prefix."xyz_ics_role_privileges");
	$wpdb->query("DROP TABLE ".$wpdb->prefix."xyz_ics_user_privileges");
}

register_uninstall_hook( XYZ_INSERT_CODE_PLUGIN_FILE, 'xyz_ics_network_uninstall' );

?>