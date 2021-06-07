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
 * HTML Article View class for the Content component
 *
 * @since  1.5
 */
class TZ_Plus_GalleryViewShop extends JViewLegacy
{
	protected $action;

	/**
	 * Should we show a captcha form for the submission of the article?
	 *
	 * @var   bool
	 * @since 3.7.0
	 */
	protected $captchaEnabled = false;

	/**
	 * Execute and display a template script.
	 *
	 * @param   string  $tpl  The name of the template file to parse; automatically searches through the template paths.
	 *
	 * @return  mixed  A string if successful, otherwise an Error object.
	 */
	public function display($tpl = null)
	{
        $app = \JFactory::getApplication('site');
        $menu           =   $app->getMenu();
        $Itemid		    =   0;
        $menugalleries  =   $menu->getItems('link', 'index.php?option=com_tz_plus_gallery&view=galleries');
        if ($menugalleries) $Itemid    =   $menugalleries[0]->id;
        $this->action = JRoute::_('index.php?option=com_tz_plus_gallery&view=galleries&Itemid='.$Itemid);
		parent::display($tpl);
	}
}
