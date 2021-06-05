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

defined('_JEXEC') or die;

/**
 * Content article class.
 *
 * @since  1.6.0
 */

class TZ_Plus_GalleryControllerGallery extends JControllerForm
{
    /**
     * Method to save a record.
     *
     * @param   string  $key     The name of the primary key of the URL variable.
     * @param   string  $urlVar  The name of the URL variable if different from the primary key (sometimes required to avoid router collisions).
     *
     * @return  boolean  True if successful, false otherwise.
     *
     * @since   1.6
     */
    public function save($key = null, $urlVar = 'id')
    {
        $app   = \JFactory::getApplication();
        $model = $this->getModel();
        $table = $model->getTable();
        $data  = $this->input->post->get('jform', array(), 'array');

        // Determine the name of the primary key for the data.
        if (empty($key))
        {
            $key = $table->getKeyName();
        }

        if (!$data[$key]) $data[$key] = null;

        // Validate the posted data.
        // Sometimes the form needs some posted data, such as for plugins and modules.
        $form = $model->getForm($data, false);

        if (!$form)
        {
            $app->enqueueMessage($model->getError(), 'error');

            return false;
        }

        // Test whether the data is valid.
        $validData = $model->validate($form, $data);

        // Check for validation errors.
        if ($validData === false)
        {
            // Redirect back to the edit screen.
            $this->setRedirect(
                $model->getState('return_page')
            );

            return false;
        }
        // Attempt to save the data.
        if (!$model->save($validData))
        {
            // Redirect back to the edit screen.
            $this->setError(\JText::sprintf('JLIB_APPLICATION_ERROR_SAVE_FAILED', $model->getError()));
            $this->setMessage($this->getError(), 'error');

            $this->setRedirect(
                $model->getState('return_page')
            );

            return false;
        }

        $this->setRedirect(
            $model->getState('return_page')
        );


        // Invoke the postSave method to allow for the child class to access the model.
        $this->postSaveHook($model, $validData);

        return true;
    }

    /**
     * Method to cancel an edit.
     *
     * @param   string  $key  The name of the primary key of the URL variable.
     *
     * @return  boolean  True if access level checks pass, false otherwise.
     *
     * @since   1.6
     */
    public function cancel($key = 'id')
    {
        $model = $this->getModel();

        $this->setRedirect($model->getState('return_page'));
    }

    /**
     * Method to cancel an edit.
     *
     * @param   string  $key  The name of the primary key of the URL variable.
     *
     * @return  boolean  True if access level checks pass, false otherwise.
     *
     * @since   1.6
     */
    public function delete($key = 'id')
    {
        $model = $this->getModel();
        $model->delete($key);

        $this->setRedirect($model->getState('return_page'));
    }
}
