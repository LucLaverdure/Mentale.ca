<?php  
if( ! defined( 'ABSPATH' ) ){
	exit; // Exit if accessed directly
}

$favs = json_decode(get_option( 'mfn_fav_items_'.get_current_user_id() ));

echo '<div class="panel panel-items" id="mfn-widgets-list">
    <div class="panel-search mfn-form">
        <input class="mfn-form-control mfn-form-input search mfn-search" type="text" placeholder="Search">
    </div>';

    echo '<div class="mfn-fav-items-wrapper '.($favs && count($favs) > 0 ? 'isset-favs' : 'empty-favs').'">';
	 	echo '<h5>Favourite elements</h5>';

	 	echo '<div class="mfn-fav-items-content">';
	 	echo '<ul class="items-list fav-items-list clearfix">';
	 	if( $favs && count($favs) > 0 ){
	 		foreach( $favs as $fav ){
	 			echo '<li class="mfn-item-'.$fav.' category-'.$widgets[$fav]['cat'].'" data-title="'.$widgets[$fav]['title'].'" data-type="'.$fav.'"><a href="#"><div class="mfn-icon card-icon"></div><span class="title">'.$widgets[$fav]['title'].'</span></a></li>';
	 		}
	 	}
	 	echo '</ul>';
	 	echo '<span class="empty-favs-info">Collect favourite elements in one place by<br /> <span class="mfn-icon mfn-icon-right-click"></span> &gt; <i>Add to favourites</i></span>';
	 echo '</div></div>';

    echo '<ul class="items-list list clearfix">';
	foreach($widgets as $w=>$widget){
		if( 
			( !in_array($widget['cat'], array('shop-archive', 'single-product', 'header')) ) || 
			( isset($this->template_type) && $this->template_type == 'single-product' && $widget['cat'] == 'single-product' ) || 
			( isset($this->template_type) && $this->template_type == 'shop-archive' && $widget['cat'] == 'shop-archive' ) || 
			( isset($this->template_type) && $this->template_type == 'header' && $widget['cat'] == 'header' ) 
		){
			echo '<li class="mfn-item-'.$w.' category-'.$widget['cat'].'" data-title="'.$widget['title'].'" data-type="'.$w.'"><a href="#"><div class="mfn-icon card-icon"></div><span class="title">'.$widget['title'].'</span></a></li>';
		}
	}
	echo '</ul>
</div>';
?>