<?php
if ( ! defined( 'ABSPATH' ) )
	exit;

global $wpdb;
$_POST = stripslashes_deep($_POST);
$_POST = xyz_trim_deep($_POST);

if(isset($_POST) && isset($_POST['addSubmit'])){
	if (! isset( $_REQUEST['_wpnonce'] )|| ! wp_verify_nonce( $_REQUEST['_wpnonce'], 'snipp-add_' )){
		wp_nonce_ays( 'snipp-add_' );
		exit;
	}
	else{
		$ics_allowed_countries_json='1';
		$xyz_ics_type=abs(intval($_POST['xyz_ics_snippetType']));
		$temp_xyz_ics_title = str_replace(' ', '', $_POST['xyz_ics_snippetTitle']);
		$temp_xyz_ics_title = str_replace('-', '', $temp_xyz_ics_title);
		$xyz_ics_title = str_replace(' ', '-', $_POST['xyz_ics_snippetTitle']);
		$xyz_ics_content = $_POST['xyz_ics_snippetContent'];
		$user_ID = get_current_user_id();
		
		$xyz_ics_enabledUsers = intval($_POST['xyz_ics_enabledUsers']);
		if(isset($_POST['ics_allowed_countries']))
			$ics_allowed_countries =$_POST['ics_allowed_countries'];
  		if(!empty($ics_allowed_countries)){
		$ics_allowed_countries_json=json_encode($ics_allowed_countries);
		}
		$xyz_ics_deviceType = intval($_POST['xyz_ics_deviceType']);
  
		

		if($xyz_ics_type!="0" && $xyz_ics_title != "" && $xyz_ics_content != ""){
			if(ctype_alnum($temp_xyz_ics_title)){
				$snippet_count = $wpdb->query($wpdb->prepare( 'SELECT * FROM '.$wpdb->prefix.'xyz_ics_short_code WHERE title=%s' ,$xyz_ics_title)) ;
				if($snippet_count == 0){
				    if($xyz_ics_type==2){
				    	if(get_option('xyz_ics_auto_insert')==1){
					        $xyz_ics_content_start='<?php';
					        $new_line="\r\n";
					        $xyz_ics_content_end='?>';
	
					        if (stripos($xyz_ics_content, '<?php') !== false)
					            $tag_start_position=stripos($xyz_ics_content,'<?php');
					        else
					            $tag_start_position="-1";
	
					        if (stripos($xyz_ics_content, '?>') !== false)
					            $tag_end_position=stripos($xyz_ics_content,'?>');
					        else
					            $tag_end_position="-1";
	
					
					        if(stripos($xyz_ics_content, '<?php') === false && stripos($xyz_ics_content, '?>') === false){
					            $xyz_ics_content=$xyz_ics_content_start.$new_line.$xyz_ics_content;
					        }
					        else if(stripos($xyz_ics_content, '<?php') !== false){
					            if($tag_start_position>=0 && $tag_end_position>=0 && $tag_start_position>$tag_end_position){
					                $xyz_ics_content=$xyz_ics_content_start.$new_line.$xyz_ics_content;
					            }
					        }
					        else if(stripos($xyz_ics_content, '<?php') === false){
					            if (stripos($xyz_ics_content, '?>') !== false){
					                $xyz_ics_content=$xyz_ics_content_start.$new_line.$xyz_ics_content;
					            }
					        }
					    }
					}

					$xyz_shortCode = '[xyz-ics snippet="'.$xyz_ics_title.'"]';
					$wpdb->insert($wpdb->prefix.'xyz_ics_short_code', array('title' =>$xyz_ics_title,'content'=>$xyz_ics_content,'short_code'=>$xyz_shortCode,'status'=>'1','snippet_type'=>$xyz_ics_type,'user'=>$user_ID,'enabled_users'=>$xyz_ics_enabledUsers,'targetting_countries'=>$ics_allowed_countries_json,'targetting_devices'=>$xyz_ics_deviceType),array('%s','%s','%s','%d','%d','%d','%d','%s','%d'));

					apply_filters('xyz_ics_after_snippet_create',array($wpdb->insert_id,$xyz_ics_type));

					header("Location:".admin_url('admin.php?page=xyz-wp-insert-code-snippet-manage&xyz_ics_msg=1'));
					exit();
				}
				else
				{
				?>
					<div class="system_notice_area_style0" id="system_notice_area">
						Snippet already exists. &nbsp;&nbsp;&nbsp;
						<span id="system_notice_area_dismiss">Dismiss</span>
					</div>
				<?php
				}
			}
			else
			{
				?>
				<div class="system_notice_area_style0" id="system_notice_area">
					Snippet title can have only alphabets,numbers or hyphen. &nbsp;&nbsp;&nbsp;
					<span id="system_notice_area_dismiss">Dismiss</span>
				</div>
				<?php
			}
		}
		else
		{
		?>
			<div class="system_notice_area_style0" id="system_notice_area">
				Fill all mandatory fields. &nbsp;&nbsp;&nbsp;
				<span id="system_notice_area_dismiss">Dismiss</span>
			</div>
		<?php
		}
	}
}
?>
  
<script type="text/javascript">

var editor;

jQuery(document).ready(function() {
	 
	editor = CodeMirror.fromTextArea(document.getElementById("xyz_ics_snippetContent"), {
	    lineNumbers: true,
	    matchBrackets: true,
	    mode: "application/x-httpd-php",
	    indentUnit: 4,
	    indentWithTabs: true
	  });

	changeSnippetType();
	var demo1 = jQuery('select[name="ics_allowed_countries[]"]').bootstrapDualListbox({infoTextFiltered: '<span class="label label-purple label-lg">Filtered</span>'});
	var container1 = demo1.bootstrapDualListbox('getContainer');
 	container1.find('.btn').addClass('btn-white btn-info btn-bold');

 	container1.find('.fa-arrow-right').append('>');
 	container1.find('.fa-arrow-left').append('<');
 	container1.find('.fa-arrow-right').removeClass('fa-arrow-right');
 	container1.find('.fa-arrow-left').removeClass('fa-arrow-left');

 	
});

if(typeof changeSnippetType == 'undefined')
{
	function changeSnippetType()
	{
		var snippetType=jQuery("#xyz_ics_snippetType").val();

		/*jQuery("#xyz_ics_snippetContent").val("");
		editor.setValue("");
		editor.clearHistory();*/

		if(snippetType==1)
		{
			jQuery("#php_code_label").hide();
			jQuery("#xyz_ics_support_img").hide();
			jQuery("#html_code_label").show();
		}
		else if(snippetType==2)
		{
			jQuery("#html_code_label").hide();
			jQuery("#php_code_label").show();
			jQuery("#xyz_ics_support_img").show();

			/*var ptag_start='<'+'?php';
			var ptag_newline="\r\n";
			var ptag_end='?>';
			var pdata=ptag_start+ptag_newline+ptag_newline+ptag_end;

			jQuery("#xyz_ics_snippetContent").val(pdata);
			editor.setValue(pdata);*/
		}
		else
		{
			jQuery("#html_code_label").hide();
			jQuery("#php_code_label").hide();
			jQuery("#xyz_ics_support_img").hide();
		}
	}
}

if(typeof xyz_ics_support_display == 'undefined')
{
    function xyz_ics_support_display(id)
    {
      document.getElementById(id).style.display='';
    }
}

if(typeof xyz_ics_support_hide == 'undefined')
{
    function xyz_ics_support_hide(id)
    {
	  document.getElementById(id).style.display='none';
    }
}

if(typeof xyz_ics_geographic_target_display == 'undefined')
{
    function xyz_ics_geographic_target_display(id)
    {
      document.getElementById(id).style.display='';
    }
}

if(typeof xyz_ics_geographic_target_hide == 'undefined')
{
    function xyz_ics_geographic_target_hide(id)
    {
	  document.getElementById(id).style.display='none';
    }
}

</script>

<style>
    .CodeMirror {border-top: 1px solid #cfcfcf; border-bottom: 1px solid #cfcfcf;width:650px;}
</style>

<div>
	<fieldset style="width: 99%; border: 1px solid #F7F7F7; padding: 10px 0px;">
		<legend><b>Add Snippet</b></legend>
		<form name="frmmainForm" id="frmmainForm" method="post">
			<?php
			wp_nonce_field('snipp-add_');
			?>
			<div>
				<table style="width: 99%; background-color: #F9F9F9; border: 1px solid #E4E4E4; border-width: 1px;margin: 0 auto">
					<tr><td><br/><div id="shortCode"></div><br/></td></tr>
					<tr valign="top">
						<td style="border-bottom: none;width:20%;">
							&nbsp;&nbsp;&nbsp;Type&nbsp;
							<font color="red">
								*
							</font>
						</td>
						<td style="border-bottom: none;width:1px;">
							&nbsp;:&nbsp;
						</td>
						<td>
							<select name="xyz_ics_snippetType" id="xyz_ics_snippetType" onchange="changeSnippetType();">
								<option value="1" <?php if(isset($_POST['xyz_ics_snippetType']) && $_POST['xyz_ics_snippetType']==1){echo "selected";}?>>HTML</option>
								<option value="2" <?php if(isset($_POST['xyz_ics_snippetType']) && $_POST['xyz_ics_snippetType']==2){echo "selected";}?>>PHP</option>
							</select>
						</td>
					</tr>
					<tr><td colspan="3" style="height:10px;"></td></tr>
					<tr valign="top">
						<td style="border-bottom: none;width:20%;">
							&nbsp;&nbsp;&nbsp;Tracking Name&nbsp;
							<font color="red">
								*
							</font>
						</td>
						<td style="border-bottom: none;width:1px;">
							&nbsp;:&nbsp;
						</td>
						<td>
							<input style="width:80%;" type="text" name="xyz_ics_snippetTitle" id="xyz_ics_snippetTitle" value="<?php if(isset($_POST['xyz_ics_snippetTitle'])){ echo esc_attr($_POST['xyz_ics_snippetTitle']);}?>">
						</td>
					</tr>
					<tr><td colspan="3" style="height:25px;"></td></tr>
					<tr>
						<td style="border-bottom: none;width:20%;">
							&nbsp;&nbsp;&nbsp;
							<span id="html_code_label">HTML Code </span>
							<span id="php_code_label"><?php if(get_option('xyz_ics_auto_insert')==1){ echo "PHP Code";}else echo "PHP Code (without &lt;?php ?&gt;)";?></span>
							<!-- <span id="php_code_label">PHP Code (without &lt;?php ?&gt;)</span> -->
							
							<font color="red">
								*
							</font>

							<img id="xyz_ics_support_img" src="<?php echo plugins_url('xyz-wp-insert-code-snippet/images/support.png')?>" onmouseover="xyz_ics_support_display('xyz_ics_support')" onmouseout="xyz_ics_support_hide('xyz_ics_support')">
							<div  id="xyz_ics_support" class="xyz_ics_informationdiv" style="display:none;">
								For php code only,php opening and closing are not mandatory.
								<br>For combined html and php,use php opening and closing as required.
							</div>
						</td>
						<td style="border-bottom: none;width:1px;">
							&nbsp;:&nbsp;
						</td>
						<td>
							<textarea class="xyz_ics_code" name="xyz_ics_snippetContent" id="xyz_ics_snippetContent"><?php if(isset($_POST['xyz_ics_snippetContent'])){ echo esc_textarea($_POST['xyz_ics_snippetContent']);}?></textarea>
							<p class="xyz_ics_note">Note : If you are passing custom parameters from the shortcode (eg: [xyz-ics snippet="snippet" param1="val1"]) you can use such parameters in the code by enclosing the parameter in curly braces (eg: {param1}).</p>
						</td>
					</tr>
					<?php apply_filters('xyz_ics_add_snippet_fields',array());?>
					<tr><td colspan="3" style="height:20px;"></td></tr>
					<tr valign="top">
						<td style="border-bottom: none;width:20%;">
							&nbsp;&nbsp;&nbsp;User Targeting&nbsp;
							<font color="red">
								*
							</font>
						</td>
						<td style="border-bottom: none;width:1px;">
							&nbsp;:&nbsp;
						</td>
						<td>
							<select name="xyz_ics_enabledUsers" id="xyz_ics_enabledUsers">
								<option value="1" <?php if(isset($_POST['xyz_ics_enabledUsers']) && $_POST['xyz_ics_enabledUsers']==1){echo "selected";}?>>Logged-In Users</option>
								<option value="2" <?php if(isset($_POST['xyz_ics_enabledUsers']) && $_POST['xyz_ics_enabledUsers']==2){echo "selected";}?>>Logged-Out Users</option>
							    <option value="3" <?php if(isset($_POST['xyz_ics_enabledUsers']) && $_POST['xyz_ics_enabledUsers']==3){echo "selected";} else { echo "selected"; }?>>All Users</option>
								
							</select>
						</td>
					</tr>
					<tr><td colspan="3" style="height:10px;"></td></tr>
					<tr valign="top">
						<td style="border-bottom: none;width:20%;">
							&nbsp;&nbsp;&nbsp;Geographic Targeting&nbsp;
							 
							<img id="xyz_ics_geographictarget_img" src="<?php echo plugins_url('xyz-wp-insert-code-snippet/images/support.png')?>" onmouseover="xyz_ics_geographic_target_display('xyz_ics_geographic_target')" onmouseout="xyz_ics_geographic_target_hide('xyz_ics_geographic_target')">
							<div  id="xyz_ics_geographic_target" class="xyz_ics_informationdiv" style="display:none;">
 								If no countries selected, world wide targeting will be applied.
 							</div>
						</td>
						<td style="border-bottom: none;width:1px;">
							&nbsp;:&nbsp;
						</td>
						<td>
						<div class="col-sm-12">
						<label class="col-sm-2 control-label no-padding-top" for="duallist"></label>
						<div class="col-sm-8">
						<select multiple="multiple" size="10" name="ics_allowed_countries[]" id="duallist">
						<?php 
 						$countries = $wpdb->get_results('SELECT * FROM '.$wpdb->prefix.'xyz_ics_countries');
						$cunt=0;
						foreach($countries as $country)
						{
							$selected="";
							if(isset($_POST['ics_allowed_countries']))
							{
								if(in_array($country->code,$_POST['ics_allowed_countries']))
								$selected="selected";
								else
								$selected="";
							}
						?>
						<option value="<?php echo $country->code;?>" <?php echo $selected;?> ><?php echo $country->name;?></option>
							<?php 
							}
						
						?>
						</select>
						<div class="hr hr-16 hr-dotted"></div>
						</div>
						</div>
 						</td>
					</tr>
					<tr><td colspan="3" style="height:10px;"></td></tr>
					<tr valign="top">
						<td style="border-bottom: none;width:20%;">
							&nbsp;&nbsp;&nbsp;Device Targeting&nbsp;
							<font color="red">
								*
							</font>
						</td>
						<td style="border-bottom: none;width:1px;">
							&nbsp;:&nbsp;
						</td>
						<td>
							<select name="xyz_ics_deviceType" id="xyz_ics_deviceType" >
							 <option value="1" <?php if(isset($_POST['xyz_ics_deviceType']) && $_POST['xyz_ics_deviceType']==1){echo "selected";}?>>Tab and Mobile</option>
							 <option value="2" <?php if(isset($_POST['xyz_ics_deviceType']) && $_POST['xyz_ics_deviceType']==2){echo "selected";}?>>Laptop and Desktop</option>
							 <option value="3" <?php if(isset($_POST['xyz_ics_deviceType']) && $_POST['xyz_ics_deviceType']==3){echo "selected";} else { echo "selected"; } ?>>All Devices</option>
							 </select>
						</td>
					</tr>
					<tr><td colspan="3" style="height:10px;"></td></tr>
					<tr>
						<td></td>
						<td></td>
						<td>
							<input class="button-primary" style="cursor:pointer;" type="submit" name="addSubmit" value="Create">
						</td>
					</tr>
					<tr><td><br/></td></tr>
				</table>
			</div>
		</form>
	</fieldset>
</div>
