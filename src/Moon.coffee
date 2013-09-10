do (window, document) ->
    # Main object of MoonJS
    Moon = (target, args) ->
        # this function acts like a 'enhanced' init
        return new Moon.fn.init(target, args)

    Moon.fn = Moon.prototype =
        _collection: []
        _stack: []
        _step: -1
        _callback: undefined
        # initializes everything. sets target/args values and [TODO] parse target/args errors
        init: (target, args) ->
            self = this
            # sets collection
            self._collection = self.getMoonCollection(target)
            return self

        # returns the collection of HTMLCollection or NodeList, that can be animated by Moon later
        getMoonCollection: (target) ->
            collection = []
            if !(target instanceof Array)
                aux = target
                target = []
                target.push aux
            for tgt in target
                if tgt instanceof NodeList || tgt instanceof HTMLCollection
                    collection.push el for el in tgt
                else if typeof tgt == "string"
                    selectedElements = document.querySelectorAll(tgt)
                    collection.push el for el in selectedElements
                else if !(tgt instanceof Array)
                    collection.push tgt
                else
                    collection.push el for el in tgt

            return collection

        # returns the prefix of a css style in "javascript" style. used mainly for css3
        getPrefix: (prop) ->
            prefixes = ["", "webkit", "moz", "ms", "O"]
            indexOfDash = prop.indexOf("-")
            while indexOfDash > -1
                # the letter after the dash is capitalized
                prop = prop.slice(0, indexOfDash) + prop.charAt(indexOfDash + 1).toUpperCase() + prop.slice(indexOfDash + 2)
                indexOfDash = prop.indexOf("-")
            for pre in prefixes
                if pre != ""
                    prop = prop.charAt(0).toUpperCase() + prop.slice(1)

                if document.documentElement.style[pre + prop]?
                    return pre + prop

        # defines an animation step. Moon animations must have at least one step
        animate: (args) ->
            self = this
            animationProps =
                duration: 0
                delay: 0
                easing: "ease"
                beforeAnimation: undefined
                afterAnimation: undefined

            for arg, value of args
                animationProps[arg] = value

            self._stack.push animationProps
            return self

        # play the animation and sets the end callback
        play: (callback) ->
            self = this
            self._callback = callback
            self._play()
            return self

        # "private" play function
        _play: ->
            self = this
            self._step++
            anm = self._stack[self._step]
            if typeof anm != "undefined" and anm != null
                # before animation function
                anm.beforeAnimation() if typeof anm.beforeAnimation == "function"
                for el in self._collection
                    el.style[self.getPrefix("transition")] = "#{anm.duration}ms all #{anm.easing} #{anm.delay}ms"
                    for key, value of anm
                        if key == "duration" or key == "delay" or key == "easing"
                            continue
                        el.style[self.getPrefix(key)] = value
                            
                nextTimeout = setTimeout ->
                    # after animation function
                    anm.afterAnimation() if typeof anm.afterAnimation == "function"
                    self._play()
                    clearTimeout(nextTimeout)
                , anm.delay + anm.duration

            else
                self._step = -1
                self._callback() if self._callback?

    Moon.fn.init.prototype = Moon.fn

    window.Moon = Moon