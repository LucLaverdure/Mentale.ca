<?php
if ( ! defined( 'ABSPATH' ) )
    exit;

$xyz_ics_page="";
$xyz_ics_msg='';

if(isset($_GET['xyz_ics_page']))
	$xyz_ics_page = $_GET['xyz_ics_page'];
if(isset($_GET['msg']))
	$xyz_ics_msg = $_GET['msg'];

if(isset($_POST['password']))
{
	$xyz_ics_rm_pwd = $_POST['xyz_ics_rm_pwd'];
	$xyz_ics_rm_pwd = base64_encode($xyz_ics_rm_pwd);
	$xyz_ics_master_pwd_o=get_option('xyz_ics_rm_master_pwd');
	 	
	if(strcmp($xyz_ics_rm_pwd, $xyz_ics_master_pwd_o)==0)
	{
	    $expire=time()+86400;
		setcookie("xyz_ics_rm_page_access_password",$xyz_ics_rm_pwd,$expire,"/");
		header("Location:".admin_url('admin.php?page='.$xyz_ics_page));
		exit();
	}
	else 
	{
		header("Location:".admin_url('admin.php?page=xyz-wp-insert-code-snippet-manage-privileges&call=enter-pwd&msg=1&xyz_ics_page='.$xyz_ics_page));
		exit();
	}
}

?>

<form method="post" >
	<table  class="widefat xyz_ics_premium_table" style="width:98%;padding-top: 10px;">
		<tr valign="top">
			<td scope="row" >Master Password for privilege management:</td>
			<td>
				<input id="xyz_ics_rm_pwd"  name="xyz_ics_rm_pwd" type="password"/>
			</td>
		</tr>
		<tr>
	    	<td></td>
	    	<td>
				<input type="submit" class="xyz_ics_submit_new" style=" margin-top: 10px;" name="password" value="Submit" />
	   		</td>
	    </tr>
	</table>
</form>
<?php if($xyz_ics_msg == 1){?>
	<div class="system_notice_area_style0" id="system_notice_area">
		Password you have entered is not correct.&nbsp;&nbsp;&nbsp;
		<span id="system_notice_area_dismiss">Dismiss</span>
	</div>
<?php }?>
