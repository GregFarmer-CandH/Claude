<?php
/**
 * Shared header — logo, main nav, CTA button.
 * Pages using the minimal landing header set `fc_minimal_header` to true
 * before calling get_header() (see page-landing-ads.php).
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
$fc_minimal = ! empty( $GLOBALS['fc_minimal_header'] );
?><!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<header class="fc-header<?php echo $fc_minimal ? ' fc-header--minimal' : ''; ?>" id="fc-header">
	<div class="fc-container fc-header__bar">
		<a class="fc-logo" href="<?php echo esc_url( home_url( '/' ) ); ?>">
			<?php if ( has_custom_logo() ) : ?>
				<?php the_custom_logo(); ?>
			<?php else : ?>
				<img src="<?php echo esc_url( get_template_directory_uri() . '/assets/logo-farmer-crossfit.png' ); ?>" alt="Farmer CrossFit">
			<?php endif; ?>
		</a>

		<?php if ( ! $fc_minimal ) : ?>
			<button class="fc-nav-toggle" id="fc-nav-toggle" aria-expanded="false" aria-controls="fc-nav-menu">
				<span class="fc-visually-hidden">Menu</span>☰
			</button>
			<nav class="fc-nav" aria-label="Menu principal">
				<?php
				wp_nav_menu( array(
					'theme_location' => 'primary',
					'container'      => false,
					'menu_class'     => 'fc-nav__menu',
					'menu_id'        => 'fc-nav-menu',
					'fallback_cb'    => 'fc_default_menu',
				) );
				?>
			</nav>
			<div class="fc-header__cta">
				<a class="fc-btn fc-btn--pink" href="<?php echo esc_url( home_url( '/tarifs/' ) ); ?>">Séance découverte</a>
			</div>
		<?php endif; ?>
	</div>
</header>

