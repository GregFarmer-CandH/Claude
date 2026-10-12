<?php
/**
 * Template Name: Landing Ads
 *
 * Standalone, high-conversion page for Google Ads traffic — not in the
 * main menu, minimal header (logo only) and minimal footer (no links back
 * to the rest of the site) so visitors stay focused on the form.
 * Assign it from the Page editor: Attributs de page > Modèle > Landing Ads.
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
$GLOBALS['fc_minimal_header'] = true;
get_header();
?>

<section class="fc-hero">
	<?php fc_photo( 'landing_hero', 'Action dynamique en salle' ); ?>
	<div class="fc-container fc-hero__content">
		<h1 class="fc-hero__title">Votre séance découverte CrossFit offerte à Plaisir</h1>
		<p class="fc-hero__subtitle">Un coach évalue votre niveau et construit avec vous un programme sur-mesure. Sans engagement.</p>
		<div class="fc-leadmagnet__form" style="max-width:460px; margin:0 auto; text-align:left;" id="fc-lead-form">
			<?php fc_lead_form( 'landing', 'Je réserve ma séance découverte' ); ?>
		</div>
	</div>
</section>

<section class="fc-section fc-section--light">
	<div class="fc-container">
		<div class="fc-reassurances" style="margin-top:0;">
			<div class="fc-reassurance">
				<div class="fc-reassurance__icon">✓</div>
				<p class="fc-reassurance__title">Sans engagement</p>
			</div>
			<div class="fc-reassurance">
				<div class="fc-reassurance__icon">✓</div>
				<p class="fc-reassurance__title">Coach diplômé</p>
			</div>
			<div class="fc-reassurance">
				<div class="fc-reassurance__icon">✓</div>
				<p class="fc-reassurance__title">1er créneau sous 48h</p>
			</div>
		</div>
	</div>
</section>

<section class="fc-section fc-section--muted">
	<div class="fc-container fc-split">
		<div class="fc-split__text">
			<h2>Pourquoi Farmer CrossFit</h2>
			<ul style="display:flex; flex-direction:column; gap:10px;">
				<li>• Une communauté bienveillante, à Plaisir</li>
				<li>• Un coaching personnalisé à chaque séance</li>
				<li>• Des résultats mesurables, sans brusquerie</li>
			</ul>
		</div>
		<div class="fc-split__photo">
			<?php fc_photo( 'landing_benefits', 'Pourquoi Farmer CrossFit' ); ?>
		</div>
	</div>
</section>

<?php
$fc_testimonial_shown = false;
for ( $i = 1; $i <= 9; $i++ ) {
	if ( get_theme_mod( "fc_testimonial_{$i}_author", '' ) ) {
		$fc_testimonial_shown = $i;
		break;
	}
}
if ( $fc_testimonial_shown ) :
	?>
	<section class="fc-section fc-section--light">
		<div class="fc-container" style="max-width:600px;">
			<?php fc_testimonial_card( $fc_testimonial_shown ); ?>
		</div>
	</section>
<?php endif; ?>

<section class="fc-section fc-section--muted">
	<div class="fc-container">
		<div class="fc-section__header">
			<h2 class="fc-section__title">Questions fréquentes</h2>
		</div>
		<div class="fc-faq">
			<?php
			$fc_faq = array(
				'Quel niveau est requis ?'           => 'Aucun. La séance découverte s\'adapte à votre niveau, débutant ou confirmé.',
				'Combien de temps dure une séance ?' => 'Comptez environ une heure, échange avec le coach compris.',
				'Que faut-il apporter ?'              => 'Une tenue de sport et une bouteille d\'eau, le reste du matériel est fourni.',
			);
			foreach ( $fc_faq as $question => $answer ) :
				?>
				<details class="fc-faq__item">
					<summary><?php echo esc_html( $question ); ?></summary>
					<p><?php echo esc_html( $answer ); ?></p>
				</details>
			<?php endforeach; ?>
		</div>
	</div>
</section>

<section class="fc-section fc-section--dark fc-cta-final">
	<div class="fc-container" style="max-width:460px;">
		<h2>Prêt(e) à commencer ?</h2>
		<div class="fc-leadmagnet__form" style="text-align:left;">
			<?php fc_lead_form( 'landing-bas', 'Je réserve ma séance découverte' ); ?>
		</div>
	</div>
</section>

<footer class="fc-footer--minimal">
	<p>
		Farmer CrossFit — 7 rue Marcellin Berthelot, Ferme des Ébisoires, 78370 Plaisir
		<?php $fc_phone = get_theme_mod( 'fc_phone', '' ); ?>
		<?php if ( $fc_phone ) : ?> · <?php echo esc_html( $fc_phone ); ?><?php endif; ?>
		· <a href="<?php echo esc_url( home_url( '/mentions-legales/' ) ); ?>">Mentions légales</a>
	</p>
</footer>

<?php wp_footer(); ?>
</body>
</html>
