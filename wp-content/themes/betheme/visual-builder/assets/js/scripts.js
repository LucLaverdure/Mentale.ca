var $content;
var iframe;
var inlineEditors = [];
let preventEdit = false;
var edited_item = false;

var MfnVbApp = (function($){

let new_widget_wrap, new_widget_wrap_size, new_widget_section, new_widget_wcount, new_widget_container, new_widget_position = 'after';
let $editpanel = $(document);
let screen = 'desktop';
let prebuiltType = 'end';
let context_el;
let mfncopy = false;
let sample_img = mfnvbvars.themepath+'/muffin-options/svg/placeholders/image.svg';
let sample_icon = 'icon-lamp';
let dragging_new = 0;
let historyIndex = 0;
let mfnbuilder = localStorage.getItem('mfn-builder') ? JSON.parse(localStorage.getItem('mfn-builder')) : {};
let scroll_top;
let formaction = $('.btn-save-form-primary').attr('data-action');
let savebutton = $('.btn-save-form-primary span').text();
let previewTab;
let pageid = mfnvbvars.pageid;
let wpnonce = mfnvbvars.wpnonce;
let ajaxurl = mfnvbvars.ajaxurl;
let $edited_div = false;
let inlineIndex = 0;
let $navigator = $('.mfn-navigator');
let winH = $(window).height();
let item_name = false;
let historyAllow = true;
let wyswig_active = false;
let $undo = $('.mfn-visualbuilder .sidebar-panel .sidebar-panel-footer .btn-undo');
let $redo = $('.mfn-visualbuilder .sidebar-panel .sidebar-panel-footer .btn-redo');

localStorage.setItem('mfnhistory', []);

// new elements objects
var elements = {
    wrap: function(size) {
        var uid = getUid();

        var size_class = size;

        if( size != 'divider' ) size_class = sizes.filter(s => s.key === size)[0];

        var new_wrap = {};
        new_wrap = JSON.parse( JSON.stringify(mfnvbvars.elements.wrap) );

        //var new_wrap = {...mfnvbvars.elements.wrap};
        new_wrap.uid = uid;
        new_wrap.size = size;
        new_wrap.tablet_size = size;
        new_wrap.tablet_resized = "0";
        new_wrap.mobile_size = '1/1';
        new_wrap.attr.sticky = "0";
        new_wrap.attr.tablet_sticky = "0";
        new_wrap.attr.mobile_sticky = "0";

        mfnvbvars.pagedata.push(new_wrap);

        var answer = {};
        if( size == 'divider' ){
            answer.html = '<div data-uid="'+uid+'" class="blink wrap mcb-wrap vb-item vb-item-wrap mcb-wrap-'+uid+' divider clearfix"><div class="mcb-wrap-inner mcb-wrap-inner-'+uid+'"><div class="wrap-header mfn-header mfn-header-grey"><a class="mfn-option-btn mfn-option-grey mfn-element-drag mfn-wrap-drag" title="Drag & Drop" data-tooltip="Drag" href="#"><span class="mfn-icon mfn-icon-drag"></span></a><a class="mfn-option-btn mfn-option-grey mfn-module-clone mfn-wrap-clone" title="Clone" data-tooltip="Clone" href="#"><span class="mfn-icon mfn-icon-clone"></span></a> <a class="mfn-option-btn mfn-option-grey mfn-element-delete" data-tooltip="Delete" title="Delete" href="#"><span class="mfn-icon mfn-icon-delete"></span></a> </div></div></div>';
        }else{
            answer.html = '<div data-uid="'+uid+'" data-desktop-size="'+size+'" data-tablet-size="'+size+'" data-mobile-size="1/1" class="blink wrap mcb-wrap mcb-wrap-new vb-item vb-item-wrap mcb-wrap-'+uid+' '+size_class.desktop+' '+size_class.tablet+' mobile-one clearfix"><div class="mcb-wrap-inner mcb-wrap-inner-'+uid+' empty"><div class="mfn-drag-helper placeholder-wrap"></div><a href="#" class="btn-item-add mfn-item-add mfn-icon-add-light mfn-wrap-add-item" data-tooltip="Add element">Add element</a><div class="wrap-header mfn-header mfn-header-grey"><a class="mfn-option-btn mfn-option-blue mfn-element-menu mfn-element-edit" href="#" data-tooltip="Edit wrap" data-position="right"><span class="mfn-icon mfn-icon-wrap"></span></a><a class="mfn-option-btn mfn-option-grey mfn-size-change mfn-size-decrease" title="Decrease" data-tooltip="Decrease" href="#"><span class="mfn-icon mfn-icon-dec"></span></a> <a class="mfn-option-btn mfn-option-grey mfn-size-change mfn-size-increase" title="Increase" data-tooltip="Increase" href="#"><span class="mfn-icon mfn-icon-inc"></span></a> <a class="mfn-option-btn mfn-option-text mfn-option-grey mfn-wrap-sort-handler mfn-size-label" title="Size" data-tooltip="Size"><span class="text mfn-element-size-label">'+size+'</span></a> <a class="mfn-option-btn mfn-option-text btn-icon-left mfn-option-grey mfn-item-add" title="Add element" data-tooltip="Add element" href="#"><span class="mfn-icon mfn-icon-add"></span><span class="text">Element</span></a><a class="mfn-option-btn mfn-option-grey mfn-element-drag mfn-wrap-drag" title="Drag & Drop" data-tooltip="Drag" href="#"><span class="mfn-icon mfn-icon-drag"></span></a><a class="mfn-option-btn mfn-option-grey mfn-element-edit" title="Edit" data-tooltip="Edit" href="#"><span class="mfn-icon mfn-icon-edit"></span></a><a class="mfn-option-btn mfn-option-grey mfn-module-clone mfn-wrap-clone" title="Clone" data-tooltip="Clone" href="#"><span class="mfn-icon mfn-icon-clone"></span></a> <a class="mfn-option-btn mfn-option-grey mfn-element-delete" data-tooltip="Delete" title="Delete" href="#"><span class="mfn-icon mfn-icon-delete"></span></a> </div><div class="mfn-drag-helper placeholder-wrap"></div><div class="mfn-wrap-new"><a href="#" class="mfn-item-add mfn-btn btn-icon-left btn-small mfn-btn-blank2"><span class="btn-wrapper"><span class="mfn-icon mfn-icon-add"></span>Add element</span></a></div></div></div>';
        }

        answer.uid = uid;

        return answer;
    },
    section: function(){
        var uid = getUid();
        //var new_section = {...mfnvbvars.elements.section};

        var new_section = {};
        new_section = JSON.parse( JSON.stringify(mfnvbvars.elements.section) );
        new_section.uid = uid;
        mfnvbvars.pagedata.push(new_section);

        var answer = {};
        answer.html = '<div data-uid="'+uid+'" class="section mcb-section mcb-section-new vb-item mfn-new-item mcb-section-'+uid+' blink empty" data-title="Section"> <a href="#" data-tooltip="Add new section" class="btn-section-add mfn-icon-add-light mfn-section-add siblings prev" data-position="before">Add section</a> <div class="section-header mfn-section-sort-handler mfn-header header-large"> <a class="mfn-option-btn mfn-option-blue mfn-element-menu mfn-element-edit" href="#" data-tooltip="Edit section" data-position="right"><span class="mfn-icon mfn-icon-section"></span></a> <div class="options-group"> <a class="mfn-option-btn mfn-option-text mfn-option-green btn-large mfn-wrap-add" title="Add wrap" href="#"><span class="mfn-icon mfn-icon-add"></span><span class="text">Wrap</span></a> <a class="mfn-option-btn mfn-option-text mfn-option-green btn-large mfn-wrap-add mfn-divider-add" title="Add divider" href="#"><span class="mfn-icon mfn-icon-add"></span><span class="text">Divider</span></a> </div><div class="options-group"> <a class="mfn-option-btn mfn-option-green btn-large mfn-element-drag mfn-section-drag" title="Drag" data-tooltip="Drag" href="#"><span class="mfn-icon mfn-icon-drag"></span></a> <a class="mfn-option-btn mfn-option-green btn-large mfn-element-edit" title="Edit" data-tooltip="Edit" href="#"><span class="mfn-icon mfn-icon-edit"></span></a> <a class="mfn-option-btn mfn-option-green btn-large mfn-module-clone mfn-section-clone" title="Clone" data-tooltip="Clone" href="#"><span class="mfn-icon mfn-icon-clone"></span></a> <a class="mfn-option-btn mfn-option-green btn-large mfn-element-delete" data-tooltip="Delete" title="Delete" href="#"><span class="mfn-icon mfn-icon-delete"></span></a> <div class="mfn-option-dropdown"> <a class="mfn-option-btn mfn-option-green btn-large" title="More" href="#"><span class="mfn-icon mfn-icon-more"></span></a> <div class="dropdown-wrapper"> <h6>Actions</h6> <a class="mfn-dropdown-item mfn-section-hide" href="#" data-show="Show section" data-hide="Hide section"><span class="mfn-icon mfn-icon-hide"></span><span class="mfn-icon mfn-icon-show"></span><span class="label">Hide section</span></a> <a class="mfn-dropdown-item mfn-section-move-up" href="#"><span class="mfn-icon mfn-icon-move-up"></span> Move up</a><a class="mfn-dropdown-item mfn-section-move-down" href="#"><span class="mfn-icon mfn-icon-move-down"></span> Move down</a> <div class="mfn-dropdown-divider"></div><h6>Import / Export</h6> <a class="mfn-dropdown-item mfn-section-export" href="#"><span class="mfn-icon mfn-icon-export"></span> Export section</a> <a class="mfn-dropdown-item mfn-section-import mfn-section-import-before" href="#"><span class="mfn-icon mfn-icon-import-after"></span> Import before</a> <a class="mfn-dropdown-item mfn-section-import mfn-section-import-after" href="#"><span class="mfn-icon mfn-icon-import-before"></span> Import after</a> </div></div></div></div><div class="mcb-background-overlay"></div><div class="mfn-shape-divider mfn-shape-divider-top" data-bring-front="0" data-flip="0" data-invert="0" data-name="top"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none"><path></path></svg></div><div class="mfn-shape-divider mfn-shape-divider-bottom" data-bring-front="0" data-flip="0" data-invert="0" data-name="bottom"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none"><path></path></svg></div><div class="section_wrapper mcb-section-inner mcb-section-inner-'+uid+'"> <div class="mfn-section-new"> <h5>Select a wrap layout</h5> <div class="wrap-layouts"> <div class="wrap-layout wrap-11" data-type="wrap-11" data-tooltip="1/1"></div><div class="wrap-layout wrap-12" data-type="wrap-12" data-tooltip="1/2 | 1/2"><span></span></div><div class="wrap-layout wrap-13" data-type="wrap-13" data-tooltip="1/3 | 1/3 | 1/3"><span></span><span></span></div><div class="wrap-layout wrap-14" data-type="wrap-14" data-tooltip="1/4 | 1/4 | 1/4 | 1/4"><span></span><span></span><span></span></div><div class="wrap-layout wrap-13-23" data-type="wrap-1323" data-tooltip="1/3 | 2/3"><span></span></div><div class="wrap-layout wrap-23-13" data-type="wrap-2313" data-tooltip="2/3 | 1/3"><span></span></div><div class="wrap-layout wrap-14-12-14" data-type="wrap-141214" data-tooltip="1/4 | 1/2 | 1/4"><span></span><span></span></div></div><p>or choose from</p><a class="mfn-btn prebuilt-button mfn-btn-green btn-icon-left" href="#"><span class="btn-wrapper"><span class="mfn-icon mfn-icon-add-light"></span>Pre-built sections</span></a> </div></div><a href="#" class="btn-section-add mfn-icon-add-light mfn-section-add siblings next" data-position="after">Add section</a></div>';
        answer.uid = uid;

        return answer;
    },
    item: function(name) {
        var script = false;
        var uid = getUid();
        //var new_item = {...mfnvbvars.elements[name]};

        var new_item = {};
        new_item = JSON.parse( JSON.stringify(mfnvbvars.elements[name]) );
        var html = new_item.html.replaceAll('uidhere', uid);

        if( new_item.script ){
            script = new_item.script;
        }

        delete new_item.html;
        delete new_item.script;

        new_item.uid = uid;
        new_item.size = '1/1';
        new_item.tablet_size = '1/1';
        new_item.mobile_size = '1/1';
        new_item.tablet_resized = "0";
        mfnvbvars.pagedata.push(new_item);

        if( script ){
            var arr = [];
            arr.push(html);
            arr.push(script);
            return arr;
        }else{
            return html;
        }

    }
};

var sizes = [
    {index: 1, key: '1/6', desktop: 'one-sixth', tablet: 'tablet-one-sixth', mobile: 'mobile-one-sixth', percent: '16.666%'},
    {index: 2, key: '1/5', desktop: 'one-fifth', tablet: 'tablet-one-fifth', mobile: 'mobile-one-fifth', percent: '20%'},
    {index: 3, key: '1/4', desktop: 'one-fourth', tablet: 'tablet-one-fourth', mobile: 'mobile-one-fourth', percent: '25%'},
    {index: 4, key: '1/3', desktop: 'one-third', tablet: 'tablet-one-third', mobile: 'mobile-one-third', percent: '33.333%'},
    {index: 5, key: '2/5', desktop: 'two-fifth', tablet: 'tablet-two-fifth', mobile: 'mobile-two-fifth', percent: '40%'},
    {index: 6, key: '1/2', desktop: 'one-second', tablet: 'tablet-one-second', mobile: 'mobile-one-second', percent: '50%'},
    {index: 7, key: '3/5', desktop: 'three-fifth', tablet: 'tablet-three-fifth', mobile: 'mobile-three-fifth', percent: '60%'},
    {index: 8, key: '2/3', desktop: 'two-third', tablet: 'tablet-two-third', mobile: 'mobile-two-third', percent: '66%'},
    {index: 9, key: '3/4', desktop: 'three-fourth', tablet: 'tablet-three-fourth', mobile: 'mobile-three-fourth', percent: '75%'},
    {index: 10, key: '4/5', desktop: 'four-fifth', tablet: 'tablet-four-fifth', mobile: 'mobile-four-fifth', percent: '80%'},
    {index: 11, key: '5/6', desktop: 'five-sixth', tablet: 'tablet-five-sixth', mobile: 'mobile-five-sixth', percent: '83.333%'},
    {index: 12, key: '1/1', desktop: 'one', tablet: 'tablet-one', mobile: 'mobile-one', percent: '100%'}
];

var presets_keys = {
    'icon_box_2': ['title_tag', 'icon_position', 'icon_position_tablet', 'icon_position_mobile', 'icon_align', 'icon_align_tablet', 'icon_align_mobile', 'hover'],
};

var units = ['px', '%', 'em', 'rem', 'vw', 'vh'];

var items_size = {
    'wrap': ['1/6', '1/5', '1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],

    'accordion': ['1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'article_box': ['1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'before_after': ['1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'blockquote': ['1/6', '1/5', '1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'blog': ['1/1'],
    'blog_news': ['1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'blog_slider': ['1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'blog_teaser': ['1/1'],
    'button': ['1/6', '1/5', '1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'call_to_action': ['1/1'],
    'chart': ['1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'clients': ['1/1'],
    'clients_slider': ['1/1'],
    'code': ['1/6', '1/5', '1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'column': ['1/6', '1/5', '1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'contact_box': ['1/5', '1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'content': ['1/6', '1/5', '1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'countdown': ['1/1'],
    'counter': ['1/6', '1/5', '1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'divider': ['1/1'],
    'fancy_divider': ['1/1'],
    'fancy_heading': ['1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'feature_box': ['1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'feature_list': ['1/1'],
    'faq': ['1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'flat_box': ['1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'helper': ['1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'hover_box': ['1/6', '1/5', '1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'hover_color': ['1/6', '1/5', '1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'how_it_works': ['1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'icon_box': ['1/5', '1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'image': ['1/6', '1/5', '1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'image_gallery': ['1/1'],
    'info_box': ['1/5', '1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'list': ['1/6', '1/5', '1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'map_basic': ['1/6', '1/5', '1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'map': ['1/6', '1/5', '1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'offer': ['1/1'],
    'offer_thumb': ['1/1'],
    'opening_hours': ['1/5', '1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'our_team': ['1/6', '1/5', '1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'our_team_list': ['1/1'],
    'photo_box': ['1/6', '1/5', '1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'placeholder': ['1/6', '1/5', '1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'portfolio': ['1/1'],
    'portfolio_grid': ['1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'portfolio_photo': ['1/1'],
    'portfolio_slider': ['1/1'],
    'pricing_item': ['1/6', '1/5', '1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'progress_bars': ['1/6', '1/5', '1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'promo_box': ['1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'quick_fact': ['1/6', '1/5', '1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'shop': ['1/1'],
    'shop_slider': ['1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'sidebar_widget': ['1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'slider': ['1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'slider_plugin': ['1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'sliding_box': ['1/6', '1/5', '1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'story_box': ['1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'tabs': ['1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'testimonials': ['1/1'],
    'testimonials_list': ['1/1'],
    'trailer_box': ['1/6', '1/5', '1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'timeline': ['1/1'],
    'video': ['1/6', '1/5', '1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'visual': ['1/6', '1/5', '1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'zoom_box': ['1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'shop_categories': ['1/1'],
    'shop_products': ['1/1'],
    'shop_title': ['1/6', '1/5', '1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'product_title': ['1/6', '1/5', '1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'product_images': ['1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'product_price': ['1/6', '1/5', '1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'product_cart_button': ['1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'product_reviews': ['1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'product_rating': ['1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'product_stock': ['1/6', '1/5', '1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'product_meta': ['1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'product_short_description': ['1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'product_content': ['1/1'],
    'product_additional_information': ['1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'product_related': ['1/1'],
    'product_upsells': ['1/1'],
};

function getUid(){
    return Math.random().toString(36).substring(4);
}

// show shortcode add icon
$('.modal-add-shortcode .browse-icon .mfn-button-upload').on('click', function(e) {
    e.preventDefault();
    $('.mfn-modal.modal-select-icon .mfn-items-list li').removeClass('active');
    $('.mfn-modal.modal-select-icon').addClass('show');
});

function backToWidgets(){
    $('.mfn-visualbuilder .sidebar-panel .sidebar-panel-header .header-items .title-group .sidebar-panel-desc .sidebar-panel-title').text('Add element');
    $('.mfn-visualbuilder .sidebar-panel .sidebar-panel-header .header-items .title-group .sidebar-panel-icon').attr('class', 'sidebar-panel-icon mfn-icon-add-big');

    $(".panel").hide();
    $(".header").hide();
    $(".panel-items").show();
    $(".header-items").show();
    $('.panel-edit-item .mfn-form')

    $('.panel-items .mfn-search').focus();

    // resetSaveButton();
}

function showPrebuilts(){
    $(".panel").hide();
    $(".header").hide();
    $(".panel-prebuilt-sections").show();
    $(".header-prebuilt-sections").show();
}

var enableBeforeUnload = function() {
    if( !$('.mfn-form-options').is(':visible') ){
        window.onbeforeunload = function(e) {
            return 'The changes you made will be lost if you navigate away from this page';
        };
    }
};

$('.mfn-visualbuilder .sidebar-panel-content ul.items-list li a').on('click', function(e) {
    e.preventDefault();
});

document.addEventListener('keydown', function(event) {
    catchShortcuts(event);
});

function catchShortcuts(e){
    if((e.ctrlKey || e.metaKey) && e.key == "s") {
        // ctr || cmd + s
        e.preventDefault();
        if(!$('.btn-save-form-primary.btn-save-changes').hasClass('disabled')){
            $('.btn-save-form-primary.btn-save-changes').trigger('click');
        }
        return false;
    }else if((e.ctrlKey || e.metaKey) && e.key == "y") {
        // ctr || cmd + y
        if( !$('.mfn-field-value').is(':focus')  ){
            e.preventDefault();
            if(!$redo.hasClass('loading') && !$redo.hasClass('inactive')){
                $redo.trigger('click');
            }
            return false;
        }else if( $('.panel-edit-item .mfn-field-value:focus').length ){
            setTimeout(function() {
                fieldUpdate($('.panel-edit-item .mfn-field-value:focus'));
            }, 5);
        }
    }else if((e.ctrlKey || e.metaKey) && e.key == "i") {
        // ctr || cmd + i
        e.preventDefault();
        $('.mfn-visualbuilder .sidebar-menu nav ul li.menu-navigator a').trigger('click');
        return false;
    }else if(e.ctrlKey && e.shiftKey && e.key == "Z") {
        // ctr || cmd + shift + z
        if( !$('.mfn-field-value').is(':focus')  ){
            e.preventDefault();
            if(!$redo.hasClass('loading') && !$redo.hasClass('inactive')){
                $redo.trigger('click');
            }
            return false;
        }else if( $('.panel-edit-item .mfn-field-value:focus').length ){
            setTimeout(function() {
                fieldUpdate($('.panel-edit-item .mfn-field-value:focus'));
            }, 5);
        }
    }else if(e.metaKey && e.shiftKey && e.key == "z") {
        // ctr || cmd + shift + z
        if( !$('.mfn-field-value').is(':focus') ){
            e.preventDefault();
            if(!$redo.hasClass('loading') && !$redo.hasClass('inactive')){
                $redo.trigger('click');
            }
            return false;
        }else if( $('.panel-edit-item .mfn-field-value:focus').length ){
            setTimeout(function() {
                fieldUpdate($('.panel-edit-item .mfn-field-value:focus'));
            }, 5);
        }
    }else if(e.ctrlKey && e.shiftKey && e.key === "P") {
        // ctr || cmd + shift + p
        e.preventDefault();
        $('.mfn-visualbuilder a.mfn-preview-generate').trigger('click');
        return false;
    }else if(e.metaKey && e.shiftKey && e.key == "p") {
        // ctr || cmd + shift + p
        e.preventDefault();
        $('.mfn-visualbuilder a.mfn-preview-generate').trigger('click');
        return false;
    }else if(e.ctrlKey && e.shiftKey && e.key === "M") {
        // ctr || cmd + shift + m
        e.preventDefault();
        $('.mfn-visualbuilder .sidebar-panel .sidebar-panel-footer .btn-change-resolution .dropdown-wrapper a[data-preview="desktop"]').trigger('click');
        return false;
    }else if(e.metaKey && e.shiftKey && e.key == "m") {
        // ctr || cmd + shift + m
        e.preventDefault();
        $('.mfn-visualbuilder .sidebar-panel .sidebar-panel-footer .btn-change-resolution .dropdown-wrapper a[data-preview="desktop"]').trigger('click');
        return false;
    }else if(e.metaKey && e.shiftKey && e.key == "h") {
        // ctr || cmd + shift + h
        e.preventDefault();
        $('.mfn-visualbuilder .sidebar-menu nav ul li.menu-revisions a').trigger('click');
        return false;
    }else if(e.ctrlKey && e.shiftKey && e.key === "H") {
        // ctr || cmd + shift + h
        e.preventDefault();
        $('.mfn-visualbuilder .sidebar-menu nav ul li.menu-revisions a').trigger('click');
        return false;
    }else if(e.ctrlKey && e.shiftKey && e.key === "V") {
        // ctr || cmd + shift + v
        e.preventDefault();
        window.open( $('.mfn-visualbuilder .sidebar-panel-footer a.menu-viewpage').attr('href') );
        return false;
    }else if(e.metaKey && e.shiftKey && e.key == "v") {
        // ctr || cmd + shift + v
        e.preventDefault();
        window.open( $('.mfn-visualbuilder .sidebar-panel-footer a.menu-viewpage').attr('href') );
        return false;
    }else if((e.ctrlKey || e.metaKey) && e.key == "z") {
        // ctr || cmd + z
        if( !$('.CodeMirror-code').is(':focus') && !$content.find('.mfn-current-editing .mfn-inline-editor').is(":focus") && !$('.panel-edit-item .mfn-field-value').is(':focus') ){
            e.preventDefault();
            if(!$undo.hasClass('loading') && !$undo.hasClass('inactive')){
                $undo.trigger('click');
            }
            return false;
        }else if( $('.panel-edit-item .mfn-field-value:focus').length ){
            setTimeout(function() {
                fieldUpdate($('.panel-edit-item .mfn-field-value:focus'));
            }, 5);
        }
    }else if((e.ctrlKey || e.metaKey) && e.key == "c"){
        // ctr || cmd + c
        if( !window.getSelection && !$content.find('.mfn-current-editing .mfn-inline-editor').is(":focus") && !$content.find('input').is(':focus') && !$content.find('textarea').is(':focus') && !$('input').is(':focus') && !$('textarea').is(':focus') && !$('textarea').is(':focus') && !$('.CodeMirror-code').is(':focus') ){
            e.preventDefault();
            if( $content.find('.mfn-current-editing').length ){
                context_el = $content.find('.mfn-current-editing').attr('data-uid');
                copypaste.copy(context_el);
            }
        }
        return false;
    }else if((e.ctrlKey || e.metaKey) && e.key == "v"){
        // ctr || cmd + v
        if( !$content.find('.mfn-current-editing .mfn-inline-editor').is(":focus") && !$content.find('input').is(':focus') && !$content.find('textarea').is(':focus') && !$('input').is(':focus') && !$('textarea').is(':focus') && !$('.CodeMirror-code').is(':focus') ){
            e.preventDefault();
            if( $content.find('.mfn-current-editing').length ){
                context_el = $content.find('.mfn-current-editing').attr('data-uid');
                let $el = $content.find('.vb-item[data-uid="'+context_el+'"]');
                copypaste.paste($el);
            }
        }
        return false;
    }else if( e.key == "Delete" ){
        // delete
        if( !$content.find('.mfn-current-editing .mfn-inline-editor').is(":focus") && !$('input').is(':focus') && !$('textarea').is(':focus') && !$('.CodeMirror-code').is(':focus') ){
            e.preventDefault();
            $content.find('.mfn-current-editing').find('.mfn-header').first().find('.mfn-element-delete').trigger('click');
        }
        return false;
    }else if( (e.ctrlKey || e.metaKey) && e.key == "d" ){
        // duplicate
        if( $content.find('.mfn-current-editing').length ){
            e.preventDefault();
            $content.find('.mfn-current-editing').find('.mfn-header').first().find('.mfn-module-clone').trigger('click');
        }
        return false;
    }else if( (e.ctrlKey || e.metaKey) && e.key == "p" ){
        // show/hide left panel
        e.preventDefault();
        $('#mfn-sidebar-switcher').trigger('click');
        return false;
    }else if( e.key == "Enter" ){
        // enter
        if( $('.mfn-modal.show').length ){
            e.preventDefault();
            $('.mfn-modal.show .btn-modal-confirm').trigger('click');
        }
        return false;
    }else if( e.key == "Escape" ){
        // Escape
        if( $('.mfn-modal.show .modalbox-header .btn-modal-close').length ){
            e.preventDefault();
            $('.mfn-modal.show .modalbox-header .btn-modal-close').trigger('click');
        }
        if( $('body').hasClass('mfn-navigator-active') ){
            $('.btn-navigator-switcher').trigger('click');
        }
        return false;
    }else if((e.ctrlKey || e.metaKey) && (e.key == "/" || e.key == "?" ) ) {
        // ctr || cmd + /
        e.preventDefault();
        if(!$('.modal-shortcuts').hasClass('show')){
            $('.modal-shortcuts').addClass('show');
        }
        return false;
    }
}

$('.mfn-visualbuilder .sidebar-panel-content ul.items-list li a').contextmenu(function(e) {
    e.preventDefault();

    if( $(e.target).closest('ul').hasClass('fav-items-list') ){
        $('.mfn-items-list-contextmenu ul li a[data-action="love-it"] span.label').text('Remove');
    }else{
        $('.mfn-items-list-contextmenu ul li a[data-action="love-it"] span.label').text('Add to favourites');
    }

    item_name = $(e.target).closest('li').attr('data-type');

    var $li = $('.mfn-visualbuilder .sidebar-panel-content ul.items-list li.mfn-item-'+item_name);
    $('.mfn-items-list-contextmenu').show().css({'left':e.clientX, 'top': e.clientY});

    $(document).bind('click', hideLeftItemsContext);
    $content.find('body').bind('click', hideLeftItemsContext);

});

function hideLeftItemsContext(e) {
    var context = $('.mfn-items-list-contextmenu');

    if (!context.is(e.target) && context.has(e.target).length === 0){
       $('.mfn-items-list-contextmenu').hide();
    }

    $(document).unbind('click', hideLeftItemsContext);
    $content.find('body').unbind('click', hideLeftItemsContext);
}

$('.mfn-fav-items-wrapper h5').on('click', function(e) {
    e.preventDefault();
    $('.mfn-fav-items-wrapper').toggleClass('mfn-favs-closed');
    if( $('.mfn-fav-items-wrapper').hasClass('mfn-favs-closed') ){
        $('.mfn-fav-items-content').slideUp(300);
    }else{
        $('.mfn-fav-items-content').slideDown(300);
    }
});

$('.mfn-items-list-contextmenu ul li a').on('click', function(e) {
    e.preventDefault();
    var action = $(this).attr('data-action');

    $('.mfn-items-list-contextmenu').hide();

    if( action == 'love-it' ){
        $.ajax( ajaxurl, {
          type : "POST",
          data : {
            'mfn-builder-nonce': wpnonce,
            action: 'mfn_builder_favorites',
            item: item_name
          }

        }).done(function(response){
            if( response == 'set'){
                $('.mfn-fav-items-wrapper ul.fav-items-list').append( $('.mfn-visualbuilder .sidebar-panel-content ul.items-list li[data-type="'+item_name+'"]').clone(true) );
            }else{
                $('.mfn-fav-items-wrapper ul.fav-items-list li[data-type="'+item_name+'"]').remove();
            }

            if( !$('.mfn-fav-items-wrapper ul.fav-items-list li').length ){
                $('.mfn-fav-items-wrapper').removeClass('isset-favs').addClass('empty-favs');
            }else{
                $('.mfn-fav-items-wrapper').addClass('isset-favs').removeClass('empty-favs');
            }
        });
    }
});

function init() {

    iframeReady(); // sections toolbar buttons
    historyClick(); // history back click

    uploader.browse();
    uploader.delete();
    uploader.deleteAllGallery();
    uploader.sortable();

    runSorting();

    var mac = /(Mac)/i.test(navigator.platform);

    if (mac) {
        $content.find('body').addClass('mfn-mac');
        $('body').addClass('mfn-mac');
    }

    if(window.location.hash && window.location.hash == '#page-options-tab') {
        $(window.location.hash).trigger('click');
    }

    $('.mfn-visualbuilder .sidebar-panel-content ul.items-list li').on('mousedown', function(e) {
        if (e.which != 3) calculateIframeHeight();
    }).on('mouseup', resetIframeHeight);

    if($content.find('.masonry').length){
        $content.find('.masonry').each(function() {
            $(this).addClass('mfn-initialized');
        });
    }

    document.getElementById('mfn-vb-ifr').contentWindow.addEventListener('keydown', function(event) {
        catchShortcuts(event);
    });

    if($content.find('.isotope').length){
        $content.find('.isotope').each(function() {
            $(this).addClass('mfn-initialized');
        });
    }

    if(!mfnbuilder.clipboard){
        $content.find('.section-header .mfn-section-import').addClass('mfn-disabled');
    }

    if( $content.find('#Header_wrapper .mfn-main-slider.mfn-rev-slider').length ){
        $content.find('#Header_wrapper .mfn-main-slider.mfn-rev-slider').append('<a href="'+mfnvbvars.adminurl+'admin.php?page=revslider&view=slide&alias='+mfnvbvars.rev_slider_id+'" target="_blank" data-tooltip="Edit with Slider Revolution" class="btn-edit-slider" data-position="before">Edit Slider</a>');
    }

    if( $content.find('#Footer').length ){
        $content.find('#Footer').append('<a href="'+mfnvbvars.adminurl+'widgets.php" target="_blank" data-tooltip="Edit Footer" class="btn-edit-footer" data-position="before">Edit Footer</a>');
    }

    $('.mfn-preloader .loading-text').fadeOut(function() {
        $('.mfn-preloader .loading-text').html('Generating page local CSS <div class="dots"></div>');
    }).fadeIn();

    loopAllStyleFields();

    checkEmptyWraps();
    checkEmptyPage();
    checkEmptySections();

    modernmenu.start();
    settings.start();
    inlineEditor();

    if( $content.find('.section_video .mfn-vb-video-lazy').length ){
        $content.find('.section_video .mfn-vb-video-lazy').each(function() {
            $(this).replaceWith( $(this).html().replace('<!--', '').replace('-->', '') );
        })
    }

    setTimeout(addHistory, 500);

    $('.mfn-preloader').fadeOut(500, function() {
        $('body').removeClass('mfn-preloader-active');
    });

}

function loopAllStyleFields(uid = false){
    var copied = [];

    if( uid ){
        copied = mfnvbvars.pagedata.filter( (item) => item.uid == uid );
    }else{
        copied = mfnvbvars.pagedata;
    }

    $.each(copied, function(i, v) {
        if( v.jsclass == 'wrap' || v.jsclass == 'section' ){
            $.each(v.attr, function(a, attr) {
                if( a.includes('style:') ){
                    a = a.replaceAll('mfnuidelement', v.uid);
                    grabArrStyle(a, attr, v.uid);
                }
            });
        }else{
            $.each(v.fields, function(a, attr) {
                if( a.includes('style:') ){
                    a = a.replaceAll('mfnuidelement', v.uid);
                    grabArrStyle(a, attr, v.uid);
                }
            });
        }
    });

    copied = [];

}

$('#mfn-sidebar-switcher').on('click', function() {
    var $sidebar = $('.mfn-visualbuilder .sidebar-wrapper');
    var sidebarW = $sidebar.outerWidth();

    if( $('.mfn-visualbuilder').hasClass('sidebar_hidden') ){
        $('.mfn-visualbuilder').removeClass('sidebar_hidden');
        $content.find('body').removeClass('sidebar_hidden');
        $sidebar.css({ 'left': '0'});
        $('.mfn-visualbuilder .preview-wrapper').css({'margin-left': sidebarW+'px'});
    }else{
        $('.mfn-visualbuilder').addClass('sidebar_hidden');
        $sidebar.css({ 'left': '-'+sidebarW+'px'});
        $('.mfn-visualbuilder .preview-wrapper').css({'margin-left': '0'});
        $content.find('body').addClass('sidebar_hidden');
    }
});

/* Sidebar Resizer */

var resizer = document.getElementById('mfn-sidebar-resizer');
var sidebar = document.getElementById('mfn-vb-sidebar');
var preview = document.getElementById('mfn-preview-wrapper-holder');
var startY, startX, startWidth, endWidth = 420;

resizer.addEventListener('mousedown', initDrag, false);

function initDrag(e) {
    startX = e.clientX;
    sidebar.classList.add("resizing-active");
    startWidth = parseInt(sidebar.offsetWidth, 10);
    document.documentElement.addEventListener('mousemove', doDrag, false);
    document.documentElement.addEventListener('mouseup', stopDrag, false);
}

function doDrag(e) {
    endWidth = (startWidth + e.clientX - startX);
    if(endWidth < 1200 && endWidth > 400){
        sidebar.style.width = endWidth+"px";
        sidebar.style.maxWidth = endWidth+"px";
        preview.style.marginLeft = endWidth+"px";

        if( endWidth > 800 ){
            $('.mfn-visualbuilder .sidebar-wrapper').addClass('mfn-items-4-columns').removeClass('mfn-items-3-columns');
        }else if( endWidth > 550 ){
            $('.mfn-visualbuilder .sidebar-wrapper').addClass('mfn-items-3-columns').removeClass('mfn-items-4-columns');
        }else{
            $('.mfn-visualbuilder .sidebar-wrapper').removeClass('mfn-items-3-columns mfn-items-4-columns');
        }
    }
}

function stopDrag(e) {
    sidebar.classList.remove("resizing-active");
    document.documentElement.removeEventListener('mousemove', doDrag, false);
    document.documentElement.removeEventListener('mouseup', stopDrag, false);
}

function addHistory(){
    //return false;
    if( !historyAllow ) return;

    var history = localStorage.getItem('mfnhistory') ? JSON.parse(localStorage.getItem('mfnhistory')) : [];

    if( historyIndex > 0){
        history = history.filter( (y,x) => x >= historyIndex );
    }

    historyIndex = 0;

    $('.sidebar-panel-footer .mfn-history-btn.btn-undo').addClass('loading');
    //setTimeout(function() {

        //var $html = $content.find('.mfn-builder-content').clone();

        /*if( $html.find('.slick-initialized').length ){
            $html.find('.slick-initialized').each(function() {
                $(this).slick('unslick');
            });
        }*/

        history.unshift({
            'html': $content.find('.mfn-builder-content').html(),
            'form': JSON.stringify(mfnvbvars.pagedata),
            'navigator': $navigator.find('.navigator-tree').html()
        });

        try {
            localStorage.setItem('mfnhistory', JSON.stringify( history.filter((item,i) => { return i < 10 }) ));
        } catch (e) {
            localStorage.setItem('mfnhistory', JSON.stringify( history.filter((item,i) => { return i < 1 }) ));
        }

        history = false;

        $('.sidebar-panel-footer .mfn-history-btn.btn-undo').removeClass('loading');
        checkHistoryIndex();

    //}, 50);

    //console.log('add history');

    enableBeforeUnload();
}

function historyClick(){
    $('.sidebar-panel-footer .mfn-history-btn').on('click', function(e) {
        e.preventDefault();
        $el = $(this);

        if( wyswig_active ){
            wyswig_active = false;
            if( $editpanel.find( '.panel-edit-item .mfn-form .html-editor' ).length ) MfnFieldTextarea.destroy();
            if( $editpanel.find( '.panel-edit-item .mfn-form .visual-editor' ).length ) tinymce.execCommand( 'mceRemoveEditor', false, 'mfn-editor' );
        }

        if(!$el.hasClass('inactive') && !$el.hasClass('loading')){

            let historyAction = 'undo';

            if( $el.hasClass('btn-redo') && historyIndex > 0 ){
                historyAction = 'redo';
                historyIndex--;
            }else if( $el.hasClass('btn-undo') && historyIndex < history.length ){
                historyIndex++;
            }else{
                checkHistoryIndex();
                return;
            }

            $el.addClass('loading');

            historyRun(historyAction, historyIndex);

        }

    });
}

function historyRun(historyAction, historyIndex){
    var history = localStorage.getItem('mfnhistory') ? JSON.parse(localStorage.getItem('mfnhistory')) : [];

    var h_event = history[historyIndex];

    if( !h_event ) {
        checkHistoryIndex();
        $('.sidebar-panel-footer .mfn-history-btn').removeClass('loading');
        return;
    }

    edited_item = false;

    backToWidgets();

    $content.find('.mfn-builder-content').html( h_event.html );
    $navigator.find('.navigator-tree').html(h_event.navigator);
    mfnvbvars.pagedata = JSON.parse(h_event.form);

    $content.find("style.mfn-local-style").remove();

    if( $content.find('.mfn-current-editing').length ){
        $content.find('.mfn-current-editing').removeClass('mfn-current-editing');
    }

    if( $content.find('.loading.disabled').length ){
        $content.find('.loading.disabled').removeClass('loading disabled');
    }

    if( $content.find('.mfn-initialized').length ){
        $content.find('.mfn-initialized').removeClass('mfn-initialized mfn-watchChanges mfn-blur-action mfn-focused').removeAttr('data-medium-editor-element medium-editor-index');
        inlineEditors = [];
    }

    $('.sidebar-panel-footer .mfn-history-btn').removeClass('loading');
    history = false;
    runAjaxElements();
    inlineEditor();
    loopAllStyleFields();
    checkHistoryIndex();
}

function checkHistoryIndex(){
    var history = localStorage.getItem('mfnhistory') ? JSON.parse(localStorage.getItem('mfnhistory')) : [];

    if(historyIndex < history.length-1){
        $undo.removeClass('inactive');
    }else{
        $undo.addClass('inactive');
    }

    if(historyIndex < 1){
        $redo.addClass('inactive');
    }else{
        $redo.removeClass('inactive');
    }
    history = false;
}


function calculateIframeHeight(){
    $content.find('body').addClass('hover');
    scroll_top = $content.find("html, body").scrollTop();
    $('.frameOverlay').height( $content.find("body").height() );
    $content.find("html").css({ 'overflow': 'hidden' });
    $(window).scrollTop( scroll_top );
    $('iframe#mfn-vb-ifr').css({ 'margin-top': scroll_top });
    $(window).on('scroll', function() {
        $content.find('html, body').scrollTop( $(this).scrollTop() );
        $('iframe#mfn-vb-ifr').css({ 'margin-top': $(this).scrollTop() });
    });
    runSorting();
}

function resetIframeHeight(){
    $(window).off('scroll');
    $content.find("html").css({ 'overflow': 'auto' });
    $('.frameOverlay').removeAttr('style');
    $('iframe#mfn-vb-ifr').removeAttr('style');

    runSorting();
}

function hideContext(e) {
    var context = $content.find('.mfn-builder-area-contextmenu');

    if (!context.is(e.target) && context.has(e.target).length === 0){
       $content.find('.mfn-builder-area-contextmenu').hide();
    }

    $content.find('body').unbind('click', hideContext);
}

function hideContextEditor(e) {
    var context = $('.mfn-builder-area-contextmenu');

    if (!context.is(e.target) && context.has(e.target).length === 0){
       $('.mfn-builder-area-contextmenu').hide();
    }

    $('body').unbind('click', hideContextEditor);
}

function iframeReady(){
    sliderInput.unitChange();
    sliderInput.customValue();
    presets.init();

    $content.on('click', '.mcb-column-inner div:not(.mfn-header) a', function(e) {
        e.preventDefault();
    });

    // add element button in wrap
    $content.find('.mfn-builder-content').on('click', '.mfn-item-add', function(e) {
        e.preventDefault();
        backToWidgets();
    });

    if( $content && $content.find('.mcb-item-product_images-inner .woocommerce-product-gallery').length ){
        $content.find('.mcb-item-product_images-inner .woocommerce-product-gallery').addClass('mfn-initialized');
    }

    // sections context menu
    $content.find('.mfn-builder-content').on('click', '.section .mfn-option-dropdown .dropdown-wrapper a.mfn-dropdown-item', function(e) {
        e.preventDefault();

        let $it = $(this).closest('.mcb-section');
        let sec_uid = $it.data('uid');
        let sections_count = $content.find('.mcb-section').length-1;
        //edited_item = mfnvbvars.pagedata.filter( (item) => item.sec_uid == uid )[0];


        if($(this).hasClass('mfn-section-hide')){
            // hide
            if($it.hasClass('hide')){
                $(this).find('.label').text($(this).attr('data-hide'));
                mfnvbvars.pagedata.filter( (item) => item.uid == sec_uid )[0]['attr']['hide'] = '';
            }else{
                $(this).find('.label').text($(this).attr('data-show'));
                mfnvbvars.pagedata.filter( (item) => item.uid == sec_uid )[0]['attr']['hide'] = 1;
            }
            $it.toggleClass('hide');
        }else if($(this).hasClass('mfn-section-move-down')){
            // move down
            if($it.attr('data-order') < sections_count){
                $it.insertAfter($it.next());

                addHistory();
            }
        }else if($(this).hasClass('mfn-section-move-up')){
            // move up
            if($it.attr('data-order') > 0){
                $it.insertBefore($it.prev());

                addHistory();
            }
        }else if( $(this).hasClass('mfn-section-export') ){
            // export
            elementToClipboard(sec_uid);
        }else if( !$(this).hasClass('mfn-disabled') && $(this).hasClass('mfn-section-import-before') ){
            // import before
            importFromClipboard(sec_uid, 'before');
        }else if( !$(this).hasClass('mfn-disabled') && $(this).hasClass('mfn-section-import-after') ){
            // import after
            importFromClipboard(sec_uid, 'after');
        }

    });

    // add new section "+" addnewsection addsection
    $content.find('.mfn-builder-content').on('click', '.mfn-section-add', function(e) {
        e.preventDefault();

        if(!$content.find('.mfn-section-add').hasClass('loading')){

            $content.find('.mfn-section-add').addClass('loading');

            var new_element = elements.section();
            var navigator_html = navigatorHtml('Section', new_element.uid);

            let uid = $(this).parent().data('uid');
            let count = $content.find('.mcb-section').length;
            let placement = 'next';
            if($(this).hasClass('prev')){placement = 'prev';}

            removeStartBuilding();

            if (typeof(uid) !== 'undefined') {
                if(placement == 'prev'){
                    $content.find('#Content .sections_group .mfn-builder-content .mcb-section-'+uid).before( new_element.html );
                    $navigator.find('.navigator-tree .nav-'+uid).before(navigator_html);
                }else{
                    $content.find('#Content .sections_group .mfn-builder-content .mcb-section-'+uid).after( new_element.html );
                    $navigator.find('.navigator-tree .nav-'+uid).after(navigator_html);
                }
            }else{
                $content.find('.mfn-builder-content').prepend( new_element.html );
                $navigator.find('.navigator-tree').prepend(navigator_html);
            }

            $content.find('.mfn-section-add').removeClass('loading');

            blink();
            addHistory();

            // open edit section
            if($content && $content.find('.mfn-builder-content .mfn-new-item .mfn-element-edit').length){
                $content.find('.mfn-builder-content .mfn-new-item .mfn-element-edit').trigger('click');
                $content.find('.mfn-builder-content .mfn-new-item').removeClass('mfn-new-item');
            }

        }
    });

    $content.find('.mfn-builder-content').on('click', '.wrap-layout', function(e) {
        e.preventDefault();
        if(!$content.find('.wrap-layouts').hasClass('loading')){

            var navigator_tree = '';

            $content.find('.wrap-layouts').addClass('loading');

            let section = $(this).parent().parent().parent().parent().data('order');
            let id = $(this).parent().parent().parent().parent().data('uid');
            let type = $(this).data('type');

            if($content.find('.mfn-builder-content .mcb-section-'+id+' .mfn-section-new').length){ $content.find('.mfn-builder-content .mcb-section-'+id+' .mfn-section-new').remove(); }

            if( type == 'wrap-141214' ){
                var new_element = elements.wrap('1/4');
                var new_element2 = elements.wrap('1/2');
                var new_element3 = elements.wrap('1/4');
                navigator_tree += navigatorHtml('Wrap', new_element.uid, '1/4');
                navigator_tree += navigatorHtml('Wrap', new_element2.uid, '1/2');
                navigator_tree += navigatorHtml('Wrap', new_element3.uid, '1/4');
                $content.find('#Content .sections_group .mfn-builder-content .mcb-section-'+id+' .section_wrapper').append( new_element.html );
                $content.find('#Content .sections_group .mfn-builder-content .mcb-section-'+id+' .section_wrapper').append( new_element2.html );
                $content.find('#Content .sections_group .mfn-builder-content .mcb-section-'+id+' .section_wrapper').append( new_element3.html );
            }else if( type == 'wrap-2313' ){
                var new_element = elements.wrap('2/3');
                var new_element2 = elements.wrap('1/3');
                navigator_tree += navigatorHtml('Wrap', new_element.uid, '2/3');
                navigator_tree += navigatorHtml('Wrap', new_element2.uid, '1/3');
                $content.find('#Content .sections_group .mfn-builder-content .mcb-section-'+id+' .section_wrapper').append( new_element.html );
                $content.find('#Content .sections_group .mfn-builder-content .mcb-section-'+id+' .section_wrapper').append( new_element2.html );
            }else if( type == 'wrap-1323' ){
                var new_element = elements.wrap('1/3');
                var new_element2 = elements.wrap('2/3');
                navigator_tree += navigatorHtml('Wrap', new_element.uid, '1/3');
                navigator_tree += navigatorHtml('Wrap', new_element2.uid, '2/3');
                $content.find('#Content .sections_group .mfn-builder-content .mcb-section-'+id+' .section_wrapper').append( new_element.html );
                $content.find('#Content .sections_group .mfn-builder-content .mcb-section-'+id+' .section_wrapper').append( new_element2.html );
            }else if( type == 'wrap-14' ){
                var new_element = elements.wrap('1/4');
                var new_element2 = elements.wrap('1/4');
                var new_element3 = elements.wrap('1/4');
                var new_element4 = elements.wrap('1/4');
                navigator_tree += navigatorHtml('Wrap', new_element.uid, '1/4');
                navigator_tree += navigatorHtml('Wrap', new_element2.uid, '1/4');
                navigator_tree += navigatorHtml('Wrap', new_element3.uid, '1/4');
                navigator_tree += navigatorHtml('Wrap', new_element4.uid, '1/4');
                $content.find('#Content .sections_group .mfn-builder-content .mcb-section-'+id+' .section_wrapper').append( new_element.html );
                $content.find('#Content .sections_group .mfn-builder-content .mcb-section-'+id+' .section_wrapper').append( new_element2.html );
                $content.find('#Content .sections_group .mfn-builder-content .mcb-section-'+id+' .section_wrapper').append( new_element3.html );
                $content.find('#Content .sections_group .mfn-builder-content .mcb-section-'+id+' .section_wrapper').append( new_element4.html );
            }else if( type == 'wrap-13' ){
                var new_element = elements.wrap('1/3');
                var new_element2 = elements.wrap('1/3');
                var new_element3 = elements.wrap('1/3');
                navigator_tree += navigatorHtml('Wrap', new_element.uid, '1/3');
                navigator_tree += navigatorHtml('Wrap', new_element2.uid, '1/3');
                navigator_tree += navigatorHtml('Wrap', new_element3.uid, '1/3');
                $content.find('#Content .sections_group .mfn-builder-content .mcb-section-'+id+' .section_wrapper').append( new_element.html );
                $content.find('#Content .sections_group .mfn-builder-content .mcb-section-'+id+' .section_wrapper').append( new_element2.html );
                $content.find('#Content .sections_group .mfn-builder-content .mcb-section-'+id+' .section_wrapper').append( new_element3.html );
            }else if( type == 'wrap-12' ){
                var new_element = elements.wrap('1/2');
                var new_element2 = elements.wrap('1/2');
                navigator_tree += navigatorHtml('Wrap', new_element.uid, '1/2');
                navigator_tree += navigatorHtml('Wrap', new_element2.uid, '1/2');
                $content.find('#Content .sections_group .mfn-builder-content .mcb-section-'+id+' .section_wrapper').append( new_element.html );
                $content.find('#Content .sections_group .mfn-builder-content .mcb-section-'+id+' .section_wrapper').append( new_element2.html );
            }else{
                var new_element = elements.wrap('1/1');
                navigator_tree += navigatorHtml('Wrap', new_element.uid, '1/1');
                $content.find('#Content .sections_group .mfn-builder-content .mcb-section-'+id+' .section_wrapper').append( new_element.html );
            }

            if($content.find('.mcb-section-'+id+' .mfn-section-new').length){ $content.find('.mcb-section-'+id+' .mfn-section-new').remove(); }
            if($content.find('.mcb-section-'+id).hasClass('empty')){ $content.find('.mcb-section-'+id).removeClass('empty'); }

            if( !$navigator.find('.navigator-tree .nav-'+id+' ul').length ){
                $navigator.find('.navigator-tree .nav-'+id).append('<ul class="mfn-sub-nav">'+navigator_tree+'</ul>');
            }else{
                $navigator.find('.navigator-tree .nav-'+id+' > ul').append(navigator_tree);
            }

            backToWidgets();

            runSorting();

            $content.find('.wrap-layouts').removeClass('loading');

            blink();
            addHistory();

        }

    })

    $content.find('.mfn-builder-content').on('click', '.prebuilt-button', function(e) {
        e.preventDefault();
        showPrebuilts();
        prebuiltType = $(this).closest('.mcb-section').data('uid');
    });

    $content.find('body').append('<div style="position: absolute; z-index: 999;" class="mfn-contextmenu mfn-builder-area-contextmenu"><h6 class="mfn-context-header">Section</h6><ul><li class="mfn-contextmenu-edit"><a href="#" data-action="edit"><span class="mfn-icon mfn-icon-edit"></span><span class="label">Edit</span></a></li><li class="mfn-contextmenu-copy"><a href="#" class="mfn-context-copy" data-action="copy"><span class="mfn-icon mfn-icon-copy"></span><span class="label">Copy</span></a></li><li class="mfn-contextmenu-paste"><a href="#" class="mfn-context-paste" data-action="paste"><span class="mfn-icon mfn-icon-paste"></span><span class="label">Paste</span></a></li><li class="mfn-contextmenu-copystyle"><a href="#" class="mfn-context-copy" data-action="copy"><span class="mfn-icon mfn-icon-copy-style"></span><span class="label">Copy style</span></a></li><li class="mfn-contextmenu-pastestyle"><a href="#" class="mfn-context-paste-style" data-action="paste-style"><span class="mfn-icon mfn-icon-paste-style"></span><span class="label">Paste style</span></a></li><li class="mfn-contextmenu-resetstyle"><a href="#" class="mfn-context-reset-style" data-action="reset-style"><span class="mfn-icon mfn-icon-reset-style"></span><span class="label">Reset style</span></a></li><li class="mfn-contextmenu-save-preset preset-action-button"><a href="#" data-action="save-preset"><span class="mfn-icon mfn-icon-preset"></span><span class="label">Save as preset</span></a></li><li class="mfn-contextmenu-navigator"><a href="#" data-action="navigator"><span class="mfn-icon mfn-icon-navigator"></span><span class="label">Navigator</span></a></li><li class="mfn-contextmenu-delete"><a href="#" data-action="delete"><span class="mfn-icon mfn-icon-delete-red"></span><span class="label">Delete</span></a></li></ul></div>');

    $content.find('.mfn-builder-content').on('click', '.mfn-element-drag', function(e) { e.preventDefault(); });

    $content.find('.mfn-builder-content').on('click', '.mfn-header .mfn-option-dropdown a', function(e) { e.preventDefault(); });

    // inline editor preven default
    $content.find('.mfn-builder-content').on('click', '.mfn-inline-editor a', function(e) {
        e.preventDefault();

    });

    // Context menu for builder
    $content.find('.mfn-builder-content').contextmenu(function(e) {
        if( $('#mfn-visualbuilder.mfn-ui').hasClass('sidebar_hidden') ) return;
        e.preventDefault();

        if(e.target.closest('.vb-item')){

            $content.find('.mfn-builder-area-contextmenu').show().css({left:e.pageX, top: e.pageY});
            context_el = $(e.target).closest('.vb-item').attr('data-uid');

            var this_el = mfnvbvars.pagedata.filter( (item) => item.uid == context_el )[0];

            if( $(e.target).closest('.vb-item').hasClass('mcb-section')){
                $content.find('.mfn-builder-area-contextmenu .mfn-context-header').text('Section');
            }else if( $(e.target).closest('.mcb-column-inner').length ){
                $content.find('.mfn-builder-area-contextmenu .mfn-context-header').text( this_el.title );
            }else{
                context_el = $(e.target).closest('.mcb-wrap').attr('data-uid');
                $content.find('.mfn-builder-area-contextmenu .mfn-context-header').text('Wrap');
            }

            if(!mfncopy){
                $content.find('.mfn-builder-area-contextmenu .mfn-context-paste').addClass('mfn-context-inactive');
                $content.find('.mfn-builder-area-contextmenu .mfn-context-paste-style').addClass('mfn-context-inactive');
            }else{
                $content.find('.mfn-builder-area-contextmenu .mfn-context-paste').removeClass('mfn-context-inactive');
                $content.find('.mfn-builder-area-contextmenu .mfn-context-paste-style').removeClass('mfn-context-inactive');
            }

            var copied_el = mfnvbvars.pagedata.filter( (item) => item.uid == mfncopy )[0];

            if( !copied_el || !this_el || this_el.jsclass != copied_el.jsclass ){
                $content.find('.mfn-builder-area-contextmenu .mfn-context-paste-style').addClass('mfn-context-inactive');
            }

            if( this_el.jsclass == 'section' || this_el.jsclass == 'wrap' ){
                $content.find('.mfn-builder-area-contextmenu .mfn-contextmenu-save-preset').hide();
            }else{
                $content.find('.mfn-builder-area-contextmenu .mfn-contextmenu-save-preset').show();
            }

        }

        $content.find('body').bind('click', hideContext);
    });

    // Context menu for navigator
    $navigator.contextmenu(function(e) {
        if( $('#mfn-visualbuilder.mfn-ui').hasClass('sidebar_hidden') ) return;
        e.preventDefault();

        if( $(e.target).closest('li') ){

            context_el = $(e.target).attr('data-uid');

            $('.mfn-builder-area-contextmenu').show().css({left:e.pageX, top: e.pageY});

            if( $(e.target).closest('li').hasClass('navigator-section')){
                $('.mfn-builder-area-contextmenu .mfn-context-header').text('Section');
            }else if( $(e.target).closest('li').hasClass('navigator-wrap')){
                $('.mfn-builder-area-contextmenu .mfn-context-header').text('Wrap');
            }else if( $(e.target).closest('li').hasClass('navigator-item')){
                $('.mfn-builder-area-contextmenu .mfn-context-header').text('Item');
            }

            if(!mfncopy){
                $navigator.find('.mfn-builder-area-contextmenu .mfn-context-paste').addClass('mfn-context-inactive');
                $navigator.find('.mfn-builder-area-contextmenu .mfn-context-paste-style').addClass('mfn-context-inactive');
            }else{
                $navigator.find('.mfn-builder-area-contextmenu .mfn-context-paste').removeClass('mfn-context-inactive');
                $navigator.find('.mfn-builder-area-contextmenu .mfn-context-paste-style').removeClass('mfn-context-inactive');
            }

            if( mfncopy && $('.mfn-vb-'+context_el).attr('data-item') != $('.mfn-vb-'+mfncopy).attr('data-item') ){
                $navigator.find('.mfn-builder-area-contextmenu .mfn-context-paste-style').addClass('mfn-context-inactive');
            }



            $('body').bind('click', hideContextEditor);

        }
    });

    // context menu actions

    $content.find('.mfn-builder-area-contextmenu li a').on('click', function(e) {
        e.preventDefault();
        let action = $(this).data('action');

        if(action == 'delete'){
            $content.find('.vb-item[data-uid="'+context_el+'"]').find('.mfn-header').first().find('.mfn-element-delete').trigger('click');
        }else if(action == 'edit'){
            $content.find('.vb-item[data-uid="'+context_el+'"]').find('.mfn-header').first().find('.mfn-element-edit').trigger('click');
        }else if(action == 'copy'){
            copypaste.copy(context_el);
        }else if(action == 'paste'){
            let $el = $content.find('.vb-item[data-uid="'+context_el+'"]');
            copypaste.paste($el);
        }else if(action == 'paste-style'){

            if( !mfncopy ) return;

            var copied_el   = mfnvbvars.pagedata.filter( (item) => item.uid == mfncopy )[0];
            var this_el     = mfnvbvars.pagedata.filter( (item) => item.uid == context_el )[0];

            if( copied_el.jsclass != this_el.jsclass ){
                return; // different items
            }

            var listStyles = {};

            if( copied_el.jsclass == 'section' || copied_el.jsclass == 'wrap' ){
                for (key in copied_el.attr) {
                    if (key.startsWith('style:')) {
                        this_el.attr[key] = JSON.parse( JSON.stringify(copied_el.attr[key]));

                    }
                }
            }else{
                for (key in copied_el.fields) {
                    if(key.startsWith('style:')) {
                        this_el.fields[key] =  JSON.parse( JSON.stringify(copied_el.fields[key]));
                    }
                }
            }

            loopAllStyleFields(context_el);
            addHistory();
        }else if(action == 'save-preset'){
            presets.modal( context_el );
        }else if(action == 'reset-style'){
            var this_el = mfnvbvars.pagedata.filter( (item) => item.uid == context_el )[0];

            var listStyles = {};

            if( this_el.jsclass == 'section' || this_el.jsclass == 'wrap' ){
                listStyles = this_el.attr;
            }else{
                listStyles = this_el.fields;
            }

            for(key in listStyles) {
                if(key.startsWith('style:')) {
                    delete listStyles[key];
                }
            }

            $content.find('style.mfn-local-style').remove();

            loopAllStyleFields();

             $content.find('.vb-item[data-uid="'+context_el+'"]').find('.mfn-header').first().find('.mfn-element-edit').trigger('click');

            addHistory();
        }else if(action == 'navigator'){
            $('body').addClass('mfn-navigator-active');
            if( !$navigator.find('li.nav-'+context_el).hasClass('active') ){
                if( !$navigator.find('li.nav-'+context_el).closest('li.navigator-section').hasClass('active') ){
                    $navigator.find('li.nav-'+context_el).closest('li.navigator-section').children('.navigator-arrow').trigger('click');
                }
                if( !$navigator.find('li.nav-'+context_el).closest('li.navigator-wrap').hasClass('active') ){
                    $navigator.find('li.nav-'+context_el).closest('li.navigator-wrap').children('.navigator-arrow').trigger('click');
                }
                $navigator.find('li.nav-'+context_el+' > a').trigger('click');
            }
        }
        $content.find('.mfn-builder-area-contextmenu').hide();
    });

    $('.mfn-builder-area-contextmenu li a').on('click', function(e) {
        e.preventDefault();
        let action = $(this).data('action');

        if(action == 'delete'){
            $content.find('.vb-item[data-uid="'+context_el+'"]').find('.mfn-header').first().find('.mfn-element-delete').trigger('click');
        }else if(action == 'edit'){
            $content.find('.vb-item[data-uid="'+context_el+'"]').find('.mfn-header').first().find('.mfn-element-edit').trigger('click');
        }else if(action == 'copy'){

            copypaste.copy(context_el);
            $content.find('.mfn-builder-area-contextmenu').hide();

        }else if(action == 'paste'){
            $content.find('.mfn-builder-area-contextmenu').hide();
            let $el = $content.find('.vb-item[data-uid="'+context_el+'"]');
            copypaste.paste($el);
        }
        $('.mfn-builder-area-contextmenu').hide();
    });

    // size label +- show
    $content.find('.mfn-builder-content').on('click', '.mfn-header .mfn-option-btn.mfn-size-label', function(e) {
        if( $content.find('body').hasClass('mfn-modern-nav') ){
            $(this).closest('.mfn-header').toggleClass('mfn-size-change-show');
        }
    });

    // edit on box click
    $content.find('.mfn-builder-content').on('mouseup', function(e) {
        //e.preventDefault();

        if( preventEdit ) return;

        if(
            $(e.target).closest('.column_placeholder').length ||
            !$(e.target).closest('.vb-item').length ||
            $(e.target).closest('.mfn-wrap-add-item').length ||
            $(e.target).closest('.mfn-section-start').length ||
            $(e.target).closest('.mcb-section.empty').length ||
            $(e.target).closest('.divider').length ||
            $(e.target).closest('.mcb-wrap-inner.empty').length ||
            iframe.getSelection().toString() ||
            ( $(e.target).closest('.mfn-header').length && !$(e.target).hasClass('section-header') )
            ) {
            return;
        }

        if( $content.find('body').hasClass('mfn-modern-nav') && !$(e.target).closest('.mfn-header.mfn-element-menu-opened').length ){
            $content.find('.mfn-header.mfn-element-menu-opened').removeClass('mfn-element-menu-opened mfn-size-change-show');
        }

        if( $(e.target).hasClass('mcb-column') ){
            $edited_div = $(e.target).closest('.mcb-wrap');
        }else{
            $edited_div = $(e.target).closest('.vb-item');
        }

        if( !$edited_div.hasClass('mfn-current-editing') ){
            openEditForm.do($edited_div, false);
        }

    });

    // edit on icon click
    $content.find('.mfn-builder-content').on('click', '.mfn-header .mfn-element-edit', function(e) {
        e.preventDefault();
        if( preventEdit ) return;
        $edited_div = $(this).closest('.vb-item');
        //if( !$edited_div.hasClass('mfn-current-editing') ){
            openEditForm.do($edited_div, false);
        //}
    });

    // resize
    $content.find('.mfn-builder-content').on('click', '.mfn-header .mfn-size-change', function(e) {
        e.preventDefault();

        let uid = $(this).closest('.vb-item').attr('data-uid');
        edited_item = mfnvbvars.pagedata.filter( (item) => item.uid == uid )[0];
        let type = edited_item.type;

        let currClass = sizes.filter(size => size.key === edited_item.size)[0];

        if( !edited_item.mobile_size ) edited_item.mobile_size = '1/1';
        if( !edited_item.tablet_size ) edited_item.tablet_size = edited_item.size;

        if(screen == 'tablet'){
            currClass = sizes.filter(size => size.key === edited_item.tablet_size)[0];
        }else if(screen == 'mobile'){
            currClass = sizes.filter(size => size.key === edited_item.mobile_size)[0];
        }

        /*console.log(edited_item);

        // reset custom width after change +-
        if( $custom_sizeInput.length && $custom_sizeInput.val() != '' ){
            $custom_sizeInput.val('').trigger('change');
            $content.find('.vb-item[data-uid='+uid+'] > div > .mfn-header .mfn-element-size-label').text(currClass.key);
            $('.mfn-vb-'+uid+' .modalbox-card-advanced-'+uid+' .preview-width_switcherinput').val('default').trigger('change');
            return;
        }*/

        let newIndex = currClass.index;

        if( $(this).hasClass('mfn-size-decrease') ){
            newIndex = newIndex - 1 < 1 ? 1 : newIndex - 1;
        }else{
            newIndex = newIndex + 1 > 12 ? 12 : newIndex + 1;
        }

        let newClass = sizes.filter(size => size.index === newIndex)[0];

        if( !items_size[type] || ( items_size[type].length && items_size[type].includes(newClass.key) ) ){

            if($content.find('.vb-item[data-uid='+uid+'] > div > .mfn-header .mfn-element-size-label').length){
                $content.find('.vb-item[data-uid='+uid+'] > div > .mfn-header .mfn-element-size-label').text(newClass.key);
            }

            $content.find('.vb-item[data-uid='+uid+']').attr('data-'+screen+'-size', newClass.key);

            if(screen == 'desktop'){
                $content.find('.vb-item[data-uid='+uid+']').removeClass(currClass.desktop).addClass(newClass.desktop).attr('data-'+screen+'-col', newClass.desktop);
                edited_item.size = newClass.key;

                if(edited_item.tablet_resized && edited_item.tablet_resized == '0' ) {
                    edited_item.tablet_size = newClass.key;
                    $content.find('.vb-item[data-uid='+uid+']').removeClass(currClass.tablet).addClass(newClass.tablet).attr('data-tablet-size', newClass.key);
                }

            }else if(screen == 'tablet'){
                $content.find('.vb-item[data-uid='+uid+']').removeClass(currClass.tablet).addClass(newClass.tablet).attr('data-'+screen+'-col', newClass.tablet);
                edited_item.tablet_resized = '1';
                edited_item.tablet_size = newClass.key;
            }else{
                $content.find('.vb-item[data-uid='+uid+']').removeClass(currClass.mobile).addClass(newClass.mobile).attr('data-'+screen+'-col', newClass.mobile);
                edited_item.mobile_size = newClass.key;
            }

            if($navigator.find('.navigator-tree li.nav-'+uid+' .navigator-size-label').length){
                $navigator.find('.navigator-tree li.nav-'+uid+' .navigator-size-label').text(newClass.key);
            }

        }

        resetBeforeAfter(uid);

        if($content.find('.vb-item[data-uid='+uid+'] .slick-initialized').length){
            $content.find('.vb-item[data-uid='+uid+'] .slick-initialized').each(function() {
                $(this).slick('setPosition');
            });
        }

        if($content.find('.vb-item[data-uid='+uid+'] .isotope.mfn-initialized').length){
            $content.find('.vb-item[data-uid='+uid+'] .isotope.mfn-initialized').each(function() {
                var $iso_wrapper = $(this);
                $iso_wrapper.closest('.mcb-column-inner').css('min-height', $iso_wrapper.closest('.mcb-column-inner').outerHeight());
                $iso_wrapper.removeClass('mfn-initialized');
                runAjaxElements();
            });
        }

        if( $content.find('.vb-item[data-uid='+uid+'] .woocommerce-product-gallery').length){
            iframe.window.jQuery('body').trigger('resize');
        }

        // sticky wrap
        stickyWrap.reset(true);
        //addHistory();
    });

    // delete
    $content.find('.mfn-builder-content').on('click', '.mfn-header .mfn-element-delete', function(e) {
        e.preventDefault();

        let $dom_el = $(this).closest('.vb-item');
        let uid = $dom_el.attr('data-uid');

        $('.mfn-ui').addClass('mfn-modal-open').append('<div class="mfn-modal modal-confirm show"> <div class="mfn-modalbox mfn-form mfn-shadow-1"> <div class="modalbox-header"> <div class="options-group"> <div class="modalbox-title-group"> <span class="modalbox-icon mfn-icon-delete"></span> <div class="modalbox-desc"> <h4 class="modalbox-title">Delete element</h4> </div></div></div><div class="options-group"> <a class="mfn-option-btn mfn-option-blank btn-large btn-modal-close" title="Close" href="#"><span class="mfn-icon mfn-icon-close"></span></a> </div></div><div class="modalbox-content"> <img class="icon" alt="" src="'+mfnvbvars.themepath+'/muffin-options/svg/warning.svg"> <h3>Delete element?</h3> <p>Please confirm. There is no undo.</p><a class="mfn-btn mfn-btn-red btn-wide btn-modal-confirm" href="#"><span class="btn-wrapper">Delete</span></a> </div></div></div>');

        $('.btn-modal-close').on('click', function(e) {
            e.preventDefault();
            $('.mfn-ui').removeClass('mfn-modal-open');
            $('.modal-confirm.show').remove();
        });

        $('.btn-modal-confirm').on('click', function(e){
            e.preventDefault();

            mfnvbvars.pagedata = mfnvbvars.pagedata.filter( (item) => item.uid != uid );

            if( $navigator.find('.navigator-tree li.nav-'+uid).length ){
                $navigator.find('.navigator-tree li.nav-'+uid).remove();
            }

            if($dom_el.find('.vb-item').length){
                $dom_el.find('.vb-item').each(function() {
                    let x = $(this).attr('data-uid');
                    mfnvbvars.pagedata = mfnvbvars.pagedata.filter( (item) => item.uid != x );
                });
            }

            if( $content.find('.mcb-section-'+uid).length ){ $content.find('.mcb-section-'+uid).remove(); }
            if( $content.find('.mcb-wrap-'+uid).length ){ $content.find('.mcb-wrap-'+uid).remove(); }
            if( $content.find('.mcb-item-'+uid).length ){ $content.find('.mcb-item-'+uid).remove(); }

            $('.mfn-ui').removeClass('mfn-modal-open');
            $('.modal-confirm.show').remove();

            checkEmptyPage();
            checkEmptyWraps()
            checkEmptySections();
            backToWidgets();
            //runSorting();

            addHistory();
        });
    });

    // clone section

    $content.find('.mfn-builder-content').on('click', '.mfn-module-clone', function(e) {
        e.preventDefault();
        stickyWrap.reset();
        let $el = $(this).closest('.vb-item');
        copypaste.copy( $el.attr('data-uid'), 'clone' );
    });

    // add wrap

    $content.find('.mfn-builder-content').on('click', '.mfn-wrap-add', function(e) {
        e.preventDefault();
        let thisid = $(this).closest('.mcb-section').attr('data-uid');
        let is_divider = 0;
        if($(this).hasClass('mfn-divider-add')){ is_divider = 1; }
        addNewWrap(thisid, is_divider);
    });
}

$editpanel.on('click', '.sidebar-panel-footer .btn-save-option', function(e) {
    e.preventDefault();
    $(this).parent().toggleClass('s-opt-show');
    $editpanel.bind('click', closeSaveOpt);
    $content.bind('click', closeSaveOpt);
});

$editpanel.on('click', '.btn-save-changes', function(e){
    e.preventDefault();
    var $list = $(".panel.panel-revisions-update ul.revisions-list");
    var formaction = $(this).attr('data-action');

    if( $('.modal-display-conditions').length && !$('.modal-display-conditions').hasClass('show') ){
        // if template conditions
        $('.modal-display-conditions .btn-save-changes').attr('data-action', formaction);
        $('.modal-display-conditions').addClass('show');
        return;
    }else if(!$(this).hasClass('loading disabled')){
        $(this).addClass('loading disabled');

        var formData = prepareForm();

        var datas = {
            'mfn-builder-nonce': wpnonce,
            'action': 'updatevbview',
            'pageid': pageid,
            'savetype': formaction,
            'sections': formData,
        };

        // attach template conditions
        if( $('.modal-display-conditions').length && $('.modal-display-conditions').hasClass('show') ){
            let conditions = $(document.forms['tmpl-conditions-form']).serializeArray();
            for (var i=0; i<conditions.length; i++)
                datas[ conditions[i].name ] = conditions[i].value;
        }

        $.ajax({
        url: ajaxurl,
        data: datas,
        type: 'POST',
        success: function(response){
            if(response){ displayRevisions(response, $list); }
            window.onbeforeunload = null;

            $('.btn-save-changes').removeClass('loading disabled');
            datas = {};

            if(formaction == 'publish'){
                $('.btn-save-form-primary').attr('data-action', 'update');
                $('.btn-save-form-primary span').text('Update');

                savebutton = 'Update';
                formaction = 'update';

                $('.btn-save-form-secondary').attr('data-action', 'draft');
                $('.btn-save-form-secondary span').text('Save as draft');
            }else if(formaction == 'draft'){
                $('.btn-save-form-primary').attr('data-action', 'publish');
                $('.btn-save-form-primary span').text('Publish');

                savebutton = 'Publish';
                formaction = 'publish';

                $('.btn-save-form-secondary').attr('data-action', 'update');
                $('.btn-save-form-secondary span').text('Save draft');
            }

            if( $('.modal-display-conditions').length ){
                $('.modal-display-conditions .btn-modal-save').removeClass('loading disabled');
                $('.modal-display-conditions').removeClass('show');
            }

            $('#mfn-preview-wrapper').append('<div style="display: none;" class="mfn-snackbar"><span class="mfn-icon mfn-icon-information"></span><div class="snackbar-message">Page updated.</div><div class="snackbar-action"><a href="'+$('.menu-viewpage').attr('href')+'" target="_blank">View page</a></div></div>');
            $('.mfn-snackbar').fadeIn();
            closeSnackbar();
        }
    });

    }
});

function prepareForm( uid = false ){
    var formData = [];

    var $wrapper = $content.find('.mfn-builder-content .mcb-section.vb-item');

    if( uid ){
        $wrapper = $content.find('.mfn-builder-content .vb-item[data-uid="'+uid+'"]');
    }

    var used_fonts = [];

    $wrapper.each(function() {
        var sec_uid = $(this).attr('data-uid');
        var this_section = mfnvbvars.pagedata.filter( (item) => item.uid === sec_uid )[0];
        if( this_section && typeof this_section.uid !== 'undefined' ){
            this_section.wraps = [];
            $(this).find( '.mcb-wrap.vb-item' ).each(function() {
                var wrap_uid = $(this).attr('data-uid');
                var this_wrap = mfnvbvars.pagedata.filter( (item) => item.uid === wrap_uid )[0];
                if( this_wrap ){
                    this_wrap.items = [];
                    $(this).find( '.mcb-column.vb-item' ).each(function() {
                        var col_uid = $(this).attr('data-uid');
                        var this_col = mfnvbvars.pagedata.filter( (item) => item.uid === col_uid )[0];

                        if( this_col && typeof this_col.fields !== 'undefined' && typeof this_col.fields.content !== 'undefined' ){
                            var inline_editor = $.parseHTML( this_col.fields.content );

                            $.each( inline_editor, function( i, el ) {
                              if( $(el).find('span[data-font-family]').length ){
                                $(el).find('span[data-font-family]').each(function() {
                                    used_fonts.push( $(this).attr('data-font-family') );
                                });
                              }
                            });

                            this_col.fields['used_fonts'] = used_fonts.join(',');
                        }

                        this_wrap.items.push(this_col);
                    });
                }
                this_section.wraps.push( this_wrap );
            });
            formData.push( this_section );
        }
    });
    return formData;
}

function closeSnackbar(){
    setTimeout(function() {
        $('.mfn-snackbar').fadeOut(function() {
            $('.mfn-snackbar').remove();
        });
    }, 3000);
}

function closeSaveOpt(e) {
    var container = $('.mfn-visualbuilder .sidebar-panel .sidebar-panel-footer .btn-save-action');

    if (!container.is(e.target) && container.has(e.target).length === 0){
        container.removeClass('s-opt-show');
        $(document).unbind('click', closeSaveOpt);
        $content.unbind('click', closeSaveOpt);
    }

}

// check Empty Page

function checkEmptyPage(){
    if(!$content.find('.mfn-builder-content .mcb-section').length){
        if(!$content.find('.mfn-builder-content .mfn-section-start').length){
            $content.find('body').addClass('mfn-ui-empty-page');
            $content.find('.mfn-builder-content').prepend('<div class="mfn-section-start"><a href="#" class="mfn-section-add"><svg class="welcome-pic" id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 51.84 51.84"><defs><style>.cls-1{fill:none;stroke-width:1.5px;}.cls-1,.cls-3{stroke:#304050;stroke-miterlimit:10;}.cls-2,.cls-3{fill:#304050;}.cls-2{fill-rule:evenodd;}.cls-3{stroke-width:0.7px;}</style></defs><polyline class="cls-1" points="24.92 12.92 24.92 29.38 28.92 29.38"/><line class="cls-1" x1="24.92" y1="29.38" x2="24.92" y2="45.84"/><polyline class="cls-1" points="45.35 16.92 45.35 12.92 4.49 12.92 4.49 45.84 45.35 45.84 45.35 39.11"/><polyline class="cls-1" points="47.32 33.38 49.35 33.38 49.35 16.92 28.92 16.92 28.92 33.38 35.83 33.38"/><polyline class="cls-1" points="4.49 12.92 4.49 6 45.35 6 45.35 12.92"/><path class="cls-2" d="M39.41,9.41a1.24,1.24,0,1,0-1.24,1.22A1.23,1.23,0,0,0,39.41,9.41Z"/><path class="cls-2" d="M43,9.41a1.24,1.24,0,1,0-1.24,1.22A1.24,1.24,0,0,0,43,9.41Z"/><path class="cls-2" d="M35.83,9.41a1.24,1.24,0,1,0-1.24,1.22A1.24,1.24,0,0,0,35.83,9.41Z"/><path class="cls-2" d="M9.18,9.41a1.25,1.25,0,1,0-1.25,1.22A1.24,1.24,0,0,0,9.18,9.41Z"/><path class="cls-3" d="M46,29.7h0a1.3,1.3,0,0,0-.86.33,1.33,1.33,0,0,0-1.24-.91,1.32,1.32,0,0,0-.91.4,1.33,1.33,0,0,0-1.18-.75h0A1.16,1.16,0,0,0,41,29V25.83a1.33,1.33,0,1,0-2.65,0v6.32L38,31.72a1.77,1.77,0,0,0-2.6-.2l-.31.26a.27.27,0,0,0-.07.34l3,5.82a3.11,3.11,0,0,0,2.74,1.72h3.41a3.25,3.25,0,0,0,3.14-3.34V34.38c0-1.33,0-1.82,0-3.29A1.35,1.35,0,0,0,46,29.7Zm.77,4.68v1.94a2.71,2.71,0,0,1-2.59,2.79h-3.4a2.56,2.56,0,0,1-2.25-1.43l-2.93-5.62.15-.12h0a1.25,1.25,0,0,1,.92-.33,1.29,1.29,0,0,1,.89.47l.84,1a.29.29,0,0,0,.31.09.28.28,0,0,0,.18-.26v-7.1a.78.78,0,1,1,1.55,0V32A.28.28,0,1,0,41,32V30.12a.78.78,0,0,1,.76-.8h0a.81.81,0,0,1,.78.84v1.67a.28.28,0,1,0,.55,0V30.52a.76.76,0,1,1,1.52,0v1.23a.28.28,0,1,0,.56,0v-.67a.81.81,0,0,1,.78-.83h0a.81.81,0,0,1,.77.84Z"/></svg></a><h2>Welcome to BeBuilder</h2> <a class="mfn-btn mfn-btn-green btn-icon-left btn-large mfn-section-add" href="#"><span class="btn-wrapper"><span class="mfn-icon mfn-icon-add-light"></span>Start creating</span></a> <p><a class="view-tutorial" href="#">View tutorial</a></p></div>');
            $content.find('.view-tutorial').on('click', function(e) {
                e.preventDefault();
                introduction.reopen();
            });
        }
    }else{
        removeStartBuilding();
    }
}

// check empty wraps

function checkEmptyWraps(){
    $content.find('.mfn-builder-content .mcb-wrap:not(.divider) .mcb-wrap-inner').each(function(i) {
        if( !$(this).find('.mcb-column').length ){
            if( !$(this).hasClass('empty') ) $(this).addClass('empty');
            if( !$(this).find('.mfn-drag-helper').length ) $(this).append('<div class="mfn-drag-helper placeholder-wrap"></div>');
            $(this).append('<div class="mfn-wrap-new"><a href="#" class="mfn-item-add mfn-btn btn-icon-left btn-small mfn-btn-blank2"><span class="btn-wrapper"><span class="mfn-icon mfn-icon-add"></span>Add element</span></a></div>');
        }else if( $(this).find('.mcb-column').length && $(this).find('.mfn-wrap-new').length ){
            $(this).removeClass('empty');
            $(this).find('.mfn-wrap-new').remove();
        }
    });
    runSorting();
}


// check empty sections

function checkEmptySections(){
    $content.find('.mfn-builder-content .mcb-section').each(function(i) {
        if(!$(this).find('.mcb-wrap').length){
            $(this).addClass('empty')
            $(this).children('.section_wrapper').html('<div class="mfn-section-new"><h5>Select a wrap layout</h5> <div class="wrap-layouts"> <div class="wrap-layout wrap-11" data-type="wrap-11" data-tooltip="1/1"></div><div class="wrap-layout wrap-12" data-type="wrap-12" data-tooltip="1/2 | 1/2"><span></span></div><div class="wrap-layout wrap-13" data-type="wrap-13" data-tooltip="1/3 | 1/3 | 1/3"><span></span><span></span></div><div class="wrap-layout wrap-14" data-type="wrap-14" data-tooltip="1/4 | 1/4 | 1/4 | 1/4"><span></span><span></span><span></span></div><div class="wrap-layout wrap-13-23" data-type="wrap-1323" data-tooltip="1/3 | 2/3"><span></span></div><div class="wrap-layout wrap-23-13" data-type="wrap-2313" data-tooltip="2/3 | 1/3"><span></span></div><div class="wrap-layout wrap-14-12-14" data-type="wrap-141214" data-tooltip="1/4 | 1/2 | 1/4"><span></span><span></span></div></div><p>or choose from</p><a class="mfn-btn prebuilt-button mfn-btn-green btn-icon-left" href="#"><span class="btn-wrapper"><span class="mfn-icon mfn-icon-add-light"></span>Pre-built sections</span></a> </div>');

        }else if( $(this).find('.mfn-section-new').length ){
            $(this).find('.mfn-section-new').remove();
            $(this).removeClass('empty');
        }
    });
}

// add Wrap

function addNewWrap(id, is_divider) {

    if(!$content.find('.mfn-builder-content .mfn-wrap-add').hasClass('loading')){

        var new_size = '1/1';
        if( is_divider ) new_size = 'divider';

        var new_element = elements.wrap(new_size);

        $content.find('.mfn-builder-content .mfn-wrap-add').addClass('loading');

        if($content.find('#Content .sections_group .mfn-builder-content .mcb-section-'+id+' .section_wrapper').length == 0){
            $content.find('#Content .sections_group .mfn-builder-content .mcb-section-'+id).append('<div class="section_wrapper mcb-section-inner"></div>');
        }

        $content.find('#Content .sections_group .mfn-builder-content .mcb-section-'+id+' .section_wrapper').append( new_element.html );

        var navigator_html = navigatorHtml('Wrap', new_element.uid, '1/1');

        if( !$navigator.find('.navigator-tree .nav-'+id+' ul').length ){
            $navigator.find('.navigator-tree .nav-'+id).append('<ul class="mfn-sub-nav">'+navigator_html+'</ul>');
        }else{
            $navigator.find('.navigator-tree .nav-'+id+' > ul').append(navigator_html);
        }

        $navigator.find('.navigator-tree .nav-'+id).addClass('active');
        $navigator.find('.navigator-tree .nav-'+id+' > ul').slideDown(300);

        runSorting();

        $content.find('.mfn-wrap-add').removeClass('loading');

        backToWidgets();
        checkEmptySections();
        blink();
        addHistory();

    }
}

// add new widget
function addNewWidget(item){
    var new_element = false;
    var new_script = false;

    var get_new_element = elements.item(item);

    if( Array.isArray(get_new_element) ){
        new_element = get_new_element[0];
        new_script = get_new_element[1];
    }else{
        new_element = get_new_element;
    }

    get_new_element = false;

    if( !new_element ) return;

    var new_uid = $(new_element).attr('data-uid');

    var navigator_html = navigatorHtml(item, new_uid, '1/1');

    //delete new_element.html;

    if($content.find('.mfn-builder-content .mcb-wrap-'+new_widget_container).hasClass('mcb-wrap-new')){
        $content.find('.mfn-builder-content .mcb-wrap-'+new_widget_container).removeClass('mcb-wrap-new');
    }

    if($content.find('.mfn-builder-content .mcb-item-'+new_widget_container).length){

        if(new_widget_position == 'before'){
            $content.find('.mfn-builder-content .mcb-item-'+new_widget_container).before(new_element);
            $navigator.find('.navigator-tree .nav-'+new_widget_container).before(navigator_html);
        }else{
            $content.find('.mfn-builder-content .mcb-item-'+new_widget_container).after(new_element);
            $navigator.find('.navigator-tree .nav-'+new_widget_container).after(navigator_html);
        }

    }else{

        $content.find('.mfn-builder-content .mcb-wrap-'+new_widget_container+' .mcb-wrap-inner').append(new_element);

        if($content.find('.mfn-builder-content .mcb-wrap-'+new_widget_container+' .mcb-wrap-inner').length && $content.find('.mfn-builder-content .mcb-wrap-'+new_widget_container+' .mcb-wrap-inner').hasClass('empty')){
            $content.find('.mfn-builder-content .mcb-wrap-'+new_widget_container+' .mcb-wrap-inner').removeClass('empty');
            $content.find('.mfn-builder-content .mcb-wrap-'+new_widget_container+' .mcb-wrap-inner .mfn-wrap-new').remove();
        }

        if( !$navigator.find('.navigator-tree .nav-'+new_widget_container+' ul').length ){
            $navigator.find('.navigator-tree .nav-'+new_widget_container).append('<ul class="mfn-sub-nav">'+navigator_html+'</ul>');
        }else{
            if(new_widget_position == 'before'){
                $navigator.find('.navigator-tree .nav-'+new_widget_container+' > ul').prepend(navigator_html);
            }else{
                $navigator.find('.navigator-tree .nav-'+new_widget_container+' > ul').append(navigator_html);
            }
        }
    }

    if(new_script) {
        var ajax_script = document.createElement("script");
        ajax_script.innerHTML = new_script;
        document.getElementById('mfn-vb-ifr').contentWindow.document.body.appendChild(ajax_script);
    }

    if(item == 'progress_bars'){ $content.find('.mfn-builder-content .mcb-wrap-inner .mcb-item-'+new_uid+' .bars_list').addClass('hover'); }

    inlineEditor();
    runAjaxElements();
    checkEmptyWraps();

    blink();

    addHistory();
}

function navigatorHtml(type, uid, size = false) {
    if( type == 'Section' ){
        $html = '<li class="navigator-section nav-'+uid+'"><a data-uid="'+uid+'" href="#" class="">'+type+'</a><span class="navigator-arrow"><i class="icon-down-open-big"></i></span></li>';
    }else if( type == 'Wrap'){
        $html = '<li class="navigator-wrap nav-'+uid+'"><a data-uid="'+uid+'" href="#">'+type+' <span class="navigator-size-label">'+size+'</span><span class="navigator-add-item back-to-widgets"></span></a><span class="navigator-arrow"><i class="icon-down-open-big"></i></span></li>';
    }else{
        $html = '<li class="navigator-item nav-'+uid+'"><a data-uid="'+uid+'" href="#"><span class="mfn-icon mfn-icon-'+type.replace('_', '-')+'"></span><span class="navitemtype">'+type.replace('_', ' ')+'</span></a></li>';
    }

    return $html;
}


function removeStartBuilding(){
    if($content.find('.mfn-builder-content .mfn-section-start').length){
        $content.find('body').removeClass('mfn-ui-empty-page');
        $content.find('.mfn-builder-content .mfn-section-start').remove();
    }
}

// shortcode remove icon

$('.modal-add-shortcode .browse-icon .mfn-button-delete').on('click', function(e) {
    e.preventDefault();
    $('.modal-add-shortcode.show .browse-icon .mfn-form-control').val(sample_icon).trigger('change');
    $('.modal-add-shortcode.show .form-addon-prepend .mfn-button-upload .label i').attr('class', sample_icon);
});

// choose icon
$('.mfn-modal.modal-select-icon .mfn-items-list li a').on('click', function(e) {
    e.preventDefault();

    let icon = $(this).find('i').attr('class');
    $(this).parent().addClass('active');

    if( $('.modal-add-shortcode').hasClass('show') ){
        // for shortcode

        $('.modal-add-shortcode.show .browse-icon .mfn-form-control').val(icon).trigger('change');
        $('.modal-add-shortcode.show .browse-icon.has-addons-prepend').removeClass('empty');
        $('.modal-add-shortcode.show .browse-icon .form-addon-prepend .mfn-button-upload .label i').attr('class', icon);
        $('.modal-select-icon.show').removeClass('show');
    }else{
        // for sidebar

        var $input = $('.panel-edit-item .mfn-form-row .current-icon-editing .mfn-field-value');
        $input.val(icon).trigger('change');
        $('.panel-edit-item .mfn-form-row .browse-icon.current-icon-editing').removeClass('empty current-icon-editing');
        $('.mfn-modal').removeClass('show');

    }
});

// delete icon
$editpanel.on('click', '.browse-icon .mfn-button-delete', function(e) {
    e.preventDefault();
    let it = $(this).closest('.mfn-element-fields-wrapper').attr('data-element');
    let group = $(this).closest('.mfn-element-fields-wrapper').attr('data-group');

    $editbox = $(this).closest('.mfn-form-row');

    $('.mfn-field-value', $editbox).val('').trigger('change');


});


$editpanel.on('change', '.mfn-form-row .browse-icon .mfn-field-value', function() {
    var $input = $(this);
    let it = $(this).closest('.mfn-element-fields-wrapper').attr('data-element');
    let icon = $(this).val();

    if( icon != '' ){

        $(this).closest('.mfn-form-row').find('.form-addon-prepend .mfn-button-upload .label i').attr('class', icon);
        $(this).closest('.mfn-form-row').find('.browse-icon').removeClass('empty');

        if($content.find('.'+it).hasClass('column_counter')){
            // counter
            if( $content.find('.'+it+' .icon_wrapper').length ){
                if($content.find('.'+it+' .icon_wrapper i').length){
                    $content.find('.'+it+' .icon_wrapper i').attr('class', icon);
                }else{
                    $content.find('.'+it+' .icon_wrapper').html('<i class="'+icon+'"></i>');
                }
            }else{
                $content.find('.'+it+' .counter').prepend('<div class="icon_wrapper"><i class="'+icon+'"></i></div>');
            }
        }else if($content.find('.'+it).hasClass('column_flat_box')){
            // flat box
            if($content.find('.'+it+' .icon i').length){
                $content.find('.'+it+' .icon i').attr('class', icon);
            }else{
                $content.find('.'+it+' .icon').html('<i class="'+icon+'"></i>');
            }
        }else if($content.find('.'+it).hasClass('column_icon_box')){
            // icon box
            if($content.find('.'+it+' .icon_wrapper .icon i').length){
                $content.find('.'+it+' .icon_wrapper .icon i').attr('class', icon);
            }else{
                if($content.find('.'+it+' .icon_box .image_wrapper').length){ $content.find('.'+it+' .icon_box .image_wrapper').remove(); }
                $content.find('.'+it+' .icon_box').prepend('<div class="icon_wrapper"><div class="icon"><i class="'+icon+'"></i></div></div>');
            }
        }else if($content.find('.'+it).hasClass('column_list')){
            // list
            if($content.find('.'+it+' .list_left i').length){
                $content.find('.'+it+' .list_left i').attr('class', icon);
            }else{
                $content.find('.'+it+' .list_left').removeClass('list_image').addClass('list_icon').html('<i class="'+icon+'"></i>');
            }
        }else if($content.find('.'+it).hasClass('column_fancy_heading')){
            // fancy heading
            if($content.find('.'+it+' .icon_top i').length){
                $content.find('.'+it+' .icon_top i').attr('class', icon);
            }else{
                $content.find('.'+it+' .fh-top').html('<div class="icon_top"><i class="'+icon+'"></i></div>');
            }
        }else if($content.find('.'+it).hasClass('column_call_to_action')){
            // call to action
            if($content.find('.'+it+' .call_center i').length){
                $content.find('.'+it+' .call_center i').attr('class', icon);
            }else{
                $content.find('.'+it+' .call_center').html('<i class="'+icon+'"></i>');
            }
            if( $content.find('.'+it+' .call_center .button').length ){
                $content.find('.'+it+' .call_center .button').addClass('has-icon');
            }
        }else if($content.find('.'+it).hasClass('column_button')){
            // button
            if($content.find('.'+it+' .button .button_icon i').length){
                $content.find('.'+it+' .button .button_icon i').attr('class', icon);
            }else{
                $content.find('.'+it+' .button').prepend('<span class="button_icon"><i class="'+icon+'"></i></span>');
                $content.find('.'+it+' .button').addClass('has-icon');
            }
        }else if($content.find('.'+it).hasClass('column_chart')){
            // chart
            if($content.find('.'+it+' .chart .icon i').length){
                $content.find('.'+it+' .chart .icon i').attr('class', icon);
            }else{
                if( !$content.find('.'+it+' .chart > .image').length ){
                    $content.find('.'+it+' .chart > .image').remove();
                    $content.find('.'+it+' .chart > .num').remove();
                    $content.find('.'+it+' .chart').prepend('<div class="icon"><i class="'+icon+'"></i></div>');
                }else{
                    $content.find('.'+it+' .chart').append('<span class="mfn_tmp_info">The picture has higher priority. Delete it to see icon.</span>');
                    setTimeout(function() {
                        $content.find('.mfn_tmp_info').remove();
                    }, 3000);
                }

            }
        }else if($content.find('.'+it).hasClass('column_header_icon')){
            // header icon
            if($content.find('.'+it+' .mfn-header-icon i').length){
                $content.find('.'+it+' .mfn-header-icon i').attr('class', icon);
            }else{
                $content.find('.'+it+' .mfn-header-icon').html('<i class="'+icon+'"></i>');
            }
        }else if($content.find('.'+it).hasClass('column_accordion')){
            // accordion icon
            if( $input.hasClass('preview-icon_activeinput') ){
                $content.find('.'+it+' .accordion .question .title .acc-icon-minus').attr('class', 'acc-icon-minus '+icon);
            }else{
                $content.find('.'+it+' .accordion .question .title .acc-icon-plus').attr('class', 'acc-icon-plus '+icon);
            }
        }else if($content.find('.'+it).hasClass('column_blockquote')){
            // blockquote icon
            if( $input.hasClass('preview-icon_authorinput') ){
                $content.find('.'+it+' .blockquote .author i').attr('class', icon);
            }else{
                $content.find('.'+it+' .blockquote .mfn-blockquote-icon i').attr('class', icon);
            }
        }else if($content.find('.'+it).hasClass('column_icon_box_2')){
            // icon box 2
            if($content.find('.'+it+' .icon-wrapper').length){
                $content.find('.'+it+' .icon-wrapper').html('<i class="'+icon+'" aria-hidden="true"></i>');
            }else{
                $content.find('.'+it+' .desc_wrapper').before('<div class="icon-wrapper"><i class="'+icon+'" aria-hidden="true"></i></div>');
            }
        }
    }else{

        $(this).closest('.mfn-form-row').find('.form-addon-prepend .mfn-button-upload .label i').attr('class', sample_icon);
        $(this).closest('.mfn-form-row').find('.mfn-field-value').val('');
        $(this).closest('.mfn-form-row').find('.browse-icon').addClass('empty');


        if($content.find('.'+it).hasClass('column_counter')){
            // counter
            if($('.mfn-ui .panel-edit-item .mfn-form .mfn-form-control.preview-imageinput').val().length){
                $content.find('.'+it+' .icon_wrapper').html( $('.mfn-ui .panel-edit-item .mfn-form .mfn-form-control.preview-imageinput').val() );
            }else{
                $content.find('.'+it+' .icon_wrapper').remove();
            }
        }else if($content.find('.'+it).hasClass('column_flat_box')){
            // flat box
            if($content.find('.'+it+' .icon i').length){
                $content.find('.'+it+' .icon i').attr('class', sample_icon);
            }
        }else if($content.find('.'+it).hasClass('column_icon_box')){
            // icon box
            $content.find('.'+it+' .icon_wrapper').remove();
            if( $('.mfn-ui .panel-edit-item .mfn-form .mfn-form-control.preview-imageinput').val().length ){
                $content.find('.'+it+' .icon_box').prepend(' <div class="image_wrapper"><img src=" '+ $('.mfn-ui .panel-edit-item .mfn-form .mfn-form-control.preview-imageinput').val() +' " class="scale-with-grid" alt=""></div> ');
            }else{
                 $content.find('.'+it+' .icon_wrapper .icon i').attr('class', sample_icon);
                 //$('.panel-edit-item .mfn-form-row.icon .preview-iconinput').val(sample_icon);
            }
        }else if($content.find('.'+it).hasClass('column_list')){
            // list
            if($content.find('.'+it+' .list_left i').length){
                $content.find('.'+it+' .list_left i').attr('class', sample_icon);
            }
        }else if($content.find('.'+it).hasClass('column_fancy_heading')){
            // fancy heading
            if($content.find('.'+it+' .icon_top i').length){
                $content.find('.'+it+' .icon_top i').attr('class', sample_icon);
            }
        }else if($content.find('.'+it).hasClass('column_call_to_action')){
            // call to action
            if($content.find('.'+it+' .call_center i').length){
                $content.find('.'+it+' .call_center i').attr('class', '');
            }
            if( $content.find('.'+it+' .call_center .button').length ){
                $content.find('.'+it+' .call_center .button').removeClass('has-icon');
                $content.find('.'+it+' .call_center .button .button_icon').remove();
            }
        }else if($content.find('.'+it).hasClass('column_button')){
            // button
            if($content.find('.'+it+' .button .button_icon i').length){
                $content.find('.'+it+' .button .button_icon').remove();
                $content.find('.'+it+' .button').removeClass('has-icon');
            }
        }else if($content.find('.'+it).hasClass('column_chart')){
            // chart
            if($content.find('.'+it+' .chart .icon').length){
                $content.find('.'+it+' .chart .icon').remove();

                if( $('.panel-edit-item .mfn-form .preview-imageinput').val().length ){
                    $content.find('.'+it+' .chart .num').remove();
                    $content.find('.'+it+' .chart .icon').remove();
                    $content.find('.'+it+' .chart').prepend('<div class="image"><img class="scale-with-grid" src="'+$('.panel-edit-item .mfn-form .preview-imageinput').val()+'" alt="" /></div>');
                }else if( $('.panel-edit-item .mfn-form .preview-labelinput').val().length ){
                    $content.find('.'+it+' .chart .num').remove();
                    $content.find('.'+it+' .chart .image').remove();
                    $content.find('.'+it+' .chart').prepend('<div class="num">'+$('.panel-edit-item .preview-labelinput').val()+'</div>');
                }

            }
        }else if($content.find('.'+it).hasClass('column_header_icon')){
            // header icon
            re_render();
        }else if($content.find('.'+it).hasClass('column_blockquote')){
            // blockquote icon
            if( $('.mfn-field-value', $editbox).hasClass('preview-icon_authorinput') ){
                $content.find('.'+it+' .blockquote .author i').attr('class', 'icon-user');
            }else{
                $content.find('.'+it+' .blockquote .mfn-blockquote-icon i').attr('class', 'icon-quote');
            }
        }else if($content.find('.'+it).hasClass('column_icon_box_2')){
            // icon box 2
            if( $editpanel.find('.panel-edit-item .mfn-form .icon_box_2.image .preview-imageinput').val().length ){
                if($content.find('.'+it+' .icon-wrapper').length){
                    $content.find('.'+it+' .icon-wrapper').html('<img class="scale-with-grid" src="'+$editpanel.find('.panel-edit-item .mfn-form .icon_box_2.image .preview-imageinput').val()+'" alt="">');
                }else{
                    $content.find('.'+it+' .desc_wrapper').before('<div class="icon-wrapper"><img class="scale-with-grid" src="'+$editpanel.find('.panel-edit-item .mfn-form .icon_box_2.image .preview-imageinput').val()+' alt=""></div>');
                }
            }else{
                $content.find('.'+it+' .icon-wrapper').remove();
            }
        }
    }

});


var presets = {
    init: function() {
        presets.show();
        presets.set();
        presets.export();
    },
    export: function() {
        $('.panel-export-import-presets .mfn-export-presets-button').on('click', function(e) {
            e.preventDefault();
            var $button = $(this);
            $('#export-presets-data-textarea').select();
            document.execCommand("copy");
            $button.find('span').text('Exported').addClass('mfn-icon-check-blue');
            setTimeout(function() { $button.find('span').html('Export'); }, 5000);
        });

        $('.panel-export-import-presets .mfn-import-presets-button').on('click', function(e) {
            e.preventDefault();
            var $input = $('.panel-export-import-presets #import-presets-data-textarea');
            var $button = $(this);
            $input.removeClass('error');

            if($button.hasClass('loading')) return false;

            if( !$input.val().length ){
                $input.addClass('error');
            }else{
                $button.addClass('loading');
                $.ajax({
                    url: ajaxurl,
                    data: {
                        action: 'mfnimportpreset',
                        'mfn-builder-nonce': wpnonce,
                        val: JSON.parse( $input.val() )
                    },
                    type: 'POST',
                    success: function(response){
                        $button.removeClass('loading').find('span').html('Imported');
                        setTimeout(function() { $button.find('span').html('Import'); }, 5000);
                        $input.val('');

                        mfnvbvars.presets = [];
                        mfnvbvars.presets = response;
                    }
                });
            }
        });
    },
    set: function() {
        $editpanel.on('click', '.mfn-ui:not(.mfn-editing-section, .mfn-editing-wrap) .mfn-presets-list .dropdown-wrapper a.mfn-load-preset', function(e) {
            e.preventDefault();
            if( $(this).hasClass('loading') ) return;
            $(this).addClass('loading');
            var rerender = false;
            historyAllow = false;

            var uid = $(this).attr('data-uid');

            var styles = mfnvbvars.presets.filter( (item) => item.uid == uid )[0];

            if( !styles || typeof styles.fields == 'undefined' || typeof edited_item.fields == 'undefined' ) {
                $('.mfn-presets-list .dropdown-wrapper a').removeClass('loading');
                return;
            }

            if( styles.item != edited_item.type ){
                $('.mfn-presets-list .dropdown-wrapper a').removeClass('loading');
                return; // different items
            }

            $edited_div = $content.find('.vb-item[data-uid="'+edited_item.uid+'"]');

            // reset first
            for(key in edited_item.fields) {
                if(key.startsWith('style:') || ( typeof presets_keys[edited_item.type] !== 'undefined' && presets_keys[edited_item.type].length && presets_keys[edited_item.type].includes(key) ) ) {
                    delete edited_item.fields[key];
                }
            }

            $content.find('style.mfn-local-style').remove();

            // set
            for (key in styles.fields) {
                edited_item.fields[key] = styles.fields[key];
            }

            openEditForm.do($edited_div, false);
            loopAllStyleFields();

            if( typeof presets_keys[edited_item.type] !== 'undefined' && presets_keys[edited_item.type].length ){
                $.each( presets_keys[edited_item.type], function(i, el) {
                    if( $editpanel.find('.panel-edit-item .mfn-vb-formrow.'+el+'.re_render').length ){
                        rerender = true;
                    }else if( $editpanel.find('.panel-edit-item .mfn-vb-formrow.'+el+' .segmented-options').length ){
                        $editpanel.find('.panel-edit-item .mfn-vb-formrow.'+el+' .segmented-options li.active a').trigger('click');
                    }else{
                        $editpanel.find('.panel-edit-item .mfn-vb-formrow.'+el+' .mfn-field-value').trigger('change');
                    }
                });
            }

            $('.mfn-presets-list .dropdown-wrapper a').removeClass('loading');

            historyAllow = true;

            if( rerender ) {
                re_render();
            }else if( edited_item.type !== 'column'){
                addHistory();
            }

        });
    },
    show: function() {
        $('.mfn-ui:not(.mfn-editing-section, .mfn-editing-wrap) .mfn-presets-list').on('mouseenter', function() {

            $editpanel.find('.mfn-presets-list .dropdown-wrapper').html('');
            var custom = false;
            var builded_in = false;

            if( mfnvbvars.presets.length ){
                var el_presets = mfnvbvars.presets.filter( (it) => it.item == edited_item.type );
                $('.mfn-presets-list .dropdown-wrapper').append('<h6>Presets</h6>');
                if( el_presets.length > 0 ){
                    $.each(el_presets, function(y,x) {
                        if( !builded_in && x.type == 'mfn' ) builded_in = true;
                        if( !custom && x.type == 'custom' ){
                            custom = true;
                            if( builded_in ) $('.mfn-presets-list .dropdown-wrapper').append('<div class="mfn-dropdown-divider"></div>');
                        }
                        $('.mfn-presets-list .dropdown-wrapper').append('<li class="mfn-preset-type-'+x.type+'"><a class="mfn-dropdown-item mfn-load-preset" data-uid="'+x.uid+'" href="#"> '+x.name+'</a>'+( x.type == 'custom' ? "<span class=\"mfn-icon mfn-icon-delete mfn-preset-remove\"></span>" : "" )+'</li>');
                    });
                }else{
                    $('.mfn-presets-list .dropdown-wrapper').append('<i>No custom presets yet.</i>');
                }

            }

            $('.mfn-presets-list .dropdown-wrapper').append('<li><a class="mfn-btn mfn-btn-blue preset-action-button" data-uid="'+edited_item.uid+'" href="#" data-tooltip="Create new preset from current styles"><span class="btn-wrapper"><span class="mfn-icon mfn-icon-add"></span></span></a></li>');

            $('.mfn-presets-list a.preset-action-button').on('click', function(e) {
                e.preventDefault();
                presets.modal( $(this).attr('data-uid') );
            });

            $('.mfn-presets-list .dropdown-wrapper span.mfn-preset-remove').on('click', function() {
                var $a = $(this).siblings('a');
                if( $a.hasClass('loading') ) return;
                $a.addClass('loading');

                $('.mfn-ui').addClass('mfn-modal-open').append('<div class="mfn-modal modal-confirm show"> <div class="mfn-modalbox mfn-form mfn-shadow-1"> <div class="modalbox-header"> <div class="options-group"> <div class="modalbox-title-group"> <span class="modalbox-icon mfn-icon-delete"></span> <div class="modalbox-desc"> <h4 class="modalbox-title">Delete preset</h4> </div></div></div><div class="options-group"> <a class="mfn-option-btn mfn-option-blank btn-large btn-modal-close" title="Close" href="#"><span class="mfn-icon mfn-icon-close"></span></a> </div></div><div class="modalbox-content"> <img class="icon" alt="" src="'+mfnvbvars.themepath+'/muffin-options/svg/warning.svg"> <h3>Delete preset?</h3> <p>Please confirm. There is no undo.</p><a class="mfn-btn mfn-btn-red btn-wide btn-modal-confirm" href="#"><span class="btn-wrapper">Delete</span></a> </div></div></div>');

                $('.btn-modal-close').on('click', function(e) {
                    e.preventDefault();
                    $('.mfn-ui').removeClass('mfn-modal-open');
                    $('.modal-confirm.show').remove();
                });

                $('.btn-modal-confirm').on('click', function(e){
                    e.preventDefault();
                    var uid = $a.attr('data-uid');
                    $(this).addClass('loading');
                    $.ajax({
                        url: ajaxurl,
                        data: {
                            action: 'mfnremovepreset',
                            'mfn-builder-nonce': wpnonce,
                            item: uid
                        },
                        type: 'POST',
                        success: function(response){
                            $a.parent('li').remove();
                            mfnvbvars.presets = mfnvbvars.presets.filter( (it) => it.uid != uid );
                            $('.mfn-ui').removeClass('mfn-modal-open');
                            $('.modal-confirm.show').remove();
                        }
                    });

                });

            });

        }).on('click', function(e) {
            e.preventDefault();
        });
    },
    modal: function(uid) {
        $('.mfn-ui').addClass('mfn-modal-open').append('<div class="mfn-modal modal-confirm show"> <div class="mfn-modalbox mfn-form mfn-shadow-1"> <div class="modalbox-header"> <div class="options-group"> <div class="modalbox-title-group"> <span class="modalbox-icon mfn-icon-preset"></span> <div class="modalbox-desc"> <h4 class="modalbox-title">Add new preset</h4> </div></div></div><div class="options-group"> <a class="mfn-option-btn mfn-option-blank btn-large btn-modal-close" title="Close" href="#"><span class="mfn-icon mfn-icon-close"></span></a> </div></div><div class="modalbox-content"><div class="mfn-form-row"><input placeholder="Type preset name" type="text" class="mfn-form-control mfn-preset-name"></div><a class="mfn-btn mfn-btn-blue btn-modal-confirm" href="#"><span class="btn-wrapper">Save</span></a> <a class="mfn-btn btn-modal-close" href="#"><span class="btn-wrapper">Cancel</span></a> </div></div></div>');

        $('.btn-modal-close').on('click', function(e) {
            e.preventDefault();
            $('.mfn-ui').removeClass('mfn-modal-open');
            $('.modal-confirm.show').remove();
        });

        $('.btn-modal-confirm').on('click', function(e){
            e.preventDefault();
            $('.mfn-preset-name').removeClass('error');
            if( $('.mfn-preset-name').val() != '' ){
                presets.save(uid);
            }else{
                $('.mfn-preset-name').addClass('error');
            }
        });

    },
    save: function(uid) {
        if( !$content.find('.preset-action-button').hasClass('loading') ){
            $content.find('.preset-action-button').addClass('loading');
            $content.find('.mfn-contextmenu-save-preset .label').text('Saving...');

            var formData = prepareForm( uid )[0];
            var save = {};
            var keys_in = [];

            if( typeof presets_keys[formData.type] !== 'undefined' ){
                keys_in = presets_keys[formData.type];
            }

            //console.log(keys_in);

            for (key in formData.fields) {
                if (key.startsWith('style:') || ( keys_in.length && keys_in.includes(key) )) {
                    save[key] = formData.fields[key];
                }
            }

            $.ajax({
                url: ajaxurl,
                data: {
                    action: 'mfnsavepreset',
                    'mfn-builder-nonce': wpnonce,
                    sections: save,
                    name: $('.mfn-preset-name').val(),
                    item: formData.type
                },
                type: 'POST',
                success: function(response){

                    mfnvbvars.presets = [];

                    mfnvbvars.presets = response;

                    $content.find('.preset-action-button').removeClass('loading');
                    $('.modal-confirm.show').remove();
                    $content.find('.mfn-contextmenu-save-preset .label').text('Preset saved');

                    setTimeout(function() {
                        $content.find('.mfn-contextmenu-save-preset .label').text('Save preset');
                    }, 3000);

                }
            });
        }
    }
}

// show choose icon
$editpanel.on('click', '.mfn-form-row .browse-icon .mfn-button-upload', function(e) {
    e.preventDefault();
    if( $('.panel-edit-item .current-icon-editing').length ) $('.panel-edit-item .current-icon-editing').removeClass('current-icon-editing');
    $(this).closest('.browse-icon').addClass('current-icon-editing');
    $('.mfn-modal.modal-select-icon .mfn-items-list li').removeClass('active');
    $('.mfn-modal.modal-select-icon').addClass('show');
});

sliderInput = {

    init: function($slider) {

        var max = false;
        var min = false;

        $slider.addClass('mfn-initialized');

        var $editbox = $slider.closest('.mfn-vb-formrow');
        var $inputgroup = $slider.closest('.form-group');

        var $hidden = $inputgroup.find('input.mfn-field-value');
        var $input = $inputgroup.find('input.mfn-sliderbar-value');

        var css_path = $editbox.attr('data-csspath');
        var css_style = $editbox.attr('data-name');

        min = $input.attr('min');
        max = $input.attr('max');
        var step = $input.attr('data-step');
        var unit = typeof $input.attr('data-unit') !== 'undefined' ? $input.attr('data-unit') : "";
        var value = $input.val() != '' ? $input.val() : 0;

        if( $inputgroup.find('.mfn-slider-unit').length ){
            min = $inputgroup.find('.mfn-slider-unit li.active').attr('data-min');
            max = $inputgroup.find('.mfn-slider-unit li.active').attr('data-max');
            step = $inputgroup.find('.mfn-slider-unit li.active').attr('data-step');
            unit = $inputgroup.find('.mfn-slider-unit li.active a').text();
        }

        if( value != '' && max && parseInt(value) > parseInt(max) ){
            value = max;
            $input.val(max);
            $hidden.val( max+unit ).trigger('change');

        }

        $slider.slider({
            range: parseFloat(min),
            min: parseFloat(min),
            max: parseFloat(max),
            step: parseFloat(step),
            value: value,
            start: function( event, ui ) {
                $('.sidebar-wrapper').addClass('mfn-vb-sidebar-overlay');
            },
            slide: function(event, ui) {
              $input.val( ui.value );
              if($editbox.hasClass('gradient')){
                  gradientValue($editbox, true);
              }else if($(this).closest(".section").hasClass('filter')){

                // Set CSS filters in real time
                var filter = '';
                $(this).closest(".section").find('.mfn-form-row.mfn-vb-formrow .mfn-sliderbar-value').each(function() {
                  var filter_key = $(this).closest('.mfn-form-row').attr('data-name');
                  var csspath = $(this).closest('.mfn-form-row').attr('data-csspath');
                  var unit = $(this).attr('data-unit');

                  if( $(this).val().length ){
                    filter += filter_key+'('+$(this).val()+unit+') ';
                    $content.find(csspath).attr('style', 'filter: ' + filter);
                  }

                });

              }else if( typeof css_path !== 'undefined' ){
                $content.find(css_path.replace('|hover', '').replace('|before', '')).css( css_style, ui.value+unit );
              }
            },
            stop: function(event, ui) {
                $input.val( ui.value ).trigger('change');
                if( typeof css_path !== 'undefined' ){
                setTimeout(function() { changeInlineStyles(css_path.replaceAll('|hover', '').replaceAll('|before', '').replaceAll('|after', ''), css_style, 'remove'); }, 50);
                }

                $('.sidebar-wrapper').removeClass('mfn-vb-sidebar-overlay');
            }
        });
    },

    unitChange: function() {
        $editpanel.on('click', 'ul.mfn-slider-unit li a', function(e) {
            e.preventDefault();

            var $li = $(this).closest('li');
            var $editbox = $li.closest('.mfn-form-row');
            var $slider = $editbox.find('.sliderbar');

            if(!$li.hasClass('active')){
                $li.siblings().removeClass('active');
                $li.addClass('active');

                $editbox.find('.mfn-sliderbar-value').trigger('change');

                sliderInput.destroy($slider);
            }
        });
    },

    customValue: function() {
        $editpanel.on('change', '.mfn-sliderbar-value', function() {
            var $editbox = $(this).closest('.form-group');
            var value = $(this).val();

            var max = false;
            var min = false;

            min = $(this).attr('min');
            max = $(this).attr('max');

            if( $editbox.find('.mfn-slider-unit').length ){
                min = $editbox.find('.mfn-slider-unit li.active').attr('data-min');
                max = $editbox.find('.mfn-slider-unit li.active').attr('data-max');

                if( value != '' && max && parseInt(value) > parseInt(max) ){
                    value = max;
                    $(this).val(max);
                }
            }else{
                min = $(this).attr('min');
                max = $(this).attr('max');

                if( value != '' && max && parseInt(value) > parseInt(max) ){
                    value = max;
                    $(this).val(max);
                }
            }

            $editbox.find('.sliderbar').slider( "value", value );

            if( !$(this).hasClass('mfn-gradient-field') ){
                var $hidden = $editbox.find('input.mfn-field-value');
                var unit = $editbox.find('.mfn-slider-unit li.active').length ? $editbox.find('.mfn-slider-unit li.active a').text() : $(this).attr('data-unit');
                if( value != '' ){
                    $hidden.val( value+unit ).trigger('change');
                }else{
                    $hidden.val( '' ).trigger('change');
                }


            }

        });
    },

    destroy: function($slider) {

        $slider.slider( "destroy" );
        sliderInput.init( $slider );
    }

}

function gradientValue($editbox, tmp = false){

    var $hidden = $editbox.find('.mfn-field-value');
    var type = $editbox.find('.gradient-type').val();
    var color = $editbox.find('.gradient-color').val();
    var location = $editbox.find('.gradient-location').val();
    var color2 = $editbox.find('.gradient-color2').val();
    var location2 = $editbox.find('.gradient-location2').val();
    var position = $editbox.find('.gradient-position').val();
    var angle = $editbox.find('.gradient-angle').val();

    var val = '';

    if( type.length && color.length && location.length && (angle.length || position.length) && color2.length && location2.length ){
        val += type+'(';
        if( type == 'linear-gradient' ){
            val += angle+'deg, ';
        }else{
            val += 'at '+position+', ';
        }
        val += color+' ';
        val += location+'%, ';
        val += color2+' ';
        val += location2+'%)';

        $content.find($editbox.attr('data-csspath').replace('|hover', '')).css( 'background-image', val );

    }
    if( !tmp ){
        $hidden.val( val ).trigger('change');

    }
}


var tabsField = {
    init: function() {

        $editpanel.on('click', '.tabs .mfn-button-add', function(e) {
            e.preventDefault();
            var group = $(this).closest('.mfn-element-fields-wrapper').attr('data-group');
            var $form = $(this).closest('.form-group'),
            $clone = $('li.default', $form).clone(true);
            $clone.removeClass('default').addClass('show');
            $('.tabs-wrapper', $form).append( $clone );
            var new_obj = {};
            $clone.find('input, textarea').each(function(){
                $(this).attr('name', $(this).data('default') ).removeAttr('data-default');
                new_obj[ $(this).attr('data-label') ] = $(this).val();
            });

            if( typeof edited_item.fields.tabs !== 'undefined' ){
                edited_item.fields.tabs.push(new_obj);
            }else{
                edited_item.fields.tabs = [];
                edited_item.fields.tabs.push(new_obj);
            }

            $clone.siblings().removeClass('show');
            $clone.hide().fadeIn(200);
            tabsField.reorder();
            re_render_tabs(group);
        });

        $editpanel.on('blur', 'ul.tabs-wrapper li input, ul.tabs-wrapper li textarea', function() {
            var group = $(this).closest('.mfn-element-fields-wrapper').attr('data-group');
            re_render_tabs(group);
        });

        $editpanel.on('click', '.tabs .mfn-tab-delete', function(e) {
          e.preventDefault();
          var group = $(this).closest('.mfn-element-fields-wrapper').attr('data-group');
          $(this).closest('.tab').fadeOut( 200, function() {
            $(this).remove();
            tabsField.reorder();
            setTimeout(re_render_tabs(group), 1000);
          });
        });

        $editpanel.on('click', '.tabs .mfn-tab-clone', function(e) {
          e.preventDefault();
          var group = $(this).closest('.mfn-element-fields-wrapper').attr('data-group');
          var $tab = $(this).closest('.tab'),
            $clone = $tab.clone(true);
          $tab.removeClass('show').after( $clone );
          $clone.hide().fadeIn(200);
          tabsField.reorder();
          setTimeout(re_render_tabs(group), 1000);
        });

        $editpanel.on('click', '.tabs .mfn-tab-toggle', function(e) {
          e.preventDefault();
          var $tab = $(this).closest('.tab');
          $('input', $tab).trigger('change');
          $tab.toggleClass('show')
            .siblings().removeClass('show');
        });

        $editpanel.on('change', '.tabs .js-title', function(e) {
            e.preventDefault();
            var $tab = $(this).closest('.tab');
            var val = $(this).val();
            $('.tab-header .title', $tab).text(val);
        });
    },

    sortable: function() {
        $('.panel-edit-item .tabs-wrapper:not(.mfn-initialized)').each(function() {
            $(this).addClass('mfn-initialized');
            var $editbox = $(this).closest('.mfn-vb-formrow');
            var group = $(this).closest('.mfn-element-fields-wrapper').attr('data-group');
            $(this).sortable({
                axis: 'y',
                cursor: 'ns-resize',
                handle: '.tab-header',
                opacity: 0.9,
                update: function(e, ui) {

                    if($editbox.hasClass('order')) {
                        var $input = $editbox.find('input.mfn-field-value');
                        var value = [];
                        $('.panel-edit-item .order .tabs-wrapper li').each(function(){
                          value.push( this.innerText.toLowerCase() );
                        });
                        $input.val( value ).trigger('change');

                    }else{
                        tabsField.reorder();
                        setTimeout(re_render_tabs(group), 500);
                    }

                }
            });
        });
    },
    reorder: function() {
        edited_item.fields.tabs = [];
        $('.panel-edit-item .mfn-form ul.tabs-wrapper li.tab:not(.default)').each(function(i) {
            var new_obj = {};
            $(this).find('input, textarea').each(function() {
                var $input = $(this);
                var old_name = $input.attr('name');
                var patt_tabs = /tabs\[([0-9]|[0-9][0-9])\]/g;
                var new_attr_name = old_name.replace(patt_tabs, 'tabs['+i+']');
                $input.attr( 'name', new_attr_name );
                $input.attr( 'data-order', i );
                new_obj[ $input.attr('data-label') ] = $input.val();
            });
            edited_item.fields.tabs.push(new_obj);
        });
    }
}

tabsField.init();

// contact box address
$editpanel.on('keyup', '.contact_box.address .preview-addressinput', function() {
    let it = $(this).closest('.mfn-element-fields-wrapper').attr('data-element');
    let val = $(this).val();

    if(val.length){
        if($content.find('.'+it+' .get_in_touch_wrapper ul li.address .address_wrapper').length){
            $content.find('.'+it+' .get_in_touch_wrapper ul li.address .address_wrapper').html(val);
        }else{
            $content.find('.'+it+' .get_in_touch_wrapper ul').append('<li data-sort="1" class="address"><span class="icon"><i class="icon-location"></i></span><span class="address_wrapper">'+val+'</span></li>');
        }
    }else{
        $content.find('.'+it+' .get_in_touch_wrapper ul li.address').remove();
    }

});

// contact box phone
$editpanel.on('keyup', '.contact_box.telephone .preview-telephoneinput', function() {
    let it = $(this).closest('.mfn-element-fields-wrapper').attr('data-element');
    let val = $(this).val();

    if(val.length){
        if($content.find('.'+it+' .get_in_touch_wrapper ul li.phone.phone-1 p a').length){
            $content.find('.'+it+' .get_in_touch_wrapper ul li.phone.phone-1 p a').html(val);
        }else{
            $content.find('.'+it+' .get_in_touch_wrapper ul').append('<li data-sort="2" class="phone phone-1"><span class="icon"><i class="icon-phone"></i></span><p><a href="tel:'+val+'">'+val+'</a></p></li>');
        }
    }else{
        $content.find('.'+it+' .get_in_touch_wrapper ul li.phone.phone-1').remove();
    }

});

// contact box phone 2
$editpanel.on('keyup', '.contact_box.telephone_2 .preview-telephone_2input', function() {
    let it = $(this).closest('.mfn-element-fields-wrapper').attr('data-element');
    let val = $(this).val();

    if(val.length){
        if($content.find('.'+it+' .get_in_touch_wrapper ul li.phone.phone-2 p a').length){
            $content.find('.'+it+' .get_in_touch_wrapper ul li.phone.phone-2 p a').html(val);
        }else{
            $content.find('.'+it+' .get_in_touch_wrapper ul').append('<li data-sort="3" class="phone phone-2"><span class="icon"><i class="icon-phone"></i></span><p><a href="tel:'+val+'">'+val+'</a></p></li>');
        }
    }else{
        $content.find('.'+it+' .get_in_touch_wrapper ul li.phone.phone-2').remove();
    }

});

// contact box fax
$editpanel.on('keyup', '.contact_box.fax .preview-faxinput', function() {
    let it = $(this).closest('.mfn-element-fields-wrapper').attr('data-element');
    let val = $(this).val();

    if(val.length){
        if($content.find('.'+it+' .get_in_touch_wrapper ul li.phone.fax p a').length){
            $content.find('.'+it+' .get_in_touch_wrapper ul li.phone.fax p a').html(val);
        }else{
            $content.find('.'+it+' .get_in_touch_wrapper ul').append('<li data-sort="4" class="phone fax"><span class="icon"><i class="icon-print"></i></span><p><a href="fax:'+val+'">'+val+'</a></p></li>');
        }
    }else{
        $content.find('.'+it+' .get_in_touch_wrapper ul li.phone.fax').remove();
    }

});

// contact box email
$editpanel.on('keyup', '.contact_box.email .preview-emailinput', function() {
    let it = $(this).closest('.mfn-element-fields-wrapper').attr('data-element');
    let val = $(this).val();

    if(val.length){
        if($content.find('.'+it+' .get_in_touch_wrapper ul li.mail p a').length){
            $content.find('.'+it+' .get_in_touch_wrapper ul li.mail p a').html(val);
        }else{
            $content.find('.'+it+' .get_in_touch_wrapper ul').append('<li data-sort="5" class="mail"><span class="icon"><i class="icon-mail"></i></span><p><a href="mailto:'+val+'">'+val+'</a></p></li>');
        }
    }else{
        $content.find('.'+it+' .get_in_touch_wrapper ul li.mail').remove();
    }

});

// contact box www
$editpanel.on('keyup', '.contact_box.www .preview-wwwinput', function() {
    let it = $(this).closest('.mfn-element-fields-wrapper').attr('data-element');
    let val = $(this).val();

    if(val.length){
        if($content.find('.'+it+' .get_in_touch_wrapper ul li.www p a').length){
            $content.find('.'+it+' .get_in_touch_wrapper ul li.www p a').html(val);
        }else{
            $content.find('.'+it+' .get_in_touch_wrapper ul').append('<li data-sort="6" class="www"><span class="icon"><i class="icon-link"></i></span><p><a target="_blank" href="https://'+val+'">'+val+'</a></p></li>');
        }
    }else{
        $content.find('.'+it+' .get_in_touch_wrapper ul li.www').remove();
    }

});

// call to action button
$editpanel.on('keyup', '.preview-button_titleinput', function() {
    let tmp_group = $(this).closest('.mfn-element-fields-wrapper').attr('data-group');
    let val = $(this).val();
    let icon = $(this).closest('.mfn-element-fields-wrapper').find('.preview-iconinput').val();

    if($edited_div.hasClass('column_call_to_action')){
        // call to action button
        if(val){
            if( icon.length ){
                $edited_div.find('.call_center').html('<a href="#" class="button has-icon "><span class="button_icon"><i class="'+$('.mfn-element-fields-wrapper .preview-iconinput').val()+'"></i></span><span class="button_label">'+val+'</span></a>');
            }else{
                $edited_div.find('.call_center').html('<a href="#" class="button"><span class="button_label">'+val+'</span></a>');
            }
        }else{
            $edited_div.find('.call_center').html('<span class="icon_wrapper"><i class="'+$('.mfn-element-fields-wrapper .preview-iconinput').val()+'"></i></span>');
        }
    }
});

// helper title 1
$editpanel.on('keyup', '.helper.title1 .preview-title1input', function() {
    let it = $(this).closest('.mfn-element-fields-wrapper').attr('data-element');
    let val = $(this).val();

    if($content.find('.'+it+' .links .link-1').length){
        $content.find('.'+it+' .links .link-1').html(val);
    }else{
        $content.find('.'+it+' .links').prepend('<a class="link link-1 toggle" href="#" data-rel="1">'+val+'</a>');
    }
});

// helper title 2
$editpanel.on('keyup', '.helper.title2 .preview-title2input', function() {
    let it = $(this).closest('.mfn-element-fields-wrapper').attr('data-element');
    let val = $(this).val();

    if($content.find('.'+it+' .links .link-2').length){
        $content.find('.'+it+' .links .link-2').html(val);
    }else{
        $content.find('.'+it+' .links').append('<a class="link link-2 toggle" href="#" data-rel="2">'+val+'</a>');
    }
});

// universal txt edit function

function fieldUpdate($field){
    let $box = $field.closest('.mfn-form-row');
    let rare_tag = $box.attr('data-edittag');
    let tag = rare_tag.replace(' | ', ' ');
    let tag_wrapper = rare_tag.split(' | ')[0];
    let tag_el = rare_tag.split(' | ')[1];
    let tag_child = $box.attr('data-edittagchild');
    let tag_pos = $box.attr('data-tagposition');
    let tag_var = $box.attr('data-edittagvar');
    let it = '.'+$box.closest('.mfn-element-fields-wrapper').attr('data-element');
    let val = $field.val();

    if(tag_el.includes('.')){
        var tag_el_ex = tag_el.split('.');
        if( $('.panel-edit-item .'+tag_var+' .active input').length ){
            tag = tag_wrapper + ' ' +$('.panel-edit-item .'+tag_var+' .active input').val()+'.'+tag_el_ex[1];
        }else if(tag_el_ex[0]){
            tag = tag_wrapper + ' ' +tag_el_ex[0]+'.'+tag_el_ex[1];
        }
    }else if( tag_child ){
        tag = tag+' '+tag_child;
    }

    if($content.find(it+' '+tag).length){
        if( val == '' ){
            $content.find(it+' '+tag).html('').hide();
            return;
        }else if( !$content.find(it+' '+tag).is(':visible') ){
            $content.find(it+' '+tag).show();
        }

        if( $edited_div.hasClass('column_code') ){
            $content.find(it+' '+tag).text(val);
        }else{
            $content.find(it+' '+tag).html(val);
        }
    }else{

        if(tag_el.includes('.')){

            var tag_el_ex = tag_el.split('.');

            if( $('.panel-edit-item .'+tag_var+' .active input').length ){

                var html = document.createElement( $('.panel-edit-item .'+tag_var+' .active input').val() );
            }else if(tag_el_ex[0]){
                var html = document.createElement( tag_el_ex[0] );
            }else{
                var html = document.createElement( 'h4' );
            }

            html.classList.add(tag_el_ex[1]);


        }else{
            var html = document.createElement(tag_el);
        }

        if( tag_child ){
            var html_child = document.createElement(tag_child);
            html_child.innerHTML = val;
            html.appendChild(html_child);
        }else{
            html.innerHTML = val;
        }

        if( tag_pos.includes('|') ){

            var tag_pos_exp = tag_pos.split(' | ');
            if( tag_pos_exp[0] == 'before' ){
                $content.find(it+' '+tag_pos_exp[1]).before( html );
            }else{
                $content.find(it+' '+tag_pos_exp[1]).after( html );
            }

        }else{
            if( tag_pos == 'prepend' ){
                $content.find(it+' '+tag_wrapper).prepend( html );
            }else{
                $content.find(it+' '+tag_wrapper).append( html );
            }
        }

    }
}

function lottie_play(){
    var it = $content.find('.mcb-item-'+edited_item.uid+' .lottie').attr('id');

    var frame_start = $editpanel.find('.lottie.frame_start .mfn-field-value').val();
    var frame_end = $editpanel.find('.lottie.frame_end .mfn-field-value').val();
    var direction = $editpanel.find('.lottie.direction li.active input').val();

    iframe.window['start'+it+'frame'] = Math.floor( (parseInt(frame_start)*iframe.window[it].animationData.op)/100 );
    iframe.window['total'+it+'frames'] = Math.floor( (parseInt(frame_end)*iframe.window[it].animationData.op)/100 );

    iframe.window['frames'+it] = [iframe.window['start'+it+'frame'], iframe.window['total'+it+'frames']];
    iframe.window['frames'+it+'_reverse'] = [iframe.window['total'+it+'frames'], iframe.window['start'+it+'frame']];

    if(direction == '-1') {
        iframe.window[it].playSegments( iframe.window['frames'+it+'_reverse'], true);
    }else{
        iframe.window[it].playSegments( iframe.window['frames'+it], true);
    }
}

// lottie start
$editpanel.on('change', '.lottie .mfn-field-value', function() {
    var $editrow = $(this).closest('.mfn-vb-formrow');
    var val = $(this).val();
    var it = $content.find('.mcb-item-'+edited_item.uid+' .lottie').attr('id');
    var $trigger_field = $editpanel.find('.lottie.trigger .mfn-field-value');

    var current_lottie = iframe.window[it];

    if( $editrow.hasClass('speed') ){
        if( $trigger_field.val() == 'scroll' ){
            re_render();
        }else{
            iframe.window[it].setSpeed(val);
            lottie_play();
        }
    }else if( $editrow.hasClass('trigger') && val == 'scroll' ){
        $('.panel-edit-item .lottie.loop li:first-child a').trigger('click');
        $('.panel-edit-item .lottie.direction li:first-child a').trigger('click');
    }else if( $editrow.hasClass('frame_start') || $editrow.hasClass('frame_end') ){
        if( $trigger_field.val() == 'scroll' ){
            re_render();
        }else{
            lottie_play();
        }
    }else if( $editrow.hasClass('src') && val != '' ){
        $editpanel.find('.lottie.file .browse-image .mfn-button-delete').trigger('click');
    }else if( $editrow.hasClass('file') && val != '' ){
        $editpanel.find('.lottie.src .mfn-field-value').val('');
    }
    // console.log(iframe.window[it]);
});
// lottie end

$editpanel.on('keyup paste', '.content-txt-edit .mfn-field-value', function() {
    fieldUpdate($(this));
});

// re render

$editpanel.on('change', '.absolute-pos-watcher .mfn-field-value', function(){
    var val = $(this).val();
    if( val == 'absolute'){
        $edited_div.addClass('mcb-column-absolute');
    }else{
        $edited_div.removeClass('mcb-column-absolute');
    }
});
$editpanel.on('change', '.re_render .mfn-field-value', function(){
    re_render();
});

$editpanel.on('change', '.re_render_tabs .mfn-field-value', function(){
    re_render_tabs();
});

$editpanel.on('change', '.preview-numberinput', function() {
    // number
    let it = $(this).closest('.mfn-element-fields-wrapper').attr('data-element');
    let val = $(this).val();

    if($edited_div.hasClass('column_counter')){
        // counter
        if($content.find('.'+it+' .desc_wrapper .number').length){
            $content.find('.'+it+' .desc_wrapper .number').text(val);
        }else{
            if($content.find('.'+it+' .desc_wrapper .number-wrapper').length){
                $content.find('.'+it+' .desc_wrapper .number-wrapper').append('<span class="number" data-to="'+val+'">'+val+'</span>');
            }else{
                $content.find('.'+it+' .desc_wrapper').prepend('<div class="number-wrapper"><span class="number" data-to="'+val+'">'+val+'</span></div>');
            }
        }
    }else if($edited_div.hasClass('column_how_it_works')){
        // how it works
        if($content.find('.'+it+' .number').length){
            $content.find('.'+it+' .number').text(val);
        }else{
            $content.find('.'+it+' .image').html('<span class="number">'+val+'</span>');
        }
    }else if($edited_div.hasClass('column_quick_fact')){
        // quick fact
        if($content.find('.'+it+' .number-wrapper .number').length){
            $content.find('.'+it+' .number-wrapper .number').attr('data-to', val).text(val);
        }else{
            $content.find('.'+it+' .quick_fact').prepend('<div class="number-wrapper"><span class="number" data-to="'+val+'">'+val+'</span></div>');
        }
    }
});

$editpanel.on('keyup', '.preview-prefixinput', function() {
    // prefix
    let it = $(this).closest('.mfn-element-fields-wrapper').attr('data-element');
    let val = $(this).val();

    if($edited_div.hasClass('column_counter')){
        // counter
        if($content.find('.'+it+' .desc_wrapper .label.prefix').length){
            $content.find('.'+it+' .desc_wrapper .label.prefix').text(val);
        }else{
            if($content.find('.'+it+' .desc_wrapper .number-wrapper').length){
                $content.find('.'+it+' .desc_wrapper .number-wrapper').prepend('<span class="label prefix">'+val+'</span>');
            }else{
                $content.find('.'+it+' .desc_wrapper').prepend('<div class="number-wrapper"><span class="label prefix">'+val+'</span></div>');
            }
        }
    }else if($edited_div.hasClass('column_quick_fact')){
        // quick fact prefix
        if($content.find('.'+it+' .number-wrapper .prefix').length){
            $content.find('.'+it+' .number-wrapper .prefix').text(val);
        }else{
            if($content.find('.'+it+' .number-wrapper').length){
                $content.find('.'+it+' .number-wrapper').prepend('<span class="label prefix">'+val+'</span>');
            }else{
                $content.find('.'+it+' .desc_wrapper').prepend('<div class="number-wrapper"><span class="label prefix">'+val+'</span></div>');
            }
        }
    }
});
$editpanel.on('keyup', '.preview-labelinput', function() {
    // postfix
    let it = $(this).closest('.mfn-element-fields-wrapper').attr('data-element');
    let val = $(this).val();

    if($edited_div.hasClass('column_counter')){
        // counter
        if($content.find('.'+it+' .desc_wrapper .label.postfix').length){
            $content.find('.'+it+' .desc_wrapper .label.postfix').text(val);
        }else{
            if($content.find('.'+it+' .desc_wrapper .number-wrapper').length){
                $content.find('.'+it+' .desc_wrapper .number-wrapper').append('<span class="label postfix">'+val+'</span>');
            }else{
                $content.find('.'+it+' .desc_wrapper').prepend('<div class="number-wrapper"><span class="label postfix">'+val+'</span></div>');
            }
        }
    }else if($edited_div.hasClass('column_quick_fact')){
        // quick fact postfix
        if($content.find('.'+it+' .number-wrapper .label.postfix').length){
            $content.find('.'+it+' .number-wrapper .label.postfix').text(val);
        }else{
            if($content.find('.'+it+' .number-wrapper').length){
                $content.find('.'+it+' .number-wrapper').append('<span class="label postfix">'+val+'</span>');
            }else{
                $content.find('.'+it+' .desc_wrapper').prepend('<div class="number-wrapper"><span class="label postfix">'+val+'</span></div>');
            }
        }
    }else if($edited_div.hasClass('column_chart')){
        // chart

        if(val.length){
            if($content.find('.'+it+' .num').length){
                $content.find('.'+it+' .num').text(val);
            }else{

                if( !$content.find('.'+it+' .chart > .image').length && !$content.find('.'+it+' .chart > .icon').length ){
                    $content.find('.'+it+' .chart').prepend('<div class="num">'+val+'</div>');
                }else{
                    if(!$content.find('.'+it+' .chart .mfn_tmp_info').length){
                        $content.find('.'+it+' .chart').append('<span class="mfn_tmp_info">Picture and icon have higher priority. Delete them to see label.</span>');
                        setTimeout(function() {
                            $content.find('.mfn_tmp_info').remove();
                        }, 3000);
                    }
                }
            }
        }else{
            if( $('.panel-edit-item .mfn-form .preview-imageinput').val().length ){
                if($content.find('.'+it+' .chart .image img').length){
                    $content.find('.'+it+' .chart .image img').attr('src', $('.panel-edit-item .mfn-form .preview-imageinput').val());
                }else{
                    $content.find('.'+it+' .chart .num').remove();
                    $content.find('.'+it+' .chart .icon').remove();
                    $content.find('.'+it+' .chart').prepend('<div class="image"><img class="scale-with-grid" src="'+$('.panel-edit-item .mfn-form .preview-imageinput').val()+'" alt="" /></div>');
                }
            }else if( $('.panel-edit-item .mfn-form .preview-iconinput').val().length ){
                if($content.find('.'+it+' .chart .icon i').length){
                    $content.find('.'+it+' .chart .icon i').attr('class', $('.panel-edit-item .mfn-form .preview-iconinput').val());
                }else{
                    $content.find('.'+it+' .chart > .image').remove();
                    $content.find('.'+it+' .chart > .num').remove();
                    $content.find('.'+it+' .chart').prepend('<div class="icon"><i class="'+$('.panel-edit-item .mfn-form .preview-iconinput').val()+'"></i></div>');
                }
            }

        }
    }

});


$editpanel.on('change', '.preview-positioninput', function() {
    var val = $(this).val();

    if(!val.length){
        $('.panel-edit-item .mfn-element-fields-wrapper .activeif-item_position input').val('').trigger('change');
    }

});

$editpanel.on('keyup', '.mfn-element-fields-wrapper .preview-titleinput', function() {
    // title
    let it = $(this).closest('.mfn-element-fields-wrapper').attr('data-element');
    let val = $(this).val();

    if($edited_div.hasClass('column_list')){
        // list
        if($content.find('.'+it+' .list_right h4').length){
            $content.find('.'+it+' .list_right h4').html(val);
        }else if($content.find('.'+it+' .circle').length){
            $content.find('.'+it+' .circle').html(val);
        }
    }

});

// custom ID

$editpanel.on('change', '.custom_id .preview-custom_idinput', function() {
    let it = $(this).closest('.mfn-element-fields-wrapper').attr('data-element');
    let val = $(this).val();
    let uid = $edited_div.attr('data-uid');
    if(val.length){
        $edited_div.attr('id', val);
        if( $navigator.find('.nav-'+uid+' .navigator-section-id').length ){
            $navigator.find('.nav-'+uid+' .navigator-section-id').text('#'+val);
        }else{
            $navigator.find('.nav-'+uid+' > a').append('<span class="navigator-section-id">#'+val+'</span>');
        }
    }else{
        $edited_div.removeAttr('id');
        if( $navigator.find('.nav-'+uid+' .navigator-section-id').length ){
            $navigator.find('.nav-'+uid+' .navigator-section-id').remove();
        }
    }
});

// our team list links email fb twitter linkedin vcard
$editpanel.on('keyup', '.our_team_list.email .preview-emailinput', function() {
    let it = $(this).closest('.mfn-element-fields-wrapper').attr('data-element');
    let val = $(this).val();
    if(val.length){
        if($content.find('.'+it+' .bq_wrapper .links').length){
            if($content.find('.'+it+' .bq_wrapper .links a.mail').length){
                $content.find('.'+it+' .bq_wrapper .links a.mail').attr('href', val);
            }else{
                $content.find('.'+it+' .bq_wrapper .links').prepend('<a href="mailto:'+val+'" class="icon_bar icon_bar_small mail"><span class="t"><i class="icon-mail"></i></span><span class="b"><i class="icon-mail"></i></span></a>');
            }
        }else{
            $content.find('.'+it+' .bq_wrapper').append('<div class="links"><a href="mailto:'+val+'" class="icon_bar icon_bar_small mail"><span class="t"><i class="icon-mail"></i></span><span class="b"><i class="icon-mail"></i></span></a></div>');
        }
    }else{
        $content.find('.'+it+' .bq_wrapper .links a.mail').remove();
    }
});

$editpanel.on('keyup', '.our_team_list.facebook .preview-facebookinput', function() {
    let it = $(this).closest('.mfn-element-fields-wrapper').attr('data-element');
    let val = $(this).val();
    if(val.length){
        if($content.find('.'+it+' .bq_wrapper .links').length){
            if($content.find('.'+it+' .bq_wrapper .links a.facebook').length){
                $content.find('.'+it+' .bq_wrapper .links a.facebook').attr('href', val);
            }else{
                $content.find('.'+it+' .bq_wrapper .links').append('<a target="_blank" href="'+val+'" class="icon_bar icon_bar_small facebook"><span class="t"><i class="icon-facebook"></i></span><span class="b"><i class="icon-facebook"></i></span></a>');
            }
        }else{
            $content.find('.'+it+' .bq_wrapper').append('<div class="links"><a target="_blank" href="'+val+'" class="icon_bar icon_bar_small facebook"><span class="t"><i class="icon-facebook"></i></span><span class="b"><i class="icon-facebook"></i></span></a></div>');
        }
    }else{
        $content.find('.'+it+' .bq_wrapper .links a.facebook').remove();
    }
});

$editpanel.on('keyup', '.our_team_list.twitter .preview-twitterinput', function() {
    let it = $(this).closest('.mfn-element-fields-wrapper').attr('data-element');
    let val = $(this).val();
    if(val.length){
        if($content.find('.'+it+' .bq_wrapper .links').length){
            if($content.find('.'+it+' .bq_wrapper .links a.twitter').length){
                $content.find('.'+it+' .bq_wrapper .links a.twitter').attr('href', val);
            }else{
                $content.find('.'+it+' .bq_wrapper .links').append('<a target="_blank" href="'+val+'" class="icon_bar icon_bar_small twitter"><span class="t"><i class="icon-twitter"></i></span><span class="b"><i class="icon-twitter"></i></span></a>');
            }
        }else{
            $content.find('.'+it+' .bq_wrapper').append('<div class="links"><a target="_blank" href="'+val+'" class="icon_bar icon_bar_small twitter"><span class="t"><i class="icon-twitter"></i></span><span class="b"><i class="icon-twitter"></i></span></a></div>');
        }
    }else{
        $content.find('.'+it+' .bq_wrapper .links a.twitter').remove();
    }
});

$editpanel.on('keyup', '.our_team_list.linkedin .preview-linkedininput', function() {
    let it = $(this).closest('.mfn-element-fields-wrapper').attr('data-element');
    let val = $(this).val();
    if(val.length){
        if($content.find('.'+it+' .bq_wrapper .links').length){
            if($content.find('.'+it+' .bq_wrapper .links a.linkedin').length){
                $content.find('.'+it+' .bq_wrapper .links a.linkedin').attr('href', val);
            }else{
                $content.find('.'+it+' .bq_wrapper .links').append('<a target="_blank" href="'+val+'" class="icon_bar icon_bar_small linkedin"><span class="t"><i class="icon-linkedin"></i></span><span class="b"><i class="icon-linkedin"></i></span></a>');
            }
        }else{
            $content.find('.'+it+' .bq_wrapper').append('<div class="links"><a target="_blank" href="'+val+'" class="icon_bar icon_bar_small linkedin"><span class="t"><i class="icon-linkedin"></i></span><span class="b"><i class="icon-linkedin"></i></span></a></div>');
        }
    }else{
        $content.find('.'+it+' .bq_wrapper .links a.linkedin').remove();
    }
});
$editpanel.on('keyup', '.our_team_list.vcard .preview-vcardinput', function() {
    let it = $(this).closest('.mfn-element-fields-wrapper').attr('data-element');
    let val = $(this).val();
    if(val.length){
        if($content.find('.'+it+' .bq_wrapper .links').length){
            if($content.find('.'+it+' .bq_wrapper .links a.vcard').length){
                $content.find('.'+it+' .bq_wrapper .links a.vcard').attr('href', val);
            }else{
                $content.find('.'+it+' .bq_wrapper .links').append('<a href="'+val+'" class="icon_bar icon_bar_small vcard"><span class="t"><i class="icon-vcard"></i></span><span class="b"><i class="icon-vcard"></i></span></a>');
            }
        }else{
            $content.find('.'+it+' .bq_wrapper').append('<div class="links"><a href="'+val+'" class="icon_bar icon_bar_small vcard"><span class="t"><i class="icon-vcard"></i></span><span class="b"><i class="icon-vcard"></i></span></a></div>');
        }
    }else{
        $content.find('.'+it+' .bq_wrapper .links a.vcard').remove();
    }
});

// our team list blockquote
$editpanel.on('keyup', '.our_team_list.blockquote .preview-blockquoteinput', function() {
    let it = $(this).closest('.mfn-element-fields-wrapper').attr('data-element');
    let val = $(this).val();

    if($content.find('.'+it+' .column .bq_wrapper blockquote').length){
        $content.find('.'+it+' .column .bq_wrapper blockquote').html(val);
    }else{
        $content.find('.'+it+' .column .bq_wrapper').prepend('<div class="blockquote"><span class="mfn-blockquote-icon"><i class="icon-quote"></i></span><blockquote>'+val+'</blockquote></div>');
    }
});

// our team
$editpanel.on('keyup', '.our_team.blockquote .preview-blockquoteinput', function() {
    let it = $(this).closest('.mfn-element-fields-wrapper').attr('data-element');
    let val = $(this).val();

    if($content.find('.'+it+' .desc_wrapper blockquote').length){
        $content.find('.'+it+' .desc_wrapper blockquote').html(val);
    }else{
        $content.find('.'+it+' .desc_wrapper').append('<blockquote>'+val+'</blockquote>');
    }
});

// our team links email fb twitter linkedin vcard
$editpanel.on('keyup', '.our_team.email .preview-emailinput', function() {
    let it = $(this).closest('.mfn-element-fields-wrapper').attr('data-element');
    let val = $(this).val();
    if(val.length){
        if($content.find('.'+it+' .desc_wrapper .links').length){
            if($content.find('.'+it+' .desc_wrapper .links a.mail').length){
                $content.find('.'+it+' .desc_wrapper .links a.mail').attr('href', val);
            }else{
                $content.find('.'+it+' .desc_wrapper .links').prepend('<a href="mailto:'+val+'" class="icon_bar icon_bar_small mail"><span class="t"><i class="icon-mail"></i></span><span class="b"><i class="icon-mail"></i></span></a>');
            }
        }else{
            $content.find('.'+it+' .desc_wrapper').append('<div class="links"><a href="mailto:'+val+'" class="icon_bar icon_bar_small mail"><span class="t"><i class="icon-mail"></i></span><span class="b"><i class="icon-mail"></i></span></a></div>');
        }
    }else{
        $content.find('.'+it+' .desc_wrapper .links a.mail').remove();
    }
});

$editpanel.on('keyup', '.our_team.facebook .preview-facebookinput', function() {
    let it = $(this).closest('.mfn-element-fields-wrapper').attr('data-element');
    let val = $(this).val();
    if(val.length){
        if($content.find('.'+it+' .desc_wrapper .links').length){
            if($content.find('.'+it+' .desc_wrapper .links a.facebook').length){
                $content.find('.'+it+' .desc_wrapper .links a.facebook').attr('href', val);
            }else{
                $content.find('.'+it+' .desc_wrapper .links').append('<a target="_blank" href="'+val+'" class="icon_bar icon_bar_small facebook"><span class="t"><i class="icon-facebook"></i></span><span class="b"><i class="icon-facebook"></i></span></a>');
            }
        }else{
            $content.find('.'+it+' .desc_wrapper').append('<div class="links"><a target="_blank" href="'+val+'" class="icon_bar icon_bar_small facebook"><span class="t"><i class="icon-facebook"></i></span><span class="b"><i class="icon-facebook"></i></span></a></div>');
        }
    }else{
        $content.find('.'+it+' .desc_wrapper .links a.facebook').remove();
    }
});

$editpanel.on('keyup', '.our_team.twitter .preview-twitterinput', function() {
    let it = $(this).closest('.mfn-element-fields-wrapper').attr('data-element');
    let val = $(this).val();
    if(val.length){
        if($content.find('.'+it+' .desc_wrapper .links').length){
            if($content.find('.'+it+' .desc_wrapper .links a.twitter').length){
                $content.find('.'+it+' .desc_wrapper .links a.twitter').attr('href', val);
            }else{
                $content.find('.'+it+' .desc_wrapper .links').append('<a target="_blank" href="'+val+'" class="icon_bar icon_bar_small twitter"><span class="t"><i class="icon-twitter"></i></span><span class="b"><i class="icon-twitter"></i></span></a>');
            }
        }else{
            $content.find('.'+it+' .desc_wrapper').append('<div class="links"><a target="_blank" href="'+val+'" class="icon_bar icon_bar_small twitter"><span class="t"><i class="icon-twitter"></i></span><span class="b"><i class="icon-twitter"></i></span></a></div>');
        }
    }else{
        $content.find('.'+it+' .desc_wrapper .links a.twitter').remove();
    }
});

$editpanel.on('keyup', '.our_team.linkedin .preview-linkedininput', function() {
    let it = $(this).closest('.mfn-element-fields-wrapper').attr('data-element');
    let val = $(this).val();
    if(val.length){
        if($content.find('.'+it+' .desc_wrapper .links').length){
            if($content.find('.'+it+' .desc_wrapper .links a.linkedin').length){
                $content.find('.'+it+' .desc_wrapper .links a.linkedin').attr('href', val);
            }else{
                $content.find('.'+it+' .desc_wrapper .links').append('<a target="_blank" href="'+val+'" class="icon_bar icon_bar_small linkedin"><span class="t"><i class="icon-linkedin"></i></span><span class="b"><i class="icon-linkedin"></i></span></a>');
            }
        }else{
            $content.find('.'+it+' .desc_wrapper').append('<div class="links"><a target="_blank" href="'+val+'" class="icon_bar icon_bar_small linkedin"><span class="t"><i class="icon-linkedin"></i></span><span class="b"><i class="icon-linkedin"></i></span></a></div>');
        }
    }else{
        $content.find('.'+it+' .desc_wrapper .links a.linkedin').remove();
    }
});

$editpanel.on('keyup', '.preview-cart_button_textinput', function() {
    let it = $(this).closest('.mfn-element-fields-wrapper').attr('data-element');
    let val = $(this).val();

    if($content.find('.'+it+' button[type="submit"]').length){
        $content.find('.'+it+' button[type="submit"]').text(val);
    }
});

$editpanel.on('keyup', '.our_team.vcard .preview-vcardinput', function() {
    let it = $(this).closest('.mfn-element-fields-wrapper').attr('data-element');
    let val = $(this).val();
    if(val.length){
        if($content.find('.'+it+' .desc_wrapper .links').length){
            if($content.find('.'+it+' .desc_wrapper .links a.vcard').length){
                $content.find('.'+it+' .desc_wrapper .links a.vcard').attr('href', val);
            }else{
                $content.find('.'+it+' .desc_wrapper .links').append('<a href="'+val+'" class="icon_bar icon_bar_small vcard"><span class="t"><i class="icon-vcard"></i></span><span class="b"><i class="icon-vcard"></i></span></a>');
            }
        }else{
            $content.find('.'+it+' .desc_wrapper').append('<div class="links"><a href="'+val+'" class="icon_bar icon_bar_small vcard"><span class="t"><i class="icon-vcard"></i></span><span class="b"><i class="icon-vcard"></i></span></a></div>');
        }
    }else{
        $content.find('.'+it+' .desc_wrapper .links a.vcard').remove();
    }
});

$editpanel.on('keyup', '.preview-phoneinput', function() {
    // phone
    let it = $(this).closest('.mfn-element-fields-wrapper').attr('data-element');
    let val = $(this).val();

    if($edited_div.hasClass('column_our_team')){
        // our team
        if($content.find('.'+it+' .desc_wrapper p.phone a').length){
            $content.find('.'+it+' .desc_wrapper p.phone a').text(val);
        }else{
            $content.find('.'+it+' .desc_wrapper .hr_color').before('<p class="phone"><i class="icon-phone"></i> <a href="#">'+val+'</a></p>');
        }
    }else if($edited_div.hasClass('column_our_team_list')){
        // our team
        if($content.find('.'+it+' .desc_wrapper p.phone a').length){
            $content.find('.'+it+' .desc_wrapper p.phone a').text(val);
        }else{
            $content.find('.'+it+' .desc_wrapper .hr_color').before('<p class="phone"><i class="icon-phone"></i> <a href="#">'+val+'</a></p>');
        }
    }
});

$editpanel.on('change', '.widget-chart .preview-line_widthinput', function() {
    // chart
    let it = $(this).closest('.mfn-element-fields-wrapper').attr('data-element');
    let val = $(this).val();

    $content.find('.'+it+' .chart').attr('data-line-width', val);
    $content.find('.'+it+' .chart_box').removeClass('mfn-initialized');
    mfnChart();
});

// mennu pointer position top/bottom
$editpanel.on('change', ' .preview-menu-pointer-positioninput', function() {
    let it = $(this).closest('.mfn-element-fields-wrapper').attr('data-element');
    let val = $(this).val();
    $edited_div.removeClass('mfn-pointer-bottom');
    if(val.length){
        $edited_div.addClass(val);
    }
});

$editpanel.on('change', '.preview-stretchinput', function() {
    // stretch image
    let it = $(this).closest('.mfn-element-fields-wrapper').attr('data-element');
    let val = $(this).val();

    if($edited_div.hasClass('column_image')){
        // image stretch
        $content.find('.'+it+' .image_frame').removeClass('stretch-ultrawide stretch');
        if(val == 'ultrawide'){
            $content.find('.'+it+' .image_frame').addClass('stretch-ultrawide');
        }else if(val == "1"){
            $content.find('.'+it+' .image_frame').addClass('stretch');
        }
    }
});

$editpanel.on('change', '.panel-edit-item .mfn-form .form-group.font-family-select select', function() {
    var val = $(this).val();
    $(this).attr('data-value', val);
});

// segmented options

$editpanel.on("click", '.single-segmented-option.segmented-options li a', function(e) {
    e.preventDefault();

    let $li = $(this).closest('li');

    if( !$li.hasClass('active') ){
        $li.siblings('li').removeClass('active');
        $li.siblings('li').find('input').prop('checked', false);

        $li.addClass('active');
        $li.find('input').prop('checked', true).trigger('change');
    }

    if( $(this).closest('.mfn-modal').length ) return;

    let $editbox = $(this).closest('.mfn-form-row');
    let $editwrapper = $(this).closest('.mfn-element-fields-wrapper');

    if(!$editbox.hasClass('inline-style-input')){

        let it = $editbox.closest('.mfn-element-fields-wrapper').attr('data-element');
        let group = $editbox.closest('.mfn-element-fields-wrapper').attr('data-group');
        let val = $li.find('input').val();

        // lottie start
        if( $editbox.hasClass('lottie') ){
            var l_id = $content.find('.mcb-item-'+edited_item.uid+' .lottie').attr('id');

            if( $editbox.hasClass('loop') ){
                if( val == 1 ){
                    iframe.window[l_id].loop = true;
                    iframe.window[l_id].play();
                }else{
                    iframe.window[l_id].loop = false;
                    iframe.window[l_id].stop();
                }
            }

            if( $editbox.hasClass('direction') ){
                iframe.window[l_id].setDirection(val);
                iframe.window['direction'+l_id] = parseInt(val);
                lottie_play();
            }

            // console.log(iframe.window[l_id]);
        }
        // lottie end

        // watchchanges
        if( $editbox.hasClass('watchChanges') ){
            var id = $editbox.attr('id');
            mfnoptsinputs.getField(id, val, group);
        }

        if($editbox.hasClass('re_render_tabs')){
            re_render_tabs();
            return;
        }

        if( $editbox.hasClass('re_render') ){
            re_render();
            return;
        }

        // greyscale
        if($editbox.hasClass('greyscale')){
            if(val == 0){
                $content.find('.'+it+' .element_classes').removeClass('greyscale');
            }else{
                $content.find('.'+it+' .element_classes').addClass('greyscale');
            }
        }

        // reverse order
        if($editbox.hasClass('reverse_order') && $('.mfn-ui').hasClass('mfn-editing-wrap')){
            $edited_div.removeClass('column-reverse column-reverse-rows');
            if( val == '1' ){
                $edited_div.addClass('column-reverse');
            }else if( val == '2' ){
                $edited_div.addClass('column-reverse-rows');
            }
        }

        // reverse order sections
        if($editbox.hasClass('reverse_order') && $('.mfn-ui').hasClass('mfn-editing-section')){
            $edited_div.removeClass('wrap-reverse wrap-reverse-rows');
            if( val == '1' ){
                $edited_div.addClass('wrap-reverse');
            }else if( val == '2' ){
                $edited_div.addClass('wrap-reverse-rows');
            }
        }

        // olds

        // icon box 2 icon position
        if($editbox.hasClass('icon_box_2 icon_position')){
            $content.find('.'+it+' .mfn-icon-box').removeClass('mfn-icon-box-top mfn-icon-box-bottom mfn-icon-box-left mfn-icon-box-right');
            $content.find('.'+it+' .mfn-icon-box').addClass('mfn-icon-box-'+val);
        }

        // icon box 2 icon position tablet
        if($editbox.hasClass('icon_box_2 icon_position_tablet')){
            $content.find('.'+it+' .mfn-icon-box').removeClass('mfn-icon-box-tablet-top mfn-icon-box-tablet-bottom mfn-icon-box-tablet-left mfn-icon-box-tablet-right');
            if( val ) $content.find('.'+it+' .mfn-icon-box').addClass('mfn-icon-box-tablet-'+val);
        }

        // icon box 2 icon position mobile
        if($editbox.hasClass('icon_box_2 icon_position_mobile')){
            $content.find('.'+it+' .mfn-icon-box').removeClass('mfn-icon-box-mobile-top mfn-icon-box-mobile-bottom mfn-icon-box-mobile-left mfn-icon-box-mobile-right');
            if( val ) $content.find('.'+it+' .mfn-icon-box').addClass('mfn-icon-box-mobile-'+val);
        }

        // icon box 2 icon align
        if($editbox.hasClass('icon_box_2 icon_align')){
            $content.find('.'+it+' .mfn-icon-box').removeClass('mfn-icon-box-center mfn-icon-box-start mfn-icon-box-end');
            $content.find('.'+it+' .mfn-icon-box').addClass('mfn-icon-box-'+val);
        }

        // icon box 2 icon align tablet
        if($editbox.hasClass('icon_box_2 icon_align_tablet')){
            $content.find('.'+it+' .mfn-icon-box').removeClass('mfn-icon-box-tablet-center mfn-icon-box-tablet-start mfn-icon-box-tablet-end');
            if( val ) $content.find('.'+it+' .mfn-icon-box').addClass('mfn-icon-box-tablet-'+val);
        }

        // icon box 2 icon align mobile
        if($editbox.hasClass('icon_box_2 icon_align_mobile')){
            $content.find('.'+it+' .mfn-icon-box').removeClass('mfn-icon-box-mobile-center mfn-icon-box-mobile-start mfn-icon-box-mobile-end');
            if( val ) $content.find('.'+it+' .mfn-icon-box').addClass('mfn-icon-box-mobile-'+val);
        }

        // icon box 2 title tag
        if($editbox.hasClass('icon_box_2 title_tag')){
            var ib2_title = $content.find('.'+it+' .mfn-icon-box .title').html();
            $content.find('.'+it+' .mfn-icon-box .title').replaceWith('<'+val+' class="title">'+ib2_title+'</'+val+'>');
        }

        // sticky wrapper

        if( $('.mfn-ui').hasClass('mfn-editing-wrap') && ( $editbox.hasClass('sticky') || $editbox.hasClass('tablet_sticky') || $editbox.hasClass('mobile_sticky') ) ){

            stickyWrap.reset();

            if( val == 1 ){
                $content.find('.'+it).addClass('sticky sticky-'+screen);
                $editwrapper.find('.mfn_field_'+screen+'.adv_alignself_wrap .positioning-options ul li:first-child a').trigger('click');
            }else{
                $content.find('.'+it).removeClass('sticky-'+screen);
            }

            stickyWrap.init();
        }

        // single product add to cart text-align
        if($editbox.hasClass('product_cart_button text-align')){
            $content.find('.'+it+' .mfn-product-add-to-cart').removeClass('mfn_product_cart_center mfn_product_cart_left mfn_product_cart_right mfn_product_cart_justify')
            if(val){
                $content.find('.'+it+' > div').addClass('mfn_product_cart_'+val);
            }
        }

        // text column align
        if($editbox.hasClass('column align')){
            $content.find('.'+it+' > div').removeClass('align_center align_left align_right align_justify');
            if(val){
                $content.find('.'+it+' > div').addClass('align_'+val);
            }
        }

        // quick fact align
        if($editbox.hasClass('quick_fact align')){
            $content.find('.'+it+' .quick_fact').removeClass('align_center align_left align_right').addClass('align_'+val);
        }

        // our team style
        if($editbox.hasClass('our_team') && $editbox.hasClass('style')){
            $content.find('.'+it+' .team').removeClass('team_circle team_vertical team_horizontal').addClass('team_'+val);
        }

        // offer thumb align
        if($editbox.hasClass('offer_thumb align')){
            $content.find('.'+it+' .desc_wrapper').removeClass('align_center align_left align_right align_justify').addClass('align_'+val);
        }

        // promo box image position
        if($editbox.hasClass('promo_box position')){
            $content.find('.'+it+' .promo_box_wrapper').removeClass('promo_box_right promo_box_left').addClass('promo_box_'+val);
        }

        // button icon position
        if($editbox.hasClass('widget-button icon_position')){
            $content.find('.'+it+' .button').removeClass('button_right button_left').addClass('button_'+val);
        }

        // counter type
        if($editbox.hasClass('counter') && $editbox.hasClass('type')){
            $content.find('.'+it+' .counter').removeClass('counter_horizontal counter_vertical').addClass('counter_'+val);
        }

        // promo box border
        if($editbox.hasClass('promo_box border')){
            if(val == 0){
                $content.find('.'+it+' .promo_box').removeClass('has_border').addClass('no_border');
            }else{
                $content.find('.'+it+' .promo_box').addClass('has_border').removeClass('no_border');
            }
        }

        // image border
        if($editbox.hasClass('image border')){
            if(val == 0){
                $content.find('.'+it+' .image_frame').removeClass('has_border').addClass('no_border');
            }else{
                $content.find('.'+it+' .image_frame').addClass('has_border').removeClass('no_border');
            }
        }

        // image align
        if($editbox.hasClass('image align')){
                $content.find('.'+it+' .image_frame').removeClass('alignleft alignright aligncenter');
            if(val){
                $content.find('.'+it+' .image_frame').addClass('align'+val);
            }
        }

        // trailer box orientation
        if($editbox.hasClass('trailer_box orientation')){
            $content.find('.'+it+' .trailer_box').removeClass('horizontal');
            if(val){
                $content.find('.'+it+' .trailer_box').addClass(val);
            }
        }

        // story box style
        if($editbox.hasClass('story_box') && $editbox.hasClass('style')){
            $content.find('.'+it+' .story_box').removeClass('vertical');
            if(val){
                $content.find('.'+it+' .story_box').addClass('vertical');
            }
        }

        // list style
        if($editbox.hasClass('list') && $editbox.hasClass('style')){
            $content.find('.'+it+' .list_item').removeClass('lists_1 lists_2 lists_3 lists_4').addClass('lists_'+val);
        }

        // icon box icon position
        if($editbox.hasClass('icon_box icon_position')){
            $content.find('.'+it+' .icon_box').removeClass('icon_position_left');
            if(val == 'left'){
                $content.find('.'+it+' .icon_box').addClass('icon_position_left');
            }
        }

        // blog teaser margin
        if($editbox.hasClass('blog_teaser margin')){
            $content.find('.'+it+' .blog-teaser').removeClass('margin-no');
            if(val == 0){
                $content.find('.'+it+' .blog-teaser').addClass('margin-no');
            }
        }

        // how it works border
        if($editbox.hasClass('how_it_works border')){
            if(val == 1){
                $content.find('.'+it+' .how_it_works').addClass('has_border').removeClass('no_border');
            }else{
                $content.find('.'+it+' .how_it_works').removeClass('has_border').addClass('no_border');
            }
        }

        // hover color align
        if($editbox.hasClass('hover_color align')){
            $content.find('.'+it+' .hover_color').removeClass('align_center align_left align_right align_justify');
            $content.find('.'+it+' .hover_color').addClass('align_'+val);
        }


        // button full width fullwidth
        if($editbox.hasClass('widget-button full_width')){
            $content.find('.'+it+' .button').removeClass('button_full_width');
            if(val == 1){
                $content.find('.'+it+' .button').addClass('button_full_width');
            }
        }

        // button size
        if($editbox.hasClass('widget-button') && $editbox.hasClass('size')){
            $content.find('.'+it+' .button').removeClass('button_size_1 button_size_2 button_size_3 button_size_4');
            $content.find('.'+it+' .button').addClass('button_size_'+val);
        }

        // blog more
        if($editbox.hasClass('blog more')){
            $content.find('.'+it+' .posts_group').removeClass('hide-more');
            if(val == 0){
                $content.find('.'+it+' .posts_group').addClass('hide-more');
            }
        }

        // blog more
        if($editbox.hasClass('blog margin')){
            $content.find('.'+it+' .posts_group').removeClass('margin');
            if(val == 1){
                $content.find('.'+it+' .posts_group').addClass('margin');
            }
        }

        // mobile column text align
        if($editbox.hasClass('column align-mobile')){
            $content.find('.'+it+' > div').removeClass('mobile_align_center mobile_align_left mobile_align_right mobile_align_justify');
            if(val){
                $content.find('.'+it+' > div').addClass('mobile_align_'+val);
            }
        }

    }

});

// multiple fields

$editpanel.on('keyup', '.multiple-inputs .field input', function() {
    var $editbox = $(this).closest('.multiple-inputs');

    if($editbox.hasClass('isLinked')){
        var thisval = $(this).val();
        $editbox.find('.disableable input').val(thisval);
    }

}).on('change', '.multiple-inputs .field input', function() {
    var $input = $(this);
    var rwd = 'desktop';
    var $editbox = $input.closest('.multiple-inputs');
    var $box = $input.closest('.mfn-vb-formrow');
    var val = $input.val();

    if( $box.hasClass('mfn_field_tablet') ){
        rwd = 'tablet';
    }else if( $box.hasClass('mfn_field_mobile') ){
        rwd = 'mobile';
    }

    var units_check = false;

    if( val.length && $input.hasClass('numeral') ){
        $.each( units, function( i, el ) {
            if( val == 'initial' || val == 'auto' || val.includes(el) ){
                units_check = true;
            }
        });

        if(units_check == false){
            val += "px";
            $input.val(val);
            //if( $editbox.hasClass('isLinked') ) $editbox.find('.disableable input').val(val).trigger('change');
        }
    }

    if( $editbox.hasClass('isLinked') ) {
        $editbox.find('.disableable input').each(function() {
            $(this).val(val);
            getFieldChange($(this));
        });

        loopAllStyleFields(edited_item.uid);
    }

    if(!$editbox.hasClass('separated-fields')){
        updatePseudoField($editbox);
    }

    if( !$input.closest('.disableable').length ){
        setTimeout(addHistory, 200);
    }

    if($content.find('.vb-item[data-uid='+edited_item.uid+'] .slick-initialized').length){
        setTimeout(function() {
        $content.find('.vb-item[data-uid='+edited_item.uid+'] .slick-initialized').each(function() {
            $(this).slick('setPosition');
        });
        },300);
    }

});

$editpanel.on('click', '.multiple-inputs a.link', function(e) {
    e.preventDefault();
    var $editbox = $(this).closest('.multiple-inputs');

    if($editbox.hasClass('isLinked')){
        $editbox.removeClass('isLinked');
        $editbox.find('.disableable input').removeClass('readonly').removeAttr('readonly');
    }else{
        var thisval = $editbox.find('.form-control .field').first().find('input').val();
        $editbox.addClass('isLinked');
        $editbox.find('.disableable input').addClass('readonly').attr('readonly', 'readonly');
        $editbox.find('.disableable input').val(thisval).trigger('change');

        if(!$editbox.hasClass('separated-fields')){
            updatePseudoField($editbox);
        }

    }

    setTimeout(addHistory, 100);
});

$editpanel.on('change', '.mfn-element-fields-wrapper .icon_box_2.hover .preview-hoverinput', function() {
    var val = $(this).val();
    let it = $(this).closest('.mfn-element-fields-wrapper').attr('data-element');

    $content.find('.'+it+' .mfn-icon-box').removeClass('mfn-icon-box-move-up mfn-icon-box-box-scale mfn-icon-box-icon-scale');
    if( val ) $content.find('.'+it+' .mfn-icon-box').addClass('mfn-icon-box-'+val);
});

$editpanel.on('change', '.browse-image:not(.multi) .mfn-field-value', function() {
    var val = $(this).val();
    var imgInput = $(this);

    if( val.length ){
        uploader.itemsUpdate(val, imgInput);
    }

});

$editpanel.on('change', '.preview-height_switcherinput', function(e) {
    let val = $(this).val();
    let it = $(this).closest('.mfn-element-fields-wrapper').attr('data-element');
    let $el = $edited_div;

    if(val == 'full-screen'){
        $el.addClass('full-screen');
    }else{
        $el.removeClass('full-screen');
    }

    if( val == 'default' && screen == 'desktop' ){
        $(this).closest('.mfn-element-fields-wrapper').find('.modalbox-card-advanced .mfn_field_desktop.height .mfn-field-value').val('').trigger('change');
    }
    if( val == 'default' && screen == 'tablet' ){
        $(this).closest('.mfn-element-fields-wrapper').find('.modalbox-card-advanced .mfn_field_tablet.height_tablet .mfn-field-value').val('').trigger('change');
        $('.mfn-element-fields-wrapper .mfn_field_tablet .preview-height_tabletinput').val('').trigger('change');
    }
    if( val == 'default' && screen == 'mobile' ){
        $(this).closest('.mfn-element-fields-wrapper').find('.modalbox-card-advanced .mfn_field_mobile.height_mobile .mfn-field-value').val('').trigger('change');
        $('.mfn-element-fields-wrapper .mfn_field_mobile .preview-height_mobileinput').val('').trigger('change');
    }
});

$editpanel.on('change', '.preview-width_switcherinput', function(e) {
    let val = $(this).val();
    let uid = $(this).closest('.mfn-element-fields-wrapper').attr('data-element');

    $content.find('.'+uid).removeClass('mfn-item-inline custom-width full-width default-width');

    if( $content.find('.'+uid).hasClass('mcb-section')){
         $content.find('.'+uid).addClass(val+'-width');
    }else if(val == 'inline' &&  $content.find('.'+uid).hasClass('mcb-column')){
         $content.find('.'+uid).addClass('mfn-item-inline');
    }

    if( val == 'default' ){

        if( $('.mfn-ui .panel-edit-item .mfn-form .modalbox-card-advanced .inline-style-input.max-width .mfn-form-input').length ){
            $('.mfn-ui .panel-edit-item .mfn-form .modalbox-card-advanced .inline-style-input.max-width .mfn-form-input').val('').trigger('change');
        }

        if( screen == 'desktop' ){
            if( $('.mfn-ui .panel-edit-item .mfn-form .modalbox-card-advanced .mfn_field_desktop.advanced_flex.inline-style-input .mfn-field-value').length ){
                $('.mfn-ui .panel-edit-item .mfn-form .modalbox-card-advanced .mfn_field_desktop.advanced_flex.inline-style-input .mfn-field-value').val('').trigger('change');
            }
        }else if( screen == 'tablet' ){
            if( $('.mfn-ui .panel-edit-item .mfn-form .modalbox-card-advanced .mfn_field_tablet.advanced_flex.inline-style-input .mfn-field-value').length ){
                $('.mfn-ui .panel-edit-item .mfn-form .modalbox-card-advanced .mfn_field_tablet.advanced_flex.inline-style-input .mfn-field-value').val('').trigger('change');
            }
        }else if( screen == 'mobile' ){
            if( $('.mfn-ui .panel-edit-item .mfn-form .modalbox-card-advanced .mfn_field_mobile.advanced_flex.inline-style-input .mfn-field-value').length ){
                $('.mfn-ui .panel-edit-item .mfn-form .modalbox-card-advanced .mfn_field_mobile.advanced_flex.inline-style-input .mfn-field-value').val('').trigger('change');
            }
        }

    }
});

$editpanel.on('change', '.mfn-element-fields-wrapper .advanced_flex.inline-style-input .mfn-field-value', function() {
    var val = $(this).val();
    var uid = $(this).closest('.mfn-element-fields-wrapper').attr('data-element');

    if( val.length ){
        $content.find('.'+uid+' .mfn-header').first().find('.mfn-element-size-label').text( 'Custom' );
        $content.find('.'+uid).attr('data-'+screen+'-size', 'Custom');
    }

});

$editpanel.on('click', '.multiple-inputs a.inset', function(e) {
    e.preventDefault();
    var $editbox = $(this).closest('.multiple-inputs');
    if($editbox.hasClass('isInset')){
        $editbox.removeClass('isInset');
        $editbox.find('input.boxshadow-inset').val('');
    }else{
        var thisval = $editbox.find('.field input').val();
        $editbox.addClass('isInset');
        $editbox.find('input.boxshadow-inset').val('inset');
    }
    updatePseudoField($editbox);
});

// animation

$editpanel.on('change', '.preview-animateinput', function(){
    let it = $(this).closest('.mfn-element-fields-wrapper').attr('data-element');
    let $edited_box = $edited_div;
    let val = $(this).val();

    $edited_box.removeClass('animate fadeIn fadeInUp fadeInDown fadeInLeft fadeInRight fadeInUpLarge fadeInDownLarge fadeInLeftLarge fadeInRightLarge zoomIn zoomInUp zoomInDown zoomInLeft zoomInRight zoomInUpLarge zoomInDownLarge zoomInLeftLarge bounceIn bounceInUp bounceInDown bounceInLeft bounceInRight');
    if(val.length){
        $edited_box.addClass('animate '+val);
    }
});

// mask shape

function maskShapeGetAttrs( el ) {
    const formInputVal = $(el).find('.mfn-form-select').val();
    const sectionName = $(el).closest('.mfn-element-fields-wrapper').attr('data-element');
    const sectionDom = $("iframe#mfn-vb-ifr").contents().find('body').find('.'+sectionName);

    return {formInputVal, sectionName, sectionDom};
}

let maskShapeConditionalArray = [];
function maskShapeHideChildrenConditional( el ) {
    const isMaskShapeEnabled = "None" !== $(el).find('[data-name="mask_shape_type"] select option:selected').text();

    //Hide

    if ( !isMaskShapeEnabled ) {
        maskShapeConditionalArray = [];
        let isPositionEnabled = "Custom" === $(el).find('[data-name="mask_shape_position"] select option:selected').text();
        let isSizeEnabled = "Custom" === $(el).find('[data-name="mask_shape_size"] select option:selected').text() ;

        if ( isPositionEnabled ) {
            const hiddenInputX = $(el).find('[data-name="-webkit-mask-position-x"]');
            const hiddenInputY = $(el).find('[data-name="-webkit-mask-position-y"]');

            maskShapeConditionalArray.push(hiddenInputX, hiddenInputY);
        }

        if ( isSizeEnabled ) {
            const hiddenInput = $(el).find('[data-name="-webkit-mask-size"]');
            maskShapeConditionalArray.push(hiddenInput);
        }

        setTimeout(function(){
            maskShapeConditionalArray.forEach(element => {
                $(element).removeClass('conditionally-show');
                $(element).addClass('conditionally-hide');
            });
        }, 0 )

        return;
    }

    //Display

    maskShapeConditionalArray.forEach(element => {
        $(element).addClass('conditionally-show');
        $(element).removeClass('conditionally-hide');
    });

    return;

}

$editpanel.on('change', '.heading.background-image:not(.activeif-background_switcher_adv)', function() {
    const formInputVal = $(this).find('.mfn-form-input').val();
    const {sectionDom } = maskShapeGetAttrs($(this));
    const titleDom = $(sectionDom).find('.title');

    if(formInputVal.length > 0){
        $(titleDom).addClass('mfn-mask-shape');
    } else {
        $(titleDom).removeClass('mfn-mask-shape');
    }
})

$editpanel.on('change', '.mask_shape_type', function() {
    const {formInputVal, sectionDom } = maskShapeGetAttrs($(this));
    const availableStyles = ['circle', 'blob', 'blob-2', 'brush', 'brush-2', 'cross', 'irregular-circle', 'stain', 'triangle', 'custom'];
    const itemName = sectionDom.hasClass('column_image') ? 'image' : 'video';
    const shapeContainer = itemName === 'image' ? $(sectionDom).find('.image_frame') : $(sectionDom).find('.content_video');
    const parentContainer = $(this).closest('.mfn-element-fields-wrapper');

    availableStyles.forEach(style => {
        $( shapeContainer ).removeClass(style);
    })

    if(parseInt(formInputVal) == 0 ){
        if( shapeContainer.hasClass('mfn-mask-shape') ){
            $(shapeContainer).removeClass('mfn-mask-shape');
        }

        maskShapeHideChildrenConditional(parentContainer);
    } else {
        if( !shapeContainer.hasClass('mfn-mask-shape') ){
            $(shapeContainer).addClass('mfn-mask-shape');
        }

        maskShapeHideChildrenConditional(parentContainer);
        $( shapeContainer ).addClass( formInputVal );
    }
})

$editpanel.on('change', '.mask_shape_size', function() {
    const {formInputVal, sectionName, sectionDom } = maskShapeGetAttrs($(this));

    //itemName variable must be here, because heading does not have custom size/position
    const itemName = sectionDom.hasClass('column_image') ? 'image' : 'video';
    const shapeContainer = itemName === 'image' ? $(sectionDom).find('img') : $(sectionDom).find('video, iframe');

    if(formInputVal !== 'custom' ){
        shapeContainer.css('mask-size', formInputVal);
    } else {
        var sizeAppended = $(this).closest('.mfn-element-fields-wrapper').find('.-webkit-mask-size .mfn-sliderbar-value').val();
        shapeContainer.css('mask-size', `${sizeAppended}%`);
    }
})

$editpanel.on('change', '.mask_shape_position', function() {
    const {formInputVal, sectionName, sectionDom } = maskShapeGetAttrs($(this));

    //itemName variable must be here, because heading does not have custom size/position
    const itemName = sectionDom.hasClass('column_image') ? 'image' : 'video';
    const shapeContainer = itemName === 'image' ? $(sectionDom).find('img') : $(sectionDom).find('video, iframe');

    if(formInputVal !== 'custom' ){
        const positions = formInputVal.split(' ');
        shapeContainer.css('mask-position-y', positions[0]);
        shapeContainer.css('mask-position-x', positions[1]);
    }
})

// shape divider

function shapeDividerGetAttrs( el ) {
    const sectionName = $(el).closest('.mfn-element-fields-wrapper').attr('data-element');
    const sectionDom = $("iframe#mfn-vb-ifr").contents().find('body').find('.'+sectionName);

    const inputName = $(el).attr('data-name');
    const inputValue = $(el).find('.mfn-field-value').val();
    const checkboxValue = $(el).find('li.active input[type="checkbox"]').val();

    const shapeDividerPosition = inputName.match(/top|bottom/).toString();
    const shapeDividerDom = $(sectionDom).find('.mfn-shape-divider[data-name="'+ shapeDividerPosition +'"]');

    let invertValue = $(el).siblings('.shape_divider_invert_'+shapeDividerPosition).find('li.active input[type="checkbox"]').val();

    let shapeDividerOptions = inputName.match(/flip|bring_front/);
    if (shapeDividerOptions != null){
      shapeDividerOptions = shapeDividerOptions.toString();
    }

    return {inputName, inputValue, checkboxValue, sectionName, sectionDom, shapeDividerPosition, shapeDividerDom, shapeDividerOptions, invertValue};
}

$editpanel.on('change', '.shape_divider_type_top, .shape_divider_type_bottom', function() {
    const { inputValue, shapeDividerPosition, sectionDom, invertValue } = shapeDividerGetAttrs($(this));

    let { shapeDividerDom } = shapeDividerGetAttrs($(this));
    let svgLocation = $(shapeDividerDom).find('svg');
    let currentTabView = $('.panel-edit-item');

    // empty value

    if( ! inputValue ){
      svgLocation.html('<path></path>');
      return;
    }

    // invert

    let invertValSet = currentTabView.find('.shape_divider_invert_'+ shapeDividerPosition +' li.active input').val();
    invertValSet = parseInt(invertValSet);

    let key = 'svg';
    if( invertValSet && ( 'invert' in mfnvbvars.shape_dividers[inputValue]) ){
      key = 'invert';
    } else {
      invertValSet = 0;
    }

    shapeDividerDom.attr('data-invert',invertValSet);

    // viewbox

    let viewbox = '0 0 1200 120';

    if( 'viewbox' in mfnvbvars.shape_dividers[inputValue] ){
      viewbox = mfnvbvars.shape_dividers[inputValue]['viewbox'];
    }

    svgLocation.attr('viewBox',viewbox);

    // get path

    const rand = Math.random().toString(36).substring(8);
    const regex = /mfn-uid-/g;
    let pathVal = mfnvbvars.shape_dividers[inputValue][key].replace( regex, 'mfn-uid-'+ rand );

    svgLocation.html(pathVal);
});

$editpanel.on('change', '.shape_divider_flip_top, .shape_divider_invert_top, .shape_divider_bring_front_top, .shape_divider_flip_bottom, .shape_divider_invert_bottom, .shape_divider_bring_front_bottom', function() {
    const { shapeDividerDom, inputName, checkboxValue, shapeDividerPosition } = shapeDividerGetAttrs($(this));
    let svgLocation = $(shapeDividerDom).find('svg');
    let toChange;

    switch(inputName){

      case 'shape_divider_flip_'+ shapeDividerPosition:
        $(shapeDividerDom).attr('data-flip', checkboxValue); //0 or 1
        break;

      case 'shape_divider_invert_'+ shapeDividerPosition:
        svgLocation = $(shapeDividerDom).closest('.be-custom-shape');

        $(shapeDividerDom).attr('data-invert', checkboxValue); //0 or 1

        //Invert is chaning the "D" path, so we need to update it
        const typeSwitch = $(this).siblings('div[data-name="shape_divider_type_'+shapeDividerPosition+'"]');
        $(typeSwitch).trigger('change');
        break;

      case 'shape_divider_bring_front_'+ shapeDividerPosition:
        $(shapeDividerDom).attr('data-bring-front', checkboxValue); //0 or 1

        $(svgLocation).css('z-index', toChange);
        break;

    }
});

// decoration svgs

$editpanel.on('change', '.preview-dividerinput', function() {
    let it = $(this).closest('.mfn-element-fields-wrapper').attr('data-element');
    let val = $(this).val();
    if($content.find('.'+it+' .section-divider').length){
        $content.find('.'+it+' .section-divider').removeClass('circle up square triangle triple-triangle down').addClass(val);
    }else if(val != ''){
        $edited_div.append('<div class="section-divider '+val+'"></div>');
    }
});

// segmented options multi segmented

$editpanel.on('click', '.multiple-segmented-options.segmented-options ul li a', function(e) {
    e.preventDefault();

    let $editbox = $(this).closest('.mfn-form-row');
    let $hiddeninput = $('.mfn-field-value', $editbox);
    let $li = $(this).closest('li');
    let it = $editbox.closest('.mfn-element-fields-wrapper').attr('data-element');
    let val = $li.find('input').val();

    if($li.hasClass('active')){

        $li.find('input').prop('checked', false);
        $li.removeClass('active');
        $edited_div.removeClass(val);
    }else{
        $li.addClass('active');
        $li.find('input').prop('checked', true);
        $edited_div.addClass(val);
    }

    var value = '';

    $('li input:checked', $editbox).each(function() {
        value = value + ' ' + $(this).val();
    });

    $hiddeninput.val(value).trigger('change');
    //console.log($hiddeninput.val());
});

// gradient input change

$editpanel.on('change', '.mfn-vb-formrow.gradient .mfn-form-control', function() {
    let $editbox = $(this).closest('.mfn-vb-formrow');
    gradientValue($editbox);
});


// pseudo checkbox

$editpanel.on('click', '.checkboxes.pseudo ul li', function() {

    let $editbox = $(this).closest('.mfn-form-row');
    let it = $editbox.closest('.mfn-element-fields-wrapper').attr('data-element');
    let val = $(this).children('input').val();

    let windowH = $(window).height() || 0;

    if($(this).hasClass('active')){
        $(this).find('input').prop('checked', false);
        $(this).removeClass('active');
        $edited_div.removeClass(val);

        if($editbox.hasClass('mfn-type-section') && val == 'full-screen'){
            $edited_div.css({'min-height': '50px'});
            $content.find('.'+it+' .section_wrapper').css({'padding-top': 0, 'padding-bottom': 0});
        }

    }else{
        $(this).addClass('active');
        $(this).find('input').prop('checked', true);
        $edited_div.addClass(val);
    }

    var value = '';

    $('li input:checked', $editbox).each(function() {
        value = value + ' ' + $(this).val();
    });

    $('.value', $editbox).val(value).trigger('change');

});

// radio img

$editpanel.on('click', '.visual-options ul li, .visual-options ul li a', function(e) {
    e.preventDefault();

    let $li = $(this);
    let $editbox = $li.closest('.mfn-form-row');
    let $edit_wrapper = $li.closest('.mfn-element-fields-wrapper');

    let it = $edit_wrapper.attr('data-element');
    let val = $li.find('input').val();

    if(!$li.hasClass('active')){
        $editbox.find('li').removeClass('active');
        $editbox.find('li').find('input').prop('checked', false);

        $li.addClass('active');
        $li.find('input').prop('checked', true).trigger('change');
    }

});



function onOpenEditForm() {

    /**
      * Category
      */

    /*$editpanel.find('.panel-edit-item .mfn-form .mfn-form-row .mfn-form-category').each(function() {
      var name = $(this).attr('name');
      if (name in edited_item.fields) {
        $(this).val(edited_item.fields[name]).trigger('change');
      }
    });*/

    /**
     * Color pickers
    * */

    $editpanel.find('.panel-edit-item .mfn-form .mfn-form-row .color-picker .form-control .color-picker-vb').each(function() {
        if( $(this).val() != '' ){
            $(this).closest('.color-picker').find('.form-addon-prepend .label').css('border-color', $(this).val()).css('background-color', $(this).val()).removeClass('light dark').addClass(getContrastYIQ( $(this).val() ));
        }
    });

    /**
     * Sidebar nav trigger click
    * */

    if( $editpanel.find('.panel-edit-item .mfn-form .mfn-sidebar-fields-tabs ul.mfn-sft-nav').length ){
        $editpanel.find('.panel-edit-item .mfn-form .mfn-sidebar-fields-tabs ul.mfn-sft-nav').each(function() {
            $(this).find('li:first-child a').trigger('click');
        });
    }

    /**
     * Deprecated hide
    * */

    if( $('.panel-edit-item .mfn-element-fields-wrapper .mfn-vb-formrow.mfn-deprecated').length ){
        $('.panel-edit-item .mfn-element-fields-wrapper .mfn-vb-formrow.mfn-deprecated').each(function() {
            if( $(this).find('.mfn-field-value').length && !$(this).find('.mfn-field-value').val().length ) $(this).remove();
        });
        if( !$('.panel-edit-item .mfn-element-fields-wrapper .mfn-vb-formrow.mfn-deprecated .mfn-field-value').length ) $('.panel-edit-item .mfn-element-fields-wrapper .mfn-vb-formrow.mfn-deprecated').remove();
    }

    if( $('.panel-edit-item .mfn-element-fields-wrapper .browse-image.multi .gallery-container li').length ){
        uploader.sortable();
    }

    /**
     * Slider bar
    * */

    if( $('.panel-edit-item .mfn-form .mfn-element-fields-wrapper .mfn-vb-formrow .sliderbar:not(.mfn-initialized)').length ){
        $('.panel-edit-item .mfn-form .mfn-element-fields-wrapper .mfn-vb-formrow .sliderbar:not(.mfn-initialized)').each(function() {
            sliderInput.init($(this));
        });
    }

    /**
     * Mask shapes
     */

    const getMaskShapeParents = $('.panel-edit-item').find('[data-item="image"], [data-item="video"]');
    if( getMaskShapeParents.length ) {
      maskShapeHideChildrenConditional( getMaskShapeParents );
    };

}



$editpanel.on('click', '.mfn-form-row .color-picker .form-control .color-picker-vb:not(.mfn-initialized)', function() {
    if( !$(this).hasClass('mfn-initialized') ){
        $(this).addClass('mfn-initialized');

        var $this_input = $(this);

        var cp_selector = 'color-picker-vb-'+getUid();
        var $edit_field = $(this).closest('.mfn-form-row');
        var $edit_wrapper = $(this).closest('.mfn-element-fields-wrapper');
        var element = $edit_wrapper.attr('data-element');
        var css_style = $edit_field.attr('data-name');
        var css_path = $edit_field.attr('data-csspath');

        var default_color = $this_input.val().length ? $this_input.val() : mfn.themecolor;

        $this_input.addClass(cp_selector+' mfn-initialized');
        const inputElement = document.querySelector( '.'+cp_selector );

        const mfnPickr = Pickr.create({
            el: inputElement,
            theme: 'nano',
            useAsButton: true,
            defaultRepresentation: 'HEX',
            default: default_color,
            comparison: true,
            swatches: [
                'rgba(244, 67, 54, 1)',
                'rgba(233, 30, 99, 1)',
                'rgba(156, 39, 176, 1)',
                'rgba(103, 58, 183, 1)',
                'rgba(63, 81, 181, 1)',
                'rgba(33, 150, 243, 1)',
                'rgba(3, 169, 244, 1)',
                'rgba(0, 188, 212, 1)',
                'rgba(0, 150, 136, 1)',
                'rgba(76, 175, 80, 1)',
                'rgba(139, 195, 74, 1)',
                'rgba(205, 220, 57, 1)',
                'rgba(255, 235, 59, 1)',
                'rgba(255, 193, 7, 1)'
            ],
            components: {
                palette: true,
                preview: true,
                opacity: true,
                hue: true,
                interaction: {
                    hex: false,
                    rgba: false,
                    hsla: false,
                    hsva: false,
                    cmyk: false,
                    input: true,
                    clear: true,
                    save: true
                }
            },
        }).on('init', (color, instance) => {
            mfnPickr.show();
        }).on('show', (color, instance) => {
            $('.sidebar-wrapper').addClass('mfn-vb-sidebar-overlay');
        }).on('hide', (color, instance) => {
            $('.sidebar-wrapper').removeClass('mfn-vb-sidebar-overlay');
        }).on('save', color => {
            mfnPickr.hide();
        }).on('change', (color, source, instance) => {
            var cl = color.toHEXA().toString(0);
            if( color.a < 1 ) cl = color.toRGBA().toString(0).replaceAll(' ', '');

            $this_input.val( cl );

            if( $edit_field.hasClass('gradient') ){
                gradientValue( $edit_field, true );
            }else if($edit_field.hasClass('fancy_divider color_top')){
               changeFancyDividerColorTop($edit_wrapper.attr('data-element'), $edit_wrapper.attr('data-group'), cl);
            }else if($edit_field.hasClass('fancy_divider color_bottom')){
               changeFancyDividerColorBottom($edit_wrapper.attr('data-element'), $edit_wrapper.attr('data-group'), cl);
            }else if($edit_field.hasClass('widget-chart color')){
                changeColorChart($edit_wrapper.attr('data-element'), cl);
            }else if(css_path){
                //$content.find(css_path.replace('|hover', '')).css( css_style, cl );
                changeInlineStyles(css_path.replaceAll('|hover', '').replaceAll('|before', ':before').replaceAll('|after', ':after').replaceAll('|not', ':not'), css_style, cl);
            }
            $(inputElement).closest('.color-picker').find('.form-addon-prepend .label').css('border-color', cl).css('background-color', cl);
            $(inputElement).closest('.color-picker').find('.form-addon-prepend .label').removeClass('light dark').addClass(getContrastYIQ( color.toHEXA().toString(0) ));
        }).on('changestop', (source, instance) => {

            var cl = instance._color.toHEXA().toString(0);

            if(typeof css_path == typeof undefined && $edit_field.hasClass('widget-chart color')){
                $this_input.val( cl ).trigger('change');
                return;
            }

            if( instance._color.a < 1 ) cl = instance._color.toRGBA().toString(0).replaceAll(' ', '');

            $this_input.val( cl ).trigger('change');

            if( $edit_field.hasClass('gradient') ){
                gradientValue( $edit_field, false );
            }

            if(css_path && !$edit_field.hasClass('fancy_divider')){
                setTimeout(function() {
                    changeInlineStyles(css_path.replaceAll('|hover', '').replaceAll('|before', ':before').replaceAll('|after', ':after').replaceAll('|not', ':not'), css_style, 'remove');
                }, 50);
            }

        }).on('swatchselect', (source, instance) => {

            if(!css_path && $edit_field.hasClass('widget-chart color')){
                $this_input.val( instance._color.toHEXA().toString(0) ).trigger('change');
                return;
            }

            $this_input.val( instance._color.toHEXA().toString(0) ).trigger('change');

            if(css_path && !$edit_field.hasClass('fancy_divider')){
                setTimeout(function() {
                    changeInlineStyles(css_path.replaceAll('|hover', '').replaceAll('|before', ':before').replaceAll('|after', ':after').replaceAll('|not', ':not'), css_style, 'remove');
                }, 50);
            }
        }).on('clear', instance => {
            mfnPickr.hide();
            $edit_field.find('.color-picker-clear').trigger('click');
        });
    }
})

// color picker

$editpanel.on('change', '.mfn-vb-formrow .color-picker-vb', function(e){
    e.preventDefault();

    var color = $(this).val();

    if( color.length ){
        $(this).closest('.color-picker').find('.form-addon-prepend .label').css('border-color', color).css('background-color', color);
        $(this).closest('.color-picker').find('.form-addon-prepend .label').removeClass('light dark').addClass(getContrastYIQ( color ));
    }else{
        $(this).closest('.color-picker').find('.form-addon-prepend .label').removeAttr('style').removeClass('dark').addClass('light');
    }
});

$editpanel.on('click', '.color-picker-clear', function(e){
    e.preventDefault();
    let $edit_wrapper = $(this).closest('.mfn-element-fields-wrapper');
    let $editfield = $(this).closest('.mfn-form-row');
    let $group = $(this).closest('.color-picker-group');

    let csspath = $editfield.attr('data-csspath');
    let cssstyle = $editfield.attr('data-name');

    if($editfield.hasClass('gradient')){
        $editfield.find('.color-picker-vb').val('').trigger('change');
    }else{
        $group.find('.color-picker-vb').val('').trigger('change');
    }


    if( $editfield.find('.multiple-inputs .pseudo-field.mfn-field-value').length ){
        updatePseudoField( $editfield.find('.multiple-inputs') );
    }else if($editfield.hasClass('fancy_divider color_top')){
       changeFancyDividerColorTop($edit_wrapper.attr('data-element'), $edit_wrapper.attr('data-group'), 'remove');
    }else if($editfield.hasClass('fancy_divider color_bottom')){
       changeFancyDividerColorBottom($edit_wrapper.attr('data-element'), $edit_wrapper.attr('data-group'), 'remove');
    }

    //changeInlineStyles(csspath, cssstyle, 'remove');
    $group.find('.form-addon-prepend .label').removeAttr('style').removeClass('dark').addClass('light');
});

$editpanel.on('click', '.color-picker-open', function(e){
    e.preventDefault();
    let $group = $(this).closest('.color-picker-group');
    $('.form-control .mfn-form-input', $group).trigger('click');
});


$editpanel.on('blur', '.custom_css .preview-custom_cssinput', function() {
    // inline styles column
    let it = $(this).closest('.mfn-element-fields-wrapper').attr('data-element');
    let val = $(this).val();

    let styles = val.split(';');

    $.each(styles, function( i, v ) {
      if(v.trim()){

        let st_expl = v.split(':');
        if(st_expl[0] && st_expl[1]){
            changeInlineStyles('.'+it, st_expl[0], st_expl[1]);
        }
      }
    });

}).on('focus', '.custom_css .preview-custom_cssinput', function() {
    // inline styles column
    let it = $(this).closest('.mfn-element-fields-wrapper').attr('data-element');
    let val = $(this).val();

    let styles = val.split(';');

    $.each(styles, function( i, v ) {
      if(v.trim()){

        let st_expl = v.split(':');

        if(st_expl[0] && st_expl[1]){
            changeInlineStyles('.'+it, st_expl[0], 'remove');
        }
      }
    });

});

/**
 *
 * DEPRECATED FIELDS
 *
 * */


// column inline css

$editpanel.on('blur', '.column.style .preview-styleinput', function() {
    // inline styles column
    let it = $(this).closest('.mfn-element-fields-wrapper').attr('data-element');
    let val = $(this).val();

    let styles = val.split(';');
    $.each(styles, function( i, v ) {
      if(v.trim()){
        let st_expl = v.split(':');
        if(st_expl[0] && st_expl[1]){
            changeInlineStyles('.'+it+' .column_attr', st_expl[0], st_expl[1]);
        }
      }
    });
}).on('focus', '.column.style .preview-styleinput', function() {
    // inline styles column
    let it = $(this).closest('.mfn-element-fields-wrapper').attr('data-element');
    let val = $(this).val();

    let styles = val.split(';');
    $.each(styles, function( i, v ) {
      if(v.trim()){
        let st_expl = v.split(':');
        if(st_expl[0] && st_expl[1]){
            changeInlineStyles('.'+it+' .column_attr', st_expl[0], 'remove');
        }
      }
    });
});

/**
 *
 * END DEPRECATED FIELDS
 *
 * */

$editpanel.on('click', '.mfn-fr-help-icon', function(e) {
    e.preventDefault();
    if( $(this).closest('.mfn-form-row').find('.desc-group').is(':visible') ){
        $(this).closest('.mfn-form-row').find('.desc-group').slideUp(300);
    }else{
        $(this).closest('.mfn-form-row').find('.desc-group').slideDown(300);
    }
});

$editpanel.on('mouseover', '.panel-edit-item .tabs-wrapper:not(.mfn-initialized)', function() {
    tabsField.sortable();
});


function updatePseudoField($box){
    var value = '';
    var isEmpty = true;
    $box.find('.field input').each(function(i) {
        if( $(this).val().length ){
            isEmpty = false;
            return;
        }
    });
    if(!isEmpty){
        $box.find('.field input').each(function(i) {
            if( $(this).val().length ){
                value += i == 0 ? $(this).val() : ' '+$(this).val();
            }else if( !$(this).hasClass('boxshadow-inset') ){
                value += i == 0 ? '0' : ' '+'0';
            }
        });
    }
    $box.find('input.pseudo-field').val(value).trigger('change');
}



// global functions

// import element

function importFromClipboard(u, w){

    let import_clipboard = localStorage.getItem('mfn-builder') ? JSON.parse(localStorage.getItem('mfn-builder')) : {};

    if( import_clipboard.clipboard && !$content.find('.vb-item[data-uid="' +u+ '"] .mfn-section-import').hasClass('pending') ){
        $content.find('.vb-item[data-uid="' +u+ '"] .mfn-section-import').addClass('pending');
        $.ajax({
            url: ajaxurl,
            data: {
                action: 'importfromclipboard',
                'mfn-builder-nonce': wpnonce,
                import: import_clipboard.clipboard,
                id: pageid,
                type: 'section'
            },
            type: 'POST',
            success: function(response){

                if( w == 'after' ){
                    $content.find('.vb-item[data-uid="' +u+ '"]').after(response.html);
                    $navigator.find('.navigator-tree li.nav-'+u).after(response.navigator);
                }else{
                    $content.find('.vb-item[data-uid="' +u+ '"]').before(response.html);
                    $navigator.find('.navigator-tree li.nav-'+u).before(response.navigator);
                }

                $content.find('.vb-item[data-uid="' +u+ '"] .mfn-section-import').removeClass('pending');

                $.each(response.form, function(i, el) {
                    mfnvbvars.pagedata.push(el);
                });

                loopAllStyleFields();
                inlineEditor();
                addHistory();
                blink();

            }
        });

    }
}

// export element

function elementToClipboard(u){

    if( !$content.find('.vb-item[data-uid="' +u+ '"] .mfn-section-export').hasClass('pending') ){
        $content.find('.vb-item[data-uid="' +u+ '"] .mfn-section-export').addClass('pending');

        var formData = prepareForm( u );

        $.ajax({
            url: ajaxurl,
            data: {
                action: 'mfntoclipboard',
                'mfn-builder-nonce': wpnonce,
                sections: formData
            },
            type: 'POST',
            success: function(response){

                var btnText = $content.find('.vb-item[data-uid="' +u+ '"] .mfn-section-export').text();
                $content.find('.vb-item[data-uid="' +u+ '"] .mfn-section-export').html('<span class="mfn-icon mfn-icon-check-blue"></span> Exported');

                setTimeout(function(){
                  $content.find('.vb-item[data-uid="' +u+ '"] .mfn-section-export').html('<span class="mfn-icon mfn-icon-export"></span> Export section');
                  $content.find('.vb-item[data-uid="' +u+ '"] .mfn-section-export').removeClass('pending');
                }, 1000);

                $content.find('.section-header .mfn-disabled').removeClass('mfn-disabled');

                localStorage.setItem( 'mfn-builder', JSON.stringify({
                  clipboard: response
                }) );

                mfnbuilder.clipboard = response;

            }
        });

    }
}

// export/import - import submit

$('.mfn-import-button').on('click', function(e) {
    e.preventDefault();


    if(!$('.mfn-import-button').hasClass('loading')){

        if($('#import-data-textarea.mfn-import-field').val().length){

            $('.mfn-import-button').addClass('loading disabled');

            var type = $('.panel-export-import-import .mfn-import-type').val();

            $.ajax({
                url: ajaxurl,
                data: {
                    action: 'importdata',
                    'mfn-builder-nonce': wpnonce,
                    import: $('#import-data-textarea.mfn-import-field').val(),
                    count: 0,
                    id: pageid
                },
                type: 'POST',
                success: function(response){
                    $('.mfn-import-button').removeClass('loading disabled');

                    if( type == 'after' ){
                        $content.find('.mfn-builder-content').append(response.html);
                        $navigator.find('.navigator-tree').append(response.navigator);
                    }else if( type == 'before' ){
                        $content.find('.mfn-builder-content').prepend(response.html);
                        $navigator.find('.navigator-tree').prepend(response.navigator);
                    }else{
                        $content.find('.mfn-builder-content').html(response.html);
                        $navigator.find('.navigator-tree').html(response.navigator);
                    }

                    $.each(response.form, function(i, el) {
                        mfnvbvars.pagedata.push(el);
                    });

                    loopAllStyleFields();

                    blink();

                    checkEmptyPage();

                    mfnChart();
                    inlineEditor();

                    addHistory();

                }
            });

        }else{
            alert('Import input cannot be empty');
        }

    }else{
        alert('Loading. Please wait');
    }

});

// export/import - import single page

$('.mfn-import-single-page-button').on('click', function(e) {
    e.preventDefault();

    var import_place = $('.panel-export-import-single-page .mfn-import-type').val();

    if(!$('.mfn-import-single-page-button').hasClass('loading')){

        if($('#mfn-items-import-page').val().length){

            $('.mfn-import-single-page-button').addClass('loading disabled');

            $.ajax({
                url: ajaxurl,
                data: {
                    action: 'importsinglepage',
                    'mfn-builder-nonce': wpnonce,
                    import: $('#mfn-items-import-page').val(),
                    pageid: $('.mfn-import-single-page-button').data('id'),
                    count: 0
                },
                type: 'POST',
                success: function(response){
                    $('.mfn-import-single-page-button').removeClass('loading disabled');

                    removeStartBuilding();

                    if(import_place == 'before'){
                        $content.find('.mfn-builder-content').prepend(response.html);
                        $navigator.find('.navigator-tree').prepend(response.navigator);
                    }else if(import_place == 'after'){
                        $content.find('.mfn-builder-content').append(response.html);
                        $navigator.find('.navigator-tree').append(response.navigator);
                    }else{
                        $content.find('.mfn-builder-content').html(response.html);
                        $navigator.find('.navigator-tree').html(response.navigator);
                    }

                    $('#mfn-items-import-page').val('');

                    $.each(response.form, function(i, el) {
                        mfnvbvars.pagedata.push(el);
                    });

                    inlineEditor();
                    addHistory();
                    blink();

                    //location.reload();
                }
            });

        }else{
            alert('Import input cannot be empty');
        }

    }else{
        alert('Loading. Please wait');
    }

});

$('.mfn-import-template-button').on('click', function(e) {
    e.preventDefault();

    if(!$('.mfn-import-template-button').hasClass('loading')){

        if($('.mfn-items-import-template li.active').length){

            $('.mfn-import-template-button').addClass('loading disabled');

            var type = $('.mfn-import-template-type').val();

            $.ajax({
                url: ajaxurl,
                data: {
                    action: 'importtemplate',
                    'mfn-builder-nonce': wpnonce,
                    import: $('.mfn-items-import-template li.active').data('id'),
                    count: 0,
                    id: $('.mfn-import-template-button').data('id')
                },
                type: 'POST',
                success: function(response){
                    $('.mfn-import-template-button').removeClass('loading disabled');

                    if( type == 'after' ){
                        $content.find('.mfn-builder-content').append(response.html);
                        $navigator.find('.navigator-tree').append(response.navigator);
                    }else if( type == 'before' ){
                        $content.find('.mfn-builder-content').prepend(response.html);
                        $navigator.find('.navigator-tree').prepend(response.navigator);
                    }else{
                        $content.find('.mfn-builder-content').html(response.html);
                        $navigator.find('.navigator-tree').html(response.navigator);
                    }

                    $.each(response.form, function(i, el) {
                        mfnvbvars.pagedata.push(el);
                    });

                    blink();

                    checkEmptySections();
                    checkEmptyWraps();

                    inlineEditor();
                    mfnChart();

                    addHistory();

                }
            });

        }else{
            alert('Choose template first');
        }

    }else{
        alert('Loading. Please wait');
    }

});

// preview

$('.mfn-preview-generate').on('click', function(e) {
    e.preventDefault();

    var $el = $(this),
    tooltip = $el.data('tooltip'),
    previewURL = $el.attr('data-href');

    if(!$el.hasClass('pending')){

        //$el.attr('data-tooltip', 'Generating preview...');
        $el.addClass('pending');

        var formData = prepareForm();

        $.ajax({
            url: ajaxurl,
            data: {
                sections: formData,
                action: 'generatepreview',
                gtype: 'mfn-builder-preview',
                pageid: pageid,
                'mfn-builder-nonce': wpnonce,
            },
            type: 'POST',
            success: function(response){

                removeStartBuilding();

                //$el.attr('data-tooltip', tooltip);

                if ( ! previewTab || previewTab.closed ) {
                    previewTab = window.open(response, 'preview' );
                    if ( previewTab ) {
                        previewTab.focus();
                    } else {
                        alert('Please allow popups to use preview');
                    }
                } else {
                    previewTab.location.reload();
                    previewTab.focus();
                }

                $el.removeClass('pending');

            }
        });

    }
});

// take post editing

$('.take-post-editing').on('click', function(e) {
    e.preventDefault();
    $el = $(this);

    if(!$el.hasClass('loading')){

        $el.addClass('loading disabled');

        $.ajax({
            url: ajaxurl,
            data: {
                action: 'takepostediting',
                'mfn-builder-nonce': wpnonce,
                pageid: $('.mfn-import-template-button').data('id')
            },
            type: 'POST',
            success: function(response){
                $('.mfn-modal-locker').remove();
            }
        });

    }
});

// prebuilts

$('.mfn-insert-prebuilt').on('click', function(e) {
    e.preventDefault();

    $el = $(this);

    if(!$el.hasClass('loading')){

        let id = $el.closest('li').data('id');
        let count = $content.find('.mcb-section').length;

        $el.addClass('loading disabled');

        $.ajax({
            url: ajaxurl,
            data: {
                'mfn-builder-nonce': wpnonce,
                action: 'insertprebuilt',
                id: id,
                count: count
            },
            type: 'POST',
            success: function(response){

                removeStartBuilding();

                $el.removeClass('loading').find('.text').text('Done');

                if( !$content.find('.mcb-section-'+prebuiltType).length || prebuiltType == 'end' ){
                    $content.find('.mfn-builder-content').append(response.html);
                    $navigator.find('.navigator-tree').append(response.navigator);
                }else{
                    $content.find('.mcb-section-'+prebuiltType).after(response.html);
                    $navigator.find('.navigator-tree li.nav-'+$content.find('.mcb-section-'+prebuiltType).attr('data-uid')).after(response.navigator);
                }

                if( $content.find('.mfn-builder-content .mfn-builder-content .mcb-section').length ){
                    $content.find('.mfn-builder-content .mfn-builder-content .mcb-section').unwrap();
                }

                $.each(response.form, function(i, el) {
                    mfnvbvars.pagedata.push(el);
                });

                if(prebuiltType != 'end'){

                    let newPreBuiltType = $content.find('.mcb-section-'+prebuiltType).next('.mcb-section').attr('data-uid');

                    if($content.find('.mcb-section-'+prebuiltType).hasClass('empty')){
                        var pre_uid = $content.find('.mcb-section-'+prebuiltType).attr('data-uid');
                        $navigator.find('.nav-'+pre_uid).remove();
                        $content.find('.mcb-section-'+prebuiltType).remove();
                        $('.mfn-form .mfn-vb-'+prebuiltType).remove();
                    }

                    prebuiltType = newPreBuiltType;

                }else{
                    prebuiltType = 'end';
                }


                setTimeout(function(){
                    $el.removeClass('disabled').find('.text').text('Insert');
                },1000);

                inlineEditor();

                addHistory();
                blink();



            }
        });


    }else{
        alert('Loading. Please wait');
    }

});

// set revision
function setRevision(type) {

    $list = $('.panel ul.revisions-list[data-type="'+type+'"]');

    let formData = prepareForm();

    $.ajax({
        url: ajaxurl,
        data: {
            'sections': formData,
            'action': 'setrevision',
            'revtype': type,
            'mfn-builder-nonce': wpnonce,
            'pageid': pageid
        },
        type: 'POST',
        success: function(response){

            if( response == 'empty' ){
                $('.mfn-save-revision').removeClass('loading disabled').find('.btn-wrapper').text('Nothing saved');
                setTimeout(function() { $('.mfn-save-revision .btn-wrapper').text('Save revision'); }, 2000);
            }else{
                displayRevisions(response, $list);
                if(type == 'autosave'){
                    $('.btn-save-changes').removeClass('loading disabled');
                }else if(type == 'revision'){
                    $('.mfn-save-revision').removeClass('loading disabled').find('.btn-wrapper').text('Saved');
                    setTimeout(function() { $('.mfn-save-revision .btn-wrapper').text('Save revision'); }, 2000);
                }else if(type == 'mfn-builder-preview'){
                    return true;
                }
            }
        }
    });
}


// autosave

setInterval(autosave, 300000);

function autosave(){
    if(!$('.btn-save-changes').hasClass('disabled')){
        $('.btn-save-changes').addClass('loading disabled');
        setRevision('autosave');
    }
}

// manual save revision
$('.mfn-save-revision').on('click', function(e) {
    if(!$('.mfn-save-revision').hasClass('disabled')){
        $('.mfn-save-revision').addClass('loading disabled');
        setRevision('revision');
    }
});

// restore
$('.revision-restore').on('click', function(e) {
    e.preventDefault();
    restoreRev($(this));
});

function restoreRev($btn){
    if(!$btn.hasClass('disabled')){

        $btn.addClass('loading disabled');

        $list = $('.panel ul[data-type="backup"]');

        $el = $btn.closest('li');

        var time = $el.attr('data-time'),
          type = $el.closest('ul').attr('data-type'),
          btnText = $el.text(),
          revision;

        $.ajax({
            url: ajaxurl,
            data: {
                action: 'restorerevision',
                'mfn-builder-nonce': wpnonce,
                time: time,
                type: type,
                pageid: pageid
            },
            type: 'POST',
            success: function(response){
                $content.find('.mfn-builder-content').empty();

                mfnvbvars.pagedata = [];
                $.each(response.form, function(i, el) {
                    mfnvbvars.pagedata.push(el);
                });

                $content.find('.mfn-builder-content').append(response.html);
                displayRevisions(response.revisions, $list);

                $navigator.find('.navigator-tree').html(response.navigator);

                // render local styles
                loopAllStyleFields();

                $btn.removeClass('loading disabled');

                inlineEditor();
                addHistory();
                blink();
            }
        });

    }
}

function displayRevisions(rev, $list) {
    $list.empty();
    $.each(JSON.parse(rev), function(i, item) {
        $list.append('<li data-time="'+ i +'"><span class="revision-icon mfn-icon-clock"></span><div class="revision"><h6>'+ item +'</h6><a class="mfn-option-btn mfn-option-text mfn-option-blue mfn-btn-restore revision-restore" href="#"><span class="text">Restore</span></a></div></li>');
    });

    $('.revision-restore').on('click', function(e) {
        e.preventDefault();
        restoreRev($(this));
    });
}


// copy / paste element

var copypaste = {
    copy: function(el, action = false) {
        // localStorage.setItem('mfnvbcopy', el);
        mfncopy = el;

        if(action && action == 'clone'){
            let $clipboard_copy = $content.find('.vb-item[data-uid="'+el+'"]');
            copypaste.paste($clipboard_copy);
            stickyWrap.init();
        }
    },
    paste: function($p) {

        if( !mfncopy ) return;

        var $el = $content.find('.vb-item[data-uid="'+mfncopy+'"]');
        var mfncopy_type = 'column';
        if( $el.hasClass('mcb-section') ){ mfncopy_type = 'section'; }else if( $el.hasClass('mcb-wrap') ){ mfncopy_type = 'wrap'; }

        if( $el.find('.mfn-initialized').length ){
            if( inlineEditors[$el.find('.mfn-initialized').attr('data-mfnindex')] ) inlineEditors[$el.find('.mfn-initialized').attr('data-mfnindex')].destroy();
            $el.find('.mfn-initialized').removeClass('mfn-initialized mfn-watchChanges mfn-blur-action mfn-focused').removeAttr('data-mfnindex');
        }

        $content.find('.vb-item[data-uid="'+mfncopy+'"]').removeClass('mfn-current-editing');

        $copy_el = $el.clone();

        if( $copy_el.hasClass('mcb-column') ){
            // column
            var newuid = copypaste.updateItem($copy_el);
        }else if( $copy_el.hasClass('mcb-wrap') ){
            // wrap
            var newuid = copypaste.updateWrap($copy_el);
        }else if( $copy_el.hasClass('mcb-section') ){
            // wrap
            var newuid = copypaste.updateSection($copy_el);
        }

        edited_item = mfnvbvars.pagedata.filter( (item) => item.uid == newuid )[0];

        $copy_nav = $navigator.find('.nav-'+newuid).clone();
        $navigator.find('.nav-'+newuid).remove();

        if($p.hasClass('mcb-section') && mfncopy_type == 'wrap'){
            // wrap to section
            $p.find('.section_wrapper').append($copy_el);
            $navigator.find('.nav-'+$p.attr('data-uid')+' ul').append($copy_nav);
        }else if($p.hasClass('mcb-section') && mfncopy_type == 'column'){
            // column to section
            if($p.find('.mcb-wrap-inner').length){
                $p.find('.mcb-wrap-inner').last().append($copy_el);
                $navigator.find('.nav-'+$p.attr('data-uid')+' > ul > li:last-child ul').append($copy_nav);
            }else{
                alert('Append wrap first.');
            }
        }else if($p.hasClass('mcb-wrap') && mfncopy_type == 'column'){
            // column to wrap
            $p.find('.mcb-wrap-inner').append($copy_el);
            $navigator.find('.nav-'+$p.attr('data-uid')+' ul').append($copy_nav);
        }else if( ( $p.hasClass('mcb-column') || $p.hasClass('mcb-wrap') ) && mfncopy_type == 'section'){
            // section to wrap or column
            $p.closest('.mcb-section').after($copy_el);
            $navigator.find('.nav-'+$p.closest('.mcb-section').attr('data-uid')).after($copy_nav);
        }else if( $p.hasClass('mcb-column') && mfncopy_type == 'wrap'){
            // wrap to column
            $p.closest('.mcb-wrap').after($copy_el);
            $navigator.find('.nav-'+$p.closest('.mcb-wrap').attr('data-uid')).after($copy_nav);
        }else{
            $p.after($copy_el);
            $navigator.find('.nav-'+$p.attr('data-uid')).after($copy_nav);
        }

        mfnChart();
        inlineEditor();
        checkEmptySections();
        checkEmptyWraps();
        addHistory();

        setTimeout(function() {
            $content.find('.vb-item[data-uid="'+newuid+'"]').find('.mfn-header').first().find('.mfn-element-edit').trigger('click');
        }, 10);

    },
    updateItem: function($copy_el) {
        var old_uid = $copy_el.attr('data-uid');
        var new_uid = getUid();

        $copy_el.removeClass('mcb-item-'+old_uid).addClass('mcb-item-'+new_uid).attr('data-uid', new_uid);
        $copy_el.find('.mcb-column-inner').removeClass('mcb-column-inner-'+old_uid).addClass('mcb-column-inner-'+new_uid);

        if( $copy_el.find('.chart_box.mfn-initialized').length ){
            $copy_el.find('.chart_box.mfn-initialized').removeClass('mfn-initialized');
        }

        var get_copy = mfnvbvars.pagedata.filter( (item) => item.uid == old_uid )[0];
        var copy_obj = {};

        copy_obj = JSON.parse( JSON.stringify(get_copy) );

        copy_obj.uid = new_uid;
        mfnvbvars.pagedata.push(copy_obj);

        $copy_nav = $navigator.find('.navigator-tree li.nav-'+old_uid).clone();
        $copy_nav.removeClass('nav-'+old_uid).addClass('nav-'+new_uid);
        $copy_nav.children('a').attr('data-uid', new_uid);
        $navigator.find('.navigator-tree li.nav-'+old_uid).after($copy_nav);

        loopAllStyleFields(new_uid);

        return new_uid;
    },
    updateWrap: function($copy_el) {
        var old_uid = $copy_el.attr('data-uid');
        var new_uid = getUid();

        // wrap
        $copy_el.removeClass('mcb-wrap-'+old_uid).addClass('mcb-wrap-'+new_uid).attr('data-uid', new_uid);
        $copy_el.find('.mcb-wrap-inner').removeClass('mcb-wrap-inner-'+old_uid).addClass('mcb-wrap-inner-'+new_uid);

        var get_copy = mfnvbvars.pagedata.filter( (item) => item.uid == old_uid )[0];
        var copy_obj = {};

        copy_obj = JSON.parse( JSON.stringify(get_copy) );

        copy_obj.uid = new_uid;
        mfnvbvars.pagedata.push(copy_obj);

        $copy_nav = $navigator.find('.navigator-tree li.nav-'+old_uid).clone();
        $copy_nav.removeClass('nav-'+old_uid).addClass('nav-'+new_uid);
        $copy_nav.children('a').attr('data-uid', new_uid);
        $navigator.find('.navigator-tree li.nav-'+old_uid).after($copy_nav);

        // wraps childrens

        if( $copy_el.find('.mcb-column').length ){
            $copy_el.find('.mcb-column').each(function() {
                //copypaste.updateItem( $(this) );
                var $copy_el = $(this);
                var old_col_uid = $copy_el.attr('data-uid');
                var new_col_uid = getUid();

                $copy_el.removeClass('mcb-item-'+old_col_uid).addClass('mcb-item-'+new_col_uid).attr('data-uid', new_col_uid);
                $copy_el.find('.mcb-column-inner').removeClass('mcb-column-inner-'+old_col_uid).addClass('mcb-column-inner-'+new_col_uid);

                var get_copy = mfnvbvars.pagedata.filter( (item) => item.uid == old_col_uid )[0];
                var copy_obj = {};

                copy_obj = JSON.parse( JSON.stringify(get_copy) );
                copy_obj.uid = new_col_uid;
                mfnvbvars.pagedata.push(copy_obj);

                $navigator.find('.navigator-tree li.nav-'+new_uid+' li.nav-'+old_col_uid+' > a').attr('data-uid', new_col_uid);
                $navigator.find('.navigator-tree li.nav-'+new_uid+' li.nav-'+old_col_uid).removeClass('nav-'+old_col_uid).addClass('nav-'+new_col_uid);

                loopAllStyleFields(new_col_uid);
            });
        }
        loopAllStyleFields(new_uid);
        return new_uid;
    },
    updateSection: function($copy_el) {
        var old_uid = $copy_el.attr('data-uid');
        var new_uid = getUid();

        // section
        $copy_el.removeClass('mcb-section-'+old_uid).addClass('mcb-section-'+new_uid).attr('data-uid', new_uid);
        $copy_el.find('.mcb-section-inner').removeClass('mcb-section-inner-'+old_uid).addClass('mcb-section-inner-'+new_uid);

        var get_copy = mfnvbvars.pagedata.filter( (item) => item.uid == old_uid )[0];
        var copy_obj = {};

        copy_obj = JSON.parse( JSON.stringify(get_copy) );

        copy_obj.uid = new_uid;
        mfnvbvars.pagedata.push(copy_obj);

        $copy_nav = $navigator.find('.navigator-tree li.nav-'+old_uid).clone();
        $copy_nav.removeClass('nav-'+old_uid).addClass('nav-'+new_uid);
        $copy_nav.children('a').attr('data-uid', new_uid);
        $navigator.find('.navigator-tree li.nav-'+old_uid).after($copy_nav);

        // wraps childrens

        if( $copy_el.find('.mcb-wrap').length ){
            $copy_el.find('.mcb-wrap').each(function() {
                //copypaste.updateWrap( $(this) ); // because of nav tmp
                var $copy_el = $(this);
                var old_wrap_uid = $copy_el.attr('data-uid');
                var new_wrap_uid = getUid();

                // wrap
                $copy_el.removeClass('mcb-wrap-'+old_wrap_uid).addClass('mcb-wrap-'+new_wrap_uid).attr('data-uid', new_wrap_uid);
                $copy_el.find('.mcb-wrap-inner').removeClass('mcb-wrap-inner-'+old_wrap_uid).addClass('mcb-wrap-inner-'+new_wrap_uid);

                var get_copy = mfnvbvars.pagedata.filter( (item) => item.uid == old_wrap_uid )[0];
                var copy_obj = {};

                copy_obj = JSON.parse( JSON.stringify(get_copy) );

                copy_obj.uid = new_wrap_uid;
                mfnvbvars.pagedata.push(copy_obj);

                $navigator.find('.navigator-tree li.nav-'+new_uid+' li.nav-'+old_wrap_uid+' > a').attr('data-uid', new_wrap_uid);
                $navigator.find('.navigator-tree li.nav-'+new_uid+' li.nav-'+old_wrap_uid).removeClass('nav-'+old_wrap_uid).addClass('nav-'+new_wrap_uid);
                loopAllStyleFields(new_wrap_uid);

                // wraps childrens

                if( $copy_el.find('.mcb-column').length ){
                    $copy_el.find('.mcb-column').each(function() {
                        //copypaste.updateItem( $(this) ); // because of nav tmp
                        var $copy_el = $(this);
                        var old_col_uid = $copy_el.attr('data-uid');
                        var new_col_uid = getUid();

                        $copy_el.removeClass('mcb-item-'+old_col_uid).addClass('mcb-item-'+new_col_uid).attr('data-uid', new_col_uid);
                        $copy_el.find('.mcb-column-inner').removeClass('mcb-column-inner-'+old_col_uid).addClass('mcb-column-inner-'+new_col_uid);

                        var get_copy = mfnvbvars.pagedata.filter( (item) => item.uid == old_col_uid )[0];
                        var copy_obj = {};

                        copy_obj = JSON.parse( JSON.stringify(get_copy) );

                        copy_obj.uid = new_col_uid;
                        mfnvbvars.pagedata.push(copy_obj);

                        $navigator.find('.navigator-tree li.nav-'+new_uid+' li.nav-'+new_wrap_uid+' li.nav-'+old_col_uid+' > a').attr('data-uid', new_col_uid);
                        $navigator.find('.navigator-tree li.nav-'+new_uid+' li.nav-'+new_wrap_uid+' li.nav-'+old_col_uid).removeClass('nav-'+old_col_uid).addClass('nav-'+new_col_uid);
                        loopAllStyleFields(new_col_uid);
                    });
                }

            });
        }

        loopAllStyleFields(new_uid);
        return new_uid;
    }
}

function prepareStyleId(el){

    el = el.replaceAll('.', '');
    el = el.replaceAll('tablet', '');
    el = el.replaceAll('mobile', '');
    el = el.replaceAll('desktop', '');
    el = el.replaceAll(',', '');
    el = el.replaceAll('#', '');
    el = el.replaceAll('|', '');
    el = el.replaceAll(' ', '');
    el = el.replaceAll('(', '');
    el = el.replaceAll(')', '');
    el = el.replaceAll('[', '');
    el = el.replaceAll(']', '');
    el = el.replaceAll('>', '');
    el = el.replaceAll('_', '');
    el = el.replaceAll('-', '');
    return el;
}

// add local style

function addLocalStyle(u, v, s, r, uid){
    var el = u+s;

    if(typeof u === "undefined" || typeof s === "undefined") return;

    el = prepareStyleId(el);

    if( $content.find('style.'+el+r).length ){
        $content.find('style.'+el+r).remove();
    }

    var selector_arr = u.split(",");
    var selector_string = '';

    $.each( selector_arr, function( i, value ) {
        if( i > 0 ){ selector_string += ', '; }
        selector_string += value.replaceAll('|', ':');
    });

    if( v == '' ) {
        if( (s.includes('padding') || s.includes('margin') || s.includes('flex')) && $content.find(selector_string+' .slick-slider.slick-initialized').length ){
            //$content.find(selector_string+' .slick-slider.slick-initialized').slick('setPosition');
        }
        return;
    }

    selector_string = selector_string.replace('mcb-column-inner', 'mcb-column-inner-'+uid);
    selector_string = selector_string.replace('mcb-wrap-inner', 'mcb-wrap-inner-'+uid);
    selector_string = selector_string.replace('mcb-section-inner', 'mcb-section-inner-'+uid);
    selector_string = selector_string.replace('section_wrapper', 'mcb-section-inner-'+uid);

    if( r == 'tablet' ){
        $content.find('body').prepend('<style class="mfn-local-style '+el+r+'">@media(max-width: 969px){html '+selector_string.replace('.mfn-header-tmpl', '.mfn-ui.mfn-header-tmpl')+' { '+(s.replace('_tablet', ''))+': '+v+' }}</style>');
    }else if( r == 'mobile' ){
        $content.find('body').append('<style class="mfn-local-style '+el+r+'">@media(max-width: 767px){html '+selector_string.replace('.mfn-header-tmpl', '.mfn-ui.mfn-header-tmpl')+' { '+(s.replace('_mobile', ''))+': '+v+' }}</style>');
    }else{
        $content.find('head').append('<style class="mfn-local-style '+el+r+'">html '+selector_string.replace('.mfn-header-tmpl', '.mfn-ui.mfn-header-tmpl')+' { '+s+': '+v+' }</style>');
    }

    if( (s.includes('padding') || s.includes('margin') || s.includes('flex')) && $content.find(selector_string+' .slick-slider.slick-initialized').length ){
        //$content.find(selector_string+' .slick-slider.slick-initialized').slick('setPosition');
    }
}

// change styles function

function changeInlineStyles(u, s, v){

    let styles = [];
    if($content.find(u).length){

        $content.find(u).each(function() {

            if(v == 'remove_style'){
                $(this).removeAttr('style');
            }else{
                let attrstyle = $(this).attr('style');

                if(typeof attrstyle !== typeof undefined && attrstyle !== false){
                    styles = attrstyle.split(';');
                }

                let sid = styles.findIndex( st => st.includes(s));

                if(styles[sid]){
                    if( v == 'remove' || !v.length ){
                        styles.splice(sid,1);
                    }else{
                        styles[sid] = s+': '+v;
                    }

                }else{
                    styles.push(s+': '+v);
                }
                //styles[sid] ? styles[sid] = s+': '+v : styles.push(s+': '+v);

                let newstyles = styles.join(';');
                $(this).attr('style', newstyles);
            }

        });
    }
}

// change fancy divider color

function changeFancyDividerColorTop(u, g, v){

    let style = $('.mfn-element-fields-wrapper .style .preview-styleinput').val();

    if(style == 'circle up' || style == 'curve up' || style == 'triangle up'){
        changeInlineStyles('.'+u+' svg', 'background', v);
    }else{
        changeInlineStyles('.'+u+' svg path', 'fill', v);
        changeInlineStyles('.'+u+' svg path', 'stroke', v);
    }
}
function changeFancyDividerColorBottom(u, g, v){
    let style = $('.mfn-element-fields-wrapper .style .preview-styleinput').val();

    if(style == 'circle down' || style == 'curve down' || style == 'triangle down'){
        changeInlineStyles('.'+u+' svg', 'background', v);
    }else{
        changeInlineStyles('.'+u+' svg path', 'fill', v);
        changeInlineStyles('.'+u+' svg path', 'stroke', v);
    }
}

// video bg

function setVideoBg(u, t, v){
    if(v != ''){
        if($content.find('.'+u+' .section_video video').length){
            if($content.find('.'+u+' .section_video video source[type="video/'+t+'"]').length){
                $content.find('.'+u+' .section_video video source[type="video/'+t+'"]').attr('src', v);
            }else{
                $content.find('.'+u+' .section_video video').append('<source type="video/'+t+'" src="'+v+'">');
            }
        }else{
            $content.find('.'+u).append('<div class="section_video"><div class="mask"></div><video poster autoplay="true" loop="true" muted="muted"><source type="video/'+t+'" src="'+v+'"></video></div>').addClass('has-video');
        }
    }else{
        if($content.find('.'+u+' .section_video video source[type="video/'+t+'"]').length){
            $content.find('.'+u+' .section_video video source[type="video/'+t+'"]').remove();
        }
        if(!$content.find('.'+u+' .section_video video source').length){
            $content.find('.'+u+' .section_video').remove();
            $content.find('.'+u).removeClass('has-video');
        }
    }
}

// chart color

function changeColorChart(u, v){
    if(v != 'transparent'){
        $content.find('.'+u+' .chart').attr('data-bar-color', v);
    }else{
        $content.find('.'+u+' .chart').attr('data-bar-color', '#000');
    }
}

// image for widget

function imageForWidget(u, v, p){

    p ? p = p : '';

    if($content.find('.'+u).hasClass('column_article_box')){
        // article box
        $content.find('.'+u+' .article_box .photo_wrapper').html('<img class="scale-with-grid" src="'+v+'" alt="">');
    }else if($content.find('.'+u).hasClass('column_before_after')){
        // before after
        if(p == 'before'){
            $content.find('.'+u+' .twentytwenty-before').attr('src', v);
        }else if(p == 'after'){
            $content.find('.'+u+' .twentytwenty-after').attr('src', v);
        }
        $content.find('.before_after.twentytwenty-container').twentytwenty();
        resetBeforeAfter(u);
    }else if($content.find('.'+u).hasClass('column_counter')){
        // counter
        if( v != '' ){
            $content.find('.'+u+' .icon_wrapper').html('<img class="scale-with-grid" src="'+v+'" alt="">');
        }else if( $('.panel-edit-item .mfn-form-row .preview-iconinput').val() ){
            $content.find('.'+u+' .icon_wrapper').html('<i class="' +$('.panel-edit-item .mfn-form-row .preview-iconinput').val()+ '"></i>');
        }
    }else if($content.find('.'+u).hasClass('column_feature_box')){
        // feature box
        $content.find('.'+u+' .photo_wrapper').html('<img class="scale-with-grid" src="'+v+'" alt="">');
    }else if($content.find('.'+u).hasClass('column_flat_box') && p == 'boximg'){
        // flat box
        $content.find('.'+u+' .photo_wrapper img').attr('src', v);
    }else if($content.find('.'+u).hasClass('column_flat_box') && p == 'iconimg'){
        // flat box icon
        if(v != ''){
            $content.find('.'+u+' .icon').html('<img class="scale-with-grid" src="'+v+'"  alt="">');
        }else{
            $content.find('.'+u+' .icon').html('');
        }
    }else if($content.find('.'+u).hasClass('column_hover_box') && p == 'mainimg'){
        // hover box
        $content.find('.'+u+' img.visible_photo').attr('src', v);
    }else if($content.find('.'+u).hasClass('column_hover_box') && p == 'hoverimg'){
        // hover box
        $content.find('.'+u+' img.hidden_photo').attr('src', v);
    }else if($content.find('.'+u).hasClass('column_how_it_works')){
        // how it works
        if(v){
            $content.find('.'+u+' .how_it_works').removeClass('no-img');
            if($content.find('.'+u+' .how_it_works .image img').length){
                $content.find('.'+u+' .how_it_works .image img').attr('src', v).removeAttr('width').removeAttr('height');;
            }else{
                $content.find('.'+u+' .how_it_works .image').append('<img src="'+v+'" class="scale-with-grid" alt="">');
            }
        }else{
            $content.find('.'+u+' .how_it_works').addClass('no-img');
            $content.find('.'+u+' .how_it_works .image img').remove();
        }
    }else if($content.find('.'+u).hasClass('column_icon_box')){
        // icon box
        if(v != ''){
            if($content.find('.'+u+' .icon_box .image_wrapper img').length){
                $content.find('.'+u+' .icon_box .image_wrapper img').attr('src', v);
            }else{
                if($content.find('.'+u+' .icon_box .icon_wrapper').length) { $content.find('.'+u+' .icon_box .icon_wrapper').remove(); }
                $content.find('.'+u+' .icon_box').prepend('<div class="image_wrapper"><img src="'+v+'" class="scale-with-grid" alt=""></div>');
            }
        }else if( $('.mfn-ui .panel-edit-item .mfn-form .mfn-form-control.preview-iconinput').val().length ){
            $content.find('.'+u+' .icon_box .image_wrapper').remove();
            $content.find('.'+u+' .icon_box').prepend('<div class="icon_wrapper"><div class="icon"><i class="'+$('.mfn-ui .panel-edit-item .mfn-form .mfn-form-control.preview-iconinput').val()+'"></i></div></div>');
        }else{
            if($content.find('.'+u+' .icon_box .icon_wrapper').length) { $content.find('.'+u+' .icon_box .icon_wrapper').remove(); }
            if($content.find('.'+u+' .icon_box .image_wrapper').length) { $content.find('.'+u+' .icon_box .image_wrapper').remove(); }
        }
    }else if($content.find('.'+u).hasClass('column_image')){
        // image
        $content.find('.'+u+' .image_wrapper img').attr('src', v).removeAttr('width').removeAttr('height');
    }else if($content.find('.'+u).hasClass('column_list')){
        // list
        $content.find('.'+u+' .list_left').removeClass('list_icon list_image').addClass('list_image').html('<img src="'+v+'" class="scale-with-grid" alt="">');
    }else if($content.find('.'+u).hasClass('column_photo_box')){
        // photo box
        $content.find('.'+u+' .image_wrapper img').attr('src', v).removeAttr('width').removeAttr('height');;
    }else if($content.find('.'+u).hasClass('column_promo_box')){
        // promo box
        $content.find('.'+u+' .photo_wrapper img').attr('src', v).removeAttr('width').removeAttr('height');;
    }else if($content.find('.'+u).hasClass('column_sliding_box')){
        // sliding box
        $content.find('.'+u+' .photo_wrapper img').attr('src', v).removeAttr('width').removeAttr('height');;
    }else if($content.find('.'+u).hasClass('column_story_box')){
        // sliding box
        $content.find('.'+u+' .photo_wrapper img').attr('src', v).removeAttr('width').removeAttr('height');;
    }else if($content.find('.'+u).hasClass('column_trailer_box')){
        // trailer box
        $content.find('.'+u+' .trailer_box img').attr('src', v).removeAttr('width').removeAttr('height');;
    }else if($content.find('.'+u).hasClass('column_zoom_box') && p == 'main'){
        // zoom box main
        $content.find('.'+u+' .photo img').attr('src', v).removeAttr('width').removeAttr('height');;
    }else if($content.find('.'+u).hasClass('column_zoom_box') && p == 'desc'){
        // zoom box desc
        if(v){
            if($content.find('.'+u+' .desc_wrap .desc_img img').length){
                $content.find('.'+u+' .desc_wrap .desc_img img').attr('src', v);
            }else{
                $content.find('.'+u+' .desc_wrap').prepend('<div class="desc_img"><img class="scale-with-grid" src="'+v+'" alt=""></div>');
            }
        }else{
            if($content.find('.'+u+' .desc_wrap .desc_img img').length){
                $content.find('.'+u+' .desc_wrap .desc_img').remove();
            }
        }
    }else if($content.find('.'+u).hasClass('mcb-section') && p == 'decortop'){
        // section decor top
        if(v != ''){
            if($content.find('.'+u+' .section-decoration.top').length){
                $content.find('.'+u+' .section-decoration.top').css({ 'background-image': v});
            }else{
                $content.find('.'+u).prepend('<div class="section-decoration top" style="background-image:url('+v+');"></div>');
            }
        }else{
            $content.find('.'+u+' .section-decoration.top').remove();
        }
    }else if($content.find('.'+u).hasClass('mcb-section') && p == 'decorbottom'){
        // section decor bottom
        if(v != ''){
            if($content.find('.'+u+' .section-decoration.bottom').length){
                $content.find('.'+u+' .section-decoration.bottom').css({ 'background-image': v});
            }else{
                $content.find('.'+u).append('<div class="section-decoration bottom" style="background-image:url('+v+');"></div>');
            }
        }else{
            $content.find('.'+u+' .section-decoration.bottom').remove();
        }
    }else if($content.find('.'+u).hasClass('column_our_team')){
        // our team
        $content.find('.'+u+' .image_wrapper img').attr('src', v);
    }else if($content.find('.'+u).hasClass('column_our_team_list')){
        // our team list
        $content.find('.'+u+' .image_wrapper img').attr('src', v);
    }else if($content.find('.'+u).hasClass('column_pricing_item')){
        // pricing item
        if( v ){
            if( $content.find('.'+u+' .image').length ){
                $content.find('.'+u+' .image img').attr('src', v);
            }else{
                $content.find('.'+u+' .plan-header').prepend('<div class="image"><img src="'+v+'" alt="" /></div>');
            }
        }else{
            $content.find('.'+u+' .image').remove();
        }

    }else if($content.find('.'+u).hasClass('column_header_icon')){
        // header icon
        $content.find('.'+u+' .header_column_wrapper .mfn-header-icon').html('<img width="20" src="'+v+'" alt="">');
    }else if($content.find('.'+u).hasClass('column_chart')){
        // chart
        if(v){
            if($content.find('.'+u+' .chart .image img').length){
                $content.find('.'+u+' .chart .image img').attr('src', v);
            }else{
                $content.find('.'+u+' .chart .num').remove();
                $content.find('.'+u+' .chart .icon').remove();
                $content.find('.'+u+' .chart').prepend('<div class="image"><img class="scale-with-grid" src="'+v+'" alt="" /></div>');
            }
        }else if($('.panel-edit-item .mfn-form-row .preview-iconinput').val().length){
            $content.find('.'+u+' .chart .image').remove();
            $content.find('.'+u+' .chart .label').remove();
            $content.find('.'+u+' .chart').prepend('<div class="icon"><i class="'+$('.panel-edit-item .mfn-form .preview-iconinput').val()+'"></i></div>');
        }else if($('.panel-edit-item .mfn-form-row .preview-labelinput').val().length){
            $content.find('.'+u+' .chart .image').remove();
            $content.find('.'+u+' .chart .icon').remove();
            $content.find('.'+u+' .chart').prepend('<div class="num">'+$('.panel-edit-item .mfn-form-row .preview-labelinput').val()+'</div>');
        }else{
            $content.find('.'+u+' .chart .image').remove();
            $content.find('.'+u+' .chart .icon').remove();
            $content.find('.'+u+' .chart .num').remove();
        }

    }else if($content.find('.'+u).hasClass('column_header_logo')){
        // logo
        $content.find('.'+u+' img').attr('src', v);
    }else if($content.find('.'+u).hasClass('column_icon_box_2')){
        if( v ){
            if( $content.find('.'+u+' .icon-wrapper').length ){
                $content.find('.'+u+' .icon-wrapper').html('<img class="scale-with-grid" src="'+v+'" alt="">');
            }else{
                $content.find('.'+u+' .desc_wrapper').before('<div class="icon-wrapper"><img class="scale-with-grid" src="'+v+'" alt=""></div>');
            }
        }else{
            if( $editpanel.find('.panel-edit-item .mfn-form .icon_box_2.icon .preview-iconinput').val().length ){
                if( $content.find('.'+u+' .icon-wrapper i').length ){
                    $content.find('.'+u+' .icon-wrapper i').attr('class', $editpanel.find('.panel-edit-item .mfn-form .icon_box_2.icon .preview-iconinput').val());
                }else{
                    $content.find('.'+u+' .icon-wrapper').html('<i class="'+$editpanel.find('.panel-edit-item .mfn-form .icon_box_2.icon .preview-iconinput').val()+'" aria-hidden="true"></i>');
                }
            }else{
                $content.find('.'+u+' .icon-wrapper').remove();
            }
        }
    }

    addHistory();
}

function resetBeforeAfter(u){
    if($content.find('.vb-item[data-uid='+u+'] .before_after.twentytwenty-container').length){

        $content.find('.vb-item[data-uid='+u+'] .before_after.twentytwenty-container .twentytwenty-overlay').remove();
        $content.find('.vb-item[data-uid='+u+'] .before_after.twentytwenty-container .twentytwenty-after-label').remove();
        $content.find('.vb-item[data-uid='+u+'] .before_after.twentytwenty-container .twentytwenty-handle').remove();
        $content.find('.vb-item[data-uid='+u+'] .before_after.twentytwenty-container').unwrap();

        $content.find('.vb-item[data-uid='+u+'] .before_after.twentytwenty-container').twentytwenty();

    }
}

// MEDIA

var uploader = {
    sortable: function(galleryContainer = false) {

        if( !galleryContainer ){
            galleryContainer = $('.gallery-container:not(.mfn-initialized)');
        }

        galleryContainer.each(function() {

            var $modulebox = $(this).closest('.mfn-form-row');
            var $input = $modulebox.find('.upload-input.mfn-field-value');
            var groupid = $(this).closest('.mfn-element-fields-wrapper').attr('data-group');

            var $sortablebox = $(this);

            $sortablebox.sortable({
                stop: function(event, elem) {
                    var imgarr = [];
                    $sortablebox.find('li img').each(function() {
                        imgarr.push( $(this).attr('data-pic-id') );
                    });

                    $input.val(imgarr.join(',')).trigger('change');

                    re_render();
                }
            });
            $(this).addClass('mfn-initialized');
        });
    },
    browse: function() {
        $editpanel.on('click', '.panel .mfn-form .mfn-vb-formrow .browse-image .mfn-button-upload', function(e) {
            e.preventDefault();
            var frame,
                addImgLink = $(this),
                metaBox = addImgLink.closest('.browse-image'),
                $modulebox = metaBox.closest('.mfn-form-row'),
                $moduleWrapper = metaBox.closest('.mfn-element-fields-wrapper'),
                eluid = $moduleWrapper.attr('data-element'),
                groupid = $moduleWrapper.attr('data-group'),
                delImgAll = metaBox.find( '.mfn-button-delete-all'),
                imgContainer = metaBox.find( '.selected-image'),
                multipleImgs = false,
                multipleImgsInput = metaBox.find( '.upload-input' ),
                galleryContainer = metaBox.find( '.gallery-container' ),
                imgIdInput = metaBox.find( '.mfn-field-value' );

            if(metaBox.hasClass('multi')){
                multipleImgs = 'add';
            }

            if ( frame ) { frame.open(); return; }

            frame = wp.media({
                multiple: multipleImgs,
            });


            if(multipleImgs && multipleImgs == 'add' && metaBox.find( '.upload-input' ).length){

                frame.on('open', function() {

                    var library = frame.state().get('selection'),
                    images = metaBox.find( '.upload-input' ).val();

                    if (!images) {
                        return true;
                    }

                    imageIDs = images.split(',');

                    imageIDs.forEach(function(id) {
                        var attachment = wp.media.attachment(id);
                        attachment.fetch();
                        library.add(attachment ? [attachment] : []);
                    });

                });

                frame.on( 'select', function() {

                    galleryContainer.html('');

                    var library = frame.state().get('selection'),
                    imageURLs = [],
                    imageIDs = [],
                    imageURL, outputHTML, joinedIDs;

                    library.map(function(image) {

                        image = image.toJSON();
                        imageURLs.push(image.url);
                        imageIDs.push(image.id);

                        if (image.sizes.medium) {
                        imageURL = image.sizes.medium.url;
                        } else {
                        imageURL = image.url;
                        }

                        outputHTML = '<li class="selected-image">' +
                        '<img data-pic-id="' + image.id + '" src="' + imageURL + '" />' +
                        '<a class="mfn-option-btn mfn-button-delete" data-tooltip="Delete" href="#"><span class="mfn-icon mfn-icon-delete"></span></a>' +
                        '</li>';

                        galleryContainer.append(outputHTML);

                        uploader.sortable(galleryContainer);


                    });

                    joinedIDs = imageIDs.join(',').replace(/^,*/, '');
                    if (joinedIDs.length !== 0) {
                        metaBox.removeClass('empty');
                    }
                    multipleImgsInput.val(joinedIDs).trigger('change');
                    re_render();

                });
                frame.open();
            }else{

                frame.on( 'select', function() {

                    metaBox.removeClass('empty');
                    var attachment = frame.state().get('selection').first().toJSON();
                    imgIdInput.val( attachment.url ).trigger('change');
                });

                frame.open();
            }
        });
    },

    itemsUpdate: function(attachment, imgIdInput) {

        var $modulebox = imgIdInput.closest('.mfn-form-row');
        var metaBox = $modulebox.find('.browse-image');
        var $moduleWrapper = imgIdInput.closest('.mfn-element-fields-wrapper');
        var imgContainer = metaBox.find( '.selected-image');
        var eluid = $moduleWrapper.attr('data-element');
        var uid = $content.find('.'+eluid).attr('data-uid');
        var rwd = 'desktop';

        if(imgContainer) { imgContainer.html( '<img src="'+attachment+'" alt="">' ); metaBox.removeClass('empty'); }

        if($modulebox.hasClass('mfn_field_tablet')){
            rwd = 'tablet';
        }else if($modulebox.hasClass('mfn_field_mobile')){
            rwd = 'mobile';
        }

        if(imgIdInput.hasClass('preview-bg_imageinput')){
            changeInlineStyles(eluid, 'background-image', 'url('+attachment+')');
        }else if(imgIdInput.hasClass('preview-bg_video_mp4input')){
            setVideoBg(eluid, 'mp4', attachment);
        }else if(imgIdInput.hasClass('preview-bg_video_ogvinput')){
            setVideoBg(eluid, 'ogg', attachment);
        }else if($modulebox.hasClass('article_box') && imgIdInput.hasClass('preview-imageinput')){
            imageForWidget(eluid, attachment);
        }else if(imgIdInput.hasClass('preview-image_beforeinput')){
            imageForWidget(eluid, attachment, 'before');
        }else if(imgIdInput.hasClass('preview-image_afterinput')){
            imageForWidget(eluid, attachment, 'after');
        }else if($modulebox.hasClass('counter image') && imgIdInput.hasClass('preview-imageinput')){
            imageForWidget(eluid, attachment);
        }else if($modulebox.hasClass('feature_box') && imgIdInput.hasClass('preview-imageinput')){
            imageForWidget(eluid, attachment);
        }else if($modulebox.hasClass('flat_box image') && imgIdInput.hasClass('preview-imageinput')){
            imageForWidget(eluid, attachment, 'boximg');
        }else if($modulebox.hasClass('flat_box icon_image') && imgIdInput.hasClass('preview-icon_imageinput')){
            imageForWidget(eluid, attachment, 'iconimg');
        }else if($modulebox.hasClass('hover_box') && imgIdInput.hasClass('preview-imageinput')){
            imageForWidget(eluid, attachment, 'mainimg');
        }else if($modulebox.hasClass('hover_box') && imgIdInput.hasClass('preview-image_hoverinput')){
            imageForWidget(eluid, attachment, 'hoverimg');
        }else if($modulebox.hasClass('how_it_works image') && imgIdInput.hasClass('preview-imageinput')){
            imageForWidget(eluid, attachment);
        }else if($modulebox.hasClass('icon_box') && imgIdInput.hasClass('preview-imageinput')){
            imageForWidget(eluid, attachment);
        }else if($modulebox.hasClass('image') && imgIdInput.hasClass('preview-srcinput')){
            imageForWidget(eluid, attachment);
        }else if($modulebox.hasClass('list image') && imgIdInput.hasClass('preview-imageinput')){
            imageForWidget(eluid, attachment);
        }else if($modulebox.hasClass('photo_box image') && imgIdInput.hasClass('preview-imageinput')){
            imageForWidget(eluid, attachment);
        }else if($modulebox.hasClass('promo_box image') && imgIdInput.hasClass('preview-imageinput')){
            imageForWidget(eluid, attachment);
        }else if($modulebox.hasClass('sliding_box image') && imgIdInput.hasClass('preview-imageinput')){
            imageForWidget(eluid, attachment);
        }else if($modulebox.hasClass('story_box image') && imgIdInput.hasClass('preview-imageinput')){
            imageForWidget(eluid, attachment);
        }else if($modulebox.hasClass('trailer_box image') && imgIdInput.hasClass('preview-imageinput')){
            imageForWidget(eluid, attachment);
        }else if($modulebox.hasClass('zoom_box image') && imgIdInput.hasClass('preview-imageinput')){
            imageForWidget(eluid, attachment, 'main');
        }else if($moduleWrapper.attr('data-item') == 'zoom_box content_image' && imgIdInput.hasClass('preview-content_imageinput')){
            imageForWidget(eluid, attachment, 'desc');
        }else if($modulebox.hasClass('section') && imgIdInput.hasClass('preview-decor_topinput')){
            imageForWidget(eluid, attachment, 'decortop');
        }else if($modulebox.hasClass('section') && imgIdInput.hasClass('preview-decor_bottominput')){
            imageForWidget(eluid, attachment, 'decorbottom');
        }else if($moduleWrapper.attr('data-item') == 'video placeholder' && imgIdInput.hasClass('preview-placeholderinput')){
            re_render();
        }else if($moduleWrapper.attr('data-item') == 'video mp4' && imgIdInput.hasClass('preview-mp4input')){
            re_render();
        }else if($moduleWrapper.attr('data-item') == 'video ogv' && imgIdInput.hasClass('preview-ogvinput')){
            re_render();
        }else if($modulebox.hasClass('our_team image') && imgIdInput.hasClass('preview-imageinput')){
            imageForWidget(eluid, attachment);
        }else if($modulebox.hasClass('our_team_list image') && imgIdInput.hasClass('preview-imageinput')){
            imageForWidget(eluid, attachment);
        }else if($modulebox.hasClass('pricing_item image') && imgIdInput.hasClass('preview-imageinput')){
            imageForWidget(eluid, attachment);
        }else if($modulebox.hasClass('widget-chart image') && imgIdInput.hasClass('preview-imageinput')){
            imageForWidget(eluid, attachment);
        }else if($moduleWrapper.attr('data-item') == 'header_logo image' && imgIdInput.hasClass('preview-imageinput')){
            imageForWidget(eluid, attachment);
        }else if($modulebox.hasClass('inline-style-input')){
            addLocalStyle($modulebox.attr('data-csspath'), 'url('+attachment+')', $modulebox.attr('data-name'), rwd, uid);
        }else if($moduleWrapper.attr('data-item') == 'header_icon image'){
            imageForWidget(eluid, attachment);
        }else{
            imageForWidget(eluid, attachment);
        }

    },

    delete: function() {
        $editpanel.on('click', '.mfn-form .mfn-vb-formrow .browse-image .mfn-button-delete', function(e) {
            e.preventDefault();

            var metaBox = $(this).closest('.browse-image'),
                $modulebox = metaBox.closest('.mfn-form-row'),
                $moduleWrapper = metaBox.closest('.mfn-element-fields-wrapper'),
                eluid = $moduleWrapper.attr('data-element'),
                uid = $content.find('.'+eluid).attr('data-uid'),
                groupid = $moduleWrapper.attr('data-group'),
                delImgAll = metaBox.find( '.mfn-button-delete-all'),
                imgContainer = metaBox.find( '.selected-image'),
                multipleImgs = false,
                multipleImgsInput = metaBox.find( '.upload-input' ),
                galleryContainer = metaBox.find( '.gallery-container' ),
                rwd = 'desktop',
                imgIdInput = metaBox.find( '.mfn-form-input' );

            if($modulebox.hasClass('mfn_field_tablet')){
                rwd = 'tablet';
            }else if($modulebox.hasClass('mfn_field_mobile')){
                rwd = 'mobile';
            }

            if(metaBox.hasClass('multi')){
                multipleImgs = 'add';
            }

            if(multipleImgs == 'add'){
                $(this).closest('.selected-image').remove();

                var imageIDs = [], id;

                metaBox.find('.gallery-container img').each(function() {
                    id = $(this).attr('data-pic-id');
                    imageIDs.push(id);
                });

                var joinedIDs = imageIDs.join( ',' );

                if (joinedIDs === '') {
                    metaBox.addClass('empty');
                }

                multipleImgsInput.val(joinedIDs).trigger('change');
                re_render();
            }else{

                imgContainer.html( '' );
                metaBox.addClass('empty');
                imgIdInput.val( '' ).trigger('change');
                if(imgIdInput.hasClass('preview-bg_imageinput')){
                    changeInlineStyles(eluid, 'background-image', '');
                }else if(imgIdInput.hasClass('preview-bg_video_mp4input')){
                    setVideoBg(eluid, 'mp4', '');
                }else if(imgIdInput.hasClass('preview-bg_video_ogvinput')){
                    setVideoBg(eluid, 'ogg', '');
                }else if($modulebox.hasClass('article_box') && $modulebox.attr('data-name') == 'image' && imgIdInput.hasClass('preview-imageinput')){
                    imageForWidget(eluid, sample_img);
                }else if(imgIdInput.hasClass('preview-image_beforeinput')){
                    imageForWidget(eluid, sample_img, 'before');
                }else if(imgIdInput.hasClass('preview-image_afterinput')){
                    imageForWidget(eluid, sample_img, 'after');
                }else if($modulebox.hasClass('counter image') && imgIdInput.hasClass('preview-imageinput')){
                    imageForWidget(eluid, '');
                }else if($modulebox.hasClass('feature_box') && imgIdInput.hasClass('preview-imageinput')){
                    imageForWidget(eluid, sample_img);
                }else if($modulebox.hasClass('flat_box image') && imgIdInput.hasClass('preview-imageinput')){
                    imageForWidget(eluid, sample_img, 'boximg');
                }else if($modulebox.hasClass('flat_box icon_image') && imgIdInput.hasClass('preview-icon_imageinput')){
                    imageForWidget(eluid, '', 'iconimg');
                }else if($modulebox.hasClass('hover_box') && imgIdInput.hasClass('preview-imageinput')){
                    imageForWidget(eluid, sample_img, 'mainimg');
                }else if($modulebox.hasClass('hover_box') && imgIdInput.hasClass('preview-image_hoverinput')){
                    imageForWidget(eluid, sample_img, 'hoverimg');
                }else if($modulebox.hasClass('how_it_works image') && imgIdInput.hasClass('preview-imageinput')){
                    imageForWidget(eluid, '');
                }else if($modulebox.hasClass('icon_box') && imgIdInput.hasClass('preview-imageinput')){
                    imageForWidget(eluid, '');
                }else if($modulebox.hasClass('image') && imgIdInput.hasClass('preview-srcinput')){
                    imageForWidget(eluid, sample_img);
                }else if($modulebox.hasClass('list image') && imgIdInput.hasClass('preview-imageinput')){
                    imageForWidget(eluid, '');
                }else if($modulebox.hasClass('photo_box image') && imgIdInput.hasClass('preview-imageinput')){
                    imageForWidget(eluid, sample_img);
                }else if($modulebox.hasClass('promo_box image') && imgIdInput.hasClass('preview-imageinput')){
                    imageForWidget(eluid, sample_img);
                }else if($modulebox.hasClass('sliding_box image') && imgIdInput.hasClass('preview-imageinput')){
                    imageForWidget(eluid, sample_img);
                }else if($modulebox.hasClass('story_box image') && imgIdInput.hasClass('preview-imageinput')){
                    imageForWidget(eluid, sample_img);
                }else if($modulebox.hasClass('trailer_box image') && imgIdInput.hasClass('preview-imageinput')){
                    imageForWidget(eluid, sample_img);
                }else if($modulebox.hasClass('zoom_box image') && imgIdInput.hasClass('preview-imageinput')){
                    imageForWidget(eluid, sample_img, 'main');
                }else if($moduleWrapper.attr('data-item') == 'zoom_box content_image' && imgIdInput.hasClass('preview-content_imageinput')){
                    imageForWidget(eluid, '', 'desc');
                }else if($modulebox.hasClass('section') && imgIdInput.hasClass('preview-decor_topinput')){
                    imageForWidget(eluid, '', 'decortop');
                }else if($modulebox.hasClass('section') && imgIdInput.hasClass('preview-decor_bottominput')){
                    imageForWidget(eluid, '', 'decorbottom');
                }else if($moduleWrapper.attr('data-item') == 'video placeholder' && imgIdInput.hasClass('preview-placeholderinput')){
                    re_render();
                }else if($moduleWrapper.attr('data-item') == 'video mp4' && imgIdInput.hasClass('preview-mp4input')){
                    re_render();
                }else if($moduleWrapper.attr('data-item') == 'video ogv' && imgIdInput.hasClass('preview-ogvinput')){
                    re_render();
                }else if($modulebox.hasClass('our_team image') && imgIdInput.hasClass('preview-imageinput')){
                    imageForWidget(eluid, sample_img);
                }else if($modulebox.hasClass('our_team_list image') && imgIdInput.hasClass('preview-imageinput')){
                    imageForWidget(eluid, sample_img);
                }else if($modulebox.hasClass('pricing_item image') && imgIdInput.hasClass('preview-imageinput')){
                    imageForWidget(eluid, '');
                }else if($modulebox.hasClass('widget-chart image') && imgIdInput.hasClass('preview-imageinput')){
                    imageForWidget(eluid, '');
                }else if($moduleWrapper.attr('data-item') == 'header_logo image' && imgIdInput.hasClass('preview-imageinput')){
                    imageForWidget(eluid, 'sample_img');
                }else if($modulebox.hasClass('inline-style-input')){
                    addLocalStyle($modulebox.attr('data-csspath'), 'none', $modulebox.attr('data-name'), rwd, uid);
                }else if($moduleWrapper.attr('data-item') == 'header_icon image'){
                    re_render();
                }else{
                    imageForWidget(eluid, '');
                }
            }
        });
    },

    deleteAllGallery: function() {
        $editpanel.on('click', '.mfn-form .mfn-vb-formrow .browse-image .mfn-button-delete-all', function(e) {
            e.preventDefault();

            var metaBox = $(this).closest('.browse-image'),
                $moduleWrapper = metaBox.closest('.mfn-element-fields-wrapper'),
                eluid = $moduleWrapper.attr('data-element'),
                groupid = $moduleWrapper.attr('data-group'),
                multipleImgsInput = metaBox.find( '.upload-input' ),
                galleryContainer = metaBox.find( '.gallery-container' ),
                imgIdInput = metaBox.find( '.mfn-form-input' );

            galleryContainer.html('');
            metaBox.find( '.upload-input' ).val('').trigger('change');
            metaBox.addClass('empty');
            $content.find('.'+eluid+' .gallery').remove();
            $content.find('.'+eluid+' style').remove();
            imgIdInput.val( '' );
            re_render();

        });
    }
}



function runSorting(){

// iframe drag positioning fix

var iframe_offset = 0;
if($('body').hasClass('mfn-preview-mode')){
    iframe_offset = 80;
}

$.ui.ddmanager.frameOffsets={},$.ui.ddmanager.prepareOffsets=function(e,t){var o,n,f,i,r=$.ui.ddmanager.droppables[e.options.scope]||[],s=t?t.type:null,a=(e.currentItem||e.element).find(":data(ui-droppable)").addBack();e:for(o=0;o<r.length;o++)if(!(r[o].options.disabled||e&&!r[o].accept.call(r[o].element[0],e.currentItem||e.element))){for(n=0;n<a.length;n++)if(a[n]===r[o].element[0]){r[o].proportions().height=0;continue e}r[o].visible="none"!==r[o].element.css("display"),r[o].visible&&("mousedown"===s&&r[o]._activate.call(r[o],t),r[o].offset=r[o].element.offset(),proportions={width:r[o].element[0].offsetWidth,height:r[o].element[0].offsetHeight},"function"==typeof r[o].proportions?r[o].proportions(proportions):r[o].proportions=proportions,(f=r[o].document[0])!==document&&((i=$.ui.ddmanager.frameOffsets[f])||(i=$.ui.ddmanager.frameOffsets[f]=$((f.defaultView||f.parentWindow).frameElement).offset()),r[o].offset.left+=i.left,r[o].offset.top-= ( i.top - scroll_top - iframe_offset ) )) } };


if($content){

$content.find('body').imagesLoaded(function() {

    // adding
    $('.mfn-visualbuilder .sidebar-panel-content ul.items-list li').draggable({
        helper: function(e) {
            return $('<div>').attr('data-type', $(e.target).closest('li').data('type')).addClass('mfn-vb-dragger mfn-vb-drag-item').text( $(e.target).closest('li').data('title') );
        },
        //helper: 'clone',
        cursorAt: {
            top: 20,
            left: 20
        },
        iframeFix: true,
        //revert: 'invalid',
        refreshPositions: false,
        cursor: 'move',
        start: function(event, elem) {
            dragging_new = 1;
            $content.find('.mfn-builder-content .mcb-column').addClass('ui-droppable-active-show');
        },
        stop: function(event, elem) {

            if(dragging_new == 1){

                if($content.find('.mfn-vb-drag-item').length){ $content.find('.mfn-vb-drag-item').remove(); }
                $content.find('.mfn-builder-content .mcb-column').removeClass('ui-droppable-active-show');

                if($content.find('.mfn-vb-sort-placeholder-widget').length) { $content.find('.mfn-vb-sort-placeholder-widget').remove(); }
                $content.find('body').removeClass('hover');

                setTimeout(resetIframeHeight, 100);
            }

            dragging_new = 0;
        },
        drag: function(event, elem){
            if(dragging_new == 1){
                elem.position.top -= $(window).scrollTop() - scroll_top;
            }
        }
    });


    $content.find('.mfn-builder-content .mfn-drag-helper').droppable({
        greedy: true,
        iframeFix: true,
        tolerance: 'touch',
        accept: "*",
        drop: function(event, ui) {
            if(dragging_new == 1){

                $content.find('.mfn-vb-dragover').removeClass('mfn-vb-dragover');

                $content.find('.mcb-column').removeClass('ui-droppable-active-show');

                if($(this).find('.mfn-vb-sort-placeholder-widget').length){ $(this).find('.mfn-vb-sort-placeholder-widget').remove(); }

                var dropped = ui.draggable;
                var dropped_item = dropped.attr('data-type');

                addNewWidget(dropped_item);

                if($content.find('.mfn-vb-drag-item').length){ $content.find('.mfn-vb-drag-item').remove(); }
                if($content.find('.mfn-vb-sort-placeholder-widget').length) { $content.find('.mfn-vb-sort-placeholder-widget').remove(); }

                dragging_new = 0;

                $content.find('body').removeClass('hover');

                setTimeout(resetIframeHeight, 100);

            }

        },
        over: function(event, elem) {
            if(dragging_new == 1){

                $content.find('.mfn-vb-dragover').removeClass('mfn-vb-dragover');
                $content.find('.mfn-vb-sort-placeholder-widget').remove();

                $(this).addClass("mfn-vb-dragover");

                new_widget_container = $(this).closest('.vb-item').attr('data-uid');

                if($(this).hasClass('mfn-dh-before')){
                    new_widget_position = 'before';
                    $(this).closest('.vb-item').before('<div class="mfn-vb-sort-placeholder-widget one column"></div>');
                }else{
                    new_widget_position = 'after';
                    if( $(this).parent().hasClass('mcb-column-inner') ){
                        $(this).closest('.vb-item').after('<div class="mfn-vb-sort-placeholder-widget one column"></div>');
                    }else if( $(this).parent().hasClass('empty') ){
                        $(this).parent().append('<div class="mfn-vb-sort-placeholder-widget one column"></div>');
                    }
                }

                new_widget_wrap = $(this).closest('.mcb-wrap').attr('data-order');
                new_widget_wrap_size = $(this).closest('.mcb-wrap').attr('data-desktop-size');
                new_widget_section = $(this).closest('.mcb-section').attr('data-order');
                new_widget_wcount = $(this).closest('.mcb-wrap').find('.mcb-column').length;

            }

        },
    });


    // widget
    $content.find('.mfn-builder-content .vb-item > .mcb-wrap-inner').sortable({
        connectWith: ".mcb-wrap-inner",
        placeholder: 'mfn-vb-sort-placeholder-widget',
        handle: ".mfn-column-drag",
        forcePlaceholderSize: false,
        iframeFix: true,
        iframeScroll: true,
        items: '.vb-item.mcb-column',
        appendTo: $content.find('body'),
        helper: function(e, ui) {
            return $('<div>').addClass('mfn-vb-dragger mfn-vb-drag-item').text( 'Item sort' );
        },
        cursorAt: {
            top: 20,
            left: 20
        },
        update: function(e, ui) {

            if( ui.item.closest('.mcb-wrap').find('.mcb-column').length ){
                ui.item.closest('.mcb-wrap').find('.mcb-column').each(function(i) {
                    $(this).attr('data-order', i);
                });
            }


            setTimeout(function() {

                var nav_parent = ui.item.closest('.mcb-wrap').attr('data-uid');
                var nav_item = ui.item.attr('data-uid');
                var nav_order = ui.item.attr('data-order');

                var $nav_clone = $navigator.find('.navigator-tree li.nav-'+nav_item);
                $navigator.find('.navigator-tree li.nav-'+nav_item).remove();

                if( $navigator.find('.navigator-tree li.nav-'+nav_parent+' ul').length ){
                    if( nav_order == 0 ){
                        $navigator.find('.navigator-tree li.nav-'+nav_parent+' ul').prepend( $nav_clone );
                    }else{
                        $navigator.find('.navigator-tree li.nav-'+nav_parent+' ul li:nth-child('+nav_order+')').after($nav_clone);
                    }
                }else{
                    $navigator.find('.navigator-tree li.nav-'+nav_parent).append( '<ul>'+$nav_clone+'</ul>' );
                }

                addHistory();
            },100);

            checkEmptyWraps();

        },
        over: function(e, ui) {
            if(dragging_new == 1){
                ui.placeholder.addClass( 'one column' );
            }else{
                let size = ui.item.attr('data-desktop-size');
                let sizeClass = sizes.filter(s => s.key === size)[0];

                if(sizeClass) { ui.placeholder.addClass( sizeClass.desktop+' column' ); }
            }
        },
        start: function(event, elem) {
            scroll_top = $content.find("html, body").scrollTop();
            $content.find('.mcb-column').addClass('ui-droppable-active-show')
        },
        stop: function(event, elem) {
            $content.find('.mcb-column').removeClass('ui-droppable-active-show')
        }
    });


    // wraps
    $content.find('.mfn-builder-content .vb-item > .section_wrapper').sortable({
        connectWith: ".section_wrapper",
        placeholder: 'mfn-vb-sort-placeholder-wrap',
        handle: ".mfn-wrap-drag",
        //revert: true,
        forcePlaceholderSize: true,
        items: '.mcb-wrap.vb-item',
        appendTo: $content.find('body'),
        helper: function(e, ui) {
            return $('<div>').addClass('mfn-vb-dragger mfn-vb-drag-wrap').text( 'Wrap sort' );
        },
        opacity: 0.9,
        cursorAt: {
            top: 20,
            left: 20
        },
        update: function(e, ui) {

            if( ui.item.closest('.mcb-section').find('.mcb-wrap').length ){
                ui.item.closest('.mcb-section').find('.mcb-wrap').each(function(i) {
                    $(this).attr('data-order', i);
                });
            }

            setTimeout(function() {

                var nav_parent = ui.item.closest('.mcb-section').attr('data-uid');
                var nav_item = ui.item.attr('data-uid');
                var nav_order = ui.item.attr('data-order');

                var $nav_clone = $navigator.find('.navigator-tree li.nav-'+nav_item);
                $navigator.find('.navigator-tree li.nav-'+nav_item).remove();

                if( $navigator.find('.navigator-tree li.nav-'+nav_parent+' > ul').length ){
                    if( nav_order == 0 ){
                        $navigator.find('.navigator-tree li.nav-'+nav_parent+' > ul').prepend( $nav_clone );
                    }else{
                        $navigator.find('.navigator-tree li.nav-'+nav_parent+' > ul > li:nth-child('+nav_order+')').after($nav_clone);
                    }
                }else{
                    $navigator.find('.navigator-tree li.nav-'+nav_parent).append( '<ul>'+$nav_clone+'</ul>' );
                }

                addHistory();

            },100);

            checkEmptySections();
        },
        start: function(event, elem) {
            stickyWrap.reset();
            scroll_top = $content.find("html, body").scrollTop();
            //$content.find('.mcb-wrap-inner').addClass('ui-droppable-active-show')
        },
        stop: function(event, elem) {
            stickyWrap.init();
            //$content.find('.mcb-wrap-inner').removeClass('ui-droppable-active-show')
        }
    });

    // sections
    $content.find('.entry-content .mfn-builder-content').sortable({
        connectWith: ".mfn-builder-content",
        placeholder: 'mfn-vb-sort-placeholder-section',
        handle: ".mfn-section-drag",
        forcePlaceholderSize: true,
        //revert: true,
        iframeFix: true,
        iframeScroll: true,
        scrollSensitivity: 30,
        scroll: true,
        items: '.mcb-section.vb-item',
        containment: "parent",
        appendTo: $content.find('body'),
        helper: function(e, ui) {
            return $('<div>').addClass('mfn-vb-dragger mfn-vb-drag-section').text( 'Section sort' );
        },
        cursorAt: {
            top: 20,
            left: 20
        },
        update: function(e, ui) {

            $content.find('.mfn-builder-content .mcb-section').each(function(i) {
                $(this).attr('data-order', i);
            });

            setTimeout(function() {
                var nav_item = ui.item.attr('data-uid');
                var nav_order = ui.item.attr('data-order');

                var $nav_clone = $navigator.find('.navigator-tree li.nav-'+nav_item);
                $navigator.find('.navigator-tree li.nav-'+nav_item).remove();

                if( $navigator.find('.navigator-tree ul').length ){
                    if( nav_order == 0 ){
                        $navigator.find('.navigator-tree').prepend( $nav_clone );
                    }else{
                        $navigator.find('.navigator-tree > li:nth-child('+nav_order+')').after($nav_clone);
                    }
                }

                addHistory();
            },100);

        },
        start: function(event, elem) {
            scroll_top = $content.find("html, body").scrollTop();
            $content.find('.mcb-section').addClass('ui-droppable-active-show')
        },
        stop: function(event, elem) {
            $content.find('.mcb-section').removeClass('ui-droppable-active-show')
        }
    });

});
}
}


function blink(){
    setTimeout(function(){
        $content.find('.blink').removeClass('blink');
    }, 800);
}

































// re renders

function re_render(){
    $box = $('.sidebar-wrapper .panel-edit-item .mfn-form .mfn-element-fields-wrapper');

    var it = 'mcb-item-'+edited_item.uid;

    let widget_attr = {};
    let widget_type = edited_item.type;

    widget_attr['vb'] = true;
    widget_attr['uid'] = edited_item.uid;
    widget_attr['type'] = edited_item.type;
    widget_attr['size'] = edited_item.size;
    widget_attr['tablet_size'] = edited_item.tablet_size;
    widget_attr['mobile_size'] = edited_item.mobile_size;

    $box.find('.modalbox-re_render .mfn-field-value').each(function() {
        let f_name = $(this).attr('name');
        widget_attr[f_name] = $(this).val();
    });

    $box.find('.modalbox-re_render .single-segmented-option.segmented-options li input:checked').each(function() {
        let f_name = $(this).attr('name');
        widget_attr[f_name] = $(this).val();
    });

    if(widget_type == 'image_gallery'){
        widget_attr['ids'] = $box.find('.upload-input').val();
    }

    if( edited_item.type == 'lottie' ){
        $content.find('.'+it+' .mcb-column-inner').css('min-height', $content.find('.'+it+' .mfn-lottie-wrapper').outerHeight());
        var it_lottie = $content.find('.mcb-item-'+edited_item.uid+' .lottie').attr('id');
        iframe.window[it_lottie].destroy();
    }

    $content.find('.'+it).addClass('loading disabled');

    $.ajax({
        url: ajaxurl,
        data: {
            action: 'rerenderwidget',
            'mfn-builder-nonce': wpnonce,
            type: widget_type,
            pageid: pageid,
            attri: widget_attr,
        },
        type: 'POST',
        success: function(response){
            $content.find('.'+it+' .mcb-column-inner').children().not('.item-header, .mfn-drag-helper').remove();

            if(Array.isArray(response)){

                $content.find('.'+it+' .mcb-column-inner').append( response[0] );
                var ajax_script = document.createElement("script");
                ajax_script.innerHTML = response[1];
                document.getElementById('mfn-vb-ifr').contentWindow.document.body.appendChild(ajax_script);

            }else{
                $content.find('.'+it+' .mcb-column-inner').append(response);
            }

            $content.find('.'+it).removeClass('loading disabled');

            if( edited_item.type == 'lottie' ){
                $content.find('.'+it+' .mcb-column-inner').css('min-height', '1px');
            }

            addHistory();
        }
    });
}

// tabs

function re_render_tabs(){
    var $editbox = $('.sidebar-wrapper .panel-edit-item .mfn-form .mfn-element-fields-wrapper');
    var g = $editbox.attr('data-group');
    var it = 'mcb-item-'+edited_item.uid;

    $content.find('.'+it).addClass('loading disabled');

    var widget_type = edited_item.type;
    var widget_attr = {};

    widget_attr['uid'] = edited_item.uid;
    widget_attr['type'] = edited_item.type;
    widget_attr['size'] = edited_item.size;
    widget_attr['tablet_size'] = edited_item.tablet_size;
    widget_attr['mobile_size'] = edited_item.mobile_size;

    widget_attr['tabs'] = [];

    if(widget_type != 'feature_list'){
        widget_attr['title'] = $('.sidebar-wrapper .panel-edit-item .mfn-form .preview-titleinput').val();
    }

    if(widget_type == 'feature_list'){
        widget_attr['columns'] = $('.sidebar-wrapper .panel-edit-item .mfn-form .feature_list.columns input:checked').val();
        widget_attr['content'] = $('.sidebar-wrapper .panel-edit-item .mfn-form .feature_list .preview-contentinput').val();
    }

    if(widget_type == 'tabs'){
        widget_attr['type'] = $('.sidebar-wrapper .panel-edit-item .mfn-form .tabs.type input:checked').val();
        widget_attr['uid'] = $('.sidebar-wrapper .panel-edit-item .mfn-form .tabs.uid .preview-uidinput').val();
    }

    if(widget_type == 'info_box'){
        widget_attr['image'] = $('.sidebar-wrapper .panel-edit-item .mfn-form .info_box .preview-imageinput').val();
        widget_attr['title'] = $('.sidebar-wrapper .panel-edit-item .mfn-form .info_box .preview-titleinput').val();
        widget_attr['animate'] = $('.sidebar-wrapper .panel-edit-item .mfn-form .info_box .preview-animateinput').val();
        widget_attr['content'] = $('.sidebar-wrapper .panel-edit-item .mfn-form .info_box .preview-contentinput').val();
    }

    if(widget_type == 'opening_hours'){
        widget_attr['content'] = $('.sidebar-wrapper .panel-edit-item .mfn-form .opening_hours .preview-contentinput').val();
        widget_attr['image'] = $('.sidebar-wrapper .panel-edit-item .mfn-form .opening_hours .preview-imageinput').val();
    }

    if(widget_type == 'accordion'){
        widget_attr['open1st'] = $('.sidebar-wrapper .panel-edit-item .mfn-form .modalbox-card.active .open1st input:checked').val();
        widget_attr['openAll'] = $('.sidebar-wrapper .panel-edit-item .mfn-form .modalbox-card.active .openAll input:checked').val();
        widget_attr['style'] = $('.sidebar-wrapper .panel-edit-item .mfn-form .modalbox-card.active .style input:checked').val();
    }

    if(widget_type == 'faq'){
        widget_attr['open1st'] = $('.sidebar-wrapper .panel-edit-item .mfn-form .faq.open1st input:checked').val();
        widget_attr['openAll'] = $('.sidebar-wrapper .panel-edit-item .mfn-form .faq.openAll input:checked').val();
    }

    if(widget_type == 'progress_bars'){
        widget_attr['content'] = $('.sidebar-wrapper .panel-edit-item .mfn-form .progress_bars .preview-contentinput').val();
    }

    if(widget_type == 'pricing_item' || widget_type == 'map'){

        $('.panel-edit-item .modalbox-re_render .'+widget_type+' .mfn-form-control').each(function() {
            let f_name = $(this).closest('.mfn-form-row').attr('data-name');
            if(f_name != 'tabs'){ widget_attr[f_name] = $(this).val(); }
        });

        $('.panel-edit-item .modalbox-re_render .'+widget_type+' .single-segmented-option.segmented-options li input:checked').each(function() {
            let f_name = $(this).closest('.mfn-form-row').attr('data-name');
            if(f_name != 'tabs'){ widget_attr[f_name] = $(this).val(); }
        });
    }

    if($editbox.find('.tabs-wrapper li.tab:not(.default)').length){
        $editbox.find('.tabs-wrapper li.tab:not(.default)').each(function(a) {

            if(widget_type == 'progress_bars'){
                var arr = {
                    'title': $(this).find('.mfn-tab-title').val(),
                    'value': $(this).find('.mfn-tab-value').val(),
                    'size': $(this).find('.mfn-tab-size').val(),
                    'color': $(this).find('.mfn-tab-color').val()
                };
            }else if(widget_type == 'tabs' || widget_type == 'accordion' || widget_type == 'faq' || widget_type == 'header_promo_bar'){
                var arr = {
                    'title': $(this).find('.mfn-tab-title').val(),
                    'content': $(this).find('.mfn-form-textarea').val()
                };
            }else if(widget_type == 'feature_list'){
                var arr = {
                    'title': $(this).find('.mfn-tab-title').val(),
                    'icon': $(this).find('.mfn-tab-icon').val(),
                    'link': $(this).find('.mfn-tab-link').val(),
                    'target': $(this).find('.mfn-tab-target').val(),
                    'animate': $(this).find('.mfn-tab-animate').val(),
                };
            }else if(widget_type == 'info_box'){
                var arr = {
                    'content': $(this).find('.mfn-tab-content').val(),
                };
            }else if(widget_type == 'opening_hours'){
                var arr = {
                    'days': $(this).find('.mfn-tab-days').val(),
                    'hours': $(this).find('.mfn-tab-hours').val(),
                };
            }else if(widget_type == 'timeline'){
                var arr = {
                    'title': $(this).find('.mfn-tab-title').val(),
                    'date': $(this).find('.mfn-tab-date').val(),
                    'content': $(this).find('.mfn-form-textarea').val(),
                };
            }else if(widget_type == 'pricing_item'){
                var arr = {
                    'title': $(this).find('.mfn-tab-title').val(),
                };
            }else if(widget_type == 'pricing_item'){
                var arr = {
                    'lat': $(this).find('.mfn-tab-lat').val(),
                    'lng': $(this).find('.mfn-tab-lng').val(),
                    'icon': $(this).find('.mfn-tab-icon').val(),
                };
            }else if(widget_type == 'map'){
                var arr = {
                    'lat': $(this).find('.mfn-tab-lat').val(),
                    'lng': $(this).find('.mfn-tab-lng').val(),
                    'icon': $(this).find('.mfn-tab-icon').val(),
                    'content': $(this).find('textarea').val(),
                };
            }

            widget_attr['tabs'].push(arr);

        });
    }

    $.ajax({
        url: ajaxurl,
        data: {
            action: 'rerenderwidget',
            'mfn-builder-nonce': wpnonce,
            type: widget_type,
            attri: widget_attr,
        },
        type: 'POST',
        success: function(response){
            $content.find('.'+it+' .mcb-column-inner').children().not('.item-header, .mfn-drag-helper').remove();

            if(Array.isArray(response)){
                $content.find('.'+it+' .mcb-column-inner').append(response[0]);
                //eval(ajax_script);
                var ajax_script = document.createElement("script");
                ajax_script.innerHTML = response[1];
                document.getElementById('mfn-vb-ifr').contentWindow.document.body.appendChild(ajax_script);
            }else{
                $content.find('.'+it+' .mcb-column-inner').append(response);
            }
            if(widget_type == 'progress_bars'){
                $content.find('.'+it+' .bars_list').addClass('hover');
            }

            $content.find('.'+it).removeClass('loading disabled');
            addHistory();
        }
    });

}

var openEditForm = {

    do: function($edited_div, scroll = false) {

        if( wyswig_active ){

            if( $editpanel.find( '.panel-edit-item .mfn-form .html-editor' ).length ) MfnFieldTextarea.destroy();
            if( $editpanel.find( '.panel-edit-item .mfn-form .visual-editor' ).length ) tinymce.execCommand( 'mceRemoveEditor', false, 'mfn-editor' );

            wyswig_active = false;
            var old_uid = edited_item.uid;
            var old_val = edited_item.fields.content;
            $content.find('.mcb-item-'+old_uid).addClass('loading disabled');

            // $content.find('.mcb-item-'+old_uid+' .mfn-inline-editor').html( old_uid +'<br>'+old_uid +'<br>'+old_uid +'<br>' );

            $.ajax({
                url: MfnVbApp.ajaxurl,
                data: {
                    action: 'rendercontent',
                    'mfn-builder-nonce': wpnonce,
                    val: old_val,
                    uid: old_uid
                },
                type: 'POST',
                success: function(response){
                    $content.find('.mcb-item-'+response['uid']+' .mfn-inline-editor').removeClass('mfn-focused');
                    $content.find('.mcb-item-'+response['uid']).removeClass('loading disabled');
                    $content.find('.mcb-item-'+response['uid']+' .mfn-inline-editor').html(response['html']);
                    addHistory();
                }
            });
        }

        if( $content.find('.vb-item.mfn-current-editing').length ) $content.find('.vb-item.mfn-current-editing').removeClass('mfn-current-editing');
        $edited_div.addClass('mfn-current-editing');
        var id = $edited_div.attr('data-uid');

        if( typeof edited_item.jsclass !== 'undefined' ) $('.mfn-ui').removeClass('mfn-editing-'+edited_item.jsclass);

        $(".header:not(.header-edit-item):visible").hide();
        if( !$(".panel-edit-item").is(":visible") ) { $('.panel').hide(); $(".panel-edit-item").show(); $(".header-edit-item").show(); }

        edited_item = mfnvbvars.pagedata.filter( (item) => item.uid == id )[0];

        $('.mfn-ui .panel-edit-item .mfn-form').html( renderMfnFields[edited_item.jsclass]( edited_item ) );

        if( edited_item.jsclass != 'section' && edited_item.jsclass != 'wrap' && edited_item.jsclass != 'placeholder' ){
            $('.mfn-ui .panel-edit-item .mfn-form .mfn-element-fields-wrapper').append( renderMfnFields['advanced']( edited_item ) );
        }

        //console.log(id);
        //console.log(edited_item);

        $('.mfn-ui').addClass('mfn-editing-'+edited_item.jsclass);

        $('.mfn-visualbuilder .sidebar-panel .sidebar-panel-header .header-edit-item .title-group .sidebar-panel-desc .sidebar-panel-title').html( edited_item.title );
        $('.mfn-visualbuilder .sidebar-panel .sidebar-panel-header .header-edit-item .title-group .sidebar-panel-icon').attr('class', 'sidebar-panel-icon mfn-icon-'+edited_item.icon);

        if( $editpanel.find( '.panel-edit-item .mfn-form .html-editor' ).length ){
            wyswig_active = true;
            preventEdit = true;
            MfnFieldTextarea.create();
            //$(document).trigger('mfn:vb:edit');
        }

        if( $editpanel.find( '.panel-edit-item .mfn-form .visual-editor' ).length ){
            wyswig_active = true;
            preventEdit = true;
            MfnFieldVisual.init();
        }

        //console.log(edited_item);

        onOpenEditForm();
        mfnoptsinputs.start();

        if( scroll ){
            $content.find('html, body').animate({ scrollTop: $edited_div.offset().top - 50 }, 1000);
        }

        return;

    }
}


/**
 * Builder settings
 */

var settings = {
    start: function(){
        if( $('#mfn-visualbuilder').hasClass('column-visual') ){
          $('.mfn-ui .panel-settings .mfn-form .settings .form-control[data-option="column-visual"] li:first').removeClass('active')
            .siblings().addClass('active');
        }

        if( !$content.find("body").hasClass('mfn-modern-nav') ){
          $('.mfn-ui .panel-settings .mfn-form .settings .form-control[data-option="mfn-modern-nav"] li:first').removeClass('active')
            .siblings().addClass('active');
        }

        if( $('#mfn-visualbuilder').hasClass('mfn-ui-dark') && !$('#mfn-visualbuilder').hasClass('mfn-ui-auto') ){
            $('.mfn-ui .panel-settings .mfn-form .settings .form-control[data-option="ui-theme"] li').removeClass('active');
            $('.mfn-ui .panel-settings .mfn-form .settings .form-control[data-option="ui-theme"] li:last-child').addClass('active');
        }else if( $('#mfn-visualbuilder').hasClass('mfn-ui-light') ){
            $('.mfn-ui .panel-settings .mfn-form .settings .form-control[data-option="ui-theme"] li').removeClass('active');
            $('.mfn-ui .panel-settings .mfn-form .settings .form-control[data-option="ui-theme"] li:nth-child(2)').addClass('active');
        }else{
            settings.detectOsTheme();
        }

        settings.run();
    },
    run: function() {
        $('.mfn-ui .panel-settings .single-segmented-option.segmented-options ul li a').on('click', function(e) {
            e.preventDefault();

            var $el = $(this),
            $li = $el.closest('li'),
              $row = $el.closest('.mfn-row');

            var option = $el.closest('.form-control').data('option'),
              value = false;

            $li.addClass('active')
              .siblings('li').removeClass('active');

            value = $li.data('value');

            if( option == 'mfn-modern-nav' ){

                if( value == 1 && !$content.find("body").hasClass('mfn-modern-nav') ){
                    $content.find("body").addClass(option);
                }else{
                    $content.find("body").removeClass(option);
                }

            }else if( option == 'ui-theme' ){

                $("#mfn-visualbuilder").removeClass('mfn-ui-auto mfn-ui-dark mfn-ui-light').addClass(value);
                $content.find('body').removeClass('mfn-ui-auto mfn-ui-dark mfn-ui-light').addClass(value);

                if(value == 'mfn-ui-auto'){
                    settings.detectOsTheme();
                }

            }else{
                if( value ){
                  $('#mfn-visualbuilder').addClass(option);
                } else {
                  $('#mfn-visualbuilder').removeClass(option);
                }
            }

            $.ajax( ajaxurl, {
              type : "POST",
              data : {
                'mfn-builder-nonce': wpnonce,
                action: 'mfn_builder_settings',
                option: option,
                value: value,
              }

            }).done(function(response){

              // show info for pre-completed option

              if( ['pre-completed','column-visual'].includes(option) ){
                $row.addClass('changed');
              }

              if( 'hover-effects' == option ){
                triggerResize();
              }

            });

        });
    },

    detectOsTheme: function() {
        if( $('#mfn-visualbuilder').hasClass('mfn-ui-auto') ){
            if(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                $('#mfn-visualbuilder').addClass('mfn-ui-dark');
                if($content) $content.find('body').addClass('mfn-ui-dark');
            }
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
                const newColorScheme = event.matches;

                if( newColorScheme ) {
                    $('#mfn-visualbuilder').addClass('mfn-ui-dark');
                    if($content) $content.find('body').addClass('mfn-ui-dark');
                }else{
                    $('#mfn-visualbuilder').removeClass('mfn-ui-dark');
                    if($content) $content.find('body').removeClass('mfn-ui-dark');
                }
                //const newColorScheme = event.matches ? $('#mfn-visualbuilder').addClass('mfn-ui-dark') /*$content.find('body').addClass('mfn-ui-dark')*/ : $('#mfn-visualbuilder').removeClass('mfn-ui-dark')/* $content.find('body').addClass('mfn-ui-dark')*/;

            });
        }
    }
}


var modernmenu = {
    start: function() {
        $content.find('.mfn-builder-content').on('click', '.mfn-header .mfn-element-menu', function(e) {
            e.preventDefault();
            $(this).closest('.mfn-header').toggleClass('mfn-element-menu-opened');
        });
    }
}

/**
 * Introduction slider
 */

var introduction = {

  overlay: $('.mfn-intro-overlay'),

  options: {

    // introduction.options.get()

    get: function(){

      return $('#mfn-visualbuilder').hasClass('intro');

    },

    // introduction.options.set()

    set: function( value ){

      $.ajax( ajaxurl, {

        type : "POST",
        data : {
          'mfn-builder-nonce': wpnonce,
          action: 'mfn_builder_settings',
          option: 'intro',
          value: value, // 0 - hide intro, 1 - show intro
        }

      });

    }

  },

  // introduction.open()

  open: function(){
    // do not open, when disabled support
    if ( parseInt( $('#mfn-visualbuilder').attr('data-tutorial') ) ) {
      return false;
    }

    var $slider = $('.mfn-intro-container ul');

    var slidesAmount = $('.mfn-intro-container ul li').size() - 1;

    // slider do not exists, ie. white label mode
    if( ! $slider.length ){
      return false;
    }

    // slider has been skipped before
    if( ! introduction.options.get() ){
      return false;
    }

    // FIX: wpbakery - dp not show introduction when page options closed
    if( $('#mfn-meta-page').hasClass('closed') ){
      return false;
    }

    $('body').addClass('mfn-modal-open');

    introduction.overlay.show();

    // slick has been initialized before so skip steps below
    if( $slider.hasClass('slick-slider') ){
      return false;
    }

    $slider.slick({
      cssEase: 'ease-out',
      dots: false,
      fade: true,
      infinite: false
    });

    $slider.on('afterChange', function(event, slick, currentSlide, nextSlide){
      if ( currentSlide === slidesAmount ){
        introduction.options.set(0);
      }
    });

    // close once on overlay click

    introduction.overlay.on('click', function(e){
      e.preventDefault();
      if ( $(e.target).hasClass('mfn-intro-overlay') ){
        introduction.close();
      }
    });

    // close permanently on X or 'skip' click

    $('.mfn-intro-close').on('click', function(e){
      e.preventDefault();
      introduction.options.set(0);
      introduction.close();
    });

  },

  // introduction.reopen()

  reopen: function(){
    introduction.options.set(1);
    $('#mfn-visualbuilder').addClass('intro');
    introduction.open();
  },

  // introduction.close()

  close: function(){
    $('body').removeClass('mfn-modal-open');
    $('#mfn-visualbuilder').removeClass('intro');
    introduction.overlay.fadeOut(200);
  }

};

introduction.open();

$('.introduction-reopen').on('click', function(e) {
  introduction.reopen();
});




$('.shortcutsinfo-open').on('click', function(e) {
    e.preventDefault();
    $('.modal-shortcuts').addClass('show');
});

$('.mfn-option-dropdown.btn-save-action a').on('click', function(e) {e.preventDefault();});

// export / import

$('.mfn-export-import-opt').on('click', function(e) {
    e.preventDefault();
    $('.mfn-export-import-opt').removeClass('active');
    $(this).addClass('active');
    $(".panel").hide();
    $('.export-import-current').text($(this).text());
    let filtr = $(this).data('filter');
    if( filtr == 'panel-export-import-presets' ){
        $('#export-presets-data-textarea').val( JSON.stringify(mfnvbvars.presets.filter( (it) => it.type == 'custom' )) );
    }
    $('.'+filtr).show();
});

$('.mfn-export-button').on('click', function(e) {
    e.preventDefault();

    if(!$(this).hasClass('mfn-icon-check-blue')){
        $('.mfn-export-field').select();
        document.execCommand("copy");
        $(this).find('span').text('Copied').addClass('mfn-icon-check-blue');
        localStorage.setItem( 'mfn-builder', JSON.stringify({
          clipboard: $('.mfn-export-field').val()
        }) );
    }
});

$('.mfn-items-import-template li').on('click', function() {
    $('.mfn-items-import-template li').removeClass('active');
    $(this).addClass('active');
});

$('.mfn-export-cancel').on('click', function(e) {
    e.preventDefault();
    backToWidgets();
});

function handlePaste (e) {
    var clipboardData, pastedData;

    // Stop data actually being pasted into div
    e.stopPropagation();
    e.preventDefault();

    // Get pasted data via clipboard API
    clipboardData = e.clipboardData || window.clipboardData;
    pastedData = clipboardData.getData('Text');

    if( !pastedData && JSON.parse(localStorage.getItem('mfn-builder')).clipboard ){
        pastedData = JSON.parse(localStorage.getItem('mfn-builder')).clipboard;
    }

    $('#import-data-textarea').val(pastedData);
}

document.getElementById('import-data-textarea').addEventListener('paste', handlePaste);

// pre built sections

$('.pre-built-opt').on('click', function(e) {
    e.preventDefault();
    $('.pre-built-opt').removeClass('active');
    $(this).addClass('active');
    $('.pre-built-current').text($(this).text());
    let filtr = $(this).data('filter');

    $('.mfn-visualbuilder .sidebar-panel-content ul.prebuilt-sections-list li').hide();
    $('.mfn-visualbuilder .sidebar-panel-content ul.prebuilt-sections-list li.'+filtr).show();
});

// preview

$('.mfn-preview-opt').on('click', function() {
    let preview_type = $(this).data('preview');
    if(!$('body').hasClass('mfn-preview-mode')){ $('body').addClass('mfn-preview-mode'); }
    switchPreview(preview_type);
});

$('.mfn-preview-mode-close').on('click', function(e) {
    e.preventDefault();
    $('body').removeClass('mfn-preview-mode');
    switchPreview('desktop');
    screen = 'desktop';
    $('.mfn-visualbuilder').removeClass('preview-mobile preview-tablet preview-desktop');
});

$editpanel.on('click', '.responsive-switcher li', function() {
    let preview_type = $(this).find('span').attr('data-device');
    switchPreview(preview_type);
    if(preview_type != 'desktop'){ if( !$('body').hasClass('mfn-preview-mode') ) { $('body').addClass('mfn-preview-mode'); } }else{ $('body').removeClass('mfn-preview-mode'); $('.mfn-visualbuilder').removeClass('preview-mobile preview-tablet preview-desktop'); }
});

function switchPreview(preview_type) {
    $('.mfn-preview-toolbar .mfn-preview-opt').removeClass('btn-active');
    $('.mfn-preview-toolbar .mfn-preview-opt[data-preview="'+preview_type+'"]').addClass('btn-active');
    $('.mfn-visualbuilder').removeClass('preview-mobile preview-tablet preview-desktop');
    if(preview_type != 'desktop'){
        $('.mfn-visualbuilder').addClass('preview-'+preview_type)
    }

    screen = preview_type;

    setSizeLabels();

    $('.sidebar-panel-footer .btn-change-resolution > a span:first-child').attr('class', 'mfn-icon mfn-icon-'+preview_type);

    if( $content.find('.mfn-current-editing').length ){
        setTimeout(function() {
            $content.find('html, body').animate({ scrollTop: $edited_div.offset().top - 50 }, 500);
        }, 100);
    }

    runSorting();
}

$('.btn-navigator-switcher').on('click', function(e) {
    e.preventDefault();
    $('body').toggleClass('mfn-navigator-active');
});

$(".mfn-navigator").draggable({
    handle: ".modalbox-header"
});

$( ".mfn-navigator" ).resizable({
  maxHeight: winH,
  maxWidth: 600,
  minHeight: 300,
  minWidth: 250
});

$('.mfn-navigator-search-input').on('keyup', function() {
    var val = $(this).val().replace(/ /g, '_').toLowerCase();
    if( val.length ){
        if( val.length > 2 ){
            $(".mfn-navigator").addClass('mfn-nav-searching');

            $navigator.find('li').hide();
            $navigator.find('li.navitemtype[data-name*="'+val+'"]').closest('.navigator-section').show();
            $navigator.find('li.navitemtype[data-name*="'+val+'"]').closest('.navigator-wrap').show();
            $navigator.find('li.navitemtype[data-name*="'+val+'"]').parents('.mfn-sub-nav').show();
            $navigator.find('li.navitemtype[data-name*="'+val+'"]').show();

        }else{
            $(".mfn-navigator").removeClass('mfn-nav-searching');
            $navigator.find('li').removeAttr('style');
            $navigator.find('li:not(.active) > .mfn-sub-nav').removeAttr('style');
        }
    }else{
        $navigator.find('li.navigator-section').show();
        $(".mfn-navigator").removeClass('mfn-nav-searching');
        $navigator.find('li').removeAttr('style');
        $navigator.find('li:not(.active) > .mfn-sub-nav').removeAttr('style');
    }
});


$('.mfn-navigator').on('click', '.navigator-tree li .navigator-arrow', function(e) {
    var $li = $(this).closest('li');
    $li.closest('.navigator-section').siblings().find('ul').slideUp();
    $li.closest('.navigator-section').siblings().find('li.active').removeClass('active');
    $li.closest('.navigator-section.active').siblings('li').removeClass('active');

    if( !$li.hasClass('active') ){
        $li.children('ul').slideDown(function() {
            $li.addClass('active');
        });
    }else{
        $li.children('ul').slideUp(function() {
            $li.removeClass('active');
        });
    }
    if( $navigator.hasClass('mfn-nav-searching') ){
        $navigator.find('li').removeAttr('style');
        $navigator.find('li:not(.active) > .mfn-sub-nav').removeAttr('style');
        $navigator.removeClass('mfn-nav-searching');
    }
});

$('.mfn-navigator').on('click', '.navigator-tree li a', function(e) {
    e.preventDefault();
    var uid = $(this).attr('data-uid');
    if( $('.mfn-navigator li a.active-element').length ){
        $('.mfn-navigator li a').removeClass('active-element');
    }
    $edited_div = $content.find('.vb-item[data-uid="'+uid+'"]');
    openEditForm.do($edited_div, true);
    $(this).addClass('active-element');
});

// end preview

// revisions

$('.mfn-revisions-opt').on('click', function(e) {
    e.preventDefault();
    $('.mfn-revisions-opt').removeClass('active');
    $(this).addClass('active');
    $(".panel").hide();
    $('.revisions-current').text($(this).text());
    let filtr = $(this).data('filter');
    $('.'+filtr).show();
});


$('.sidebar-panel #mfn-widgets-list .mfn-search').on('focus', function() {
    $('.mfn-visualbuilder .sidebar-panel-content ul.items-list li').show();
    $('.mfn-filter-items').removeClass('active');
    $('.mfn-filter-items[data-filter="all"]').addClass('active');
    $('.filter-items-current').text($('.mfn-filter-items[data-filter="all"]').text());
});

var options = {
  valueNames: [ 'title' ]
};

var userList = new List('mfn-widgets-list', options);

var optionsicons = {
  valueNames: [ 'titleicon' ]
};

var iconsList = new List('modal-select-icon', optionsicons);

// filter items

$('.mfn-filter-items').on('click', function(e) {
    e.preventDefault();
    $('.mfn-filter-items').removeClass('active');
    $(this).addClass('active');
    $('.filter-items-current').text($(this).text());
    let filtr = $(this).data('filter');

    $('.sidebar-panel #mfn-widgets-list .mfn-search').val('');
    userList.search();

    if(filtr == 'all'){
        $('.mfn-visualbuilder .sidebar-panel-content ul.items-list li').show();
    }else{
        $('.mfn-visualbuilder .sidebar-panel-content ul.items-list li').hide();
        $('.mfn-visualbuilder .sidebar-panel-content ul.items-list li.'+filtr).show();
    }
});

// back to widgets

$("li.menu-items a ").on('click', function(e) {
    e.preventDefault();
    backToWidgets();
});
$('.back-to-widgets').on('click', function(e) {
    e.preventDefault();
    backToWidgets();
});

// close modal icon

$('.btn-modal-close').on('click', function(e) {
    e.preventDefault();
    $(this).closest('.mfn-modal').removeClass('show');
    if( !$('.mfn-modal.show').length ){
        $('.mfn-ui').removeClass('.mfn-modal-open');
        $('body').removeClass('.mfn-modal-open');
    }
});

// modal icon

$('.mfn-ui .modal-select-icon .modalbox-search .mfn-form-select').on('change', function() {
    let choosed = $(this).val();
    if( $('.mfn-ui .modal-select-icon .modalbox-search .mfn-search').val() != '' ){
        $('.mfn-ui .modal-select-icon .modalbox-search .mfn-search').val('');
        iconsList.search();
    }
    $('.mfn-ui .modal-select-icon .modalbox-content ul.mfn-items-list li').hide();
    $('.mfn-ui .modal-select-icon .modalbox-content ul.mfn-items-list li.'+choosed).show();
});

// show prebuilts

$(".sidebar-menu ul li.menu-sections a ").on('click', function(e) {
    e.preventDefault();
    showPrebuilts();
    // resetSaveButton();
});

// show revisions

$(".sidebar-menu ul li.menu-revisions a ").on('click', function(e) {
    e.preventDefault();
    $(".panel").hide();
    $(".header").hide();
    $(".panel-revisions").show();
    $(".header-revisions").show();
    $('.mfn-revisions-opt').removeClass('active');

    $('.mfn-revisions-opt').first().addClass('active');
    $('.revisions-current').text($('.mfn-revisions-opt').first().text());
    // resetSaveButton();
});

// show import export
$(".sidebar-menu ul li.menu-export a ").on('click', function(e) {
    e.preventDefault();
    $('.mfn-export-import-opt').removeClass('active');
    updateExportInput();
    $(".panel").hide();
    $(".header").hide();
    $('.export-import-current').text($('.mfn-export-import-opt').first().text());
    $('.mfn-export-import-opt').first().addClass('active');
    $(".panel-export-import").show();
    $(".header-export-import").show();
    // resetSaveButton();
});

// show single page import
$(".sidebar-menu ul li.menu-page a ").on('click', function(e) {
    e.preventDefault();
    $('.mfn-export-import-opt').removeClass('active');
    $(".panel").hide();
    $(".header").hide();
    $('.export-import-current').text($('.mfn-export-import-opt').last().text());
    $('.mfn-export-import-opt').last().addClass('active');
    $(".panel-export-import-single-page").show();
    $(".header-export-import").show();
    // resetSaveButton();
});

// show settings
$('.mfn-settings-tab').on('click', function(e) {
    e.preventDefault();
    $(".panel").hide();
    $(".header").hide();
    $(".panel-settings").show();
    $(".header-settings").show();
    // resetSaveButton();
});

// show view options
$('.mfn-view-options-tab').on('click', function(e) {
    e.preventDefault();
    // $('.btn-save-action').hide();
    // $('.btn-save-form-primary').attr('data-action', 'update').removeClass('mfn-btn-green').addClass('mfn-btn-blue');
    // $('.btn-save-form-primary span').text('Save options');
    $(".panel").hide();
    $(".header").hide();
    $(".panel-view-options").show();
    $(".header-view-options").show();
    edited_item = mfnvbvars.pagedata.filter( (item) => item.uid == 'pageoptions' )[0];
    $('.mfn-ui .panel-view-options .mfn-form.mfn-form-options').html( renderMfnFields.pageoptions( edited_item ) );
});


function updateExportInput(){

    var formData = prepareForm();

    $.ajax({
        url: ajaxurl,
        data: {
            action: 'mfntoclipboard',
            'mfn-builder-nonce': wpnonce,
            sections: formData
        },
        type: 'POST',
        /*contentType: false,
        processData: false,*/
        success: function(response){
            $('.panel-export-import .mfn-export-field').val(response);
        }
    });
}

$(document).ajaxComplete(function() {
    runAjaxElements();
});

function runAjaxElements(){

    // vb tools
    runSorting();

    // blog slider
    if($content && $content.find('.blog_slider .blog_slider_ul:not(.slick-initialized)').length){
        mfnSliderBlog();
    }
    // clients slider
    if($content && $content.find('.clients_slider_ul').length){
        mfnSliderClients();
    }

    // gallery
    if($content && $content.find('.sections_group .gallery').not('.mfn-initialized').length){
        mfnGalleryInit();
    }

    // countdown
    if($content && $content.find('.downcount').length){
        mfnCountDown();
    }

    // chart
    if($content && $content.find('.chart_box:not(.mfn-initialized)').length){
        mfnChart();
    }

    // counter

    if($content && $content.find('.animate-math .number').length){
        mfnAnimateMath();
    }

    // slider

    if($content && $content.find('.content_slider_ul').length){
        sliderSlider();
    }

    // accordion
    if($content && $content.find('.mfn-acc').length){
        accordionifaqs();
    }

    if($content && $content.find('.woocommerce-product-attributes').length){
        spanToAdditionalInfo();
    }

    if( $content && $content.find('.promo_bar_slider').length ){
      promoBarSlider();
    }

    if( $content && $content.find('.mcb-wrap.sticky:not(.stickied)').length ){
        stickyWrap.init();
    }

    // feature list

    if($content && $content.find('.feature_list').length){
        mfnFeatureList();
    }

    // hover box

    if($content && $content.find('.tooltip, .hover_box').length){
        mfnHoverBox();
    }
    // slider offer full

    if($content && $content.find('.offer_ul').length){
        mfnSliderOffer();
    }

    if($content && $content.find('.blog_wrapper .isotope:not( .masonry ), .portfolio_wrapper .isotope:not( .masonry-flat, .masonry-hover, .masonry-minimal').length){
        portfolioIsotope();
    }

    if($content && $content.find('.isotope.masonry, .isotope.masonry-hover, .isotope.masonry-minimal').length){
        blogPortfolioMasonry();
    }

    // slider testimonials

    if($content && $content.find('.testimonials_slider_ul').length){
        sliderTestimonials();
    }

    // slider offer thumb

    if($content && $content.find('.offer_thumb_ul:not(.slick-initialized)').length){
        mfnSliderOfferThumb();
    }

    if($content && $content.find('.shop_slider_ul').length){
        mfnSliderShop();
    }

    // product gallery

    if( $content && $content.find('.mcb-item-product_images-inner .woocommerce-product-gallery:not(.mfn-initialized)').length ){
        productgallery.start( $content.find('.mcb-item-product_images-inner .woocommerce-product-gallery:not(.mfn-initialized)') );
    }

    // portfolio slider

    if($content && $content.find('.portfolio_slider_ul').length){
        sliderPortfolio();
    }

    // before after

    if($content && $content.find('.before_after.twentytwenty-container').length){

        $content.find('.before_after.twentytwenty-container .twentytwenty-overlay').remove();
        $content.find('.before_after.twentytwenty-container .twentytwenty-after-label').remove();
        $content.find('.before_after.twentytwenty-container .twentytwenty-handle').remove();

        $content.find('.before_after.twentytwenty-container').imagesLoaded(function() {
            $content.find('.before_after.twentytwenty-container').twentytwenty();
            $content.find('.before_after.twentytwenty-container').not('mfn-initialized').addClass('mfn-initialized');
        });
    }
    // tabs
    if($content && $content.find('.jq-tabs:not(.ui-tabs)').length){
        $content.find('.jq-tabs:not(.ui-tabs) ul li a').each(function() { $(this).attr("href", location.href.toString().replace('#', '')+$(this).attr("href")); }); // prevents tab reload iframe from jquery 1.9, 1.8 is ok
        $content.find('.jq-tabs:not(.ui-tabs)').tabs();
    }

    // edit view for new widget
    if($content && $content.find('.mfn-builder-content .mfn-new-item .mfn-element-edit').length){

        if( !$content.find('.mfn-builder-content .mfn-new-item').hasClass('column_placeholder') ){
            $content.find('.mfn-builder-content .mfn-new-item .mfn-element-edit').trigger('click');
        }
        $content.find('.mfn-builder-content .mfn-new-item').removeClass('mfn-new-item');

    }
}





// reinit js

// accordion & faq


function accordionifaqs(){
    $content.find('.mfn-acc').each(function() {
      var el = $(this);

      if (el.hasClass('openAll')) {

        // show all
        el.find('.question')
          .addClass("active")
          .children(".answer")
          .show();

      } else {

        // show one
        var activeTab = el.attr('data-active-tab');
        if (el.hasClass('open1st')) activeTab = 1;

        if (activeTab) {
          el.find('.question').eq(activeTab - 1)
            .addClass("active")
            .children(".answer")
            .show();
        }

      }
    });
}

// chart

function mfnChart(){
    $content.find('.chart_box:not(.mfn-initialized)').each(function() {
        var chart_html = $(this).html();

        var $box = $(this).closest('.mcb-column');

        //$('.mfn-vb-formrow.mfn-vb-'+$box.attr('data-uid')+' .color-picker-group .mfn-form-control').val( $(this).find('.chart').attr('data-bar-color') );

        $(this).html(chart_html);

        var $el = $(this).children('.chart');

        var line_width = $el.data('line-width');
        var line_percent = $el.data('percent');


        $el.easyPieChart({
          animate: 1000,
          lineCap: 'circle',
          lineWidth: line_width,
          size: 140,
          scaleColor: false
        });


        if($(this).find('canvas').length > 1){ $(this).find('canvas').first().remove(); }

        $(this).addClass('mfn-initialized');

    });
}

// counter, Quick Fact

function mfnAnimateMath(){
    $content.find('.animate-math .number').waypoint({

      offset: '100%',
      triggerOnce: true,
      handler: function() {

        var el = $(this.element).length ? $(this.element) : $(this);
        var duration = Math.floor((Math.random() * 1000) + 1000);
        var to = el.attr('data-to');

        $({
          property: 0
        }).animate({
          property: to
        }, {
          duration: duration,
          easing: 'linear',
          step: function() {
            el.text(Math.floor(this.property));
          },
          complete: function() {
            el.text(this.property);
          }
        });

        if (typeof this.destroy !== 'undefined' && $.isFunction(this.destroy)) {
          this.destroy();
        }
      }

    });
}

/**
* FIX | Header | Sticky | Height
*/

function fixStickyHeaderH() {

var stickyH = 0;

// FIX | sticky top bar height

var topBar = $content.find('.sticky-header #Top_bar');

if (topBar.hasClass('is-sticky')) {
  stickyH = $content.find('.sticky-header #Top_bar').innerHeight() || 0;
} else {
  topBar.addClass('is-sticky');
  stickyH = $content.find('.sticky-header #Top_bar').innerHeight() || 0;
  topBar.removeClass('is-sticky');
}

// FIX | responsive

if ( $(window).width() < mobileInitW ) {

  if ( $(window).width() < 768 ) {

    // mobile
    if (!$content.find('body').hasClass('mobile-sticky')) {
      stickyH = 0;
    }

  } else {

    // tablet
    if (!$content.find('body').hasClass('tablet-sticky')) {
      stickyH = 0;
    }

  }

} else {

  // desktop

  // FIX | header creative
  if ($content.find('body').hasClass('header-creative')) {
    stickyH = 0;
  }

}

return stickyH;
}


/**
* Sticky | Wrap
*/

var stickyWrap = {

headerH: 0,

// stickyWrap.init()

init: function(){

  // calculate

  stickyWrap.headerH = fixStickyHeaderH();

  // prepare dom

  if( !$content.find('.mcb-wrap.sticky.sticky-'+screen+':not(.stickied)').length ) return;

  $content.find('.mcb-wrap.sticky.sticky-'+screen+':not(.stickied)').each(function(){

    var $wrap = $(this);

    if( screen == 'desktop' && $wrap.hasClass('one') ) return;
    if( screen == 'tablet' && $wrap.hasClass('tablet-one') ) return;
    if( screen == 'mobile' && $wrap.hasClass('mobile-one') ) return;

    var size = $wrap.attr('data-'+screen+'-col'),
      padding = {
        top : $wrap.css('padding-top'),
        right : $wrap.css('padding-right'),
        bottom : $wrap.css('padding-bottom'),
        left : $wrap.css('padding-left'),
      };

    padding = Object.values(padding).join(' ');

    $wrap.css('padding', padding);

    $wrap.addClass('stickied').removeClass(size.desktop+' '+size.mobile+' '+size.tablet).addClass('one')
    .wrap(function() {
      return '<div class="mcb-wrap wrap-sticky-spacer ' + size + '"><div class="mcb-wrap wrap-sticky-rails"></div></div>';
    });

  });

  // initial scroll

  stickyWrap.scroll();

},

// stickyWrap.scroll()

scroll: function(){

  if( ! $content.find('.mcb-wrap.sticky.sticky-'+screen).length ){
    return;
  }

  var windowY = $(window).scrollTop();

  $content.find('.mcb-wrap.sticky.sticky-'+screen).each(function(){

    var $wrap = $(this),
      $rails = $wrap.closest('.wrap-sticky-rails'),
      $section = $wrap.closest('.mcb-section-inner');

    if( screen == 'desktop' && $wrap.hasClass('one') ) return;
    if( screen == 'tablet' && $wrap.hasClass('tablet-one') ) return;
    if( screen == 'mobile' && $wrap.hasClass('mobile-one') ) return;

    var width = $rails.width() || 0,
      sectionT = $section.offset().top,
      sectionH = $section.innerHeight(),
      wrapH = $wrap.outerHeight();

    var start = windowY + stickyWrap.headerH - sectionT,
      limit = start + wrapH - sectionH;

    $wrap.css( 'width', width )
      .closest('.wrap-sticky-rails').css('min-height', sectionH + 'px');

    if( limit > 0 ){

      $wrap.removeClass('fixed').addClass('stick-bottom').css({
        'top' : ''
      });

    } else {

      $wrap.removeClass( 'stick-bottom' );

      if( start > 0 ){
        $wrap.addClass('fixed').css({
          'top' : stickyWrap.headerH + 'px'
        });
      } else {
        $wrap.removeClass('fixed').css({
          'top' : ''
        });
      }

    }

  });

},

reset: function(reinit = false) {
    if( $content.find('.wrap-sticky-spacer').length ){
        $content.find('.wrap-sticky-spacer').each(function() {
          $(this).find('.mcb-wrap.sticky').removeClass('stickied one fixed').addClass( $(this).find('.mcb-wrap.sticky').attr('data-'+screen+'-col') ).css({'top': '0', 'width': ''});
          $(this).replaceWith( $(this).find('.mcb-wrap.sticky') );
        });
        if( reinit ) stickyWrap.init();
  }
}

};

// hover box

function mfnHoverBox(){
    $content.find('.tooltip, .hover_box')
      .on('touchstart', function() {
        $(this).toggleClass('hover');
      })
      .on('touchend', function() {
        $(this).removeClass('hover');
      });
}

// feature list

function mfnFeatureList(){
    $content.find('.feature_list').each(function() {
    $(this).find('hr').remove();
      var col = $(this).attr('data-col') ? $(this).attr('data-col') : 4;
      $(this).find('li:nth-child(' + col + 'n):not(:last-child)').after('<hr />');
    });
}

// countdown
function mfnCountDown(){
    $content.find('.downcount').each(function() {
      var el = $(this);
      el.downCount({
        date: el.attr('data-date'),
        offset: el.attr('data-offset')
      });
    });
}

// Slider | Testimonials

function sliderTestimonials() {

var pager = function(el, i) {
  var img = $(el.$slides[i]).find('.single-photo-img').html();
  return '<a>' + img + '</a>';
};

$content.find('.testimonials_slider_ul').each(function() {

  var slider = $(this);

  slider.not('.slick-initialized').slick({
    cssEase: 'ease-out',
    dots: true,
    infinite: true,
    touchThreshold: 10,
    speed: 300,

    prevArrow: '<a class="button the-icon slider_prev" href="#"><span class="button_icon"><i class="icon-left-open-big"></i></span></a>',
    nextArrow: '<a class="button the-icon slider_next" href="#"><span class="button_icon"><i class="icon-right-open-big"></i></span></a>',

    adaptiveHeight: true,
    appendDots: slider.siblings('.slider_pager'),
    customPaging: pager,

    rtl: rtl ? true : false,
    autoplay: mfn.slider.testimonials ? true : false,
    autoplaySpeed: mfn.slider.testimonials ? mfn.slider.testimonials : 5000,

    slidesToShow: 1,
    slidesToScroll: 1
  });

});
}
// header promo bar | Slider

function promoBarSlider() {
    $content.find('.promo_bar_slider').not('.mfn-initialized').slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      speed: 300,
      autoplaySpeed: 4000,
      vertical: true,
      dots: false,
      arrows: false,
      infinite: true,
    });
}

// Slider | Shop

function mfnSliderShop() {

var pager = function(el, i) {
  return '<a>' + i + '</a>';
};

$content.find('.shop_slider_ul').each(function() {

  var slider = $(this);
  var slidesToShow = 4;

  var count = slider.closest('.shop_slider').data('order');
  if (slidesToShow > count) {
    slidesToShow = count;
    if (slidesToShow < 1) {
      slidesToShow = 1;
    }
  }

  slider.not('.slick-initialized').slick({
    cssEase: 'ease-out',
    dots: true,
    infinite: true,
    touchThreshold: 10,
    speed: 300,

    prevArrow: '<a class="button the-icon slider_prev" href="#"><span class="button_icon"><i class="icon-left-open-big"></i></span></a>',
    nextArrow: '<a class="button the-icon slider_next" href="#"><span class="button_icon"><i class="icon-right-open-big"></i></span></a>',
    appendArrows: slider.siblings('.blog_slider_header').children('.slider_navigation'),

    appendDots: slider.siblings('.slider_pager'),
    customPaging: pager,

    rtl: rtl ? true : false,
    autoplay: mfn.slider.shop ? true : false,
    autoplaySpeed: mfn.slider.shop ? mfn.slider.shop : 5000,

    slidesToShow: slickAutoResponsive(slider, slidesToShow),
    slidesToScroll: slickAutoResponsive(slider, slidesToShow)
  });

  // ON | debouncedresize

  $(window).on('debouncedresize', function() {
    slider.slick('slickSetOption', 'slidesToShow', slickAutoResponsive(slider, slidesToShow), false);
    slider.slick('slickSetOption', 'slidesToScroll', slickAutoResponsive(slider, slidesToShow), true);
  });

});
}

// Slider | Offer Thumb

function mfnSliderOfferThumb() {

var pager = function(el, i) {
    var img = $content.find( el.$slides[i] ).find('.thumbnail').html();
    return '<a>' + img + '</a>';
};

$content.find('.offer_thumb_ul:not(.slick-initialized)').each(function() {

  var slider = $(this);

  slider.slick({
    cssEase: 'ease-out',
    arrows: false,
    dots: true,
    infinite: true,
    touchThreshold: 10,
    speed: 300,

    adaptiveHeight: true,
    appendDots: slider.siblings('.slider_pagination'),
    customPaging: pager,

    rtl: rtl ? true : false,
    autoplay: mfn.slider.offer ? true : false,
    autoplaySpeed: mfn.slider.offer ? mfn.slider.offer : 5000,

    slidesToShow: 1,
    slidesToScroll: 1
  });

});
}

// Slider | Portfolio

function sliderPortfolio() {

$content.find('.portfolio_slider_ul').each(function() {

  var slider = $(this);
  var size = 380;
  var scroll = 5;

  if (slider.closest('.portfolio_slider').data('size')) {
    size = slider.closest('.portfolio_slider').data('size');
  }

  if (slider.closest('.portfolio_slider').data('size')) {
    scroll = slider.closest('.portfolio_slider').data('scroll');
  }

  slider.not('.slick-initialized').slick({
    cssEase: 'ease-out',
    dots: false,
    infinite: true,
    touchThreshold: 10,
    speed: 300,

    prevArrow: '<a class="slider_nav slider_prev themebg" href="#"><i class="icon-left-open-big"></i></a>',
    nextArrow: '<a class="slider_nav slider_next themebg" href="#"><i class="icon-right-open-big"></i></a>',

    rtl: rtl ? true : false,
    autoplay: mfn.slider.portfolio ? true : false,
    autoplaySpeed: mfn.slider.portfolio ? mfn.slider.portfolio : 5000,

    slidesToShow: slickAutoResponsive(slider, 5, size),
    slidesToScroll: slickAutoResponsive(slider, scroll, size)
  });

  // ON | debouncedresize
  $(window).on('debouncedresize', function() {
    slider.slick('slickSetOption', 'slidesToShow', slickAutoResponsive(slider, 5, size), false);
    slider.slick('slickSetOption', 'slidesToScroll', slickAutoResponsive(slider, scroll, size), true);
  });

});
}

// Slider | Offer

function mfnSliderOffer() {
$content.find('.offer_ul').each(function() {

  var slider = $(this);

  slider.not('.slick-initialized').slick({
    cssEase: 'ease-out',
    dots: false,
    infinite: true,
    touchThreshold: 10,
    speed: 300,

    prevArrow: '<a class="slider_prev" href="#"><span class="button_icon"><i class="icon-up-open-big"></i></span></a>',
    nextArrow: '<a class="slider_next" href="#"><span class="button_icon"><i class="icon-down-open-big"></i></span></a>',

    adaptiveHeight: true,
    //customPaging  : pager,

    rtl: rtl ? true : false,
    autoplay: mfn.slider.offer ? true : false,
    autoplaySpeed: mfn.slider.offer ? mfn.slider.offer : 5000,

    slidesToShow: 1,
    slidesToScroll: 1
  });

  // Pagination | Show (css)

  slider.siblings('.slider_pagination').addClass('show');

  // Pager | Set slide number after change

  slider.on('afterChange', function(event, slick, currentSlide, nextSlide) {
    slider.siblings('.slider_pagination').find('.current').text(currentSlide + 1);
  });

});
}

// Slider | Slider

function sliderSlider() {

var pager = function(el, i) {
  return '<a>' + i + '</a>';
};

$content.find('.content_slider_ul').each(function() {

  var slider = $(this);
  var count = 1;
  var centerMode = false;

  if (slider.closest('.content_slider').hasClass('carousel')) {
    count = slickAutoResponsive(slider);

    $(window).on('debouncedresize', function() {
      slider.slick('slickSetOption', 'slidesToShow', slickAutoResponsive(slider), false);
      slider.slick('slickSetOption', 'slidesToScroll', slickAutoResponsive(slider), true);
    });
  }

  if (slider.closest('.content_slider').hasClass('center')) {
    centerMode = true;
  }

  slider.not('.slick-initialized').slick({
    cssEase: 'cubic-bezier(.4,0,.2,1)',
    dots: true,
    infinite: true,
    touchThreshold: 10,
    speed: 300,

    centerMode: centerMode,
    centerPadding: '20%',

    prevArrow: '<a class="button the-icon slider_prev" href="#"><span class="button_icon"><i class="icon-left-open-big"></i></span></a>',
    nextArrow: '<a class="button the-icon slider_next" href="#"><span class="button_icon"><i class="icon-right-open-big"></i></span></a>',

    adaptiveHeight: true,
    appendDots: slider.siblings('.slider_pager'),
    customPaging: pager,

    rtl: rtl ? true : false,
    autoplay: mfn.slider.slider ? true : false,
    autoplaySpeed: mfn.slider.slider ? mfn.slider.slider : 5000,

    slidesToShow: count,
    slidesToScroll: count
  });

  // Lightbox | disable on dragstart

  var clickEvent = false;

  slider.on('dragstart', '.slick-slide a[rel="lightbox"]', function(event) {
    if (lightboxAttr) {
      var events = $._data(this,'events');
      if( events && Object.prototype.hasOwnProperty.call(events, 'click') ){
        clickEvent = events.click[0];
        $(this).addClass('off-click').off('click');
      }
    }
  });

  // Lightbox | enable after change

  slider.on('afterChange', function(event, slick, currentSlide, nextSlide) {
    if (lightboxAttr) {
      $content.find('a.off-click[rel="lightbox"]', slider).removeClass('off-click').on('click', clickEvent);
    }
  });

});
}

 // Portfolio - Isotope

function portfolioIsotope() {

    $content.find('.blog_wrapper .isotope:not( .masonry ), .portfolio_wrapper .isotope:not( .masonry-flat, .masonry-hover, .masonry-minimal').each(function() {

    var $el = $(this);

    if( !$el.hasClass('mfn-initialized') ){
        $el.addClass('mfn-initialized');

    $el.imagesLoaded( function() {
        $el.isotope({
          itemSelector: '.isotope-item',
          layoutMode: 'fitRows',
          isOriginLeft: rtl ? false : true
        });

            $('.preview-wrapper').css({'margin-left': $('.sidebar-wrapper').width()-1});
            setTimeout(function () { $('.preview-wrapper').css({'margin-left': $('.sidebar-wrapper').width() }); },500);
        });

    }


    });

}

// inline eeditor

function inlineEditor() {

    //rangy.init();

    if( $content.find('.mfn-inline-editor:not(.mfn-initialized)').length ){
        var iframe = $('iframe#mfn-vb-ifr').get(0);

        var ToolsSwitchMore = MediumEditor.extensions.button.extend({
            name: 'switchMore',
            action: 'switchMore',
            aria: 'More options',
            contentDefault: '&#8286;',
            contentFA: '<i class="fas fa-ellipsis-h"></i>',
            hasForm: false,
            handleClick: function( event ) {
                event.preventDefault();
                event.stopPropagation();
                $("iframe#mfn-vb-ifr").contents().find('body').toggleClass('mfn-inline-editor-toolbar-more');
                return false;
            },
        });

        var ToolsMfnRemoveFormat = MediumEditor.extensions.button.extend({
            name: 'mfnRemoveFormat',
            action: 'mfnRemoveFormat',
            aria: 'Remove format',
            contentDefault: '&#8286;',
            contentFA: '<i class="fas fa-eraser"></i>',
            hasForm: false,
            init: function() {
                MediumEditor.extensions.form.prototype.init.apply( this, arguments );
            },

            handleClick: function( event ) {
                var nodes          = MediumEditor.selection.getSelectedElements( this.document ),
                    selectionRange = MediumEditor.selection.getSelectionRange( this.document ),
                    parentEl       = MediumEditor.selection.getSelectedParentElement( selectionRange ),
                    element = MediumEditor.selection.getSelectionElement( this.document );

                event.preventDefault();
                event.stopPropagation();

                if ( ! nodes.length && parentEl ) {
                    nodes = [ parentEl ];
                }

                nodes.forEach(function( el ) {
                    $(el).removeAttr( 'data-font-family' );
                    $(el).removeAttr( 'data-line-height' );
                    $(el).removeAttr( 'data-letter-spacing' );
                    $(el).removeAttr( 'data-font-size' );
                    $(el).removeAttr( 'data-font-weight' );
                    $(el).removeAttr( 'style' );

                    if( $(el).find('.highlight-word').length ){
                        $(el).replaceWith($(el).find('.highlight-word').text());
                    }

                    if(el.tagName.toLowerCase() == 'span'){

                        if( $(el).closest('.highlight').length ){
                            $(el).closest('.highlight').replaceWith( $(el).text() );
                        }else{
                            $(el).replaceWith( $(el).text() );
                        }
                    }
                });

                this.execAction( 'removeFormat', { skipCheck: true } );
                this.triggerUpdate( element );

                return false;

            },

            triggerUpdate: function( element ) {
                this.base.trigger( 'editableInput', {}, element );
            },
        });

        var ToolsColorPicker = MediumEditor.extensions.form.extend({
            name: 'colorPicker',
            action: 'colorPicker',
            aria: 'colorPicker',
            contentDefault: '&#9775;',
            contentFA: '<i class="fas fa-palette"></i><span></span>',
            hasForm: true,
            override: false,
            parentCid: false,

            init: function() {
                MediumEditor.extensions.form.prototype.init.apply( this, arguments );
                this.classApplier = rangy.createClassApplier( 'mfn-inline-txt-editing', {
                    elementTagName: 'span',
                    tagNames: [ 'span', 'b', 'strong', 'a', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6' ],
                    normalize: true
                } );

            },

            getForm: function() {
                if ( ! this.form ) {
                    this.form = this.createForm();
                }
                this.on( this.form, 'click', this.handleFormClick.bind( this ) );
                return this.form;
            },

            checkState: function( node ) {
                var nodes = MediumEditor.selection.getSelectedElements( this.document ),
                    color = this.getExistingValue( nodes );

                if ( 'undefined' !== typeof color ) {
                    this.button.querySelector( 'span' ).style.backgroundColor = color;
                }
            },

            createForm: function() {
                var self   = this,
                    doc    = this.document,
                    form   = doc.createElement( 'div' ),
                    input  = doc.createElement( 'input' ),
                    close  = doc.createElement( 'a' );

                this.on( form, 'click', this.handleFormClick.bind( this ) );
                form.className = 'medium-editor-toolbar-form mfn-medium-editor-color-picker';
                form.id        = 'mfn-medium-editor-cp-' + this.getEditorId();

                input.className = 'medium-editor-toolbar-input mfn-medium-editor-color-picker-input';
                input.setAttribute( 'type', 'text' );
                input.setAttribute( 'data-alpha', true );
                form.appendChild( input );

                close.className = 'medium-editor-toolbar-close';
                close.innerHTML = '<i class="fas fa-check"></i>';
                form.appendChild( close );

                this.on( close, 'click', this.handleSaveClick.bind( this ), true );

                return form;
            },

            isDisplayed: function() {
                return this.getForm().classList.contains( 'mfn-visible' );
            },

            handleClick: function( event ) {
                var nodes,
                    txt;

                event.preventDefault();
                event.stopPropagation();

                if ( ! this.isDisplayed() ) {
                    nodes = MediumEditor.selection.getSelectedElements( this.document );
                    txt  = this.getExistingValue( nodes );
                    txt  = 'undefined' !== typeof txt ? txt : '';

                    this.showForm( txt );
                }

                return false;
            },

            getInput: function() {
                return this.getForm().querySelector( 'input.medium-editor-toolbar-input' );
            },

            showForm: function( fontColor ) {
                var self  = this,
                    input = this.getInput(),
                    form  = this.getForm();

                this.base.saveSelection();
                form.classList.add( 'mfn-visible' );

                $content.find('#medium-editor-toolbar-'+this.getEditorId()+' .medium-editor-toolbar-actions').hide();
                //medium-editor-toolbar-2

                input.value = fontColor || '';

                $( input ).wpColorPicker( {
                    palettes: true,
                    mode : 'hex',
                    hide: true,
                    change: function( event, ui ) {
                        if ( 'none' !== $( input ).closest( '.mfn-medium-editor-color-picker' ).find( '.iris-picker' ).css( 'display' ) ) {
                            self.handleColorChange( ui.color.toString() );
                        }
                    },
                    clear: function( event, ui ) {
                        self.clearFontColor();
                    }
                } );

                $( input ).iris( 'color', input.value );
                $( input ).iris( 'show' );

                this.setToolbarPosition();
            },

            getExistingValue: function( nodes ) {
                var nodeIndex,
                    color,
                    el;

                if ( ! nodes.length ) {
                    nodes = this.base.elements;
                }

                for ( nodeIndex = 0; nodeIndex < nodes.length; nodeIndex++ ) {
                    el    = nodes[ nodeIndex ];
                    color = $( el ).css( 'color' );
                }

                return color;
            },

            handleFormClick: function( event ) {
                event.stopPropagation();
            },

            handleSaveClick: function( event ) {
                event.preventDefault();
                this.hideForm();
            },

            hideForm: function() {
                var self         = this,
                    form         = this.getForm();

                $(form).removeClass( 'mfn-visible' );
                $content.find('#medium-editor-toolbar-'+this.getEditorId()+' .medium-editor-toolbar-actions').show();

                this.getInput().value = '';

                this.base.restoreSelection();
                self.setToolbarPosition();

            },

            clearFontColor: function() {
                this.base.restoreSelection();

                MediumEditor.selection.getSelectedElements( this.document ).forEach( function( el ) {
                    if ( 'undefined' !== typeof el.style && 'undefined' !== typeof el.style.color ) {
                        el.style.color = '';
                    }
                } );

                this.base.trigger( 'editableInput', {}, MediumEditor.selection.getSelectionElement( this.document ) );
            },

            handleColorChange: function( color ) {

                var iframeWin = rangy.dom.getIframeWindow( iframe ),
                        element,
                        self = this,
                        color = 'undefined' === color || 'undefined' === typeof color ? this.getInput().value : color;

                    this.base.restoreSelection();

                    element = MediumEditor.selection.getSelectionElement( this.document );

                    if ( ! element ) {
                        return;
                    }

                    this.classApplier.applyToSelection( iframeWin );

                    element.querySelectorAll( '.mfn-inline-txt-editing' ).forEach( function( el ) {
                        if ( el.classList.contains( 'mfn-inline-txt-editing' ) ) {
                            $( el ).css( { color: color } );
                            self.button.classList = 'medium-editor-button-active';
                            el.classList.remove( 'mfn-inline-txt-editing' );

                            if ( 0 === el.classList.length ) {
                                el.removeAttribute( 'class' );
                            }
                        }
                    } );

                    this.triggerUpdate( element );

            },

            triggerUpdate: function( element ) {
                this.base.trigger( 'editableInput', {}, element );
            },
        });

        var ToolsTypography = MediumEditor.extensions.form.extend({
            name: 'typography',
            action: 'typography',
            aria: 'typography',
            contentDefault: '&#9775;',
            contentFA: '<i class="fas fa-font"></i>',
            hasForm: true,
            override: false,
            parentCid: false,

            init: function() {
                MediumEditor.extensions.form.prototype.init.apply( this, arguments );
                this.classApplier = rangy.createClassApplier( 'mfn-inline-txt-editing', {
                    elementTagName: 'span',
                    tagNames: [ 'span', 'b', 'strong', 'a', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6' ],
                    normalize: true
                } );

            },

            getForm: function() {
                if ( ! this.form ) {
                    this.form = this.createForm();
                }
                this.on( this.form, 'click', this.handleFormClick.bind( this ) );
                return this.form;
            },

            checkState: function( node ) {
                var nodes = MediumEditor.selection.getSelectedElements( this.document ),
                    typo = this.getExistingValue( nodes, true );

                if ( typo ) {
                    this.button.classList = 'medium-editor-button-active';
                }
            },

            createForm: function() {
                var self   = this,
                    doc    = this.document,
                    close  = doc.createElement( 'a' ),
                    form   = doc.createElement( 'div' );

                this.on( form, 'click', this.handleFormClick.bind( this ) );
                form.className = 'medium-editor-toolbar-form mfn-medium-editor-typography';
                form.id        = 'mfn-medium-editor-typo-' + this.getEditorId();

                $('<div class="mfn-medium-editor-form-row"><label>Font size</label><input data-style="font-size" class="medium-editor-toolbar-input mfn-medium-editor-font-size-input" /></div>').appendTo(form);
                $('<div class="mfn-medium-editor-form-row"><label>Line height</label><input data-style="line-height" class="medium-editor-toolbar-input mfn-medium-editor-line-height-input" /></div>').appendTo(form);
                $('<div class="mfn-medium-editor-form-row"><label>Letter spacing</label><input data-style="letter-spacing" class="medium-editor-toolbar-input mfn-medium-editor-letter-spacing-input" /></div>').appendTo(form);
                $('<div class="mfn-medium-editor-form-row"><label>Font family</label><select data-style="font-family" class="medium-editor-toolbar-input mfn-medium-editor-font-family-input"><optgroup label="System"><option value="" selected>Default</option><option value="Arial">Arial</option><option value="Georgia">Georgia</option><option value="Tahoma">Tahoma</option><option value="Times">Times</option><option value="Trebuchet">Trebuchet</option><option value="Verdana">Verdana</option></optgroup></select></div>').appendTo(form);
                $('<div class="mfn-medium-editor-form-row"><label>Font weight</label><select data-style="font-weight" class="medium-editor-toolbar-input mfn-medium-editor-font-weight-input"><option value="" selected>Default</option><option value="normal">Normal</option><option value="bold">Bold</option><option value="100">100</option><option value="200">200</option><option value="300">300</option><option value="400">400</option><option value="500">500</option><option value="600">600</option><option value="700">700</option><option value="800">800</option><option value="900">900</option></select></div>').appendTo(form);

                close.className = 'medium-editor-toolbar-close';
                close.innerHTML = '<i class="fas fa-check"></i>';
                form.appendChild( close );

                this.on( close, 'click', this.handleSaveClick.bind( this ), true );

                return form;
            },

            isDisplayed: function() {
                return this.getForm().classList.contains( 'mfn-visible' );
            },

            handleClick: function( event ) {
                var nodes,
                    txt;

                event.preventDefault();
                event.stopPropagation();

                if ( ! this.isDisplayed() ) {
                    nodes = MediumEditor.selection.getSelectedElements( this.document );
                    txt  = this.getExistingValue( nodes );
                    txt  = 'undefined' !== typeof txt ? txt : '';

                    this.showForm( txt );

                }else{
                    this.hideForm();
                }

                return false;
            },

            getInput: function() {
                var inputs = {
                    fontsize: this.getForm().querySelector( 'input.mfn-medium-editor-font-size-input' ),
                    lineheight: this.getForm().querySelector( 'input.mfn-medium-editor-line-height-input' ),
                    letterspacing: this.getForm().querySelector( 'input.mfn-medium-editor-letter-spacing-input' ),
                    fontfamily: this.getForm().querySelector( 'select.mfn-medium-editor-font-family-input' ),
                    fontweight: this.getForm().querySelector( 'select.mfn-medium-editor-font-weight-input' ),
                };
                return inputs;
            },

            showForm: function( typo ) {
                var self  = this,
                    input = this.getInput(),
                    form  = this.getForm();

                this.base.saveSelection();
                form.classList.add( 'mfn-visible' );

                $content.find('#medium-editor-toolbar-'+this.getEditorId()+' .medium-editor-toolbar-actions').hide();

                form.classList.remove( 'hidden' );

                // google fonts
                if( !$(input.fontfamily).find('optgroup[label="Google"]').length ){
                    var g_fonts = '';
                    mfnvbvars.mfn_google_fonts.map((value) => {
                      g_fonts += '<option value="'+value+'">'+value+'</option>';
                    });
                    $(input.fontfamily).append( $('<optgroup label="Google">'+g_fonts+'</optgroup>') );
                }

                $( input.fontsize ).val( typo.fontsize || '' ).on('change', function() {
                    self.handleTypoChange( $(this).attr('data-style'), $(this).val() );
                });
                $( input.lineheight ).val( typo.lineheight || '' ).on('change', function() {
                    self.handleTypoChange( $(this).attr('data-style'), $(this).val() );
                });
                $( input.letterspacing ).val( typo.letterspacing || '' ).on('change', function() {
                    self.handleTypoChange( $(this).attr('data-style'), $(this).val() );
                });
                $( input.fontfamily ).val( typo.fontfamily.replaceAll('"', '') || '' )
                    .on('change', function() {
                        var style_attr = $(this).attr('data-style');
                        var val = $(this).val().replace('&quot;', '');
                        var fonts_group = $(this).find(':selected').closest('optgroup').attr('label');

                        if( fonts_group == 'Google' ){
                            WebFont.load({
                                google: {
                                  families: [val]
                                },
                                context: window.frames[0].frameElement.contentWindow,
                                fontactive: function(familyName,fvd){
                                    self.handleTypoChange( style_attr, familyName );
                                    return;
                                },
                            });
                        }else{
                            self.handleTypoChange( style_attr, val, true );
                        }

                    });
                $( input.fontweight ).val( typo.fontweight || '' ).on('change', function() {
                    self.handleTypoChange( $(this).attr('data-style'), $(this).val() );
                });

                this.setToolbarPosition();

            },

            getExistingValue: function( nodes, active = false ) {
                var nodeIndex,
                    typo,
                    el;

                if ( ! nodes.length ) {
                    nodes = this.base.elements;
                }

                for ( nodeIndex = 0; nodeIndex < nodes.length; nodeIndex++ ) {
                    el    = nodes[ nodeIndex ];

                    if( active ){
                        typo = false;
                        if (typeof $( el ).attr('data-font-size') !== 'undefined' && $( el ).attr('data-font-size') !== false) typo = true;
                        if (typeof $( el ).attr('data-line-height') !== 'undefined' && $( el ).attr('data-line-height') !== false) typo = true;
                        if (typeof $( el ).attr('data-letter-spacing') !== 'undefined' && $( el ).attr('data-letter-spacing') !== false) typo = true;
                        if (typeof $( el ).attr('data-font-family') !== 'undefined' && $( el ).attr('data-font-family') !== false) typo = true;
                        if (typeof $( el ).attr('data-font-weight') !== 'undefined' && $( el ).attr('data-font-weight') !== false) typo = true;
                        return typo;
                    }

                    typo = {
                        fontsize: $( el ).css( 'font-size' ),
                        lineheight: $( el ).css( 'line-height' ),
                        letterspacing: $( el ).css( 'letter-spacing' ),
                        fontfamily: $( el ).css( 'font-family' ),
                        fontweight: $( el ).css( 'font-weight' ),
                    };
                }

                return typo;
            },

            handleFormClick: function( event ) {
                event.stopPropagation();
            },

            handleSaveClick: function( event ) {
                event.preventDefault();
                this.hideForm();
            },

            hideForm: function() {
                var self         = this,
                    form         = this.getForm();

                $(form).removeClass( 'mfn-visible' );

                $content.find('#medium-editor-toolbar-'+this.getEditorId()+' .medium-editor-toolbar-actions').show();

                this.base.restoreSelection();
                self.setToolbarPosition();
            },

            handleTypoChange: function( key, value, data = false ) {
                var iframeWin = rangy.dom.getIframeWindow( iframe ),
                        element,
                        self = this;

                    this.base.restoreSelection();

                    element = MediumEditor.selection.getSelectionElement( this.document );

                    if ( ! element ) {
                        return;
                    }

                    this.classApplier.applyToSelection( iframeWin );

                    element.querySelectorAll( '.mfn-inline-txt-editing' ).forEach( function( el ) {
                        if ( el.classList.contains( 'mfn-inline-txt-editing' ) ) {
                            if( value.length ){
                                $( el ).css( key, value )
                                if( !data ) {
                                    $( el ).attr('data-'+key, $( el ).css( key ));
                                }else{
                                    $( el ).removeAttr('data-'+key);
                                }
                                self.button.classList = 'medium-editor-button-active';
                            }else{
                                $( el ).removeAttr('data-'+key);
                            }

                            el.classList.remove( 'mfn-inline-txt-editing' );

                            if ( 0 === el.classList.length ) {
                                el.removeAttribute( 'class' );
                            }
                        }
                    } );

                    this.triggerUpdate( element );

            },

            triggerUpdate: function( element ) {
                this.base.trigger( 'editableInput', {}, element );
            },

        });

        var ToolsHighlighter = MediumEditor.extensions.form.extend({
            name: 'mfnHghter',
            action: 'mfnHghter',
            aria: 'mfnHghter',
            contentDefault: '&#9775;',
            contentFA: '<i class="fas fa-highlighter"></i><span></span>',
            hasForm: true,
            override: false,
            parentCid: false,

            init: function() {
                MediumEditor.extensions.form.prototype.init.apply( this, arguments );
                this.classApplier = rangy.createClassApplier( 'mfn-inline-txt-editing', {
                    elementTagName: 'span',
                    tagNames: [ 'span', 'b', 'strong', 'a', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6' ],
                    normalize: true
                } );

            },

            getForm: function() {
                if ( ! this.form ) {
                    this.form = this.createForm();
                }
                this.on( this.form, 'click', this.handleFormClick.bind( this ) );
                return this.form;
            },

            checkState: function( node ) {
                var nodes = MediumEditor.selection.getSelectedElements( this.document ),
                    mfnhighlighter = this.getExistingValue( nodes, true );

                if ( mfnhighlighter.check ) {
                    this.button.classList = 'medium-editor-button-active';
                }
            },

            createForm: function() {
                var self   = this,
                    doc    = this.document,
                    close  = doc.createElement( 'a' ),
                    form   = doc.createElement( 'div' );

                this.on( form, 'click', this.handleFormClick.bind( this ) );
                form.className = 'medium-editor-toolbar-form mfn-medium-editor-mfnhighlighter';
                form.id        = 'mfn-medium-editor-mfnhighlighter-' + this.getEditorId();

                $('<div class="mfn-medium-editor-form-row"><label>Color</label><input type="text" data-alpha="true" class="medium-editor-toolbar-input mfn-medium-editor-mfnhighlighter-color-input" /></div>').appendTo(form);
                $('<div class="mfn-medium-editor-form-row"><label>Background</label><input type="text" data-alpha="true" class="medium-editor-toolbar-input mfn-medium-editor-mfnhighlighter-background-input" /></div>').appendTo(form);
                $('<div class="mfn-medium-editor-form-row"><label>Style</label><select class="medium-editor-toolbar-input mfn-medium-editor-mfnhighlighter-style-input"><option value="" selected>Default</option><option value="underline">Underline</option></select></div>').appendTo(form);

                close.className = 'medium-editor-toolbar-close';
                close.innerHTML = '<i class="fas fa-check"></i>';
                form.appendChild( close );

                this.on( close, 'click', this.handleSaveClick.bind( this ), true );

                return form;
            },

            isDisplayed: function() {
                return this.getForm().classList.contains( 'mfn-visible' );
            },

            handleClick: function( event ) {
                var nodes,
                    txt;

                event.preventDefault();
                event.stopPropagation();

                if ( ! this.isDisplayed() ) {
                    nodes = MediumEditor.selection.getSelectedElements( this.document );
                    txt  = this.getExistingValue( nodes );
                    txt  = 'undefined' !== typeof txt ? txt : '';

                    this.showForm( txt );
                }else{
                    this.hideForm();
                }

                return false;
            },

            getInput: function() {
                var inputs = {
                    color: this.getForm().querySelector( 'input.mfn-medium-editor-mfnhighlighter-color-input' ),
                    background: this.getForm().querySelector( 'input.mfn-medium-editor-mfnhighlighter-background-input' ),
                    style: this.getForm().querySelector( 'select.mfn-medium-editor-mfnhighlighter-style-input' ),
                };
                return inputs;
            },

            showForm: function( mfnhighlighter ) {
                var self  = this,
                    input = this.getInput(),
                    form  = this.getForm();

                this.base.saveSelection();

                $content.find('#medium-editor-toolbar-'+this.getEditorId()+' .medium-editor-toolbar-actions').hide();
                form.classList.add( 'mfn-visible' );

                var color_val = mfnhighlighter.check ? mfnhighlighter.color : '';
                var bg_val = mfnhighlighter.check ? mfnhighlighter.background : '';
                var style_val = mfnhighlighter.check ? mfnhighlighter.style : '';

                $( input.color ).wpColorPicker( {
                    palettes: false,
                    mode : 'hsl',
                    change: function( event, ui ) {
                        self.handleHighlighterChange( ui.color.toString(), input.background.value, input.style.value );
                    },
                } );

                $( input.background ).wpColorPicker( {
                    palettes: false,
                    mode : 'hsl',
                    change: function( event, ui ) {
                        self.handleHighlighterChange( input.color.value, ui.color.toString(), input.style.value );
                    },
                } );

                this.setToolbarPosition();

                $( input.color ).iris( 'color', color_val );
                $( input.background ).iris( 'color', bg_val );

                $( input.color ).iris( 'hide' );
                $( input.background ).iris( 'hide' );

                $( input.color ).on('click', function() {
                    $( input.background ).iris( 'hide' );
                    $( input.color ).iris( 'show' );
                    return false;
                });

                $( input.background ).on('click', function() {
                    $( input.color ).iris( 'hide' );
                    $( input.background ).iris( 'show' );
                    return false;
                });

                $( input.style ).val(style_val).on('change', function() {
                    self.handleHighlighterChange( input.color.value, input.background.value, $(this).val() );
                });

            },

            getExistingValue: function( nodes, active = false ) {
                var nodeIndex,
                    mfnhighlighter,
                    el, check;

                if ( ! nodes.length ) {
                    nodes = this.base.elements;
                }

                check = false;

                for ( nodeIndex = 0; nodeIndex < nodes.length; nodeIndex++ ) {
                    el    = nodes[ nodeIndex ];

                    mfnhighlighter = {
                        check:      $( el ).hasClass('highlight') || $( el ).parent().hasClass('highlight') || $( el ).children().hasClass('highlight') ? true : false,
                        color:      $( el ).css( 'color' ),
                        background: $( el ).css( 'background-color' ),
                        style:      $( el ).hasClass('highlight-underline') ? 'highlight-underline' : ''
                    };

                }

                return mfnhighlighter;
            },

            handleFormClick: function( event ) {
                event.stopPropagation();
            },

            handleSaveClick: function( event ) {
                event.preventDefault();
                this.hideForm();
            },

            hideForm: function() {
                var self         = this,
                    form         = this.getForm();

                $content.find('#medium-editor-toolbar-'+this.getEditorId()+' .medium-editor-toolbar-actions').show();
                form.classList.remove( 'mfn-visible' );

                //this.base.restoreSelection();
                this.setToolbarPosition();
            },

            handleHighlighterChange: function( color, bg, style ) {
                var iframeWin = rangy.dom.getIframeWindow( iframe ),
                        self = this,
                        element;

                    this.base.restoreSelection();

                    element = MediumEditor.selection.getSelectionElement( this.document );

                    if ( ! element ) {
                        return;
                    }

                    this.classApplier.applyToSelection( iframeWin );

                    var txt_content = false;


                    element.querySelectorAll( '.mfn-inline-txt-editing' ).forEach( function( el ) {
                        if ( el.classList.contains( 'mfn-inline-txt-editing' ) ) {

                            if( !txt_content ){
                                // get clear txt
                                if( $(el).find('.highlight-word').length ){
                                    txt_content = $(el).find('.highlight-word').text();
                                }else{
                                    txt_content = $(el).text();
                                }

                                var $wrapper;

                                if( $(el).closest('.highlight').length ){
                                    $wrapper = $(el).closest('.highlight');
                                }else{
                                    $wrapper = $(el);
                                }

                                $wrapper.empty();
                                $wrapper.text(txt_content).removeClass('highlight highlight-underline');

                                if( style != '' ){
                                    $wrapper.addClass('highlight highlight-underline').css('color', color).css('background-color', bg).html('<span class="highlight-word">'+txt_content+'<span class="highlight-border" style="background-color:'+bg+'; color:'+color+';"></span></span>');
                                }else{
                                    $wrapper.addClass('highlight').css('color', color).css('background-color', bg).text(txt_content);
                                }

                                self.button.classList = 'medium-editor-button-active';
                            }

                            el.classList.remove( 'mfn-inline-txt-editing' );

                            if ( 0 === el.classList.length ) {
                                el.removeAttribute( 'class' );
                            }
                        }
                    } );

                    this.triggerUpdate( element );

            },

            triggerUpdate: function( element ) {
                this.base.trigger( 'editableInput', {}, element );
            },

        });

        $content.find('.mfn-inline-editor:not(.mfn-initialized)').each(function(i) {
            $iframeCont = $(this);

            $iframeCont.addClass('mfn-initialized').attr('data-mfnindex', inlineIndex);

            inlineEditors[inlineIndex] = new MediumEditor( $(this).get(0), {
                buttonLabels: 'fontawesome',
                contentWindow: iframe.contentWindow,
                ownerDocument: iframe.contentWindow.document,
                elementsContainer: iframe.contentWindow.document.body,
                anchorPreview: false,
                previewValueSelector: 'a',
                anchor: {
                    customClassOption: null,
                    customClassOptionText: 'Button',
                    linkValidation: false,
                    placeholderText: 'Paste or type a link',
                    targetCheckbox: true,
                    targetCheckboxText: 'Open in new window'
                },
                extensions: {
                    switchMore: new ToolsSwitchMore(),
                    colorPicker: new ToolsColorPicker(),
                    //mfnHghter: new ToolsHighlighter(),
                    typography: new ToolsTypography(),
                    mfnRemoveFormat: new ToolsMfnRemoveFormat(),
                },
                toolbar: {
                    buttons: ['typography', 'bold', 'italic', 'underline', 'strikethrough', 'colorPicker', 'anchor', 'quote', 'subscript', 'superscript', 'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull', 'orderedlist', 'unorderedlist', 'indent', 'outdent', 'mfnRemoveFormat',  'switchMore'],
                },
                paste: {
                    forcePlainText: false,
                    cleanPastedHTML: false
                }
            });

            inlineIndex++;
        })
    }
}


// Blog & Portfolio - Masonry

function blogPortfolioMasonry() {

    $content.find('.isotope.masonry, .isotope.masonry-hover, .isotope.masonry-minimal').each(function() {

    var $el = $(this);

    if( !$el.hasClass('mfn-initialized') ){
        $el.addClass('mfn-initialized');
    $el.imagesLoaded( function() {

    $el.isotope({
      itemSelector: '.isotope-item',
      layoutMode: 'masonry',
      isOriginLeft: rtl ? false : true
    });

            $('.preview-wrapper').css({'margin-left': $('.sidebar-wrapper').width()-1});
            setTimeout(function () { $('.preview-wrapper').css({'margin-left': $('.sidebar-wrapper').width() }); },500);
        });

}

});

}

// Append spans to additional info table

function spanToAdditionalInfo(){
    $content.find('.woocommerce-product-attributes td, .woocommerce-product-attributes th').each(function() {
      $(this).html('<span>'+$(this).html()+'</span>');
    });
}



// gallery

function mfnGalleryInit(){

    $content.find('.column_image_gallery').each(function() {

    var $el = $(this);

    var $grid = $el.find('.gallery');

    if(!$grid.hasClass('mfn-initialized')){

    var id = $grid.attr('id');

      $('> br', $grid).remove();

      $('.gallery-icon > a', $grid)
        .wrap('<div class="image_frame scale-with-grid"><div class="image_wrapper"></div></div>')
        .prepend('<div class="mask"></div>')
        .children('img')
        .css('height', 'auto')
        .css('width', '100%');

      // lightbox | link to media file

      if ($grid.hasClass('file')) {
        $('.gallery-icon a', $grid)
          .attr('rel', 'prettyphoto[' + id + ']')
          .attr('data-elementor-lightbox-slideshow', id); // FIX: elementor lightbox gallery
      }

      // isotope for masonry layout

      if ($grid.hasClass('masonry')) {

        $grid.imagesLoaded( function() {
            $grid.isotope({
              itemSelector: '.gallery-item',
              layoutMode: 'masonry',
              isOriginLeft: rtl ? false : true
            });
            $('.preview-wrapper').css({'margin-left': $('.sidebar-wrapper').width()-1});
            setTimeout(function () { $('.preview-wrapper').css({'margin-left': $('.sidebar-wrapper').width() }); },500);
        });



        $grid.addClass('mfn-initialized');
      }


    }

});
}


var scrollTicker, lightboxAttr, sidebar,
    rtl = $('body').hasClass('rtl'),
    simple = $('body').hasClass('style-simple'),
    topBarTop = '61px',
    headerH = 0,
    mobileInitW = (mfn.mobileInit) ? mfn.mobileInit : 1240;

    // Slick Slider | Auto responsive

    function slickAutoResponsive(slider, max, size, round = false) {

      if (!max){
        max = 5;
      }
      if (!size){
        size = 380;
      }

      var width = slider.width() || 0;
      var count;

      if ( round ) {
        count = Math.floor(width / size);
      } else {
        count = Math.ceil(width / size);
      }

      if (count < 1) count = 1;
      if (count > max) count = max;

      return count;
    }

// Slider | Blog

  function mfnSliderBlog() {

    var pager = function(el, i) {
      return '<a>' + i + '</a>';
    };

    $content.find('.blog_slider .blog_slider_ul:not(.slick-initialized)').each(function() {

    var slider = $(this);
    var slidesToShow = 4;

    var count = slider.closest('.blog_slider').attr('count');
    var singlePostMode = slider.closest('.blog_slider').hasClass('single_post_mode');

    if (slidesToShow > count) {
      slidesToShow = count;
      if (slidesToShow < 1) {
        slidesToShow = 1;
      }
    }

    if (singlePostMode) {
      slidesToShow = 1;
    }

    slider.slick({
      cssEase: 'ease-out',
      dots: true,
      infinite: true,
      touchThreshold: 10,
      speed: 300,

      prevArrow: '<a class="button the-icon slider_prev" href="#"><span class="button_icon"><i class="icon-left-open-big"></i></span></a>',
      nextArrow: '<a class="button the-icon slider_next" href="#"><span class="button_icon"><i class="icon-right-open-big"></i></span></a>',
      appendArrows: slider.siblings('.blog_slider_header').children('.slider_navigation'),

      appendDots: slider.siblings('.slider_pager'),
      customPaging: pager,

      rtl: rtl ? true : false,
      autoplay: mfn.slider.blog ? true : false,
      autoplaySpeed: mfn.slider.blog ? mfn.slider.blog : 5000,

      slidesToShow: slickAutoResponsive(slider, slidesToShow),
      slidesToScroll: slickAutoResponsive(slider, slidesToShow)
    });


  });


}

  // Slider | Clients

function mfnSliderClients() {
$content.find('.clients_slider_ul').each(function() {

  var slider = $(this);

  var clientsPerSlide = slider.closest('.clients_slider').attr('data-client-per-slide') ? parseInt(slider.closest('.clients_slider').attr('data-client-per-slide')) : 4;
  var size = 400;

  var calc = () => slickAutoResponsive(slider, clientsPerSlide, size - (clientsPerSlide * 40), true);

  slider.not('.slick-initialized').slick({
    cssEase: 'ease-out',
    dots: false,
    infinite: true,
    touchThreshold: 10,
    speed: 300,

    prevArrow: '<a class="button the-icon slider_prev" href="#"><span class="button_icon"><i class="icon-left-open-big"></i></span></a>',
    nextArrow: '<a class="button the-icon slider_next" href="#"><span class="button_icon"><i class="icon-right-open-big"></i></span></a>',
    appendArrows: slider.siblings('.blog_slider_header').children('.slider_navigation'),

    rtl: rtl ? true : false,
    autoplay: mfn.slider.clients ? true : false,
    autoplaySpeed: mfn.slider.clients ? mfn.slider.clients : 5000,

    slidesToShow: calc(),
    slidesToScroll: calc()
  });

  // ON | debouncedresize

  $(window).on('debouncedresize', function() {
    slider.slick('slickSetOption', 'slidesToShow', calc(), false);
    slider.slick('slickSetOption', 'slidesToScroll', calc(), true);
  });

});
}


var templatesPostType = {

    count: $('.mfn-df-row').not('.clone').length > 0 ? $('.mfn-df-row').not('.clone').length : 0,

    beforeUpdate: function() {
    $('.woo-display-conditions').on('click', function(e) {
      e.preventDefault();
      // resetSaveButton();
      $('.modal-display-conditions').addClass('show');
    });

    $('.df-add-row').on('click', function(e) {
      e.preventDefault();
      var $cloned = $('.mfn-df-row.clone').clone();
      $cloned.find('.df-input').each(function() {
        $(this).attr('name', $(this).attr('data-name').replace("mfn_template_conditions[0]", "mfn_template_conditions["+templatesPostType.count+"]"));
        $(this).removeAttr('data-name');
      })
      $cloned.removeClass('clone').appendTo( $('.mfn-dynamic-form') );
      templatesPostType.count++;
    });

    $('.modal-display-conditions').on('click', '.df-remove', function(e) {
      e.preventDefault();
      $(this).closest('.mfn-df-row').remove();
    });

    $('.modal-display-conditions').on('change', '.df-input-rule', function() {
      if( $(this).val() == 'exclude' ){
        $(this).addClass('minus');
      }else{
        $(this).removeClass('minus');
      }
    });

    $('.modal-display-conditions').on('change', '.df-input-var', function() {
      $(this).siblings('.df-input-opt').removeClass('show');
      if( $(this).val() != 'shop' && $(this).siblings('.df-input-'+$(this).val()).length ){
        $(this).siblings('.df-input-'+$(this).val()).addClass('show');
      }
    });

    templatesPostType.closeModal();
    },

    closeModal: function() {
        // close
        $('.modal-display-conditions .btn-modal-close').on('click', function(e) {
          e.preventDefault();
          $('.modal-display-conditions').removeClass('show');
        });
    },
};


if($('.modal-display-conditions').length){
    templatesPostType.beforeUpdate();
}

/**
 *
 * NEW ACM start
 *
 * */

$editpanel.on('click', '.panel-edit-item .row-header.toggled_header', function(e){
    e.preventDefault();
    var $header = $(this);

    if( !$header.hasClass('mfn-toggle-expanded') ){
        $('.mfn-ui .mfn-form .modalbox-card.active .row-header.toggled_header.mfn-toggle-expanded').removeClass('mfn-toggle-expanded');
        $(".mfn-ui .mfn-form .modalbox-card.active > .mfn-vb-formrow").not('.toggled_header').addClass('mfn-toggled');

        $header.addClass('mfn-toggle-expanded');
        $header.nextUntil(".toggled_header").removeClass('mfn-toggled');

    }else{
        $('.mfn-ui .mfn-form .modalbox-card.active .row-header.toggled_header.mfn-toggle-expanded').removeClass('mfn-toggle-expanded');
        $(".mfn-ui .mfn-form .modalbox-card.active > .mfn-vb-formrow").not('.toggled_header').addClass('mfn-toggled');
    }

});

$editpanel.on('click', '.mfn-form-row.toggle_fields > label > .mfn-vb-label-button', function(e) {
    e.preventDefault();

    var $box = $(this).closest('.mfn-form-row');

    if( $box.find('.form-group.font-family-select select').length ){
        $box.find('.form-group.font-family-select select').each(function() {
            var $select = $(this);
            if( typeof mfnvbvars.mfn_google_fonts !== 'undefined' ){
              mfnvbvars.mfn_google_fonts.forEach((entry) => {
                options += '<option value="'+ entry +'">'+ entry +'</option>';
              });
              if( $select.find('optgroup[data-type="google-fonts"] option').length == 1 ){
                $select.find('optgroup[data-type="google-fonts"]').html(options);
                value = $select.attr('data-value');
                if( typeof value !== 'undefined' ){ $select.val(value); }
              }
            }
        });
    }

    $box.toggleClass('mfn-fields-active');
    $('.sidebar-wrapper').toggleClass('mfn-vb-sidebar-overlay');
    $(document).bind('click', hideLabelButtonInputs);
});

// Reset CSS Filters to default
$editpanel.on('click', '.mfn-form-row.toggle_fields > label > a.reset-css-filters', function(e) {
  e.preventDefault();

  if( typeof edited_item.attr['style:.mcb-section-mfnuidelement .mcb-background-overlay:filter'] === 'undefined' ) return;

  var $editrow = $(this).closest('.mfn-vb-formrow');

  $editrow.find('.mfn-sliderbar-value, .mfn-field-value').each(function() {
    $(this).val('').trigger('change');
  });

  $editrow.find('.sliderbar .ui-slider-handle').each(function() {
    $(this).attr('style', '');
  });

  setTimeout(function() {
    delete(edited_item.attr['style:.mcb-section-mfnuidelement .mcb-background-overlay:filter']);
  }, 100);
});

function hideLabelButtonInputs(e){
    var div = $('.mfn-form-row.mfn-fields-active .mfn-toggle-fields-wrapper');

    if (!div.is(e.target) && div.has(e.target).length === 0){
        $('.mfn-form-row.mfn-fields-active').removeClass('mfn-fields-active');
        $('.sidebar-wrapper').removeClass('mfn-vb-sidebar-overlay');

        $(document).unbind('click', hideLabelButtonInputs);
    }
}

$editpanel.on('click', '.mfn-form-row.mfn-sidebar-fields-tabs > ul.mfn-sft-nav li a', function(e) {
    e.preventDefault();
    var tab = $(this).attr('data-tab');
    var $box = $(this).closest('.mfn-form-row');
    $box.find('ul.mfn-sft-nav li').removeClass('active');
    $box.find('.mfn-sft').removeClass('mfn-tabs-fields-active');
    $box.find('.mfn-sft .mfn-vb-formrow').addClass('mfn-toggled');

    $box.find('.mfn-sft-'+tab).addClass('mfn-tabs-fields-active');
    $box.find('.mfn-sft-'+tab+' .mfn-vb-formrow').removeClass('mfn-toggled');
    if( !$box.find('.mfn-sft-'+tab+' .mfn-vb-formrow.mfn-fields-switcher .segmented-options li.active').length ){
        $box.find('.mfn-sft-'+tab+' .mfn-vb-formrow.mfn-fields-switcher .segmented-options li:first-child a').trigger('click');
    }
    $(this).parent().addClass('active');
});

$editpanel.on('click', '.panel-edit-item ul.sidebar-panel-content-tabs > li', function(e) {
    e.preventDefault();

    var tab = $(this).attr('data-tab');

    if( !$(this).hasClass('active') ){
        $('.panel-edit-item .modalbox-card').removeClass('active');

        $(this).addClass('active');
        $(this).siblings().removeClass('active');
        $('.panel-edit-item .modalbox-card-'+tab).addClass('active');
    }

    return;

});

/* CSS */

$('.mfnopt.body_offset_header .mfn-form-control').on('change', function() {
    var val = $(this).val();
    if(val == 'active'){
        var header_height = $content.find('.mfn-builder-content').outerHeight()+'px';
        $('.mfnopt.body-offset-header-value .mfn-form-control').val(header_height);
    }
});

$editpanel.on('change', '.inline-style-input .mfn-field-value, .inline-style-input input[type="checkbox"]', function() {
    var $field = $(this);
    var it = $(this).closest('.mfn-element-fields-wrapper').attr('data-element');
    var val = $field.val();
    var units_check = false;
    var fonts = [];

    if( $field.val().length && $field.hasClass('has-default-unit') ){
        $.each( units, function( i, el ) {
            if( val == 'initial' || val == 'auto' || val.includes(el) ){
                units_check = true;
            }
        });

        if(units_check == false){
            $field.val(val+$field.attr('data-unit'));
        }
    }

    if( $field.find('option:selected').parent().attr('data-type') == 'google-fonts' && $field.closest('.mfn-form-row').attr('data-name') == 'font-family' ){
        fonts.push($(this).val());
    }

    // web font load
    if( fonts.length ){
        WebFont.load({
            google: {
              families: fonts
            },
            context: window.frames[0].frameElement.contentWindow,
        });
    }

    if( $field.hasClass('preview-background-sizeinput') && val == 'cover-ultrawide' ){
        $content.find('.'+it).addClass('bg-cover-ultrawide');
    }else if($field.hasClass('preview-background-sizeinput') && val != 'cover-ultrawide'){
        $content.find('.'+it).removeClass('bg-cover-ultrawide');
    }

    setTimeout(function() { grabFieldStyle( $field ); }, 20);
});

function grabArrStyle(sel, val, uid){
    let rwd = 'desktop';
    let sel_ex = sel.split(':');

    if(sel.includes('_tablet')){
        rwd = 'tablet';
    }else if(sel.includes('_mobile')){
        rwd = 'mobile';
    }

    let csspath = sel_ex[1];
    let cssstyle = sel_ex[2];

    if( typeof val === 'object' ){
        var filter = '';
        $.each(val, function(k, v) {
            if( cssstyle.includes('typography') ){
                addLocalStyle(csspath, v, k, rwd, uid);
            }else if( cssstyle.includes('filter') && v.length ){
                if( k != 'string' ) filter += k+'('+v+') ';
            }else if( cssstyle.includes('gradient') ){
                if( k == 'string' && v.length ){
                    addLocalStyle(csspath, v, 'background-image', rwd, uid);
                }else if( k == 'string' && !v.length ){
                    addLocalStyle(csspath, '', 'background-image', rwd, uid);
                }
            }else{
                addLocalStyle(csspath, v, cssstyle+'-'+k, rwd, uid);
            }
        });

        if( filter.length ) {
            addLocalStyle(csspath, filter, 'filter', 'desktop', uid);
        }
        return;
    }

    /*if($box.find('.separated-fields').length){
        cssstyle = cssstyle+'-'+$field.attr('data-key');
    }*/

    if( cssstyle == 'flex' && val.length ){
        addLocalStyle(csspath, val, 'max-width', rwd, uid);
        val = '0 0 '+val;
    }

    if(val == '' && cssstyle == 'flex' ){
        addLocalStyle(csspath, 'unset', 'max-width', rwd, uid);
    }

    if( (cssstyle == 'background-image' || cssstyle == 'background-image_tablet' || cssstyle == 'background-image_mobile' || cssstyle == '-webkit-mask-image') && val.length ){
        val = 'url('+val+')';
    }

    addLocalStyle(csspath, val, cssstyle, rwd, uid);
}

function grabFieldStyle($field){
    let rwd = 'desktop';
    let $box = $field.closest('.mfn-vb-formrow');
    let val = $field.val();
    let it =  $box.closest('.mfn-element-fields-wrapper').attr('data-element');
    let uid = $content.find('.'+it).attr('data-uid');

    if($box.hasClass('mfn_field_tablet')){
        rwd = 'tablet';
    }else if($box.hasClass('mfn_field_mobile')){
        rwd = 'mobile';
    }

    let csspath = $box.attr('data-csspath');
    let cssstyle = $box.attr('data-name');

    if($box.find('input.pseudo-field').length && !$field.hasClass('pseudo-field')){
        return;
    }

    if($box.find('input.pseudo-field').length){
        val = $box.find('input.pseudo-field').val();
    }

    if($box.find('.separated-fields').length){
        cssstyle = cssstyle+'-'+$field.attr('data-key');
    }

    if( $field.hasClass('preview-background-sizeinput') && val == 'cover-ultrawide' ){
        val = '';
    }

    if( cssstyle == 'flex' && val.length ){
        addLocalStyle(csspath, val, 'max-width', rwd, uid);
        val = '0 0 '+val;
    }

    if(val == '' && cssstyle == 'flex' ){
        addLocalStyle(csspath, 'unset', 'max-width', rwd, uid);
    }

    if( (cssstyle == 'background-image' || cssstyle == 'background-image_tablet' || cssstyle == 'background-image_mobile' || cssstyle == '-webkit-mask-image' ) && val.length && !$box.hasClass('gradient') ){
        val = 'url('+val+')';
    }

    if( $box.closest('.mfn-form-row.filter').length ){
        var filter = '';
        $('.panel-edit-item .mfn-element-fields-wrapper .mfn-form-row.filter .mfn-field-value').each(function() {
            var filter_key = $(this).closest('.mfn-form-row').attr('data-name');
            if( $(this).val().length ){
                filter += filter_key+'('+$(this).val()+') ';
            }
        });

        edited_item.attr['style:.mcb-section-mfnuidelement .mcb-background-overlay:filter']['string'] = filter;
        addLocalStyle(csspath, filter, 'filter', 'desktop', uid);

    }else{
        addLocalStyle(csspath, val, cssstyle, rwd, uid);
    }

}

// set size labels

function setSizeLabels(){
    $content.find('.mfn-size-label .mfn-element-size-label').each(function() {
        let uid = $(this).closest('.vb-item').attr('data-uid');
        let curr_size = $(this).closest('.vb-item').attr('data-'+screen+'-size');
        let custom_size = $('.mfn-ui .mfn-form-row.mfn-vb-'+uid+' .mfn_field_'+screen+'.advanced_flex .mfn-field-value').val();


        if( custom_size && custom_size.length ){
            $(this).text('Custom');
        }else{
            $(this).text(curr_size);
        }

        setTimeout(function() {
            resetBeforeAfter();
        }, 1100);

    });
}

// woocomemrce product gallery

var productgallery = {
    start: function( $container ) {

        $container.imagesLoaded( function() {

            if(!$container.find('.flex-viewport').length){
                iframe.window.jQuery('.woocommerce-product-gallery:not(.mfn-initialized)').wc_product_gallery();
                $container.addClass('mfn-initialized');
            }

            if($container.find('.flex-viewport').length){
                $loup = $container.find('.woocommerce-product-gallery__trigger').clone(true).empty().appendTo('.flex-viewport');
                $container.find('.woocommerce-product-gallery__trigger').remove();

                if($container.find('.mfn-wish-button').length){
                    $container.find('.mfn-wish-button').clone(true).appendTo('.flex-viewport');
                    $container.find('.mfn-wish-button').remove();
                }
            }else if( $container.find('.woocommerce-product-gallery__trigger').length ){
                $container.find('.woocommerce-product-gallery__trigger').empty();
            }

            if($container.find('.flex-control-thumbs').length){
                $container.find('.flex-control-thumbs').wrap('<div class="mfn-flex-control-thumbs-wrapper"></div>');
            }

            $container.imagesLoaded( function() {
                if( $container.hasClass('.mfn-thumbnails-left') || $container.hasClass('.mfn-thumbnails-right') ){
                    setTimeout(function() { productgallery.verticalThumbs($container); }, 300);
                }else if( $container.hasClass('.mfn-thumbnails-bottom') ){
                    productgallery.horizontalThumbs($container);
                }
            });

            iframe.window.jQuery('body').trigger('resize');

        });



    },
    horizontalThumbs: function($container) {
        //var $container = $container.find('.mfn-product-gallery');
        var containerW = $container.outerWidth();
        var $scroller = $container.find('.flex-control-thumbs');
        var scrollerW = 0;

        $scroller.find('li').each(function() {
          $(this).addClass('swiper-slide');
          scrollerW += $(this).outerWidth();
        });

        if( !$container.length || !$scroller.length ){
          return;
        }

        if( scrollerW > containerW ){
          //return;
          $scroller.css({ 'justify-content': 'flex-start', 'width': '100%' });
          $container.find('.mfn-flex-control-thumbs-wrapper').addClass('mfn-scroller-active');
        }

        $scroller.addClass('swiper-wrapper');

        /*var swiper = new Swiper(".mfn-flex-control-thumbs-wrapper", {
            slidesPerView: 5,
            spaceBetween: parseInt(mfnwoovars.productthumbs),
        });*/
    },
    verticalThumbs: function($container) {
        //var $container = $container.find('.mfn-product-gallery)');
        var containerH = $container.find('.woocommerce-product-gallery__image').first().outerHeight();
        var $scroller = $container.find('.flex-control-thumbs');
        var scrollerH = 0;
        var mimgm = 0; // main image margin
        var overlay = mfnwoovars.productthumbsover ? mfnwoovars.productthumbsover : 0;

        $scroller.find('li img').css({ 'height': 'auto' });
        $scroller.find('li').css({ 'height': 'auto' });

        $scroller.find('li').each(function() {
          $(this).addClass('swiper-slide').css({ 'margin-bottom': parseInt(mfnwoovars.productthumbs) });
          scrollerH += $(this).outerHeight()+parseInt(mfnwoovars.productthumbs);
          $(this).css({ 'opacity': '1' });
        });

        if(mfnwoovars.mainimgmargin == 'mfn-mim-2'){
          mimgm = 4;
        }else if(mfnwoovars.mainimgmargin == 'mfn-mim-5'){
          mimgm = 10;
        }else if(mfnwoovars.mainimgmargin == 'mfn-mim-10'){
          mimgm = 20;
        }else if(mfnwoovars.mainimgmargin == 'mfn-mim-15'){
          mimgm = 30;
        }else if(mfnwoovars.mainimgmargin == 'mfn-mim-20'){
          mimgm = 40;
        }else if(mfnwoovars.mainimgmargin == 'mfn-mim-25'){
          mimgm = 50;
        }else if(mfnwoovars.mainimgmargin == 'mfn-mim-30'){
          mimgm = 60;
        }

        if( !$container.length || !$scroller.length ){
          return;
        }

        $container.find('.flex-viewport').css({'height': 'auto'});

        if( scrollerH > containerH ){
          if(overlay == 'mfn-thumbnails-overlay'){
            $container.find('.mfn-flex-control-thumbs-wrapper').height( (containerH-mimgm) );
          }else{
            $container.find('.mfn-flex-control-thumbs-wrapper').height(containerH);
          }

          $scroller.css({ 'align-items': 'flex-start' });
          $container.find('.mfn-flex-control-thumbs-wrapper').addClass('mfn-scroller-active');


          $scroller.addClass('swiper-wrapper');

          /*var swiper = new Swiper(".mfn-flex-control-thumbs-wrapper", {
            slidesPerView: 4,
            spaceBetween: parseInt(mfnwoovars.productthumbs),
            direction: "vertical",
            mousewheel: true,
          });*/

          $scroller.find('li').each(function() {
            $(this).find('img').css({ 'height': $(this).outerHeight() });
            $(this).css({ 'opacity': '1' });
          });

        }
    }
  };

/**
 * Conditions
 * mfnoptsinputs()
 */

var mfnoptsinputs = {

  start: function() {

    var prepareValues = false;

    $items = $('.mfn-ui .mfn-form .activeif:not(.mfn-initialized)');

    if( $items.length ){
        $items.each(function() {
            var fieldid = $(this).attr('data-conditionid');
            if( !$('.mfn-ui .mfn-form #'+fieldid+'.watchChanges').length ){
                $(this).addClass('conditionally-hide');
                $('.mfn-ui .mfn-form  #'+fieldid).addClass('watchChanges');
                prepareValues = true;
            }
            $(this).addClass('mfn-initialized');
        });
    }

    if( prepareValues ){
      mfnoptsinputs.startValues();
    }
  },

  startValues: function() {
    $('.mfn-ui .mfn-form .watchChanges').each(function() {
        var id = $(this).attr('id');
        var val;
        if( $(this).find('.single-segmented-option.segmented-options').length ){
            val = $(this).find('input:checked').val();
        }else{
            val = $(this).find('.mfn-field-value, .condition-field').val();
        }
        mfnoptsinputs.getField(id, val);
    });
  },

  watchChanges: function() {
    // segmented options is in segmented click function
    $editpanel.on('change', '.watchChanges .mfn-field-value, .watchChanges .condition-field', function() {
        var val = $(this).val();
        var id = $(this).closest('.watchChanges').attr('id');
        mfnoptsinputs.getField(id, val);
    });
  },

  getField: function(id, val){
    $('.mfn-ui .mfn-form .activeif-'+id).each(function() {
      var $formrow = $(this);
      mfnoptsinputs.showhidefields($formrow, val);
    });
  },

  showhidefields: function($formrow, val){
    var opt = $formrow.attr('data-opt');
    var optval = $formrow.attr('data-val');

    if( opt == 'is' && ( (val != '' && optval.includes(val)) || (val == '' && optval == '') ) ){
      $formrow.addClass('conditionally-show').removeClass('conditionally-hide');
    }else if( opt == 'isnt' && ( (optval == '' && val != '') || (val == '' && optval != '') || val != optval ) ){
      $formrow.addClass('conditionally-show').removeClass('conditionally-hide');
    }else{
      $formrow.addClass('conditionally-hide').removeClass('conditionally-show');
    }
  },
};

/* FIELDS */

$editpanel.on('change paste', '.panel-edit-item .mfn-form input[type="checkbox"], .panel-edit-item .mfn-form .field-to-object, .panel-edit-item .mfn-form input.mfn-field-value, .panel-edit-item .mfn-form textarea.mfn-field-value, .panel-edit-item .mfn-form select.mfn-field-value', function() {
    getFieldChange($(this));
    //console.log('1111 input textarea keyup '+$(this).val());
});

function getFieldChange($field){
    //var $field = $(this);
    var $editrow = $field.closest('.mfn-vb-formrow');
    var name = $field.attr('name');
    var id = $editrow.attr('data-id');
    var prefix = $editrow.attr('data-prefix');

    //console.log(name+' - '+$field.val());

    var editedd_item = mfnvbvars.pagedata.filter( (item) => item.uid == edited_item.uid )[0];

    if( $editrow.find('.separated-fields').length ){
        var keyy = $field.attr('data-key');
        if( typeof editedd_item[prefix][id] !== 'undefined' ){
            editedd_item[prefix][id][keyy] = $field.val();
        }else{
            editedd_item[prefix][id] = {};
            editedd_item[prefix][id][keyy] = $field.val();
        }
    }else if( $editrow.closest('.typography').length ){
        var keyy = $editrow.attr('data-name');
        $typorow = $editrow.closest('.typography');
        id = $typorow.attr('data-id');
        prefix = $typorow.attr('data-prefix');

        if( screen == 'tablet' ) keyy += '_tablet';
        if( screen == 'mobile' ) keyy += '_mobile';

        if( typeof editedd_item[prefix][id] !== 'undefined' ){
            editedd_item[prefix][id][keyy] = $field.val();
        }else{
            editedd_item[prefix][id] = {};
            editedd_item[prefix][id][keyy] = $field.val();
        }
    }else if( $editrow.closest('.filter').length ){
        var keyy = $editrow.attr('data-name');
        $typorow = $editrow.closest('.filter');
        id = $typorow.attr('data-id');
        prefix = $typorow.attr('data-prefix');
        if( typeof editedd_item[prefix][id] !== 'undefined' ){
            editedd_item[prefix][id][keyy] = $field.val();
        }else{
            editedd_item[prefix][id] = {};
            editedd_item[prefix][id][keyy] = $field.val();
        }
    }else if( $editrow.hasClass('gradient') ){
        var keyy = $field.attr('data-key');
        if( typeof editedd_item[prefix][id] !== 'undefined' ){
            editedd_item[prefix][id][keyy] = $field.val();
        }else{
            editedd_item[prefix][id] = {};
            editedd_item[prefix][id][keyy] = $field.val();
        }
    }else if( $editrow.hasClass('tabs') && $field.closest('li.tab').length ){
        var keyy = $field.attr('data-label');
        var order = $field.attr('data-order');
        editedd_item[prefix][id][order][keyy] = $field.val();
    }else{
        editedd_item[prefix][name] = $field.val();
    }

    if( !$editrow.hasClass('re_render') && !$editrow.find('.multiple-inputs').length ) addHistory();

}


$editpanel.on('change paste', '.panel-view-options .mfn-form input, .panel-view-options .mfn-form select, .panel-view-options .mfn-form textarea', function() {
    var $editrow = $(this).closest('.mfn-vb-formrow');
    var name = $(this).attr('name');
    var value = $(this).val();
    edited_item['fields'][name] = value;

    $.ajax( ajaxurl, {
    type : "POST",
    data : {
      'mfn-builder-nonce': wpnonce,
      action: 'mfn_post_option',
      id: pageid,
      option: name,
      value: value,
    }

  });

});


/**
 *
 * NEW ACM end
 *
 **/


mfnoptsinputs.watchChanges();

return {
  init: init,
  addHistory: addHistory,
  wpnonce: wpnonce,
  ajaxurl: ajaxurl,
  settings: settings,
  enableBeforeUnload: enableBeforeUnload
};

})(jQuery);

MfnVbApp.settings.detectOsTheme();

(function($) {
$(document).ready(function() {

    /*$('.mfn-preloader').fadeOut(500, function() {
            $('body').removeClass('mfn-preloader-active');
        });

    return;*/

    $('.mfn-preloader .loading-text').fadeOut(function() {
        $('.mfn-preloader .loading-text').html('Loading page content <div class="dots"></div>');
    }).fadeIn();

    document.getElementById('mfn-preview-wrapper').innerHTML = '<iframe id="mfn-vb-ifr" src="'+mfnvbvars.permalink+'" allowfullscreen="1"></iframe>';
    $('iframe#mfn-vb-ifr').on('load', function() {

        $content = $("iframe#mfn-vb-ifr").contents();
        iframe = document.getElementById("mfn-vb-ifr").contentWindow;

        MfnVbApp.init();

    });

});
}(jQuery));

/**
* Clone fix
* Fixed native clone function for textarea and select fields
*/

(function(original) {
jQuery.fn.clone = function() {
  var result = original.apply(this, arguments),
    my_textareas = this.find('textarea:not(.editor), select'),
    result_textareas = result.find('textarea:not(.editor), select');

  for (var i = 0, l = my_textareas.length; i < l; ++i) {
    jQuery(result_textareas[i]).val(jQuery(my_textareas[i]).val());
  }

  return result;
};
})(jQuery.fn.clone);

function getContrastYIQ( hexcolor, tolerance ){
    hexcolor = hexcolor.replace( "#", "" );
    tolerance = typeof tolerance !== 'undefined' ? tolerance : 169;

    if( 6 != hexcolor.length ){
    return false;
    }

    var r = parseInt( hexcolor.substr(0,2),16 );
    var g = parseInt( hexcolor.substr(2,2),16 );
    var b = parseInt( hexcolor.substr(4,2),16 );

    var yiq = ( ( r*299 ) + ( g*587 ) + ( b*114 ) ) / 1000;

    return ( yiq >= tolerance ) ? 'light' : 'dark';
}
