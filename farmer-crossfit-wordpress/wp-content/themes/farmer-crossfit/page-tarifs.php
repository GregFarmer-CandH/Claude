<?php
/**
 * Page "Tarifs" — matched automatically for a Page whose slug is "tarifs".
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
get_header();
?>

<section class="fc-hero fc-hero--compact">
	<?php fc_photo( 'hero', 'Trouvons la formule qui te convient' ); ?>
	<div class="fc-container fc-hero__content">
		<h1 class="fc-hero__title">Trouvons la formule qui te convient</h1>
		<p class="fc-hero__subtitle">Lors d'une séance découverte, un coach découvre ton objectif et ton rythme, puis te présente la formule adaptée.</p>
	</div>
</section>

<section class="fc-section fc-section--light" id="fc-lead-form">
	<div class="fc-container" style="max-width:560px;">
		<h2 style="text-align:center;">Réserver ma séance découverte</h2>
		<?php fc_lead_form( 'tarifs', 'Choisir mon créneau avec un coach' ); ?>

		<div class="fc-reassurances">
			<div class="fc-reassurance">
				<div class="fc-reassurance__icon">✓</div>
				<p class="fc-reassurance__title">Sans engagement</p>
				<p class="fc-reassurance__text">Échangez avec l'équipe avant de vous engager.</p>
			</div>
			<div class="fc-reassurance">
				<div class="fc-reassurance__icon">✓</div>
				<p class="fc-reassurance__title">Formules flexibles</p>
				<p class="fc-reassurance__text">Adaptées à votre rythme.</p>
			</div>
			<div class="fc-reassurance">
				<div class="fc-reassurance__icon">✓</div>
				<p class="fc-reassurance__title">Un échange avec un coach</p>
				<p class="fc-reassurance__text">Les formules sont présentées pendant la séance.</p>
			</div>
		</div>
	</div>
</section>

<?php get_footer(); ?>
