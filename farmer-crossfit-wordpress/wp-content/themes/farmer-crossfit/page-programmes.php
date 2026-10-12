<?php
/**
 * Page "Programmes" — matched automatically by WordPress for a Page whose
 * slug is "programmes" (template hierarchy: page-{slug}.php).
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
get_header();
?>

<section class="fc-hero fc-hero--compact">
	<?php fc_photo( 'hero', 'Nos programmes' ); ?>
	<div class="fc-container fc-hero__content">
		<h1 class="fc-hero__title">Nos Programmes</h1>
		<p class="fc-hero__subtitle">Découvrez tous les programmes proposés par Farmer CrossFit à Plaisir. Chaque programme est encadré par des coachs et adapté à tous les niveaux, du débutant complet au sportif confirmé.</p>
		<p class="fc-hero__subtitle">Sélectionnez un programme ci-dessous pour en savoir plus sur le contenu des séances, les horaires et les bénéfices.</p>
	</div>
</section>

<section class="fc-section fc-section--light">
	<div class="fc-container">
		<div class="fc-programs-grid">
			<?php foreach ( fc_programs() as $key => $program ) : ?>
				<div class="fc-program-card" id="<?php echo esc_attr( $key ); ?>">
					<div class="fc-program-card__photo">
						<?php fc_photo( 'prog_' . $key, $program['title'] ); ?>
					</div>
					<div class="fc-program-card__body">
						<h2 class="fc-program-card__title"><?php echo esc_html( $program['title'] ); ?></h2>
						<p class="fc-program-card__text"><?php echo esc_html( $program['text'] ); ?></p>
						<a class="fc-program-card__link" href="<?php echo esc_url( home_url( '/tarifs/' ) ); ?>">Découvrir <?php echo esc_html( $program['title'] ); ?> →</a>
					</div>
				</div>
			<?php endforeach; ?>
		</div>

		<div class="fc-section__footer">
			<p>Vous ne savez pas quel programme choisir ? Nos coachs vous guident vers le programme adapté à vos objectifs lors d'une séance découverte.</p>
			<a class="fc-btn fc-btn--pink" href="<?php echo esc_url( home_url( '/tarifs/' ) ); ?>">Séance découverte</a>
		</div>
	</div>
</section>

<?php get_footer(); ?>
