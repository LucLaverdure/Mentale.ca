<?php 
if ( ! defined( 'ABSPATH' ) ) 
	exit;
	
header( 'Content-Type: text/javascript' );

if ( ! is_user_logged_in() )
	die('You must be logged in to access this script.');
	
if(!isset($shortcodesXYZECH))
	$shortcodesXYZECH = new XYZ_Insert_HTML_Code_TinyMCESelector();

if(!isset($shortcodesXYZECP))
	$shortcodesXYZECP = new XYZ_Insert_PHP_Code_TinyMCESelector();
	
global $wpdb;

$html_snippet_id_array=apply_filters('xyz_ics_before_snippet_fetching', array('snippet_type'=>1));
$php_snippet_id_array=apply_filters('xyz_ics_before_snippet_fetching', array('snippet_type'=>2));

$html_permitted_snippet_ids=$html_snippet_id_array['permitted_snippet_ids'];
$php_permitted_snippet_ids=$php_snippet_id_array['permitted_snippet_ids'];

$html_permitted_snippet_ids_array=explode(",", $html_permitted_snippet_ids);
$php_permitted_snippet_ids_array=explode(",", $php_permitted_snippet_ids);

$html_string=" AND id IN(".$html_permitted_snippet_ids.")";
$php_string=" AND id IN(".$php_permitted_snippet_ids.")";


$xyz_snippets_arr=$wpdb->get_results($wpdb->prepare( "SELECT id,title FROM ".$wpdb->prefix."xyz_ics_short_code WHERE status=%d  ORDER BY id DESC",1),ARRAY_A );
// 		print_r($xyz_snippets_arr);
$xyz_snippets_arr_html=$wpdb->get_results($wpdb->prepare( "SELECT id,title FROM ".$wpdb->prefix."xyz_ics_short_code WHERE status=%d AND snippet_type=%d $html_string ORDER BY id DESC",1,1),ARRAY_A );
$xyz_snippets_arr_php=$wpdb->get_results($wpdb->prepare( "SELECT id,title FROM ".$wpdb->prefix."xyz_ics_short_code WHERE status=%d AND snippet_type=%d $php_string ORDER BY id DESC",1,2),ARRAY_A );

if(count($xyz_snippets_arr)==0)
	die;

if((count($html_permitted_snippet_ids_array)==0)  && (count($php_permitted_snippet_ids_array)==0))
	die;
	
if(floatval(get_bloginfo('version'))>=3.9)
{
?>
	(function() {
		<?php if(count($xyz_snippets_arr_html)>0 && count($html_permitted_snippet_ids_array)>0){?>
		 tinymce.PluginManager.add('<?php echo $shortcodesXYZECH->buttonName; ?>', function( editor, url ) {
		        editor.addButton( '<?php echo $shortcodesXYZECH->buttonName; ?>', {
		            title: 'XYZ WP Insert Code Snippet',
		            type: 'menubutton',
		            icon: 'icon xyz-ics-own-html-icon',
		            menu: [
		            		
							<?php foreach ($xyz_snippets_arr_html as $key=>$val) { ?>            
				            	{
				            		text: '<?php echo addslashes($val['title']); ?>',
				            		value: '[xyz-ics snippet="<?php echo addslashes($val['title']); ?>"]',
				            		onclick: function() {
				            			editor.insertContent(this.value());
				            		}
				           		},
							<?php } ?>  
							
		           ]
		        });
		});
		<?php }if(count($xyz_snippets_arr_php)>0 && count($php_permitted_snippet_ids_array)>0){?>		
		tinymce.PluginManager.add('<?php echo $shortcodesXYZECP->buttonName; ?>', function( editor, url ) {
		        editor.addButton( '<?php echo $shortcodesXYZECP->buttonName; ?>', {
		            title: 'XYZ WP Insert Code Snippet',
		            type: 'menubutton',
		            icon: 'icon xyz-ics-own-php-icon',
		            menu: [
		            		
							<?php foreach ($xyz_snippets_arr_php as $key=>$val) { ?>            
				            	{
				            		text: '<?php echo addslashes($val['title']); ?>',
				            		value: '[xyz-ics snippet="<?php echo addslashes($val['title']); ?>"]',
				            		onclick: function() {
				            			editor.insertContent(this.value());
				            		}
				           		},
							<?php } ?>           		
		           ]
		        });
		});
		<?php }?>
	})();
<?php 
} 
else 
{ 
	$xyz_snippets_html = array(
                'title'   =>'XYZ WP Insert Code Snippet',
				'url'	=> plugins_url('xyz-wp-insert-code-snippet/images/logo.png'),
                'xyz_ics_snippets_html' => $xyz_snippets_arr_html
            );
	?>

	var tinymce_<?php echo $shortcodesXYZECH->buttonName; ?> =<?php echo json_encode($xyz_snippets_html) ?>;
	
	(function() {
		//******* Load plugin specific language pack
	
		tinymce.create('tinymce.plugins.<?php echo $shortcodesXYZECH->buttonName; ?>', {
			/**
			 * Initializes the plugin, this will be executed after the plugin has been created.
			 * This call is done before the editor instance has finished it's initialization so use the onInit event
			 * of the editor instance to intercept that event.
			 *
			 * @param {tinymce.Editor} ed Editor instance that the plugin is initialized in.
			 * @param {string} url Absolute URL to where the plugin is located.
			 */
			init : function(ed, url) {
	
	         tinymce_<?php echo $shortcodesXYZECH->buttonName; ?>.insert = function(){
	                if(this.v && this.v != ''){
	                tinymce.execCommand('mceInsertContent', false, '[xyz-ics snippet="'+tinymce_<?php echo $shortcodesXYZECH->buttonName; ?>.xyz_ics_snippets_html[this.v]['title']+'"]');
					}
	            };
				
			},
	
			/**
			 * Creates control instances based in the incomming name. This method is normally not
			 * needed since the addButton method of the tinymce.Editor class is a more easy way of adding buttons
			 * but you sometimes need to create more complex controls like listboxes, split buttons etc then this
			 * method can be used to create those.
			 *
			 * @param {String} n Name of the control to create.
			 * @param {tinymce.ControlManager} cm Control manager to use inorder to create new control.
			 * @return {tinymce.ui.Control} New control instance or null if no control was created.
			 */
			createControl : function(n, cm) {
				if(n=='<?php echo $shortcodesXYZECH->buttonName; ?>'){
	                var c = cm.createSplitButton('<?php echo $shortcodesXYZECH->buttonName; ?>', {
	                     title : tinymce_<?php echo $shortcodesXYZECH->buttonName; ?>.title,
						 image :  tinymce_<?php echo $shortcodesXYZECH->buttonName; ?>.url,
	                     onclick : tinymce_<?php echo $shortcodesXYZECH->buttonName; ?>.insert
	                });
	
	                // Add some values to the list box
	              
	
					c.onRenderMenu.add(function(c, m){
			                 for (var id in tinymce_<?php echo $shortcodesXYZECH->buttonName; ?>.xyz_ics_snippets_html){
	                            m.add({
	                                v : id,
	                                title : tinymce_<?php echo $shortcodesXYZECH->buttonName; ?>.xyz_ics_snippets_html[id]['title'],
	                                onclick : tinymce_<?php echo $shortcodesXYZECH->buttonName; ?>.insert
	                            });
	                        }
	                    });
	
	
	                // Return the new listbox instance
	                return c;
	             }
	             
	             return null;
			},
			
		});
	
		// Register plugin
		tinymce.PluginManager.add('<?php echo $shortcodesXYZECH->buttonName; ?>', tinymce.plugins.<?php echo $shortcodesXYZECH->buttonName; ?>);
	})();
	
	<?php 
	$xyz_snippets_php = array(
	    'title'   =>'XYZ WP Insert Code Snippet',
	    'url'	=> plugins_url('xyz-wp-insert-code-snippet/images/logo.png'),
	    'xyz_ics_snippets_php' => $xyz_snippets_arr_php
	);
	?>

	var tinymce_<?php echo $shortcodesXYZECP->buttonName; ?> =<?php echo json_encode($xyz_snippets_php) ?>;
	
	(function() {
		//******* Load plugin specific language pack
	
		tinymce.create('tinymce.plugins.<?php echo $shortcodesXYZECP->buttonName; ?>', {
			/**
			 * Initializes the plugin, this will be executed after the plugin has been created.
			 * This call is done before the editor instance has finished it's initialization so use the onInit event
			 * of the editor instance to intercept that event.
			 *
			 * @param {tinymce.Editor} ed Editor instance that the plugin is initialized in.
			 * @param {string} url Absolute URL to where the plugin is located.
			 */
			init : function(ed, url) {
	
	         tinymce_<?php echo $shortcodesXYZECP->buttonName; ?>.insert = function(){
	                if(this.v && this.v != ''){
	                tinymce.execCommand('mceInsertContent', false, '[xyz-ics snippet="'+tinymce_<?php echo $shortcodesXYZECP->buttonName; ?>.xyz_ics_snippets_php[this.v]['title']+'"]');
					}
	            };
				
			},
	
			/**
			 * Creates control instances based in the incomming name. This method is normally not
			 * needed since the addButton method of the tinymce.Editor class is a more easy way of adding buttons
			 * but you sometimes need to create more complex controls like listboxes, split buttons etc then this
			 * method can be used to create those.
			 *
			 * @param {String} n Name of the control to create.
			 * @param {tinymce.ControlManager} cm Control manager to use inorder to create new control.
			 * @return {tinymce.ui.Control} New control instance or null if no control was created.
			 */
			createControl : function(n, cm) {
				if(n=='<?php echo $shortcodesXYZECP->buttonName; ?>'){
	                var c = cm.createSplitButton('<?php echo $shortcodesXYZECP->buttonName; ?>', {
	                     title : tinymce_<?php echo $shortcodesXYZECP->buttonName; ?>.title,
						 image :  tinymce_<?php echo $shortcodesXYZECP->buttonName; ?>.url,
	                     onclick : tinymce_<?php echo $shortcodesXYZECP->buttonName; ?>.insert
	                });
	
	                // Add some values to the list box
	              
	
					c.onRenderMenu.add(function(c, m){
			                 for (var id in tinymce_<?php echo $shortcodesXYZECP->buttonName; ?>.xyz_ics_snippets_php){
	                            m.add({
	                                v : id,
	                                title : tinymce_<?php echo $shortcodesXYZECP->buttonName; ?>.xyz_ics_snippets_php[id]['title'],
	                                onclick : tinymce_<?php echo $shortcodesXYZECP->buttonName; ?>.insert
	                            });
	                        }
	                    });
	
	
	                // Return the new listbox instance
	                return c;
	             }
	             
	             return null;
			},
			
		});
	
		// Register plugin
		tinymce.PluginManager.add('<?php echo $shortcodesXYZECP->buttonName; ?>', tinymce.plugins.<?php echo $shortcodesXYZECP->buttonName; ?>);
	})();

<?php } ?>