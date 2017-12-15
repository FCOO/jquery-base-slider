# jquery-base-slider

A plugin to create a slider.

## Installation
### bower
`bower install https://github.com/fcoo/jquery-base-slider.git --save`

## Demo
http://fcoo.github.io/jquery-base-slider/demo/ 

The demo shows the different effects of options `step`, `step_offset`, and `major_ticks_offset`

## Options

### Type and slider
| Option | Defaults | Type | Description |
| :--: | :--: | :--: | :-- |
| `type` | `"single"` | `string` | Choose single or double, could be `"single"` - for one handle, or `"double"` for two handles | 
| `slider` | `"down"` | `string` | Choose slider type, could be `"horizontal"`, `"vertical"`, `"down"`, `"up"`, `"left"`, `"right"`, `"round"`, `"range"`, or `"fixed"`| 
| `read_only` | `false` | `boolean` | Locks slider and makes it inactive. | 
| `disable` | `false` | `boolean` | Locks slider and makes it disable ("dissy"). | 
| `fixed_handle` | `false` | `boolean` | Special version where the slider is fixed and the grid are moved left or right to select value. `slider` is set to `"single"`<br>A value for `options.width` OR `options.value_distances` must be provided | 
| `clickable` | `true` | `boolean` | Allows click on lables and line. Default = `true` except for `fixed_handle:true` where default = `false` | 
| `mousewheel` | `true` | `boolean` | Only for `type:"single"`: Adds mousewheel-event to the parent-element of the slider. Works best if the parent-element only contains the slider and has a fixed height and width | 


### Dimensions (only for `options.fixed_handle: true`)
| Option | Defaults | Type | Description |
| :--: | :--: | :--: | :-- |
| `width` |  | `number` | The total width of the slider (in px for rem = 16px) | 
| `value_distances` | `3` | `number` | The distance between each values on the slider (in px for rem = 16px).<br> Width will be `value_distances*( max - min )` | 

### Ranges and value
| Option | Defaults | Type | Description |
| :--: | :--: | :--: | :-- |
| `min` | `10` | `number` | Set slider minimum value | 
| `max` | `100` | `number` | Set slider maximum value | 
| `from` | `min` | `number` | Set start position for left handle (or for single handle) | 
| `to` | `max` | `number` | Set start position for right handle | 
| `from_fixed` | `false` | `boolean` | Fix position of left (or single) handle. | 
| `from_min` | `min` | `number` | Set minimum limit for left handle. | 
| `from_max` | `max` | `number` | Set the maximum limit for left handle | 
| `to_fixed` | `false` | `boolean` | Fix position of right handle. | 
| `to_min` | `min` | `number` | Set the minimum limit for right handle | 
| `to_max` | `max` | `number` | Set the maximum limit for right handle | 

### Pin
| Option | Defaults | Type | Description |
| :--: | :--: | :--: | :-- |
| `pin_value` | `null` | `number` | The value for the pin.<br>Use `setPin( value [, color] )` to change the value dynamical |
| `pin_color` | `"black"` | `string` | The color of the pin.<br>Use `setPin( value, color, icon )` to change the color dynamical |
| `pin_icon` | `"fa-map-marker"` | `string` | The class-name from [Fontawasome](http://fontawesome.io/) setting the icon used as pin.<br>Use `setPin( value, color, icon )` to change the icon dynamical |

### Steps
| Option | Defaults | Type | Description |
| :--: | :--: | :--: | :-- |
| `step` | `1` | `number` | Set sliders step. Always > 0. Could be fractional. | 
| `step_offset` | `0` | `number` | When `step` > 1: Offset for the allowed values. Eq. Min=0, max=100, step=5, step_offset=3 => allowed values=3,8,13,...,92,97 (3+N*5)<br>Only tested for `type="single"` | 
| `min_interval` | `-` | `number` | Set minimum diapason between sliders. Only in "double" type | 
| `max_interval` | `-` | `number` | Set maximum diapason between sliders. Only in "double" type | 
| `keyboard_shift_step_factor` | `5` | `number` | Step-factor when stepping using keyboard and holding down shift xor ctrl. Etc. shift-left compare to left |
| `keyboard_page_step_factor` | `20` | `number` | Step-factor when stepping pressing PgDn or PrUp or arrows and holding down shift and ctrl |
 

### Slide-line
| Option | Defaults | Type | Description |
| :--: | :--: | :--: | :-- |
| `lineColor` | `#428BCA` | `string` or `hex`  | The color of the line left of the slider (single) or between the two sliders (double) |
| `lineBackgroundColor` | `#d1d6e0` | `string` or `hex`  | The background color of the line | 
| `showImpactLineColor` | `false` | `boolean` | The line on a double slider is coloured as<br>green-[slider]-yellow-[slider]-red | 
| `impactLineColors` | `{green: "green", yellow: "yellow", red: "red"}` | `{green,yellow,red}` | The line colors used when `showImpactLineColor: true` | 
| `reverseImpactLineColor` | `false` | `boolean` | The line on a double slider is coloured as<br>red-[slider]-yellow-[slider]-green | 


| `bar_color` | `null` | `string` | The color of the bar |
| `show_bar_color` | `true` | `boolean` | The bar gets same color as the line | 


### Grid (ticks and text)
| Option | Defaults | Type | Description |
| :--: | :--: | :--: | :-- |
| `grid` | `false` | `boolean` | Enables grid of values. | 
| `major_ticks` | `null` | `number` | Nummber of `step` between major ticks. Default=null=> Calculated automatic | 
| `major_ticks_offset` | `0` | `number` | Offset for the values where a major ticks is placed. Eq. Min=0, max=100 => major ticks on values=0,10,20,..,90,100. With `major_ticks_offset:4` the major ticks would be placed on values=4,14,24,...,84,94 | 
| `show_minor_ticks` | `true` | `boolean` | Show minor ticks. | 
| `gridDistances` | `[1, 2, 5, 10, 20, 50, 100]` | `array of number` | Distance between major ticks. E.g. Slider with hours could use [1, 2, 4, 12, 24] |
| `ticks_on_line` | `false` | `boolean` | Place the ticks in the (first) grid on the line with the sliders. | 
| `grid_colors` | `null` | `[]` | `Array of { [fromValue, ]value, color }` to set colors on the bar. If no `fromValue` is given the the previous `value` is used.<br>If `value == null or < min` => A triangle is added to the left indicating *below min*<br>If `value > max` =>  A triangle is added to the right indicating *above max*   |  
| `labelColors` | `null` | `[]` | `Array of {value, className, color, backgroundColor}` to set frame around and `className`, `color`, `backgroundColor` for the label with the given value |



### Markers above slider 
| Option | Defaults | Type | Description |
| :--: | :--: | :--: | :-- |
| `show_min_max` | `false` | `boolean` | Show min and max markers | 
| `show_from_to` | `true` | `boolean` | Show from and to markers | 
| `marker_frame` | `false` | `boolean` | Frame the from- and to-marker | 


### Adjust text and labels
| Option | Defaults | Type | Description |
| :--: | :--: | :--: | :-- |
| `prettify` | `null` | `function` | Set up your prettify function. Can be anything. For example, you can set up unix time as slider values and than transform them to cool looking dates. | 
| `prettify_text` | `null` | `function` | As `prettify` but for the text/labels in the grid. | 
| `prefix` | `-` | `string` | Set prefix for values. Will be set up right before the number: $100 | 
| `postfix` | `-` | `string` | Set postfix for values. Will be set up right after the number: 100k | 
| `decorate_both` | `true` | `boolean` | Used for "double" type and only if prefix or postfix was set up. Determine how to decorate close values. For example: $10k - $100k or $10 - 100k | 
| `decorate_text` | `false` | `boolean` | The text/labels in the grid also gets `prefix` and/or `postfix` | 
| `values_separator` | `" - "` | `string` | Text between min and max value when labels are combined. values_separator:" to " => "12 to 24" |


### Callback
| Option | Defaults | Type | Description |
| :--: | :--: | :--: | :-- |
| `onStart` | `null` | `function` | Callback. Is called on slider start. | 
| `onChange` | `null` | `function` | Callback. IS called on each values change. | 
| `onFinish` | `null` | `function` | Callback. Is called when the user releases handle. | 
| `onUpdate` | `null` | `function` | Callback. Is called than slider is modified by external methods `update` or `reset`. | 
| `callback` | `null` | `function` | Callback. Is called when the value, from, or to  value are changed. | 
| `callback_on_dragging` | `true` | `boolean` | If `false` `callback`-function is only called when dragging the sliding is finish. | 
| `callback_delay` | `500` | `number` | If `callback_on_dragging` is false the ``callback`-function` is called when the slider has been on the same tick for `callback_delay` milliseconds. Set to zero to avoid any callback before mouseup-event | 


### Buttons
| Option | Defaults | Type | Description |
| :--: | :--: | :--: | :-- |
| `buttons` | `null` | `JSON` | JSON-record with id or buttons for first, previous, (now,) next, and last value<br>`{from: {buttonList}, to: {buttonList}}<br>{buttonList}=<br>{<br>  firstBtn: element or string,<br>previousBtn: element or string,<br>nowBtn: element or string,<br>nextBtn: element or string,<br>lastBtn: element or string<br>}` | 



## Methods

	.adjustValue( value )			: Return value adjusted to fit with min, max, step, and step_offset
	.setValue( value )				 
	.setFromValue: function( value )   
	.setToValue: function( value )	
	.setPin( value, color )


## Copyright and License
This plugin is licensed under the [MIT license](https://github.com/NielsHolt/jquery-base-slider/LICENSE).

Copyright (c) 2015 [Niels Holt](https://github.com/NielsHolt)

## Contact information

Niels Holt <nho@fcoo.dk>


## Credits and acknowledgements

jquery-base-slider is forked from the great work by [Denis Ineshin ](https://github.com/IonDen) on [Ion.Range Slider](https://github.com/IonDen/ion.rangeSlider)
jquery-base-slider is based on version **2.0.6**

Please see the <a href="readme.ORG.md">original README.md</a> for how to use the ion.range.slider

In jquery-base-slider some of the original options have been removed and some new one added. Se the Settings section for a complete list

### New features
Compared with the original slider there are the following new features
1. The css is created using SASS
2. Four types of sliders (`default`, `small`, `round` and `range`)
2. The slider is resizeable using only `rem` as size unit.  
3. Automatic placement of minor ticks, major ticks and text/label
3. The slider will *not* recalculate grid when the container changes size
3. Possible to add more than one grid
4. Adding buttons to move from- and/or to-slider to previous, next, first or last value 
5. Click on text will move the slider
6. All settings is set using `options` No settings using `data-..` attribute on the `input`-element
7. New options: `pin_value`, = a value where a small pin is placed.
8. New options: `step_offset`, = the offset in selectable values when `step` > 1
9. New options: `major_ticks_offset`, = the offset in the values for major ticks. With `{min:0, max:100, major_ticks_offset:0}` the major ticks may be placed at 0,20,40,..,100. With `{..major_ticks_offset:4}` the major ticks will be placed at 4,24,44,..,94.

