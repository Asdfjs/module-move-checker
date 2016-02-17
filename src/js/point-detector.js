/**
 * @fileoverview detect event by point information
 */

if (!window.Asdf.module) {
    window.Asdf.module = {};
}

(function($_) {

    /**
     * default values.
     */
    var FLICK_DEFAULT_OPTIONS = {
        TIME: 100,
        RANGE: 100,
        CLICKTIME: 200,
        MIN_DIST: 10
    };

    /**
     * To find out it's flick or click or nothing from event datas.
     * @example
     * $_.module.pointDetector.setup({
     *      flickTime: 300, // time to check flick
     *      flickRange: 250, // range(distance) to check flick
     *      clickTime: 200, // time to check click
     *      minDist: 15 // range(distance) to check movement
     * });
     */
    $_.module.pointDetector = /** @lends $_.module.PointDetector */{
        /**
         * set options
         * @param {object} option
         *      @param {number} [option.flickTime] time to check flick
         *      @param {number} [option.flickRange] range to check flick
         *      @param {number} [option.clickTime] time to check click
         *      @param {number} [option.minDist] distance to check movement
         */
        setup: function(option) {
            this.flickTime = option.flickTime || FLICK_DEFAULT_OPTIONS.TIME;
            this.flickRange = option.flickRange || FLICK_DEFAULT_OPTIONS.RANGE;
            this.clickTime = option.clickTime || FLICK_DEFAULT_OPTIONS.CLICKTIME;
            this.minDist = option.minDist || FLICK_DEFAULT_OPTIONS.MIN_DIST;
            this.clickTimer = null;
            this.type = null;
        },

        /**
         * pick event type from eventData
         * @param {object}  points A point data
         * @return {object}
         */
        figure: function(points) {
            return {
                direction : this.getDirection(points.list),
                type: this.extractType(points);
            };
        },

        /**
         * return direction figured out
         * @param {array} list eventPoint List
         * @returns {string}
         */
        getDirection: function(list) {
            var first = list[0],
                final = list[list.length-1],
                cardinalPoint = this.getCardinalPoints(first, final),
                res = this.getNearestPoint(first, final, cardinalPoint);
            return res;
        },

        /**
         * return cardinal points figured out
         * @param {object} first start point
         * @param {object} last end point
         */
        getCardinalPoints: function(first, last) {
            var verticalDist = first.y - last.y,
                horizonDist = first.x - last.x,
                NS = '',
                WE = '';

            if (verticalDist < 0) {
                NS = 'S';
            } else if (verticalDist > 0) {
                NS = 'N';
            }

            if (horizonDist < 0) {
                WE = 'E';
            } else if (horizonDist > 0) {
                WE = 'W';
            }

            return NS+WE;
        },

        /**
         * return nearest four cardinal points
         * @param {object} first start point
         * @param {object} last end point
         * @param {string} cardinalPoint cardinalPoint from getCardinalPoints
         * @returns {string}
         */
        getNearestPoint: function(first, last, cardinalPoint) {
            var slop = (last.y - first.y) / (last.x - first.x),
                direction;
            if (slop < 0) {
                direction = slop < -1 ? 'NS' : 'WE';
            } else {
                direction = slop > 1 ? 'NS' : 'WE';
            }

            direction = this._getDuplicatedString(direction, cardinalPoint);
            return direction;
        },

        /**
         * return duplicate charters
         * @param {string} str1 compared charters
         * @param {string} str2 compared charters
         * @returns {string}
         */
        _getDuplicatedString: function(str1, str2) {
            var dupl = '',
                key,
                i = 0,
                len = str1.length,
                pool = {};

            // save opered characters
            for (; i < len; i++) {
                key = str1.charAt(i);
                pool[key] = 1;
            }

            // change saved flag if charater exist in pool
            for (i = 0, len = str2.length; i < len; i++) {
                key = str2.charAt(i);
                pool[key] = pool[key] ? (dupl += key) : 1;
            }

            return dupl;
        },

        /**
         * extract type of event
         * @param {object} eventData event data
         * @returns {string}
         * @example
         * $_.module.pointDetector.extractType({
         *      start: 1000,
         *      end: 1100,
         *      list: [
         *            {
         *                x: 10,
         *                y: 10
         *            },
         *            {
         *                x: 11,
         *                y: 11
         *            }
         *      ]
         * });
         */
        extractType: function(data) {
            var start = data.start,
                end = data.end,
                list = data.list,
                first = list[0],
                final = list[list.length - 1],
                timeDist = end - start,
                xDist = Math.abs(first.x - final.x),
                yDist = Math.abs(first.y - final.y);

            // compare dist with minDist
            if (timeDist < this.flickTime || xDist > this.flickRange || yDist > this.flickRange) {
                return 'flick';
            } else {
                return 'none';
            }
        }
    };

})(window.Asdf);
