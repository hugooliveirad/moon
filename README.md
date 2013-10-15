Moon.js
====
[![Build Status](https://travis-ci.org/hugobessaa/moon.png?branch=master)](https://travis-ci.org/hugobessaa/moon)

> Powerful JavaScript animation framework that uses CSS3 transitions

##Why not to use it yet

Moon.js is in it's early days and should not be used in production environment (don't even think about it!). Although you are encouraged to help us build a lightweight and library-agnostic modern JavaScript animation framework that uses CSS3 transitions to make it really smooth in every modern browser.

If you want to test it, just download the minified version and include it anywhere on your website:

```html
<script src="moon.min.js"></script>
```

##What it is

You already know that Moon.js wants to be as simple as possible. To achieve this goal, we need to make the hard work transparent to the user. No new strange conventions or strange method names. Want to set an animation? `Moon("#selector").animate()`. Want to play the animation? Just use `.play()`.

But sometimes you need horse power to bring to reality that crazy animation idea. Moon.js wants to give you this power the easiest way possible, the better way possible. If you want it too, help us bring this dream (and your dream) to reality by contributing with tips and coffee code.

##Understanding it
*Notice: not everything explained after this notice is working. Some functions will just crash and explode the internet. Yes, I will repeat: DO NOT USE THIS IN PRODUCTION ENVIRONMENTS YET.*

###Moon()
```javascript
Moon("#selector" | HTMLCollection | NodeList);
```
`Moon()` function is the main function of Moon.js. It accepts an array of CSS selectors, HTMLCollections or NodeLists and returns a Moon object. This magical object has some prototyped methods. What you can do with it? Animate everything, of course! How? Take a look:

###animate()

```javascript
.animate({"property": "value"});
```

The `animate()` works with any Moon object. To use it, you just have to pass the properties you want to change as a JavaScript object. You can than use `"duration": 1000`, `"delay": 500` (in milliseconds) and `"easing": "ease"` to change the behavior of your animation.

To create chained animations, just use:
```javascript
Moon("#selector").animate().animate();
```

Yes, it's this simple.

There are callbacks too. Take a look at the [EXAMPLES.md file](https://github.com/hugobessaa/moon/blob/master/EXAMPLES.md).

###loop()

```javascript
.loop(2 | "infinite" | "alternate");
```

So you want to loop your animations? Just use the `loop()` method to set the loops as you want. You can pass an `integer` as the number of times the animation will repeat or `"infinite"` or `"alternate"`. Use without moderation.

###play()

```javascript
.play(callback);
```

In order to play a Moon.js animation, you must use `play()`. `play()` plays (Ohh!) the animations that were defined using `.animate()` and fires a callback function right at the end of everything.

The callback function will be fired at the end of each loop if you are looping with `"infinite"` or `"alternate"`.

*We believe it's better to have a `play()` method instead of playing the animation right after calling the `animate()` method. With Moon, you can build your entire animation before playing it.*

###pause()

```javascript
.pause();
```

If you want to pause animations, you can use `pause()` method. Unlike others JavaScript animation frameworks that uses CSS3 transitions, Moon is able to pause mid-animation.

The only drawback compared to ultra-robust (and ultimately fat) animation frameworks is that Moon do not continues an easing function. So, it will play the easing from the beginning. This issue will be addressed in a future extension.

###set()

```javascript
.set({"property": "value"});
```

Not always you want to set some property you want to animate it. Using all the power of Moon to change CSS properties, the `set()` method will just work. Vendor prefixes headache not included.

*Altough `set()` does not set a transition property for the elements, it do not erase it too. If you want to be sure that not a single property will be animated, set `transition` to `null`. We do this when an animation chain ends on Moon.*

###reset()

```javascript
.reset();
```

Reset any animation or configuration done to a Moon object. Great if you want to start another animation with the same objects.

##Examples
See full examples on how to use Moon in the [EXAMPLES.md file](https://github.com/hugobessaa/moon/blob/master/EXAMPLES.md)
    

##Go wild
**Moon.js** gives you the power to create animations dynamically using JavaScript. Better than that, Moon.js uses CSS3 transitions to create smooth animations for modern webapps. These pre-release functions are simple, but you already have a lot of options on your hand.

You can create animations that are called after other animations, animations that affects many elements, chain complex animations or even a GUI that chains animations and plays it when you want.

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

##Wrap-up

For now, I'll improve these main functions to deploy a v0.1 as soon as possible. Feel free to send pull requests with improvements to existing code or fill issues with feature requests. To maintain my sanity, please do not report bugs yet. You know, I just started this thing. When a RC version shows up, I will be happy if you send bug reports and even unit tests to ensure it will never happen again.

##Contact

I'm reachable at Twitter ([@hugobessaa](https://twitter.com/hugobessaa)), ADN ([@bessa](https://alpha.app.net/bessa)) or email ([hugobessaa+moon@gmail.com](mailto:hugobessaa+moon@gmail.com)). Contact me. I work full-time and study, but I will reply you.

##History
Follow version logs and releases at [the releases page](https://github.com/hugobessaa/moon/releases)

##License

MIT, freak out
