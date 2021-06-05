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
JTable::addIncludePath(JPATH_COMPONENT_ADMINISTRATOR.DIRECTORY_SEPARATOR.'com_tz_plus_gallery'.DIRECTORY_SEPARATOR.'tables');

class TZ_Plus_GalleryModelLicenses extends JModelList{

    public function __construct($config = array())
    {
        if (empty($config['filter_fields']))
        {
            $config['filter_fields'] = array(
                'id','b.id',
                'purchase_code','b.purchase_code',
                'license_type','b.license_type',
                'purchase_date','b.purchase_date',
                'itemid','b.itemid',
	            'status','b.status'
            );
        }

        parent::__construct($config);
    }

    protected function populateState($ordering = null, $direction = null)
    {
        $search = $this->getUserStateFromRequest($this->context . '.filter.search', 'filter_search');
        $this->setState('filter.search', $search);

        $published = $this->getUserStateFromRequest($this->context . '.filter.status', 'filter_status', '');
        $this->setState('filter.status', $published);

        parent::populateState($ordering, $direction);
    }

    protected function getStoreId($id = '')
    {
        // Compile the store id.
        $id .= ':' . $this->getState('filter.search');
        $id .= ':' . $this->getState('filter.published');

        return parent::getStoreId($id);
    }

    protected function getListQuery()
    {
        // Create a new query object.
        $db     = $this->getDbo();
        $query  = $db->getQuery(true);
        $user   = JFactory::getUser();

        $query -> select('*');
        $query -> from('#__tz_envato_manager');

        // Filter by published state
        $published = $this->getState('filter.status');
        if (is_numeric($published))
        {
            $query->where('status = ' . (int) $published);
        }
        elseif ($published === '')
        {
            $query->where('(status IN (0, 1))');
        }

        // Filter by search in title
        $search = $this->getState('filter.search');

        if (!empty($search))
        {
            if (stripos($search, 'id:') === 0)
            {
                $query->where('id = ' . (int) substr($search, 3));
            }
            else
            {
                $search = $db->quote('%' . str_replace(' ', '%', $db->escape(trim($search), true) . '%'));
                $query->where('(purchase_code LIKE ' . $search . ')');
            }
        }

        // Add the list ordering clause
        $listOrdering = $this->getState('list.ordering', 'id');
        $listDirn = $db->escape($this->getState('list.direction', 'DESC'));

        $query->order($db->escape($listOrdering) . ' ' . $listDirn);
        return $query;
    }
    public function publish() {
	    $app = JFactory::getApplication();
	    $task = $app->input->post->get('task');
	    $id = (int)$app->input->post->get('cid');
	    $tblManager                     =   JTable::getInstance('Manager', 'TZ_Plus_GalleryTable');
	    $tblManager->load($id);
	    switch ($task) {
		    case 'licenses.unpublish':
		    	$tblManager->status =  0;
		    	break;
		    case 'licenses.publish':
			    $tblManager->status =  1;
			    break;
		    case 'licenses.trash':
		    	$tblManager->status =  -1;
		    	break;
	    }
	    $tblManager->store();
    }
}