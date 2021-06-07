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
 * Content Component Route Helper.
 *
 * @since  1.5
 */
abstract class TZ_Plus_GalleryHelperShopify
{
    public static function getConfig($shopUrl = '')
    {
        $app = \JFactory::getApplication('site');
        $params         =   $app->getParams();
        return array(
            'ShopUrl'       => $shopUrl,
            'ApiKey'        => $params->get('apikey',''),
            'SharedSecret'  => $params->get('secret',''),
            'AppName'       => 'tz_plus_gallery'
        );
    }

    public static function getPageData($data) {
        $content    =   '';
        $content    .=  $data['description'];
        $general_data   =   'data-col-lg="'.$data['col_lg'].'" data-col-md="'.$data['col_md'].'" data-col-sm="'.$data['col_sm'].'" data-col-xs="'.$data['col_xs'].'" data-padding="'.$data['options_padding'].'" data-color="'.$data['options_color'].'" data-custom="'.preg_replace('/\s+/is',' ',$data['custom_css']).'"';
        if ($data['data_type'] == 'facebook' || $data['data_type'] == 'flickr') {
            $f_content   =   '';
            switch ($data['album_type']) {
                case 'single_album' :
                    $f_content    .=  'data-album-id="'.$data['album_id'].'"';
                    break;
                case 'multi_album':
                    $f_content    .=  'data-include="'.$data['album_include'].'" data-exclude="'.$data['album_exclude'].'" data-album-limit="'.$data['data_limit'].'" data-album-title="true"';
                    break;
                case 'all_album':
                    $f_content    .=  'data-album-limit="'.$data['data_limit'].'"';
                    break;
            }
            if ($data['data_type'] == 'facebook') {
                $content    .=  '<div class="plusgallery" data-userid="'.$data['data_userid'].'" '.$f_content.' data-limit="'.$data['album_limit'].'" data-access-token="'.$data['access_token'].'" '.$general_data.' data-type="facebook"></div>';
            } else {
                $content    .=  '<div class="plusgallery" data-userid="'.$data['data_userid'].'" '.$f_content.' data-limit="'.$data['album_limit'].'" data-api-key="'.$data['data_api_key'].'" '.$general_data.' data-type="flickr"></div>';
            }
        } else {
            $content    .=  '<div class="plusgallery" data-userid="'.$data['data_userid'].'" data-limit="'.$data['album_limit'].'" data-access-token="'.$data['access_token'].'" '.$general_data.' data-type="instagram"></div>';
        }
        return $content;
    }
}
