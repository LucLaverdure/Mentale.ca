<?php
  $banner = get_site_option( 'betheme_promo' );
?>

<?php if( $banner ): ?>

<div class="banner-wrapper" data-version="<?php echo esc_attr( $this->promo_version ); ?>">
  <div class="banner-wraper-inner">
    <?php echo $banner; ?>
  </div>
  <a class="close-banner be-promo-banner-close" href="#" data-nonce="<?php echo wp_create_nonce( 'mfn-builder-nonce' ); ?>">&#10005;</a>
</div>

<?php endif; ?>
