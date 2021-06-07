<?php
/**
 * @package     Joomla.Site
 * @subpackage  com_content
 *
 * @copyright   Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

JHtml::_('behavior.keepalive');
JHtml::_('behavior.formvalidator');

?>
<form action="<?php echo $this->action; ?>" method="post" name="adminForm" id="adminForm" class="form-validate form-vertical">
<div class="uk-container uk-container-large uk-margin-medium-top">
    <div class="uk-margin">
        <div class="uk-card uk-card-default uk-card-body">
            <fieldset class="uk-fieldset">
                <h1 class="uk-h2">Log in to your Shopify store</h1>
                <div class="uk-margin">
                    <input name="shop" type="text" class="uk-input" placeholder="yourshop.myshopify.com" required="required" />
                </div>
                <div class="uk-margin">
                    <input type="submit" class="uk-button uk-button-primary uk-button-round" value="Install" />
                </div>

            </fieldset>
        </div>
    </div>
</div>
    <?php echo JHtml::_('form.token'); ?>
</form>