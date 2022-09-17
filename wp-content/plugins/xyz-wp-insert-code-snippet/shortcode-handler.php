<?php 
if ( ! defined( 'ABSPATH' ) ) 
	exit;
	
global $wpdb;
require( dirname( __FILE__ ) . '/library/vendor/autoload.php' );


use DeviceDetector\DeviceDetector;
use DeviceDetector\Parser\Device\DeviceParserAbstract;
DeviceParserAbstract::setVersionTruncation(DeviceParserAbstract::VERSION_TRUNCATION_NONE);

add_shortcode('xyz-ihs','xyz_ics_display_content');
add_shortcode('xyz-ips','xyz_ics_display_content');
add_shortcode('xyz-ics','xyz_ics_display_content');		

function xyz_ics_display_content($xyz_snippet_name)
{
	global $wpdb;
	
	$user_agent = $_SERVER['HTTP_USER_AGENT'];
	$dd = new DeviceDetector($user_agent);
	$dd->parse();
	$deviceType = ($dd->isMobile() ? ($dd->isTablet() ? 'tablet' : 'phone') : 'computer');
  	if(is_array($xyz_snippet_name))
	{
		$snippet_name = $xyz_snippet_name['snippet'];
		
		$query = $wpdb->get_results($wpdb->prepare( "SELECT * FROM ".$wpdb->prefix."xyz_ics_short_code WHERE title=%s" ,$snippet_name));
		
		if(count($query)>0)
		{
			foreach ($query as $sippetdetails)
			{
				 
 				if($sippetdetails->status==1)
				{
					$enabled_users=$sippetdetails->enabled_users;
					$targetting_countries=$sippetdetails->targetting_countries;
					if($targetting_countries != '1')
						$targetting_countries_decode=json_decode($targetting_countries);
					$targetting_devices=$sippetdetails->targetting_devices;
 
					$client_ip=xyz_ics_get_ip_address();
					 
					$client_ip_db='83.110.250.231'; 
  					$client_ip_in='117.247.104.30';
 					$client_ip_au='110.174.165.78';
   					
 					$country =xyz_wp_ics_get_country_from_ip($client_ip);
 				   
					if($enabled_users==1 && ! is_user_logged_in())
					{
						return '';
 					}
					else if($enabled_users==2 && is_user_logged_in())
					{
						return '';
 					}
					if($targetting_devices==1 && strcasecmp($deviceType,'computer') == 0)
					{
						return '';
 					}else if($targetting_devices==2 && (strcasecmp($deviceType,'tablet') == 0 || strcasecmp($deviceType,'phone') == 0))
					{
						return '';
 					}
 					if( $targetting_countries != '1' && ! in_array($country, $targetting_countries_decode))
					{
						return '';
 					}
				
				    $snippet_content=$sippetdetails->content;
				    foreach ($xyz_snippet_name as $var=>$val)
				    {
				        if(strcasecmp($var, "snippet")==0)
				            continue;
				        
				        $param_key='{'.$var.'}';
				        $param_val=$val;
				        $snippet_content=str_ireplace($param_key, $param_val, $snippet_content);
				       
				    }
				    //regex check for {custom_param}
				    preg_match_all( '/{[a-zA-Z0-9_-]*}/', $snippet_content, $matches);
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
				    //print_r($snippet_content);die;
					if($sippetdetails->snippet_type==1)
					{
					    return do_shortcode($snippet_content) ;
					}
					else
					{
						//$tmp=ob_get_contents();
						//ob_clean();
						ob_start();
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

						    if(stripos($content_to_eval, '<?php') === false && stripos($content_to_eval, '?>') === false)
						    {
						        $content_to_eval=$xyz_ics_content_start.$new_line.$content_to_eval;
						    }
						    else if(stripos($content_to_eval, '<?php') !== false)
						    {
						        if($tag_start_position>=0 && $tag_end_position>=0 && $tag_start_position>$tag_end_position)
						        {
						            $content_to_eval=$xyz_ics_content_start.$new_line.$content_to_eval;
						        }
						    }
						    else if(stripos($content_to_eval, '<?php') === false)
						    {
						        if (stripos($content_to_eval, '?>') !== false)
						        {
						            $content_to_eval=$xyz_ics_content_start.$new_line.$content_to_eval;
						        }
						    }
						    $content_to_eval='?>'.$content_to_eval;
						}
						else{
							if(substr($content_to_eval, 0,5)=='<?php')
								$content_to_eval='?>'.$content_to_eval;
						}	
						
						
						eval($content_to_eval);
						$xyz_em_content = ob_get_contents();
 						ob_end_clean();
						//echo $tmp;
						return $xyz_em_content;
					}
				}
				else 
					return '';
				break;
			}
		}
		else
		{
			return '';
/*			return "<div style='padding:20px; font-size:16px; color:#FA5A6A; width:93%;text-align:center;background:lightyellow;border:1px solid #3FAFE3; margin:20px 0 20px 0'>
			
			Please use a valid short code to call snippet.
			
			
			</div>";
*/			
		}
		
	}
}

add_filter('widget_text', 'do_shortcode'); // to run shortcodes in text widgets
?>