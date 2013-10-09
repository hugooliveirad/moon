do (window, document) ->
    # Main object of MoonJS
    Moon = (target, args) ->
        self = this
        # this function acts like a 'enhanced' init
        if window == self
            return new Moon(target, args)

        # Moon collection
        self._collection = Moon.fn.getMoonCollection(target)

        # Moon variables to control animation
        self._callback = undefined
        self._stack = []
        self._step = -1
        self._prefixes = {}

        # init with the basic prefix
        self._prefixes["transition"] = Moon.fn.getPrefix("transition")
        return self

    Moon.fn = Moon.prototype =
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
            prefixes = ["webkit", "moz", "ms", "O"]
            indexOfDash = prop.indexOf("-")
            while indexOfDash > -1
                # the letter after the dash is capitalized
                prop = prop.slice(0, indexOfDash) + prop.charAt(indexOfDash + 1).toUpperCase() + prop.slice(indexOfDash + 2)
                indexOfDash = prop.indexOf("-")

            if document.documentElement.style[prop]?
                return prop

            for pre in prefixes
                propertie = pre + Moon.fn.cap(prop)
                if document.documentElement.style[propertie]?
                    return propertie
            

        # capitalizes the first letter
        cap: (str) ->
            return str.charAt(0).toUpperCase() + str.slice(1);

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

            self._stack.push(animationProps)
            return self

        # play the animation and sets the end callback
        play: (callback) ->
            self = this
            self._callback = callback
            self._play()
            return self

        # "private" play function for intern use
        _play: ->
            self = this
            self._step++
            anm = self._stack[self._step]
            if anm?
                # before animation function
                anm.beforeAnimation() if typeof anm.beforeAnimation == "function"

                # apply animation for each element
                for el in self._collection
                    el.style[self.getPrefix("transition")] = "#{anm.duration}ms all #{anm.easing} #{anm.delay}ms"

                    for key, value of anm
                        if key == "duration" || key == "delay" || key == "easing" || key == "beforeAnimation" || key == "afterAnimation"
                            continue
                        el.style[self.getPrefix(key)] = value
                            
                nextTimeout = setTimeout ->
                    # after animation function
                    anm.afterAnimation() if typeof anm.afterAnimation == "function"

                    # continue chained animations
                    self._play()

                    clearTimeout(nextTimeout)
                , anm.delay + anm.duration

            # no more stacked animations
            else
                self._callback() if self._callback?

                # reset Moon animation
                self._callback = undefined
                self._step = -1
                self._stack = []

            return self

    window.Moon = Moon