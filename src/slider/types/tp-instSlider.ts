export enum SliderItemTypes {
    Image = 'image',
    Video = 'video',
    Text = 'text',
    Html = 'html',
    Default = 'default'
}

export interface ISliderItemTypes{
    [SliderItemTypes.Image]: () => void,
    [SliderItemTypes.Video]: () => void,
    [SliderItemTypes.Text]: () => void,
    [SliderItemTypes.Html]: () => void,
    [SliderItemTypes.Default]: () => void
}

export type GlobalSliderSettings = {
    sliders_container_class: string;
    sliders_bg_modal_class: string;
    sliders_bg_modal_close_class: string;
    sliders_header_class: string;

    loop: boolean;
    debug: boolean;

    time_view_slide: number;
    sliders: Array<SlideItem>;

    sliders_border_color_viewed: string;

    sliders_container?: Element;
    sliders_bg_modal?: Element;
    sliders_bg_modal_close?: Element;
    sliders_style?: HTMLStyleElement;
};

export type SliderSettings = {
    loop: boolean;
    time_view_slide: number;
    sliders: Array<SlideItem>;
};

type SliderItemHeader = {
    container: Element;
    items: NodeList;

    thumb: {
        container: Element;
        items: NodeList | null;
    },

    menu: {
        container: Element;
        items: NodeList | null;
    },

    next: {
        container: Element;
    },

    prev: {
        container: Element;
    }
}

type SliderItemSlidesAutoSlide = {
    active: boolean;
    timeout: NodeJS.Timeout;
    time: number;
}

type SliderItemSlides = {
    container: Element;
    count: number;
    items: NodeList;
    auto_slide: Array<SliderItemSlidesAutoSlide>;
    items_type: Array<SliderItemTypes>;
    is_click_slide: boolean;
}

export type SlideItem = {
    id: string;
    active: boolean;

    is_view: boolean;
    is_viewed: boolean;

    is_first_slide: boolean;
    is_last_slide: boolean;

    prev_slide_id: number;
    active_slide_id: number;
    next_slide_id: number;

    count_sliders: number;

    trigger_container: Element;
    slider_container: Element;

    header: SliderItemHeader;

    slides: SliderItemSlides;

    show: () => void;
    hide: () => void;

    next_slide: () => void;
    prev_slide: () => void;

    activate_auto_slide: () => void;
}

export type SlideItemSettings = {
    id: string;
    active?: boolean;

    is_view?: boolean;
    is_viewed?: boolean;

    active_slide_number?: number;
}

export interface Sliders {
    [key: string]: SlideItem
}