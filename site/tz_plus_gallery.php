<?php
/*------------------------------------------------------------------------

# TZ Envato License Extension

# ------------------------------------------------------------------------

# Author:    Sonny

# Copyright: Copyright (C) 2011-2017 tzportfolio.com. All Rights Reserved.

# @License - http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL

# Website: http://www.tzportfolio.com

# Technical Support:  Forum - http://tzportfolio.com/forum

# Family website: http://www.templaza.com

-------------------------------------------------------------------------*/

// no direct access
defined('_JEXEC') or die;
JLoader::registerNamespace('Shopify', JPATH_LIBRARIES . '/shopify/framework/library/shopify', false, false, 'psr4');
JLoader::registerNamespace('PHPShopify', JPATH_LIBRARIES . '/shopify/framework/library/PHPShopify', false, false, 'psr4');
JLoader::register('TZ_Plus_GalleryHelperShopify', JPATH_SITE . '/components/com_tz_plus_gallery/helpers/shopify.php');

$controller = \JControllerLegacy::getInstance('TZ_Plus_Gallery');
$controller->execute(\JFactory::getApplication() -> input -> get('task'));
$controller->redirect();