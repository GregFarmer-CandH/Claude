<?php
/**
 * Accueil — see the site blueprint doc for the section-by-section spec.
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
get_header();
?>

<section class="fc-hero">
	<?php fc_photo( 'hero', 'Ambiance d’entraînement en groupe dans la box' ); ?>
	<div class="fc-container fc-hero__content">
		<h1 class="fc-hero__title">Votre salle de CrossFit à Plaisir, coachée du début à la fin</h1>
		<p class="fc-hero__subtitle">Bougez mieux, sans brusquerie, bien accompagné. Chez Farmer CrossFit, nos coachs s'adaptent à votre niveau et vous accompagnent pas à pas.</p>
		<a class="fc-btn fc-btn--pink" href="<?php echo esc_url( home_url( '/tarifs/' ) ); ?>">Séance découverte</a>
	</div>
</section>

<section class="fc-section fc-section--light">
	<div class="fc-container">
		<div class="fc-section__header">
			<h2 class="fc-section__title">Comment commencer</h2>
		</div>
		<div class="fc-steps">
			<div class="fc-steps__item">
				<div class="fc-steps__number">1</div>
				<p class="fc-steps__title">Réservez votre séance découverte offerte</p>
			</div>
			<div class="fc-steps__item">
				<div class="fc-steps__number">2</div>
				<p class="fc-steps__title">Suivez votre programme personnalisé</p>
			</div>
			<div class="fc-steps__item">
				<div class="fc-steps__number">3</div>
				<p class="fc-steps__title">Rejoignez la communauté</p>
			</div>
		</div>
	</div>
</section>

<section class="fc-section fc-section--muted">
	<div class="fc-container">
		<div class="fc-section__header">
			<h2 class="fc-section__title">On sait ce qui vous retient</h2>
		</div>
		<div class="fc-checklist">
			<p class="fc-checklist__item">Peur de ne pas être au niveau</p>
			<p class="fc-checklist__item">Manque de temps</p>
			<p class="fc-checklist__item">Peur de se blesser</p>
			<p class="fc-checklist__item">Pas envie de s'engager seul</p>
		</div>
		<div class="fc-section__footer">
			<a class="fc-btn fc-btn--pink" href="<?php echo esc_url( home_url( '/tarifs/' ) ); ?>">Séance découverte</a>
		</div>
	</div>
</section>

<section class="fc-section fc-section--light">
	<div class="fc-container fc-split">
		<div class="fc-split__text">
			<h2>Soyez en forme. Bougez mieux. Vivez pleinement.</h2>
			<p>À une encablure de Plaisir, Farmer CrossFit vous accompagne avec des séances adaptées à votre niveau et des coachs à l'écoute de vos objectifs au quotidien.</p>
		</div>
		<div class="fc-split__photo">
			<?php fc_photo( 'about', 'Portrait d’un adhérent en plein effort' ); ?>
		</div>
	</div>
</section>

<section class="fc-section fc-section--muted">
	<div class="fc-container">
		<div class="fc-section__header">
			<h2 class="fc-section__title">Nos programmes à Plaisir</h2>
		</div>
		<div class="fc-programs-grid">
			<?php foreach ( fc_programs() as $key => $program ) : ?>
				<div class="fc-program-card">
					<div class="fc-program-card__photo">
						<?php fc_photo( 'prog_' . $key, $program['title'] ); ?>
					</div>
					<div class="fc-program-card__body">
						<h3 class="fc-program-card__title"><?php echo esc_html( $program['title'] ); ?></h3>
						<p class="fc-program-card__text"><?php echo esc_html( $program['text'] ); ?></p>
						<a class="fc-program-card__link" href="<?php echo esc_url( home_url( '/programmes/#' . $key ) ); ?>">Découvrir <?php echo esc_html( $program['title'] ); ?> →</a>
					</div>
				</div>
			<?php endforeach; ?>
		</div>
	</div>
</section>

<section class="fc-section fc-section--dark">
	<div class="fc-container">
		<div class="fc-section__header">
			<h2 class="fc-section__title">Pourquoi Plaisir choisit Farmer CrossFit</h2>
		</div>
		<div class="fc-testimonials-grid">
			<?php
			$fc_shown = 0;
			for ( $i = 1; $i <= 9 && $fc_shown < 3; $i++ ) {
				if ( get_theme_mod( "fc_testimonial_{$i}_author", '' ) ) {
					fc_testimonial_card( $i );
					$fc_shown++;
				}
			}
			if ( 0 === $fc_shown ) :
				?>
				<p style="color:rgba(255,255,255,0.6);">Les premiers témoignages s'afficheront ici une fois ajoutés depuis Apparence &gt; Personnaliser &gt; Témoignages.</p>
			<?php endif; ?>
		</div>
		<div class="fc-section__footer">
			<a class="fc-btn fc-btn--outline" href="<?php echo esc_url( home_url( '/temoignages/' ) ); ?>">Voir tous les témoignages</a>
		</div>
	</div>
</section>

<section class="fc-section fc-section--light">
	<div class="fc-container">
		<div class="fc-section__header">
			<h2 class="fc-section__title">Rencontrez l'équipe de Farmer CrossFit</h2>
		</div>
		<div class="fc-team-grid">
			<?php foreach ( fc_team() as $key => $member ) : ?>
				<div class="fc-team-card">
					<div class="fc-team-card__photo">
						<?php fc_photo( 'team_' . $key, $member['name'] ); ?>
					</div>
					<p class="fc-team-card__name"><?php echo esc_html( $member['name'] ); ?></p>
					<p class="fc-team-card__role"><?php echo esc_html( $member['role'] ); ?></p>
				</div>
			<?php endforeach; ?>
		</div>
	</div>
</section>

<section class="fc-section fc-section--muted">
	<div class="fc-container">
		<div class="fc-section__header">
			<h2 class="fc-section__title">Questions fréquemment posées</h2>
		</div>
		<div class="fc-faq">
			<?php
			$fc_faq = array(
				'Je n\'ai jamais fait de CrossFit, puis-je venir ?' => 'Oui, la grande majorité de nos adhérents ont débuté sans aucune expérience. Chaque séance est adaptée à votre niveau par le coach.',
				'Comment se passe la séance découverte ?'           => 'Un coach échange avec vous sur vos objectifs et votre rythme, puis vous présente la formule adaptée. Sans engagement.',
				'Quels horaires sont proposés ?'                    => 'Consultez nos horaires d\'ouverture et le planning détaillé des cours sur la page Planning.',
				'Où se trouve la salle ?'                           => '7 rue Marcellin Berthelot, Ferme des Ébisoires, 78370 Plaisir.',
				'Est-il possible d\'essayer avant de s\'engager ?'  => 'Oui, c\'est justement l\'objet de la séance découverte offerte, sans engagement.',
				'Faut-il apporter son propre matériel ?'            => 'Non, tout le matériel est fourni sur place. Prévoyez simplement une tenue de sport et une bouteille d\'eau.',
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

<section class="fc-leadmagnet" id="fc-lead-form">
	<div class="fc-container">
		<div class="fc-leadmagnet__text">
			<h2 class="fc-leadmagnet__title">Séance découverte : votre premier pas vers un meilleur entraînement</h2>
			<p>Laissez-nous vos coordonnées, un coach vous recontacte pour organiser votre séance découverte offerte.</p>
		</div>
		<div class="fc-leadmagnet__form">
			<?php fc_lead_form( 'accueil', 'Réserver ma séance' ); ?>
		</div>
	</div>
</section>

<section class="fc-section fc-section--dark fc-cta-final">
	<div class="fc-container">
		<h2>Prêt(e) à commencer ?</h2>
		<a class="fc-btn fc-btn--pink" href="<?php echo esc_url( home_url( '/tarifs/' ) ); ?>">Séance découverte</a>
	</div>
</section>

<section class="fc-section fc-section--light">
	<div class="fc-container fc-split fc-split--reverse">
		<div class="fc-location__photo">
			<?php fc_photo( 'location', 'Façade extérieure de la salle' ); ?>
		</div>
		<div class="fc-location__text">
			<h2>Nous trouver</h2>
			<p class="fc-location__address">7 rue Marcellin Berthelot, Ferme des Ébisoires, 78370 Plaisir</p>
			<a class="fc-btn fc-btn--dark" href="https://www.google.com/maps/search/?api=1&query=7+rue+Marcellin+Berthelot+78370+Plaisir" target="_blank" rel="noopener">Obtenir l'itinéraire</a>
		</div>
	</div>
</section>

<?php get_footer(); ?>
