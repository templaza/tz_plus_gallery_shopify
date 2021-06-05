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

class TZ_Plus_GalleryViewLicenses extends JViewLegacy{

    protected $state        = null;
    protected $items        = null;
    protected $sidebar      = null;
    protected $pagination   = null;

    public function display($tpl = null){

        TZ_Plus_GalleryHelper::addSubmenu('licenses');

        $this -> items      = $this -> get('Items');
        $this -> pagination = $this -> get('Pagination');
        $this -> state      = $this -> get('State');
        $this -> filterForm = $this -> get('FilterForm');

        $this -> addToolbar();

        $this->sidebar = JHtmlSidebar::render();

        parent::display($tpl);
    }

    protected function addToolbar(){

        $state  = $this -> state;
        $canDo  = JHelperContent::getActions('com_tz_plus_gallery');
//        var_dump($canDo->get('core.edit.state')); die();

        JToolbarHelper::title(JText::_('COM_TZ_PLUS_GALLERY_MANAGER'), 'cube');
        JToolbarHelper::addNew('license.add');
        JToolbarHelper::editList('license.edit');
        JToolbarHelper::publish('license.publish');
        JToolbarHelper::unpublish('license.unpublish');

        if ($state->get('filter.published') == -2 && $canDo->get('core.delete'))
        {
            JToolbarHelper::deleteList('JGLOBAL_CONFIRM_DELETE', 'bundles.delete', 'JTOOLBAR_EMPTY_TRASH');
        }
        elseif ($canDo->get('core.edit.state'))
        {
            JToolbarHelper::trash('license.trash');
        }
        JToolbarHelper::preferences('com_tz_plus_gallery');
    }
}