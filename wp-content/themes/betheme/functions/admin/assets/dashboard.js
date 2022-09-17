(function($) {

  /* globals jQuery */

  "use strict";

  /**
   * $(document).ready
   * Specify a function to execute when the DOM is fully loaded.
   */

  $(function($) {

    /**
     * Dashboard | Deregister theme | Confirmation
     */

    $('.form-deregister .confirm.deregister').on('click', 'a', function(e) {
      e.preventDefault();

      $(this).parent().hide()
        .next().fadeIn();
    });

    $('.form-deregister .question').on('click', 'a.cancel', function(e) {
      e.preventDefault();

      $(this).parent().hide()
        .prev().fadeIn();
    });

    /**
     * Promo banner
     */

    $('.be-promo-banner-close').on('click', function(e) {
      e.preventDefault();

      var $banner = $(this).closest('.banner-wrapper');

      var version = $banner.data('version');

      $.ajax({
        url: ajaxurl,
        data: {
          'mfn-builder-nonce': $(this).attr('data-nonce'),
          action: 'mfn_promo_close',
          version: version,
        },
        type: 'POST',
        success: function(response){
          $banner.hide();
        }
      });

    });

    /**
     * Tools | Regenerate
     */

    $('.tools-do-ajax').on('click', function(e) {
      e.preventDefault();

      var $btn = $(this);

      var btn_txt = $btn.text(),
        action = $btn.attr('data-action');

      if( $btn.hasClass('loading') ){
        return;
      }

      if ( $btn.hasClass('confirm') && ! confirm( "Are you sure you want to run this tool?" ) ) {
        return false;
      }

      $btn.addClass('loading').text('Please wait...');

      $.ajax({
        url: ajaxurl,
        data: {
          'mfn-builder-nonce': $btn.attr('data-nonce'),
          action: action
        },
        type: 'POST',
        success: function(response){
          $btn.removeClass('loading').text('Done');
          setTimeout(function() { $btn.text(btn_txt); }, 2000);
        }
      });

    });

  });

})(jQuery);
