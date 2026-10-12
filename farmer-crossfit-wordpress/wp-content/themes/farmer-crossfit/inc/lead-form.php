<?php
/**
 * "Séance découverte" lead form — used on the Tarifs page, the homepage
 * lead-magnet banner, and the Google Ads landing page. No form plugin:
 * plain POST to admin-post.php, nonce-protected, emailed via wp_mail().
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Prints the form markup. $source identifies where the form was submitted
 * from, so the notification email (and future stats) can tell them apart.
 */
function fc_lead_form( $source = 'tarifs', $submit_label = 'Choisir mon créneau avec un coach' ) {
	$redirect = get_permalink();
	if ( ! $redirect ) {
		$redirect = home_url( '/' );
	}
	?>
	<?php if ( isset( $_GET['fc_lead'] ) && $_GET['fc_lead'] === $source ) : ?>
		<?php if ( isset( $_GET['fc_status'] ) && 'ok' === $_GET['fc_status'] ) : ?>
			<p class="fc-form__success">Merci ! Votre demande a bien été envoyée, un coach vous recontacte rapidement.</p>
		<?php elseif ( isset( $_GET['fc_status'] ) && 'error' === $_GET['fc_status'] ) : ?>
			<p class="fc-form__error">Un champ obligatoire est manquant ou invalide — merci de réessayer.</p>
		<?php endif; ?>
	<?php endif; ?>

	<form class="fc-form" method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
		<input type="hidden" name="action" value="fc_lead_submit">
		<input type="hidden" name="fc_source" value="<?php echo esc_attr( $source ); ?>">
		<input type="hidden" name="fc_redirect" value="<?php echo esc_url( $redirect ); ?>">
		<?php wp_nonce_field( 'fc_lead_submit', 'fc_lead_nonce' ); ?>

		<div class="fc-form__row">
			<div class="fc-form__field">
				<label for="fc_prenom_<?php echo esc_attr( $source ); ?>">Prénom *</label>
				<input type="text" id="fc_prenom_<?php echo esc_attr( $source ); ?>" name="fc_prenom" required>
			</div>
			<div class="fc-form__field">
				<label for="fc_nom_<?php echo esc_attr( $source ); ?>">Nom *</label>
				<input type="text" id="fc_nom_<?php echo esc_attr( $source ); ?>" name="fc_nom" required>
			</div>
		</div>

		<div class="fc-form__field">
			<label for="fc_email_<?php echo esc_attr( $source ); ?>">Email *</label>
			<input type="email" id="fc_email_<?php echo esc_attr( $source ); ?>" name="fc_email" required>
		</div>

		<div class="fc-form__field">
			<label for="fc_tel_<?php echo esc_attr( $source ); ?>">Téléphone</label>
			<input type="tel" id="fc_tel_<?php echo esc_attr( $source ); ?>" name="fc_telephone" placeholder="06 12 34 56 78 (optionnel)">
		</div>

		<label class="fc-form__consent">
			<input type="checkbox" name="fc_consent" value="1" required>
			<span>J'accepte que mes données soient traitées conformément à la <a href="<?php echo esc_url( home_url( '/confidentialite/' ) ); ?>">politique de confidentialité</a>.</span>
		</label>

		<button type="submit" class="fc-btn fc-btn--pink fc-btn--block"><?php echo esc_html( $submit_label ); ?></button>
		<p class="fc-form__note">Vos données sont protégées. Nous ne les partageons jamais.</p>
	</form>
	<?php
}

/**
 * Handles the POST: validates, emails the team, redirects back with a
 * status flag the form re-reads to show a success/error message.
 */
function fc_handle_lead_submit() {
	$source   = isset( $_POST['fc_source'] ) ? sanitize_key( $_POST['fc_source'] ) : 'site';
	$redirect = isset( $_POST['fc_redirect'] ) ? esc_url_raw( $_POST['fc_redirect'] ) : home_url( '/' );

	$fail = function() use ( $redirect, $source ) {
		wp_safe_redirect( add_query_arg( array( 'fc_lead' => $source, 'fc_status' => 'error' ), $redirect ) . '#fc-lead-form' );
		exit;
	};

	if ( ! isset( $_POST['fc_lead_nonce'] ) || ! wp_verify_nonce( $_POST['fc_lead_nonce'], 'fc_lead_submit' ) ) {
		$fail();
	}

	$prenom  = isset( $_POST['fc_prenom'] ) ? sanitize_text_field( $_POST['fc_prenom'] ) : '';
	$nom     = isset( $_POST['fc_nom'] ) ? sanitize_text_field( $_POST['fc_nom'] ) : '';
	$email   = isset( $_POST['fc_email'] ) ? sanitize_email( $_POST['fc_email'] ) : '';
	$tel     = isset( $_POST['fc_telephone'] ) ? sanitize_text_field( $_POST['fc_telephone'] ) : '';
	$consent = ! empty( $_POST['fc_consent'] );

	if ( ! $prenom || ! $nom || ! $email || ! is_email( $email ) || ! $consent ) {
		$fail();
	}

	$to      = get_theme_mod( 'fc_email', get_option( 'admin_email' ) );
	$subject = sprintf( '[Farmer CrossFit] Nouvelle demande de séance découverte (%s)', $source );
	$body    = "Nouvelle demande depuis le site :\n\n"
		. "Prénom : {$prenom}\n"
		. "Nom : {$nom}\n"
		. "Email : {$email}\n"
		. "Téléphone : " . ( $tel ? $tel : '(non renseigné)' ) . "\n"
		. "Page : {$source}\n";

	$headers = array( 'Content-Type: text/plain; charset=UTF-8' );
	if ( is_email( $email ) ) {
		$headers[] = "Reply-To: {$prenom} {$nom} <{$email}>";
	}

	wp_mail( $to, $subject, $body, $headers );

	wp_safe_redirect( add_query_arg( array( 'fc_lead' => $source, 'fc_status' => 'ok' ), $redirect ) . '#fc-lead-form' );
	exit;
}
add_action( 'admin_post_fc_lead_submit', 'fc_handle_lead_submit' );
add_action( 'admin_post_nopriv_fc_lead_submit', 'fc_handle_lead_submit' );
