<?php  

$header_tmpl_class = array();

if(get_post_meta($args['id'], 'header_position', true)){
	$header_tmpl_class[] = 'mfn-header-tmpl-'.get_post_meta($args['id'], 'header_position', true);
}

if( !empty( get_post_meta($args['id'], 'body_offset_header', true) ) ) {
	$header_tmpl_class[] = 'mfn-header-body-offset-active';
}

echo '<header class="mfn-header-tmpl '.implode(' ', $header_tmpl_class).'">';
$mfn_header_builder = new Mfn_Builder_Front($args['id']);
$mfn_header_builder->show();
echo '</header>';

?>