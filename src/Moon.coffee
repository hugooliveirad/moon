do (window, document) ->
    # Main object of MoonJS
    Moon = (target) ->
        # this function acts like a 'enhanced' init
        if window == this
            return new Moon(target)

        # Moon collection
        this._collection = Moon.fn._getMoonCollection(target)

        # Moon variables to control animation
        this._callback = undefined
        this._stack = []
        this._step = -1
        this._prefixes = {}
        this._loop = 1
        this._direction = true

        return this

    Moon.fn = Moon.prototype =
        # config object
        config:
            duration: 1000
            delay: 0
            easing: "ease"
            before: undefined
            after: undefined

        # already returned prefixes
        _prefixes: {}

        # default vendor prefixes
        _vendorPrefixes = ["webkit-", "moz-", "ms-", "O-"]

        # returns the collection of HTMLCollection or NodeList, that can be animated by Moon later
        _getMoonCollection: (target) ->
            collection = []
            if !(target instanceof Array)
                aux = target
                target = []
                target.push(aux)
            for tgt in target
                if tgt instanceof NodeList || tgt instanceof HTMLCollection
                    collection.push(el for el in tgt)
                else if typeof tgt == "string"
                    selectedElements = document.querySelectorAll(tgt)
                    collection.push(el for el in selectedElements)
                else if !(tgt instanceof Array)
                    collection.push(tgt)
                else
                    collection.push(el for el in tgt)

            return collection

        # returns the prefix of a css style in "javascript" style. Used mainly for css3
        _getPrefix: (prop) ->

            # check if Moon already tried to get this prefix
            if Moon.fn._prefixes[prop]?
                return Moon.fn._prefixes[prop]

            # camelCase properties
            prop = Moon.fn._camelize(prop)

            # is the property avaiable without prefix?
            if document.documentElement.style[prop]?
                Moon.fn._prefixes[prop] = prop
                return prop

            # if not, try to find the prefix
            for pre in Moon.fn._vendorPrefixes
                property = Moon.fn._camelize(pre + propCap)
                if document.documentElement.style[property]?
                    Moon.fn._prefixes[prop] = property
                    return property

        # capitalizes the first letter
        # this implementation is done before deep optimization research (#2)
        _camelize: (str) ->
            return str.replace(Moon.fn._rdashAlpha, Moon.fn._camelizeReplaceCallback)

        # RegExp to match the dash and the char after it
        _rdashAlpha: "/-([\D])/g"

        # _camelize replace callback function to return
        # just the capitalized char
        _camelizeReplaceCallback: ($1) ->
            return $1.charAt(1).toUpperCase()            

        # defines an animation step. Moon animations
        # must have at least one step
        animate: (args) ->
            animationProps =
                duration: Moon.config.duration
                delay: Moon.config.delay
                easing: Moon.config.easing
                before: Moon.config.before
                after: Moon.config.after

            for arg, value of args
                animationProps[arg] = value

            this._stack.push(animationProps)
            return this

        # play the animation and sets the end callback
        play: (callback) ->
            this._callback = callback
            this._play()
            return this

        # play function for intern use
        _play: ->
            this._step += 1
            if this._direction
                step = this._step
            else
                step = this._stack.length - 1 - this._step

            
            anm = this._stack[step]
            if anm?
                # before animation function
                anm.before() if typeof anm.before == "function"

                # apply animation for each element
                for el in this._collection
                    el.style[this._getPrefix("transition")] = "#{anm.duration}ms all #{anm.easing} #{anm.delay}ms"

                    for key, value of anm
                        if key == "duration" || key == "delay" || key == "easing" || key == "before" || key == "after"
                            continue
                        el.style[this._getPrefix(key)] = value
                

                nextTimeout = setTimeout =>
                    # after animation function
                    anm.after() if typeof anm.after == "function"

                    # continue chained animations
                    @._play()

                    clearTimeout(nextTimeout)
                , anm.delay + anm.duration

            # no more stacked animations
            else
                this._step = -1

                # loopings that are numbers are finite
                if typeof this._loop == "number"
                    this._loop -= 1
                    if this._loop > 0
                        this._play()
                    else
                        this._callback() if this._callback?
                        this.reset()

                # strings are infinite
                else if typeof this._loop == "string"
                    this._callback() if this._callback?
                    
                    if this._loop == "alternate"
                        this._direction = !this._direction
                        this._play()
                    else if this._loop == "infinite"
                        this._play()

            return this

        # sets properties without animating
        set: (args) ->
            for el in this._collection
                for key, value of args
                    el.style[this._getPrefix(key)] = value

        pause: ->
            for el in this._collection
                el.style[this._getPrefix("transition")] = null
                for key, prop of this._stack[this._step]
                    if key == "duration" || key == "delay" || key == "easing" || key == "before" || key == "after"
                        continue
                    el.style[this._getPrefix(key)] = window.getComputedStyle(el, null).getPropertyValue(key)

        # set loop
        loop: (looping) ->
            this._loop = looping
            return this

        # reset Moon animation
        reset: ->
            this._callback = undefined
            this._step = -1
            this._stack = []
            this._loop = 1
            this._direction = true

    window.Moon = Moon