<?php
if ( ! defined( 'ABSPATH' ) )
	exit;

global $wpdb;

$upload_dir = wp_upload_dir();
$upload_dir_path= $upload_dir['basedir']; // uploads folder
//$plugin_dir_path = dirname(__FILE__);
$xyz_ics_message = '';
$error_file="";
$error_data="";

if(isset($_GET['xyz_ics_msg']))
{
	$xyz_ics_message = $_GET['xyz_ics_msg'];
}
if($xyz_ics_message == 1)
{	
?>
	<div class="system_notice_area_style1" id="system_notice_area">
		Successfully imported.&nbsp;&nbsp;&nbsp;
		<span id="system_notice_area_dismiss">Dismiss</span>
	</div>
<?php
}
if($xyz_ics_message == 2)
{
	if(isset($_GET['t']))
		$t=json_decode($_GET['t']);
	
		$fileName=$upload_dir_path."/xyz_ics/import/log/error_".$t.".txt";
	
	$error_data = file_get_contents($fileName);
    ?>
	<div class="system_notice_area_style0" id="system_notice_area">
		Import failed in some snippets.&nbsp;&nbsp;&nbsp;
		<span id="system_notice_area_dismiss">Dismiss</span>
	</div>
<?php
}

if($_POST)
{
	if (! isset( $_REQUEST['_wpnonce'] ) || ! wp_verify_nonce( $_REQUEST['_wpnonce'], 'snipp-import_' ))
	{
		wp_nonce_ays( 'snipp-import_' );
		exit;
	}
	else
	{
		$_POST=xyz_trim_deep($_POST);
		$_POST = stripslashes_deep($_POST);
		
		$f=0;
		$error_file="";
		
		$import_file=$_FILES["import_file"]["name"];
		$file_namesubstrcl = substr( $import_file, strrpos( $import_file, '.' )+1 );
		
		$override_same=$_POST["override_same"];
		
		if($import_file=="") 
		{
		    $f=1;
		    $error_file="Invalid file!";
	    }
	    else 
	    {
	    	if ($file_namesubstrcl == "txt")
	    	{
	    		$file=$upload_dir_path."/xyz_ics/import/".$import_file;
	    		
	    		if(move_uploaded_file($_FILES["import_file"]["tmp_name"],$file)) 
	    		{
	    			$f=0;
	    			$user_ID = get_current_user_id();
	    			
	    			$data = file_get_contents($file);
	    			$data = json_decode($data, true);
	    			//echo json_last_error_msg();
	    			if(json_last_error()>0)
	    			{
	    				$f=1;
	    				$error_data="";
	    				$error_file='Invalid data';
	    			}
	    			else
	    			{
		    			$error_in_rows='';
		    			$error_log="";
		    			
		    			if(count($data)>0)
		    			{
		    				for($k=0;$k<count($data);$k++)
		    				{
		    					$er_data='';
		    					$snippet_array=$data[$k];
		    					$snippet_type=$snippet_array['type'];
		    					//$snippet_title=$snippet_array['title'];
		    					
		    					$temp_xyz_ics_title = str_replace(' ', '', $snippet_array['title']);
		    					$temp_xyz_ics_title = str_replace('-', '', $temp_xyz_ics_title);
		    					$snippet_title = str_replace(' ', '-', $snippet_array['title']);
		    					
		    					$snippet_content=$snippet_array['content'];
		    					$snippet_shortcode = '[xyz-ics snippet="'.$snippet_title.'"]';
		    					
		    					$user_ID = get_current_user_id();
		    					
		    					if($snippet_type==1 || $snippet_type==2)
		    					{
			    					if($snippet_type!="0" && $snippet_title != "" && $snippet_content != "")
			    					{
			    						if(ctype_alnum($temp_xyz_ics_title))
			    						{
			    							$snippet_count = $wpdb->query($wpdb->prepare( 'SELECT * FROM '.$wpdb->prefix.'xyz_ics_short_code WHERE title=%s' ,$snippet_title)) ;
			    							if($snippet_count == 0)
			    							{
			    								$xyz_shortCode = '[xyz-ics snippet="'.$snippet_title.'"]';
			    								$wpdb->insert($wpdb->prefix.'xyz_ics_short_code', array('title' =>$snippet_title,'content'=>$snippet_content,'short_code'=>$snippet_shortcode,'status'=>'1','snippet_type'=>$snippet_type,'user'=>$user_ID),array('%s','%s','%s','%d','%d','%d'));
			    							}
			    							else
			    							{
			    							    if($override_same==1)
			    							    {
			    							        $wpdb->update($wpdb->prefix.'xyz_ics_short_code', array('content'=>$snippet_content,'short_code'=>$snippet_shortcode,'snippet_type'=>$snippet_type,'status'=>'1','user'=>$user_ID), array('title'=>$snippet_title));
			    							        
			    							    }
			    							    else 
			    							    {
			    								    $er_data.="Snippet '".$snippet_title."' already exists";
			    							    }
			    							}
			    						}
			    						else
			    						{
			    							$er_data.="Snippet title can have only alphabets,numbers or hyphen";
			    						}
			    					}
			    					else
			    					{
			    						if($snippet_type==0)
			    							$er_data.="Invalid type for snippet '".$snippet_title."'";
			    						if($snippet_title=="")
			    							$er_data.="Snippet title missing";
			    						if($snippet_content=="")
			    							$er_data.="Content missing for snippet '".$snippet_title."'";
			    					}
		    					}
		    					else
		    					{
		    						$er_data.="Invalid type for snippet '".$snippet_title."'";
		    					}
		    					if($er_data!='')
		    					{
		    						$row=$k+1;
		    						$error_log.="<p><span class='xyz_ics_errlog_msg'><b>Snippet No-".$row." : </b></span> ".$er_data."</p>";
		    						$error_in_rows.="No:".$row.',';
		    					}
		    				}
		    				
		    				if($er_data!='')
		    				{
 		    					$time=time();
		    					$fileName=$upload_dir_path."/xyz_ics/import/log/error_".$time.".txt";
		    				
		    					$fh = fopen($fileName, 'w'); // we create the file, notice the 'w'. This is to be able to write to the file once.
		    					$error_log.="\n";
		    					fwrite($fh, $error_log);
		    					fclose($fh);
		    					$error_in_rows=trim($error_in_rows,",");
		    					
		    					header("Location:".admin_url('admin.php?page=xyz-wp-insert-code-snippet-import&xyz_ics_msg=2&t='.json_encode($time)));
		    					exit();
		    				}
		    			}
	    			}
	    		}
	    		else 
	    		{
	    			$f=1;
	    			$error_data="";
	    			$error_file='Upload failed';
	    		}
	    	}
	    	else 
	    	{
	    		$f=1;
	    		$error_data="";
	    		$error_file='Invalid file type '.$file_namesubstrcl;
	    	}
	    }
	    
	    if($f==0) 
	    {
	    	header("Location:".admin_url('admin.php?page=xyz-wp-insert-code-snippet-import&xyz_ics_msg=1'));
	    	exit();
	    }
	}	
}

?>

<script type="text/javascript">

jQuery(document).ready(function() {

	/*jQuery("#submit").click(function() {

		var xyz_ics_type=jQuery("#xyz_ics_type").val();

		if(xyz_ics_type==0)
		{
			alert("Please select snippet type");
			return false;
		}
	});*/
});
</script>

<div>
	<form method="post" enctype="multipart/form-data">
		<?php wp_nonce_field('snipp-import_');?>
		<div style="float: left;width: 98%">
			<fieldset style=" width:100%; border:1px solid #F7F7F7; padding:10px 0px 15px 10px;">
				<legend ><h3>Import Snippets</h3></legend>
				<p>You can import snippets exported from another wordpress from this page.</p>
				<table class="widefat"  style="width:99%;">
					<tr valign="top">
						<td style="border-bottom: none;width:20%;">
							&nbsp;&nbsp;&nbsp;File to Import&nbsp;
							<font color="red">
								*
							</font>
						</td>
						<td style="border-bottom: none;width:1px;">
							&nbsp;:&nbsp;
						</td>
						<td>
							<input type="file" name="import_file" id="import_file"  />
							<div class="xyz_ics_msg">.txt files are supported</div>
		              	 	<p style="color:red;" id="error"><?php echo $error_file;?></p>
						</td>
					</tr>
					<tr valign="top">
						<td></td>
						<td></td>
						<td>
							<input type="checkbox" name="override_same" id="override_same" value="1">
							Overwrite snippets having same name
						</td>
					</tr>
					<tr valign="top">
						<td scope="row" class="xyz_ics_settingInput"></td>
						<td colspan="2">
							<input style="margin:10px 0 20px 30px;width:90px;" id="submit" class="button-primary xyz_ics_bottonWidth" type="submit" value="Import File" />
						</td>
					</tr>										
				</table>								
				<?php 
				if($error_data!="")
				{
				?>
					<br>
					<div class="xyz_ics_error_div">
					<div class="xyz_ics_errlog_title">Error Log</div>
						<div class="xyz_ics_error_content_div">
							<table class="widefat"  style="width:99%;">
								<tr>
									<td>
										<?php echo $error_data;?>
									</td>
								</tr>
							</table>
						</div>
					</div>
				<?php }?>
			</fieldset>
		</div>
	</form>	
</div>	