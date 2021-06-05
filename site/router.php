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
 * Routing class of com_content
 *
 * @since  3.3
 */
class TZ_Plus_GalleryRouter extends JComponentRouterView
{
    protected $noIDs = false;

    /**
     * Content Component router constructor
     *
     * @param   JApplicationCms  $app   The application object
     * @param   JMenu            $menu  The menu object to work with
     */
    public function __construct($app = null, $menu = null)
    {
        $galleries = new JComponentRouterViewconfiguration('galleries');
        $this->registerView($galleries);
        $gallery = new JComponentRouterViewconfiguration('gallery');
        $this->registerView($gallery);

        parent::__construct($app, $menu);

        $this->attachRule(new JComponentRouterRulesMenu($this));
        $this->attachRule(new JComponentRouterRulesStandard($this));
        $this->attachRule(new JComponentRouterRulesNomenu($this));
    }
}