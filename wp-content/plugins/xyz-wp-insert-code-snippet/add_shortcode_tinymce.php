<?php
if ( ! defined( 'ABSPATH' ) ) 
	exit;

if(!class_exists('XYZ_Insert_HTML_Code_TinyMCESelector')):

class XYZ_Insert_HTML_Code_TinyMCESelector
{
	var $buttonName = 'xyz_ics_snippet_selector_html';
	
	function addSelector()
	{
		// Don't bother doing this stuff if the current user lacks permissions
		if ( ! current_user_can('edit_posts') && ! current_user_can('edit_pages') )
			return;
	 
	   // Add only in Rich Editor mode
	    if ( get_user_option('rich_editing') == 'true') 
	    {
	    	add_filter('mce_external_plugins', array($this, 'registerTmcePlugin'));
	      	//you can use the filters mce_buttons_2, mce_buttons_3 and mce_buttons_4 
	      	//to add your button to other toolbars of your tinymce
	      	add_filter('mce_buttons', array($this, 'registerButton'));
	    }
	}
	
	function registerButton($buttons)
	{
		array_push($buttons, "separator", $this->buttonName);
		return $buttons;
	}
	
	function registerTmcePlugin($plugin_array)
	{
		$plugin_array[$this->buttonName] =get_site_url() . '/index.php?wp_ics=editor_plugin_js';
		if ( get_user_option('rich_editing') == 'true') 
		 	//var_dump($plugin_array);
		return $plugin_array;
	}
}

endif;

if(!isset($shortcodesXYZECH))
{
	$shortcodesXYZECH = new XYZ_Insert_HTML_Code_TinyMCESelector();
	add_action('admin_head', array($shortcodesXYZECH, 'addSelector'));
}

if(!class_exists('XYZ_Insert_PHP_Code_TinyMCESelector')):

class XYZ_Insert_PHP_Code_TinyMCESelector
{
	var $buttonName = 'xyz_ics_snippet_selector_php';

	function addSelector()
	{
		// Don't bother doing this stuff if the current user lacks permissions
		if ( ! current_user_can('edit_posts') && ! current_user_can('edit_pages') )
			return;

		// Add only in Rich Editor mode
		if ( get_user_option('rich_editing') == 'true')
		{
			add_filter('mce_external_plugins', array($this, 'registerTmcePlugin'));
			//you can use the filters mce_buttons_2, mce_buttons_3 and mce_buttons_4
			//to add your button to other toolbars of your tinymce
			add_filter('mce_buttons', array($this, 'registerButton'));
		}
	}

	function registerButton($buttons)
	{
		array_push($buttons, "separator", $this->buttonName);
		return $buttons;
	}

	function registerTmcePlugin($plugin_array)
	{
		$plugin_array[$this->buttonName] =get_site_url() . '/index.php?wp_ics=editor_plugin_js';
		
		if ( get_user_option('rich_editing') == 'true')
		//var_dump($plugin_array);
			return $plugin_array;
	}
}

endif;

if(!isset($shortcodesXYZECP))
{
	$shortcodesXYZECP = new XYZ_Insert_PHP_Code_TinyMCESelector();
	add_action('admin_head', array($shortcodesXYZECP, 'addSelector'));
}

?>