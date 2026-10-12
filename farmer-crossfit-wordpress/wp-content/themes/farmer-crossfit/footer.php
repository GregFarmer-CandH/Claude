<?php
/**
 * Shared footer — 4 columns (about / quick links / horaires / contact) + social.
 * The landing page (page-landing-ads.php) doesn't call get_footer(): it
 * prints its own minimal <footer> inline instead, with no links back to
 * the rest of the site, then closes the page itself.
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
	<footer class="fc-footer">
		<div class="fc-container">
			<div class="fc-footer__grid">
				<div class="fc-footer__col">
					<h4>Farmer CrossFit</h4>
					<p>Une salle de CrossFit à Plaisir avec coaching personnalisé, communauté bienveillante et programmes adaptés à tous les niveaux.</p>
					<div class="fc-footer__social">
						<a href="#" aria-label="Facebook">f</a>
						<a href="#" aria-label="Instagram">ig</a>
					</div>
				</div>
				<div class="fc-footer__col">
					<h4>Liens rapides</h4>
					<ul>
						<li><a href="<?php echo esc_url( home_url( '/programmes/' ) ); ?>">Programmes</a></li>
						<li><a href="<?php echo esc_url( home_url( '/temoignages/' ) ); ?>">Témoignages</a></li>
						<li><a href="<?php echo esc_url( home_url( '/planning/' ) ); ?>">Planning</a></li>
						<li><a href="<?php echo esc_url( home_url( '/tarifs/' ) ); ?>">Tarifs</a></li>
					</ul>
				</div>
				<div class="fc-footer__col">
					<h4>Horaires</h4>
					<p class="fc-hours"><?php echo esc_html( get_theme_mod( 'fc_hours_text', "Lundi - Vendredi : 09:30 - 20:30\nSamedi : 09:00 - 12:00\nDimanche : Fermé" ) ); ?></p>
				</div>
				<div class="fc-footer__col">
					<h4>Contact</h4>
					<?php $fc_phone = get_theme_mod( 'fc_phone', '' ); ?>
					<?php if ( $fc_phone ) : ?>
						<p><a href="tel:<?php echo esc_attr( preg_replace( '/\s+/', '', $fc_phone ) ); ?>"><?php echo esc_html( $fc_phone ); ?></a></p>
					<?php endif; ?>
					<p><a href="mailto:<?php echo esc_attr( get_theme_mod( 'fc_email', 'contact@farmer-crossfit.com' ) ); ?>"><?php echo esc_html( get_theme_mod( 'fc_email', 'contact@farmer-crossfit.com' ) ); ?></a></p>
					<p>7 rue Marcellin Berthelot<br>Ferme des Ébisoires<br>78370 Plaisir</p>
				</div>
			</div>
			<div class="fc-footer__bottom">
				<span>&copy; <?php echo esc_html( date( 'Y' ) ); ?> Farmer CrossFit. Tous droits réservés.</span>
				<span>
					<a href="<?php echo esc_url( home_url( '/confidentialite/' ) ); ?>">Confidentialité</a> ·
					<a href="<?php echo esc_url( home_url( '/mentions-legales/' ) ); ?>">Mentions légales</a>
				</span>
			</div>
		</div>
	</footer>

<?php wp_footer(); ?>
</body>
</html>
