(function() {
    "use strict";

    function map(x, in_min, in_max, out_min, out_max) {
        return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    }

    function makeDraggable(slider, $handle) {
        $handle.draggable({
            containment: slider.$base,
            scroll: false,
            axis: "x"
        });
        $handle.on('drag', function() {
            slider.setValueFromPosition();
            if (slider.onDragCallback) {
                slider.onDragCallback();
            }
        });
    }

    function RangeSlider(selector, params) {
        this.captionFormat = params.captionFormat || 'VALUE';

        this.$element = $(selector);
        this.$base = $('<div class="range-slider-base">');
        this.$leftHandle = $('<div class="range-slider-handle-left">');
        this.$leftCaption = $('<span class="range-slider-caption">').text('L');
        this.$rightHandle = $('<div class="range-slider-handle-right">');
        this.$rightCaption = $('<span class="range-slider-caption">').text('R');

        this.$base.append(this.$leftHandle.append(this.$leftCaption))
                  .append(this.$rightHandle.append(this.$rightCaption));
        this.$element.append(this.$base);

        makeDraggable(this, this.$leftHandle);
        makeDraggable(this, this.$rightHandle);

        this.rangeWidth = this.$base.width() - this.$leftHandle.width();
        this.range = params.range;
        this.value(params.start);

        this.onDragCallback = params.onDrag;
    }

    RangeSlider.prototype.value = function(value) {
        if (value) {
            this.$leftHandle.css('left',
                map(value[0], this.range[0], this.range[1], 0, this.rangeWidth));
            this.$rightHandle.css('right',
                map(value[1], this.range[0], this.range[1], this.rangeWidth, 0));
            this.showValueToCaptions();
            return this;
        } else {
            return this.numberValue;
        }
    };

    RangeSlider.prototype.setValueFromPosition = function() {
        this.showValueToCaptions();
    };

    RangeSlider.prototype.showValueToCaptions = function() {
        var self = this;

        function to_range(x) {
            return Math.round(map(x, 0, self.rangeWidth, self.range[0], self.range[1]));
        }

        function format(value) {
            return self.captionFormat.replace('VALUE', value);
        }

        var leftPos = to_range(self.$leftHandle.position().left);
        var rightPos = to_range(self.$rightHandle.position().left);
        this.$leftCaption.text(format(leftPos));
        this.$rightCaption.text(format(rightPos));
        this.numberValue = [leftPos, rightPos];
    };

    window.RangeSlider = RangeSlider;
})();