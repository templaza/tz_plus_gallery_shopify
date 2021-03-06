/**
 *------------------------------------------------------------------------------
 * @package       TZ Plus Gallery
 *------------------------------------------------------------------------------
 * @copyright     Copyright (C) 2015 TemPlaza.com. All Rights Reserved.
 * @license       GNU General Public License version 2 or later; see LICENSE.txt
 * @authors       TemPlaza
 * @Link:         http://templaza.com
 *------------------------------------------------------------------------------
 */


/*
 * +Gallery Javascript Photo gallery v0.9.4
 * http://plusgallery.net/
 *
 * Copyright 2013, Jeremiah Martin | Twitter: @jeremiahjmartin
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html

 */
if (typeof jQuery == 'undefined') {
    var tzAlert = document.createElement("div");
    var tzText = document.createTextNode("This app require jQuery. Your theme should support jQuery library");
    tzAlert.appendChild(tzText);
    document.getElementsByClassName("plusgallery")[0].appendChild(tzAlert);
}
if (!$.isFunction($.fn.plusGallery)) {
    $.ajaxSetup({ cache: false });
    // for test only
    // var cdnServer = 'https://joomla.templaza.com/shopifystyles/joomla/media/tz_plus_gallery/';
    // var cssId = 'tz_plus_gallery_css';  // you could encode the css path itself to generate id..
    // if (!document.getElementById(cssId))
    // {
    //     var head  = document.getElementsByTagName('head')[0];
    //     var link  = document.createElement('link');
    //     link.id   = cssId;
    //     link.rel  = 'stylesheet';
    //     link.type = 'text/css';
    //     link.href = cdnServer+'css/style.css';
    //     link.media = 'all';
    //     head.appendChild(link);
    // }
    /*
    SLIDEFADE
    ------------------------------------------------------------------------------------------------------*/

    /* Custom plugin for a slide/in out animation with a fade - JJM */

    (function (jQuery) {
        jQuery.fn.slideFade = function (speed, callback) {
            var slideSpeed;
            var album_class = this.selector;
            for (var i = 0; i < arguments.length; i++) {
                if (typeof arguments[i] == "number") {
                    slideSpeed  = arguments[i];
                }
                else {
                    var callBack = arguments[i];
                }
            }
            if(!slideSpeed) {
                slideSpeed = 500;
            }
            jQuery(''+album_class+'').animate({
                    opacity: 'toggle',
                    height: 'toggle'
                }, slideSpeed,
                function(){
                    if( typeof callBack != "function" ) { callBack = function(){}; }
                    callBack.call(this);
                }
            );
        };
    })( jQuery );

    (function (jQuery){
        jQuery.fn.plusGallery = function(options){
            var lmnt = this;
            if(lmnt.length === 0) { return false; }
            var pg = {
                /*user defined Defaults*/
                type: null,
                albumTitle: false, //show the album title in single album mode
                albumLimit: 10000, //Limit amout of albums to load initially.
                limit: 30, //Limit of photos to load for gallery / more that 60 is dumb, separate them into different albums
                apiKey: '', //used with Flickr
                exclude: null,
                include: null,
                imageData: null,
                col_lg: 5,
                col_md: 4,
                col_sm: 3,
                col_xs: 2,
                padding: null,
                color: '',
                custom: '',
                icon_image: '<span class="pg-icon"><svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><circle cx="16.1" cy="6.1" r="1.1"></circle><rect fill="none" stroke="#000" x=".5" y="2.5" width="19" height="15"></rect><polyline fill="none" stroke="#000" stroke-width="1.01" points="4,13 8,9 13,14"></polyline><polyline fill="none" stroke="#000" stroke-width="1.01" points="11,12 12.5,10.5 16,14"></polyline></svg></span>',
                icon_video: '<span class="pg-icon"><svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><polygon fill="none" stroke="#000" points="6.5,5 14.5,10 6.5,15"></polygon></svg></span>',

                /*don't touch*/
                imgArray: [],
                titleArray: [],
                t: '', //timer
                idx: 0,
                imgCount: 0,
                imgTotal: 0,
                winWidth: 1024, //resets
                touch: false,
                titleText: '',

                init: function(){

                    var _doc = jQuery('body');
                    //check for touch device
                    if ("ontouchstart" in document.documentElement) {
                        window.scrollTo(0, 1);
                        pg.touch = true;
                    }
                    lmnt.attr('id', 'tz_plus_gallery_'+Math.random().toString(36).substring(7));
                    pg.winWidth = jQuery(window).width();

                    //reset some shit in case there is another copy that was loaded.
                    jQuery('#pgzoomview').remove();
                    //Unbind everything first?
                    _doc.off("click", ".pgalbumlink, .pgthumbhome, .pgthumb, .plus-pagination, .pgzoomarrow, .pgzoomclose, #pgzoomview, #pgzoomslide, .pgzoomimg");

                    pg.getDataAttr();

                    pg.writeHTML();

                    if(pg.albumId
                        || pg.type == 'instagram'
                        || (pg.type == 'local' && !pg.imageData.hasOwnProperty('albums'))){
                        //load single Album
                        pg.albumTitle = false;

                        pg.loadSingleAlbum();
                    }
                    else if(pg.type == 'local') {
                        pg.parseAlbumData(pg.imageData);
                    }
                    else {
                        pg.loadAlbumData();
                    }

                    //attach loadGallery to the album links
                    _doc.off('click').on("click", ".pgalbumlink",function(e){
                        e.preventDefault();
                        jQuery(this).append('<span class="pgloading"><svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg"><circle fill="none" stroke="#fff" cx="15" cy="15" r="14"></circle></svg></span>');
                        var galleryTitle = jQuery(this).children('span').html();
                        var obj_click = jQuery(this);
                        var pg_type = obj_click.parent().parent().parent().attr('data-type');
                        if(pg_type == 'local') {
                            var galleryID = jQuery(this).attr('data-album-index').replace('http://', '').replace('//', '').replace('https://', '');
                            pg.parseData(pg.imageData.albums[galleryID],galleryTitle);
                        } else {
                            var galleryURL = this.href;
                            pg.loadGallery(galleryURL,galleryTitle,pg_type,obj_click);
                        }
                    });

                    _doc.on("click", ".pgthumbhome",function(e){
                        e.preventDefault();
                        var obj_back_click = jQuery(this);
                        var back_pg_id = "#"+obj_back_click.parent().parent().parent().attr('id');
                        jQuery(''+back_pg_id+' #pgthumbview').slideUp(700);
                        jQuery(''+back_pg_id+' #pgalbums').slideDown(700);
                    });

                    ////attach links load detail image
                    //_doc.off("click").on('click','.pgthumb',function(e){
                    //  e.preventDefault();
                    //  var idx = jQuery('.pgthumb').index(this);
                    //  pg.loadZoom(idx);
                    //});

                    //attach links load detail image
                    _doc.on('click','.pgthumb',function(e){
                        e.preventDefault();
                        var idx = jQuery(this).parent().find('.pgthumb').index(this);
                        obj = jQuery(this);
                        pg.loadZoom(idx,obj);
                    });

                    //Load more images
                    _doc.on('click','.plus-pagination',function(e){
                        e.preventDefault();
                        var loadmore = 'loadmore';
                        var parent_box = jQuery(this).parent().attr('id');
                        var next_url = jQuery('.plus-pagination').attr('data-href');

                        jQuery('.plus-pagination span').html('loading...');
                        pg.loadGallery(next_url,loadmore);
                    });


                    /*zoom events*/
                    _doc.on('click','.pgzoomarrow',function(e){
                        e.preventDefault();
                        var dir = this.rel;
                        pg.prevNext(dir);
                        return false;
                    });

                    _doc.on('click','.pgzoomclose',function(e){
                        e.preventDefault();
                        pg.unloadZoom();
                    });
                    _doc.on("click", "#pgzoomview",function(e){
                        e.preventDefault();
                        pg.unloadZoom();
                    });

                    _doc.on("click", "#pgzoomslide",function(){
                        pg.unloadZoom();
                    });

                    _doc.on("click", ".pgzoomimg",function(){
                        if(jQuery(this).attr('id').replace('pgzoomimg', '') < pg.imgTotal - 1) {
                            pg.prevNext('next');
                        }
                        return false;
                    });

                    clearTimeout(pg.t);
                },

                /*--------------------------

                  get all the user defined
                  variables from the HTML element

                ----------------------------*/
                getDataAttr: function(){
                    //Gallery Type *required
                    var dataAttr = lmnt.attr('data-type');
                    if(pg.type == null && dataAttr) {
                        pg.type = dataAttr;
                    }
                    else if ( pg.type == null ) {
                        throw('You must enter a data type.');
                    }
                    //Gallery User Id *required if not local
                    dataAttr = lmnt.attr('data-userid');
                    if(dataAttr) {
                        pg.userId = dataAttr;
                    }
                    else if(pg.type != 'local') {
                        throw('You must enter a valid User ID');
                    }
                    //Limit on the amount photos per gallery
                    dataAttr = lmnt.attr('data-limit');
                    if(dataAttr) {
                        pg.limit = dataAttr;
                        if(parseInt(pg.limit) === 0){
                            pg.limit = 100000;
                        }
                    }

                    //Limit on the amount albums
                    dataAttr = lmnt.attr('data-album-limit');
                    if(dataAttr) {
                        pg.albumLimit = dataAttr;
                        if (parseInt(pg.albumLimit) === 0) {
                            pg.albumLimit = 100000;
                        }
                    }

                    //album id to exclude
                    dataAttr = lmnt.attr('data-exclude');
                    if(dataAttr) {
                        pg.exclude = dataAttr.split(',');
                    }

                    //album ids to include
                    dataAttr = lmnt.attr('data-include');
                    if(dataAttr) {
                        pg.include = dataAttr.split(',');
                    }

                    //Api key - used with Flickr
                    dataAttr = lmnt.attr('data-api-key');
                    if(dataAttr) {
                        pg.apiKey = dataAttr;
                    }

                    //Access Token - used with instagram
                    dataAttr = lmnt.attr('data-access-token');
                    if(dataAttr) {
                        pg.accessToken = dataAttr;
                    }
                    dataAttr = lmnt.attr('data-album-id');
                    if(dataAttr) {
                        pg.albumId = dataAttr;
                        //show hide the album title if we are in single gallery mode
                        titleAttr = lmnt.attr('data-album-title');

                        if(titleAttr == 'true') {
                            pg.albumTitle = true;
                        } else {
                            pg.albumTitle = false;
                        }
                    } else{
                        pg.albumTitle = true;
                    }
                    if(pg.type==='instagram'){
                        pg.albumTitle = false;
                    }

                    dataAttr = lmnt.attr('data-credit');
                    if(dataAttr == 'false') {
                        pg.credit = false;
                    }

                    //JSON string containing image data *required only for local
                    dataAttr = lmnt.attr('data-image-data');
                    if(dataAttr) {
                        pg.imageData = JSON.parse(dataAttr);
                    }

                    //Column configure
                    dataAttr = lmnt.attr('data-col-lg');
                    if(dataAttr) {
                        pg.col_lg = dataAttr;
                    }
                    dataAttr = lmnt.attr('data-col-md');
                    if(dataAttr) {
                        pg.col_md = dataAttr;
                    }
                    dataAttr = lmnt.attr('data-col-sm');
                    if(dataAttr) {
                        pg.col_sm = dataAttr;
                    }
                    dataAttr = lmnt.attr('data-col-xs');
                    if(dataAttr) {
                        pg.col_xs = dataAttr;
                    }

                    //Padding configuration
                    dataAttr = lmnt.attr('data-padding');
                    if(dataAttr) {
                        pg.padding = dataAttr;
                    }

                    //Color configuration
                    dataAttr = lmnt.attr('data-color');
                    if(dataAttr) {
                        pg.color = dataAttr;
                    }

                    //Custom Css configuration
                    dataAttr = lmnt.attr('data-custom');
                    if(dataAttr) {
                        pg.custom = dataAttr;
                    }
                },

                /*--------------------------

                  set up the initial HTML

                ----------------------------*/
                writeHTML: function(){
                    let touchClass;
                    if(pg.touch){
                        touchClass = 'touch';
                        lmnt.addClass('touch');
                    }
                    else {
                        touchClass = 'no-touch';
                        lmnt.addClass('no-touch');
                    }

                    // add css
                    let custom_css = '';
                    if (pg.padding) {
                        custom_css += '.plusgallery .pgthumb, .plusgallery .pgalbumthumb {padding: '+pg.padding+';}';
                    }
                    if (pg.color) {
                        custom_css += '#pgzoomview a:hover {background-color: '+pg.color+';}';
                    }
                    if (pg.custom) {
                        custom_css += pg.custom;
                    }
                    let style = $('<style type="text/css" class="tz-plus-gallery-custom-css"></style>');
                    style.text(custom_css);
                    jQuery('head').append(style);
                    lmnt.append(
                        '<span class="pgloading"><svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg"><circle fill="none" stroke="#000" cx="15" cy="15" r="14"></circle></svg></span>' +
                        '<ul id="pgalbums" class="clearfix"></ul>' +
                        '<div id="pgthumbview">' +
                        '<ul id="pgthumbs" class="clearfix"></ul>' +
                        '</div>'+
                        '<div class="plus-pagination"><span>Load more</span></div>'
                    );
                    jQuery('body').prepend(
                        '<div id="pgzoomview" class="pg ' + touchClass + '">' +
                        '<a href="#" rel="close" id="pgzoomclose" title="Close"><span class="pg-icon"><svg width="32" height="32" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="#fff" stroke-width="1.06" d="M16,16 L4,4"></path><path fill="none" stroke="#fff" stroke-width="1.06" d="M16,4 L4,16"></path></svg></span></a>' +
                        '<a href="#" rel="previous" id="pgprevious" class="pgzoomarrow" title="previous"><span class="pg-icon"><svg width="48" height="48" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><polyline fill="none" stroke="#fff" stroke-width="1.03" points="13 16 7 10 13 4"></polyline></svg></span></a>' +
                        '<a href="#" rel="next" id="pgnext" class="pgzoomarrow" title="Next"><span class="pg-icon"><svg width="48" height="48" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><polyline fill="none" stroke="#fff" stroke-width="1.03" points="7 4 13 10 7 16"></polyline></svg></span></a>' +
                        '<div id="pgzoomscroll">' +
                        '<ul id="pgzoom"></ul>' +
                        '</div>' +
                        '</div>'
                    );

                    lmnt.addClass('pg');

                    // lmnt.append('<div class="pgcredit"><a href="https://apps.shopify.com/social-image-gallery" target="_blank" title="Powered by Shopifystyles">Powered by TZ Plus Gallery</a></div>');

                    if(pg.albumTitle === true) {
                        jQuery(lmnt).find('#pgthumbview').prepend('<ul id="pgthumbcrumbs" class="clearfix"><li class="pgthumbhome">&laquo;</li></ul>');
                    }
                },


                /*--------------------------

                  Parse the album data from
                  the given json string.

                ----------------------------*/
                parseAlbumData: function(json) {
                    lmnt.addClass('loaded');
                    var objPath,
                        albumTotal,
                        galleryImage,
                        galleryTitle,
                        galleryJSON;

                    switch(pg.type)
                    {
                        //have to load differently for for google/facebook/flickr
                        case 'google':

                            objPath = json.feed.entry;
                            albumTotal = objPath.length;

                            if(albumTotal > pg.albumLimit && pg.albumLimit!=0) {
                                albumTotal = pg.albumLimit;
                            }
                            if(pg.albumLimit==0){
                                albumTotal=albumTotal;
                            }

                            //remove excluded galleries if there are any.
                            //albumTotal = albumTotal - pg.exclude.length;

                            if(albumTotal > 0){
                                jQuery.each(objPath,function(i,obj){
                                    //obj is entry
                                    if(i < albumTotal){
                                        galleryTitle = obj.title.$t;
                                        galleryJSON = obj.link[0].href;
                                        galleryImage = obj.media$group.media$thumbnail[0].url;
                                        galleryImage = galleryImage.replace('s160','s512');

                                        pg.loadAlbums(galleryTitle,galleryImage,galleryJSON,i);
                                    }

                                });
                            }
                            else { //else if albumTotal == 0
                                throw('There are either no results for albums with this user ID or there was an error loading the data. \n' + galleryJSON);
                            }
                            break;
                        case 'flickr':

                            objPath = json.photosets.photoset;
                            albumTotal = objPath.length;

                            if(albumTotal > pg.albumLimit && pg.albumLimit!=0) {
                                albumTotal = pg.albumLimit;
                            }
                            if(pg.albumLimit==0){
                                albumTotal=albumTotal;
                            }

                            if(albumTotal > 0 ) {
                                jQuery.each(objPath,function(i,obj){
                                    //obj is entry
                                    if(i < albumTotal){
                                        galleryTitle = obj.title._content;
                                        galleryImage = 'https://farm' + obj.farm + '.staticflickr.com/' + obj.server + '/' + obj.primary + '_' + obj.secret + '_z.jpg';
                                        galleryJSON = 'https://api.flickr.com/services/rest/?&method=flickr.photosets.getPhotos&api_key=' + pg.apiKey + '&photoset_id=' + obj.id + '&format=json&jsoncallback=?';
                                        pg.loadAlbums(galleryTitle,galleryImage,galleryJSON);
                                    }
                                });
                            }
                            else { //else if albumTotal == 0
                                throw('There are either no results for albums with this user ID or there was an error loading the data. \n' + galleryJSON);
                            }
                            break;
                        case 'facebook':
                            objPath = json.data;
                            albumTotal = objPath.length;
                            if(albumTotal > pg.albumLimit && pg.albumLimit!=0) {
                                albumTotal = pg.albumLimit;
                            }
                            if(pg.albumLimit==0){
                                albumTotal=albumTotal;
                            }

                            if(albumTotal > 0) {
                                jQuery.each(objPath,function(i,obj){
                                    if(i < albumTotal){
                                        galleryTitle = obj.name;
                                        galleryJSON = 'https://graph.facebook.com/v10.0/' + obj.id + '/photos?limit=' + pg.limit + '&access_token=' + pg.accessToken +'&fields=images,name,link';
                                        galleryImage = 'http://graph.facebook.com/v10.0/' + obj.id + '/picture?type=album&access_token=' + pg.accessToken +'';
                                        pg.loadAlbums(galleryTitle,galleryImage,galleryJSON);
                                    }

                                });
                            }
                            else {
                                throw('There are either no results for albums with this user ID or there was an error loading the data. \n' + albumURL);
                            }
                            break;
                        case 'local':
                            objPath = json.albums;
                            albumTotal = objPath.length;

                            if(albumTotal > pg.albumLimit) {
                                albumTotal = pg.albumLimit;
                            }
                            if(pg.albumLimit==0){
                                albumTotal=albumTotal;
                            }

                            if(albumTotal > 0 ) {
                                jQuery.each(objPath,function(i,obj){
                                    //obj is entry
                                    if(i < albumTotal){
                                        galleryTitle = obj.title;
                                        galleryImage = obj.images[0].th;
                                        galleryJSON = 'http://'+i;

                                        pg.loadAlbums(galleryTitle,galleryImage,galleryJSON);
                                    }
                                });
                            }
                            else { //else if albumTotal == 0
                                throw('There are no albums available in the specified JSON.');
                            }
                            break;
                    }
                },


                /*--------------------------

                  Load up Album Data JSON
                  before Albums

                ----------------------------*/
                loadAlbumData: function() {
                    var albumURL;
                    switch(pg.type)
                    {
                        case 'google':
                            albumURL = 'http://photos.googleapis.com/data/feed/api/user/' + pg.userId + '?alt=json&kind=album&hl=en_US&max-results=' + pg.albumLimit + '&callback=?';
                            break;
                        case 'flickr':
                            albumURL = 'https://api.flickr.com/services/rest/?&method=flickr.photosets.getList&api_key=' + pg.apiKey + '&user_id=' + pg.userId + '&format=json&jsoncallback=?';
                            break;
                        case 'facebook':
                            albumURL = 'https://graph.facebook.com/v10.0/' + pg.userId + '/albums?limit=' + pg.albumLimit + '&access_token=' + pg.accessToken + '&callback=?';
                            break;
                        case 'instagram':
                            //we ain't got no albums in instagram
                            albumURL = null;
                            break;
                        case 'local':
                            // No album support yet, but url wont be needed anyway.
                            albumURL = null;
                            break;

                        default:
                            throw('Please define a gallery type.');
                    }

                    jQuery.getJSON(albumURL,function(json) {
                        pg.parseAlbumData(json);
                    });
                },


                /*--------------------------

                  Load all albums to the page

                ----------------------------*/
                loadAlbums: function(galleryTitle,galleryImage,galleryJSON) {
                    var displayAlbum = true;
                    var imgHTML;
                    //exclude albums if pg.exclude is set
                    if(pg.exclude !== null) {
                        jQuery.each(pg.exclude,function(index, value){ //exclude albums if pg.exclude is set
                            if(galleryJSON.indexOf(value) > 0){
                                displayAlbum = false;
                            }
                        });
                    }

                    //include only specified albums if pg.include is set
                    if(pg.include !== null) {
                        displayAlbum = false;
                        jQuery.each(pg.include,function(index, value){ //exclude albums if pg.exclude is set
                            if(galleryJSON.indexOf(value) > 0){
                                displayAlbum = true;
                            }
                        });
                    }

                    if (displayAlbum){
                        if (pg.type == 'facebook' || pg.type == 'flickr') {
                            imgHTML = '<img src="data:image/svg+xml;utf8,&lt;svg xmlns=&quot;http://www.w3.org/2000/svg&quot; width=&quot;640&quot; height=&quot;640&quot;&gt;&lt;/svg&gt;" style="background-image: url(' + galleryImage + ');" title="' + galleryTitle + '" title="' + galleryTitle + '" class="pgalbumimg">';
                        }
                        else {
                            imgHTML = '<img src="' + galleryImage + '" title="' + galleryTitle + '" title="' + galleryTitle + '" class="pgalbumimg">';
                        }

                        if(pg.type == 'local') {
                            jQuery('#pgalbums').append(
                                '<li class="pgalbumthumb tz-col-lg-'+pg.col_lg+' tz-col-md-'+pg.col_md+' tz-col-sm-'+pg.col_sm+' tz-col-xs-'+pg.col_xs+'">' +
                                '<a href="#" data-album-index="' + galleryJSON + '" class="pgalbumlink">' + imgHTML + '<span class="pgalbumtitle">' + galleryTitle + '</span><span class="pgplus">+</span></a>' +
                                '</li>'
                            );
                        } else {
                            jQuery(lmnt).find('#pgalbums').append(
                                '<li class="pgalbumthumb tz-col-lg-'+pg.col_lg+' tz-col-md-'+pg.col_md+' tz-col-sm-'+pg.col_sm+' tz-col-xs-'+pg.col_xs+'">' +
                                '<a href="' + galleryJSON + '" class="pgalbumlink">' + imgHTML + '<span class="pgalbumtitle">' + galleryTitle + '</span><span class="pgplus">+</span></a>' +
                                '</li>'
                            );
                        }
                    }
                }, //End loadAlbums


                /*--------------------------

                  Load all the images within
                  a specific gallery

                ----------------------------*/
                loadSingleAlbum:function(){
                    var url;
                    switch(pg.type)
                    {
                        case 'google':
                            url = 'http://photos.googleapis.com/data/feed/api/user/' + pg.userId + '/albumid/' + pg.albumId + '?alt=json&hl=en_US';
                            pg.loadGallery(url);
                            break;
                        case 'flickr':
                            url = 'https://api.flickr.com/services/rest/?&method=flickr.photosets.getPhotos&api_key=' + pg.apiKey + '&photoset_id=' + pg.albumId + '&format=json&last_update=1&jsoncallback=?';
                            pg.loadGallery(url);
                            break;
                        case 'facebook':
                            url = 'https://graph.facebook.com/v10.0/' + pg.albumId + '/photos?limit=' + pg.limit + '&access_token=' + pg.accessToken +'&fields=images,name,link';
                            pg.loadGallery(url);
                            break;
                        case 'instagram':
                            var tmp = pg.limit !== 0 && pg.limit ? '&limit=' + pg.limit : '';
                            url = 'https://graph.instagram.com/me/media?fields=caption,id,media_type,media_url,permalink,thumbnail_url,timestamp,username&access_token=' + pg.accessToken + tmp;
                            pg.loadGallery(url);
                            break;
                        case 'local':
                            pg.parseData(pg.imageData);
                            break;
                    }

                    lmnt.addClass('loaded');

                },

                /*--------------------------

                  Load all the images within
                  a specific gallery

                ----------------------------*/
                loadGallery: function(url,title,pg_type,obj_click){
                    pg.imgArray = [];
                    pg.titleArray = [];
                    jQuery('#pgzoom').empty();
                    jQuery.ajax({
                        url: url,
                        cache: false,
                        dataType: "jsonp",
                        success: function(json){
                            pg.parseData(json,title,pg_type,obj_click);
                            jQuery('.plus-pagination span').html('Load more');
                        }, //end success
                        error: function(jqXHR, textStatus, errorThrown){
                            console.log('Error: \njqXHR:' + jqXHR + '\ntextStatus: ' + textStatus + '\nerrorThrown: '  + errorThrown);
                        }
                    });
                }, //End loadGallery


                /*--------------------------

                  Parse and convert the data
                  of the gallery

                ----------------------------*/
                parseData: function(json,title,pg_type,obj_click){
                    var obPath,
                        imgTitle,
                        imgSrc,
                        imgTh,
                        imgBg = '',
                        thumbsLoaded = 0,
                        zoomWidth,
                        objUrl,
                        flickrImgExt;
                    if(obj_click){
                        var pg_ids = "#"+obj_click.parent().parent().parent().attr('id');

                        jQuery(''+pg_ids+' .crumbtitle').remove();
                        jQuery(''+pg_ids+' #pgthumbs').empty();
                    } else{
                        jQuery(lmnt).find('.crumbtitle').remove();
                        //jQuery(lmnt).find('#pgthumbs').empty();
                    }
                    if(title === undefined){
                        title = '&nbsp;';
                    }
                    if(obj_click) {
                        jQuery('' + pg_ids + ' #pgthumbcrumbs .pgthumbhome').append('<span class="crumbtitle">' + title + '</span>');
                    } else{
                        jQuery(lmnt).find('#pgthumbcrumbs .pgthumbhome').append('<span class="crumbtitle">' + title + '</span>');
                    }
                    if(!pg_type) {
                        pg_type = pg.type;
                    }
                    switch(pg_type)
                    {
                        case 'google':
                            objPath = json.feed.entry;
                            break;
                        case 'flickr':
                            objPath = json.photoset.photo;
                            break;
                        case 'facebook':
                            objPath = json.data;
                            if(json.paging){
                                objPagi = json.paging;
                                objUrl = objPagi.next;
                            }
                            break;
                        case 'instagram':
                            objPath = json.data;
                            objPagi = json.paging;
                            objUrl = objPagi.next;
                            break;
                        case 'local':
                            objPath = json.images;
                            break;
                    }
                    pg.imgTotal = objPath.length;
                    //limit the results
                    if(pg.limit < pg.imgTotal){
                        pg.imgTotal = pg.limit;
                    }
                    if(pg.limit==0){
                        pg.imgTotal = pg.imgTotal;
                    }

                    if(pg.imgTotal === 0) {
                        throw('Please check your photo permissions,\nor make sure there are photos in this gallery.');
                    }

                    if(pg.winWidth > 1100) {
                        zoomWidth = 1024;
                        flickrImgExt = '_b';
                    } else if(pg.winWidth > 620) {
                        zoomWidth = 768;
                        flickrImgExt = '_b';
                    } else {
                        zoomWidth = 540;
                        flickrImgExt = '_z';
                    }
                    if(objUrl){
                        jQuery('.plus-pagination').addClass('active');
                        jQuery('.plus-pagination').attr('data-href',objUrl);
                    } else{
                        jQuery('.plus-pagination').remove();
                    }

                    jQuery.each(objPath,function(i,obj){
                        //limit the results
                        if(i < pg.limit) {
                            if(!pg_type) {
                                pg_type = pg.type;
                            }
                            switch(pg_type)
                            {
                                case 'google':
                                    imgTitle = obj.title.$t;
                                    imgSrc = obj.media$group.media$content[0].url;
                                    var lastSlash = imgSrc.lastIndexOf('/');
                                    var imgSrcSubString =imgSrc.substring(lastSlash);

                                    //show the max width image 1024 in this case
                                    imgSrc = imgSrc.replace(imgSrcSubString, '/s' + zoomWidth + imgSrcSubString);

                                    imgTh = obj.media$group.media$thumbnail[1].url;
                                    imgTh = imgTh.replace('s144','s512-c');
                                    break;
                                case 'flickr':
                                    imgTitle = obj.title;
                                    imgSrc = 'http://farm' + obj.farm + '.staticflickr.com/' + obj.server + '/' + obj.id + '_' + obj.secret + flickrImgExt + '.jpg';
                                    imgTh = 'http://farm' + obj.farm + '.staticflickr.com/' + obj.server + '/' + obj.id + '_' + obj.secret + '_z.jpg';
                                    break;
                                case 'facebook':
                                    imgTitle = obj.name;
                                    imgSrc = obj.images[1].source;
                                    if(obj.images[3].source){
                                        imgTh = obj.images[3].source;
                                    }else{
                                        imgTh = obj.images[2].source;
                                    }
                                    imgBg = ' style="background: url(' + obj.images[2].source + ') no-repeat 50% 50%; background-size: cover;"';
                                    break;
                                case 'instagram':
                                    if(obj.caption !== null){
                                        imgTitle = obj.caption;
                                    }
                                    if (obj.media_type === 'VIDEO') {
                                        imgTh = obj.thumbnail_url;
                                        imgSrc = obj.media_url;
                                    } else {
                                        imgSrc = obj.media_url;
                                        imgTh = obj.media_url;
                                    }

                                    break;
                                case 'local':
                                    if(obj.caption !== null){
                                        imgTitle = obj.caption;
                                    }
                                    imgSrc = obj.src;
                                    imgTh = obj.th;
                                    break;
                            }

                            if(!imgTitle) {
                                imgTitle = '';
                            }

                            pg.imgArray[i] = imgSrc;
                            pg.titleArray[i] = imgTitle;
                            
                            let obj_media_type = 'image',
                                obj_icon = '<span class="pg-icon"><svg width="32" height="32" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><circle cx="16.1" cy="6.1" r="1.1" fill="#fff"></circle><rect fill="none" stroke="#fff" x=".5" y="2.5" width="19" height="15"></rect><polyline fill="none" stroke="#fff" stroke-width="1.01" points="4,13 8,9 13,14"></polyline><polyline fill="none" stroke="#fff" stroke-width="1.01" points="11,12 12.5,10.5 16,14"></polyline></svg></span>';

                            if (pg_type === 'instagram' && obj.media_type === 'VIDEO') {
                                obj_media_type = 'video';
                                obj_icon = '<span class="pg-icon"><svg width="32" height="32" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><polygon fill="none" stroke="#fff" stroke-width="1.1" points="8.5 7 13.5 10 8.5 13"></polygon><circle fill="none" stroke="#fff" stroke-width="1.1" cx="10" cy="10" r="9"></circle></svg></span>';
                            }

                            let obj_li_content = '<li class="pgthumb tz-col-lg-'+pg.col_lg+' tz-col-md-'+pg.col_md+' tz-col-sm-'+pg.col_sm+' tz-col-xs-'+pg.col_xs+'"><a href="' + imgSrc + '" class="pg_'+obj_media_type+'"><img data-src="' + imgSrc + '" data-type="' + obj_media_type + '" style="background-image: url(' + imgTh + ');" src="data:image/svg+xml;utf8,&lt;svg xmlns=&quot;http://www.w3.org/2000/svg&quot; width=&quot;640&quot; height=&quot;640&quot;&gt;&lt;/svg&gt;" id="pgthumbimg' + i + '" class="pgthumbimg" alt="' + imgTitle + '" title="' + imgTitle + '"' + imgBg + '>'+obj_icon+'</a></li>';
                            if(obj_click) {
                                jQuery('' + pg_ids + ' #pgthumbs').append(obj_li_content);
                            } else{
                                jQuery(lmnt).find('#pgthumbs').append(obj_li_content);
                            }
                            //check to make sure all the images are loaded and if so show the thumbs
                            if(obj_click) {
                                jQuery('' + pg_ids + ' .pgthumbimg').on('load',function () {
                                    thumbsLoaded++;
                                    //alert(thumbsLoaded+'---'+pg.imgTotal);
                                    if (thumbsLoaded == pg.imgTotal) {
                                        var pg_id = "#" + obj_click.parent().parent().parent().attr('id');
                                        jQuery('' + pg_id + ' #pgalbums').slideUp(700, function () {
                                            jQuery('.pgalbumthumb .pgloading').remove();
                                        });
                                        jQuery('' + pg_id + ' #pgthumbview').slideDown(700);
                                    }
                                })
                            }else{
                                jQuery(lmnt).find('.pgthumbimg').on( 'load', function () {
                                    thumbsLoaded++;
                                    //alert(thumbsLoaded+'---'+pg.imgTotal);
                                    if (thumbsLoaded == pg.imgTotal) {
                                        jQuery(lmnt).find('#pgalbums').slideUp(700, function () {
                                            jQuery('.pgalbumthumb .pgloading').remove();
                                        });
                                        if(title != 'loadmore'){
                                            jQuery(lmnt).find('#pgthumbview').slideDown(700);
                                        }
                                    }
                                })
                            }
                        } //end if(i < pg.limit)
                    }); //end each
                },

                zoomIdx: null, //the zoom index
                zoomImagesLoaded: [],
                zoomScrollDir: null,
                zoomScrollLeft: 0,
                loadZoom: function(idx,obj){

                    pg.zoomIdx = idx;
                    pg.winWidth = jQuery(window).width();
                    var id_pagezoom = obj.parent().parent().parent().attr('id');
                    var pgZoomView = jQuery('#pgzoomview'),
                        pgZoomScroll = jQuery('#pgzoomscroll'),
                        pgPrevious = jQuery('#pgprevious'),
                        pgNext = jQuery('#pgnext'),
                        pgZoom = jQuery('#pgzoom'),
                        pgZoomHTML = '',
                        imgArrayClick = [],
                        imgArrayTitle = [],
                        imgArrayType = [];
                    pgZoomView.addClass('fixed');
                    pgZoomView.addClass(id_pagezoom);

                    obj.parent().find('.pgthumbimg').each(function(index){
                        imgArrayClick[index]=jQuery(this).attr('data-src');
                        imgArrayTitle[index]=jQuery(this).attr('title');
                        imgArrayType[index]=jQuery(this).attr('data-type');
                    });
                    var  totalImages = imgArrayClick.length;


                    //show/hide the prev/next links
                    if(idx === 0) {
                        pgPrevious.hide();
                    }

                    if(idx == totalImages - 1) {
                        pgNext.hide();
                    }

                    var pgzoomWidth = imgArrayClick.length * pg.winWidth;
                    jQuery('#pgzoom').width(pgzoomWidth);

                    var scrollLeftInt = parseInt(idx * pg.winWidth);

                    pgZoomView.fadeIn(function(){
                        //this has gotta come in after the fade or iOS blows up.

                        jQuery(window).on('resize',pg.resizeZoom);

                        jQuery.each(imgArrayClick,function(i){
                            let pgZoomContent = '';
                            if (imgArrayType[i] === 'image') {
                                pgZoomContent = '<img src="' + imgArrayClick[i] + '" data-src="' + imgArrayClick[i] + '" alt="' + imgArrayTitle[i] + '" id="pgzoomimg' + i + '"  class="pgzoomimg" />';
                            } else {
                                pgZoomContent = '<video src="' + imgArrayClick[i] + '" data-src="' + imgArrayClick[i] + '" alt="' + imgArrayTitle[i] + '" id="pgzoomimg' + i + '"  class="pgzoomimg html5-video" controls/>';
                            }
                            pgZoomHTML = pgZoomHTML  + '<li class="pgzoomslide loading" id="pgzoomslide' + i + '" style="width: ' + pg.winWidth + 'px;"><span class="pgloading"><svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg"><circle fill="none" stroke="#fff" cx="15" cy="15" r="14"></circle></svg></span>' +
                                pgZoomContent +
                                '<span class="pgzoomcaption">' + imgArrayTitle[i] + '</span></li>';

                            if(i + 1 == imgArrayClick.length) {
                                //at the end of the loop
                                jQuery('#pgzoom').html(pgZoomHTML);

                                pg.zoomKeyPress();
                                jQuery('#pgzoomscroll').scrollLeft(scrollLeftInt);
                                pg.zoomScrollLeft = scrollLeftInt;
                                pg.loadZoomImg(idx);
                                pg.zoomScroll(imgArrayClick);
                                //load siblings
                                if((idx - 1) >= 0){
                                    pg.loadZoomImg(idx - 1);
                                }

                                if((parseInt(idx)+ 1) < imgArrayClick.length){
                                    pg.loadZoomImg(idx + 1);
                                }
                            }
                        });
                    });
                },
                loadZoomImg:function(idx){
                    jQuery('#pgzoomimg' + idx).addClass('active');
                },

                zoomScroll:function(imgArrayClick){
                    var pgPrevious = jQuery('#pgprevious'),
                        pgNext = jQuery('#pgnext'),
                        scrollTimeout,
                        canLoadZoom = true;


                    jQuery('#pgzoomscroll').on('scroll',function(){
                        currentScrollLeft = jQuery(this).scrollLeft();
                        if(canLoadZoom === true) {
                            canLoadZoom = false;
                            scrollTimeout = setTimeout(function(){
                                if(currentScrollLeft === 0){
                                    pgPrevious.fadeOut();
                                }
                                else {
                                    pgPrevious.fadeIn();
                                }
                                if(currentScrollLeft >= (imgArrayClick.length - 1) * pg.winWidth){
                                    pgNext.fadeOut();
                                }
                                else {
                                    pgNext.fadeIn();
                                }

                                /*Check if we have scrolled left and if so load up the zoom image*/
                                if(currentScrollLeft % pg.zoomScrollLeft > 20 || (currentScrollLeft > 0 && pg.zoomScrollLeft === 0)){
                                    pg.zoomScrollLeft = currentScrollLeft;
                                    var currentIdx = pg.zoomScrollLeft / pg.winWidth;

                                    var currentIdxCeil = Math.ceil(currentIdx);
                                    var currentIdxFloor = Math.floor(currentIdx);
                                    //Lazy load siblings on scroll.
                                    if(!pg.zoomImagesLoaded[currentIdxCeil]) {
                                        pg.loadZoomImg(currentIdxCeil);
                                    }
                                    if(!pg.zoomImagesLoaded[currentIdxFloor]){
                                        pg.loadZoomImg(currentIdxFloor);
                                    }
                                }
                                canLoadZoom = true;
                            },200);
                        }
                    });
                },

                zoomKeyPress: function(){
                    jQuery(document).on('keyup','body',function(e){
                        if(e.which == 27){
                            pg.unloadZoom();
                        }
                        else
                        if(e.which == 37){
                            pg.prevNext('previous');
                        }
                        else
                        if(e.which == 39){
                            pg.prevNext('next');
                        }
                    });
                },

                resizeZoom: function(){
                    pg.winWidth = jQuery(window).width();
                    var pgzoomWidth = pg.imgArray.length * pg.winWidth;
                    jQuery('#pgzoom').width(pgzoomWidth);
                    jQuery('.pgzoomslide').width(pg.winWidth);

                    var scrollLeftInt = parseInt(pg.zoomIdx * pg.winWidth);

                    jQuery('#pgzoomscroll').scrollLeft(scrollLeftInt);
                },

                unloadZoom: function(){
                    jQuery(document).off('keyup','body');
                    jQuery(window).off('resize',pg.resizeZoom);
                    jQuery('#pgzoomscroll').off('scroll');
                    jQuery('#pgzoomview').fadeOut(function(){
                        jQuery('#pgzoom').empty();
                        jQuery('#pgzoomview').off('keyup');
                        jQuery('#pgzoomview').removeClass('fixed');
                    });

                },

                prevNext: function(dir){
                    var currentIdx = jQuery('#pgzoomscroll').scrollLeft() / pg.winWidth;

                    if(dir == "previous"){
                        pg.zoomIdx = Math.round(currentIdx)  - 1;
                    }
                    else {
                        pg.zoomIdx = Math.round(currentIdx) + 1;
                    }

                    var newScrollLeft = pg.zoomIdx * pg.winWidth;

                    jQuery('#pgzoomscroll').stop().animate({scrollLeft:newScrollLeft});
                }
            };

            jQuery.extend(pg, options);
            pg.init();
        };
        jQuery(document).ready(function(){
            // add css
            let general_css = '@keyframes pg-spinner-rotate{0%{transform:rotate(0deg)}to{transform:rotate(270deg)}}@keyframes pg-spinner-dash{0%{stroke-dashoffset:88px}50%{stroke-dashoffset:22px;transform:rotate(135deg)}to{stroke-dashoffset:88px;transform:rotate(450deg)}}.plusgallery{zoom:1;color:#222;position:relative;z-index:1;text-align:left}.plusgallery .clearfix{zoom:1}.plusgallery .clearfix:after,.plusgallery .clearfix:before{content:"";display:block;height:0;overflow:hidden}.plusgallery .clearfix:after{clear:both}.plusgallery ul{list-style-type:none!important;margin:0!important;padding:0!important}.plusgallery *{box-sizing:border-box;-moz-box-sizing:border-box}.plusgallery a{-webkit-transition:all .3s ease-out .1s;-moz-transition:all .3s ease-out .1s;-ms-transition:all .3s ease-out .1s;-o-transition:all .3s ease-out .1s;transition:all .3s ease-out .1s;-webkit-backface-visibility:hidden;text-decoration:none;border:0;background-color:#fff;display:block;color:#222;-webkit-box-shadow:0 0 0 1px rgba(0,0,0,.05),1px 1px 5px rgba(0,0,0,.3);-moz-box-shadow:0 0 0 1px rgba(0,0,0,.05),1px 1px 5px rgba(0,0,0,.3);box-shadow:0 0 0 1px rgba(0,0,0,.05),1px 1px 5px rgba(0,0,0,.3)}#pgzoomview a:hover,.plusgallery a:hover{background-color:#38beea}.plusgallery a img{display:block;max-width:100%}@media (max-width:575.98px){.plusgallery .tz-col-xs-1{width:100%;height:100%}.plusgallery .tz-col-xs-2{width:50%;height:50%}.plusgallery .tz-col-xs-3{width:33.333333333333333%;height:33.333333333333333%}.plusgallery .tz-col-xs-4{width:25%;height:25%}.plusgallery .tz-col-xs-5{width:20%;height:20%}.plusgallery .tz-col-xs-6{width:16.66666666666666667%;height:16.66666666666666667%}.plusgallery .tz-col-xs-7{width:14.285714285714286%;height:14.285714285714286%}.plusgallery .tz-col-xs-8{width:12.5%;height:12.5%}.plusgallery .tz-col-xs-9{width:11.1111111111111111111%;height:11.1111111111111111111%}.plusgallery .tz-col-xs-10{width:10%;height:10%}.plusgallery .tz-col-xs-11{width:9.0909090909090909091%;height:9.0909090909090909091%}.plusgallery .tz-col-xs-12{width:8.333333333333333333%;height:8.333333333333333333%}}@media (min-width:576px) and (max-width:767.98px){.plusgallery .tz-col-sm-1{width:100%;height:100%}.plusgallery .tz-col-sm-2{width:50%;height:50%}.plusgallery .tz-col-sm-3{width:33.333333333333333%;height:33.333333333333333%}.plusgallery .tz-col-sm-4{width:25%;height:25%}.plusgallery .tz-col-sm-5{width:20%;height:20%}.plusgallery .tz-col-sm-6{width:16.66666666666666667%;height:16.66666666666666667%}.plusgallery .tz-col-sm-7{width:14.285714285714286%;height:14.285714285714286%}.plusgallery .tz-col-sm-8{width:12.5%;height:12.5%}.plusgallery .tz-col-sm-9{width:11.1111111111111111111%;height:11.1111111111111111111%}.plusgallery .tz-col-sm-10{width:10%;height:10%}.plusgallery .tz-col-sm-11{width:9.0909090909090909091%;height:9.0909090909090909091%}.plusgallery .tz-col-sm-12{width:8.333333333333333333%;height:8.333333333333333333%}}@media (min-width:768px) and (max-width:991.98px){.plusgallery .tz-col-md-1{width:100%;height:100%}.plusgallery .tz-col-md-2{width:50%;height:50%}.plusgallery .tz-col-md-3{width:33.333333333333333%;height:33.333333333333333%}.plusgallery .tz-col-md-4{width:25%;height:25%}.plusgallery .tz-col-md-5{width:20%;height:20%}.plusgallery .tz-col-md-6{width:16.66666666666666667%;height:16.66666666666666667%}.plusgallery .tz-col-md-7{width:14.285714285714286%;height:14.285714285714286%}.plusgallery .tz-col-md-8{width:12.5%;height:12.5%}.plusgallery .tz-col-md-9{width:11.1111111111111111111%;height:11.1111111111111111111%}.plusgallery .tz-col-md-10{width:10%;height:10%}.plusgallery .tz-col-md-11{width:9.0909090909090909091%;height:9.0909090909090909091%}.plusgallery .tz-col-md-12{width:8.333333333333333333%;height:8.333333333333333333%}}@media (min-width:992px){.plusgallery .tz-col-lg-1{width:100%;height:100%}.plusgallery .tz-col-lg-2{width:50%;height:50%}.plusgallery .tz-col-lg-3{width:33.333333333333333%;height:33.333333333333333%}.plusgallery .tz-col-lg-4{width:25%;height:25%}.plusgallery .tz-col-lg-5{width:20%;height:20%}.plusgallery .tz-col-lg-6{width:16.66666666666666667%;height:16.66666666666666667%}.plusgallery .tz-col-lg-7{width:14.285714285714286%;height:14.285714285714286%}.plusgallery .tz-col-lg-8{width:12.5%;height:12.5%}.plusgallery .tz-col-lg-9{width:11.1111111111111111111%;height:11.1111111111111111111%}.plusgallery .tz-col-lg-10{width:10%;height:10%}.plusgallery .tz-col-lg-11{width:9.0909090909090909091%;height:9.0909090909090909091%}.plusgallery .tz-col-lg-12{width:8.333333333333333333%;height:8.333333333333333333%}}#pgzoomview a,.plusgallery .pgplus{-webkit-transition:all .3s ease-out .1s;-moz-transition:all .3s ease-out .1s;-ms-transition:all .3s ease-out .1s;-o-transition:all .3s ease-out .1s;transition:all .3s ease-out .1s}.plusgallery .pgplus{line-height:1em;padding:.3em;font-size:1.8em;color:#fff;position:absolute;top:-1.5em;width:1.5em;right:-1.5em;z-index:7;text-align:center;font-weight:100}.plusgallery .pgalbumlink{position:relative;overflow:hidden;display:block;width:100%;padding:0;border:0}.plusgallery .pgalbumlink:hover .pgplus{top:0;right:0}.plusgallery .pgcredit a{display:inline-block;color:#222;letter-spacing:1px;background-color:transparent;-webkit-box-shadow:none;-moz-box-shadow:none;box-shadow:none;font-size:10px;text-transform:uppercase}.plusgallery .pgcredit a span{color:#666;-webkit-transition:color .3s ease-out;-moz-transition:color .3s ease-out;-ms-transition:color .3s ease-out;-o-transition:color .3s ease-out;transition:color .3s ease-out}.plusgallery .pgcredit a:hover span{color:#fff}.plusgallery>.pgloading{background:0 0}.plusgallery.loaded>.pgloading,.plusgallery.nav_hide .plus-pagination{display:none!important}.plusgallery .pgalbumthumb,.plusgallery .pgthumb{float:left;padding:5px;margin:0}.plusgallery .pgalbumthumb span{position:absolute;display:block}.plusgallery .pgthumb{display:block;position:relative;-webkit-transition:all .5s ease .5s;-moz-transition:all .5s ease .5s;-ms-transition:all .5s ease .5s;-o-transition:all .5s ease .5s;transition:all .5s ease .5s}.plusgallery .pgthumb a{width:100%;height:100%;padding:0;margin:0;border:0;position:relative}.plusgallery .pgthumb a .pg-icon,.plusgallery .pgthumb a:before{transition:.3s ease-out;transition-property:opacity,transform,filter;position:absolute;opacity:0}.plusgallery .pgthumb a:before{content:\'\';top:0;right:0;left:0;bottom:0;background-color:rgba(0,0,0,.5)}.plusgallery .pgthumb a .pg-icon{top:50%;left:50%;transform:translate(-50%,-50%);line-height:1;font-size:20px}.plusgallery .pgthumb a:hover .pg-icon,.plusgallery .pgthumb a:hover:before{opacity:1}.plusgallery .pgthumb img{background:#fff;width:100%;border:0}.plusgallery .pgalbumtitle{bottom:0;left:0;background:-moz-linear-gradient(top,transparent 0,rgba(0,0,0,.65) 100%);background:-webkit-gradient(linear,left top,left bottom,color-stop(0%,transparent),color-stop(100%,rgba(0,0,0,.65)));background:-webkit-linear-gradient(top,transparent 0,rgba(0,0,0,.65) 100%);background:-o-linear-gradient(top,transparent 0,rgba(0,0,0,.65) 100%);background:-ms-linear-gradient(top,transparent 0,rgba(0,0,0,.65) 100%);background:linear-gradient(to bottom,transparent 0,rgba(0,0,0,.65) 100%);filter:progid:DXImageTransform.Microsoft.gradient(startColorstr=\'#00000000\', endColorstr=\'#a6000000\', GradientType=0);color:#fff;text-shadow:1px 1px 2px rgba(0,0,0,.4);font-size:1.12em;z-index:7;padding:2em 6% 6%;width:100%}.plusgallery .crumbtitle{font-size:1rem;margin-left:.5rem}#pgzoomview{display:none;padding:0;margin:0;list-style-type:none;-ms-filter:"progid:DXImageTransform.Microsoft.gradient(startColorstr=#CC000000,endColorstr=#CC000000)";background:rgba(0,0,0,.8);text-align:center;z-index:999999}#pgzoomview a{display:block;-webkit-backface-visibility:hidden;text-decoration:none;border:0}.pg-icon{line-height:1;font-size:1px}#pgzoomview,.pgloading{position:absolute;width:100%;height:100%;top:0;left:0}.pgloading{z-index:6;display:flex!important;align-items:center;justify-content:center;background:rgba(0,0,0,.8) no-repeat 50% 50%}.pgloading>*{animation:pg-spinner-rotate 1.4s linear infinite}.pgloading>*>*{stroke-dasharray:88px;stroke-dashoffset:0;transform-origin:center;animation:pg-spinner-dash 1.4s ease-in-out infinite;stroke-width:1;stroke-linecap:round}#pgalbums{clear:both}.pgalbumimg{display:block;width:100%;border:0;position:relative;z-index:1;background-position:50% 50%;background-size:cover;background-repeat:no-repeat}#pgthumbview{clear:both;display:none}#pgthumbview #pgthumbs .pgthumb img{background-size:cover;background-position:center center}#pgthumbcrumbs{margin-bottom:.5em}#pgthumbcrumbs li{padding:9px .7em 0;float:left;line-height:1em;height:30px}#pgthumbcrumbs li.pgthumbhome{cursor:pointer;-webkit-transition:all .3s ease-out;-moz-transition:all .3s ease-out;-ms-transition:all .3s ease-out;-o-transition:all .3s ease-out;transition:all .3s ease-out;font-size:1.5em;line-height:.6em;padding-left:.4em;padding-right:.1em}#pgthumbcrumbs li.pgthumbhome:hover{padding-left:.2em}#pgzoomview.fixed{position:fixed}#pgzoomscroll{position:absolute;overflow-x:hidden;overflow-y:hidden;-webkit-overflow-scrolling:touch;width:100%;height:100%;z-index:9999991}#pgzoom,.pgzoomslide{height:100%;margin:0!important;padding:0!important}#pgzoom{list-style-type:none;-webkit-transform:translateZ(0)}.pgzoomslide{width:100%;left:0;top:0;float:left;overflow:hidden;text-align:center;position:relative;-webkit-transform:translate3d(0,0,0)}.pgzoomslide .pgloading{background:0 0}.pgzoomcenter,.pgzoomspacer{vertical-align:middle;display:inline-block}.pgzoomspacer{width:1px;height:100%}.pgzoomcenter{text-align:center}.pgzoomimg{max-width:80%;max-height:75%;-webkit-box-shadow:1px 1px 8px rgba(0,0,0,.9);-moz-box-shadow:1px 1px 8px rgba(0,0,0,.9);box-shadow:1px 1px 8px rgba(0,0,0,.9);vertical-align:middle;opacity:0;-webkit-transition:opacity .4s ease-out;-moz-transition:opacity .4s ease-out;-ms-transition:opacity .4s ease-out;-o-transition:opacity .4s ease-out;transition:opacity .4s ease-out;margin-bottom:2em;display:inline;position:absolute;z-index:7;top:50%;left:50%;transform:translate(-50%,-50%)}.pgzoomimg.active{opacity:1}.pgzoomcaption{margin:1.5em 0;color:#fff;font-size:.9em;opacity:1;position:absolute;left:0;padding-left:20%;padding-right:20%;box-sizing:border-box;-moz-box-sizing:border-box;width:100%;bottom:0;text-align:center;-webkit-transition:opacity .5s ease-out;-moz-transition:opacity .5s ease-out;-ms-transition:opacity .5s ease-out;-o-transition:opacity .5s ease-out;transition:opacity .5s ease-out}.pgzoomarrow{position:fixed;width:52px;height:100px;top:50%;margin-top:-50px;overflow:hidden;display:flex!important;align-items:center;justify-content:center;z-index:9999999}#pgzoomclose:hover,.pgzoomarrow:hover{-webkit-box-shadow:inset 1px 1px 6px rgba(0,0,0,.3);-moz-box-shadow:inset 1px 1px 6px rgba(0,0,0,.3);box-shadow:inset 1px 1px 6px rgba(0,0,0,.3)}#pgprevious{left:0;-webkit-border-top-right-radius:3px;-webkit-border-bottom-right-radius:3px;-moz-border-radius-topright:3px;-moz-border-radius-bottomright:3px;border-top-right-radius:3px;border-bottom-right-radius:3px;background-position:0 50%}#pgnext,#pgzoomclose{right:0;-webkit-border-bottom-left-radius:3px;-moz-border-radius-bottomleft:3px;border-bottom-left-radius:3px}#pgnext{-webkit-border-top-left-radius:3px;-moz-border-radius-topleft:3px;border-top-left-radius:3px;background-position:100% 50%}#pgzoomclose{position:absolute;top:0;width:52px;height:52px;background-repeat:no-repeat;background-position:50% 50%;overflow:hidden;z-index:9999999;cursor:pointer;display:flex!important;align-items:center;justify-content:center}.pgcredit{text-align:center;clear:both;padding-top:10px;padding-bottom:10px}.plus-pagination span,.plus-pagination-end span{color:#222;border:1px solid #ccc;display:inline-block;padding:10px 20px;border-radius:3px;cursor:pointer}.plus-pagination,.plus-pagination-end{padding:50px;text-align:center;display:none}.plus-pagination.active{display:block}@media only screen and (max-width:768px){.pgalbumthumb,.pgthumb{width:33.333%!important}}@media only screen and (max-width:480px){.pgalbumthumb,.pgthumb{width:50%!important}.pgzoomarrow{width:36px;height:60px}#pgprevious{background-position:-6px 50%}#pgnext{background-position:-66px 50%}#pgzoomclose{width:36px;height:36px}}@media only screen and (max-width:320px){.pgalbumthumb,.pgthumb{width:100%!important}}';
            let style = $('<style type="text/css" id="tz-plus-gallery-css"></style>');
            style.text(general_css);
            jQuery('head').append(style);
            jQuery('.plusgallery').plusGallery();
        });

    })( jQuery );
}