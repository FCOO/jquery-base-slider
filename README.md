# jquery-base-slider

A plugin to create a slider.


## Fork
jquery-base-slider is forked from the great work by [Denis Ineshin ](https://github.com/IonDen) on [Ion.Range Slider](https://github.com/IonDen/ion.rangeSlider)
jquery-base-slider is based on version **2.0.6**

Please see the <a href="readme.ORG.md">original README.md</a> for how to use the ion.range.slider

In jquery-base-slider some of the original options have been removed and some new one added. Se the Settings section for a complete list

## New features
Compared with the original slider there are the following new features
1. The css is created using SASS
2. The slider is resizeable using only `rem` as size unit
3. Possible to add more than one grid
4. Adding buttons to move from- and/or to-slider to previous, next, first or last value 
5. Click on text will move the slider

## Installation
### bower
`bower install https://github.com/NielsHolt/jquery-base-slider.git --save`


## Settings

<table class="options">
    <thead>
        <tr>
            <th>Option</th>
            <th>Defaults</th>
            <th>Type</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr class="options__step">
            <td>type<div><sup>data-type</sup></div></td>
            <td>"single"</td>
            <td>string</td>
            <td>Choose slider type, could be <code>single</code> - for one handle, or <code>double</code> for two handles</td>
        </tr>

        <tr>
            <td>min<div><sup>data-min</sup></div></td>
            <td>10</td>
            <td>number</td>
            <td>Set slider minimum value</td>
        </tr>
        <tr>
            <td>max<div><sup>data-max</sup></div></td>
            <td>100</td>
            <td>number</td>
            <td>Set slider maximum value</td>
        </tr>
        <tr>
            <td>from<div><sup>data-from</sup></div></td>
            <td>min</td>
            <td>number</td>
            <td>Set start position for left handle (or for single handle)</td>
        </tr>
        <tr>
            <td>to<div><sup>data-to</sup></div></td>
            <td>max</td>
            <td>number</td>
            <td>Set start position for right handle</td>
        </tr>
        <tr class="options__step">
            <td>step<div><sup>data-step</sup></div></td>
            <td>1</td>
            <td>number</td>
            <td>Set sliders step. Always > 0. Could be fractional.</td>
        </tr>

        <tr>
            <td>min_interval<div><sup>data-min-interval</sup></div></td>
            <td>-</td>
            <td>number</td>
            <td>Set minimum diapason between sliders. Only in "double" type</td>
        </tr>
        <tr class="options__step">
            <td>max_interval<div><sup>data-max-interval</sup></div></td>
            <td>-</td>
            <td>number</td>
            <td>Set maximum diapason between sliders. Only in "double" type</td>
        </tr>

        <tr class="options__new">
            <td>from_fixed<div><sup>data-from-fixed</sup></div></td>
            <td>false</td>
            <td>boolean</td>
            <td>Fix position of left (or single) handle.</td>
        </tr>
        <tr class="options__new">
            <td>from_min<div><sup>data-from-min</sup></div></td>
            <td>min</td>
            <td>number</td>
            <td>Set minimum limit for left handle.</td>
        </tr>
        <tr class="options__new">
            <td>from_max<div><sup>data-from-max</sup></div></td>
            <td>max</td>
            <td>number</td>
            <td>Set the maximum limit for left handle</td>
        </tr>

        <tr class="options__new">
            <td>to_fixed<div><sup>data-to-fixed</sup></div></td>
            <td>false</td>
            <td>boolean</td>
            <td>Fix position of right handle.</td>
        </tr>
        <tr class="options__new">
            <td>to_min<div><sup>data-to-min</sup></div></td>
            <td>min</td>
            <td>number</td>
            <td>Set the minimum limit for right handle</td>
        </tr>
        <tr class="options__new">
            <td>to_max<div><sup>data-to-max</sup></div></td>
            <td>max</td>
            <td>number</td>
            <td>Set the maximum limit for right handle</td>
        </tr>
        <tr class="options__new options__step">
            <td>prettify<div><sup>-</sup></div></td>
            <td>null</td>
            <td>function</td>
            <td>Set up your prettify function. Can be anything. For example, you can set up unix time as slider values and than transform them to cool looking dates.</td>
        </tr>
        <tr class="options__new options__step">
            <td>keyboard_step<div><sup>data-keyboard-step</sup></div></td>
            <td>5</td>
            <td>number</td>
            <td>Movement step, than controling from keyboard. In percents.</td>
        </tr>
        <tr class="options__new options__step">
            <td>callback_on_dragging<div><sup>-</sup></div></td>
            <td>true</td>
            <td>boolean</td>
            <td>If false the callback-function is only called when the sliding is finish.</td>
        </tr>
        <tr>
            <td>grid<div><sup>data-grid</sup></div></td>
            <td>false</td>
            <td>boolean</td>
            <td>Enables grid of values.</td>
        </tr>
        <tr class="options__new">
            <td>grid_num<div><sup>data-grid-num</sup></div></td>
            <td>4</td>
            <td>number</td>
            <td>Number of grid units.</td>
        </tr>
	 	<tr>
            <td>show_impact_line<div><sup>-</sup></div></td>
            <td>false</td>
            <td>boolean</td>
            <td>The line on a double slider is colored as<br>green-[slider]-yellow-[slider]-red</td>
        </tr>
        
		<tr>
            <td>ticks_on_line<div><sup>-</sup></div></td>
            <td>false</td>
            <td>boolean</td>
            <td>Place the ticks in the (first) grid on the line with the sliders.</td>
        </tr>
        <tr>
            <td>hide_min_max<div><sup>data-hide-min-max</sup></div></td>
            <td>true</td>
            <td>boolean</td>
            <td>Hides min and max labels</td>
        </tr>
        <tr class="options__step">
            <td>hide_from_to<div><sup>data-hide-from-to</sup></div></td>
            <td>false</td>
            <td>boolean</td>
            <td>Hide from and to lables</td>
        </tr>

        <tr>
            <td>prefix<div><sup>data-prefix</sup></div></td>
            <td>-</td>
            <td>string</td>
            <td>Set prefix for values. Will be set up right before the number: $100</td>
        </tr>
        <tr>
            <td>postfix<div><sup>data-postfix</sup></div></td>
            <td>-</td>
            <td>string</td>
            <td>Set postfix for values. Will be set up right after the number: 100k</td>
        </tr>
        <tr>
            <td>max_postfix<div><sup>data-max-postfix</sup></div></td>
            <td>-</td>
            <td>string</td>
            <td>Special postfix, used only for maximum value. Will be showed after handle will reach maximum right position. For example 0 - 100+</td>
        </tr>
        <tr class="options__new">
            <td>decorate_both<div><sup>data-decorate-both</sup></div></td>
            <td>true</td>
            <td>boolean</td>
            <td>Used for "double" type and only if prefix or postfix was set up. Determine how to decorate close values. For example: $10k - $100k or $10 - 100k</td>
        </tr>
        <tr class="options__step">
            <td>disable<div><sup>data-disable</sup></div></td>
            <td>false</td>
            <td>boolean</td>
            <td>Locks slider and makes it inactive.</td>
        </tr>

        <tr>
            <td>onStart<div><sup>-</sup></div></td>
            <td>null</td>
            <td>function</td>
            <td>Callback. Is called on slider start.</td>
        </tr>
        <tr>
            <td>onChange<div><sup>-</sup></div></td>
            <td>null</td>
            <td>function</td>
            <td>Callback. IS called on each values change.</td>
        </tr>
        <tr>
            <td>onFinish<div><sup>-</sup></div></td>
            <td>null</td>
            <td>function</td>
            <td>Callback. Is called than user releases handle.</td>
        </tr>
        <tr class="options__new">
            <td>onUpdate<div><sup>-</sup></div></td>
            <td>null</td>
            <td>function</td>
            <td>Callback. Is called than slider is modified by external methods <code>update</code> or <code>reset</code>.</td>
        </tr>
        <tr class="options__new">
            <td>buttons<div><sup>-</sup></div></td>
            <td>null</td>
            <td>JSON</td>
            <td>JSON-record with id or buttons for first, previous, (now,) next, and last value<br><code>{from: {buttonList}, to: {buttonList}}<br>{buttonList}=<br>{<br>  firstBtn: element or string,<br>previousBtn: element or string,<br>nowBtn: element or string,<br>nextBtn: element or string,<br>lastBtn: element or string<br>}</code>
		</td>
        </tr>
    </tbody>
</table>




## Copyright and License
This plugin is licensed under the [MIT license](https://github.com/NielsHolt/jquery-base-slider/LICENSE).

Copyright (c) 2015 [Niels Holt](https://github.com/NielsHolt)

## Contact information

Niels Holt <niels@steenbuchholt.dk>


## Credits and acknowledgements

Based on [Ion.Range Slider](https://github.com/IonDen/ion.rangeSlider) version **2.0.6** by [Denis Ineshin ](https://github.com/IonDen)

## Known bugs

## Troubleshooting

## Changelog



