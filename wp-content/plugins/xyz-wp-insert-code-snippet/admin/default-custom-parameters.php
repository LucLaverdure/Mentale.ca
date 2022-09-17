<?php if( !defined('ABSPATH') ){ exit();} 
global $wpdb;
if(isset($_POST)&& isset($_POST['custom_param_save'])){
	if (! isset( $_REQUEST['_wpnonce'] )|| ! wp_verify_nonce( $_REQUEST['_wpnonce'], 'xyz_ics_default_custom_param_form' ))
	{
		wp_nonce_ays( 'xyz_ics_default_custom_param_form' );
		exit();
	}
	$xyz_ics_def_custom_param=$_POST['xyz_ics_def_custom_param'];
 	$xyz_ics_def_custom_param_value=$_POST['xyz_ics_def_custom_param_value'];
	$combined_def_custom_param_arr=array();
    $def_val_count=count($xyz_ics_def_custom_param_value);
	if ($def_val_count>0){
		for ($i=0;$i<$def_val_count;$i++)
		{
			if($xyz_ics_def_custom_param[$i] !='' && $xyz_ics_def_custom_param_value[$i] !='')
				$combined_def_custom_param_arr[sanitize_text_field($xyz_ics_def_custom_param[$i])]=sanitize_text_field($xyz_ics_def_custom_param_value[$i]);
			else 
				continue;
		}
	}
	if (!empty($combined_def_custom_param_arr)){
	$combined_def_custom_param=serialize($combined_def_custom_param_arr);
	update_option('xyz_ics_def_custom_params', $combined_def_custom_param);
	}
}
?>
<h2>Default values for custom parameters</h2>
If you are passing custom parameters from shortcode (eg: [xyz-ics snippet="snippet" param1="val1"]) ,
you can define the default values for the parameters here.
<form method="post">
<?php wp_nonce_field('xyz_ics_default_custom_param_form');?>
	<table style="width:99%;padding-top: 0px;" id="xyz_ics_custom_param">
	<tr><td>
	<input id= "add_def_custom_param" class="button-primary" type="button" value="Add Custom Parameter">
	</td></tr>
	<tr valign="top">
	<th scope="row" width="30%" style="font-weight:bold;padding: 6px;text-align: left;">Custom parameter</th>
	<th scope="row" width="30%" style="font-weight:bold;padding: 6px;text-align: left;">Default value</th></tr>
	
<tr valign="top" id="tr_0" style="display:none;">
<td id="start_td"><input type="text"  name="xyz_ics_def_custom_param[]" /><span class="mandatory">*</span></td>
<td id="stop_td"><input type="text" name="xyz_ics_def_custom_param_value[]"/><span class="mandatory">*</span></td>
</tr>
<?php
$xyz_ics_custom_params = get_option('xyz_ics_def_custom_params');
if ($xyz_ics_custom_params!=null){
	$xyz_ics_custom_params=unserialize($xyz_ics_custom_params);
$i=1;
 foreach( $xyz_ics_custom_params as $def_param => $def_value ) {?>
	<tr id= "tr_<?php echo $i;?>"valign="top">
	<td id="start_td_option"><input type="text" name="xyz_ics_def_custom_param[]" value="<?php echo esc_attr($def_param);?>"/><span class="mandatory">*</span></td>
	<td id="stop_td_option"><input type="text" name="xyz_ics_def_custom_param_value[]" value="<?php echo esc_attr($def_value);?>"/><span class="mandatory">*</span></td>
	<td id="delete_custom_params"><img src="<?php echo plugins_url('../images/cross.png',__FILE__);?>" onclick="delete_tr(<?php echo $i;?>)"></td>
	</tr>
	<?php $i++; }
}
?>
</table>
<input type="submit" title="Save" name="custom_param_save" class="button-primary" id="custom_param_save" value="Save" style="margin:10px;">
</form>
<script>		
jQuery(document).ready(function() {
	jQuery("#add_def_custom_param").click(function(){
	    var trExists =  jQuery('#xyz_ics_custom_param tr:last').attr('id');
	    var i = trExists.replace('tr_','');
	    i++;
	    if(!trExists){
	    	i=1;
	    }
	    var appendTr1 =jQuery("#start_td").html();
		var appendTr2 =jQuery("#stop_td").html();
		var src="<?php echo plugins_url('../images/cross.png',__FILE__);?>";
	    var appendImg ='<td><img onclick="delete_tr('+i+')" src="'+src+'"></td>';
	    jQuery('#xyz_ics_custom_param tr:last').after("<tr id="+"tr_"+i+"><td>"+appendTr1+"</td><td>"+appendTr2+appendImg+"</td></tr>");
    });
});
function delete_tr(id)
{
	jQuery('#tr_'+id).remove();
};
</script>