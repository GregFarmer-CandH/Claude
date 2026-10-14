<?php
/**
 * Farmer CrossFit theme bootstrap.
 *
 * Every photo slot on the site is a WordPress Customizer image control —
 * the community manager uploads each one from Apparence > Personnaliser,
 * no code or plugin involved. Until a photo is uploaded, fc_photo() falls
 * back to a bundled placeholder graphic that reads "PHOTO À METTRE".
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'FC_VERSION', '1.0.0' );

/**
 * Theme setup.
 */
function fc_setup() {
	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'html5', array( 'search-form', 'gallery', 'caption', 'script', 'style' ) );
	add_theme_support( 'custom-logo', array(
		'height'      => 80,
		'width'       => 240,
		'flex-height' => true,
		'flex-width'  => true,
	) );

	register_nav_menus( array(
		'primary' => __( 'Menu principal', 'farmer-crossfit' ),
	) );
}
add_action( 'after_setup_theme', 'fc_setup' );

/**
 * Styles & scripts.
 */
function fc_assets() {
	wp_enqueue_style( 'fc-style', get_stylesheet_uri(), array(), FC_VERSION );
	wp_enqueue_script( 'fc-main', get_template_directory_uri() . '/assets/main.js', array(), FC_VERSION, true );
}
add_action( 'wp_enqueue_scripts', 'fc_assets' );

/**
 * Placeholder image used as the default for every Customizer image control
 * until the community manager uploads the real photo.
 */
function fc_placeholder_url() {
	return get_template_directory_uri() . '/assets/placeholder.svg';
}

/**
 * Outputs an <img> for a given photo slot, using the uploaded Customizer
 * value or the bundled placeholder.
 *
 * @param string $key   Customizer setting id (without the fc_photo_ prefix).
 * @param string $alt   Alt text / caption shown over the placeholder.
 * @param string $class Extra CSS classes on the <img>.
 */
function fc_photo( $key, $alt = '', $class = '' ) {
	$setting_id = 'fc_photo_' . $key;
	$url        = get_theme_mod( $setting_id, fc_placeholder_url() );
	$is_placeholder = ( $url === fc_placeholder_url() );
	$classes    = trim( 'fc-photo ' . ( $is_placeholder ? 'fc-photo--placeholder' : '' ) . ' ' . $class );

	printf(
		'<span class="%1$s" data-photo-label="%2$s"><img src="%3$s" alt="%2$s" loading="lazy" /></span>',
		esc_attr( $classes ),
		esc_attr( $alt ? $alt : 'Photo à mettre' ),
		esc_url( $url )
	);
}

/**
 * All photo slots across the site: id => [ label, description, section ].
 * Looped once to register every Customizer control and keep the list in
 * one place (add a page later → add one line here).
 */
function fc_photo_slots() {
	return array(
		// Accueil
		'hero'        => array( 'Accueil — Photo Hero', 'Ambiance d’entraînement en groupe dans la box.', 'fc_section_photos_accueil' ),
		'about'       => array( 'Accueil — « Soyez en forme »', 'Portrait d’un adhérent en plein effort.', 'fc_section_photos_accueil' ),
		'location'    => array( 'Accueil — Nous trouver', 'Façade extérieure de la salle ou carte.', 'fc_section_photos_accueil' ),

		// Équipe
		'team_yann'    => array( 'Équipe — Yann (head coach)', '', 'fc_section_photos_equipe' ),
		'team_romain'  => array( 'Équipe — Romain (coach)', '', 'fc_section_photos_equipe' ),
		'team_quentin' => array( 'Équipe — Quentin (coach)', '', 'fc_section_photos_equipe' ),
		'team_manon'   => array( 'Équipe — Manon (coach)', '', 'fc_section_photos_equipe' ),
		'team_greg'    => array( 'Équipe — Greg (owner)', '', 'fc_section_photos_equipe' ),
		'team_yvain'   => array( 'Équipe — Yvain (co-owner)', '', 'fc_section_photos_equipe' ),

		// Programmes (réutilisées sur Accueil + page Programmes)
		'prog_crossfit'         => array( 'Programme — CrossFit', '', 'fc_section_photos_programmes' ),
		'prog_hyrox'            => array( 'Programme — HYROX', '', 'fc_section_photos_programmes' ),
		'prog_halterophilie'    => array( 'Programme — Haltérophilie', '', 'fc_section_photos_programmes' ),
		'prog_conditioning'     => array( 'Programme — Conditioning', '', 'fc_section_photos_programmes' ),
		'prog_opengym'          => array( 'Programme — Open Gym', '', 'fc_section_photos_programmes' ),
		'prog_yogapilates'      => array( 'Programme — Yoga - Pilates', '', 'fc_section_photos_programmes' ),
		'prog_gymnastique'      => array( 'Programme — Gymnastique', '', 'fc_section_photos_programmes' ),
		'prog_personaltraining' => array( 'Programme — Personal Training', '', 'fc_section_photos_programmes' ),
		'prog_nutrition'        => array( 'Programme — Accompagnement Nutrition', '', 'fc_section_photos_programmes' ),
		'prog_mobilite'         => array( 'Programme — Mobilité', '', 'fc_section_photos_programmes' ),
		'prog_association'      => array( 'Programme — Association', '', 'fc_section_photos_programmes' ),

		// Landing page Google Ads
		'landing_hero'     => array( 'Landing Ads — Hero', 'Action dynamique en salle.', 'fc_section_photos_landing' ),
		'landing_benefits' => array( 'Landing Ads — Pourquoi Farmer CrossFit', '', 'fc_section_photos_landing' ),
	);
}

/**
 * Customizer: one panel, with photo sections (looped from fc_photo_slots),
 * a testimonials section (9 editable reviews) and a contact/hours section.
 */
function fc_customize_register( $wp_customize ) {

	$wp_customize->add_panel( 'fc_panel', array(
		'title'    => __( 'Farmer CrossFit — Contenu du site', 'farmer-crossfit' ),
		'priority' => 10,
	) );

	// --- Photos, grouped by page -------------------------------------------------
	$photo_sections = array(
		'fc_section_photos_accueil'    => __( 'Photos — Accueil', 'farmer-crossfit' ),
		'fc_section_photos_equipe'     => __( 'Photos — Équipe', 'farmer-crossfit' ),
		'fc_section_photos_programmes' => __( 'Photos — Programmes', 'farmer-crossfit' ),
		'fc_section_photos_landing'    => __( 'Photos — Landing page Google Ads', 'farmer-crossfit' ),
	);
	foreach ( $photo_sections as $section_id => $section_title ) {
		$wp_customize->add_section( $section_id, array(
			'title' => $section_title,
			'panel' => 'fc_panel',
		) );
	}

	foreach ( fc_photo_slots() as $key => $data ) {
		list( $label, $description, $section ) = $data;
		$setting_id = 'fc_photo_' . $key;

		$wp_customize->add_setting( $setting_id, array(
			'default'           => fc_placeholder_url(),
			'sanitize_callback' => 'esc_url_raw',
			'transport'         => 'refresh',
		) );

		$wp_customize->add_control( new WP_Customize_Image_Control( $wp_customize, $setting_id, array(
			'label'       => $label,
			'description' => $description,
			'section'     => $section,
		) ) );
	}

	// --- Témoignages (9 avis Google à coller) ------------------------------------
	$wp_customize->add_section( 'fc_section_testimonials', array(
		'title' => __( 'Témoignages (avis Google)', 'farmer-crossfit' ),
		'panel' => 'fc_panel',
	) );

	for ( $i = 1; $i <= 9; $i++ ) {
		$wp_customize->add_setting( "fc_testimonial_{$i}_author", array(
			'default'           => '',
			'sanitize_callback' => 'sanitize_text_field',
			'transport'         => 'refresh',
		) );
		$wp_customize->add_control( "fc_testimonial_{$i}_author", array(
			'label'   => sprintf( __( 'Avis %d — Auteur', 'farmer-crossfit' ), $i ),
			'section' => 'fc_section_testimonials',
			'type'    => 'text',
		) );

		$wp_customize->add_setting( "fc_testimonial_{$i}_meta", array(
			'default'           => '',
			'sanitize_callback' => 'sanitize_text_field',
			'transport'         => 'refresh',
		) );
		$wp_customize->add_control( "fc_testimonial_{$i}_meta", array(
			'label'       => sprintf( __( 'Avis %d — Sous-texte', 'farmer-crossfit' ), $i ),
			'description' => __( 'Ex. « Membre depuis 1 an »', 'farmer-crossfit' ),
			'section'     => 'fc_section_testimonials',
			'type'        => 'text',
		) );

		$wp_customize->add_setting( "fc_testimonial_{$i}_text", array(
			'default'           => '',
			'sanitize_callback' => 'sanitize_textarea_field',
			'transport'         => 'refresh',
		) );
		$wp_customize->add_control( "fc_testimonial_{$i}_text", array(
			'label'   => sprintf( __( 'Avis %d — Texte', 'farmer-crossfit' ), $i ),
			'section' => 'fc_section_testimonials',
			'type'    => 'textarea',
		) );

		$wp_customize->add_setting( "fc_testimonial_{$i}_rating", array(
			'default'           => 5,
			'sanitize_callback' => 'absint',
			'transport'         => 'refresh',
		) );
		$wp_customize->add_control( "fc_testimonial_{$i}_rating", array(
			'label'   => sprintf( __( 'Avis %d — Note (1 à 5)', 'farmer-crossfit' ), $i ),
			'section' => 'fc_section_testimonials',
			'type'    => 'select',
			'choices' => array( 1 => '1', 2 => '2', 3 => '3', 4 => '4', 5 => '5' ),
		) );
	}

	// --- Coordonnées & horaires ---------------------------------------------------
	$wp_customize->add_section( 'fc_section_contact', array(
		'title' => __( 'Coordonnées & horaires', 'farmer-crossfit' ),
		'panel' => 'fc_panel',
	) );

	$wp_customize->add_setting( 'fc_phone', array(
		'default'           => '',
		'sanitize_callback' => 'sanitize_text_field',
		'transport'         => 'refresh',
	) );
	$wp_customize->add_control( 'fc_phone', array(
		'label'   => __( 'Téléphone', 'farmer-crossfit' ),
		'section' => 'fc_section_contact',
		'type'    => 'text',
	) );

	$wp_customize->add_setting( 'fc_email', array(
		'default'           => 'contact@farmer-crossfit.com',
		'sanitize_callback' => 'sanitize_email',
		'transport'         => 'refresh',
	) );
	$wp_customize->add_control( 'fc_email', array(
		'label'   => __( 'Email de contact', 'farmer-crossfit' ),
		'section' => 'fc_section_contact',
		'type'    => 'email',
	) );

	$wp_customize->add_setting( 'fc_hours_text', array(
		'default'           => "Lundi - Vendredi : 09:30 - 20:30\nSamedi : 09:00 - 12:00\nDimanche : Fermé",
		'sanitize_callback' => 'sanitize_textarea_field',
		'transport'         => 'refresh',
	) );
	$wp_customize->add_control( 'fc_hours_text', array(
		'label'       => __( 'Horaires d’ouverture', 'farmer-crossfit' ),
		'description' => __( 'Une ligne par horaire, affichée sur la page Planning et dans le footer.', 'farmer-crossfit' ),
		'section'     => 'fc_section_contact',
		'type'        => 'textarea',
	) );

	$wp_customize->add_setting( 'fc_booking_link', array(
		'default'           => '',
		'sanitize_callback' => 'esc_url_raw',
		'transport'         => 'refresh',
	) );
	$wp_customize->add_control( 'fc_booking_link', array(
		'label'       => __( 'Lien vers le planning / outil de réservation', 'farmer-crossfit' ),
		'section'     => 'fc_section_contact',
		'type'        => 'url',
	) );
}
add_action( 'customize_register', 'fc_customize_register' );

/**
 * The 10 programmes/services, in display order. Shared by the homepage
 * preview grid and the full Programmes page so the copy lives in one place.
 * Photo comes from the matching fc_photo_slots() entry ('prog_' . key).
 */
function fc_programs() {
	return array(
		'crossfit'         => array(
			'title' => 'CrossFit',
			'text'  => 'Force, cardio et gymnastique dans chaque séance, encadrée par un coach du début à la fin.',
		),
		'hyrox'            => array(
			'title' => 'HYROX',
			'text'  => 'Course à pied et stations fonctionnelles : prépare ta première HYROX ou améliore ton chrono.',
		),
		'halterophilie'    => array(
			'title' => 'Haltérophilie',
			'text'  => 'Arraché et épaulé-jeté : apprends la technique olympique, pas à pas, avec un coach.',
		),
		'conditioning'     => array(
			'title' => 'Conditioning',
			'text'  => 'Cardio et renforcement sans barre : rameur, vélo, ski erg, poids de corps. Accessible à tous.',
		),
		'opengym'          => array(
			'title' => 'Open Gym',
			'text'  => 'La salle en accès libre pour faire son entraînement, renforcement ou cardio, avec tout le matériel.',
		),
		'yogapilates'      => array(
			'title' => 'Yoga - Pilates',
			'text'  => 'Respiration, étirements et renforcement profond : un temps pour soi entre deux séances de CrossFit.',
		),
		'gymnastique'      => array(
			'title' => 'Gymnastique',
			'text'  => 'Tractions, muscle-up, équilibre sur les mains : maîtrise ton corps avec des progressions claires.',
		),
		'personaltraining' => array(
			'title' => 'Personal Training',
			'text'  => 'Un coach rien que pour toi : un accompagnement individuel calé sur ton objectif et ton rythme.',
		),
		'nutrition'        => array(
			'title' => 'Accompagnement Nutrition',
			'text'  => 'Poser des bases solides dans l\'assiette avec une diététicienne du sport partenaire de la salle.',
		),
		'mobilite'         => array(
			'title' => 'Mobilité',
			'text'  => 'Souplesse, amplitude et récupération : le complément indispensable de tes séances.',
		),
		'association'      => array(
			'title' => 'Association',
			'text'  => 'Dès 3 ans : courir, sauter, grimper, porter. Séances ludiques encadrées par un coach. Des cours séniors et « adaptive » pour des personnes en situation de handicap moteur.',
		),
	);
}

/**
 * The 6 team members, in display order. Photo comes from the matching
 * fc_photo_slots() entry ('team_' . key).
 */
function fc_team() {
	return array(
		'yann'    => array( 'name' => 'Yann', 'role' => 'Head coach' ),
		'romain'  => array( 'name' => 'Romain', 'role' => 'Coach' ),
		'quentin' => array( 'name' => 'Quentin', 'role' => 'Coach' ),
		'manon'   => array( 'name' => 'Manon', 'role' => 'Coach' ),
		'greg'    => array( 'name' => 'Greg', 'role' => 'Owner' ),
		'yvain'   => array( 'name' => 'Yvain', 'role' => 'Co-owner' ),
	);
}

/**
 * Prints one testimonial card from its Customizer fields (1 to 9).
 * Skips silently if the community manager hasn't filled it in yet.
 */
function fc_testimonial_card( $i ) {
	$author = get_theme_mod( "fc_testimonial_{$i}_author", '' );
	$text   = get_theme_mod( "fc_testimonial_{$i}_text", '' );
	if ( ! $author || ! $text ) {
		return;
	}
	$meta   = get_theme_mod( "fc_testimonial_{$i}_meta", '' );
	$rating = max( 1, min( 5, (int) get_theme_mod( "fc_testimonial_{$i}_rating", 5 ) ) );
	?>
	<div class="fc-testimonial-card">
		<div class="fc-testimonial-card__stars" aria-hidden="true"><?php echo esc_html( str_repeat( '★', $rating ) . str_repeat( '☆', 5 - $rating ) ); ?></div>
		<p class="fc-testimonial-card__text">"<?php echo esc_html( $text ); ?>"</p>
		<p class="fc-testimonial-card__author"><?php echo esc_html( $author ); ?></p>
		<?php if ( $meta ) : ?><p class="fc-testimonial-card__meta"><?php echo esc_html( $meta ); ?></p><?php endif; ?>
	</div>
	<?php
}

/**
 * Fallback menu if no "primary" menu has been created yet in
 * Apparence > Menus — keeps the header usable out of the box.
 */
function fc_default_menu() {
	$links = array(
		'/programmes/'  => 'Programmes',
		'/temoignages/' => 'Témoignages',
		'/planning/'    => 'Planning',
		'/tarifs/'      => 'Tarifs',
	);
	echo '<ul class="fc-nav__menu">';
	foreach ( $links as $path => $label ) {
		printf( '<li><a href="%s">%s</a></li>', esc_url( home_url( $path ) ), esc_html( $label ) );
	}
	echo '</ul>';
}

/**
 * Lead form handler (Tarifs page + landing page Google Ads).
 */
require get_template_directory() . '/inc/lead-form.php';
