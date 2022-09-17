<?php

/*error_reporting(E_ALL);
ini_set("display_errors", 1);*/

if( ! defined( 'ABSPATH' ) ){
	exit; // Exit if accessed directly
}

if ( $visibility = mfn_opts_get( 'builder-visibility' ) ) {
	if ( $visibility == 'hide' || ( ! current_user_can( $visibility ) ) ) {
		return false;
	}
}

$post_types_disable = mfn_opts_get('post-type-disable');

$replaced_logo = apply_filters('betheme_logo', '') ? 'style="background-image:url('. apply_filters('betheme_logo_nohtml', ''). ')"' : '';

require_once( get_theme_file_path('/functions/builder/class-mfn-builder-front.php') );
require_once( get_theme_file_path('/functions/builder/class-mfn-builder-items.php') );
require_once(get_theme_file_path('/functions/builder/class-mfn-builder-ajax.php'));
require_once(get_theme_file_path('/functions/builder/pre-built/class-mfn-single-page-import-api.php'));
require_once(get_theme_file_path('/muffin-options/fields/class-mfn-options-field.php'));

if ( ! isset( $post_types_disable['portfolio'] ) ) {
	require_once( get_theme_file_path('/functions/post-types/class-mfn-post-type-portfolio.php') );
}
require_once( get_theme_file_path('/functions/post-types/class-mfn-post-type-page.php') );
require_once( get_theme_file_path('/functions/post-types/class-mfn-post-type-post.php') );

require_once( get_theme_file_path('/muffin-options/icons.php') );

require_once( get_theme_file_path('/visual-builder/classes/visual-builder-class.php') );

// old editor link
add_action( 'edit_form_after_title', 'mfnvb_ce_live_button' );

function mfnvb_ce_live_button($post) {
	if(in_array($post->post_type, array('page', 'post', 'portfolio', 'template', 'product'))){
		global $replaced_logo;

		$link = admin_url('/post.php?post='. $post->ID .'&preview=true&action='. apply_filters('betheme_slug', 'mfn') .'-live-builder');

		if( get_post_status($post->ID) == 'publish' ){
			$link = admin_url('/post.php?post='. $post->ID .'&action='. apply_filters('betheme_slug', 'mfn').'-live-builder');
		}

		echo '<div class="mfn-live-edit-page-button classic"><a '. $replaced_logo .' href="'.$link.'" class="mfn-btn mfn-switch-live-editor button-hero mfn-btn-green button button-primary">Edit with '. apply_filters('betheme_label', "Be") .'Builder</a></div>';
	}
}

// gutenberg script
add_action( 'enqueue_block_editor_assets', 'mfnvb_gutenberg_functions' );

function mfnvb_gutenberg_functions() {
    wp_enqueue_script(
        'mfn-page-edit-button',
        get_theme_file_uri('/visual-builder/assets/js/button.js'),
        array( 'wp-blocks', 'wp-element', 'wp-block-editor' ),
        time()
    );
}

// add live builder link in admin page table
add_filter( 'post_row_actions', 'mfnvb_list_row_actions', 10, 2 );
add_filter( 'page_row_actions', 'mfnvb_list_row_actions', 10, 2 );

function mfnvb_list_row_actions( $actions, $post ) {
    if ( in_array($post->post_type, array("page", "post", "portfolio", "template", "product")) ) {
 		$actions[] = '<span class="mfn-edit-link"><a href="'.admin_url( 'post.php?post=' . $post->ID . '&action='. apply_filters('betheme_slug', 'mfn') .'-live-builder' ).'" aria-label="Edit with '. apply_filters('betheme_label', "Be") .'Builder">Edit with '. apply_filters('betheme_label', "Be") .'Builder</a></span>';
    }
    return $actions;
}

// init vb class
add_action( 'post_action_'. apply_filters('betheme_slug', 'mfn') .'-live-builder', 'mfnvb_init_vb' );

function mfnvb_init_vb($post_id){

	$mfnVisualBuilder = new MfnVisualBuilder();
	$mfnVisualBuilder->mfn_load_sidebar();

	exit();
}

// save draft
add_action( 'wp_ajax_mfnvbsavedraft', 'mfnvb_save_draft'  );

function mfnvb_save_draft(){

	if(!is_user_logged_in()){ wp_die(); }
	check_ajax_referer( 'mfn-builder-nonce', 'mfn-builder-nonce' );

	if( get_post_status($_POST['id']) == 'auto-draft' ){

		$name = 'BeBuilder #'.$_POST['id'];
		$slug = sanitize_title($name);

		wp_update_post( array(
			'ID'           	=> $_POST['id'],
			'post_title'    => $name,
		  	'post_name'		=> $slug,
			'post_status'   => 'draft',
		));

		update_post_meta($_POST['id'], 'mfn-page-items', '');

		if( !empty($_POST['tmpl']) ){
			update_post_meta($_POST['id'], 'mfn_template_type', $_POST['tmpl']);
		}

	}

	wp_die();
}

// take post editing
add_action( 'wp_ajax_takepostediting', 'mfnvb_take_post_editing'  );

function mfnvb_take_post_editing(){

	if(!is_user_logged_in()){ wp_die(); }
	check_ajax_referer( 'mfn-builder-nonce', 'mfn-builder-nonce' );

	$request = $_POST;
	$post_id = $request['pageid'];

	wp_set_post_lock( $post_id );

	wp_die();
}

// update view
add_action( 'wp_ajax_updatevbview', 'mfnvb_updateVbView' );

function mfnvb_updateVbView(){

	$admin = new Mfn_Builder_Admin();
	$sel_prefix = '';

	if(!is_user_logged_in()){ wp_die(); }
	check_ajax_referer( 'mfn-builder-nonce', 'mfn-builder-nonce' );

	$style_str = '';

	$save = array();

	$request = $_POST;
	$post_id = $request['pageid'];

	$post_type = get_post_type($post_id);
	if( $post_type == 'template' && get_post_meta($post_id, 'mfn_template_type', true) == 'header' ){
		$style_str .= '.mfn-header-tmpl ';
	}

	$mfn_update_post = array(
    	'ID' => $post_id,
    	'post_modified' => date('Y-m-d H:i:s'),
    	'post_modified_gmt' => gmdate('Y-m-d H:i:s', time())
	);

	if( isset($request['savetype']) && in_array($request['savetype'], array('draft', 'publish')) ){
		$mfn_update_post['post_status'] = $request['savetype'];
	}

	wp_update_post( $mfn_update_post );

	/** START template conditions */
	if ( function_exists('is_woocommerce') && get_post_type( $post_id ) == 'template' ){
		// conditions
		if ( isset( $_POST['mfn_template_conditions'] ) && is_array( $_POST['mfn_template_conditions'] ) && count($_POST['mfn_template_conditions']) > 0 ) {
			$tmpl_conditions = $_POST['mfn_template_conditions'];
			if( get_post_meta($post_id, 'mfn_template_type', true) == 'header'){
				update_post_meta( $post_id, 'mfn_header_conditions', json_encode( $tmpl_conditions ) );
			}else{
				update_post_meta( $post_id, 'mfn_template_conditions', json_encode( $tmpl_conditions ) );
			}
		}else{
			if( get_post_meta($post_id, 'mfn_template_type', true) == 'header'){
				delete_post_meta( $post_id, 'mfn_header_conditions' );
			}else{
				delete_post_meta( $post_id, 'mfn_template_conditions' );
			}
		}
		$admin->set_templates_conditions();
	}
	/** END template conditions */

	if( isset($request['sections']) && count($request['sections']) > 0 ){

		$mfn_styles = Mfn_Helper::preparePostUpdate($request['sections'], $post_id);

		if(isset($mfn_styles['fonts']) && count($mfn_styles['fonts']) > 0){
			update_post_meta( $post_id, 'mfn-page-fonts', json_encode($mfn_styles['fonts']) );
		}else{
			delete_post_meta( $post_id, 'mfn-page-fonts' );
		}

		if( count($mfn_styles) > 0 ){
			$styles = $mfn_styles;
			unset($styles['sections']);
			update_post_meta( $post_id, 'mfn-page-local-style', json_encode($styles) );
			Mfn_Helper::generate_css($styles, $post_id);

			//print_r($mfn_styles);
		}else{
			delete_post_meta( $post_id, 'mfn-page-local-style' );
		}

		$save = wp_unslash($mfn_styles['sections']);

		if ( 'encode' == mfn_opts_get('builder-storage') ) {
			$new = call_user_func('base'.'64_encode', serialize($save));
		}else{
			$new = wp_slash( $save );
		}
		$old = get_post_meta($post_id, 'mfn-page-items', true);

		if (isset($new) && $new != $old) {
			update_post_meta($post_id, 'mfn-page-items', $new);

			$mfn_ajax = new Mfn_Builder_Ajax();
			$revisions = $mfn_ajax->set_revision( $post_id, 'update', $new );

			wp_send_json( $mfn_ajax->get_revisions_json( $revisions ) );

		}
	}else{
		delete_post_meta($post_id, 'mfn-page-items');
	}

	wp_die();
}

// generate preview
add_action( 'wp_ajax_generatepreview', 'mfnvb_generatePreview'  );

function mfnvb_generatePreview(){

	if(!is_user_logged_in()){ wp_die(); }
	check_ajax_referer( 'mfn-builder-nonce', 'mfn-builder-nonce' );

	$request = $_POST;
	$post_id = $request['pageid'];
	$type = $request['gtype'];

	if( isset($request['sections']) && count($request['sections']) > 0 ){

		$mfn_styles = Mfn_Helper::preparePostUpdate($request['sections'], $post_id);

		if(count($mfn_styles['fonts']) > 0){
			update_post_meta( $post_id, 'mfn-builder-preview-fonts', json_encode($mfn_styles['fonts']) );
		}else{
			delete_post_meta( $post_id, 'mfn-builder-preview-fonts' );
		}

		if( count($mfn_styles) > 0 ){
			update_post_meta( $post_id, 'mfn-builder-preview-local-style', json_encode($mfn_styles) );
			Mfn_Helper::generate_css($mfn_styles, $post_id, 'preview');

			// print_r($mfn_styles);
		}else{
			delete_post_meta( $post_id, 'mfn-builder-preview-local-style' );
		}

		$save = wp_unslash($mfn_styles['sections']);

		if ( 'encode' == mfn_opts_get('builder-storage') ) {
			$new = call_user_func('base'.'64_encode', serialize($save));
		}else{
			$new = wp_slash( $save );
		}

		update_post_meta($post_id, $type, $new);

	}else{
		delete_post_meta($post_id, $type);
	}

	$preview_link = str_replace('preview=true', apply_filters('betheme_slug', 'mfn').'-preview=true', get_preview_post_link($post_id));
	wp_send_json( $preview_link );

	wp_die();
}

// set revision
add_action( 'wp_ajax_setrevision', 'mfnvb_set_revision'  );

function mfnvb_set_revision(){

	if(!is_user_logged_in()){ wp_die(); }
	check_ajax_referer( 'mfn-builder-nonce', 'mfn-builder-nonce' );

	$request = $_POST;
	$post_id = $request['pageid'];
	$type = $request['revtype'];

	if( !empty($request['sections']) ){
		$sections = $request['sections'];

		ksort($sections);

		$save = wp_unslash($sections);

		$new = call_user_func('base'.'64_encode', serialize($save));

		$mfn_ajax = new Mfn_Builder_Ajax();
		$revisions = $mfn_ajax->set_revision( $post_id, $type, $new );
		wp_send_json( $mfn_ajax->get_revisions_json( $revisions ) );
	}else{
		echo 'empty';
	}



	wp_die();
}

// copy to clipboard

add_action( 'wp_ajax_mfntoclipboard', 'mfnvb_copytoclipboard'  );

function mfnvb_copytoclipboard(){

	if(!is_user_logged_in()){ wp_die(); }
	check_ajax_referer( 'mfn-builder-nonce', 'mfn-builder-nonce' );

	if( !empty($_POST['sections']) ){
		$save = wp_unslash( $_POST['sections'] );
		$view = call_user_func('base'.'64_encode', serialize($save));
		echo $view;
	}else{
		echo '';
	}

	wp_die();
}

// save preset

add_action( 'wp_ajax_mfnsavepreset', 'mfnvb_savepreset' );

function mfnvb_savepreset(){

	if(!is_user_logged_in()){ wp_die(); }
	check_ajax_referer( 'mfn-builder-nonce', 'mfn-builder-nonce' );

	$mfnvb = new MfnVisualBuilder();
	$all = $mfnvb->getPresets();

	$new_item = array();

	$items = !empty($_POST['sections']) ? $_POST['sections'] : [];
	$name = $_POST['name'];
	$item = $_POST['item'];

	$new_item['name'] = $name;
	$new_item['item'] = $item;
	$new_item['type'] = 'custom';
	$new_item['uid'] = Mfn_Builder_Helper::unique_ID();
	$new_item['fields'] = $items;

	$all[] = $new_item;

	update_option( 'mfn-presets', json_encode( $all ) );

	wp_send_json( $mfnvb->getPresets(true) );

	wp_die();
}

add_action('wp_ajax_mfnremovepreset', 'mfnvb_removepreset');

function mfnvb_removepreset() {
	if(!is_user_logged_in()){ wp_die(); }
	check_ajax_referer( 'mfn-builder-nonce', 'mfn-builder-nonce' );

	$mfnvb = new MfnVisualBuilder();
	$all = $mfnvb->getPresets();

	$new = array();

	$id = $_POST['item'];

	if( count( $all ) > 0 ){

		foreach ($all as $v) {
			if( $v->uid != $id ){
				$new[] = $v;
			}
		}
	}

	update_option( 'mfn-presets', json_encode( $new ) );

	echo 'ok';
	wp_die();
}


add_action('wp_ajax_mfnimportpreset', 'mfnvb_importpresets');

function mfnvb_importpresets() {
	if(!is_user_logged_in()){ wp_die(); }
	check_ajax_referer( 'mfn-builder-nonce', 'mfn-builder-nonce' );

	$mfnvb = new MfnVisualBuilder();
	$all = $mfnvb->getPresets(true);
	$custom = $mfnvb->getPresets();

	$new = $_POST['val'];

	if( count( $new ) > 0 ){

		foreach ($new as $n) {
			//echo $n['uid'].' imported | ';
			$n['type'] = 'custom';

			$check_uid = array_filter($all, function($obj) use ($n) {
			    if (isset($obj->uid) && $obj->uid == $n['uid']) return true;

			    return false;
			});

			if( !$check_uid ) $custom[] = $n;
		}

	}

	update_option( 'mfn-presets', json_encode( $custom ) );
	wp_send_json( $mfnvb->getPresets(true) );

	wp_die();
}



// restore revision
add_action( 'wp_ajax_restorerevision', 'mfnvb_restore_revision'  );

function mfnvb_restore_revision(){

	if(!is_user_logged_in()){ wp_die(); }
	check_ajax_referer( 'mfn-builder-nonce', 'mfn-builder-nonce' );

	$uids = [];
	$return = array();

	$mfnvb = new MfnVisualBuilder();

	$time = htmlspecialchars(trim($_POST['time']));
	$type = htmlspecialchars(trim($_POST['type']));
	$post_id = htmlspecialchars(trim($_POST['pageid']));

	if( ! $post_id || ! $time || ! $type ){
		return false;
	}

	$old = get_post_meta($post_id, 'mfn-page-items', true);

	// backup current version
	$mfn_ajax = new Mfn_Builder_Ajax();
	$revisions = $mfn_ajax->set_revision( $post_id, 'backup', $old );
	$return['revisions'] = $mfn_ajax->get_revisions_json( $revisions );

	$meta_key = 'mfn-builder-revision-'. $type;

	$revision_torestore = get_post_meta( $post_id, $meta_key, true );

	if( ! empty( $revision_torestore[$time] ) ){

		// unserialize backup

		if( !is_array($revision_torestore[$time]) ){
			$mfn_items = unserialize(call_user_func('base'.'64_decode', $revision_torestore[$time]));
		}else{
			$mfn_items = $revision_torestore[$time];
		}


		if ( is_array( $mfn_items ) ) {

			$mfn_items = Mfn_Builder_Helper::unique_ID_reset($mfn_items, $uids);

			$form = $mfnvb->loadElementsArr($mfn_items);

			ob_start();

			$front = new Mfn_Builder_Front($post_id);
			$front->show($mfn_items);

			$html = ob_get_contents();

			ob_end_clean();

			$navigator = MfnVisualBuilder::getNavigatorTree($mfn_items);

			$return['html'] = $html;
			$return['form'] = $form;
			$return['navigator'] = $navigator;

			wp_send_json($return);

		}

	}


	wp_die();
}

// re render content
add_action('wp_ajax_rendercontent', 'mfnvb_contentrender');

function mfnvb_contentrender(){
	$return = array();
	if(!is_user_logged_in()){ wp_die(); }
	check_ajax_referer( 'mfn-builder-nonce', 'mfn-builder-nonce' );

	$val = wp_unslash($_POST['val']);
	//echo do_shortcode($val);

	$return['html'] = do_shortcode($val, true);
	$return['uid'] = $_POST['uid'];

	wp_send_json($return);
	wp_die();
}

add_action('wp_ajax_mfn_post_option', 'mfnvb_savepostoption');

function mfnvb_savepostoption(){

	if(!is_user_logged_in()){ wp_die(); }
	check_ajax_referer( 'mfn-builder-nonce', 'mfn-builder-nonce' );

	$id = $_POST['id'];
	$option = $_POST['option'];
	$value = $_POST['value'];

	update_post_meta($id, $option, $value);

	wp_die();
}


// re render widget
add_action('wp_ajax_rerenderwidget', 'mfnvb_render_widget');

function mfnvb_render_widget(){
	if(!is_user_logged_in()){ wp_die(); }
	check_ajax_referer( 'mfn-builder-nonce', 'mfn-builder-nonce' );

	$type = $_POST['type'];
	$attr = $_POST['attri'];
	$content = '';

	if(isset($attr['tabs']) && count($attr['tabs']) > 0){
		foreach ($attr['tabs'] as $t=>$tab) {
			if(isset($tab['content'])){
				$attr['tabs'][$t]['content'] = wp_unslash( $tab['content'] );
			}
		}
	}

	$fun_name = 'sc_'.$type;

	if(!empty($attr['content'])){
		$content = $attr['content'];
		wp_send_json($fun_name($attr, $content));
	}elseif($type == 'slider_plugin'){
		wp_send_json('<div class="mfn-widget-placeholder mfn-wp-revolution"></div>');
	}elseif($type == 'image_gallery'){
		wp_send_json(sc_gallery($attr));
	}elseif($type == 'shop' && class_exists( 'WC_Shortcode_Products' )){
		$shortcode = new WC_Shortcode_Products( $attr, $attr['type'] );
		wp_send_json($shortcode->get_content());
	}elseif($type == 'shop_products'){
		unset($attr['title']);
		wp_send_json( sc_shop_products($attr, 'sample') );
	}else{
		wp_send_json($fun_name($attr));
	}

	wp_die();
}

// import data
add_action('wp_ajax_importdata', 'mfnvb_import_data');

function mfnvb_import_data(){
	if(!is_user_logged_in()){ wp_die(); }
	check_ajax_referer( 'mfn-builder-nonce', 'mfn-builder-nonce' );

	$return = array();

	$mfn_helper = new Mfn_Builder_Helper();
	$mfnvb = new MfnVisualBuilder();

	$id = $_POST['id'];
	$count = $_POST['count'];

	$uids = [];
	$mfn_items = unserialize( call_user_func('base'.'64_decode', $_POST['import']) );

	if( ! is_array( $mfn_items ) ) return false;

	$mfn_items = $mfn_helper->unique_ID_reset($mfn_items, $uids);

	$navigator = MfnVisualBuilder::getNavigatorTree($mfn_items);

	$form = $mfnvb->loadElementsArr($mfn_items);

	ob_start();

	$front = new Mfn_Builder_Front($id);
	$front->show($mfn_items);

	$html = ob_get_contents();

	ob_end_clean();

	$return['html'] = $html;
	$return['form'] = $form;
	$return['navigator'] = $navigator;

	wp_send_json($return);

	wp_die();
}

// import single page
add_action('wp_ajax_importsinglepage', 'mfnvb_import_single_page');

function mfnvb_import_single_page(){
	if(!is_user_logged_in()){ wp_die(); }
	check_ajax_referer( 'mfn-builder-nonce', 'mfn-builder-nonce' );
	$mfnvb = new MfnVisualBuilder();
	$request = $_POST;
	$post_id = $request['pageid'];
	$page = $request['import'];
	$count = $_POST['count'];

	$pages_api = new Mfn_Single_Page_Import_API( $page );
	$response = $pages_api->remote_get_page();

	if( ! $response ){

		_e( 'Remote API error.', 'mfn-opts' );

	} elseif( is_wp_error( $response ) ){

		echo $response->get_error_message();

	} else {

		// unserialize response

		$mfn_items = unserialize(call_user_func('base'.'64_decode', $response));

		if( ! is_array( $mfn_items ) ){
			return false;
		}

		// remove images url

		$builderajax = new Mfn_Builder_Ajax();

		$regex = '/http(.*)\.(png|jpg|jpeg|gif|svg|webp|mp4)/m';
		$mfn_items = $builderajax->builder_replace( $regex, '', $mfn_items );

		// get current builder uniqueIDs

		$uids = [];

		// reset uniqueID

		$mfn_items = Mfn_Builder_Helper::unique_ID_reset( $mfn_items, $uids );

		if ( is_array( $mfn_items ) ) {

			$form = $mfnvb->loadElementsArr($mfn_items);

			ob_start();

			$front = new Mfn_Builder_Front($post_id);
			$front->show($mfn_items);

			$html = ob_get_contents();

			ob_end_clean();

			$navigator = MfnVisualBuilder::getNavigatorTree($mfn_items);

			$return['html'] = $html;
			$return['form'] = $form;
			$return['navigator'] = $navigator;

			wp_send_json($return);

		}

	}


	wp_die();
}

// import template
add_action('wp_ajax_importtemplate', 'mfnvb_import_template');

function mfnvb_import_template(){
	if(!is_user_logged_in()){ wp_die(); }
	check_ajax_referer( 'mfn-builder-nonce', 'mfn-builder-nonce' );

	$return = array();
	$mfn_helper = new Mfn_Builder_Helper();

	$request = $_POST;
	$id = $request['id'];
	$count = $request['count'];

	$mfndata = get_post_meta($request['import'], 'mfn-page-items', true);

	$uids = [];

	if( !is_array($mfndata) ){
		$mfn_items = unserialize( call_user_func('base'.'64_decode', $mfndata) );
	}else{
		$mfn_items = $mfndata;
	}

	if( ! is_array( $mfn_items ) ) return false;

	$mfn_items = $mfn_helper->unique_ID_reset($mfn_items, $uids);

	$mfnvb = new MfnVisualBuilder();
	$form = $mfnvb->loadElementsArr($mfn_items);

	ob_start();

	$front = new Mfn_Builder_Front($id);
	$front->show($mfn_items);

	$html = ob_get_contents();

	ob_end_clean();

	$navigator = MfnVisualBuilder::getNavigatorTree($mfn_items);

	$return['html'] = $html;
	$return['form'] = $form;
	$return['navigator'] = $navigator;

	wp_send_json($return);

	wp_die();

	wp_die();
}

// insert prebuilt
add_action('wp_ajax_insertprebuilt', 'mfnvb_insert_prebuilt');

function mfnvb_insert_prebuilt(){
	if(!is_user_logged_in()){ wp_die(); }
	$mfnvb = new MfnVisualBuilder();

	$count = $_POST['count']++;
	$id = $_POST['id'];

	check_ajax_referer( 'mfn-builder-nonce', 'mfn-builder-nonce' );

	$return = array();

	if( ! $id ){
		return false;
	}

	$mfn_helper = new Mfn_Builder_Helper();

	$sections_api = new Mfn_Pre_Built_Sections_API( $id );
	$response = $sections_api->remote_get_section();

	if( ! $response ){

		_e( 'Remote API error.', 'mfn-opts' );

	} elseif( is_wp_error( $response ) ){

		echo $response->get_error_message();

	} else {

		$uids = $mfn_helper->get_current_uids();

		$mfn_items = unserialize(call_user_func('base'.'64_decode', $response));

		if( ! is_array( $mfn_items ) ) return false;

		$placeholder_url = get_template_directory_uri() .'/functions/builder/pre-built/images/placeholders/';

		$mfn_ajax = new Mfn_Builder_Ajax();

		$mfn_items = $mfn_ajax->builder_replace( '/\#mfn_placeholder\#/', $placeholder_url, $mfn_items );

		$mfn_items = $mfn_helper->unique_ID_reset($mfn_items, $uids);

		$form = $mfnvb->loadElementsArr($mfn_items);

		ob_start();

		$front = new Mfn_Builder_Front($id);
		$front->show($mfn_items);

		$html = ob_get_contents();

		ob_end_clean();

		$navigator = MfnVisualBuilder::getNavigatorTree($mfn_items);

		$return['html'] = $html;
		$return['form'] = $form;
		$return['navigator'] = $navigator;

		wp_send_json($return);

	}

	wp_die();
}


// import from clipboard
add_action('wp_ajax_importfromclipboard', 'mfnvb_importfromclipboard');

function mfnvb_importfromclipboard(){
	if(!is_user_logged_in()){ wp_die(); }
	check_ajax_referer( 'mfn-builder-nonce', 'mfn-builder-nonce' );
	$mfnvb = new MfnVisualBuilder();
	$return = array();

	$mfn_helper = new Mfn_Builder_Helper();

	$id = $_POST['id'];
	$type = $_POST['type'];

	$uids = $mfn_helper->get_current_uids();

	$mfn_items = unserialize( call_user_func('base'.'64_decode', $_POST['import']) );

	if( ! is_array( $mfn_items ) ) return false;

	$mfn_items = $mfn_helper->unique_ID_reset($mfn_items, $uids);

	$form = $mfnvb->loadElementsArr($mfn_items);

	ob_start();

	$front = new Mfn_Builder_Front($id);

	if($type == 'column'){
		foreach($mfn_items as $section){ foreach($section['wraps'] as $wrap){ foreach($wrap['items'] as $item){ $front->show_items($item, $count, true); } } }
	}else if($type == 'wrap'){
		foreach($mfn_items as $section){foreach($section['wraps'] as $wrap){$front->show_wraps($wrap, $count, true);}}
	}else{
		$front->show($mfn_items);
	}

	$html = ob_get_contents();

	ob_end_clean();

	$navigator = MfnVisualBuilder::getNavigatorTree($mfn_items);

	$return['html'] = $html;
	$return['form'] = $form;
	$return['navigator'] = $navigator;

	wp_send_json($return);

	wp_die();
}

// favorites
add_action('wp_ajax_mfn_builder_favorites', 'mfnvb_builder_favorites');

function mfnvb_builder_favorites(){
	if(!is_user_logged_in()){ wp_die(); }
	check_ajax_referer( 'mfn-builder-nonce', 'mfn-builder-nonce' );

	$return = 'set';

	$favs_key = 'mfn_fav_items_'.get_current_user_id();

	$item = $_POST['item'];

	$current_favs = get_option( $favs_key );

	if( !$current_favs ){
		$current_favs = array();
	}else{
		$current_favs = (array) json_decode($current_favs);
	}

	if( in_array($item, $current_favs) ) {
	    array_splice($current_favs, array_search($item, $current_favs ), 1);
	    $return = 'unset';
	}else{
		$current_favs[] = $item;
	}

	update_option( $favs_key, json_encode($current_favs), false );

	wp_send_json($return);

	wp_die();
}

?>
