#Examples
##Simple animation
*fade out in 1 second with 500ms of delay*

```javascript
Moon("#selector").animate({
    "opacity": "0",
    "duration": 1000,
    "delay": 500
}).play();
```

##Chained animations
*fade out in 1 second and fade in in 500ms*

```javascript
Moon("#selector").animate({
    "opacity": "0",
    "duration": 1000
}).animate({
    "opacity": "1",
    "duration": 500
}).play();
```

##Two elements animation
*fade out*

```javascript
// Moon.js accepts an array of elements.
// In the array you can also pass a HTMLCollection or NodeList.
Moon(["#selector", document.querySelectorAll(".selector")]).animate({
    "opacity": "0",
    "duration": 1000
}).play();
```

##Animation with callback:

```javascript
Moon("#selector").animate({
    "opacity": "0",
    "duration": 1000
}).play(function(){
    console.log("callback function");
});
```

##Animation with before, after and callback calls

```javascript
Moon("#selector").animate({
    "opacity": "0",
    "duration": 1000,
    "before": function () {
        console.log("First animation is playing");
    },
    "after": function () {
        console.log("First animation stopped");
    }
}).animate({
    "opacity": "1",
    "duration": 1000,
    "before": function () {
        console.log("Second animation is playing");
    },
    "after": function () {
        console.log("Second animation stopped");
    }
}).play(function () {
    console.log("Everything ended");
});
```

##Animation with loop

*finite*

```javascript
Moon("#selector").animate({
    "opacity": "0",
    "duration": 1000
}).animate({
    "opacity": "1"
    "duration": 1000
}).loop(3).play();
```
*infinite*

```javascript
Moon("#selector").animate({
    "opacity": "0",
    "duration": 1000
}).animate({
    "opacity": "1"
    "duration": 1000
}).loop("infinite").play();
```

*alternate*

```javascript
Moon("#selector").animate({
    "opacity": "0",
    "duration": 1000
}).animate({
    "opacity": "1"
    "duration": 1000
}).loop("alternate").play();
```

##Set a properties without animation

```javascript
Moon("#selector").set({
    "transform": "scale(3)",
    "background-color": "red"
});
```