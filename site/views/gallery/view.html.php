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
class TZ_Plus_GalleryViewGallery extends JViewLegacy
{
	protected $form;

	protected $item;

	protected $state;

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

		// Get model data.
		$this->state       = $this->get('State');
        $this->item        = $this->get('Item');
		$this->form        = $this->get('Form');

        $this->form->bind($this->item);
//		var_dump($this->form); die();

		parent::display($tpl);
	}
}
