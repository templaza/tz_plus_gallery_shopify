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

class TZ_Plus_GalleryHelper extends JHelperContent{

    public static function addSubmenu($vName)
    {
        JHtmlSidebar::addEntry(
            JText::_('COM_TZ_PLUS_GALLERY_MANAGER'),
            'index.php?option=com_tz_plus_gallery&view=licenses',
            $vName == 'licenses'
        );
    }
}