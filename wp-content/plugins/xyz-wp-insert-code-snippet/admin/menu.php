<?php
if ( ! defined( 'ABSPATH' ) ) 
	exit;
	

if(isset($_GET['page']) && isset($_GET['action']) && 
    (($_GET['page'] == 'xyz-wp-insert-code-snippet-manage' && ($_GET['action']=='snippet-edit' || $_GET['action']=='snippet-status' || $_GET['action']=='snippet-delete' || $_GET['action']=='snippet-duplicate' || $_GET['action']=='snippet-add')) 
    || ($_GET['page'] == 'xyz-wp-insert-code-snippet-key' && $_GET['action']=='get-latest')))
{
    ob_start();
}

if ((isset($_GET['page']) && ($_GET['page'] == 'xyz-wp-insert-code-snippet-manage' || $_GET['page'] == 'xyz-wp-insert-code-snippet-export' 
    || $_GET['page'] =='xyz-wp-insert-code-snippet-import' || $_GET['page'] =='xyz-wp-insert-code-snippet-manage-privileges' 
    || $_GET['page'] =='xyz-wp-insert-code-snippet-settings' || $_GET['page'] =='xyz-wp-insert-code-snippet-about'|| $_GET['page'] =='xyz-wp-insert-code-snippet-key'|| $_GET['page'] =='xyz-wp-insert-code-snippet-suggest-feature')))
{
    ob_start();
}

if(isset($_GET['call']) && $_GET['call']=='enter-pwd' )
{
    ob_start();
}


add_action('admin_menu', 'xyz_ics_menu');

function xyz_ics_menu()
{
	add_menu_page('insert-code-snippet', 'XYZ Snippet', 'manage_options', 'xyz-wp-insert-code-snippet-settings','xyz_ics_settings',plugins_url('xyz-wp-insert-code-snippet/images/logo.png'));
	add_submenu_page('xyz-wp-insert-code-snippet-settings', 'Code Snippets - Manage settings', 'Basic Settings', 'manage_options', 'xyz-wp-insert-code-snippet-settings' ,'xyz_ics_settings');
	
	add_submenu_page('xyz-wp-insert-code-snippet-settings', 'Code Snippets', 'Manage Snippets', 'publish_posts', 'xyz-wp-insert-code-snippet-manage','xyz_ics_snippets');
	
	add_submenu_page('xyz-wp-insert-code-snippet-settings', 'Code Snippets - Default custom parameters', 'Custom parameters', 'publish_posts', 'xyz-wp-insert-code-snippet-default-custom-parameters','xyz_ics_default_custom_params');
	
	add_submenu_page('xyz-wp-insert-code-snippet-settings', 'Code Snippets - Manage Privileges', 'Manage Privileges', 'manage_options', 'xyz-wp-insert-code-snippet-manage-privileges' ,'xyz_ics_manage_privileges');
	
	add_submenu_page('xyz-wp-insert-code-snippet-settings', 'Code Snippets - Export', 'Export', 'manage_options', 'xyz-wp-insert-code-snippet-export' ,'xyz_ics_export');	
	add_submenu_page('xyz-wp-insert-code-snippet-settings', 'Code Snippets - Import', 'Import', 'manage_options', 'xyz-wp-insert-code-snippet-import' ,'xyz_ics_import');
		
	add_submenu_page('xyz-wp-insert-code-snippet-settings', 'Code Snippets - License Key', 'License Key', 'manage_options', 'xyz-wp-insert-code-snippet-key' ,'xyz_ics_license'); 
	add_submenu_page('xyz-wp-insert-code-snippet-settings', 'Code Snippets - About', 'About', 'manage_options', 'xyz-wp-insert-code-snippet-about' ,'xyz_ics_about');
	add_submenu_page('xyz-wp-insert-code-snippet-settings', 'Code Snippets - Suggest Feature', 'Suggest a Feature', 'manage_options', 'xyz-wp-insert-code-snippet-suggest-feature' ,'xyz_ics_suggest_feature');
}

function xyz_ics_snippets()
{
	$formflag = 0;
	
	if(isset($_GET['action']) && $_GET['action']=='snippet-delete' )
	{
		apply_filters('xyz_ics_before_page_excecute',array());
		include(dirname( __FILE__ ) . '/snippet-delete.php');
		$formflag=1;
	}
	if(isset($_GET['action']) && $_GET['action']=='snippet-edit' )
	{
		apply_filters('xyz_ics_before_page_excecute',array());
		require( dirname( __FILE__ ) . '/header.php' );
		include(dirname( __FILE__ ) . '/snippet-edit.php');
		require( dirname( __FILE__ ) . '/footer.php' );
		$formflag=1;
	}
	if(isset($_GET['action']) && $_GET['action']=='snippet-add' )
	{
		require( dirname( __FILE__ ) . '/header.php' );
		require( dirname( __FILE__ ) . '/snippet-add.php' );
		require( dirname( __FILE__ ) . '/footer.php' );
		$formflag=1;
	}
	if(isset($_GET['action']) && $_GET['action']=='snippet-duplicate' )
	{
	    apply_filters('xyz_ics_before_page_excecute',array());
		require( dirname( __FILE__ ) . '/header.php' );
		include(dirname( __FILE__ ) . '/snippet-duplicate.php');
		require( dirname( __FILE__ ) . '/footer.php' );
		$formflag=1;
	}
	if(isset($_GET['action']) && $_GET['action']=='snippet-status' )
	{
		apply_filters('xyz_ics_before_page_excecute',array());
		require( dirname( __FILE__ ) . '/snippet-status.php' );
		$formflag=1;
	}
	if($formflag == 0)
	{
	    apply_filters('xyz_ics_before_page_excecute',array());
		require( dirname( __FILE__ ) . '/header.php' );
		require( dirname( __FILE__ ) . '/snippets.php' );
		require( dirname( __FILE__ ) . '/footer.php' );
	}
}

function xyz_ics_export()
{
    apply_filters('xyz_ics_before_page_excecute',array());
	require( dirname( __FILE__ ) . '/header.php' );
	require( dirname( __FILE__ ) . '/export.php' );
	require( dirname( __FILE__ ) . '/footer.php' );
}

function xyz_ics_import()
{
    apply_filters('xyz_ics_before_page_excecute',array());
	require( dirname( __FILE__ ) . '/header.php' );
	require( dirname( __FILE__ ) . '/import.php' );
	require( dirname( __FILE__ ) . '/footer.php' );
}

function xyz_ics_settings()
{
	if(isset($_GET['action']) && $_GET['action']=='get-latest-geo' )
	{
		require( dirname( __FILE__ ) . '/../xyz-get-latest.php' );
		xyz_wp_ics_get_latest_geoip();
	}
	apply_filters('xyz_ics_before_page_excecute',array());
	require( dirname( __FILE__ ) . '/header.php' );
	require( dirname( __FILE__ ) . '/settings.php' );
	require( dirname( __FILE__ ) . '/footer.php' );
	
}

function xyz_ics_license()
{
    $formflag=0;
    
    if(isset($_GET['action']) && $_GET['action']=='get-latest' )
    {
       // require( dirname( __FILE__ ) . '/../xyz-update-plugin.php' );
        require( dirname( __FILE__ ) . '/../xyz-get-latest.php' );
        xyz_wp_ics_get_latest_plugin();
        $formflag=1;
    }
    if($formflag==0)
    {
        apply_filters('xyz_ics_before_page_excecute',array());
        require( dirname( __FILE__ ) . '/header.php' );
        require( dirname( __FILE__ ) . '/xyz-wp-ics-key.php' );
        require( dirname( __FILE__ ) . '/footer.php' );
    }
}

function xyz_ics_about()
{
	apply_filters('xyz_ics_before_page_excecute',array());
	require( dirname( __FILE__ ) . '/header.php' );
	require( dirname( __FILE__ ) . '/about.php' );
	require( dirname( __FILE__ ) . '/footer.php' );
}

function xyz_ics_manage_privileges()
{
	if(isset($_GET['call']) && $_GET['call']=='enter-pwd' )
	{
		require( dirname( __FILE__ ) . '/header.php' );
		require( dirname( __FILE__ ) . '/enter-password.php' );
		require( dirname( __FILE__ ) . '/footer.php' );
	}
	else 
	{
		apply_filters('xyz_ics_before_page_excecute',array());
		require( dirname( __FILE__ ) . '/header.php' );
		require( dirname( __FILE__ ) . '/manage-privileges.php' );
		require( dirname( __FILE__ ) . '/footer.php' );
	}
}
function xyz_ics_default_custom_params()
{
	apply_filters('xyz_ics_before_page_excecute',array());
	require( dirname( __FILE__ ) . '/header.php' );
	require( dirname( __FILE__ ) . '/default-custom-parameters.php' );
	require( dirname( __FILE__ ) . '/footer.php' );
}
function xyz_ics_suggest_feature()
{
	apply_filters('xyz_ics_before_page_excecute',array());
	require( dirname( __FILE__ ) . '/header.php' );
	require( dirname( __FILE__ ) . '/suggest-feature.php' );
	require( dirname( __FILE__ ) . '/footer.php' );
}

function xyz_ics_add_style_script()
{
	wp_enqueue_script('jquery');
	
	wp_register_script( 'xyz_notice_script', plugins_url('xyz-wp-insert-code-snippet/js/notice.js') );
	wp_enqueue_script( 'xyz_notice_script' );
	
	// Register stylesheets
	wp_register_style('xyz_ics_style', plugins_url('xyz-wp-insert-code-snippet/css/xyz_ics_styles.css'));
	wp_enqueue_style('xyz_ics_style');
 	
	wp_enqueue_script('thickbox');
	wp_enqueue_style('thickbox');
	//Syntax Highlighting
	if ((isset($_GET['page']) && ($_GET['page'] == 'xyz-wp-insert-code-snippet-manage') && isset($_GET['action']) && ($_GET['action'] == 'snippet-add'))
	    || (isset($_GET['page']) && ($_GET['page'] == 'xyz-wp-insert-code-snippet-manage') && isset($_GET['action']) && ($_GET['action'] == 'snippet-edit')))
	{
	    // Register scripts
	    wp_register_script( 'xyz_ics_codemirror_script', plugins_url('xyz-wp-insert-code-snippet/js/codemirror/codemirror.js') );
	    wp_enqueue_script( 'xyz_ics_codemirror_script' );
	    
	    wp_register_script( 'xyz_ics_matchbrackets_script', plugins_url('xyz-wp-insert-code-snippet/js/codemirror/matchbrackets.js') );
	    wp_enqueue_script( 'xyz_ics_matchbrackets_script' );
	    
	    wp_register_script( 'xyz_ics_xml_script', plugins_url('xyz-wp-insert-code-snippet/js/codemirror/xml.js') );
	    wp_enqueue_script( 'xyz_ics_xml_script' );
	    
	    wp_register_script( 'xyz_ics_javascript_script', plugins_url('xyz-wp-insert-code-snippet/js/codemirror/javascript.js') );
	    wp_enqueue_script( 'xyz_ics_javascript_script' );
	    
	    wp_register_script( 'xyz_ics_css_script', plugins_url('xyz-wp-insert-code-snippet/js/codemirror/css.js') );
	    wp_enqueue_script( 'xyz_ics_css_script' );
	    
	    wp_register_script( 'xyz_ics_htmlmixed_script', plugins_url('xyz-wp-insert-code-snippet/js/codemirror/htmlmixed.js') );
	    wp_enqueue_script( 'xyz_ics_htmlmixed_script' );
	    
	    wp_register_script( 'xyz_ics_clike_script', plugins_url('xyz-wp-insert-code-snippet/js/codemirror/clike.js') );
	    wp_enqueue_script( 'xyz_ics_clike_script' );
	    
	    wp_register_script( 'xyz_ics_php_script', plugins_url('xyz-wp-insert-code-snippet/js/codemirror/php.js') );
	    wp_enqueue_script( 'xyz_ics_php_script' );
	    
	    wp_register_script( 'xyz_ics_bootstrap_duallistbox_script', plugins_url('xyz-wp-insert-code-snippet/js/jquery.bootstrap-duallistbox.min.js') );
	    wp_enqueue_script( 'xyz_ics_bootstrap_duallistbox_script' );
	    
	    // Register stylesheets
	    wp_register_style('xyz_ics_codemirror', plugins_url('xyz-wp-insert-code-snippet/css/codemirror.css'));
	    wp_enqueue_style('xyz_ics_codemirror');
	    
	    wp_register_style('xyz_ics_bootstrap_duallistbox_style', plugins_url('xyz-wp-insert-code-snippet/css/bootstrap-duallistbox.min.css'));
	    wp_enqueue_style('xyz_ics_bootstrap_duallistbox_style');
	    
	    
	    
	}	
}

add_action('admin_enqueue_scripts', 'xyz_ics_add_style_script');

?>