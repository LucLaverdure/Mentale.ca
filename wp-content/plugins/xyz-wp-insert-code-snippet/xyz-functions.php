<?php
if ( ! defined( 'ABSPATH' ) ) 
	exit;

if(!function_exists('xyz_ics_plugin_get_version'))
{
	function xyz_ics_plugin_get_version() 
	{
		if ( ! function_exists( 'get_plugins' ) )
			require_once( ABSPATH . 'wp-admin/includes/plugin.php' );
		$plugin_folder = get_plugins( '/' . plugin_basename( dirname( XYZ_INSERT_CODE_PLUGIN_FILE ) ) );
		// 		print_r($plugin_folder);
		return $plugin_folder['xyz-wp-insert-code-snippet.php']['Version'];
	}
}

if(!function_exists('xyz_trim_deep'))
{
	function xyz_trim_deep($value) 
	{
		if ( is_array($value) ) 
		{
			$value = array_map('xyz_trim_deep', $value);
		} 
		elseif ( is_object($value) ) 
		{
			$vars = get_object_vars( $value );
			foreach ($vars as $key=>$data) 
			{
				$value->{$key} = xyz_trim_deep( $data );
			}
		} 
		else 
		{
			$value = trim($value);
		}

		return $value;
	}
}

if(!function_exists('xyz_ics_get_snippet_status'))
{
	function xyz_ics_get_snippet_status($id)
	{
		global $wpdb;
		
		$value="";

		$re=$wpdb->get_row($wpdb->prepare("SELECT * FROM ".$wpdb->prefix."xyz_ics_short_code WHERE id=%d ",$id));

		if(count($re)==1)
		{
			$value=$re->status;
		}
		return $value;
	}
}

if(!function_exists('xyz_ics_get_snippet_usage_privilege_type'))
{
    function xyz_ics_get_snippet_usage_privilege_type($id)
    {
        global $wpdb;
        
        $value="";
        
        $re=$wpdb->get_row($wpdb->prepare("SELECT * FROM ".$wpdb->prefix."xyz_ics_short_code WHERE id=%d ",$id));
        
        if(count($re)==1)
        {
            $value=$re->usage_privilege_type;
        }
        return $value;
    }
}

if(!function_exists('xyz_ics_get_snippet_type'))
{
    function xyz_ics_get_snippet_type($id)
    {
        global $wpdb;
        
        $value="";
        
        $re=$wpdb->get_row($wpdb->prepare("SELECT * FROM ".$wpdb->prefix."xyz_ics_short_code WHERE id=%d ",$id));
        
        if(count($re)==1)
        {
            $value=$re->snippet_type;
        }
        return $value;
    }    
}

if(!function_exists('xyz_ics_get_distinct_snippetinfo'))
{
	function xyz_ics_get_distinct_snippetinfo($fileName,$col_name,$i=1)
	{
		global $wpdb;
		
		$firstFileName=$fileName;
		$fileName.="-copy";
		$fileName = $fileName.$i;
		
		$tot = $wpdb->get_var( "SELECT COUNT(`id`) FROM ".$wpdb->prefix."xyz_ics_short_code WHERE `$col_name`='".$fileName."'" );
		
		if($tot ==0)
			return $fileName;
		else
		{
			$j = $i + 1;
			return xyz_ics_get_distinct_snippetinfo($firstFileName, $col_name, $j);
		}
	}
}

if(!function_exists('xyz_ics_get_all_selected_users'))
{
    function xyz_ics_get_all_selected_users($privilege,$role_name,$snippet_id=0,$snippet_type=0)
	{
		global $wpdb;
		$user_permissions = $wpdb->get_results( $wpdb->prepare("SELECT * FROM ".$wpdb->prefix."xyz_ics_user_privileges WHERE privilege=%s and role=%s and snippet_id=%d and snippet_type=%d",array($privilege,$role_name,$snippet_id,$snippet_type)));
		$user_names='';
		$user_ids='';
		
		foreach($user_permissions as $user)
		{
			if($user_names !='')
				$user_names.=',';
			if($user_ids !='')
				$user_ids.=',';
	
			$user_names.=$user->user_name;
			$user_ids.=$user->user;
		}
		
		$user_list['user_names']=$user_names;
		$user_list['user_ids']=$user_ids;
		return $user_list;
	}
}

if(!function_exists('xyz_ics_links'))
{
	function xyz_ics_links($links, $file) 
	{
		$base = plugin_basename(XYZ_INSERT_CODE_PLUGIN_FILE);
		
		if ($file == $base) 
		{
		    if(get_option('xyz_ics_latest_version')!= xyz_wp_ics_plugin_premium_get_version())
		        $links[] = '<a href="'.get_admin_url().'admin-ajax.php?action=xyz_wp_ics_update_info&width=640&height=596" id="xyz_update" class="thickbox" title="XYZ Snippet">' . __('Update available') . '</a>';
		    
			$links[] = '<a href="http://xyzscripts.com/support/" class="xyz_support" title="Support"></a>';
			$links[] = '<a href="http://twitter.com/xyzscripts" class="xyz_twitt" title="Follow us on Twitter"></a>';
			$links[] = '<a href="https://www.facebook.com/xyzscripts" class="xyz_fbook" title="Like us on Facebook"></a>';
			$links[] = '<a href="https://plus.google.com/+Xyzscripts/" class="xyz_gplus" title="+1 us on Google+"></a>';
			$links[] = '<a href="http://www.linkedin.com/company/xyzscripts" class="xyz_linkedin" title="Follow us on LinkedIn"></a>';
		}
		return $links;
	}
}
add_filter( 'plugin_row_meta','xyz_ics_links',10,2);

if(!function_exists('xyz_wp_ics_plugin_premium_get_version()'))
{
    function xyz_wp_ics_plugin_premium_get_version()
    {
        if ( ! function_exists( 'get_plugins' ) )
            require_once( ABSPATH . 'wp-admin/includes/plugin.php' );
        $plugin_folder = get_plugins( '/' . plugin_basename( dirname( XYZ_INSERT_CODE_PLUGIN_FILE ) ) );
            
        return $plugin_folder['xyz-wp-insert-code-snippet.php']['Version'];
    }
}


if (!function_exists("xyz_wp_ics_getpage"))
{
	function xyz_wp_ics_getpage($url, $ref='', $ctOnly=false, $fields='', $advSettings='',$ch=false) 
    {
        if(!$ch)
            $ch = curl_init($url);
        else
            curl_setopt($ch, CURLOPT_URL, $url);
                
        $ccURL = curl_getinfo($ch, CURLINFO_EFFECTIVE_URL);
        static $curl_loops = 0; static $curl_max_loops = 20; global $xyzics_gCookiesArr;
                
        $cookies = '';
        
        if (is_array($xyzics_gCookiesArr))
            foreach ($xyzics_gCookiesArr as $cName=>$cVal)
                $cookies .= $cName.'='.$cVal.'; ';
                        
            if ($curl_loops++ >= $curl_max_loops){
                $curl_loops = 0; curl_close($ch);return false;
            }
            
            $headers = array();
                        
            if ($fields!='')
                $field_type="POST";
            else
                $field_type="GET";
                                
                                
            $headers[] = 'Cache-Control: max-age=0';
            $headers[] = 'Connection: Keep-Alive';
            $headers[]='Referer: '.$url;
            $headers[]='User-Agent: Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.22 Safari/537.36';
                                
            if($field_type=='POST')
                $headers[]='Content-Type: application/x-www-form-urlencoded';
                                    
            if (isset($advSettings['liXMLHttpRequest'])) {
                $headers[] = 'X-Requested-With: XMLHttpRequest';
            }
            if (isset($advSettings['Origin'])) {
                $headers[] = 'Origin: '.$advSettings['Origin'];
            }
            if ($field_type=='GET')
                $headers[]='Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8';
            else
                $headers[]='Accept: */*';
                                            
            $headers[]='Accept-Encoding: deflate,sdch';
            $headers[] = 'Accept-Language: en-US,en;q=0.8';
                                                                                                                                    
            if(isset($advSettings['noSSLSec'])){
                curl_setopt ($ch, CURLOPT_SSL_VERIFYHOST, 0); curl_setopt ($ch, CURLOPT_SSL_VERIFYPEER, 0);
            }
                                            
            if(isset($advSettings['proxy']) && $advSettings['proxy']['host']!='' && $advSettings['proxy']['port']!==''){
                curl_setopt($ch, CURLOPT_TIMEOUT, 4);  curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 4);
                curl_setopt( $ch, CURLOPT_PROXYTYPE, CURLPROXY_HTTP ); curl_setopt( $ch, CURLOPT_PROXY, $advSettings['proxy']['host'] );
                curl_setopt( $ch, CURLOPT_PROXYPORT, $advSettings['proxy']['port'] );
                
                if ( isset($advSettings['proxy']['up']) && $advSettings['proxy']['up']!='' ) {
                    curl_setopt( $ch, CURLOPT_PROXYAUTH, CURLAUTH_ANY ); curl_setopt( $ch, CURLOPT_PROXYUSERPWD, $advSettings['proxy']['up'] );
                }
            }
            if(isset($advSettings['headers'])){
                $headers = array_merge($headers, $advSettings['headers']);
            }
            curl_setopt($ch, CURLOPT_HEADER, true);     curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_COOKIE, $cookies); curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
            curl_setopt($ch, CURLINFO_HEADER_OUT, true);  if (is_string($ref) && $ref!='') curl_setopt($ch, CURLOPT_REFERER, $ref);
            curl_setopt($ch, CURLOPT_USERAGENT, (( isset( $advSettings['UA']) && $advSettings['UA']!='')?$advSettings['UA']:"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/28.0.1500.44 Safari/537.36"));
                                            
            if ($fields!=''){
                curl_setopt($ch, CURLOPT_POST, true); curl_setopt($ch, CURLOPT_POSTFIELDS, $fields);
            } 
            else 
            { 
                curl_setopt($ch, CURLOPT_POST, false); curl_setopt($ch, CURLOPT_POSTFIELDS, '');  curl_setopt($ch, CURLOPT_HTTPGET, true);
            }
            curl_setopt($ch, CURLOPT_TIMEOUT, 60);  curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 60);
            $content = curl_exec($ch);
            $errmsg = curl_error($ch);  
            
            if (isset($errmsg) && stripos($errmsg, 'SSL')!==false) {
                curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);  $content = curl_exec($ch);
            }
            if (strpos($content, "\n\n")!=false && strpos($content, "\n\n")<100)
                $content = substr_replace($content, "\n", strpos($content,"\n\n"), strlen("\n\n"));
            if (strpos($content, "\r\n\r\n")!=false && strpos($content, "\r\n\r\n")<100)
                $content = substr_replace($content, "\r\n", strpos($content,"\r\n\r\n"), strlen("\r\n\r\n"));
            
            $ndel = strpos($content, "\n\n"); $rndel = strpos($content, "\r\n\r\n");
            if ($ndel==false) $ndel = 1000000; if ($rndel==false) $rndel = 1000000; $rrDel = $rndel<$ndel?"\r\n\r\n":"\n\n";
            list($header, $content) = explode($rrDel, $content, 2);
            if ($ctOnly!==true) {
                $fullresponse = curl_getinfo($ch); $err = curl_errno($ch); $errmsg = curl_error($ch); $fullresponse['errno'] = $err;
                $fullresponse['errmsg'] = $errmsg;  $fullresponse['headers'] = $header; $fullresponse['content'] = $content;
            }
            $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE); $headers = curl_getinfo($ch);
                                                    
            if (empty($headers['request_header'])) $headers['request_header'] = 'Host: None'."\n";
                                                    
            $results = array(); preg_match_all('|Host: (.*)\n|U', $headers['request_header'], $results);
            $ckDomain = str_replace('.', '_', $results[1][0]);  $ckDomain = str_replace("\r", "", $ckDomain);
            $ckDomain = str_replace("\n", "", $ckDomain);
                                                    
                                                    
            $results = array(); $cookies = '';  preg_match_all('|Set-Cookie: (.*);|U', $header, $results); $carTmp = $results[1];
            preg_match_all('/Set-Cookie: (.*)\b/', $header, $xck); $xck = $xck[1];
            //$clCook = array();
            if (isset($advSettings['cdomain']) &&  $advSettings['cdomain']!=''){
                foreach ($carTmp as $iii=>$cTmp)
                    if (stripos($xck[$iii],'Domain=')===false || stripos($xck[$iii],'Domain=.'.$advSettings['cdomain'].';')!==false){
                        $temp = explode('=',$cTmp,2); $xyzics_gCookiesArr[$temp[0]]=$temp[1];
                    }
            }
            else {
                foreach ($carTmp as $cTmp){
                    $temp = explode('=',$cTmp,2);
                    $xyzics_gCookiesArr[$temp[0]]=$temp[1];
                }
            }
                                                    
            /*foreach ($carTmp as $cTmp){
                $temp = explode('=',$cTmp,2);
            }*/
                                                    
            $rURL = '';
                                                    
            if ($http_code == 200 && stripos($content, 'http-equiv="refresh" content="0; url=&#39;')!==false ) {
                $http_code=301; $rURL = xyz_substring($content, 'http-equiv="refresh" content="0; url=&#39;','&#39;"');
                $xyzics_gCookiesArr = array();
            }
            elseif ($http_code == 200 && stripos($content, 'location.replace')!==false ) {
                $http_code=301; $rURL = xyz_substring($content, 'location.replace("','"');
            }
            if ($http_code == 301 || $http_code == 302 || $http_code == 303){
                if ($rURL!='') {
                    $rURL = str_replace('\x3d','=',$rURL); $rURL = str_replace('\x26','&',$rURL);
                    $url = @parse_url($rURL);
                } 
                else { 
                    $matches = array(); preg_match('/Location:(.*?)\n/', $header, $matches); $url = @parse_url(trim(array_pop($matches)));
                } 
                $rURL = '';
                if (!$url){
                    $curl_loops = 0;curl_close($ch); return ($ctOnly===true)?$content:$fullresponse;
                }
                $last_urlX = curl_getinfo($ch, CURLINFO_EFFECTIVE_URL); $last_url = @parse_url($last_urlX);
                if (!$url['scheme']) $url['scheme'] = $last_url['scheme'];  if (!$url['host']) $url['host'] = $last_url['host'];
                if (!$url['path']) $url['path'] = $last_url['path']; if (!isset($url['query'])) $url['query'] = '';
                $new_url = $url['scheme'] . '://' . $url['host'] . $url['path'] . ($url['query']?'?'.$url['query']:'');
                return xyz_wp_ics_getpage($new_url, $last_urlX, $ctOnly, '', $advSettings, $ch);
            } 
            else { 
                $curl_loops=0;curl_close($ch); return ($ctOnly===true)?$content:$fullresponse;
            }
    }
}

if (!function_exists("xyz_folder_copy")) {
    function xyz_folder_copy($source, $dest)
    {
        if (is_file($source)) {
            return copy($source, $dest);
        }
        if (!is_dir($dest)) {
            mkdir($dest);
        }
        $dir = dir($source);
        while (false !== $entry = $dir->read()) {
            if ($entry == '.' || $entry == '..') {
                continue;
            }
            if ($dest !== "$source/$entry") {
                xyz_folder_copy("$source/$entry", "$dest/$entry");
            }
        }
        $dir->close();
        return 1;
    }
}

if (!function_exists("xyz_folder_delete")) {
    function xyz_folder_delete($path)
    {
        if (is_dir($path) === true)
        {
            $files = array_diff(scandir($path), array('.', '..'));
            foreach ($files as $file)
            {
                xyz_folder_delete(realpath($path) . '/' . $file);
            }
            return rmdir($path);
        }
        else if (is_file($path) === true)
        {
            return unlink($path);
        }
        return false;
    }
}

if (!function_exists("xyz_substring")) {
    function xyz_substring($string, $from, $to) {
        $fstart = stripos($string, $from); $tmp = substr($string,$fstart+strlen($from));$flen = stripos($tmp, $to);  return substr($tmp,0, $flen);
    }
}

/////////////////////get ip address////////////////////////////////////
if(!function_exists('xyz_ics_get_ip_address')){
	function xyz_ics_get_ip_address(){
		
		foreach (array('HTTP_CLIENT_IP', 'HTTP_X_FORWARDED_FOR', 'HTTP_X_FORWARDED', 'HTTP_X_CLUSTER_CLIENT_IP', 'HTTP_FORWARDED_FOR', 'HTTP_FORWARDED', 'REMOTE_ADDR') as $key){
			if (array_key_exists($key, $_SERVER) === true){
				foreach (explode(',', $_SERVER[$key]) as $xyz_ics_ip){
					$xyz_ics_ip = trim($xyz_ics_ip); // just to be safe
					
					if (filter_var($xyz_ics_ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) !== false){
						return $xyz_ics_ip;
					}
				}
			}
		}
	}
}
 
 
////////////////////////// 	GEO //////////////////////////////////
function xyz_wp_ics_get_country_from_ip($ip="")
{
	if($ip=="")
		$ip=xyz_ics_get_ip_address();
		
		if (!class_exists('GeoIP'))
		{
			require_once(__DIR__.'/library/geo/geoip.inc');
			
		}
  		$gi = geoip_open(dirname(__FILE__) .'/library/geo/GeoIP.dat',GEOIP_STANDARD);
		$country_code= geoip_country_code_by_addr($gi, $ip);
		geoip_close($gi);
		
		return $country_code;
}

 
?>