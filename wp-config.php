<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the
 * installation. You don't have to use the web site, you can
 * copy this file to "wp-config.php" and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://codex.wordpress.org/Editing_wp-config.php
 *
 * @package WordPress
 */

define( 'WP_HOME', 'https://mentale.ca' );
define( 'WP_SITEURL', 'https://mentale.ca' );

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', 'db638559685');

/** MySQL database username */
define('DB_USER', 'dbo638559685');

/** MySQL database password */
define('DB_PASSWORD', 'c(qwer bv*/fsd!&fsd)%(34919n4)_%!(p7yc1n');

/** MySQL hostname */
define('DB_HOST', 'db638559685.db.1and1.com');

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         '3s%Sc`vYp_d%D+QhRX:ae^^^nY}YdTY)Jzn~TMGGJ0~x2Sc+8kmmB?0Y(D--/bT$');
define('SECURE_AUTH_KEY',  '-1*|#bss:6/w!NZ p}Kg{et<-$uj2_oInB^{;dnu<Wp_F{e#)f%Eu/gg2iv~Lrd=');
define('LOGGED_IN_KEY',    'fe?;|Q?+yqNUcHt+KebodD88PG>!C5*4:qI$8yclex9UB4DSCX=ERI<=r8CMJ-d+');
define('NONCE_KEY',        'm~=5E)9eLN~)rB%)Y1OrlpfpV_3)0@ct!,g(_Y`,/D^N $qI7AL;If8uFZuiLDY8');
define('AUTH_SALT',        'K2anO:*up@!nj/*T5NY>RGR(Yuhp5*gGwV;0o_4ibDST=JoFuxLR+!L1*Y{{!Zqd');
define('SECURE_AUTH_SALT', '[[6>(OSRp?5*&l@pr3)*]P3q7@;dLiqH<z*~erQ(zb}*g4TFF.n,in8So|RQoodD');
define('LOGGED_IN_SALT',   '|<C]47p)N6nz{GwC$!g.KLKzy:~|vP,Us1,H@,%cqG<m5~QIt!:20)uoVF=[Q=/%');
define('NONCE_SALT',       ')R(  lv-nh44c_12xUV!n^d^3_V0f92x2O)@4~S&+L|30FCF4ZxJUL1Veb3?05Ki');

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the Codex.
 *
 * @link https://codex.wordpress.org/Debugging_in_WordPress
 */
define('WP_DEBUG', false);

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

define( 'WP_MEMORY_LIMIT', '256M' );
define( 'WP_MAX_MEMORY_LIMIT', '256M' );

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');
