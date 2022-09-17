<?php
/**
 * Single Template
 *
 * @package Betheme
 * @author Muffin group
 * @link https://muffingroup.com
 */

$tmp_id = get_the_ID();
$tmp_type = get_post_meta($tmp_id, 'mfn_template_type', true);

/**
 * Redirect if shop tmpl preview
 * */

if( empty($_GET['visual']) && $tmp_type && $tmp_type == 'single-product' ){
	$sample = Mfn_Builder_Woo_Helper::sample_item('product');
	$product = wc_get_product($sample);
	if( $product->get_id() ) wp_redirect( get_permalink($product->get_id()).'?mfn-template-id='.$tmp_id );
}elseif( empty($_GET['visual']) && $tmp_type && $tmp_type == 'shop-archive' ){
	if(wc_get_page_id( 'shop' )) wp_redirect( get_permalink( wc_get_page_id( 'shop' ) ).'?mfn-template-id='.$tmp_id );
}

if( $tmp_type && in_array( $tmp_type, array('single-product', 'shop-archive')) ){
	get_header( 'shop' );
}else{
	get_header();
}

?>

<div id="Content">
	<div class="content_wrapper clearfix">

		<div class="sections_group">

			<div class="entry-content" itemprop="mainContentOfPage">

				<div class="product">
				<?php

					$mfn_builder = new Mfn_Builder_Front($tmp_id);
					$mfn_builder->show();
					
				?>
				</div>

				<?php 
					// sample content for header builder
					if( $tmp_type == 'header'){
						echo '<div class="mfn-only-sample-content">';
			        	$sample_page_id = get_option( 'page_on_front' );
			        	$mfn_item_sample = get_post_meta($sample_page_id, 'mfn-page-items', true);

			        	$front = new Mfn_Builder_Front($sample_page_id);
						$front->show($mfn_item_sample);
						echo '</div>';
			        }
				?>

			</div>

		</div>

		<?php get_sidebar(); ?>

	</div>
</div>

<?php 

if( $tmp_type && in_array( $tmp_type, array('single-product', 'shop-archive')) ){
	get_footer( 'shop' );
}else{
	get_footer();
}
