<?php
if ( ! defined( 'ABSPATH' ) )
	exit;

function xyz_ics_network_install($networkwide)
{
	global $wpdb;

	if ( ! function_exists( 'is_plugin_active' ) )
	    require_once( ABSPATH . '/wp-admin/includes/plugin.php' );

	if (is_plugin_active( 'insert-html-snippet/insert-html-snippet.php'))
	{
	    wp_die("Plugin can be activated only after deactivating the plugin Insert HTML Snippet. Existing snippets from Insert HTML Snippet will be imported when you activate premium plugin.  Back to <a href='".admin_url()."plugins.php'>Plugin Installation</a>.");
	}
	if (is_plugin_active( 'insert-php-code-snippet/insert-php-code-snippet.php'))
	{
	    wp_die("Plugin can be activated only after deactivating the plugin Insert PHP Code Snippet. Existing snippets from Insert PHP Code Snippet will be imported when you activate premium plugin.  Back to <a href='".admin_url()."plugins.php'>Plugin Installation</a>.");
	}

	if (function_exists('is_multisite') && is_multisite())
	{
		// check if it is a network activation - if so, run the activation function for each blog id
		if ($networkwide)
		{
			$old_blog = $wpdb->blogid;
			// Get all blog ids
			$blogids = $wpdb->get_col("SELECT blog_id FROM $wpdb->blogs");
			foreach ($blogids as $blog_id)
			{
				switch_to_blog($blog_id);
				xyz_ics_install();
			}
			switch_to_blog($old_blog);
			return;
		}
	}

	xyz_ics_install();
}

function xyz_ics_install()
{
	global $wpdb;
	//global $current_user; wp_get_current_user();
	if(get_option('xyz_ics_sort_order')=='')
	{
		add_option('xyz_ics_sort_order','desc');
	}
	if(get_option('xyz_ics_sort_field_name')=='')
	{
		add_option('xyz_ics_sort_field_name','id');
	}

	$icsap_installed_date = get_option('icsap_installed_date');

	if ($icsap_installed_date=="")
	{
		$icsap_installed_date = time();
		update_option('icsap_installed_date', $icsap_installed_date);
	}

	if(get_option('xyz_credit_link') == "")
	{
		add_option("xyz_credit_link",0);
	}

	if(get_option('xyz_ics_auto_insert')==""){
        	add_option('xyz_ics_auto_insert',1);
    	}

	add_option('xyz_ics_limit',20);


	$queryInsertCode = "CREATE TABLE IF NOT EXISTS  ".$wpdb->prefix."xyz_ics_short_code (
		`id` int NOT NULL AUTO_INCREMENT,
		`title` varchar(1000) COLLATE utf8_unicode_ci NOT NULL,
		`content` longtext COLLATE utf8_unicode_ci NOT NULL,
		`short_code` varchar(2000) COLLATE utf8_unicode_ci NOT NULL,
		`snippet_type` int NOT NULL default 0 COMMENT '1-Html, 2-Php',
		`status` int NOT NULL,
		`user` int NOT NULL default 0,
        `usage_privilege_type` int NOT NULL default 0 COMMENT '0-Default, 1-Override Default',
 		PRIMARY KEY (`id`)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1";
	$wpdb->query($queryInsertCode);

	$query = "CREATE TABLE IF NOT EXISTS  ".$wpdb->prefix."xyz_ics_role_privileges (
		`id` int NOT NULL AUTO_INCREMENT,
		`role` varchar(255),
		`privilege` varchar(255),
		`value` int NOT NULL default 0,
		`snippet_id` int NOT NULL default 0,
        `snippet_type` int NOT NULL default 0 COMMENT '1-Html, 2-Php',
		PRIMARY KEY (`id`)
		) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1";
	$wpdb->query($query);

	$query = "CREATE TABLE IF NOT EXISTS  ".$wpdb->prefix."xyz_ics_user_privileges (
		`id` int NOT NULL AUTO_INCREMENT,
		`user` varchar(255),
		`privilege` varchar(255),
		`user_name` varchar(255),
		`role` varchar(255),
		`snippet_id` int NOT NULL default 0,
        `snippet_type` int NOT NULL default 0 COMMENT '1-Html, 2-Php',
		PRIMARY KEY (`id`)
		) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1";
	$wpdb->query($query);
	$tblcolums = $wpdb->get_col("SHOW COLUMNS FROM  ".$wpdb->prefix."xyz_ics_short_code");
	
	if(!(in_array("enabled_users", $tblcolums)))
		$wpdb->query("ALTER TABLE ".$wpdb->prefix."xyz_ics_short_code ADD enabled_users int NOT NULL default 3 ");
	if(!(in_array("targetting_countries", $tblcolums)))
		$wpdb->query("ALTER TABLE ".$wpdb->prefix."xyz_ics_short_code ADD targetting_countries text default NULL ");
	if(!(in_array("targetting_devices", $tblcolums)))
		$wpdb->query("ALTER TABLE ".$wpdb->prefix."xyz_ics_short_code ADD targetting_devices int NOT NULL default 3 ");
 	 
 	$wpdb->update($wpdb->prefix.'xyz_ics_short_code', array('targetting_countries'=>'1'), array('targetting_countries'=>NULL));
	 
 	$query="CREATE TABLE IF NOT EXISTS ".$wpdb->prefix."xyz_ics_countries (
        `code` char(2)  NOT NULL,
        `name` varchar(200)  NOT NULL,
         PRIMARY KEY  (`code`)
         ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1";
	$wpdb->query($query);
	
	$result = $wpdb->query("SELECT * FROM ".$wpdb->prefix."xyz_ics_countries");
	
	if($result == 0)
	{
		$query = "INSERT INTO ".$wpdb->prefix."xyz_ics_countries  (`code`, `name`) VALUES
	('AD', 'Andorra'),
	('AE', 'United Arab Emirates'),
	('AF', 'Afghanistan'),
	('AG', 'Antigua and Barbuda'),
	('AI', 'Anguilla'),
	('AL', 'Albania'),
	('AM', 'Armenia'),
	('AO', 'Angola'),
	('AR', 'Argentina'),
	('AS', 'American Samoa'),
	('AT', 'Austria'),
	('AU', 'Australia'),
	('AW', 'Aruba'),
	('AZ', 'Azerbaijan'),
	('BA', 'Bosnia and Herzegovina'),
	('BB', 'Barbados'),
	('BD', 'Bangladesh'),
	('BE', 'Belgium'),
	('BF', 'Burkina Faso'),
	('BG', 'Bulgaria'),
	('BH', 'Bahrain'),
	('BI', 'Burundi'),
	('BJ', 'Benin'),
	('BM', 'Bermuda'),
	('BO', 'Bolivia'),
	('BR', 'Brazil'),
	('BS', 'Bahamas'),
	('BT', 'Bhutan'),
	('BW', 'Botswana'),
	('BY', 'Belarus'),
	('BZ', 'Belize'),
	('CA', 'Canada'),
	('CC', 'Cocos (Keeling) Islands'),
	('CD', 'Congo, The Democratic Republic of the'),
	('CF', 'Central African Republic'),
	('CG', 'Congo'),
	('CH', 'Switzerland'),
	('CI', 'Cote d''Ivoire'),
	('CK', 'Cook Islands'),
	('CL', 'Chile'),
	('CM', 'Cameroon'),
	('CN', 'China'),
	('CO', 'Colombia'),
	('CR', 'Costa Rica'),
	('CU', 'Cuba'),
	('CV', 'Cape Verde'),
	('CX', 'Christmas Island'),
	('CY', 'Cyprus'),
	('CZ', 'Czech Republic'),
	('DE', 'Germany'),
	('DJ', 'Djibouti'),
	('DK', 'Denmark'),
	('DM', 'Dominica'),
	('DO', 'Dominican Republic'),
	('DZ', 'Algeria'),
	('EC', 'Ecuador'),
	('EE', 'Estonia'),
	('EG', 'Egypt'),
	('ER', 'Eritrea'),
	('ES', 'Spain'),
	('ET', 'Ethiopia'),
	('FI', 'Finland'),
	('FJ', 'Fiji'),
	('FO', 'Faroe Islands'),
	('FR', 'France'),
	('GA', 'Gabon'),
	('GB', 'United Kingdom'),
	('GD', 'Grenada'),
	('GE', 'Georgia'),
	('GF', 'French Guiana'),
	('GG', 'Guernsey'),
	('GH', 'Ghana'),
	('GI', 'Gibraltar'),
	('GL', 'Greenland'),
	('GM', 'Gambia'),
	('GN', 'Guinea'),
	('GQ', 'Equatorial Guinea'),
	('GR', 'Greece'),
	('GT', 'Guatemala'),
	('GU', 'Guam'),
	('GW', 'Guinea-Bissau'),
	('GY', 'Guyana'),
	('HN', 'Honduras'),
	('HR', 'Croatia'),
	('HT', 'Haiti'),
	('HU', 'Hungary'),
	('ID', 'Indonesia'),
	('IE', 'Ireland'),
	('IL', 'Israel'),
	('IM', 'Isle of Man'),
	('IN', 'India'),
	('IQ', 'Iraq'),
	('IR', 'Iran, Islamic Republic of'),
	('IS', 'Iceland'),
	('IT', 'Italy'),
	('JE', 'Jersey'),
	('JM', 'Jamaica'),
	('JO', 'Jordan'),
	('JP', 'Japan'),
	('KE', 'Kenya'),
	('KG', 'Kyrgyzstan'),
	('KH', 'Cambodia'),
	('KI', 'Kiribati'),
	('KM', 'Comoros'),
	('KN', 'Saint Kitts and Nevis'),
	('KR', 'Korea, Republic of'),
	('KW', 'Kuwait'),
	('KY', 'Cayman Islands'),
	('KZ', 'Kazakhstan'),
	('LA', 'Lao People''s Democratic Republic'),
	('LB', 'Lebanon'),
	('LC', 'Saint Lucia'),
	('LI', 'Liechtenstein'),
	('LK', 'Sri Lanka'),
	('LR', 'Liberia'),
	('LS', 'Lesotho'),
	('LT', 'Lithuania'),
	('LU', 'Luxembourg'),
	('LV', 'Latvia'),
	('LY', 'Libyan Arab Jamahiriya'),
	('MA', 'Morocco'),
	('MC', 'Monaco'),
	('MD', 'Moldova, Republic of'),
	('ME', 'Montenegro'),
	('MG', 'Madagascar'),
	('MH', 'Marshall Islands'),
	('MK', 'Macedonia'),
	('ML', 'Mali'),
	('MM', 'Myanmar'),
	('MN', 'Mongolia'),
	('MP', 'Northern Mariana Islands'),
	('MR', 'Mauritania'),
	('MS', 'Montserrat'),
	('MT', 'Malta'),
	('MU', 'Mauritius'),
	('MV', 'Maldives'),
	('MW', 'Malawi'),
	('MX', 'Mexico'),
	('MY', 'Malaysia'),
	('MZ', 'Mozambique'),
	('NA', 'Namibia'),
	('NC', 'New Caledonia'),
	('NE', 'Niger'),
	('NF', 'Norfolk Island'),
	('NG', 'Nigeria'),
	('NI', 'Nicaragua'),
	('NL', 'Netherlands'),
	('NO', 'Norway'),
	('NP', 'Nepal'),
	('NR', 'Nauru'),
	('NU', 'Niue'),
	('NZ', 'New Zealand'),
	('OM', 'Oman'),
	('PA', 'Panama'),
	('PE', 'Peru'),
	('PF', 'French Polynesia'),
	('PG', 'Papua New Guinea'),
	('PH', 'Philippines'),
	('PK', 'Pakistan'),
	('PL', 'Poland'),
	('PM', 'Saint Pierre and Miquelon'),
	('PN', 'Pitcairn'),
	('PR', 'Puerto Rico'),
	('PT', 'Portugal'),
	('PW', 'Palau'),
	('PY', 'Paraguay'),
	('QA', 'Qatar'),
	('RE', 'Reunion'),
	('RO', 'Romania'),
	('RS', 'Serbia'),
	('RU', 'Russian Federation'),
	('RW', 'Rwanda'),
	('SA', 'Saudi Arabia'),
	('SB', 'Solomon Islands'),
	('SC', 'Seychelles'),
	('SD', 'Sudan'),
	('SE', 'Sweden'),
	('SG', 'Singapore'),
	('SH', 'Saint Helena'),
	('SI', 'Slovenia'),
	('SK', 'Slovakia'),
	('SL', 'Sierra Leone'),
	('SM', 'San Marino'),
	('SN', 'Senegal'),
	('SO', 'Somalia'),
	('SR', 'Suriname'),
	('SV', 'El Salvador'),
	('SY', 'Syrian Arab Republic'),
	('SZ', 'Swaziland'),
	('TC', 'Turks and Caicos Islands'),
	('TD', 'Chad'),
	('TG', 'Togo'),
	('TH', 'Thailand'),
	('TJ', 'Tajikistan'),
	('TL', 'Timor-Leste'),
	('TM', 'Turkmenistan'),
	('TN', 'Tunisia'),
	('TO', 'Tonga'),
	('TR', 'Turkey'),
	('TT', 'Trinidad and Tobago'),
	('TV', 'Tuvalu'),
	('TW', 'Taiwan'),
	('TZ', 'Tanzania, United Republic of'),
	('UA', 'Ukraine'),
	('UG', 'Uganda'),
	('US', 'United States'),
	('UY', 'Uruguay'),
	('UZ', 'Uzbekistan'),
	('VC', 'Saint Vincent and the Grenadines'),
	('VE', 'Venezuela'),
	('VN', 'Vietnam'),
	('VU', 'Vanuatu'),
	('WF', 'Wallis and Futuna'),
	('WS', 'Samoa'),
	('YE', 'Yemen'),
	('ZA', 'South Africa'),
	('ZM', 'Zambia'),
	('ZW', 'Zimbabwe');";
	$wpdb->query($query);
	}
 	 
	$formCount = $wpdb->query('SELECT * FROM '.$wpdb->prefix.'xyz_ics_role_privileges') ;
	if($formCount==0)
	{
	    $all_permissions=array('snippet_manage','snippet_usage');

	    foreach($all_permissions as $perms)
	    {
	        $wpdb->insert($wpdb->prefix."xyz_ics_role_privileges",array(
	            'role'	=>	'administrator',
	            'privilege'	=>	$perms,
	            'value'	=>	1));
	    }
	}
 	$user_ID = get_current_user_id();

	if(get_option("xyz_ihs_limit"))
	{
    	$html_entries = $wpdb->get_results( "SELECT * FROM ".$wpdb->prefix."xyz_ihs_short_code ORDER BY id ASC" );

    	if(count($html_entries)>0)
    	{
    	    foreach($html_entries as $html_res)
    	    {
    	        $snippet_title=$html_res->title;
    	        $snippet_content=$html_res->content;
    	        $snippet_shortcode=$html_res->short_code;
    	        $snippet_status=$html_res->status;
    	        $snippet_type=1;

    	        $snippet_count = $wpdb->query($wpdb->prepare( 'SELECT * FROM '.$wpdb->prefix.'xyz_ics_short_code WHERE title=%s' ,$snippet_title)) ;
    	        if($snippet_count == 0)
    	        {
    	            $xyz_shortCode = '[xyz-ics snippet="'.$snippet_title.'"]';
    	            $wpdb->insert($wpdb->prefix.'xyz_ics_short_code', array('title' =>$snippet_title,'content'=>$snippet_content,'short_code'=>$snippet_shortcode,'status'=>$snippet_status,'snippet_type'=>$snippet_type,'user'=>$user_ID,'targetting_countries'=>'1'),array('%s','%s','%s','%d','%d','%d','%s'));
    	        }
    	    }
    	}
	}

	if(get_option("xyz_ips_limit"))
	{
    	$php_entries = $wpdb->get_results( "SELECT * FROM ".$wpdb->prefix."xyz_ips_short_code ORDER BY id ASC" );

    	if(count($php_entries)>0)
    	{
    	    foreach($php_entries as $php_res)
    	    {
    	        $snippet_title=$php_res->title;
    	        $snippet_content=$php_res->content;
    	        $snippet_shortcode=$php_res->short_code;
    	        $snippet_status=$php_res->status;
    	        $snippet_type=2;

    	        $snippet_count = $wpdb->query($wpdb->prepare( 'SELECT * FROM '.$wpdb->prefix.'xyz_ics_short_code WHERE title=%s' ,$snippet_title)) ;
    	        if($snippet_count == 0)
    	        {
    	            
/*    	            $snippet_content_start='<?php';
    	            $new_line="\r\n";
    	            $snippet_content_end='?>';

    	            if (stripos($snippet_content, '<?php') !== false)
    	                $tag_start_position=stripos($snippet_content,'<?php');
    	            else
    	                $tag_start_position="-1";

    	            if (stripos($snippet_content, '?>') !== false)
    	                $tag_end_position=stripos($snippet_content,'?>');
    	            else
    	                $tag_end_position="-1";

    	            if(stripos($snippet_content, '<?php') === false && stripos($snippet_content, '?>') === false)
    	            {
    	                $snippet_content=$snippet_content_start.$new_line.$snippet_content;
    	            }
    	            else if(stripos($snippet_content, '<?php') !== false)
    	            {
    	                if($tag_start_position>=0 && $tag_end_position>=0 && $tag_start_position>$tag_end_position)
    	                {
    	                    $snippet_content=$snippet_content_start.$new_line.$snippet_content;
    	                }
    	            }
    	            else if(stripos($snippet_content, '<?php') === false)
    	            {
    	                if (stripos($snippet_content, '?>') !== false)
    	                {
    	                    $snippet_content=$snippet_content_start.$new_line.$snippet_content;
    	                }
    	            }
*/
    	            $xyz_shortCode = '[xyz-ics snippet="'.$snippet_title.'"]';
    	            $wpdb->insert($wpdb->prefix.'xyz_ics_short_code', array('title' =>$snippet_title,'content'=>$snippet_content,'short_code'=>$snippet_shortcode,'status'=>$snippet_status,'snippet_type'=>$snippet_type,'user'=>$user_ID,'targetting_countries'=>'1'),array('%s','%s','%s','%d','%d','%d','%s'));
    	        }
    	    }
    	}
	}
 	add_option("xyz_ics_allow_snippet_manage_own_only",0);
	add_option("xyz_ics_allow_snippet_usage_own_only",0);
	add_option("xyz_ics_single_snippet_usage_setting_permission",0);
	add_option('xyz_ics_rm_master_pwd',"");
	add_option('xyz_ics_def_custom_params',"");
 	$upload_dir = wp_upload_dir();
 	$upload_dir_path= $upload_dir['basedir']; // uploads folder
	
 	if(!is_dir($upload_dir_path)) {
 		mkdir($upload_dir_path,0777);
	}
	if(!is_dir($upload_dir_path."/xyz_ics")) {
		mkdir($upload_dir_path."/xyz_ics",0777);
	}
	if(!is_dir($upload_dir_path."/xyz_ics/export")) {
		mkdir($upload_dir_path."/xyz_ics/export",0777);
	}
	if(!is_dir($upload_dir_path."/xyz_ics/import")) {
		mkdir($upload_dir_path."/xyz_ics/import",0777);
	}
	
	if(!is_dir($upload_dir_path."/xyz_ics/import/log")) {
		mkdir($upload_dir_path."/xyz_ics/import/log",0777);
	}

	$currentversion=xyz_wp_ics_plugin_premium_get_version();
	update_option('xyz_ics_premium_version', $currentversion);

}

register_activation_hook( XYZ_INSERT_CODE_PLUGIN_FILE ,'xyz_ics_network_install');
?>
