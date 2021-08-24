import Swiped from '../utils/swiped.js';

import { 
    GlobalSliderSettings, SlideItem, SlideItemSettings, 
    SliderSettings, Sliders, SliderItemTypes, ISliderItemTypes 
} from './types/tp-instSlider';


export default class InstSlider {
    private settings: GlobalSliderSettings;
    public sliders: Sliders;
    public sliders_keys: Array<string>;
    public count_sliders: number;
    public prev_slider_id: boolean | string;
    public active_slider_id: boolean | string;
    public next_slider_id: boolean | string;

    constructor(slider_init: SliderSettings) {
        this.settings = this._create_global_settings(slider_init);

        this.sliders = {};
        this.sliders_keys = [];
        this.count_sliders = 0;

        this.prev_slider_id = false;
        this.active_slider_id = false;
        this.next_slider_id = false;

        // Add style block
        this.settings.sliders_container.insertAdjacentHTML('afterend', `<div id='sliders-styles'><style></style></div>`);
        this.settings.sliders_style = document.getElementById('sliders-styles').firstElementChild as HTMLStyleElement;

        slider_init.sliders.forEach(slider => {
            let slider_setting: SlideItemSettings = this._get_settings_slider(slider);

            this._create_nav_slider(slider_setting.id);
            this.sliders[slider_setting.id] = this._create_new_slider(slider_setting);

            this._create_menu_slider(this.sliders[slider_setting.id]);
            this._create_thumb_slider(this.sliders[slider_setting.id]);

            this._add_slider_handler_click(this.sliders[slider_setting.id]);
            this._activate_first_slide(this.sliders[slider_setting.id]);
            this._processing_slide_items(this.sliders[slider_setting.id]);

            this.count_sliders++;

            this.sliders_keys.push(slider_setting.id);
        });

        this.settings.sliders_bg_modal_close.addEventListener('click', () => this._hide_all_slider());
        this.settings.debug ? console.log(this) : null;
    }

    _create_global_settings(slider_settings: SliderSettings): GlobalSliderSettings {
        let settings: GlobalSliderSettings = {
            sliders_container_class: '.slider-container',
            sliders_bg_modal_class: '.bg-modal',
            sliders_bg_modal_close_class: '.icon-close',
            sliders_header_class: '.slide-header',
            
            sliders_border_color_viewed: "#e7e7e7",

            loop: false,
            debug: false,

            time_view_slide: 5000,
            sliders: [],

            ...slider_settings
        };

        return {
            sliders_container: document.getElementsByClassName(
                settings.sliders_container_class.replace('.', ''))[0],
            sliders_bg_modal: document.getElementsByClassName(
                settings.sliders_bg_modal_class.replace('.', ''))[0],
            sliders_bg_modal_close: document.getElementsByClassName(
                settings.sliders_bg_modal_close_class.replace('.', ''))[0],
            ...settings
        }
    }

    _get_settings_slider(slider_item: SlideItem): SlideItemSettings {
        let settings = { id: "" };
        if (typeof slider_item === 'object') return {...settings, ...slider_item};
        else if (typeof slider_item === 'string') return { id: slider_item};
        return settings;
    }

    _create_new_slider(slider_settings: SlideItemSettings): SlideItem {
        let slider_container = document.getElementById(slider_settings.id.toString());
        let trigger_container = document.querySelector(`[data-slider-history-id-on-click="${slider_settings.id}"]`);
        let slides_container = document.getElementById(slider_settings.id.toString()).querySelector('[data-slide-items-container]');

        let header_container  = document.getElementById(slider_settings.id.toString()).querySelector(this.settings.sliders_header_class);

        let thumb_container = header_container.querySelector(".slide-thumb");
        let menu_container = header_container.querySelector(".slide-menu");
        let next_container = header_container.querySelector(".slide-next");
        let prev_container = header_container.querySelector(".slide-prev");

        return <SlideItem>{
            id: slider_settings.id,
            active: slider_settings.active || true,
            is_view: slider_settings.is_view || false,

            is_viewed: false,

            is_first_slide: slider_settings.active_slide_number == 0,
            is_last_slide: slider_settings.active_slide_number >= slides_container.childElementCount,

            prev_slide_id: NaN,
            active_slide_id: slider_settings.active_slide_number || 0,
            next_slide_id: NaN,

            count_sliders: slides_container.childElementCount,

            trigger_container: trigger_container,
            slider_container: slider_container,

            header: {
                container: header_container,
                items: header_container.querySelectorAll("*"),

                thumb: {
                    container: thumb_container,
                    items: null
                },

                menu: {
                    container: menu_container,
                    items: null
                },

                next: {
                    container: next_container,
                },

                prev: {
                    container: prev_container,
                },
            },

            slides: {
                container: slides_container,
                count: slides_container.childElementCount,
                items: slides_container.querySelectorAll("[data-slide-item]"),
                auto_slide: [...Array.from(slides_container.querySelectorAll(".item"))].map((_) => {
                    return {
                        active: true,
                        timeout: undefined,
                        time: this.settings.time_view_slide
                    }
                }),
                items_type: [],
                is_click_slide: false
            },

            show: () => this.show(slider_settings.id),
            hide: () => this.hide(slider_settings.id),

            next_slide: () => this.next_slide(slider_settings.id),
            prev_slide: () => this.prev_slide(slider_settings.id),

            activate_auto_slide: () => this._activate_auto_slide(slider_settings.id)
        }
    }

    _create_nav_slider(slider_id: string): void {
        var header = document.createElement('div');
        header.className = this.settings.sliders_header_class.replace('.', '');

        let nav_open = '<nav class="slide-nav">';
        let nav_close = '</nav>';

        let slide_thumb = '<div class="slide-thumb"></div>';
        let slide_menu = '<div class="slide-menu"></div>';
        let slide_btn_prev = '<button class="slide-prev"><-</button>';
        let slide_btn_next = '<button class="slide-next">-></button>';

        header.innerHTML = `${nav_open} 
                                ${slide_thumb}
                                ${slide_menu}
                                ${slide_btn_prev}
                                ${slide_btn_next}
                            ${nav_close}`;
        document.getElementById(slider_id).insertAdjacentHTML("afterbegin", header.outerHTML);
    }

    _create_menu_slider(slider_item: SlideItem): void {
        let slider_img = slider_item.trigger_container.querySelectorAll('[data-slide-img]')[0].cloneNode(true) as HTMLElement;
        let slider_name = slider_item.trigger_container.querySelectorAll('[data-slide-title]')[0].cloneNode(true) as HTMLElement;
        if (!slider_img || !slider_name) return;

        slider_img.classList.remove(slider_img.classList.toString());
        slider_name.classList.remove(slider_name.classList.toString());

        slider_img.classList.add('menu__img');
        slider_name.classList.add('menu__name');

        let slider_menu = `${slider_img.outerHTML} ${slider_name.outerHTML}`;
        slider_item.header.menu.container.insertAdjacentHTML('afterbegin', slider_menu);
    }

    _create_thumb_slider(slider_item: SlideItem): void {
        for (let num = 0; num < slider_item.count_sliders; num++) {
            let thumb_item = document.createElement('span');
            thumb_item.classList.add('item');
            thumb_item.dataset.thumbSlideId = `${slider_item.id}_${num}`;
            slider_item.header.thumb.container.innerHTML += thumb_item.outerHTML;
        };
        slider_item.header.thumb.items = slider_item.header.thumb.container.querySelectorAll("*");
    }

    _activate_first_slide(slider_item: SlideItem): void {
        let slider_first_item = slider_item.slides.items[0] as HTMLElement;
        slider_first_item.classList.add('active');
    }

    _add_slider_handler_click(slider_item: SlideItem): void {
        
        // Add swipe triggers
        new Swiped(slider_item.header.container, {
            top: () => this._hide_all_slider(),
            left: () => slider_item.next_slide(),
            right: () => slider_item.prev_slide()
        });

        slider_item.trigger_container.addEventListener('click', () => slider_item.show() );
        slider_item.header.next.container.addEventListener('click', () => slider_item.next_slide() );
        slider_item.header.prev.container.addEventListener('click', () => slider_item.prev_slide() );
    }

    _set_to_style_animate_duration(thumb_slide_id: string, animate_duration: string) {
        this.settings.sliders_style.insertAdjacentHTML(
            'beforeend', 
            `.slide-thumb .item[data-thumb-slide-id=${thumb_slide_id}].active::after { animation-duration: ${animate_duration}; }`
        )
    }

    _processing_slide_items(slider_item: SlideItem): void {
        slider_item.slides.items.forEach((slide, slide_index) => {
            let _slide = slide as HTMLElement;
            let slide_thumb = slider_item.header.thumb.items[slide_index] as HTMLElement;

            let result: ISliderItemTypes = {
                'html': () => {
                    slide_thumb.dataset.timeDuration = `${slider_item.slides.auto_slide[slide_index].time}ms`;
                    this._set_to_style_animate_duration(slide_thumb.dataset.thumbSlideId, slide_thumb.dataset.timeDuration)
                    slider_item.slides.items_type.push(<SliderItemTypes.Html>'html');
                },
                'image': () => {
                    slide_thumb.dataset.timeDuration = `${slider_item.slides.auto_slide[slide_index].time}ms`;
                    this._set_to_style_animate_duration(slide_thumb.dataset.thumbSlideId, slide_thumb.dataset.timeDuration)
                    slider_item.slides.items_type.push(<SliderItemTypes.Image>'image');
                },
                'video': () => {
                    let video_elem = _slide.getElementsByTagName('video')[0] as HTMLVideoElement;
                    video_elem.onloadedmetadata = () => {
                        slider_item.slides.auto_slide[slide_index].time = video_elem.duration * 1000;
                        slide_thumb.dataset.timeDuration = `${video_elem.duration * 1000}ms`;
                        this._set_to_style_animate_duration(slide_thumb.dataset.thumbSlideId, slide_thumb.dataset.timeDuration)
                    }

                    slider_item.slides.items_type.push(<SliderItemTypes.Video>'video');
                },
                'text': () => {
                    slide_thumb.dataset.timeDuration = `${slider_item.slides.auto_slide[slide_index].time}ms`;
                    this._set_to_style_animate_duration(slide_thumb.dataset.thumbSlideId, slide_thumb.dataset.timeDuration);
                    slider_item.slides.items_type.push(<SliderItemTypes.Text>'text');
                },
                'default': () => {
                    console.error(`Not found this type slide | get type: ${_slide.dataset.slideItemType}`, slide);
                    slider_item.slides.items_type.push(<SliderItemTypes.Default>'default');
                }
            };
            
            result[<SliderItemTypes>_slide.dataset.slideItemType || 'default']();
        });
    }

    _hide_all_slider(): void {
        for (const slider_id in this.sliders) {
            if (this.sliders[slider_id].is_view) this.sliders[slider_id].hide();
            if (this.sliders[slider_id].slides.items_type.includes(<SliderItemTypes.Video>'video')) {
                this.sliders[slider_id].slides.items_type.map((item, index) => {
                    if (item != <SliderItemTypes.Video>'video') return;

                    let active_slide = this.sliders[slider_id].slides.items[index] as HTMLElement;
                    let slide_video = active_slide.getElementsByTagName('video')[0] as HTMLVideoElement;
                    slide_video.pause();
                    slide_video.currentTime = 0;
                })
            }
        }
        this.active_slider_id = false;
        this.settings.sliders_container.classList.remove('active');
    }

    _activate_slide(slider_item: SlideItem, old_slide_id: number, new_slide_id: number): void {
        let old_slider_items = slider_item.slides.items[old_slide_id] as HTMLElement;
        old_slider_items.classList.remove('active');

        let old_slider_thumb = slider_item.header.thumb.items[old_slide_id] as HTMLElement;
        old_slider_thumb.classList.remove('active');

        slider_item.header.thumb.items.forEach((item, index) => {
            let _item = item as HTMLElement;
            if (index >= new_slide_id) _item.classList.remove('viewed');
            else _item.classList.add('viewed');
        });

        let new_slider_items = slider_item.slides.items[new_slide_id] as HTMLElement;
        new_slider_items.classList.add('active');

        let new_slider_thumb = slider_item.header.thumb.items[new_slide_id] as HTMLElement;
        new_slider_thumb.classList.add('active');

        slider_item.active_slide_id = new_slide_id;
        if (slider_item.slides.auto_slide[slider_item.active_slide_id].active) slider_item.activate_auto_slide();

        if (new_slide_id + 1 >= slider_item.slides.count) slider_item.is_last_slide = true;
        else slider_item.is_last_slide = false;

        if (new_slide_id - 1 < 0) slider_item.is_first_slide = true;
        else slider_item.is_first_slide = false;

        this._start_active_slide(slider_item);
    }

    _activate_auto_slide(slider_id: string): void {
        let slider_item: SlideItem = this.sliders[slider_id];
        slider_item.slides.auto_slide.forEach((item) => clearTimeout(item.timeout));
        slider_item.slides.auto_slide[slider_item.active_slide_id].timeout = setTimeout(
            slider_item.next_slide, slider_item.slides.auto_slide[slider_item.active_slide_id].time
        );
    }

    _get_next_slider_id(slider_id: string): string {
        let next_slider_id = this.sliders_keys[Object.keys(this.sliders).indexOf(slider_id) + 1];
        if (!next_slider_id && this.settings.hasOwnProperty('loop')) {
            if (this.settings.loop) next_slider_id = Object.keys(this.sliders)[0] ;
        }
        return next_slider_id;
    }

    _get_prev_slider_id(slider_id: string): string {
        let prev_slider_id = this.sliders_keys[Object.keys(this.sliders).indexOf(slider_id) - 1];
        if (!prev_slider_id && this.settings.hasOwnProperty('loop')) {
            if (this.settings.loop) prev_slider_id = Object.keys(this.sliders)[this.count_sliders - 1] ;
        }
        return prev_slider_id;
    }

    _set_status_is_viewed_slider(slider_item: SlideItem): void {
        slider_item.is_viewed = true;
        let border_img = slider_item.trigger_container.querySelector('[data-slide-border]');
        border_img.getElementsByTagName('svg')[0].style.stroke = this.settings.sliders_border_color_viewed;
    }

    _start_active_slide(slider_item: SlideItem) {
        slider_item.slides.items_type.forEach((slide_type, slide_index) => {
            if (slide_type !== <SliderItemTypes.Video>'video') return;

            let active_slide = slider_item.slides.items[slider_item.active_slide_id] as HTMLElement;
            let slide_video = active_slide.getElementsByTagName('video')[0] as HTMLVideoElement;

            slide_video.play();
            if (slide_index !== slider_item.active_slide_id) slide_video.currentTime = 0;
        })
    }

    next_slide(slider_id: string): void {
        let slider = this.sliders[slider_id];

        if (!slider.is_view) {
            this._hide_all_slider();
            slider.show();
            return
        }

        if ((this.next_slider_id == this.active_slider_id || !this.next_slider_id) && slider.is_last_slide && !this.settings.loop) {
            this._hide_all_slider();
            this._set_status_is_viewed_slider(slider);
            return;
        }

        if (slider.is_last_slide) {
            slider.hide();
            this._set_status_is_viewed_slider(slider);

            let last_slide = slider.header.thumb.items[slider.header.thumb.items.length - 1] as HTMLElement;
            last_slide.classList.remove('active');
            last_slide.classList.add('viewed');

            if (typeof this.next_slider_id === 'string') this.sliders[this.next_slider_id].show();
            return
        }

        slider.next_slide_id = slider.active_slide_id + 1 < slider.slides.items.length ? slider.active_slide_id + 1 : 0;
        slider.prev_slide_id = slider.active_slide_id - 1 >= 0 ? slider.active_slide_id - 1 : slider.slides.items.length - 1;

        this._activate_slide(slider, slider.active_slide_id, slider.next_slide_id);
    }

    prev_slide(slider_id: string) {
        let slider = this.sliders[slider_id];

        if (!slider.is_view) {
            this._hide_all_slider();
            slider.show();
            return
        }

        if (slider.is_first_slide) {
            if (!this.prev_slider_id) return

            slider.hide();
            this._set_status_is_viewed_slider(slider);

            let last_slide = slider.header.thumb.items[0] as HTMLElement;
            last_slide.classList.remove('active');
            last_slide.classList.add('viewed');

            if (typeof this.prev_slider_id === 'string') this.sliders[this.prev_slider_id].show();

            return
        }

        if (this.prev_slider_id == undefined) this._hide_all_slider();

        slider.next_slide_id = slider.active_slide_id + 1 < slider.slides.items.length ? slider.active_slide_id + 1 : 0;
        slider.prev_slide_id = slider.active_slide_id - 1 >= 0 ? slider.active_slide_id - 1 : slider.slides.items.length - 1;

        this._activate_slide(slider, slider.active_slide_id, slider.prev_slide_id);
    }

    show(slider_id: string): void {
        this._hide_all_slider();

        this.settings.sliders_container.classList.add('active');

        this.active_slider_id = slider_id;
        this.sliders[slider_id].is_view = true;
        this.sliders[slider_id].slider_container.classList.add('slider-active');
        this._activate_slide(this.sliders[slider_id], 0, this.sliders[slider_id].active_slide_id);

        let next_slider_id = this._get_next_slider_id(slider_id);
        let prev_slider_id = this._get_prev_slider_id(slider_id);

        if (next_slider_id) {
            this.sliders[next_slider_id].slider_container.classList.add("slider-next");
            this.next_slider_id = next_slider_id;
        }

        if (prev_slider_id) {
            this.sliders[prev_slider_id].slider_container.classList.add("slider-prev");
            this.prev_slider_id = prev_slider_id;
        }
    }

    hide(slider_id: string): void {
        // get object slider
        let slider = this.sliders[slider_id];

        // Clear auto slider timer
        clearTimeout(slider.slides.auto_slide[slider.active_slide_id].timeout);

        // Reset active slide and view mode
        slider.is_view = false;
        slider.slider_container.classList.remove('slider-active');

        // Reset active thumb
        slider.header.thumb.items.forEach((item) => item.parentElement.classList.remove('active'));

        // Reset next and prev slide class
        Object.keys(this.sliders).forEach((i) => {
            this.sliders[i].slider_container.classList.remove('slider-next');
            this.sliders[i].slider_container.classList.remove('slider-prev');
        });
    }
}