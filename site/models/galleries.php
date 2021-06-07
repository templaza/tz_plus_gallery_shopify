<?php
/*------------------------------------------------------------------------

# TZ Plus Gallery

# ------------------------------------------------------------------------

# Author:    Sonny

# Copyright: Copyright (C) 2011-2019 tzportfolio.com. All Rights Reserved.

# @License - http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL

# Website: http://www.templaza.com

# Technical Support:  Forum - http://templaza.com/forum

# Family website: http://www.templaza.com

-------------------------------------------------------------------------*/

// no direct access
defined('_JEXEC') or die;

use Shopify\Framework;
use PHPShopify\AuthHelper;

class TZ_Plus_GalleryModelGalleries extends JModelLegacy{

	/**
	 * Context string for the model type.  This is used to handle uniqueness
	 * when dealing with the getStoreId() method and caching data structures.
	 *
	 * @var    string
	 * @since  1.6
	 */
	protected $context      =   'com_tz_plus_gallery.galleries';

	/**
	 * API Data
	 * @var null
	 */
	protected $currentUrl    =   null;

	/**
	 * Constructor
	 *
	 * @since  1.5
	 */
	public function __construct()
	{
		parent::__construct();
		$app = \JFactory::getApplication('site');
        $menu           =   $app->getMenu();
		$app -> input -> set('tmpl','component');
        $shop           =   $this->getState('shop');
        if (!$shop) {
            $Itemid		    =   0;
            $menuShop  =   $menu->getItems('link', 'index.php?option=com_tz_plus_gallery&view=shop');
            if ($menuShop) $Itemid    =   $menuShop[0]->id;
            $app->redirect(JRoute::_('index.php?option=com_tz_plus_gallery&view=shop&Itemid='.$Itemid));
            return false;
        }
        $params         =   $app->getParams();
        $Itemid		    =   0;
        $menugalleries  =   $menu->getItems('link', 'index.php?option=com_tz_plus_gallery&view=galleries');
        if ($menugalleries) $Itemid    =   $menugalleries[0]->id;
        $this->currentUrl = JRoute::_('index.php?option=com_tz_plus_gallery&view=galleries&Itemid='.$Itemid);
		$config         =   TZ_Plus_GalleryHelperShopify::getConfig();
		$config['ShopUrl'] = $shop;
        $this->setState('apiKey', $config['ApiKey']);
        if (Framework::init($config, $params->get('scopes',''), JRoute::_('index.php?option=com_tz_plus_gallery&view=galleries&get_token=1&Itemid='.$Itemid, false, 1))) {
        }
	}

	/**
	 * Method to auto-populate the model state.
	 *
	 * Note. Calling getState in this method will result in recursion.
	 *
	 * @since   1.6
	 *
	 * @return void
	 */
	protected function populateState()
	{
		$app = JFactory::getApplication('site');
		$this->setState('shop', $app -> input -> get('shop', ''));
		$this->setState('query', base64_encode(AuthHelper::buildQueryString($_GET)));
	}

    /**
     * Return data ready to use
     * @return object|bool
     */
    public function getData () {
        $db     =   $this -> getDbo();
        $config =   Framework::getConfig();
        $query  =   $db -> getQuery(true);
        $query ->   select('*');
        $query ->   from($db->quoteName('#__tz_plus_galleries'));
        $query ->   where('shop_id='.$db -> quote($config['ShopId']));
        $db    ->   setQuery($query);
        $rows   =   $db -> loadObjectList();
        if (count($rows)) {
            foreach ($rows as &$row) {
                $row->shortcode = $this->getPageData($row);
            }
        }
        return $rows;
    }

    public function getCurrentURL () {
        return $this->currentUrl;
    }

    public function getPageData($row = null) {
        $data                       =   (array) $row;
        $data['description']        =   '';
        $options                    =   json_decode($data['options'],true);
        $data['options_color']      =   $options['color'];
        $data['options_padding']    =   $options['padding'];
        $data['custom_css']         =   $options['custom_css'];
        $data['col_lg']             =   $options['columns']['col_lg'];
        $data['col_md']             =   $options['columns']['col_md'];
        $data['col_sm']             =   $options['columns']['col_sm'];
        $data['col_xs']             =   $options['columns']['col_xs'];
        return TZ_Plus_GalleryHelperShopify::getPageData($data);
    }
}