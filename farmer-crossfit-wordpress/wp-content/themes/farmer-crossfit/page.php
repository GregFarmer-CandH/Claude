<?php
/**
 * Generic page template — used for any page without a dedicated
 * page-{slug}.php (e.g. Mentions légales, Confidentialité).
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
get_header();
?>
<section class="fc-section fc-section--light">
	<div class="fc-container" style="max-width:760px;">
		<?php
		while ( have_posts() ) :
			the_post();
			?>
			<h1><?php the_title(); ?></h1>
			<div class="fc-page-content">
				<?php the_content(); ?>
			</div>
			<?php
		endwhile;
		?>
	</div>
</section>
<?php get_footer(); ?>
