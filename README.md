# jquery-base-slider

A plugin to create a slider.

## Installation
### bower
`bower install https://github.com/fcoo/jquery-base-slider.git --save`

## Demo
http://fcoo.github.io/jquery-base-slider/demo/ 

The demo shows the different effects of options `step`, `stepOffset`, and `majorTicksOffset`

## Options

### Type and slider
| Option | Defaults | Type | Description |
| :--: | :--: | :--: | :-- |
| `type` | `"single"` | `string` | Choose single or double, could be `"single"` - for one handle, or `"double"` for two handles | 
| `slider` | `"down"` | `string` | Choose slider type, could be `"horizontal"`, `"vertical"`, `"down"`, `"up"`, `"left"`, `"right"`, `"round"`, `"range"`, or `"fixed"`| 
| `readOnly` | `false` | `boolean` | Locks slider and makes it inactive. | 
| `disable` | `false` | `boolean` | Locks slider and makes it disable ("dissy"). | 
| `handleFixed` | `false` | `boolean` | Special version where the slider is fixed and the grid are moved left or right to select value. `slider` is set to `"single"`<br>A value for `options.width` OR `options.valueDistances` must be provided | 
| `mousewheel` | `true` | `boolean` | Only for `type:"single"`: Adds mousewheel-event to the parent-element of the slider. Works best if the parent-element only contains the slider and has a fixed height and width | 
| `resizable` | `false` | `boolean` | If `true` the container of the slider can be resized and the grid will automatic redraw to adjust number of ticks and labels to the new width | 


### Dimensions (only for `options.handleFixed: true`)
| Option | Defaults | Type | Description |
| :--: | :--: | :--: | :-- |
| `width` |  | `number` | The total width of the slider (in px for rem = 16px) | 
| `valueDistances` | `3` | `number` | The distance between each values on the slider (in px for rem = 16px).<br> Width will be `valueDistances*( max - min )` | 

### Ranges and value
| Option | Defaults | Type | Description |
| :--: | :--: | :--: | :-- |
| `min` | `10` | `number` | Set slider minimum value | 
| `max` | `100` | `number` | Set slider maximum value | 
| `from` | `min` | `number` | Set start position for left handle (or for single handle) | 
| `to` | `max` | `number` | Set start position for right handle | 
| `fromFixed` | `false` | `boolean` | Fix position of left (or single) handle. | 
| `fromMin` | `min` | `number` | Set minimum limit for left handle. | 
| `fromMax` | `max` | `number` | Set the maximum limit for left handle | 
| `toFixed` | `false` | `boolean` | Fix position of right handle. | 
| `toMin` | `min` | `number` | Set the minimum limit for right handle | 
| `toMax` | `max` | `number` | Set the maximum limit for right handle | 

### Pin
| Option | Defaults | Type | Description |
| :--: | :--: | :--: | :-- |
| `pinValue` | `null` | `number` | The value for the pin.<br>Use `setPin( value [, color] )` to change the value dynamical |
| `pinColor` | `"black"` | `string` | The color of the pin.<br>Use `setPin( value, color, icon )` to change the color dynamical |
| `pinIcon` | `"fa-map-marker"` | `string` | The class-name from [Fontawasome](http://fontawesome.io/) setting the icon used as pin.<br>Use `setPin( value, color, icon )` to change the icon dynamical |

### Steps
| Option | Defaults | Type | Description |
| :--: | :--: | :--: | :-- |
| `step` | `1` | `number` | Set sliders step. Always > 0. Could be fractional. | 
| `stepOffset` | `0` | `number` | When `step` > 1: Offset for the allowed values. Eq. Min=0, max=100, step=5, stepOffset=3 => allowed values=3,8,13,...,92,97 (3+N*5)<br>Only tested for `type="single"` | 
| `intervalMin` | `-` | `number` | Set minimum diapason between sliders. Only in "double" type | 
| `intervalMax` | `-` | `number` | Set maximum diapason between sliders. Only in "double" type | 
| `keyboardShiftStepFactor` | `5` | `number` | Step-factor when stepping using keyboard and holding down shift xor ctrl. Etc. shift-left compare to left |
| `keyboardPageStepFactor` | `20` | `number` | Step-factor when stepping pressing PgDn or PrUp or arrows and holding down shift and ctrl |
 

### Slide-line
| Option | Defaults | Type | Description |
| :--: | :--: | :--: | :-- |
| `lineColor` | `#428BCA` | `string` or `hex`  | The color of the line left of the slider (single) or between the two sliders (double) |
| `lineColors` | `null` | `array of {from, to, color}`  | List of color-records setting the color on the line. If `to` is missing the previous `from` is used | 
| `lineBackgroundColor` | `#d1d6e0` | `string` or `hex`  | The background color of the line | 
| `showImpactLineColor` | `false` | `boolean` | The line on a double slider is coloured as<br>green-[slider]-yellow-[slider]-red | 
| `impactLineColors` | `{green: "green", yellow: "yellow", red: "red"}` | `{green,yellow,red}` | The line colors used when `showImpactLineColor: true` | 
| `reverseImpactLineColor` | `false` | `boolean` | The line on a double slider is coloured as<br>red-[slider]-yellow-[slider]-green | 
| `barColor` | `null` | `string` | The color of the bar |
| `showBarColor` | `true` | `boolean` | The bar gets same color as the line | 


### Grid (ticks and label)
| Option | Defaults | Type | Description |
| :--: | :--: | :--: | :-- |
| `grid` | `false` | `boolean` | Enables grid of values. | 
| `majorTicks` | `null` | `number` | Nummber of `step` between major ticks. Default=null=> Calculated automatic | 
| `majorTicksOffset` | `0` | `number` | Offset for the values where a major ticks is placed. Eq. Min=0, max=100 => major ticks on values=0,10,20,..,90,100. With `majorTicksOffset:4` the major ticks would be placed on values=4,14,24,...,84,94 | 
| `showMinorTicks` | `true` | `boolean` | Show minor ticks. | 
| `gridDistances` | `[1, 2, 5, 10, 20, 50, 100]` | `array of number` | Distance between major ticks. E.g. Slider with hours could use [1, 2, 4, 12, 24] |
| `ticksOnLine` | `false` | `boolean` | Place the ticks in the (first) grid on the line with the sliders. | 
| `gridColors` | `null` | `[]` | `Array of { [fromValue, ]value, color }` to set colors on the bar. If no `fromValue` is given the the previous `value` is used.<br>If `value == null or < min` => A triangle is added to the left indicating *below min*<br>If `value > max` =>  A triangle is added to the right indicating *above max*   |  
| `labelColors` | `null` | `[]` | `Array of {value, className, color, backgroundColor}` to set frame around and `className`, `color`, `backgroundColor` for the label with the given value |
| `labelClickable` | `true` | `boolean` | Allows click on labels to select value of label. If `false` a click on a label is equal to a click on the line (e.q. find nearest value) | 
| `labelClickableFullWidth` | `true` | `boolean` | If `true` and `options.labelClickable: true` and the value of the label is selectable (with respect to options.step and options.stepOffset) the clickable width of the label is expanded to half the distance to the neighbour labels | 


### Markers above slider 
| Option | Defaults | Type | Description |
| :--: | :--: | :--: | :-- |
| `showMinMax` | `false` | `boolean` | Show min and max markers | 
| `showFromTo` | `true` | `boolean` | Show from and to markers | 
| `markerFrame` | `false` | `boolean` | Frame the from- and to-marker | 


### Adjust marker and labels
| Option | Defaults | Type | Description |
| :--: | :--: | :--: | :-- |
| `prettify` | `null` | `function` | Set up your prettify function. Can be anything. For example, you can set up unix time as slider values and than transform them to cool looking dates. | 
| `prettifyLabel` | `null` | `function` | As `prettify` but for the labels in the grid. | 
| `prefix` | `-` | `string` | Set prefix for values. Will be set up right before the number: Ex. `$100` | 
| `postfix` | `-` | `string` | Set postfix for values. Will be set up right after the number: Ex. `100k` | 
| `decorateBoth` | `true` | `boolean` | Used for "double" type and only if prefix or postfix was set up. Determine how to decorate close values. For example: `$10k - $100k` or `$10 - 100k` | 
| `decorateLabel` | `false` | `boolean` | The labels in the grid also gets `prefix` and/or `postfix` | 
| `valuesSeparator` | `" - "` | `string` | Text between min and max value when labels are combined. `valuesSeparator:" to "` => `"10 to 100"` |


### Callback

| Option | Defaults | Type | Description |
| :--: | :--: | :--: | :-- |
| `onCreate` | `null` | `function` | Called when the slider is created the first time | 
| `onUpdate` | `null` | `function` | Callback. Is called when the slider is modified by external methods `update` or `reset` | 
| `onChanging` | `null` | `function` | Is called every time any values are changed. Also on dragging a handle. See note below |
| `onChange` | `null` | `function` | Is called when the value, from, or to  value are changed. See note below |
| `onChangeOnDragging` | `true` | `boolean` | If `false` `onChange`-function is only called when dragging the sliding is finish | 
| `onChangeDelay` | `500` | `number` | If `onChangeOnDragging` is `false` the `onChange`-function is called when the slider has been on the same tick for `onChangeDelay` milliseconds | 

#### Note
If `onChangeOnDragging == false` the different between `onChange` and `onChanging` is that `onChanging` is called on every change while `onChange` only is called after `onChangeDelay` ms without any changes

If `onChangeOnDragging == true` `onChange` and `onChanging` are called on every change and only on is needed 


### Buttons
| Option | Defaults | Type | Description |
| :--: | :--: | :--: | :-- |
| `buttons` | `null` | `JSON` |  | 
#### Description
JSON-record with id or buttons for first, previous, (now,) next, and last value
    
    options.buttons = {
        from: {buttonList}, 
        to  : {buttonList}
    }
    {buttonList} = {
        firstBtn   : element or string,
        previousBtn: element or string,
        nowBtn     : element or string,
        nextBtn    : element or string,
        lastBtn    : element or string
    }


## Methods

	.adjustValue( value )			: Return value adjusted to fit with min, max, step, and stepOffset
	.setValue( value )				 
	.setFromValue: function( value )   
	.setToValue: function( value )	
	.setPin( value, color )

## Modernizr
To have correct `hover` effect on the slider it is necessary to include [modernizr](https://modernizr.com/) test *Touch Events* setting `<html>` class `"touchevents"` or `"no-touchevents"`

## Copyright and License
This plugin is licensed under the [MIT license](https://github.com/NielsHolt/jquery-base-slider/LICENSE).

Copyright (c) 2015 [Niels Holt](https://github.com/NielsHolt)

## Contact information

Niels Holt <nho@fcoo.dk>


## Credits and acknowledgements

jquery-base-slider is forked from the great work by [Denis Ineshin ](https://github.com/IonDen) on [Ion.Range Slider](https://github.com/IonDen/ion.rangeSlider)
jquery-base-slider is based on version **2.0.6**

