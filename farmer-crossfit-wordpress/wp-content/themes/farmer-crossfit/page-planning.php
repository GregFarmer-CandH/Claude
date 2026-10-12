<?php
/**
 * Page "Planning" — matched automatically for a Page whose slug is "planning".
 * Hours + booking link come from Apparence > Personnaliser > Coordonnées & horaires.
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
get_header();
$fc_booking_link = get_theme_mod( 'fc_booking_link', '' );
?>

<section class="fc-section fc-section--light" style="padding-top:56px;">
	<div class="fc-container" style="max-width:720px; text-align:center;">
		<h1>Planning des cours</h1>
		<p>Consultez le planning publié par Farmer CrossFit pour choisir le format et le créneau qui vous conviennent.</p>

		<h2 style="margin-top:2em;">Horaires d'ouverture</h2>
		<p class="fc-hours"><?php echo esc_html( get_theme_mod( 'fc_hours_text', "Lundi - Vendredi : 09:30 - 20:30\nSamedi : 09:00 - 12:00\nDimanche : Fermé" ) ); ?></p>

		<?php if ( $fc_booking_link ) : ?>
			<a class="fc-btn fc-btn--pink" href="<?php echo esc_url( $fc_booking_link ); ?>" target="_blank" rel="noopener">Voir le planning publié par le club</a>
		<?php else : ?>
			<a class="fc-btn fc-btn--pink" href="<?php echo esc_url( home_url( '/tarifs/' ) ); ?>">Séance découverte</a>
			<p style="font-size:0.85rem; color:var(--fc-text-muted); margin-top:10px;">(Lien vers votre outil de réservation à renseigner dans Apparence &gt; Personnaliser &gt; Coordonnées &amp; horaires.)</p>
		<?php endif; ?>

		<p style="margin-top:2em; font-size:0.9rem; color:var(--fc-text-muted);">Les créneaux pouvant évoluer, le planning en ligne reste la référence.</p>
	</div>
</section>

<?php get_footer(); ?>
