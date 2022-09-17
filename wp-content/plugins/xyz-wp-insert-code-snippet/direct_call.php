<?php
if ( ! defined( 'ABSPATH' ) ) 
	exit;
	
function xyz_ics_plugin_query_vars($vars) 
{
	$vars[] = 'wp_ics';
	return $vars;
}
add_filter('query_vars', 'xyz_ics_plugin_query_vars');

function xyz_ics_plugin_parse_request($wp) 
{
	/*confirmation*/
	if (array_key_exists('wp_ics', $wp->query_vars) && $wp->query_vars['wp_ics'] == 'editor_plugin_js') 
	{
		require( dirname( __FILE__ ) . '/editor_plugin.js.php' );
		die;
	}
}
add_action('parse_request', 'xyz_ics_plugin_parse_request');

?>