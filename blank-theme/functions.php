<?php
add_theme_support("title-tag");
if(!isset($content_width)) {$content_width = 900;}
add_filter('show_admin_bar', '__return_false');
function viewport_meta() { ?><meta name="viewport" content="width=device-width, initial-scale=1.0"/><?php }
add_filter('wp_head', 'viewport_meta');

function f3_enqueue() {
	wp_enqueue_style('style', get_template_directory_uri().'/style.css', 1.0);
	wp_enqueue_style('base', get_template_directory_uri().'/css/base.css', array('style'), 1.0);
	wp_register_style('home', get_template_directory_uri().'/css/home.css', array('base'), 1.0);
	if(is_front_page()) wp_enqueue_style('home');
	
	wp_enqueue_script("jquery");
	wp_enqueue_script('f3',get_template_directory_uri().'/js/f3.js',array('jquery'),1.0,true);
}
add_action('wp_enqueue_scripts', 'f3_enqueue');

function remove_menus() {
	remove_menu_page('edit.php');                   //Posts
	remove_menu_page('edit-comments.php');          //Comments
}
add_action('admin_menu', 'remove_menus', 11);

// magic, remove on production
// function change_url($value, $option) {
// 	include __DIR__ . '/config.php';
// 	return $url;
// }
// add_filter('option_siteurl', 'change_url', 10, 2);
// add_filter('option_home', 'change_url', 10, 2);
// add_filter(
//   'template_directory_uri',
//   function($template_dir_uri, $template, $theme_root_uri) {
//   	include __DIR__ . '/config.php';
//   	return $url . '/wp-content/themes/' . $template;
//   },
//   10, 3
// );
