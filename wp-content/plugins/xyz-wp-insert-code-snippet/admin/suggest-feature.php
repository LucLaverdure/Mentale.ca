<?php
if( !defined('ABSPATH') ){ exit();}
global $wpdb;$xyz_wp_ics_message='';
if(isset($_GET['xyz_ics_msg']))
	$xyz_wp_ics_message = $_GET['xyz_ics_msg'];
if($xyz_wp_ics_message == 1){
	?>
	<div class="system_notice_area_style1" id="system_notice_area">
	Thank you for the suggestion.&nbsp;&nbsp;&nbsp;<span
	id="system_notice_area_dismiss">Dismiss</span>
	</div>
	<?php
	}
else if($xyz_wp_ics_message == 2){
		?>
		<div class="system_notice_area_style0" id="system_notice_area">
		wp_mail not able to process the request.&nbsp;&nbsp;&nbsp;<span
		id="system_notice_area_dismiss">Dismiss</span>
		</div>
		<?php
	}
else if($xyz_wp_ics_message == 3){
	?>
	<div class="system_notice_area_style0" id="system_notice_area">
	Please suggest a feature.&nbsp;&nbsp;&nbsp;<span
	id="system_notice_area_dismiss">Dismiss</span>
	</div>
	<?php
}
if (isset($_POST) && isset($_POST['xyz_ics_send_mail']))
{
	
	if (! isset( $_REQUEST['_wpnonce'] )|| ! wp_verify_nonce( $_REQUEST['_wpnonce'], 'xyz_wp_ics_suggest_feature_form_nonce' ))
	{
		wp_nonce_ays( 'xyz_wp_ics_suggest_feature_form_nonce' );
		exit();
	}
	if (isset($_POST['xyz_ics_suggested_feature']) && $_POST['xyz_ics_suggested_feature']!='')
	{
		
		$xyz_ics_premium_feature_content=$_POST['xyz_ics_suggested_feature'];
		$xyz_ics_premium_sender_email = get_option('admin_email');
		$entries0 = $wpdb->get_results( $wpdb->prepare( 'SELECT display_name FROM '.$wpdb->base_prefix.'users WHERE user_email=%s',array($xyz_ics_premium_sender_email)));
		foreach( $entries0 as $entry ) {
			$xyz_ics_admin_username=$entry->display_name;
		}
		$xyz_ics_premium_recv_email='support@xyzscripts.com';
		$xyz_ics_premium_mail_subject="XYZ SNIPPET PREMIUM - FEATURE SUGGESTION";
		$xyz_ics_premium_headers = array('From: '.$xyz_ics_admin_username.' <'. $xyz_ics_premium_sender_email .'>' ,'Content-Type: text/html; charset=UTF-8');
		$wp_mail_processed=wp_mail( $xyz_ics_premium_recv_email, $xyz_ics_premium_mail_subject, $xyz_ics_premium_feature_content, $xyz_ics_premium_headers );
		if ($wp_mail_processed==true){
		 header("Location:".admin_url('admin.php?page=xyz-wp-insert-code-snippet-suggest-feature&xyz_ics_msg=1'));
		 exit();
		}
		else 
		{
			header("Location:".admin_url('admin.php?page=xyz-wp-insert-code-snippet-suggest-feature&xyz_ics_msg=2'));exit();
		}
	}
	else {
		header("Location:".admin_url('admin.php?page=xyz-wp-insert-code-snippet-suggest-feature&xyz_ics_msg=3'));exit();
	}
}?>
<form method="post" >
<?php wp_nonce_field( 'xyz_wp_ics_suggest_feature_form_nonce' );?>
<h3>Contribute And Get Rewarded</h3>
<span style="color: #1A87B9;font-size:13px;padding-left: 10px;" >* Suggest a feature for XYZ SNIPPET and stand a chance to win an extra year of extended support.</span>
<table  class="widefat" style="width:98%;padding-top: 10px;">
<tr><td>
<textarea name="xyz_ics_suggested_feature" id="xyz_ics_suggested_feature" style="width:750px;height:250px !important;"></textarea>
</td></tr>
<tr>
<td><input name="xyz_ics_send_mail" class="xyz_ics_submit_new" style="color:#FFFFFF;border-radius:4px;border:1px solid #1A87B9; margin-bottom:10px;" type="submit" value="Send Mail To Us">
</td></tr>
</table>
</form>