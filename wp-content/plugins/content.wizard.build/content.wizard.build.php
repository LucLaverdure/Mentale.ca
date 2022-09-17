<?php
   /*
   Plugin Name: Content.Wizard.Build
   Plugin URI: http://content.wizard.build
   description: Migrate Dynamic Content. Here. Now.
   Version: 1.00
   Author: Luc Laverdure
   Author URI: http://LucLaverdure.com
   License: GPL2
   */

defined( 'ABSPATH' ) or die( 'No script kiddies please!' );

define("WIZBUI_PLUGIN_PATH", __DIR__ . "/");
define("WIZBUI_PLUGIN_URL", plugins_url("", __FILE__) . "/");

@wp_enqueue_style("wiz.css", plugin_dir_url( __FILE__ )."/wiz.css");

// core Wizard.Build.Content admin panel
add_action('admin_menu', 'wizbui_setup_menu');
function wizbui_setup_menu(){
	include_once(WIZBUI_PLUGIN_PATH . "queue.php");
	add_menu_page( 'Content Wizard Build', 'Wizard.Build', 'manage_options', 'content-wizard-build', 'wizbui_callback', plugin_dir_url( __FILE__ ) ."/wizard-white.png" );
}
function wizbui_callback(){
	@wp_enqueue_style("filetree", plugin_dir_url( __FILE__ )."lib/jqueryFileTree.css");
	@wp_enqueue_script("jqEasing", plugin_dir_url( __FILE__ )."lib/jquery.easing.js");
	@wp_enqueue_script("filetreeJS", plugin_dir_url( __FILE__ )."lib/jqueryFileTree.js");
	include_once(WIZBUI_PLUGIN_PATH . "queue.php");
	if (!class_exists("DOMEvent")) include_once(WIZBUI_PLUGIN_PATH . "lib/phpQuery.php");
	include_once(WIZBUI_PLUGIN_PATH . 'includes/helper.functions.php');
	include_once(WIZBUI_PLUGIN_PATH . 'includes/upload.save.php');
	include(WIZBUI_PLUGIN_PATH . "wizbui-admin-page.php");
}

// core Wizard.Build.Content File Saver
add_action( 'admin_post_wb_save_hook', 'admin_post_wb_save_hook_callback' );
function admin_post_wb_save_hook_callback() {
	include_once(WIZBUI_PLUGIN_PATH . "queue.php");
	if (!class_exists("DOMEvent")) include_once(WIZBUI_PLUGIN_PATH . "lib/phpQuery.php");
	include_once(WIZBUI_PLUGIN_PATH . 'includes/helper.functions.php');
	include(WIZBUI_PLUGIN_PATH . "data.save.php");
}

// lib - file browser
add_action( 'admin_post_wb_browseme_hook', 'admin_post_wb_browseme_hook_callback' );
function admin_post_wb_browseme_hook_callback() {
	include_once(WIZBUI_PLUGIN_PATH . "lib/jqueryFileTree.php");
}

// core Wizard.Build.Content Cache Kill
add_action( 'admin_post_wb_delcache_hook', 'admin_post_wb_delcache_hook_callback' );
function admin_post_wb_delcache_hook_callback() {
	include_once(WIZBUI_PLUGIN_PATH . 'includes/helper.functions.php');
	wiz_del_files($_POST["killcache"]);
}

// core XLSX view
add_action( 'admin_post_wb_xlsx_hook', 'admin_post_wb_xlsx_hook_callback' );
function admin_post_wb_xlsx_hook_callback() {
	include_once(WIZBUI_PLUGIN_PATH . "includes/parse.php");
	$_REQUEST["file"] = str_replace("../","",$_REQUEST["file"]); // prevent accessing parent folders
	$_REQUEST["file"] = sanitize_file_name(WIZBUI_PLUGIN_PATH . "cache/".$_REQUEST["file"]);	
	preview_xlsx($_REQUEST["file"]);
}

// core CSV View
add_action( 'admin_post_wb_csv_hook', 'admin_post_wb_csv_hook_callback' );
function admin_post_wb_csv_hook_callback() {
	include_once(WIZBUI_PLUGIN_PATH . "includes/parse.php");
	$_REQUEST["file"] = str_replace("../","",$_REQUEST["file"]); // prevent accessing parent folders
	$_REQUEST["file"] = sanitize_file_name(WIZBUI_PLUGIN_PATH . "cache/".$_REQUEST["file"]);
	preview_csv($_REQUEST["file"]);
}


// core DB View
add_action( 'admin_post_wb_db_hook', 'admin_post_wb_db_hook_callback' );
function admin_post_wb_db_hook_callback() {
	include_once(WIZBUI_PLUGIN_PATH . "includes/parse.php");
	$_REQUEST["file"] = str_replace("../","",$_REQUEST["file"]); // prevent accessing parent folders
	$_REQUEST["file"] = sanitize_file_name(WIZBUI_PLUGIN_PATH . "cache/".$_REQUEST["file"]);
	preview_db($_REQUEST["file"]);
}

// core set Mappings
add_action( 'admin_post_wb_map_hook', 'admin_post_wb_map_hook_callback' );
function admin_post_wb_map_hook_callback() {
	if (!class_exists("DOMEvent")) include_once(WIZBUI_PLUGIN_PATH . "lib/phpQuery.php");
	include_once(WIZBUI_PLUGIN_PATH . "includes/parse.php");
	include_once(WIZBUI_PLUGIN_PATH . "mappings.php");
}

// core preview Mappings
add_action( 'admin_post_wb_map_preview_hook', 'admin_post_wb_map_preview_hook_callback' );
function admin_post_wb_map_preview_hook_callback() {
	if (!class_exists("DOMEvent")) include_once(WIZBUI_PLUGIN_PATH . "lib/phpQuery.php");
	include_once(WIZBUI_PLUGIN_PATH . "includes/parse.php");
	include_once(WIZBUI_PLUGIN_PATH . "mappings.php");
}

// core get new logs
add_action( 'admin_post_wb_logs_hook', 'admin_post_wb_logs_hook_callback' );
function admin_post_wb_logs_hook_callback() {
	if (!class_exists("DOMEvent")) include_once(WIZBUI_PLUGIN_PATH . "lib/tailcustom.php");
	$logs = WIZBUI_PLUGIN_PATH . "logs.txt";
	if (file_exists($logs)) {
		echo tailCustom($logs, 500);
	}
}

// add top bar quick actions
function add_toolbar_items($admin_bar){
	if (is_single()) {
	$url = '';
	
	$the_query = new WP_Query( array ( 'orderby' => 'rand', 'posts_per_page' => '1',  'post_status'=> 'draft' ) );
	// output the random post
	while ( $the_query->have_posts() ) : $the_query->the_post();
		$url = get_permalink();
	endwhile;

	// Reset Post Data
	wp_reset_postdata();
	
	$count_posts = wp_count_posts();
	$draft_posts = $count_posts->draft;
	
    $admin_bar->add_menu( array(
        'id'    => 'wiz-random',
        'title' => 'Random Draft Post ('.$draft_posts.')',
        'href'  => $url,
        'meta'  => array(
            'title' => __('Random Draft Post('.$draft_posts.')'),
        ),
    ));
	
		$tid = get_the_ID();
		$admin_bar->add_menu( array(
			'id'    => 'wiz-publish',
			'title' => 'Publish This Post',
			'href'  => $url.'&publishk='.$tid,
			'meta'  => array(
				'title' => __('Publish This Post'),
			),
		));

		$admin_bar->add_menu( array(
			'id'    => 'wiz-del-p',
			'title' => 'Delete This Post',
			'href'  => $url.'&delpk='.$tid,
			'meta'  => array(
				'title' => __('Delete This Post'),
			),
		));
		
		if (isset($_GET["publishk"]) && is_numeric($_GET["publishk"])) {
			$post = array( 'ID' => $_GET["publishk"], 'post_status' => 'publish' );
			wp_update_post($post);
		}

		if (isset($_GET["delpk"]) && is_numeric($_GET["delpk"])) {
			wp_trash_post ( $_GET["delpk"] );
		}
	}
}
add_action('admin_bar_menu', 'add_toolbar_items', 99999);
