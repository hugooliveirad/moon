# Main object of MoonJS
Moon = (target, args) ->
    # returns a new Moon object instance
    return new Moon.pt.init(target, args)

Moon.pt = Moon.prototype =
    _collection: []
    _stack: []
    _step: -1
    _callback: undefined

    # initializes everything. sets target/args values and [TODO] parse target/args errors
    init: (target, args) ->
        # sets collection
        Moon.pt._collection = Moon.pt.getMoonCollection(target)
        return Moon.pt

    # returns the collection of HTMLCollection or NodeList, that can be animated by Moon later
    getMoonCollection: (target) ->
        collection = []
        if target instanceof NodeList || target instanceof HTMLCollection
            collection.push el for el in target
        else if typeof target == "string"
            selectedElements = document.querySelectorAll(target)
            collection.push el for el in selectedElements
        else if !(target instanceof Array)
            collection.push target
        else
            collection = target

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

    # defines a animation step. Moon animations must have at least one step
    animate: (args) ->
        animationProps =
            duration: 0
            delay: 0
            easing: "ease"

        for arg, value of args
            animationProps[arg] = value

        Moon.pt._stack.push animationProps
        return Moon.pt

    # play the animation and sets the end callback
    play: (callback) ->
        Moon.pt._callback = callback
        Moon.pt._play()

    # "private" play function
    _play: ->
        Moon.pt._step++
        anm = Moon.pt._stack[Moon.pt._step]
        if typeof anm != "undefined" and anm != null
            for el in Moon.pt._collection
                el.style[Moon.pt.getPrefix("transition")] = "#{anm.duration}ms all #{anm.easing} #{anm.delay}ms"
                for key, value of anm
                    if key == "duration" or key == "delay" or key == "easing"
                        continue
                    el.style[Moon.pt.getPrefix(key)] = value
                        
            nextTimeout = setTimeout ->
                Moon.pt._play()
                clearTimeout(nextTimeout)
            , anm.duration

        else
            Moon.pt._step = -1
            Moon.pt._callback() if Moon.pt._callback?
        