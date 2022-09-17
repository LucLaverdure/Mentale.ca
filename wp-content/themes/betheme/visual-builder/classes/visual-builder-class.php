<?php
if( ! defined( 'ABSPATH' ) ){
	exit; // Exit if accessed directly
}

// error_reporting(E_ALL);
// ini_set("display_errors", 1);

class MfnVisualBuilder {

	public $url = MFN_OPTIONS_URI;

	public $post_type = false;
	public $template_type = false;
	public $page_options = false;
	public $options = array();
	public $widgets = array();
	public $scripts;
	public $styles;
	public $post_id = false;

	public function __construct() {
	global $post;
	$this->mfn_required_scripts();
	$this->mfn_required_styles();

    add_action( 'admin_enqueue_scripts', array( $this, 'mfn_append_vb_styles'), 9999 );
    add_action( 'admin_body_class', array($this, 'mfn_admin_body_class') );

    $this->options = Mfn_Builder_Helper::get_options();

    if( isset($post->ID) ){
    	$this->post_id = $post->ID;
    	$this->post_type = get_post_type($post->ID);

	    if($this->post_type == 'template'){
				$this->template_type = get_post_meta($post->ID, 'mfn_template_type', true);
			}

			if($this->post_type == 'post'){
			  $po_class = new Mfn_Post_Type_Post();
			}elseif($this->post_type == 'portfolio'){
			  $po_class = new Mfn_Post_Type_Portfolio();
			}elseif($this->post_type == 'template'){
			  $po_class = new Mfn_Post_Type_Template();
			  $this->template_type = get_post_meta($post->ID, 'mfn_template_type', true);
			}else{
			  $po_class = new Mfn_Post_Type_Page();
			}

			$this->page_options = $po_class->set_fields();

    }

  }

  public function mfn_required_scripts(){
  	$this->scripts = array(
  		'wp-auth-check',
  		'heartbeat',
  		'jquery',
  		'jquery-core',
  		'jquery-migrate',
  		'jquery-ui-core',
  		'mediaelement',
  		'mediaelement-core',
  		'mediaelement-migrate',
  		'mediaelement-vimeo',
  		'wp-mediaelement',
  		'media-upload',
  		'media-models',
  		'media-views',
  		'media-editor',
  		'media-audiovideo',
  		'media-widgets',
  		'media-audio-widget',
  		'media-image-widget',
  		'media-gallery-widget',
  		'media-video-widget',
  		'media-grid',
  		'media',
  		'media-gallery',
  		'wp-media-utils'
  	);
  }

  public function mfn_required_styles(){
  	$this->styles = array(
  		'colors',
  		'common',
  		'forms',
  		'admin-menu',
  		'dashboard',
  		'list-tables',
  		'edit',
  		'revisions',
  		'media',
  		'themes',
  		'about',
  		'nav-menus',
  		'widgets',
  		'site-icon',
  		'l10n',
  		'code-editor',
  		'site-health',
  		'wp-admin',
  		'login',
  		'install',
  		'wp-color-picker',
  		'customize-controls',
  		'customize-widgets',
  		'customize-nav-menus',
  		'buttons',
  		'dashicons',
  		'admin-bar',
  		'wp-auth-check',
  		'editor-buttons',
  		'media-views',
  		'wp-pointer',
  		'customize-preview',
  		'wp-embed-template-ie',
  		'imgareaselect',
  		'wp-jquery-ui-dialog',
  		'mediaelement',
  		'wp-mediaelement'
  	);
  }


	public function mfn_append_vb_styles() {
		global $post;
		global $wp_scripts;
		global $wp_styles;

		$create_bebuilder_fields = true;

    foreach( $wp_scripts->registered as $script ) {
        //if( strpos($script->handle, 'media') !== false) echo $script->handle . ', ';
        if( $this->scripts && !in_array($script->handle, $this->scripts) ) wp_dequeue_script( $script->handle );
    }

    foreach( $wp_styles->registered as $style ) {
        // echo $style->handle . ' | ';
        if( !in_array($style->handle, $this->styles) ) wp_dequeue_style( $style->handle );
    }

    $mfn_beform_ver = get_option('betheme_form_uid') ? get_option('betheme_form_uid') : MFN_THEME_VERSION;

    $bebuilder_items_file = '/visual-builder/assets/js/forms/bebuilder-'.MFN_THEME_VERSION.'.js';
    $bebuilder_items_path = get_template_directory().$bebuilder_items_file;

    if( ! file_exists( $bebuilder_items_path ) || ( defined('MFN_DEBUG') && MFN_DEBUG == 1 ) ) {
    	$create_bebuilder_fields = Mfn_Helper::generate_bebuilder_items( $bebuilder_items_path, $this->fieldsToJS() );
    	$mfn_beform_ver = time();
    }

    if( $create_bebuilder_fields ){
    	wp_enqueue_script('mfn-bebuilder-fields', get_template_directory_uri() . $bebuilder_items_file, false, $mfn_beform_ver, true);
    	wp_add_inline_script( 'mfn-bebuilder-fields', $this->getDbLists(), 'before' );
    }else{
    	echo '<script id="mfn-vb-dblists">'.$this->getDbLists().'</script>';
    	echo '<script id="mfn-bebuilder-fields-live">'.$this->fieldsToJS().'</script>';
    }

	wp_enqueue_script( 'mfn-opts-plugins',get_template_directory_uri() .'/muffin-options/js/plugins.js', array('jquery'), MFN_THEME_VERSION, true );
	wp_enqueue_script('mfn-plugins', get_theme_file_uri('/js/plugins.js'), array('jquery'), MFN_THEME_VERSION, true);

	wp_enqueue_style('mfn-vbreset', get_theme_file_uri('/visual-builder/assets/css/reset.css'), false, MFN_THEME_VERSION, 'all');

	wp_enqueue_script('wp-theme-plugin-editor');
	wp_enqueue_style('wp-codemirror');

	wp_enqueue_script( 'jquery-ui-resizable' );
	wp_enqueue_script( 'jquery-ui-sortable'  );
	wp_enqueue_script( 'jquery-ui-droppable' );
	wp_enqueue_script( 'jquery-ui-draggable' );
	wp_enqueue_script( 'jquery-ui-progressbar' );
	wp_enqueue_script( 'jquery-ui-tabs' );
	wp_enqueue_script( 'jquery-ui-slider' );

    // Add the color picker
    wp_enqueue_style( 'wp-color-picker' );
    wp_enqueue_script( 'iris', admin_url( 'js/iris.min.js' ), array( 'jquery-ui-draggable', 'jquery-ui-slider', 'jquery-touch-punch' ), false, 1 );
		wp_enqueue_script( 'wp-color-picker', admin_url( 'js/color-picker.min.js' ), array( 'iris' ), false, 1 );

		// webfont

		if( ! mfn_opts_get('google-font-mode') ) {
		wp_enqueue_script( 'mfn-webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js', array( 'jquery' ), false, true );
	}

	wp_enqueue_media();
		wp_enqueue_editor();

		wp_enqueue_script('mfn-rangy', get_theme_file_uri('/visual-builder/assets/js/rangy-core.js'), false, MFN_THEME_VERSION, true);
		wp_enqueue_script('mfn-rangy-classapplier', get_theme_file_uri('/visual-builder/assets/js/rangy-classapplier.js'), false, MFN_THEME_VERSION, true);

		// icons
		wp_enqueue_style('mfn-icons', get_theme_file_uri('/fonts/mfn/icons.css'), false, time());
		wp_enqueue_style('mfn-font-awesome', get_theme_file_uri('/fonts/fontawesome/fontawesome.css'), false, time());

		// VB styles & scripts
		wp_enqueue_style('mfn-vbcolorpickerstyle', get_theme_file_uri('/visual-builder/assets/css/nano.min.css'), false, time(), false);
		wp_enqueue_style('mfn-vbstyle', get_theme_file_uri('/visual-builder/assets/css/style.css'), false, time(), false);

		wp_enqueue_script('mfn-vbcolorpickerjs', get_theme_file_uri('/visual-builder/assets/js/pickr.min.js'), false, time(), true);
		wp_enqueue_script('mfn-inline-editor-js', get_theme_file_uri('/visual-builder/assets/js/medium-editor.min.js'), false, time(), true);
		wp_enqueue_script('mfn-vblistjs', get_theme_file_uri('/visual-builder/assets/js/list.min.js'), false, time(), true);
	wp_enqueue_script('mfn-vbscripts', get_theme_file_uri('/visual-builder/assets/js/scripts.js'), false, time(), true);

	$localize_visual = array(
		'mfnsc' => get_theme_file_uri( '/functions/tinymce/plugin.js' ),
	);
	$google_fonts = mfn_fonts('all');

	wp_enqueue_script( 'mfn-opts-field-visual-vb', MFN_OPTIONS_URI .'fields/visual/field_visual_vb.js', array( 'jquery' ), MFN_THEME_VERSION, true );
	wp_localize_script( 'mfn-opts-field-visual-vb', 'fieldVisualJS_vb', $localize_visual);

	wp_add_inline_script( 'mfn-vbscripts', 'var ajaxurl = "'. admin_url( 'admin-ajax.php' ) . '";' );

	$permalink = get_preview_post_link($post->ID).'&visual=iframe';

	if( get_post_status($post->ID) == 'publish' ){
		$permalink = get_permalink( $post->ID );
		if( strpos($permalink, '?') !== false){
			$permalink .= '&visual=iframe';
		}else{
			$permalink .= '?visual=iframe';
		}
	}

	// override if template shop archive
	if( function_exists('is_woocommerce') ){

		if( $this->post_type == 'template' && $this->template_type == 'shop-archive' && wc_get_page_id( 'shop' ) ){
			$permalink = get_permalink( wc_get_page_id( 'shop' ) ).'?mfn-template-id='.$post->ID.'&visual=iframe';
		}else if( $this->post_type == 'template' && $this->template_type == 'single-product' ){

			$sample = Mfn_Builder_Woo_Helper::sample_item('product');
			$product = wc_get_product($sample);
			$permalink = get_permalink( $product->get_id() ).'?mfn-template-id='.$post->ID.'&visual=iframe';

 			$gallery_overlay = mfn_opts_get('shop-product-gallery-overlay');
 			$thumbnails_margin = mfn_opts_get( 'shop-product-thumbnails-margin', 0, ['unit'=>'px'] );
			$main_margin = mfn_opts_get( 'shop-product-main-image-margin', 'mfn-mim-0' );

 			wp_localize_script( 'mfn-vbscripts', 'mfnwoovars',
      	array(
      		'productthumbsover' => $gallery_overlay,
	        'productthumbs' => $thumbnails_margin,
	        'mainimgmargin' => $main_margin
      	)
    	);

 			wp_enqueue_script('mfn-swiper', get_theme_file_uri('/js/swiper.js'), array('jquery'), MFN_THEME_VERSION, true);
 		}
		}

	wp_localize_script( 'mfn-vbscripts', 'mfnvbvars',
      array(
        'ajaxurl' => admin_url( 'admin-ajax.php' ),
        'pageid' => $post->ID,
        'wpnonce' => wp_create_nonce( 'mfn-builder-nonce' ),
        'rev_slider_id' => get_post_meta($post->ID, 'mfn-post-slider', true),
        'adminurl' => admin_url(),
        'themepath' => get_theme_file_uri('/'),
        'rooturl' => get_site_url(),
        'permalink' => $permalink,
        'pagedata' => $this->loadElementsArr($post->ID),
        'elements' => $this->loadElementsObjects($post->ID),
        'mfn_google_fonts' => $google_fonts,
        'presets' => $this->getPresets(true),
        'shape_dividers' => Mfn_Builder_Helper::get_shape_divider(false, false, 'mfn-uid-')
      )
    );

	  $cm_args = wp_enqueue_code_editor(array(
			'autoRefresh' => true,
			'lint' => true,
			'indentUnit' => 2,
			'tabSize' => 2,
			'lineNumbers' => false
		));

	    $codemirror['css']['codeEditor'] = wp_enqueue_code_editor(array(
			'type' => 'text/css', // required for lint
			'codemirror' => $cm_args,
		));

		$codemirror['html']['codeEditor'] = wp_enqueue_code_editor(array(
			'type' => 'text/html', // required for lint
			'codemirror' => $cm_args,
		));

		$codemirror['javascript']['codeEditor'] = wp_enqueue_code_editor(array(
			'type' => 'javascript', // required for lint
			'codemirror' => $cm_args,
		));

		wp_localize_script('mfn-vbscripts', 'mfn_cm', $cm_args);
		wp_enqueue_style('mfn-codemirror-dark', get_theme_file_uri('/visual-builder/assets/css/codemirror-dark.css'), false, MFN_THEME_VERSION, 'all');

		$lightboxOptions = mfn_opts_get('prettyphoto-options');
		$is_translation_on = mfn_opts_get('translate');

		$config = array(
			'mobileInit' => mfn_opts_get('mobile-menu-initial', 1240),
			'themecolor' => mfn_opts_get('color-theme'),
			'parallax' => mfn_parallax_plugin(),
			'responsive' => intval(mfn_opts_get('responsive', 0)),
			'sidebarSticky' => mfn_opts_get('sidebar-sticky') ? true : false,
			'lightbox' => array(
				'disable' => isset($lightboxOptions['disable']) ? true : false,
				'disableMobile' => isset($lightboxOptions['disable-mobile']) ? true : false,
				'title' => isset($lightboxOptions['title']) ? true : false,
			),
			'slider' => array(
				'blog' => intval(mfn_opts_get('slider-blog-timeout', 0)),
				'clients' => intval(mfn_opts_get('slider-clients-timeout', 0)),
				'offer' => intval(mfn_opts_get('slider-offer-timeout', 0)),
				'portfolio' => intval(mfn_opts_get('slider-portfolio-timeout', 0)),
				'shop' => intval(mfn_opts_get('slider-shop-timeout', 0)),
				'slider' => intval(mfn_opts_get('slider-slider-timeout', 0)),
				'testimonials' => intval(mfn_opts_get('slider-testimonials-timeout', 0)),
			),
			'livesearch' => array(
				'minChar' => intval(mfn_opts_get('header-search-live-min-characters', 3)),
				'loadPosts' => intval(mfn_opts_get('header-search-live-load-posts', 10)),
				'translation' => array(
					'pages' => 		$is_translation_on ? mfn_opts_get('translate-livesearch-pages', 'Pages') : __('Pages','betheme'),
					'categories' => $is_translation_on ? mfn_opts_get('translate-livesearch-categories', 'Categories') : __('Categories','betheme'),
					'portfolio' =>  $is_translation_on ? mfn_opts_get('translate-livesearch-portfolio', 'Portfolio') : __('Portfolio','betheme'),
					'post' => $is_translation_on ? mfn_opts_get('translate-livesearch-posts', 'Posts') : __('Posts','betheme'),
					'products' => $is_translation_on ? mfn_opts_get('translate-livesearch-products', 'Products') : __('Products','betheme'),
				),
			),
		);

		wp_localize_script( 'mfn-vbscripts', 'mfn', $config );

	}

	public function fieldsToJS(){
		// forms html
		$output = 'var renderMfnFields = {';
			$output .= $this->getSectionForm();
			$output .= $this->getWrapForm();
			$output .= $this->getItemsForm();
			$output .= $this->getItemsAdvancedForm();
			$output .= $this->getPageOptionsForm();
		$output .= '}';
		return $output;
	}

	public function getDbLists(){

		if($this->post_type == 'post'){
		  $po_class = new Mfn_Post_Type_Post();
		}elseif($this->post_type == 'portfolio'){
		  $po_class = new Mfn_Post_Type_Portfolio();
		}elseif($this->post_type == 'template'){
		  $po_class = new Mfn_Post_Type_Template();
		  $this->template_type = get_post_meta($this->post_id, 'mfn_template_type', true);
		}else{
		  $po_class = new Mfn_Post_Type_Page();
		}

		$sidebars = mfn_opts_get('sidebars') ? mfn_opts_get('sidebars') : array();

		$output = 'var mfnDbLists = {';
			$output .= 'blog_categories:'.json_encode( mfn_get_categories('category') ).",";
			$output .= 'offer_types:'.json_encode( mfn_get_categories('offer-types') ).",";
			$output .= 'portfolio_types:'.json_encode( mfn_get_categories('portfolio-types') ).",";
			if( function_exists('is_woocommerce') ){
				$output .= 'product_cat:'.json_encode( mfn_hierarchical_taxonomy('product_cat') ).",";
			}else{
				$output .= 'product_cat:'.json_encode( array() ).",";
			}
			$output .= 'slide_types:'.json_encode( mfn_get_categories('slide-types') ).",";
			$output .= 'testimonial_types:'.json_encode( mfn_get_categories('testimonial-types') ).",";
			$output .= 'client_types:'.json_encode( mfn_get_categories('client-types') ).",";
			$output .= 'rev_slider:'.json_encode( Mfn_Builder_Helper::get_sliders('rev') ).",";
			$output .= 'layer_slider:'.json_encode( Mfn_Builder_Helper::get_sliders('layer') ).",";
			$output .= 'sidebars:'.json_encode( $sidebars ).",";
			$output .= 'layouts:'.json_encode( $po_class->get_layouts() ).",";
			$output .= 'menus:'.json_encode( $po_class->get_menus() ).",";
		$output .= '}';
		return $output;
	}

	public function getPageOptionsForm(){
		$output = 'pageoptions: function() { return \'';
		$output .= '<div class="page-options-form-wrapper">';

		ob_start();
		foreach( $this->page_options as $f=>$field ) {
			if( is_array($field) ){
				foreach ($field as $a => $attr) {
					$this->mfn_JsformElement($attr, 'option', 'fields');
				}
			}
		}
		$output .= ob_get_contents();
		ob_end_clean();
		$output .= '</div>\';},';

		return $output;
	}

	public function getSectionForm(){
		$mfn_fields = new Mfn_Builder_Fields();
		$output = 'section: function() { return \'';
		$output .= '<div class="mfn-element-fields-wrapper" data-element="mcb-section-\'+edited_item.uid+\'"><ul class="mfn-vb-formrow sidebar-panel-content-tabs"><li data-tab="content" class="spct-li-content active">Settings</li><li data-tab="advanced" class="spct-li-advanced">Advanced</li></ul>';
		$items = $mfn_fields->get_section();

		ob_start();
		foreach( $items as $f=>$field ) $this->mfn_JsformElement($field, 'section', 'attr');
		$output .= ob_get_contents();
		ob_end_clean();
		$output .= '</div>\';},';

		return $output;
	}

	public function getWrapForm(){
		$mfn_fields = new Mfn_Builder_Fields();
		$output = 'wrap: function() { return \'';
		$output .= '<div class="mfn-element-fields-wrapper" data-element="mcb-wrap-\'+edited_item.uid+\'"><ul class="mfn-vb-formrow sidebar-panel-content-tabs"><li data-tab="content" class="spct-li-content active">Settings</li><li data-tab="advanced" class="spct-li-advanced">Advanced</li></ul>';
		$items = $mfn_fields->get_wrap();

		ob_start();
		foreach($items as $i=>$j) $this->mfn_JsformElement($j, 'wrap', 'attr');
		$output .= ob_get_contents();
		ob_end_clean();
		$output .= '</div>\';},';

		return $output;
	}

	public function getItemsAdvancedForm(){
		$mfn_fields = new Mfn_Builder_Fields( true );
		$output = 'advanced: function() { return \'';
		$items = $mfn_fields->get_advanced(true);

		ob_start();
		foreach( $items as $f=>$field ) $this->mfn_JsformElement($field, '\'+edited_item.jsclass+\'', 'fields');
		$output .= ob_get_contents();
		ob_end_clean();
		$output .= '\';},';

		return $output;
	}

	public function getItemsForm(){
		$mfn_fields = new Mfn_Builder_Fields(true);
		$output = '';
		$items = $mfn_fields->get_items();

		foreach($items as $w=>$widget){
			$output .= $widget['type'].': function() { return \'';
			$output .= '<div class="mfn-element-fields-wrapper" data-element="mcb-item-\'+edited_item.uid+\'" data-group="mfn-vb-\'+edited_item.uid+\'" data-item="\'+edited_item.jsclass+\'"><ul class="mfn-vb-formrow sidebar-panel-content-tabs"><li data-tab="content" class="spct-li-content active">Content</li><li data-tab="style" class="spct-li-style">Style</li><li data-tab="advanced" class="spct-li-advanced">Advanced</li></ul>';

			ob_start();
			foreach ($widget as $f => $field) {
				if( is_array($field) ){
					foreach ($field as $a => $attr) {
						$this->mfn_JsformElement($attr, $widget['type'], 'fields');
					}
				}
			}
			$output .= ob_get_contents();
			ob_end_clean();

			$output .= '</div>\';},';
		}

		return $output;
	}

	public function loadElementsObjects($p){
		$return = array();

		$mfn_fields = new Mfn_Builder_Fields();
		$elements = $mfn_fields->get_items();
		$section = $mfn_fields->get_section();
		$wrap = $mfn_fields->get_wrap();

		// section

		$return['section']['icon'] = "section";
		$return['section']['jsclass'] = "section";
		$return['section']['title'] = "Section";
		$return['section']['uid'] = "";
		foreach ($section as $s => $sec) {
			if( !empty($sec['std']) ){
				$return['section']['attr'][$sec['id']] = $sec['std'];
			}
		}

		// wrap

		$return['wrap']['icon'] = "wrap";
		$return['wrap']['size'] = "1/1";
		$return['wrap']['tablet_size'] = "1/1";
		$return['wrap']['mobile_size'] = "1/1";
		$return['wrap']['jsclass'] = "wrap";
		$return['wrap']['title'] = "Wrap";
		$return['wrap']['uid'] = "";
		foreach ($wrap as $w => $wra) {
			if( !empty($wra['std']) ){
				$return['wrap']['attr'][$wra['id']] = $wra['std'];
			}
		}

		if( empty($return['wrap']['attr']['sticky']) ){
			$return['wrap']['attr']['sticky'] = '0';
			$return['wrap']['attr']['tablet_sticky'] = '0';
			$return['wrap']['attr']['mobile_sticky'] = '0';
		}

		// elements

		foreach( $elements as $e=>$element ){
			$params = array();
			$params_content = '';
			$return[$e]['type'] = $element['type'];
			$return[$e]['jsclass'] = $element['type'];
			$return[$e]['title'] = $element['title'];
			$return[$e]['icon'] = str_replace('_', '-', $element['type']);

			if( isset($element['fields']) ){
				foreach ($element['fields'] as $field) {

					if( $element['type'] == 'map' || $element['type'] == 'lottie' ){
						$params['vb'] = true;
					}

					if( !empty($field['std']) ){
						$return[$e]['fields'][$field['id']] = $field['std'];
						if($field['id'] == 'content'){
							$params_content = $field['std'];
						}else{
							$params[$field['id']] = $field['std'];
						}
					}else if( !empty($field['vbstd']) ){
						$return[$e]['fields'][$field['id']] = $field['vbstd'];
						if($field['id'] == 'content'){
							$params_content = $field['vbstd'];
						}else{
							$params[$field['id']] = $field['vbstd'];
						}
					}


				}
			}

			$params['pageid'] = $p;

			$return[$e]['html'] = '<div data-uid="uidhere" data-desktop-size="1/1" data-tablet-size="1/1" data-mobile-size="1/1" class="blink column mcb-column mfn-new-item vb-item vb-item-widget mcb-item-uidhere column_'.$element['type'].' one tablet-one mobile-one"><div class="mcb-column-inner mcb-column-inner-uidhere mcb-item-'.$element['type'].'-inner">';

			$return[$e]['html'] .= Mfn_Builder_Helper::itemTools('1/1');
			$fun_name = 'sc_'.$element['type'];

			if($element['type'] == 'placeholder'){
				$return[$e]['html'] .= '<div class="placeholder"></div>';
			}elseif($element['type'] == 'shop_products'){
				$return[$e]['html'] .= $fun_name($params, 'sample');
			}elseif($element['type'] == 'content'){
				$return[$e]['html'] .= '<div class="content-wp">'.get_post_field( 'post_content', $p ).'</div>';
			}elseif($element['type'] == 'divider'){
				$return[$e]['html'] .= '<hr />';
			}elseif($element['type'] == 'slider_plugin'){
				$return[$e]['html'] .= '<div class="mfn-widget-placeholder mfn-wp-revolution"><img class="item-preview-image" src="'.get_theme_file_uri('/muffin-options/svg/placeholders/slider_plugin.svg').'"></div>';
			}elseif($element['type'] == 'visual'){
				$return[$e]['html'] .= '<div class="mfn-visualeditor-content mfn-inline-editor clearfix">'.$params_content.'</div>';
			}elseif($element['type'] == 'table_of_contents'){
				$return[$e]['html'] .= $fun_name($params);
			}elseif($element['type'] == 'sidebar_widget'){
				$return[$e]['html'] .= '<img src="'.get_theme_file_uri( '/muffin-options/svg/placeholders/sidebar_widget.svg' ).'" alt="">';
			}elseif($element['type'] == 'column'){
				$return[$e]['html'] .= '<div class="column_attr mfn-inline-editor clearfix">'.$params_content.'</div>';
			}elseif($element['type'] == 'image_gallery'){
				$params['id'] = null;
				$return[$e]['html'] .= sc_gallery($params);
			}elseif($element['type'] == 'shop' && class_exists( 'WC_Shortcode_Products' )){
				$params['post'] = 0;
				$shortcode = new WC_Shortcode_Products( $params, 'products' );
				$return[$e]['html'] .= $shortcode->get_content();
			}elseif(!empty($params_content)){
				$return[$e]['html'] .= $fun_name($params, $params_content);
			}elseif(function_exists( 'sc_'.$element['type'] )){
				$output = $fun_name($params);
				if(is_array($output)){
					$return[$e]['html'] .= $output[0];
					$return[$e]['script'] = $output[1];
				}else{
					$return[$e]['html'] .= $output;
				}
			}
			$return[$e]['html'] .= '</div></div>';
		}

		return $return;

	}

	public function loadElementsArr($mfn_items_get){
		$return = array();
		$p_id = false;

		// load page objects

		if( is_numeric($mfn_items_get) ){
			$p_id = $mfn_items_get;
			$mfn_items_get = get_post_meta($mfn_items_get, 'mfn-page-items', true);
		}

		if($mfn_items_get && ! is_array($mfn_items_get)) {
			$mfn_items = unserialize(call_user_func('base'.'64_decode', $mfn_items_get));
		}else{
			$mfn_items = $mfn_items_get;
		}

		if( $mfn_items && count($mfn_items) > 0 ){
			foreach ($mfn_items as $section) {
				if( isset($section['wraps']) && is_iterable( $section['wraps'] ) ){
					foreach ( $section['wraps'] as $wrap ) {
						if( isset($wrap['items']) && is_iterable( $wrap['items'] ) ){
							foreach ( $wrap['items'] as $item ) {

								if( isset($item['tabs']) && is_iterable( $item['tabs'] ) ){
									$item['tabs'] = $item['tabs'];
								}

								$item['jsclass'] = $item['type'];
								$item['title'] = isset( $item['title'] ) ? $item['title'] : ucfirst(str_replace('_', ' ', $item['type']));
								$item['icon'] = str_replace('_', '-', $item['type']);
								$return[] = $item;
							}
						}
						unset( $wrap['items'] );
						$wrap['jsclass'] = 'wrap';
						$wrap['title'] = 'Wrap';
						$wrap['icon'] = 'wrap';
						$return[] = $wrap;
					}
					unset( $section['wraps'] );
				}
				$section['jsclass'] = 'section';
				$section['title'] = 'Section';
				$section['icon'] = 'section';
				$return[] = $section;
			}
		}

		// options
		if( $p_id ){
			$options = array();
			foreach( $this->page_options as $o=>$opt ) {
				$options['uid'] = 'pageoptions';
				if( is_array($opt) ){
					foreach ($opt as $t => $tval) {
						if( isset($tval['id']) ){
							$opt_value = get_post_meta( $p_id, $tval['id'], true );
							if( $opt_value ){
								$options['fields'][$tval['id']] = $opt_value;
							}elseif( isset($tval['std']) ){
								$options['fields'][$tval['id']] = $tval['std'];
							}else{
								$options['fields'][$tval['id']] = '';
							}
						}
					}
				}
			}
			$return[] = $options;
		}

		return $return;
	}

	public function sizes($size){
		$classes = array(
  			'divider' => 'divider',
  			'1/6' => 'one-sixth',
  			'1/5' => 'one-fifth',
  			'1/4' => 'one-fourth',
  			'1/3' => 'one-third',
  			'2/5' => 'two-fifth',
  			'1/2' => 'one-second',
  			'3/5' => 'three-fifth',
  			'2/3' => 'two-third',
  			'3/4' => 'three-fourth',
  			'4/5' => 'four-fifth',
  			'5/6' => 'five-sixth',
  			'1/1' => 'one'
  		);

  		return $classes[$size];
	}

	public function mfn_admin_body_class( $classes ) {
		if( $this->template_type == 'header' ){
			$classes .= ' mfn-preview-mode';
		}
    return $classes;
}

	public function mfn_load_sidebar(){
		global $post;
		$mfn_helper = new Mfn_Builder_Helper();
		$post_id = $post->ID;

		require_once(get_theme_file_path('/visual-builder/visual-builder-header.php'));

		$widgetsClass =  new Mfn_Builder_Fields();

		$widgets = $widgetsClass->get_items();

		$inline_shortcodes = $widgetsClass->get_inline_shortcode();

		$builder_class = array();
		$builder_class[] = 'mfn-vb-'.$this->post_type;

		if( is_array( $this->options ) ){
			foreach( $this->options as $option_id => $option_val ){
				if( $option_val == "1" ){
					$builder_class[] = $option_id;
				}elseif( $option_val != "0" ){
					$builder_class[] = $option_val;
				}
			}
		}

		$detectUiTheme = false;

		if( in_array( 'mfn-ui-auto', $builder_class) || ( !in_array( 'mfn-ui-auto', $builder_class) && !in_array( 'mfn-ui-dark', $builder_class) && !in_array( 'mfn-ui-light', $builder_class) ) ) {
			$builder_class[] = 'mfn-ui-auto';
			$detectUiTheme = true;
		}

		$builder_class = implode( ' ', $builder_class );

		if($this->post_type == 'template' && !empty($this->template_type)){
			$builder_class .= ' mfn-vb-tmpl-'.$this->template_type;
		}

		echo '<div class="frameOverlay"></div><div id="mfn-visualbuilder" class="mfn-ui mfn-visualbuilder '.esc_attr( $builder_class ).'" data-tutorial="'. apply_filters('betheme_disable_support', '0') .'">';

		if($detectUiTheme) echo "<script>var mfnuicont = document.getElementById('mfn-visualbuilder'); if( mfnuicont.classList.contains('mfn-ui-auto') && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ){mfnuicont.classList.add('mfn-ui-dark');}</script>";

		require_once(get_theme_file_path('/visual-builder/partials/preloader.php'));

		echo '<div class="mfn-contextmenu mfn-items-list-contextmenu"><ul><li><a href="#" data-action="love-it"><span class="mfn-icon mfn-icon-star"></span><span class="label">Add to favourites</span></a></li></ul></div>';

		require_once(get_theme_file_path('/visual-builder/partials/navigator.php'));

		echo '<div style="position: fixed; z-index: 9999;" class="mfn-contextmenu mfn-builder-area-contextmenu"><h6 class="mfn-context-header">Section</h6><ul><li><a href="#" data-action="edit"><span class="mfn-icon mfn-icon-edit"></span><span class="label">Edit</span></a></li><li><a href="#" class="mfn-context-copy" data-action="copy"><span class="mfn-icon mfn-icon-copy"></span><span class="label">Copy</span></a></li><li><a href="#" class="mfn-context-paste" data-action="paste"><span class="mfn-icon mfn-icon-paste"></span><span class="label">Paste</span></a></li><li class="mfn-contextmenu-delete"><a href="#" data-action="delete"><span class="mfn-icon mfn-icon-delete-red"></span><span class="label">Delete</span></a></li></ul></div>';

		$edit_lock = wp_check_post_lock($post_id);


		if( $edit_lock && $edit_lock != get_current_user_id() ){
			require_once(get_theme_file_path('/visual-builder/partials/locker.php'));
		}else{
			wp_set_post_lock($post_id);
		}

		// start sidebar
	    echo '<div class="sidebar-wrapper" id="mfn-vb-sidebar">';

	    echo '<div id="mfn-sidebar-resizer"></div>';
	    echo '<div id="mfn-sidebar-switcher"></div>';

	  // sidebar left
	  require_once(get_theme_file_path('/visual-builder/partials/sidebar-menu.php'));

	  // end sidebar left

	  // start sidebar panel
	    echo '<div class="sidebar-panel">';

	    // start sidebar header

	  require_once(get_theme_file_path('/visual-builder/partials/sidebar-header.php'));

	  // end sidebar header

	  // items panel
	    echo '<div class="sidebar-panel-content">';

	    // start items panel
	    require_once(get_theme_file_path('/visual-builder/partials/sidebar-widgets.php'));

	    // end items panel

	   	// start pre build
	   	require_once(get_theme_file_path('/visual-builder/partials/sidebar-prebuilds.php'));
	   	// end pre build

	    // start revision
	    require_once(get_theme_file_path('/visual-builder/partials/sidebar-revisions.php'));
	    // end revisions

	    // start export/import
	    require_once(get_theme_file_path('/visual-builder/partials/sidebar-export-import.php'));

	   // end export/import

	    // start settings
	   	require_once(get_theme_file_path('/visual-builder/partials/sidebar-settings.php'));
	   	// end settings

	   	// start options
	   	require_once(get_theme_file_path('/visual-builder/partials/sidebar-options.php'));
	   	// end options

	   // start edit form

	   echo '<div class="panel panel-edit-item" style="display: none;"><div class="mfn-form"></div></div>';
       // end edit form

        echo '</div>';
        // start footer
        require_once(get_theme_file_path('/visual-builder/partials/sidebar-footer.php'));

        // end panel
        echo '</div>';
        // end sidebar
        echo '</div>';

        // iframe

        echo '<div id="mfn-preview-wrapper-holder" class="preview-wrapper">';
        // preview toolbar
        require_once(get_theme_file_path('/visual-builder/partials/preview-toolbar.php'));
        //echo '<pre style="line-height: 1.6em; display:none;">';print_r($mfn_items);echo '</pre>';
        echo '<div id="mfn-preview-wrapper"></div>';

		echo '</div>';

		// introduction
	    require_once(get_theme_file_path('/visual-builder/partials/introduction.php'));

	    // shortcuts
	    require_once(get_theme_file_path('/visual-builder/partials/shortcuts.php'));

	    // modal icons
		require_once(get_theme_file_path('/visual-builder/partials/modal-icons.php'));

		// modal shortcodes
		require_once(get_theme_file_path('/visual-builder/partials/modal-shortcodes.php'));

		if( get_post_type( $post_id ) == 'template' ) require_once(get_theme_file_path('/visual-builder/partials/modal-conditionals.php'));

	    echo '</div>';

	    require_once(get_theme_file_path('/visual-builder/visual-builder-footer.php'));

	}

	public function mfn_JsformElement($field, $n, $prefix = false){

		// $field - input name
		// $value - input value
		// $uid - uid
		// $meta - name attr
		// $t - type
		// $n - widget name optional

		$field_name = '';
		$fid = '';
		$classes = '';

		if( !is_array($field) && !isset($field['id']) ){
			//echo $field.'<br>';
			echo '<input class="'.$field.'input item-hidden-inputs mfn-form-control mfn-form-input" type="hidden" value="'.$n.'">';
			return;
		}

		if( isset( $field['themeoptions'] ) ){
			$themeoption = explode(':', $field['themeoptions']);
			if( isset($themeoption[0]) && isset($themeoption[1]) ){
				if( (!empty(mfn_opts_get($themeoption[0])) && mfn_opts_get($themeoption[0]) != $themeoption[1]) || (empty(mfn_opts_get($themeoption[0])) && !empty($themeoption[1])) ){
					return;
				}else{
					$classes .= !empty( mfn_opts_get('style') ) ? ' theme-'.mfn_opts_get('style').'-style' : ' theme-classic-style';
				}
			}
		}

		$dataname = false;
		$csspath = false;
		$conditions = false;
		$id = false;

		if(isset($field['edit_tag'])){
			$classes .= ' content-txt-edit';
		}

		if(isset($field['class'])){
			$classes .= ' '.$field['class'];
		}

		if(isset($field['settings'])){
			$classes .= ' toggle_fields';
		}

		if(isset($field['type']) && $field['type'] == 'sliderbar' && isset($field['units'])) {
			$classes .= ' sliderbar-units';
		}

		if(isset($field['id'])){
			$fid = $field['id'];
			$tmppreview = explode(':', $field['id']);
			$field_name = end($tmppreview);
			$field_name = str_replace(array(']', 'typography[', 'filter['), '', $field_name);

			$dataname = 'data-id="'.$field['id'].'" data-name="'.( $field_name == 'gradient' ? 'background-image' : str_replace(array('_mobile', '_tablet'), '', $field_name ) ).'"';

			if( $prefix ){
				$dataname .= ' data-prefix="'.$prefix.'"';
			}

			if( strpos($field['id'], 'style:') !== false ){
				if( isset($tmppreview[1]) ){
					$csspath = 'data-csspath="'.str_replace('mfnuidelement', '\'+edited_item.uid+\'', $tmppreview[1]).'"';
					$classes .= ' inline-style-input';
				}
			}

		}

		if( strpos($fid, '|hover') !== false ){
			$classes .= ' mfn-hover-input';
		}

		$n == 'button' ? $n = 'widget-button' : null;
		$n == 'chart' ? $n = 'widget-chart' : null;
		$n == 'code' ? $n = 'widget-code' : null;
		$n == 'sliderbar' ? $n = 'widget-sliderbar' : null;
		$n ? $classes .= ' '.$n : null;

		if( !empty($field_name) ){
			$classes .= ' '.$field_name;
		}

		if(empty($meta) && isset($field['title'])){
			$classes .= ' row-header';
		}

		if(isset($field['re_render']) && $field['re_render'] == 'tabs'){
			$classes .= ' re_render_tabs';
		}else if(isset($field['re_render']) && $field['re_render'] == 'standard'){
			$classes .= ' re_render';
		}

		if(isset($field['type']) && $field['type'] == 'html'){

			echo $field['html'];

			if(isset($field['title'])){
				echo '<label>'.$field['title'];
				if(isset($field['label_after'])){
						echo $field['label_after'];
					}
				echo '</label>';
			}

		}elseif(isset($field['type']) && in_array($field['type'], array('info', 'helper')) ){

			echo '<div class="mfn-form-row mfn-vb-formrow ' .(isset($field['class']) ? $field['class'] : null).'">';

			$field_class = 'MFN_Options_'. $field['type'];

			require_once( get_template_directory() .'/muffin-options/fields/'. $field['type'] .'/field_'. $field['type'] .'.php' );

			if ( class_exists( $field_class ) ) {
				$field_object = new $field_class( $field, '' );
				$field_object->render();
			}

			echo '</div>';

		}else{

			if( !empty($field['condition']) ){
				$classes .= ' activeif activeif-'.$field['condition']['id'];
				$conditions = 'data-conditionid="'. $field['condition']['id'] .'" data-opt="'. $field['condition']['opt'] .'" data-val="'. (is_array($field['condition']['val']) ? implode(',', $field['condition']['val']) : $field['condition']['val'] ) .'"';
			}

			if( isset($field['attr_id']) ){
				$id = 'id="'.$field['attr_id'].'"';
				//$classes .= ' '.$field['attr_id'];
			}

			echo '<div class="mfn-form-row mfn-vb-formrow'.$classes.'" '.$dataname.' '.$csspath.' '.$conditions.' '.$id.' '.(isset($field['edit_tagchild']) ? 'data-edittagchild="'.$field['edit_tagchild'].'"' : null).' '.(isset($field['edit_tag']) ? 'data-edittag="'.$field['edit_tag'].'"' : null).' '.(isset($field['edit_position']) ? 'data-tagposition="'.$field['edit_position'].'"' : null ).' '.(isset($field['edit_tag_var']) ? 'data-edittagvar="'.$field['edit_tag_var'].'"' : null ).'>';

			if(!empty($field['type'])){
				$field['preview'] = $field_name.'input';

				if(isset($field['title'])){
					$label_class = 'form-label';

					if( isset($field['responsive']) || isset($field['iconinfo']) || isset($field['desc']) ){
						$label_class .= ' form-label-wrapper';
					}

					echo '<label class="'.$label_class.'">'.$field['title'];
					if(isset($field['label_after'])){
						echo $field['label_after'];
					}

					if(isset($field['responsive'])) Mfn_Options_field::get_responsive_swither($field['responsive']);
					if(isset($field['iconinfo'])) Mfn_Options_field::get_icon_info($field['iconinfo']);
					if(isset($field['desc'])) Mfn_Options_field::get_icon_desc($field['desc']);

					echo '</label>';

					if ( ! empty( $field['desc'] ) ) {
						echo '<div class="desc-group">';
							echo '<span class="description">'. $field['desc'] .'</span>';
						echo '</div>';
					}
				}

				if($field['type'] != 'typography_vb') echo '<div class="form-content">';


	      $field_class = 'MFN_Options_'. $field['type'];
				if( strpos($field['id'], 'typography') !== false || strpos($field['id'], ':filter') !== false ){
	      	$typo_exclude = array('[font-size]', '[font-size_tablet]', '[font-size_mobile]', '[line-height]', '[line-height_tablet]', '[line-height_mobile]', '[font-weight]', '[letter-spacing]', '[letter-spacing_tablet]', '[letter-spacing_mobile]', '[text-transform]', '[font-family]', '[font-style]', '[text-decoration]', '[blur]', '[brightness]', '[saturate]', '[contrast]', '[hue-rotate]');
	      	$jsfield = 'edited_item.'.$prefix.'["'.str_replace($typo_exclude, '', $field['id']).'"]["'.$field_name.'"]';
	      }else{
	      	$jsfield = 'edited_item.'.$prefix.'["'.$field['id'].'"]';
	      }

				require_once( get_template_directory() .'/muffin-options/fields/'. $field['type'] .'/field_'. $field['type'] .'.php' );

				if ( class_exists( $field_class ) ) {
					$field_object = new $field_class( $field, '' );
					$field_object->render( $field['id'], true, $jsfield );
				}

				if($field['type'] != 'typography_vb') echo '</div>';

			}elseif( !empty($field['title']) ){
				echo '<h5 class="row-header-title">'. wp_kses($field['title'], mfn_allowed_html('title')) .'</h5>';
			}

			echo '</div>';

		}

	}

	public function getPresets( $both = false ){

		$return = array();

		if( $both ){
			$local = array();
			$jsonfile = get_theme_file_path('/visual-builder/assets/presets.json');
			if( file_exists($jsonfile) ){
				$local = file_get_contents( $jsonfile );
				if( !empty($local) ) $return = json_decode($local);
			}
		}

		$get_opt = get_option('mfn-presets');
		if( $get_opt ) {
			if( count($return) > 0 ){
				$return = array_merge( $return, json_decode( $get_opt ) );
			}else{
				$return = json_decode( $get_opt );
			}

		}

		return $return;
	}

	public function wrapHtml($item_id, $size, $order, $sizeclass){
		$mfn_helper = new Mfn_Builder_Helper();
		$html = '<div data-title="Wrap" data-icon="mfn-icon-wrap" data-order="'.$order.'" data-uid="'.$item_id.'" data-desktop-size="'.$size.'" data-tablet-size="'.$size.'" data-mobile-size="1/1" class="blink wrap mcb-wrap mcb-wrap-new vb-item vb-item-wrap mcb-wrap-'.$item_id.' '.$sizeclass.' tablet-'.$sizeclass.' mobile-one clearfix"><div class="mcb-wrap-inner empty">'.$mfn_helper->wrapTools($size).'<div class="mfn-drag-helper placeholder-wrap"></div><div class="mfn-wrap-new"><a href="#" class="mfn-item-add mfn-btn btn-icon-left btn-small mfn-btn-blank2"><span class="btn-wrapper"><span class="mfn-icon mfn-icon-add"></span>Add element</span></a></div></div></div>';

		return $html;
	}

	public static function getNavigatorTree($mfn_items){
		if( is_numeric($mfn_items) ){
			$mfn_items = get_post_meta($mfn_items, 'mfn-page-items', true);
			if($mfn_items && !is_array($mfn_items)) {
				$mfn_items = unserialize(call_user_func('base'.'64_decode', $mfn_items));
			}
		}
		$nav = '';
		if(isset($mfn_items) && is_array($mfn_items) && is_iterable($mfn_items)){
			foreach ($mfn_items as $section) {
				if( !empty($section["uid"]) ){
				$nav .= '<li class="navigator-section nav-'.$section["uid"].'"><a data-uid="'.$section['uid'].'" href="#">Section '.( !empty($section['attr']['custom_id']) ? '<span class="navigator-section-id">#'.$section['attr']['custom_id'].'</span>' : null ).'</a><span class="navigator-arrow"><i class="icon-down-open-big"></i></span>';
					if(isset($section['wraps']) && is_iterable($section['wraps'])){
						$nav .= '<ul class="mfn-sub-nav">';
							foreach ($section['wraps'] as $wrap) {
								if( !empty($wrap['uid']) && !empty($wrap['size']) ){
								$nav .= '<li class="navigator-wrap nav-'.$wrap['uid'].'"><a data-uid="'.$wrap['uid'].'" href="#">Wrap <span class="navigator-size-label">'.$wrap['size'].'</span><span class="navigator-add-item back-to-widgets"></a><span class="navigator-arrow"><i class="icon-down-open-big"></i></span>';
									if(isset($wrap['items']) && is_iterable($wrap['items'])){
									$nav .= '<ul class="mfn-sub-nav">';
										foreach ($wrap['items'] as $i=>$item) {
											if( !empty($item['type']) ){
											$nav .= '<li data-name="'.$item['type'].'" class="navigator-item nav-'.$item['uid'].' navitemtype"><a data-uid="'.$item['uid'].'" href="#"><span class="mfn-icon mfn-icon-'.str_replace('_', '-', $item['type']).'"></span>'.( !empty($item['title']) ? $item['title'] : str_replace('_', ' ', ucfirst($item['type'])) ).'</a></li>';
											}
										}
									$nav .= '</ul>';
									}
								$nav .= '</li>';
							}
							}
						$nav .= '</ul>';
					}
				$nav .= '</li>';
			}
			}
		}

		return $nav;
	}

}
