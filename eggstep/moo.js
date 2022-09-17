function distanceTXT(lat1,lon1,lat2,lon2) {
	var R = 6371; // km (change this constant to get miles)
	var dLat = (lat2-lat1) * Math.PI / 180;
	var dLon = (lon2-lon1) * Math.PI / 180;
	var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
		Math.cos(lat1 * Math.PI / 180 ) * Math.cos(lat2 * Math.PI / 180 ) *
		Math.sin(dLon/2) * Math.sin(dLon/2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
	var d = R * c;
	if (d>1) return Math.round(d)+"km";
	else if (d<=1) return Math.round(d*1000)+"m";
	return d;
}

function distance(lat1,lon1,lat2,lon2) {
	var R = 6371; // km (change this constant to get miles)
	var dLat = (lat2-lat1) * Math.PI / 180;
	var dLon = (lon2-lon1) * Math.PI / 180;
	var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
		Math.cos(lat1 * Math.PI / 180 ) * Math.cos(lat2 * Math.PI / 180 ) *
		Math.sin(dLon/2) * Math.sin(dLon/2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
	var d = R * c;
	return d;
}

jQuery(document).on('click', ".post-item", function(evt) {
  window.location = jQuery(this).find("a").last().attr("href");
});

jQuery(function() {
    if ((jQuery("h3").first().html() == "Search") || (jQuery("h3").first().html() == "Recherche")) {
		jQuery("body").addClass("estab");
	} else {
		jQuery(".scale-with-grid.wp-post-image").parents(".post-item").find(".post-desc-wrapper").css("margin-top","-85%");
	}

	jQuery(".counted").each(function() {
		var counted = jQuery(this).html();
		var tab = jQuery(this).parents(".ui-tabs-panel").first().attr("aria-labelledby");
		jQuery(this).parents(".tabs_wrapper").first().find(".ui-tabs-nav li[aria-labelledby='"+tab+"'] a").append(" ("+counted+")");
	});
	
	if (jQuery(".dis-cat").length > 0) {
		
		var lat = 0;
		var lng = 0;
		
		// sort locations
		try {
			
			navigator.geolocation.getCurrentPosition(function(position) {
				lat = position.coords.latitude;
				lng = position.coords.longitude;
				
				if ((lat == 0) && (lng == 0)) throw "Location Disabled...";
				
				jQuery(".dis-cat").each(function() {
					
					var thisLat = jQuery(this).attr("data-lat");
					var thisLng = jQuery(this).attr("data-lng");
					
					// calc distance
					var distTXT = distanceTXT(thisLat, thisLng, lat, lng);
					var dist = distance(thisLat, thisLng, lat, lng);
					
					jQuery(this).prepend("<span>("+distTXT+")</span> ");
					jQuery(this).attr("data-distm", dist);
					
				});
				
				jQuery('.dis-cat').sort(function(a,b) {
					var a1 = jQuery(a).attr("data-distm");
					var b1 = jQuery(b).attr("data-distm");
					return (a1 - b1);
				}).appendTo(jQuery('.dis-cat').parent());
				
				jQuery('.dis-cat').parent().find("br").remove();
			});

		} catch (e) {
			jQuery(".dis-cat").first().parent().prepend("Location not enabled, can't sort to nearest you.");
			jQuery('.dis-cat').parent().find("br").remove();
		}		
	}

	jQuery('.QuickColor').each(function() {
		var $this = jQuery(this);
		var i = Math.floor((Math.random() * 10) + 1);
		if (i > 5) {
			$this.append('<img src="/eggstep/pad.svg" width="35" height="35" />');
		}
	});
	

});
