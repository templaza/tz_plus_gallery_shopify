<?php
/**
 * @package     Joomla.Site
 * @subpackage  com_content
 *
 * @copyright   Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

use Joomla\CMS\MVC\Model\AdminModel;
use Shopify\Framework;
use PHPShopify\AuthHelper;
use Joomla\Utilities\ArrayHelper;

/**
 * Content Component Article Model
 *
 * @since  1.5
 */
class TZ_Plus_GalleryModelGallery extends AdminModel
{
	/**
	 * Model typeAlias string. Used for version history.
	 *
	 * @var        string
	 */
	public $typeAlias = 'com_tz_plus_gallery.form';

    /**
     * Constructor
     *
     * @since  1.5
     */
    public function __construct()
    {
        parent::__construct();
        $app = \JFactory::getApplication('site');
        $app -> input -> set('tmpl','component');
        $config         =   TZ_Plus_GalleryHelperShopify::getConfig($this->getState('shop'));
        if (!Framework::checkAuthorized($config)) {
            $app->redirect($this->getState('return_page'));
        }
    }

	/**
	 * Method to auto-populate the model state.
	 *
	 * Note. Calling getState in this method will result in recursion.
	 *
	 * @return  void
	 *
	 * @since   1.6
	 */
	protected function populateState()
	{
		$app = \JFactory::getApplication();

		// Load the parameters.
		$params = $app->getParams();
		$this->setState('params', $params);

		// Load state from the request.
		$pk = $app->input->getInt('id');

		$this->setState('gallery.id', $pk);
        $this->setState('shop', $app -> input -> get('shop', ''));
        $this->setState('type', $app -> input -> get('type', ''));
        $data   =   $_GET;
        unset($data['view']);
        unset($data['type']);
        unset($data['id']);
        $query  =   $app -> input -> get('query', '');
        if (!$query) {
            $query      =   AuthHelper::buildQueryString($data);
        } else {
            $query      =   base64_decode($query);
        }
        $this->setState('query', base64_encode($query));
        if ($query) $query = '&'.$query;
        $menu           =   $app->getMenu();
        $Itemid		    =   0;
        $menugalleries  =   $menu->getItems('link', 'index.php?option=com_tz_plus_gallery&view=galleries');
        if ($menugalleries) $Itemid    =   $menugalleries[0]->id;
        $this->setState('return_page', JRoute::_('index.php?option=com_tz_plus_gallery&view=galleries'.$query.'&Itemid='.$Itemid));
	}

    /**
     * Method to get article data.
     *
     * @param   integer  $itemId  The id of the article.
     *
     * @return  mixed  Content item data object on success, false on failure.
     */
    public function getItem($itemId = null)
    {
        $app = \JFactory::getApplication();
        $itemId = (int) (!empty($itemId)) ? $itemId : $this->getState('gallery.id');

        // Get a row instance.
        $table = $this->getTable();

        // Attempt to load the row.
        $return = $table->load($itemId);

        // Check for a table object error.
        if ($return === false && $table->getError())
        {
            $this->setError($table->getError());

            return false;
        }

        $properties = $table->getProperties(1);
        $value = ArrayHelper::toObject($properties, 'JObject');

        if (!$value->shop_id) {
            $config             =   TZ_Plus_GalleryHelperShopify::getConfig($this->getState('shop'));
            $value->shop_id     =   Framework::getShopID($config);
        }
        $options                =   json_decode($value->options, true);
        $value->options_color   =   isset($options['color']) ? $options['color'] : '';
        $value->options_padding =   isset($options['padding']) ? $options['padding'] : '';
        $value->custom_css      =   isset($options['custom_css']) ? $options['custom_css'] : '';
        if (isset($options['columns'])) {
            $value->col_lg      =   $options['columns']['col_lg'];
            $value->col_md      =   $options['columns']['col_md'];
            $value->col_sm      =   $options['columns']['col_sm'];
            $value->col_xs      =   $options['columns']['col_xs'];
        }

        if (!$value->data_type) $value->data_type = $app -> input -> get('type', '');
        return $value;
    }

    public function getTable ($type = 'Galleries', $prefix = 'TZ_Plus_GalleryTable', $config = array()) {
	    return parent::getTable($type, $prefix, $config);
    }

    /**
     * Method to get the record form.
     *
     * @param   array    $data      Data for the form.
     * @param   boolean  $loadData  True if the form is to load its own data (default case), false if not.
     *
     * @return  JForm|boolean  A JForm object on success, false on failure
     *
     * @since   1.6
     */
    public function getForm($data = array(), $loadData = true)
    {
        // Get the form.
        $form = $this->loadForm('com_tz_plus_gallery.'.$this->getName(), $this->getName(), array('control' => 'jform', 'load_data' => $loadData));

        if (empty($form))
        {
            return false;
        }
        return $form;
    }

	/**
	 * Method to save the form data.
	 *
	 * @param   array  $data  The form data.
	 *
	 * @return  boolean  True on success.
	 *
	 * @since   3.2
	 */
	public function save($data)
	{
		// Edit re-config data
        $options            =   array(
            'color'         =>  $data['options_color'],
            'padding'       =>  $data['options_padding'],
            'custom_css'    =>  $data['custom_css'],
            'columns'       =>  array(
                'col_lg'    =>  $data['col_lg'],
                'col_md'    =>  $data['col_md'],
                'col_sm'    =>  $data['col_sm'],
                'col_xs'    =>  $data['col_xs'],
            )
        );
        $data['options']    =   json_encode($options);


        if (!isset($data['id'])) {
            $data['created'] = date('Y-m-d H:i:s');
            $data['modified'] = date('Y-m-d H:i:s');
        } else {
            $data['modified'] = date('Y-m-d H:i:s');
        }
        $config         =   TZ_Plus_GalleryHelperShopify::getConfig($this->getState('shop'));
        $shopify    =   Framework::getShopify($config);
        if ($shopify) {
            if (isset($data['page_id']) && $data['page_id'])  {
                $page_data  =   array (
                    "id" => $data['page_id'],
                    "body_html" => TZ_Plus_GalleryHelperShopify::getPageData($data),
                    "title" => $data['title']
                );
                $shopify->Page->put($page_data);
            } else {
                $page_data  =   array (
                    "title" => $data['title'],
                    "body_html" => TZ_Plus_GalleryHelperShopify::getPageData($data)
                );
                $page   =   $shopify->Page->post($page_data);
                $data['page_id']    =   $page['id'];
            }

        }
        unset($data['options_color']);
        unset($data['options_padding']);
        unset($data['custom_css']);
        unset($data['col_lg']);
        unset($data['col_md']);
        unset($data['col_sm']);
        unset($data['col_xs']);
		return parent::save($data);
	}

    public function delete(&$pks)
    {
        // Edit re-config data
        $app = \JFactory::getApplication();
        $pk  = $app -> input->post->get($pks);
        $table = $this->getTable();
        if ($table->load($pk)) {
            $properties = $table->getProperties(1);
            $value = ArrayHelper::toObject($properties, 'JObject');
            $config         =   TZ_Plus_GalleryHelperShopify::getConfig($this->getState('shop'));
            $shopify    =   Framework::getShopify($config);
            if ($shopify) {
                if (isset($value->page_id) && $value->page_id)  {
                    $page_data  =   array (
                        "id" => $value->page_id
                    );
                    $shopify->Page->delete($page_data);
                }
            }
            if (!$table->delete($pk))
            {
                $this->setError($table->getError());
                return false;
            }
        }
        // Clear the component's cache
        $this->cleanCache();
        return true;
    }
}
