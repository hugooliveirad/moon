do (window, document) ->
    # Main object of MoonJS
    Moon = (target, args) ->
        # this function acts like a 'enhanced' init
        if window == this
            return new Moon(target, args)

        # Moon collection
        this._collection = Moon.fn.getMoonCollection(target)

        # Moon variables to control animation
        this._callback = undefined
        this._stack = []
        this._step = -1
        this._prefixes = {}
        this._loop = 1
        this._direction = true

        return this

    Moon.fn = Moon.prototype =
        _prefixes: {}
        # returns the collection of HTMLCollection or NodeList, that can be animated by Moon later
        getMoonCollection: (target) ->
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
        getPrefix: (prop) ->

            # check if Moon already tried to get this prefix
            if Moon.fn._prefixes[prop]?
                return Moon.fn._prefixes[prop]

            # if not, continue the search for it
            prefixes = ["webkit", "moz", "ms", "O"]

            indexOfDash = prop.indexOf("-")
            while indexOfDash > -1

                # the letter after the dash is capitalized
                prop = prop.slice(0, indexOfDash) + prop.charAt(indexOfDash + 1).toUpperCase() + prop.slice(indexOfDash + 2)
                indexOfDash = prop.indexOf("-")

            # is the propertie avaiable without prefix?
            if document.documentElement.style[prop]?
                Moon.fn._prefixes[prop] = prop
                return prop

            # if not, try to find the prefix
            propCap = Moon.fn.cap(prop)
            for pre in prefixes
                propertie = pre + propCap
                if document.documentElement.style[propertie]?
                    Moon.fn._prefixes[prop] = propertie
                    return propertie

        # capitalizes the first letter
        cap: (str) ->
            return str.charAt(0).toUpperCase() + str.slice(1);

        # defines an animation step. Moon animations must have at least one step
        animate: (args) ->
            animationProps =
                duration: 0
                delay: 0
                easing: "ease"
                beforeAnimation: undefined
                afterAnimation: undefined

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
                anm.beforeAnimation() if typeof anm.beforeAnimation == "function"

                # apply animation for each element
                for el in this._collection
                    el.style[this.getPrefix("transition")] = "#{anm.duration}ms all #{anm.easing} #{anm.delay}ms"

                    for key, value of anm
                        if key == "duration" || key == "delay" || key == "easing" || key == "beforeAnimation" || key == "afterAnimation"
                            continue
                        el.style[this.getPrefix(key)] = value
                

                nextTimeout = setTimeout =>
                    # after animation function
                    anm.afterAnimation() if typeof anm.afterAnimation == "function"

                    # continue chained animations
                    @._play()

                    clearTimeout(nextTimeout)
                , anm.delay + anm.duration

            # no more stacked animations
            else
                this._callback() if this._callback?
                this._step = -1

                # loopings that are numbers are finite
                if typeof this._loop == "number"
                    this._loop -= 1
                    if this._loop > 0
                        this._play()
                    else
                        this.reset()

                # strings are infinite
                else if typeof this._loop == "string"
                    if this._loop == "alternate"
                        this._direction = !this._direction
                        this._play()
                    else if this._loop == "infinite"
                        this._play()

            return this

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