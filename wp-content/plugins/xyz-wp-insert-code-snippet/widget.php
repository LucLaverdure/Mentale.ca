<?php
if ( ! defined( 'ABSPATH' ) ) 
    exit;
/**
 * XYZScripts Insert Code Snippet Widget Class
 */

////*****************************Sidebar Widget**********************************////

class Xyz_Insert_Code_Widget extends WP_Widget {
 
    /** constructor -- name this the same as the class above */
    function __construct() {
        parent::__construct(false, $name = 'XYZ WP Insert Code Snippet');   
    }
 
    /** @see WP_Widget::widget -- do not rename this */
    function widget($args, $instance) { 
        
        extract( $args );
        global $wpdb;
        
        $title      = apply_filters('widget_title', $instance['title']);
        $xyz_ics_id = $instance['message'];
        $entries = $wpdb->get_results($wpdb->prepare( "SELECT content,snippet_type FROM ".$wpdb->prefix."xyz_ics_short_code  WHERE id=%d",$xyz_ics_id ));
        
        $entry = $entries[0];
        //print_r($entry);
        echo $before_widget;
        $snippet_content=$entry->content;
        
        preg_match_all( '/{[a-zA-Z0-9_-]*}/',$snippet_content, $matches);
        
        if (!empty($matches[0]))
        {
        	$xyz_ics_def_custom_params=unserialize(get_option('xyz_ics_def_custom_params'));
        	if (!empty($xyz_ics_def_custom_params)){
        		foreach ($matches[0] as $custom_param )
        		{
        		$custom_param_name=substr($custom_param, 1, -1);
        		if (array_key_exists($custom_param_name, $xyz_ics_def_custom_params))
        		$snippet_content=str_replace($custom_param, $xyz_ics_def_custom_params[$custom_param_name], $snippet_content);
        		}
        	}
        }
        
        if ($title)
            echo $before_title . $title . $after_title;
        
        if($entry->snippet_type==1){
            echo do_shortcode($entry->content);
        }
        else{
        	$content_to_eval=$snippet_content;
            
            /*if(strpos($content_to_eval, '<?php') !== false || strpos($content_to_eval, '?>') !== false)
            {
                if (strpos($content_to_eval, '<?php') !== false)
                    $tag_start_position=strpos($content_to_eval,'<?php');
                else
                    $tag_start_position="-1";
                        
                if($tag_start_position>0)
                {
                    $content_to_eval='?>'.$content_to_eval;
                }
            }
            
            if(substr($content_to_eval, 0,5)=='<?php')*/

            if(get_option('xyz_ics_auto_insert')==1){
                $xyz_ics_content_start='<?php';
                $new_line="\r\n";
                $xyz_ics_content_end='?>';

                if (stripos($content_to_eval, '<?php') !== false)
                    $tag_start_position=stripos($content_to_eval,'<?php');
                else
                    $tag_start_position="-1";

                if (stripos($content_to_eval, '?>') !== false)
                    $tag_end_position=stripos($content_to_eval,'?>');
                else
                    $tag_end_position="-1";

                if(stripos($content_to_eval, '<?php') === false && stripos($content_to_eval, '?>') === false){
                    $content_to_eval=$xyz_ics_content_start.$new_line.$content_to_eval;
                }
                else if(stripos($content_to_eval, '<?php') !== false){
                    if($tag_start_position>=0 && $tag_end_position>=0 && $tag_start_position>$tag_end_position){
                        $content_to_eval=$xyz_ics_content_start.$new_line.$content_to_eval;
                    }
                }
                else if(stripos($content_to_eval, '<?php') === false){
                    if (stripos($content_to_eval, '?>') !== false){
                        $content_to_eval=$xyz_ics_content_start.$new_line.$content_to_eval;
                    }
                }
                $content_to_eval='?>'.$content_to_eval;
            }
            /***** to handle old codes : end *****/
            else{
                if(substr(trim($content_to_eval), 0,5)=='<?php')
                    $content_to_eval='?>'.$content_to_eval;
            }
            eval($content_to_eval);
        }
                            
        echo $after_widget;
    }
 
    /** @see WP_Widget::update -- do not rename this */
    function update($new_instance, $old_instance) {     
        $instance = $old_instance;
        $instance['title'] = strip_tags($new_instance['title']);
        $instance['message'] = strip_tags($new_instance['message']);
        return $instance;
    }
 
    /** @see WP_Widget::form -- do not rename this */
    function form($instance) {  
        
        global $wpdb;
        
        $html_snippet_id_array=apply_filters('xyz_ics_before_snippet_fetching', array('snippet_type'=>1));
        $php_snippet_id_array=apply_filters('xyz_ics_before_snippet_fetching', array('snippet_type'=>2));
        
        $html_permitted_snippet_ids=$html_snippet_id_array['permitted_snippet_ids'];
        $php_permitted_snippet_ids=$php_snippet_id_array['permitted_snippet_ids'];
        
        $html_permitted_snippet_ids_array=explode(",", $html_permitted_snippet_ids);
        $php_permitted_snippet_ids_array=explode(",", $php_permitted_snippet_ids);
        
        $html_string=" AND id IN(".$html_permitted_snippet_ids.")";
        $php_string=" AND id IN(".$php_permitted_snippet_ids.")";
        
        $entries = $wpdb->get_results($wpdb->prepare( "SELECT * FROM ".$wpdb->prefix."xyz_ics_short_code WHERE status=%d  ORDER BY id DESC",1 ));
        $entries_html = $wpdb->get_results($wpdb->prepare( "SELECT * FROM ".$wpdb->prefix."xyz_ics_short_code WHERE status=%d AND snippet_type=%d $html_string ORDER BY id DESC",1,1 ));
        $entries_php = $wpdb->get_results($wpdb->prepare( "SELECT * FROM ".$wpdb->prefix."xyz_ics_short_code WHERE status=%d AND snippet_type=%d $php_string ORDER BY id DESC",1,2 ));
        
        if(isset($instance['title'])) {
            $title  = esc_attr($instance['title']);
        }else {
            $title = '';
        }
        
        if(isset($instance['message'])) {
            $message= esc_attr($instance['message']);
        }else {
            $message = '';
        }       
        ?>
        <p>
            <label for="<?php echo $this->get_field_id('title'); ?>"><?php _e('Title:'); ?></label> 
            <input class="widefat" id="<?php echo $this->get_field_id('title'); ?>" name="<?php echo $this->get_field_name('title'); ?>" type="text" value="<?php echo $title; ?>" />
        </p>
        <p>
          <label for="<?php echo $this->get_field_id('message'); ?>"><?php _e('Choose Snippet :'); ?></label> 
          <!--  <input class="widefat" id="<?php echo $this->get_field_id('message'); ?>" name="<?php echo $this->get_field_name('message'); ?>" type="text" value="<?php echo $message; ?>" />-->
          <select name="<?php echo $this->get_field_name('message'); ?>">
              <?php 
                if(count($entries)>0 ) 
                {
                    $count=1;
                    $class = '';
                    
                    if(count($entries_html)>0 && count($html_permitted_snippet_ids_array)>0)
                    {
                        ?>
                        <optgroup label="HTML Snippets">
                        <?php 
                        foreach( $entries_html as $entry ) 
                        {
                            ?>
                            <option value="<?php echo $entry->id;?>" <?php if($message==$entry->id)echo "selected"; ?>><?php echo $entry->title;?></option>
                            <?php       
                        }
                        ?>
                        </optgroup>
                        <?php 
                    }
                    if(count($entries_php)>0 && count($php_permitted_snippet_ids_array)>0)
                    {
                        ?>
                        <optgroup label="PHP Snippets">
                        <?php
                        foreach( $entries_php as $entry )
                        {
                            ?>
                            <option value="<?php echo $entry->id;?>" <?php if($message==$entry->id)echo "selected"; ?>><?php echo $entry->title;?></option>
                            <?php
                        }
                        ?>
                        </optgroup>
                    <?php
                    }
                }
                ?>
          </select>
        </p>
        <?php 
    }
} // end class Xyz_Insert_Code_Widget

function xyz_ics_add_snippet_widget()
{
    $permitted_snippet_ids_array=apply_filters('xyz_ics_before_widget_display',array());
    
    if(count($permitted_snippet_ids_array)>0)
       register_widget("Xyz_Insert_Code_Widget");
}
add_action('widgets_init','xyz_ics_add_snippet_widget');

//add_action('widgets_init', create_function('', 'return register_widget("Xyz_Insert_Code_Widget");'));
?>