<?php
/**
 * @package   Shopify Framework
 * @author    TemPlaza https://www.templaza.com
 * @copyright Copyright (C) 2009 - 2020 TemPlaza.
 * @license https://www.gnu.org/licenses/gpl-2.0.html GNU/GPLv2 or Later
 */
defined('_JEXEC') or die;

/**
 * Jollyany system plugin
 *
 * @since  1.6.0
 */

class plgShopifyTZPlusGallery extends JPlugin {
    protected $app;
    public function onAfterShopifySave(&$config, &$shopify) {
        $script_data  =   array (
            "event" => 'onload',
            "src" => \JUri::base().'media/tz_plus_gallery/js/script.min.js',
            "cache" => true
        );
        $shopify->ScriptTag->post($script_data);
    }
}