<?php
define("INEGG", true);

require_once "eggconf.php";

$stmt = $EGGconn->prepare("SELECT question_id, title, blurb, benefits_blurb, person_ref, a1, a2, a1_pts_bonus, a2_pts_bonus FROM egg_quiz ORDER BY rand() LIMIT 10;");
$stmt->execute(); 
$stmt->bind_result($qid, $title, $blurb, $benefits_blurb, $person_ref, $a1, $a2, $a1_pts_bonus, $a2_pts_bonus);
$i = 0;
?>
<form action="/eggstep-spend-points/" method="post">

<div class="row">
		<div class="col-md-8" style="width:65%;float:left;">
		
<?php
while ($stmt->fetch()) {
?>

<div class="QQ carded" <?php echo ($i>0) ? 'style="display:none;"' : "";?>>
	<span style="display:none;" class="s stamp is-approved">Success</span>
	<span style="display:none;" class="f stamp is-not-approved">Fail</span>
	<h2>Quizz - <?php echo $title; ?></h2>
	<pre><?php echo $blurb; ?></pre>
	<br><h3>The benefits:</h3>
	<pre><?php echo $benefits_blurb; ?></pre>
	<div style="float:right;">Submitted by <i><?php echo $person_ref; ?></i></div><br>
	<br><h3>Have you completed this recommendation?</h3>
	<p><label><input type="radio" name="gg1" onclick="jQuery(this).parents('.QQ').find('span').css('display', 'none');jQuery(this).parents('.QQ').find('.s').css('display', 'inline-block');" /> <?php echo $a1; ?> </label></p>
	<p><label><input type="radio" name="gg1" onclick="jQuery(this).parents('.QQ').find('span').css('display', 'none');jQuery(this).parents('.QQ').find('.f').css('display', 'inline-block');"   /> <?php echo $a2; ?> </label></p>
	<p><label><input class="n" type="button" value="Submit and continue" /> </label></p>
</div>


<?php
	$i++;
}
?>

<div class="QQ" style="display:none;">
	<div style="clear:left;width:60%;text-align:left;margin: 20px 0 40px 0;display:inline-block;">
		<p><input type="submit" value="Submit information..." /></p>
	</div>
</div>

</div>

<div class="col-md-4" style="width:33%;float:left;">
	<div class="points">
		<span>Points:</span>
		<span id="score" class="odometer digital">000</span>
	</div>
	<img src="/eggstep/egg1.gif" />
</div>

</div>

<script type="text/javascript">

	var max_score = 0;

	jQuery(".n").click(function() {
		max_score += 50;

		jQuery("#score").text(max_score);
	});
</script>
</form>