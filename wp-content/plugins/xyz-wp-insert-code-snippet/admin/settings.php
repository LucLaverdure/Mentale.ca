<?php
if ( ! defined( 'ABSPATH' ) )
	 exit;

global $wpdb;
// Load the options

if(isset($_GET['ics_notice'])&& $_GET['ics_notice'] == 'hide')
{
	update_option('xyz_ics_dnt_shw_notice', "hide");
	?>
	<style type='text/css'>
		#ics_notice_td {display:none;}
	</style>
	<div class="system_notice_area_style1" id="system_notice_area">
		Thanks again for using the plugin. We will never show the message again.
 		&nbsp;&nbsp;&nbsp;
 		<span id="system_notice_area_dismiss">Dismiss</span>
	</div>
<?php
}

if($_POST)
{
	if (! isset( $_REQUEST['_wpnonce'] ) || ! wp_verify_nonce( $_REQUEST['_wpnonce'], 'snipp-setting_' )) 
	{
		wp_nonce_ays( 'snipp-setting_' );
		exit;
	}
	else 
	{
		$_POST=xyz_trim_deep($_POST);
		$_POST = stripslashes_deep($_POST);
		
		$xyz_ics_limit = abs(intval($_POST['xyz_ics_limit']));
		
		if($xyz_ics_limit==0)
			$xyz_ics_limit=20;
		
		$xyz_ics_credit = $_POST['xyz_ics_credit'];
		
		if($xyz_ics_credit=="ics" || $xyz_ics_credit==0)
		{
			update_option('xyz_credit_link',$xyz_ics_credit);
		}
		 	
		$xyz_ics_sortfield=$_POST['xyz_ics_sort_by_field'];
		
		$xyz_ics_auto_insert = intval($_POST['xyz_ics_auto_insert']);
        	update_option('xyz_ics_auto_insert',$xyz_ics_auto_insert);

		if(($xyz_ics_sortfield=="title")||($xyz_ics_sortfield=="id"))
		{
			update_option('xyz_ics_sort_field_name',$xyz_ics_sortfield);
		}
			
		$xyz_ics_sortorder=$_POST['xyz_ics_sort_by_order'];
		
		if(($xyz_ics_sortorder=="asc")||($xyz_ics_sortorder=="desc"))
		{
			update_option('xyz_ics_sort_order',$xyz_ics_sortorder);
		}

		update_option('xyz_ics_limit',$xyz_ics_limit);						
		?>
		<div class="system_notice_area_style1" id="system_notice_area">
			Settings updated successfully. &nbsp;&nbsp;&nbsp;
			<span id="system_notice_area_dismiss">Dismiss</span>
		</div>
	<?php
	}
}

if(isset($_GET['geomsg']) && $_GET['geomsg']== 1)
{
?>
	<div class="system_notice_area_style1" id="system_notice_area">
		Geo Updated Successfully.&nbsp;&nbsp;&nbsp;
		<span id="system_notice_area_dismiss">Dismiss</span>
	</div>
<?php
}
if(isset($_GET['geomsg']) && $_GET['geomsg']== 2)
{
?>
	<div class="system_notice_area_style0" id="system_notice_area">
		Geo Updation Failed.&nbsp;&nbsp;&nbsp;
		<span id="system_notice_area_dismiss">Dismiss</span>
	</div>
<?php
}
?>
<div>
	<form method="post">
		<?php wp_nonce_field('snipp-setting_');?>
		<div style="float: left;width: 98%">
			<fieldset style=" width:100%; border:1px solid #F7F7F7; padding:10px 0px 15px 10px;">
				<legend ><h3>Settings</h3></legend>
				<table class="widefat"  style="width:99%;">
					<tr valign="top">
						<td scope="row" >
							<label for="xyz_ics_sort">Sorting of snippets</label>
						</td>
						<td>
							<select id="xyz_ics_sort_by_field" name="xyz_ics_sort_by_field">
								<option value="id" <?php if(isset($_POST['xyz_ics_sort_by_field']) && $_POST['xyz_ics_sort_by_field']=='id'){echo 'selected';} else if(get_option('xyz_ics_sort_field_name')=="id"){echo 'selected';} ?>>Based on create time</option>
								<option value="title" <?php if(isset($_POST['xyz_ics_sort_by_field']) && $_POST['xyz_ics_sort_by_field']=='title'){ echo 'selected';}elseif(get_option('xyz_ics_sort_field_name')=="title"){echo 'selected';} ?>>Based on name</option>
							</select>
							&nbsp;
							<select id="xyz_ics_sort_by_order" name="xyz_ics_sort_by_order"  >
								<option value="asc" <?php if(isset($_POST['xyz_ics_sort_by_order']) && $_POST['xyz_ics_sort_by_order']=='asc'){ echo 'selected';}elseif(get_option('xyz_ics_sort_order')=="asc"){echo 'selected';} ?>>Ascending</option>
								<option value="desc" <?php if(isset($_POST['xyz_ics_sort_by_order']) && $_POST['xyz_ics_sort_by_order']=='desc'){echo 'selected';} elseif(get_option('xyz_ics_sort_order')=="desc"){echo 'selected';} ?>>Descending</option>
							</select>
						</td>
					</tr>
					<tr valign="top">
						<td scope="row" >
							<label for="xyz_ics_credit">Credit link to author</label>
						</td>
						<td>
							<select name="xyz_ics_credit" id="xyz_ics_credit">
								<option value="ics" <?php if(get_option('xyz_credit_link')=="ics"){echo 'selected';} ?>>Enable</option>
								<option value="0" <?php if(get_option('xyz_credit_link')=="0"){echo 'selected';} ?>>Disable</option>
							</select>
						</td>
					</tr>
					<tr valign="top">
						<td scope="row" class=" xyz_ics_settingInput" id="">
							<label for="xyz_ics_limit">Pagination limit</label>
						</td>
						<td id="">
							<input  name="xyz_ics_limit" type="text" id="xyz_ics_limit" value="<?php if(isset($_POST['xyz_ics_limit']) ){echo abs(intval($_POST['xyz_ics_limit']));}else{print(get_option('xyz_ics_limit'));} ?>" />
						</td>
					</tr>
					<tr valign="top">
			                        <td scope="row">
			                            <label for="xyz_ics_auto_insert">Autoinsert PHP opening tags</label>
			                        </td>
			                        <td>
			                            <select name="xyz_ics_auto_insert" id="xyz_ics_auto_insert">
			                                <option value="0">Disable</option>
			                                <option value="1" <?php selected(get_option('xyz_ics_auto_insert'),1);?>>Enable</option>
			                            </select>
			                	</td>
			                </tr>
					<tr valign="top">
						<td scope="row" class=" xyz_ics_settingInput"></td>
						<td>
							<input style="margin:10px 0 20px 0;" id="submit" class="button-primary xyz_ics_bottonWidth" type="submit" value=" Update Settings " />
						</td>
					</tr>
				</table>
			</fieldset>
		</div>
	</form>
	<table class="widefat"  style="width:97%;height: 55px; margin-left:10px;">
	<tr valign="top">
	<td scope="row" >
	 <?php  
	 
$mod_time=filemtime(realpath(dirname(__FILE__) . '/../').'/library/geo/GeoIP.dat');
$diff_time = time()-$mod_time;
$days = round($diff_time/86400); ?>
 
  <a href="<?php echo admin_url('admin.php?page=xyz-wp-insert-code-snippet-settings&action=get-latest-geo');?>" style="font-size: 16px;text-decoration: underline;"><?php echo "Update GeoIp";?></a> 
  &nbsp; Last Modified Date of GeoIp is &nbsp;<?php echo date('d/m/Y', $mod_time);?>. Please update GeoIp file atleast once in 6 months.
  </td>
  </tr> 
</table>
</div>