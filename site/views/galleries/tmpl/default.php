<?php
/*------------------------------------------------------------------------

# TZ Plus Gallery Extension

# ------------------------------------------------------------------------

# Author:    Sonny

# Copyright: Copyright (C) 2011-2021 shopifystyles.com. All Rights Reserved.

# @License - http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL

# Website: http://www.shopifystyles.com

# Family website: http://www.templaza.com

-------------------------------------------------------------------------*/

// no direct access
defined('_JEXEC') or die;
?>
<script type="text/javascript">
    !function($){
        "use strict";
        $('document').ready(function () {
            $('.tz-plus-gallery-delete').on('click', function (event) {
                event.preventDefault();
                var $this   =   $(this);
                UIkit.modal.confirm('This action will permanently delete your album! Are you sure?').then(function () {
                    document.tzplusgallery.task.value = 'gallery.delete';
                    document.tzplusgallery.id.value = $this.data('id');
                    document.tzplusgallery.submit();
                }, function () {
                    // console.log('Rejected.')
                });
            });
        });
    }(jQuery);
</script>
<form action="<?php echo $this->action; ?>" name="tzplusgallery" class="tz-plus-galleries" id="tz-plus-galleries" method="post" enctype="application/x-www-form-urlencoded">
    <div class="uk-container uk-container-large uk-margin-medium-top">
        <div class="uk-flex uk-flex-middle" uk-grid>
            <div class="uk-width-2-3@s"><h1 class="uk-h2">Album Manager</h1></div>
            <div class="uk-width-1-3@s uk-text-right@s">
                <a class="uk-button uk-button-primary" href="#modal-add-gallery" uk-toggle>Add Album</a>
            </div>
        </div>
        <div class="uk-card uk-card-default uk-card-body uk-margin">
            <table class="uk-table uk-table-divider">
                <thead>
                <tr>
                    <th>Title</th>
                    <th>Type</th>
                    <th>User ID</th>
                    <th>How to show</th>
                    <th>Delete</th>
                </tr>
                </thead>
                <tbody>
                <?php
                if (count($this->data)) :
                for ( $i = 0; $i < count($this->data); $i++ ) :
                    $row = $this->data[$i];
                    ?>
                <tr>
                    <td><a href="<?php echo JRoute::_('index.php?option=com_tz_plus_gallery&view=gallery&id='.$row->id.'&'.base64_decode($this->state->get('query'))); ?>"><?php echo $row->title; ?></a></td>
                    <td><span uk-icon="icon: <?php echo $row->data_type; ?>; ratio: 1.5"></span></td>
                    <td><?php echo $row->data_userid; ?></td>
                    <td><a class="uk-button uk-button-default uk-button-small" href="<?php echo JRoute::_('index.php?option=com_tz_plus_gallery&view=gallery&id='.$row->id); ?>">How to Show</a></td>
                    <td><button class="uk-button uk-button-danger tz-plus-gallery-delete" data-id="<?php echo $row->id; ?>">Delete</button></td>
                </tr>
                <?php
                endfor;
                else:
                ?>
                <tr><td colspan="5">No data available.</td></tr>
                <?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>
    <input name="task" type="hidden" value="">
    <input name="id" type="hidden" value="">
    <input name="query" type="hidden" value="<?php echo $this->state->get('query'); ?>">
    <input name="shop" type="hidden" value="<?php echo $this->state->get('shop'); ?>">
    <?php echo JHtml::_('form.token'); ?>
    <div id="modal-add-gallery" class="uk-flex-top" uk-modal>
        <div class="uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
            <button class="uk-modal-close-default" type="button" uk-close></button>
            <h2>Add Album</h2>
            <p>Please click your album type you want to create.</p>
            <div class="uk-child-width-expand@s uk-text-center" uk-grid>
                <div>
                    <a class="uk-button uk-button-primary" href="<?php echo JRoute::_('index.php?option=com_tz_plus_gallery&view=gallery&type=facebook&'.base64_decode($this->state->get('query'))); ?>" id="facebook">Facebook</a>
                </div>
                <div>
                    <a class="uk-button uk-button-primary" href="<?php echo JRoute::_('index.php?option=com_tz_plus_gallery&view=gallery&type=instagram&'.base64_decode($this->state->get('query'))); ?>" id="instagram">Instagram</a>
                </div>
                <div>
                    <a class="uk-button uk-button-primary" href="<?php echo JRoute::_('index.php?option=com_tz_plus_gallery&view=gallery&type=flickr&'.base64_decode($this->state->get('query'))); ?>" id="flickr">Flickr</a>
                </div>
            </div>
        </div>
    </div>
</form>
