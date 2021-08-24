export default class Swiped {
    constructor(elem_trigger, fire_after_trigger) {
        this.touchstartX = 0;
        this.touchstartY = 0;
        this.touchendX = 0;
        this.touchendY = 0;


        this.elem_trigger = elem_trigger
        this.fire_after_trigger = {
            left: () => {},
            right: () => {},
            top: () => {},
            bottom: () => {},
            tap: () => {},
            ...fire_after_trigger
        }

        this.add_event_listener(this.elem_trigger)
    }

    add_event_listener(document) {
        document.addEventListener('touchstart', (event) => {
            this.touchstartX = event.changedTouches[0].screenX;
            this.touchstartY = event.changedTouches[0].screenY;
        }, false);

        document.addEventListener('touchend', (event) => {
            this.touchendX = event.changedTouches[0].screenX;
            this.touchendY = event.changedTouches[0].screenY;
            this.handle_gesture();
        }, false); 
    }

    handle_gesture() {
        const del_x = this.touchendX - this.touchstartX;
        const del_y = this.touchendY - this.touchstartY;

        if(Math.abs(del_x) > Math.abs(del_y)) {
            if(del_x > 0) return this.fire_after_trigger.right()
            else return this.fire_after_trigger.left()
        }
        else if(Math.abs(del_x) < Math.abs(del_y)) {
            if(del_y > 0) return this.fire_after_trigger.bottom()
            else return this.fire_after_trigger.top()
        }
        else return this.fire_after_trigger.tap()
    }
}