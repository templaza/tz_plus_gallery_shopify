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

// Register helper class
JLoader::register('TZ_Plus_GalleryHelper', dirname(__FILE__) . '/helpers/tz_plus_gallery.php');

// Access check.
if (!JFactory::getUser()->authorise('core.manage', 'com_tz_plus_gallery')) {
    return JError::raiseWarning(404, JText::_('JERROR_ALERTNOAUTHOR'));
}

// Execute the task.
$controller	= JControllerLegacy::getInstance('TZ_Plus_Gallery');
$controller->execute(JFactory::getApplication()->input->get('task'));

$controller->redirect();