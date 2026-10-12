<?php
/**
 * Page "Témoignages" — matched automatically for a Page whose slug is
 * "temoignages". The 9 reviews are filled from Apparence > Personnaliser
 * > Témoignages (copy real Google reviews there — none are invented here).
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
get_header();
?>

<section class="fc-hero fc-hero--compact">
	<?php fc_photo( 'hero', 'Témoignages' ); ?>
	<div class="fc-container fc-hero__content">
		<h1 class="fc-hero__title">Témoignages</h1>
		<p class="fc-hero__subtitle">Des avis publiés par les membres du club.</p>
	</div>
</section>

<section class="fc-section fc-section--light">
	<div class="fc-container">
		<div class="fc-section__header">
			<h2 class="fc-section__title">Ce que nos membres disent de nous</h2>
		</div>
		<div class="fc-testimonials-grid">
			<?php
			$fc_shown = 0;
			for ( $i = 1; $i <= 9; $i++ ) {
				if ( get_theme_mod( "fc_testimonial_{$i}_author", '' ) ) {
					fc_testimonial_card( $i );
					$fc_shown++;
				}
			}
			if ( 0 === $fc_shown ) :
				?>
				<p>Les témoignages s'afficheront ici une fois ajoutés depuis <em>Apparence &gt; Personnaliser &gt; Témoignages</em> (copiez-collez vos avis Google réels, un par encart).</p>
			<?php endif; ?>
		</div>
	</div>
</section>

<section class="fc-section fc-section--dark fc-cta-final">
	<div class="fc-container">
		<h2>Écrivez votre propre histoire</h2>
		<p>Rejoignez notre communauté et découvrez ce que vous pouvez accomplir.</p>
		<a class="fc-btn fc-btn--pink" href="<?php echo esc_url( home_url( '/tarifs/' ) ); ?>">Séance découverte</a>
	</div>
</section>

<?php get_footer(); ?>
