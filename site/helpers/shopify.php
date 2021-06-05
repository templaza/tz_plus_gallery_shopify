<?php
/**
 * @package     Joomla.Site
 * @subpackage  com_content
 *
 * @copyright   Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

/**
 * Content Component Route Helper.
 *
 * @since  1.5
 */
abstract class TZ_Plus_GalleryHelperShopify
{
    public static function getConfig($shopUrl = '')
    {
        $app = \JFactory::getApplication('site');
        $params         =   $app->getParams();
        return array(
            'ShopUrl'       => $shopUrl,
            'ApiKey'        => $params->get('apikey',''),
            'SharedSecret'  => $params->get('secret',''),
            'AppName'       => 'tz_plus_gallery'
        );
    }
}
