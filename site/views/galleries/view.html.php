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

class TZ_Plus_GalleryViewGalleries extends JViewLegacy{
    protected $data         =   null;
    protected $state        =   null;
    protected $action       =   null;

    public function display($tpl = null){
    	$doc    =   JFactory::getDocument();
	    JHtml::_('jquery.framework');
	    $doc->addStyleSheet('components/com_tz_plus_gallery/css/style.css');
	    $doc->addScript('components/com_tz_plus_gallery/js/main.js');
	    $this->data         =   $this->get('Data');
	    $this->action       =   $this->get('CurrentURL');
	    $this->state        =   $this->get('State');
        parent::display($tpl);
    }
}