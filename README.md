Moon.js [![Build Status](https://travis-ci.org/hugobessaa/moon.png?branch=master)](https://travis-ci.org/hugobessaa/moon)
====
> Powerful JavaScript animation framework that uses CSS3 transitions

## Notice

This was an experimental project. Not even close to be production ready. Learned a lot with it and so can you! I'll be happy to aswer anything, but no real support should be expected.

## How to use

Moon is a simple JavaScript animation framework that uses CSS3 transitions to provide smooth animations. It has no dependencies and weights less than a KB when minified and gziped. To use it, just [download it](https://raw.github.com/hugobessaa/moon/master/lib/moon.min.js) and include it before your scripts.

```html
<script src="js/moon.min.js"></script>
<script src="js/your-script.js"></script>
```

## Reference
Moon would be useless if no body could use it. So, here is the reference of its methods

### Moon()
> The main one

```javascript
Moon("#selector" || HTMLCollection || NodeList]);
```
`Moon()` function is the main function of Moon.js. It accepts an array of CSS selectors, HTMLCollections or NodeLists and returns a Moon object. This magical object has some prototyped methods. What you can do with it? Animate everything, of course! How? Take a look:

### .animate()
> Where magic is spelled

```javascript
.animate({"property": "value"});
```

The `animate()` works with any Moon object. To use it, you just have to pass the properties you want to change as a JavaScript object. You can than use `"duration": 1000`, `"delay": 500` (in milliseconds) and `"easing": "ease"` to change the behavior of your animation. You don't even need to use prefixes.

To create chained animations, just use:
```javascript
Moon("#selector").animate().animate();
```

Yes, it's this simple.

There are callbacks too. Take a look at the [EXAMPLES.md file](https://github.com/hugobessaa/moon/blob/master/EXAMPLES.md).

### loop()
> Didn't you see? Let me repeat it for you

```javascript
.loop(2 | "infinite" | "alternate");
```

So you want to loop your animations? Just use the `loop()` method to set the loops as you want. You can pass an `integer` as the number of times the animation will repeat or `"infinite"` or `"alternate"`. Use without moderation.

### .play()
> Let's the magic begin

```javascript
.play(callback);
```

In order to play a Moon.js animation, you must use `.play()`. `.play()` plays (Ohh!) the animations that were defined using `.animate()` and fires a callback function right at the end of everything.

The callback function will be fired at the end of each loop if you are looping with `"infinite"` or `"alternate"`.

*We believe it's better to have a `play()` method instead of playing the animation right after calling the `animate()` method. With Moon, you can build your entire animation before playing it.*

### .pause()
> Hey you! Freeze!

```javascript
.pause();
```

If you want to pause animations, you can use `pause()` method. Unlike other JavaScript animation frameworks that uses CSS3 transitions, Moon is able to pause mid-animation.

The only drawback compared to ultra-robust (and ultimately fat) animation frameworks is that Moon do not continues an easing function. So, it will play the easing from the beginning. This issue will be addressed in a future extension.

### .set()
> Stay here

```javascript
.set({"property": "value"});
```

Not always you want to set some property you want to animate it. Using all the power of Moon to change CSS properties, the `.set()` method will just work. Vendor prefixes headache not included.

*Altough `.set()` does not set a transition property for the elements, it do not erase it too. If you want to be sure that not a single property will be animated, set `transition` to `null`. We do this when an animation chain ends on Moon.*

### .reset()
> Go back, brother

```javascript
.reset();
```

Reset any animation or configuration done to a Moon object. Great if you want to start another animation with the same objects.

*Styles applied to the element will not be reseted too. Just the properties of the Moon object itself.*

## Examples
See full examples on how to use Moon in the [EXAMPLES.md file](https://github.com/hugobessaa/moon/blob/master/EXAMPLES.md)
    

## Go wild
**Moon.js** gives you the power to create animations dynamically using JavaScript. Better than that, Moon.js uses CSS3 transitions to create smooth animations for modern webapps. It's simple, but you already have a lot of options on your hand.

You can create animations that are called after other animations, animations that affects many elements, chain complex animations or even a GUI that chains animations and plays it when you want. Your imagination is the limit.

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b feature/my-new-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/my-new-feature`
5. Submit a pull request :D

## History
Follow version logs and releases at [the releases page](https://github.com/hugobessaa/moon/releases)

## License

MIT, freak out.

## Contact

I'm reachable at Twitter ([@hugobessaa](https://twitter.com/hugobessaa)), ADN ([@bessa](https://alpha.app.net/bessa)) or email ([hugobessaa+moon@gmail.com](mailto:hugobessaa+moon@gmail.com)). Contact me. I work full-time and study, but I will reply you.
