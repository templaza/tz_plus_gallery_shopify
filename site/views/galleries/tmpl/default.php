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
<script src="https://cdn.shopify.com/s/assets/external/app.js"></script>
<script type="text/javascript">
    !function($){
        "use strict";
        ShopifyApp.init({
            apiKey: "<?php echo $this->state->get('apiKey'); ?>",
            shopOrigin: "<?php echo 'https://' . $this->state->get('shop'); ?>",
            forceRedirect: true
        });
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
                    <td>
                        <a class="uk-button uk-button-default uk-button-small" href="#howtoshow<?php echo $row->id; ?>" uk-toggle>How to Show</a>
                        <div id="howtoshow<?php echo $row->id; ?>" class="uk-flex-top uk-modal-container" uk-modal>
                            <div class="uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
                                <button class="uk-modal-close-default" type="button" uk-close></button>
                                <h3>Basic</h3>
                                <ul class="uk-list uk-list-decimal">
                                    <li>Go to <b>admin</b> >> <b>Online Store</b> >> <b>Navigation</b> >> Choose your main menu</li>
                                    <li>Select a menu >> Click <b>"Add menu item"</b> >> <b>Link</b> >> Choose <b>"Pages"</b> >> Select <b>"<?php echo $row->title; ?>"</b> album</li>
                                    <li>Click <b>"Add"</b> >> <b>Save menu</b> and go to Front-store to check your album</li>
                                </ul>
                                <h3>Advanced</h3>
                                <ul class="uk-list uk-list-decimal">
                                    <li>
                                        <p>Copy this code to your clipboard and choose one of the methods below.</p>
                                        <p><textarea class="uk-textarea tz-shortcode" rows="5" readonly="readonly" onclick="this.focus();this.select()"><?php echo $row->shortcode; ?></textarea></p>
                                    </li>
                                    <li>
                                        <p><b>Method A:</b> Use your theme editor to add album code, check this <a href="https://www.youtube.com/watch?v=FbeeVDeN1Ek" target="_blank">video for Debut Theme</a>. Other Themes should be similar.</p>
                                        <p><b>Method B:</b> Open your homepage file here: <a href="#" onclick="ShopifyApp.redirect('/themes/current/?key=templates/index.liquid');">index.liquid</a> and paste the code after all the existing code, press "Save" and you're done! </p>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </td>
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
        <div class="learn-more uk-margin-medium uk-text-center"><span uk-icon="info"></span> Learn more about <a href="#howtoshow" uk-toggle>TZ Plus Gallery</a></div>
        <div id="howtoshow" class="uk-flex-top uk-modal-container" uk-modal>
            <div class="uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
                <button class="uk-modal-close-default" type="button" uk-close></button>
                <h3>Read documentation</h3>
                <p>Go to <a href="https://shopifystyles.com/blog/tz-plus-gallery" target="_blank">our documentation page</a> to know how to setup your album</p>
                <hr />
                <h3>Change main color of album</h3>
                <p>Click to <strong>your album</strong> and set your favorite color at <strong>Box Color</strong></p>
                <hr />
                <h3>Configure space between pictures</h3>
                <p>Click to <strong>your album</strong> and set distance at <strong>Album Padding</strong> option. For example: 10px</p>
                <hr />
                <h3>If you want to set custom css for your album</h3>
                <p>Click to <strong>your album</strong> and set your css at <strong>Custom CSS</strong> option.</p>
                <hr />
                <h3>Which is code to remove in case the app is not uninstalled successfully?</h3>
                <ul>
                    <li>Go to <a href="#" onclick="ShopifyApp.redirect('/pages');">Pages</a> menu and delete all of pages which related to TZ Plus Gallery.</li>
                    <li>Find & delete all tag with class "plusgallery" <code>&lt;div class="plusgallery"...&gt; &lt;/div&gt;</code> in <a href="#" onclick="ShopifyApp.redirect('/themes/current');">liquid files of your theme</a></li>
                    <li>Find & delete all tag with class "plusgallery" <code>&lt;div class="plusgallery"...&gt; &lt;/div&gt;</code> in your theme editor. Check this <a href="https://www.youtube.com/watch?v=R9cXHLRSA8A" target="_blank">video for Debut theme</a>. Other Themes should be similar.</li>
                </ul>
                <hr />
                <h3>Get a trouble or need a hand to setup your site</h3>
                <p>If you need support drop me an email to <a href="mailto:sonlv@templaza.com" target="_top">sonlv@templaza.com</a>.</p>
            </div>
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
