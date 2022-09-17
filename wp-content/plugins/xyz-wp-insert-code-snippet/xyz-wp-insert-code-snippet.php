<?php 
/*
Plugin Name: XYZ WP Insert Code Snippet
Plugin URI: http://xyzscripts.com/wordpress-plugins/xyz-wp-insert-code-snippet/
Description: Add HTML/PHP code to your pages and posts easily using shortcodes. This plugin lets you create a shortcode corresponding to any random HTML code such as ad codes, javascript, video embedding, etc and also any random PHP code and use the same in your posts, pages or widgets.        
Version: 1.1
Author: xyzscripts.com
Author URI: http://xyzscripts.com/
Text Domain: xyz-wp-insert-code-snippet
License: GPLv2 or later
*/

/*
This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 2
of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
*/

if ( ! defined( 'ABSPATH' ) ) 
	exit;

//ob_start();
//error_reporting(E_ALL);
define('XYZ_WP_ICS_VALIDATOR_SERVER_COUNT',1);
define('XYZ_WP_INSERT_CODE_PRODUCT_CODE','XYZWPICSPRE');
define('XYZ_INSERT_CODE_PLUGIN_FILE',__FILE__);

require( dirname( __FILE__ ) . '/xyz-functions.php' );

require( dirname( __FILE__ ) . '/add_shortcode_tinymce.php' );

require( dirname( __FILE__ ) . '/admin/install.php' );

require( dirname( __FILE__ ) . '/admin/update-manager.php' );

require( dirname( __FILE__ ) . '/admin/menu.php' );

require( dirname( __FILE__ ) . '/shortcode-handler.php' );

require( dirname( __FILE__ ) . '/ajax-handler.php' );

require( dirname( __FILE__ ) . '/admin/action-hooks.php' );

require( dirname( __FILE__ ) . '/admin/uninstall.php' );

require( dirname( __FILE__ ) . '/widget.php' );

require( dirname( __FILE__ ) . '/direct_call.php' );

if(get_option('xyz_credit_link')=="ics")
{
	add_action('wp_footer', 'xyz_ics_credit');
}

function xyz_ics_credit() 
{	
	$content = '<div style="width:100%;text-align:center; font-size:11px; clear:both"><a target="_blank" title="XYZ WP Insert Code Snippet Wordpress Plugin" href="http://xyzscripts.com/wordpress-plugins/xyz-wp-insert-code-snippet/">XYZ WP Insert Code Snippets</a> Powered By : <a target="_blank" title="PHP Scripts & Wordpress Plugins" href="http://www.xyzscripts.com" >XYZScripts.com</a></div>';
	echo $content;
}
?>