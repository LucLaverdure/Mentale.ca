<?php
if ( ! defined( 'ABSPATH' ) ) 
	exit;

$xyz_ics_updateMessage = '';
$xyz_er_msg='';

if(isset($_GET['msg']))
{
	    $xyz_ics_updateMessage = $_GET['msg'];
}
if($xyz_ics_updateMessage == 1)
{
    if(isset($_GET['error_msg']))
	   $xyz_er_msg=$_GET['error_msg'];
?>
    <div class="system_notice_area_style0" id="system_notice_area">
    	<?php echo $xyz_er_msg;?>. &nbsp;&nbsp;&nbsp;
    	<span id="system_notice_area_dismiss">Dismiss</span>
    </div>
<?php
}
else if($xyz_ics_updateMessage == 2)
{
?>
    <div class="system_notice_area_style0" id="system_notice_area">
    	Zip extraction failed. Please try manual update&nbsp;&nbsp;&nbsp;
    	<span id="system_notice_area_dismiss">Dismiss</span>
    </div>
<?php
}
else if($xyz_ics_updateMessage == 3)
{
?>
    <div class="system_notice_area_style0" id="system_notice_area">
    	Request timed out. Please try manual update&nbsp;&nbsp;&nbsp;
    	<span id="system_notice_area_dismiss">Dismiss</span>
    </div>
<?php
}
if($xyz_ics_updateMessage == 4)
{
	$pluginFile='xyz-wp-insert-code-snippet';
	$pluginName=$pluginFile."/".$pluginFile.".php";
	$activation_mode=is_plugin_active_for_network($pluginName);
	deactivate_plugins( $pluginName );
	if($activation_mode)
		$act_plugin=activate_plugin( $pluginName, admin_url('admin.php?page=xyz-wp-insert-code-snippet-about&msg=6') , true );
	else		
		$act_plugin=activate_plugin( $pluginName);
	
	if($act_plugin!=NULL)
	{
	?>
    	<div class="system_notice_area_style0" id="system_notice_area">
        Plugin activation error. Please try manual update&nbsp;&nbsp;&nbsp;<span
        id="system_notice_area_dismiss">Dismiss</span>
        </div>
	<?php 	
	}
	else 
	{	
    ?>
        <div class="system_notice_area_style1" id="system_notice_area">
        Plugin updated successfully.&nbsp;&nbsp;&nbsp;<span
        id="system_notice_area_dismiss">Dismiss</span>
        </div>
	<?php
    }
}
else if($xyz_ics_updateMessage == 5)
{
?>
    <div class="system_notice_area_style0" id="system_notice_area">
    Could not create directory. Please try manual update&nbsp;&nbsp;&nbsp;<span
    id="system_notice_area_dismiss">Dismiss</span>
    </div>
<?php
}
else if($xyz_ics_updateMessage == 6)
{
?>
	<div class="system_notice_area_style1" id="system_notice_area">
	Plugin updated successfully.&nbsp;&nbsp;&nbsp;<span
	id="system_notice_area_dismiss">Dismiss</span>
	</div>
<?php
}
else if($xyz_ics_updateMessage == 7)
{
?>
	<div class="system_notice_area_style0" id="system_notice_area">
    License validation failed. Please verify the key configured by you.&nbsp;&nbsp;&nbsp;<span
    id="system_notice_area_dismiss">Dismiss</span>
    </div>
<?php }?>
<h1 style="visibility: visible;">XYZ WP Insert Code Snippet (V <?php echo xyz_ics_plugin_get_version(); ?>)</h1>
Integrate HTML/PHP code seamlessly to your wordpress. This plugin lets you generate a shortcode corresponding
to any random PHP code and HTML code such as javascript, ad codes, video embedding codes or any raw  HTML. The shortcodes
can be used in your pages, posts and widgets.  XYZ WP Insert Code Snippet is developed and maintained by
<a href="http://xyzscripts.com">xyzscripts</a>
.
<br />
<h2>Features</h2>
<div>
	<p></p>
	<div style="float: left;">	
		<ul>	
			<li>Convert HTML snippets to shortcodes</li>
			<li>Convert PHP Code snippets to shortcodes</li>
			<li>Support for shortcodes in widgets</li>
			<li>Dropdown menu in TinyMCE editor to pick snippets easily</li>
		</ul>
	</div>
</div>
<div style="clear: both;"></div>
