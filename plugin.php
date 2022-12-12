<?php
/**
 * Plugin Name:       Book Review Variations
 * Plugin URI:        https://github.com/justintadlock/book-review-variations
 * Description:       A book custom post type with a Query Loop variation.
 * Version:           1.0.0
 * Requires at least: 6.1
 * Requires PHP:      7.4
 */

add_action( 'enqueue_block_editor_assets', function() {
	$path = untrailingslashit( __DIR__ );
	$url  = untrailingslashit( plugins_url( '', __FILE__ ) );

	$assets_file = "{$path}/build/index.asset.php";

	if ( file_exists( $assets_file ) ) {
		$assets = include $assets_file;

		wp_enqueue_script(
			'book-review-var',
			"{$url}/build/index.js",
			$assets['dependencies'],
			$assets['version'],
			true
		);
	}
} );

add_filter( 'rest_post_query', function( $args, $request ) {

	$rating = $request->get_param( 'starRating' );

	if ( $rating ) {
		$args['meta_key'] = 'rating';
		$args['meta_value'] = absint( $rating );
	}

	return $args;
}, 10, 2 );

add_filter( 'pre_render_block', function( $pre_render, $parsed_block ) {

	if ( 'book-reviews' === $parsed_block['attrs']['namespace'] ) {

		add_filter(
			'query_loop_block_query_vars',
			function( $query, $block ) use ( $parsed_block ) {

				if ( $parsed_block['attrs']['query']['starRating'] ) {
					$query['meta_key'] = 'rating';
					$query['meta_value'] = absint( $parsed_block['attrs']['query']['starRating'] );
				}

				return $query;
			},
			10,
			2
		);
	}

	return $pre_render;
}, 10, 2 );
