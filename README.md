Moon.js
====

Powerful JavaScript animation framework that uses CSS3 transitions

##Why not to use it yet

Moon.js is in it's early days and should not be used in production environment (don't even think about it!). Although you are encouraged to help us build a lightweight and library-agnostic modern JavaScript animation framework that uses CSS3 transitions to make it really smooth in every modern browser.

If you want to test it, just download the minified version and include it anywhere on your website:

```html
<script src="moon.min.js"></script>
```

##What it is

You already know that Moon.js wants to be as simple as possible. To achieve this goal, we need to make the hard work transparent to the user. No new strange conventions or strange function names. Want to set an animation? `Moon("#selector").animate()`. Want to play the animation? Just use `.play()`.

But sometimes you need horse power to bring to reality that crazy animation idea. Moon.js wants to give you this power the easiest way possible, the better way possible. If you want it too, help us bring this dream (and your dream) to reality by contributing with tips and coffee code.

##Understanding it
*Notice: not everything explained after this notice is working. Some functions will just crash and explode the internet. Yes, I will repeat: DO NOT USE THIS IN PRODUCTION ENVIRONMENTS YET.*

###Moon()
```javascript
Moon(["#selector" | HTMLCollection | NodeList]);
```
`Moon()` function is the main function of Moon.js. It accepts an array of CSS selectors, HTMLCollections or NodeLists and returns an Moon instance (internally named Moon.pt). What you can do with it? Animate everything, of course! How? Take a look:

###animate()

```javascript
.animate({"propertie": "value"});
```

The `animate()` function is a function of Moon.pt, and works with any Moon instance. To use it, you just have to pass the properties you want to change as a JavaScript object. You can than use `"duration": 1000`, `"delay": 500` (in milliseconds) and `"easing": "ease"` to change the behavior of your animation.

To create chained animations, just use:
```javascript
Moon("#selector").animate().animate()
```

Yes, it's this simple.

###play()

```javascript
.play(callback);
```

In order to play a Moon.js animation, you must use `play()`. It is a function of Moon.pt just as `.animate()`. `play()` plays (Ohh!) the animations that were defined using `.animate()` and fires a callback function right at the end of everything.

##Examples
###Simple animation (fade out in 1 second with 500ms of delay):
**CoffeeScript**
```coffeescript
Moon("#selector").animate
    "opacity": "0"
    "duration": 1000
    "delay": 500
.play()
```
**JavaScript**
```javascript
Moon("#selector").animate({
    "opacity": "0",
    "duration": 1000,
    "delay": 500
}).play();
```

###Chained animations (fade out in 1 second and fade in in 500ms):
**CoffeeScript**
```coffeescript
Moon("#selector").animate
    "opacity": "0"
    "duration": 1000
.animate
    "opacity": "1"
    "duration": 500
.play()
```

**JavaScript**
```javascript
Moon("#selector").animate({
    "opacity": "0",
    "duration": 1000
}).animate({
    "opacity": "1",
    "duration": 500
}).play();
```

###Two elements animation (fade out):
**CoffeeScript**
```coffeescript
# Moon.js accepts an array of elements. In the array you can also pass a HTMLCollection or NodeList.
Moon(["#selector", document.querySelectorAll(".selector")]).animate
    "opacity": "0"
    "duration": 1000
.play()
```

**JavaScript**
```javascript
// Moon.js accepts an array of elements. In the array you can also pass a HTMLCollection or NodeList.
Moon(["#selector", document.querySelectorAll(".selector")]).animate({
    "opacity": "0",
    "duration": 1000
}).play();
```

###Animation with callback:
**CoffeeScript**
```coffeescript
Moon("#selector").animate
    "opacity": "0"
    "duration": 1000
.play ->
    console.log "callback function"
```

**JavaScript**
```javascript
Moon("#selector").animate({
    "opacity": "0",
    "duration": 1000
}).play(function(){
    console.log("callback function");
});
```

###Animation with before, after and callback calls
**CoffeeScript**
```coffeescript
Moon("#selector").animate
    "opacity": "0"
    "duration": 1000
    "beforeAnimation": (moon) ->
        console.log "First animation is playing"
    "afterAnimation": (moon) ->
        console.log "First animation stopped"
.animate
    "opacity": "1"
    "duration": 1000
    "beforeAnimation": (moon) ->
        console.log "Second animation is playing"
    "afterAnimation": (moon) ->
        console.log "Second animation stopped"
.play (moon) ->
    console.log "Everything ended"
```

**JavaScript**
```javascript
Moon("#selector").animate({
    "opacity": "0",
    "duration": 1000,
    "beforeAnimation": function () {
        console.log("First animation is playing");
    }
    "afterAnimation": function () {
        console.log("Second animation stopped");
    }
}).animate({
    "opacity": "1"
    "duration": 1000
    "beforeAnimation": function () {
        console.log("Second animation is playing");
    }
    "afterAnimation": function () {
        console.log("Second animation stopped");
    }
}).play(function () {
    console.log("Everything ended");
});
```
    

##Go wild
**Moon.js** gives you the power to create animations dynamically using JavaScript. Better than that, Moon.js uses CSS3 transitions to create smooth animations for modern webapps. These pre-release functions are simple, but you already have a lot of options on your hand.

You can create animations that are called after other animations, animations that affects many elements, chained complex animations or even a GUI that chains animations and plays it when you want.

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

##Wrap-up

For now, I'll improve these main functions to deploy a v0.1 as soon as possible. Feel free to send pull requests with improvements to existing code or fill issues with feature requests. To maintain my sanity, please do not report bugs yet. You know, I just started this thing. When a pre-release version shows up, I will be happy if you send bug reports and even unit tests to ensure it will never happen again.

##Contact

I'm reachable at Twitter ([@hugobessaa](https://twitter.com/hugobessaa)), ADN ([@bessa](https://alpha.app.net/bessa)) or email ([hugobessaa+moon@gmail.com](mailto:hugobessaa+moon@gmail.com)). Contact me. I work full-time and study, but I will reply you.

##History
- [v0.0.3.1](https://github.com/hugobessaa/moon/releases/tag/v0.0.3.1) - September 4, 2013
	- ignore *.swo files
	- Moon.pt passed as argument for beforeAnimation, afterAnimation and
	  callback
- [v0.0.3](https://github.com/hugobessaa/moon/releases/tag/v0.0.3) - September 3, 2013
	- beforeAnimation and afterAnimation functions
	- QUnit tests
	- ignore *.swp files

##License

MIT, freak out …and read the LICENSE file.
