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

$user       = JFactory::getUser();
$listOrder  = $this->escape($this->state->get('list.ordering'));
$listDirn   = $this->escape($this->state->get('list.direction'));
$saveOrder  = ($listOrder == 'ordering' && strtolower($listDirn) == 'asc');

if ($saveOrder)
{
    $saveOrderingUrl = 'index.php?option=com_tz_plus_gallery&task=licenses.saveOrderAjax';
    JHtml::_('sortablelist.sortable', 'bundleList', 'adminForm', strtolower($listDirn), $saveOrderingUrl, false, true);
}
?>
<form action="<?php echo JRoute::_('index.php?option=com_tz_plus_gallery&view=licenses');
    ?>" method="post" name="adminForm" id="adminForm">
    <?php if (!empty($this->sidebar)){ ?>
    <div id="j-sidebar-container" class="span2">
        <?php echo $this->sidebar; ?>
    </div>
    <div id="j-main-container" class="span10">
        <?php }else{ ?>
        <div id="j-main-container">
    <?php } ?>

        <?php
        // Search tools bar
        echo JLayoutHelper::render('joomla.searchtools.default', array('view' => $this));
        ?>
        <table class="table table-striped" id="bundleList" >
            <thead>
            <tr>
                <th width="1%" class="nowrap hidden-phone center">
                    <?php echo JHtml::_('searchtools.sort', '', 'ordering', $listDirn, $listOrder, null, 'asc', 'JGRID_HEADING_ORDERING', 'icon-menu-2'); ?>
                </th>
                <th width="1%">
                    <?php echo JHtml::_('grid.checkall'); ?>
                </th>
                <th width="1%" class="nowrap center">
                    <?php echo JHtml::_('searchtools.sort', 'JSTATUS', 'status', $listDirn, $listOrder); ?>
                </th>
                <th>
                    <?php echo JHtml::_('searchtools.sort', 'TZ_PLUS_GALLERY_PURCHASE_CODE', 'purchase_code', $listDirn, $listOrder); ?>
                </th>
                <th>
		            <?php echo JHtml::_('searchtools.sort', 'TZ_PLUS_GALLERY_PURCHASE_DATE', 'purchase_date', $listDirn, $listOrder); ?>
                </th>
                <th>
		            <?php echo JHtml::_('searchtools.sort', 'TZ_PLUS_GALLERY_SUPPORT', 'supported_until', $listDirn, $listOrder); ?>
                </th>
                <th>
		            <?php echo JHtml::_('searchtools.sort', 'TZ_PLUS_GALLERY_ITEMID', 'itemid', $listDirn, $listOrder); ?>
                </th>
                <th width="1%" class="nowrap hidden-phone">
                    <?php echo JHtml::_('searchtools.sort', 'JGRID_HEADING_ID', 'id', $listDirn, $listOrder); ?>
                </th>
            </tr>
            </thead>
            <tfoot>
            <tr>
                <td colspan="8">
                    <?php echo $this->pagination->getListFooter(); ?>
                </td>
            </tr>
            </tfoot>
            <?php if($items = $this -> items){?>
            <tbody>
            <?php foreach($items as $i => $item){
                $canCreate  = $user->authorise('core.create',     'com_tz_plus_gallery');
                $canEdit    = $user->authorise('core.edit',       'com_tz_plus_gallery');
                $canChange  = $user->authorise('core.edit.state', 'com_tz_plus_gallery');
                ?>
                <tr>
                    <td class="order nowrap center hidden-phone">
                        <?php
                        $iconClass = '';
                        if (!$canChange)
                        {
                            $iconClass = ' inactive';
                        }
                        elseif (!$saveOrder)
                        {
                            $iconClass = ' inactive tip-top hasTooltip" title="' . JHtml::_('tooltipText', 'JORDERINGDISABLED');
                        }
                        ?>
                        <span class="sortable-handler<?php echo $iconClass ?>">
                            <span class="icon-menu"></span>
                        </span>
                        <?php if ($canChange && $saveOrder) : ?>
                            <input type="text" style="display:none" name="order[]" size="5" value="<?php echo $item -> ordering; ?>" />
                        <?php endif; ?>
                    </td>
                    <td class="center">
                        <?php echo JHtml::_('grid.id', $i, $item->id); ?>
                    </td>
                    <td class="center">
                        <div class="btn-group">
                            <?php echo JHtml::_('jgrid.published', $item->status, $i, 'licenses.', $canChange); ?>
                            <?php // Create dropdown items and render the dropdown list.
                            if ($canChange)
                            {
                                JHtml::_('actionsdropdown.' . ((int) $item->status === -2 ? 'un' : '') . 'trash', 'cb' . $i, 'licenses');
                                echo JHtml::_('actionsdropdown.render', $this->escape($item->purchase_code));
                            }
                            ?>
                        </div>
                    </td>
                    <td>
	                    <strong><?php echo $this->escape($item->purchase_code); ?></strong><br />
                        <span class="small" title="<?php echo $this->escape($item->license_type); ?>">
                            <?php echo JText::sprintf('TZ_PLUS_GALLERY_LICENSE_TYPE', $this->escape($item->license_type)); ?>
                        </span>
                    </td>
                    <td><?php echo $item -> purchase_date; ?></td>
                    <td><?php echo $item -> supported_until; ?></td>
                    <td><?php echo $item -> itemid; ?></td>
                    <td><?php echo $item -> id; ?></td>
                </tr>
            <?php } ?>
            </tbody>
            <?php } ?>
        </table>
    </div>

    <input type="hidden" name="task" value="" />
    <input type="hidden" name="boxchecked" value="0" />
    <?php echo JHtml::_('form.token'); ?>
</form>