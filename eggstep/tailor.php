<?php
define("INEGG", true);

require_once "eggconf.php";

if (!isset($_POST["step"])) {

	global $EGGconnWP;
	$tails = $EGGconnWP->get_results(
			"SELECT id, title, blurb, link FROM egg_tailor;"
	);

	$i = 0;
	?>

	<form action="/en/eggstep-tailor/" method="post">

	<input type="hidden" name="step" value="2" />

	<div class="row">
		<div class="col-md-8" style="width:65%;float:left;">
			<p>Please check all mental health categories you relate to.</p>

			<?php
			foreach ($tails as $tail) {
			?>

			<div class="QQ">
				<label><input type="checkbox" value="Y" name="opt<?php echo $i; ?>"/> <?php echo $tail->title; ?></label> - <a href="<?php echo $tail->link; ?>" target="blank">More information</a>
			</div>

			<?php
				$i++;
			}
			?>
		</div>

		<div class="col-md-4"style="width:33%;float:left;">
			<div class="points">
				<span>Points:</span>
				000
			</div>
			<img src="/eggstep/egg1.gif" />
		</div>
	</div>

	<div class="QQ">
		<div style="clear:left;width:60%;text-align:left;margin: 20px 0 40px 0;display:inline-block;">
			<p><input type="submit" value="Submit information..." /></p>
		</div>
	</div>

	</form>

<?php
} else {
?>
	<form action="/en/eggstep-quiz/" method="post">
		<h2>Choose a creature</h2>
		<?php
			for($i=1;$i<=10;++$i) {
		?>
			<div class="character" <?php if ($i > 1) { ?> style="display:none;" <?php } ?>>
				<img src="/eggstep/index.php?model=<?php echo $i; ?>" />
			</div>
		<?php
			}
		?>
		<input type="submit" value="Select This Creature" />
		<input class="char-next" type="button" value="Next Creature" />
	</form>

<script type="text/javascript">
	jQuery(".char-next").click(function() {
		jQuery(".character:visible").hide().next(".character").show();
		if (jQuery(".character:visible").length == 0) {
			jQuery(".character").first().show();
		}
	});
</script>

<?php
} 
?>