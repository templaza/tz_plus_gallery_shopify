<?php
/**
 * @package     Joomla.Site
 * @subpackage  com_content
 *
 * @copyright   Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

JHtml::_('behavior.tabstate');
JHtml::_('behavior.keepalive');
JHtml::_('behavior.formvalidator');

// Create shortcut to parameters.
$params =   $this->state->get('params');

?>
<form action="<?php echo JRoute::_('index.php?option=com_tz_plus_gallery&view=gallery'); ?>" method="post" name="adminForm" id="adminForm" class="form-validate form-vertical">
<div class="uk-container uk-container-large uk-margin-medium-top">
    <div class="uk-flex uk-flex-middle" uk-grid>
        <div class="uk-width-2-3@s"><h1 class="uk-h2">Add Album</h1></div>
        <div class="uk-width-1-3@s uk-text-right@s">
            <button type="button" class="uk-button uk-button-primary" onclick="Joomla.submitbutton('gallery.save')">
                <span uk-icon="icon: check;"></span><?php echo JText::_('JSAVE') ?>
            </button>
            <button type="button" class="uk-button uk-button-default" onclick="Joomla.submitbutton('gallery.cancel')">
                <span uk-icon="icon: close;"></span><?php echo JText::_('JCANCEL') ?>
            </button>
        </div>
    </div>
    <div class="uk-margin" uk-grid>
        <div class="uk-width-2-3@l uk-width-3-5@m">
            <div class="uk-card uk-card-default uk-card-body">
                <fieldset class="uk-fieldset">
                    <?php echo $this->form->renderField('title'); ?>
                    <?php echo $this->form->renderField('data_userid'); ?>
                    <?php if ($this->item->data_type == 'flickr') echo $this->form->renderField('data_api_key'); ?>
                    <?php if ($this->item->data_type == 'instagram' || $this->item->data_type == 'facebook') echo $this->form->renderField('access_token'); ?>
                    <?php
                    if ($this->item->data_type != 'instagram') {
                        echo $this->form->renderField('album_type');
                        echo $this->form->renderField('album_id');
                        echo $this->form->renderField('album_include');
                        echo $this->form->renderField('album_exclude');
                        echo $this->form->renderField('data_limit');
                    }
                    echo $this->form->renderField('album_limit');
                    echo $this->form->renderField('description');
                    ?>
                </fieldset>
            </div>
        </div>
        <div class="uk-width-1-3@l uk-width-2-5@m">
            <div class="uk-card uk-card-default uk-card-body">
                <fieldset class="uk-fieldset">
                    <legend class="uk-legend">Options</legend>
                    <?php echo '<div class="uk-margin">'.$this->form->renderField('options_color').'</div>'; ?>
                    <?php echo $this->form->renderField('options_padding'); ?>
                    <?php echo $this->form->renderField('custom_css'); ?>
                    <hr />
                    <legend class="uk-legend uk-margin">Responsive</legend>
                    <?php echo $this->form->renderField('col_lg'); ?>
                    <?php echo $this->form->renderField('col_md'); ?>
                    <?php echo $this->form->renderField('col_sm'); ?>
                    <?php echo $this->form->renderField('col_xs'); ?>
                </fieldset>
            </div>
        </div>
    </div>
</div>
    <?php echo $this->form->renderField('shop_id'); ?>
    <?php echo $this->form->renderField('page_id'); ?>
    <?php echo $this->form->renderField('data_type'); ?>
    <?php echo $this->form->renderField('id'); ?>
    <input type="hidden" name="task" value="" />
    <input type="hidden" name="query" value="<?php echo $this->state->get('query'); ?>" />
    <input type="hidden" name="shop" value="<?php echo $this->state->get('shop'); ?>" />
    <?php echo JHtml::_('form.token'); ?>
</form>