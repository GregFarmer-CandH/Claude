<?php
/**
 * Fallback template (required by WordPress). The site has no blog in its
 * blueprint — front-page.php and the page-{slug}.php templates handle
 * every real page — this only catches anything unmatched.
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
get_header();
?>
<section class="fc-section fc-section--light">
	<div class="fc-container" style="max-width:760px;">
		<?php
		if ( have_posts() ) :
			while ( have_posts() ) :
				the_post();
				?>
				<article <?php post_class(); ?>>
					<h1><?php the_title(); ?></h1>
					<div class="fc-page-content"><?php the_content(); ?></div>
				</article>
				<?php
			endwhile;
		else :
			?>
			<p>Rien à afficher.</p>
			<?php
		endif;
		?>
	</div>
</section>
<?php get_footer(); ?>
