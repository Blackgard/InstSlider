<h3 align="center">InstSlider</h3>

<div align="center">

[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)

---

![Image preview](https://github.com/Blackgard/InstSlider/images/preview.png)

</div>

## 📝 Table of Contents

- [About](#about)
- [Installing](#getting_started)
- [Usage](#usage)
- [How work](#how_work)
- [Built Using](#built_using)
- [Authors](#authors)

## 🧐 About <a name = "about"></a>

InstSlider is an easy and fast Instagram style slider.

[Live demo]()

## 🏁 Installing <a name = "getting_started"></a>

To start working with a project, you need to do:

```
git clone https://github.com/Blackgard/InstSlider.git
```

## 🎈 Usage <a name="usage"></a>

You will find the files necessary for work in the <b>[dist](https://github.com/Blackgard/InstSlider/dist)</b> folder.

<b>STEP 1</b>: In header site include: 

```html
<head>
    ...
    <link href="instSlider.css" rel="stylesheet">
</head>
```

<b>STEP 2</b>: before closing the tag body include:

```html
<body>
    ...
    <script defer="defer" src="instSlider.js"></script>
</body>
```

<b>STEP 3</b>: init slider:

```html
<script>
    document.addEventListener("DOMContentLoaded", () => { 
        var slider_1 = new InstSlider({
            sliders: ['slider-inst-1', 'slider-inst-2', 'slider-inst-3', 'slider-inst-4'] 
        });
    });
</script>
```

🔥 Success, your slider is work!

## 📖 How work <a name = "how_work"></a>

### How to declare a slider container ?

```html
<div class="history" data-slider-history-id-on-click='slider-inst-1'>
    <div class="border-img" data-slide-border>
        <svg viewBox="0 0 80 80" width="64" height="64" stroke="#5B51D8" stroke-width="3" fill="none">
            <circle class="circle" cx="40" cy="40" r="38" />
        </svg>
    </div>

    <div
        class='history__img' 
        style="background: linear-gradient(180deg, rgba(255, 255, 255, 0.2) 32.81%, rgba(0, 0, 0, 0.02) 100%), linear-gradient(180deg, #FFE8A5 0%, #FFE494 100%);"
        data-slide-img
    >
        AD
    </div>

    <span class='history__title' data-slide-title>
        Alexandr Drachenin (text)
    </span>
</div>
```

The most important thing is to specify the "<b>data-slider-history-id-on-click</b>" attribute for the container with the slider id value.

Also for digital display of styles, you need to specify tags with "<b>data-slide-img</b>", "<b>data-slide-title</b>" and "<b>data-slide-border</b>".

1. <b>data-slide-img</b>: Indicates the image that will appear on the slider under the views bar. If you want a picture, then instead of the "div" tag put "img".
2. <b>data-slide-title</b>: Indicates the text that will appear on the slider under the views bar. To the right of the picture.
3. <b>data-slide-border</b>: It is used to indicate the viewed users of the sliders.

### How to declare a slider ?

```html
<div class="slider-container" id="slider-container">
    <div class="slider-items">
        <div class="slider-inst popur" id='slider-inst-1'>
            <div class="slide-items" data-slide-items-container>
                <div style="background-color: beige;" alt="1" class="item text big" data-slide-item data-slide-item-type="text">
                    Slide 1-1
                </div>
                <div style="background-color: brown;" alt="2" class="item text big white" data-slide-item data-slide-item-type="text">
                    Slide 1-2
                </div>
                <div style="background-color: coral;" alt="3" class="item text big" data-slide-item data-slide-item-type="text">
                    Slide 1-3
                </div>
            </div>
        </div>
    </div>
    <div class="bg-modal black">
        <svg class="icon-close" aria-label="Закрыть" fill="#ffffff" height="24" role="img"></svg>
    </div>
</div>
```

If you want to create many sliders, then all of them need to be placed in a container with the "slider-container" class.

To tell the slider where the slides will be located, you need to set the date attribute "<b>data-slide-items-container</b>" to it.

Next, for each slide, you need to specify the date attribute "<b>data-slide-item</b>". It will point the slider to a specific slide.
You can also specify the type of slide for each slide, by default it is "<b>data-slide-item-type='text'</b>".

Other <b>type slider</b>:

1. <b>Text (text)</b>: use only text without tags.
2. <b>Video (video)</b>: use html tag video.
3. <b>Image (image)</b>: use html tag img.
4. <b>Html (html)</b>: use any tags.

### How init slider ?

```html
<script>
document.addEventListener("DOMContentLoaded", () => { 
    var slider_1 = new InstSlider({ 
        loop: false, 
        debug: false, 
        sliders: ['slider-inst-1', 'slider-inst-2', 'slider-inst-3', 'slider-inst-4'] 
    });
});
</script>
```

When initializing the slider, you can transfer some settings to it, for now there are not so many of them.

Slider settings:

- <b>loop</b>: is If true, then the slider will be looped.
- <b>debug</b>: If true, then the slider will display additional information about the work. Needed to debug the slider.
- <b>sliders</b>: Accepts an array with string values ​​or objects. Indicates which slides will work in conjunction with the created slider.

## ⛏️ Built Using <a name = "built_using"></a>

- [NodeJs](https://nodejs.org/en/) - Server Environment

## ✍️ Authors <a name = "authors"></a>

- [@Blackgard](https://github.com/Blackgard) - Idea & Initial work