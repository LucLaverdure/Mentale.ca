<?php 
if ( ! defined( 'ABSPATH' ) ) 
	exit;

global $wpdb;
$_GET = stripslashes_deep($_GET);

$xyz_ics_message = '';

if($_POST)
{
	if (! isset( $_REQUEST['_wpnonce'] )|| ! wp_verify_nonce( $_REQUEST['_wpnonce'], 'snipp-manage_' ))
	{
		wp_nonce_ays( 'snipp-manage_' );
		exit();
	}
if (isset($_POST['apply_ics_bulk_actions'])){
	if (isset($_POST['ics_bulk_actions_snippet'])){
		$ics_bulk_actions_snippet=$_POST['ics_bulk_actions_snippet'];
	if (isset($_POST['xyz_ics_snippet_ids']))
		$xyz_ics_snippet_ids = $_POST['xyz_ics_snippet_ids'];
		//$xyz_ics_pageno = intval($_GET['pagenum']);
		$xyz_ics_pageno = isset( $_GET['pagenum'] ) ? absint( $_GET['pagenum'] ) : 1;
		
		$xyz_ics_type = intval($_POST['type']);
		if (empty($xyz_ics_snippet_ids))
		{
		 header("Location:".admin_url('admin.php?page=xyz-wp-insert-code-snippet-manage&xyz_ics_msg=8&type='.$xyz_ics_type.'&pagenum='.$xyz_ics_pageno));
		 exit();
		}
		if ($ics_bulk_actions_snippet==2)//bulk-delete
		{
					foreach ($xyz_ics_snippet_ids as $snippet_id)
					{
						$snippet_type=xyz_ics_get_snippet_type($snippet_id);
						$wpdb->query($wpdb->prepare( 'DELETE FROM  '.$wpdb->prefix.'xyz_ics_short_code  WHERE id=%d',$snippet_id)) ;
						apply_filters('xyz_ics_after_snippet_delete', array('snippet_id'=>$snippet_id,'snippet_type'=>$snippet_type));
					}
					header("Location:".admin_url('admin.php?page=xyz-wp-insert-code-snippet-manage&xyz_ics_msg=3&type='.$xyz_ics_type.'&pagenum='.$xyz_ics_pageno));
					exit();
		}
		elseif ($ics_bulk_actions_snippet==0)//bulk-Deactivate
		{
			foreach ($xyz_ics_snippet_ids as $xyz_ics_snippetId)
				$wpdb->update($wpdb->prefix.'xyz_ics_short_code', array('status'=>2), array('id'=>$xyz_ics_snippetId));
			header("Location:".admin_url('admin.php?page=xyz-wp-insert-code-snippet-manage&xyz_ics_msg=4&type='.$xyz_ics_type.'&pagenum='.$xyz_ics_pageno));
			exit();
		}
		elseif ($ics_bulk_actions_snippet==1)//bulk-activate
		{
			foreach ($xyz_ics_snippet_ids as $xyz_ics_snippetId)
				$wpdb->update($wpdb->prefix.'xyz_ics_short_code', array('status'=>1), array('id'=>$xyz_ics_snippetId));
			header("Location:".admin_url('admin.php?page=xyz-wp-insert-code-snippet-manage&xyz_ics_msg=4&type='.$xyz_ics_type.'&pagenum='.$xyz_ics_pageno));
			exit();
		}
		elseif ($ics_bulk_actions_snippet==-1)//no action selected
		{
			header("Location:".admin_url('admin.php?page=xyz-wp-insert-code-snippet-manage&xyz_ics_msg=7&type='.$xyz_ics_type.'&pagenum='.$xyz_ics_pageno));
			exit();
		}
	}

}
	$type=$_POST["type"];
	
	$xyz_ics_message = '';
	$pagenum=1;
	
	header("Location:".admin_url('admin.php?page=xyz-wp-insert-code-snippet-manage&type='.$type));
	exit();
}
else
{
	$type=0;
	
	if(isset($_GET['type']) && $_GET['type']!="")
		$type=$_GET['type'];
	
	if(isset($_GET['xyz_ics_msg']))
	{
		$xyz_ics_message = $_GET['xyz_ics_msg'];
	}
}

$str="";
$snippet_id_str='';

if($type>0)
{
	$str=" AND snippet_type=$type";
}

if($xyz_ics_message == 1)
{
?>
	<div class="system_notice_area_style1" id="system_notice_area">
		Snippet successfully added.&nbsp;&nbsp;&nbsp;
		<span id="system_notice_area_dismiss">Dismiss</span>
	</div>
<?php
}
if($xyz_ics_message == 2)
{
?>
	<div class="system_notice_area_style0" id="system_notice_area">
		Snippet not found.&nbsp;&nbsp;&nbsp;
		<span id="system_notice_area_dismiss">Dismiss</span>
	</div>
<?php
}
if($xyz_ics_message == 3)
{
?>
	<div class="system_notice_area_style1" id="system_notice_area">
		Snippet successfully deleted.&nbsp;&nbsp;&nbsp;
		<span id="system_notice_area_dismiss">Dismiss</span>
	</div>
<?php
}
if($xyz_ics_message == 4)
{
?>
	<div class="system_notice_area_style1" id="system_notice_area">
		Snippet status successfully changed.&nbsp;&nbsp;&nbsp;
		<span id="system_notice_area_dismiss">Dismiss</span>
	</div>
<?php
}
if($xyz_ics_message == 5)
{
?>
	<div class="system_notice_area_style1" id="system_notice_area">
		Snippet successfully updated.&nbsp;&nbsp;&nbsp;
		<span id="system_notice_area_dismiss">Dismiss</span>
	</div>
<?php
}
if($xyz_ics_message == 6)
{
?>
	<div class="system_notice_area_style1" id="system_notice_area">
		Snippet successfully copied.&nbsp;&nbsp;&nbsp;
		<span id="system_notice_area_dismiss">Dismiss</span>
	</div>
<?php }
if($xyz_ics_message == 7)
{
?>
	<div class="system_notice_area_style0" id="system_notice_area">
		Please select an action to apply.&nbsp;&nbsp;&nbsp;
		<span id="system_notice_area_dismiss">Dismiss</span>
	</div>
<?php }
if($xyz_ics_message == 8)
{
	?>
	<div class="system_notice_area_style0" id="system_notice_area">
		Please select at least one snippet to perform this action.&nbsp;&nbsp;&nbsp;
		<span id="system_notice_area_dismiss">Dismiss</span>
	</div>
<?php
}

?>
<script type="text/javascript">

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
</script>

<div>
	<form method="post">
		<fieldset style="width: 99%; border: 1px solid #F7F7F7; padding: 10px 0px;">
			<legend><h3>Manage Snippets</h3></legend>
			<?php 
			global $wpdb;
			$pagenum = isset( $_GET['pagenum'] ) ? absint( $_GET['pagenum'] ) : 1;
			$limit = get_option('xyz_ics_limit');			
			$offset = ( $pagenum - 1 ) * $limit;
			$field=get_option('xyz_ics_sort_field_name');
			$order=get_option('xyz_ics_sort_order');
			
			$allowed_snippet_ids=apply_filters('xyz_ics_before_snippet_fetching', array('snippet_type'=>$type,'snippet_manage'=>1));
			
			
			if($allowed_snippet_ids!="")
			{
			    $snippet_id_str=" and id in(".$allowed_snippet_ids['permitted_snippet_ids'].") ";
			}
			
			$entries = $wpdb->get_results( "SELECT * FROM ".$wpdb->prefix."xyz_ics_short_code  WHERE 1 $snippet_id_str ORDER BY  $field $order LIMIT $offset,$limit" );			
			?>
			<input id="xyz_submit_ics"
				style="cursor: pointer; margin-bottom:10px;" type="button"
				name="textFieldButton2" value="Add New Snippet"
				 onClick='document.location.href="<?php echo admin_url('admin.php?page=xyz-wp-insert-code-snippet-manage&action=snippet-add');?>"'>
			
			<table class="widefat" style="width: 99%; margin: 0 auto; border-bottom:none;margin-top:10px;border:1px solid #D8D4D4;background-color: #E2DFDF;">
				<tr>
					<td colspan="5">
						<form name="manage_snippets" action="" method="post">
							<?php wp_nonce_field('snipp-manage_');?>	
							<div class="xyz_ics_search_div">
				            	<table class="xyz_ics_search_div_table" style="width:100%;">
				                	<tr>
				                    	<td colspan="5"><span>Type</span>&nbsp;
						                	<select name="type" id="type">
						                   		<option value="0" <?php if($type==0) { echo "selected"; } ?>>All</option>
						                      	<option value="1" <?php if($type==1) { echo "selected"; } ?>>HTML</option>
						                      	<option value="2" <?php if($type==2) { echo "selected"; } ?>>PHP</option>
						                   	</select>
				                  		 	&nbsp;&nbsp;
				                   			<input type="submit" name="search" value="Go" />
				                 		</td>
				              		</tr>
				           		</table>
	          				</div>	
						</form>
					</td>
				</tr>
			</table>			
			<br>
<span style="padding-left: 6px;color:#21759B;">With Selected : </span>
 <select name="ics_bulk_actions_snippet" id="ics_bulk_actions_snippet" style="width:130px;height:29px;">
	<option value="-1">Bulk Actions</option>
	<option value="0">Deactivate</option>
	<option value="1">Activate</option>
	<option value="2">Delete</option>
</select>
<input type="submit" title="Apply" name="apply_ics_bulk_actions" value="Apply" style="color:#21759B;cursor:pointer;padding: 5px;background:linear-gradient(to top, #ECECEC, #F9F9F9) repeat scroll 0 0 #F1F1F1;border: 2px solid #DFDFDF;">
			<table class="widefat" style="width: 99%; margin: 0 auto; border-bottom:none;">
				<thead>
					<tr class="xyz_ics_alternate">
					<th scope="col" width="3%"><input type="checkbox" id="chkAllSnippets" /></th>
						<th scope="col">Tracking Name</th>
						<th scope="col">
							Snippet Short Code
							<img id="xyz_ics_support_img" src="<?php echo plugins_url('xyz-wp-insert-code-snippet/images/support.png')?>" onmouseover="xyz_ics_support_display('xyz_ics_support')" onmouseout="xyz_ics_support_hide('xyz_ics_support')">
							<div  id="xyz_ics_support" class="xyz_ics_informationdiv" style="display:none;width:380px;">
								If you are passing custom parameters from the shortcode (eg: [xyz-ics snippet="snippet" param1="val1"]) you can use such parameters in the code by enclosing the parameter in curly braces (eg: {param1}).							
							</div>
						</th>
						<th scope="col" >Type</th>
						<th scope="col" >Created By</th>
						<th scope="col" >Status</th>
						<th scope="col" colspan="5" style="text-align: center;">Action</th>
					</tr>
				</thead>
				<tbody>
					<?php 
					if( count($entries)>0 ) 
					{
						$count=1;
						$class = '';
						
						foreach( $entries as $entry ) 
						{
							$class = ( $count % 2 == 0 ) ? ' class="xyz_ics_alternate"' : '';
							$snippetId=intval($entry->id);
							?>
							<tr <?php echo $class; ?>>
							<td style="vertical-align: middle !important;padding-left: 15px;">
					<input type="checkbox" class="chk" value="<?php echo $snippetId; ?>" name="xyz_ics_snippet_ids[]" id="xyz_ics_snippet_ids" />
					</td>
								<td style="max-width:250px;"><?php echo esc_html($entry->title);?></td>
								<td style="max-width:250px;">
									<?php 
									if($entry->status == 2)
									{
										echo 'NA';
									}
									else
										echo '[xyz-ics snippet="'.esc_html($entry->title).'"]';
									?>
								</td>
								<td>
									<?php 
									if($entry->snippet_type == 1)
									{
										echo 'HTML';
									}
									else
										echo 'PHP';
									?>
								</td>
								<td>
									<?php 
									$user_info = get_userdata($entry->user);
									echo $user_info->display_name;
									?>
								</td>
								<td>
									<?php 
									if($entry->status == 2)
									{
										echo "Inactive";	
									}
									elseif ($entry->status == 1)
									{
										echo "Active";	
									}
									?>
								</td>
								<?php 
								if($entry->status == 2){
									$stat1 = admin_url('admin.php?page=xyz-wp-insert-code-snippet-manage&action=snippet-status&snippetId='.$snippetId.'&type='.$type.'&status=1&pageno='.$pagenum);
									?>
									<td style="text-align: center;">
										<a href='<?php echo wp_nonce_url($stat1,'snipp-stat_'.$snippetId); ?>'>
											<img id="xyz_ics_img" title="Activate" src="<?php echo plugins_url('xyz-wp-insert-code-snippet/images/activate.png')?>">
										</a>
									</td>
									<?php 
								}
								elseif ($entry->status == 1)
								{
									$stat2 = admin_url('admin.php?page=xyz-wp-insert-code-snippet-manage&action=snippet-status&snippetId='.$snippetId.'&type='.$type.'&status=2&pageno='.$pagenum);
									?>
									<td style="text-align: center;">
										<a href='<?php echo wp_nonce_url($stat2,'snipp-stat_'.intval($snippetId)); ?>'>
											<img id="xyz_ics_img" title="Deactivate" src="<?php echo plugins_url('xyz-wp-insert-code-snippet/images/pause.png')?>">
										</a>
									</td>		
									<?php 	
								}
							?>
							<td style="text-align: center;">
								<a href='<?php echo admin_url('admin.php?page=xyz-wp-insert-code-snippet-manage&action=snippet-edit&snippetId='.$snippetId.'&type='.$type.'&snippet_type='.$entry->snippet_type.'&pageno='.$pagenum); ?>'>
									<img id="xyz_ics_img" title="Edit Snippet" src="<?php echo plugins_url('xyz-wp-insert-code-snippet/images/edit.png')?>">
								</a>
							</td>
							<?php $delurl = admin_url('admin.php?page=xyz-wp-insert-code-snippet-manage&action=snippet-delete&snippetId='.$snippetId.'&type='.$type.'&snippet_type='.$entry->snippet_type.'&pageno='.$pagenum);?>
							<td style="text-align: center;" >
								<a href='<?php echo wp_nonce_url($delurl,'snipp-del_'.$snippetId); ?>' onclick="javascript: return confirm('Please click \'OK\' to confirm ');">
									<img id="xyz_ics_img" title="Delete Snippet" src="<?php echo plugins_url('xyz-wp-insert-code-snippet/images/delete.png')?>">
								</a>
							</td>
							<?php $dupurl = admin_url('admin.php?page=xyz-wp-insert-code-snippet-manage&action=snippet-duplicate&snippetId='.$snippetId.'&type='.$type.'&pageno='.$pagenum);?>
							<td style="text-align: center;">
								<a href='<?php echo wp_nonce_url($dupurl,'snipp-dup_'.$snippetId);?>'>
									<img id="xyz_ics_img" title="Add Duplicate" src="<?php echo plugins_url('xyz-wp-insert-code-snippet/images/duplicate.png')?>">
								</a>
							</td>
						</tr>
						<?php
						$count++;
					}
				} 
				else 
				{ 
				?>
					<tr>
						<td colspan="5" >Snippets not found</td>
					</tr>
				<?php } ?>
				</tbody>
			</table>
			<input id="xyz_submit_ics"
				style="cursor: pointer; margin-top:10px;" type="button"
				name="textFieldButton2" value="Add New Snippet"
				 onClick='document.location.href="<?php echo admin_url('admin.php?page=xyz-wp-insert-code-snippet-manage&action=snippet-add');?>"'>
			
			<?php
			$total = $wpdb->get_var( "SELECT COUNT(`id`) FROM ".$wpdb->prefix."xyz_ics_short_code WHERE 1 $snippet_id_str" );
			$num_of_pages = ceil( $total / $limit );
			$arr_params = array( 'pagenum'=>'%#%','type' => $type);
			
			$page_links = paginate_links( array(
					'base' => add_query_arg($arr_params),
				    'format' => '',
				    'prev_text' =>  '&laquo;',
				    'next_text' =>  '&raquo;',
				    'total' => $num_of_pages,
				    'current' => $pagenum
			) );

			if ( $page_links ) 
			{
				echo '<div class="tablenav" style="width:99%"><div class="tablenav-pages" style="margin: 1em 0">' . $page_links . '</div></div>';
			}
			?>
		</fieldset>
	</form>
</div>
<script type="text/javascript">
jQuery(document).ready(function(){
	jQuery("#chkAllSnippets").click(function(){
		jQuery(".chk").prop("checked",jQuery("#chkAllSnippets").prop("checked"));
    }); 
});
</script>