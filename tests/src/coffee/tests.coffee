do(window, document) ->
    Tests =
        init: ->
            Tests.targets = document.querySelectorAll(".target")
            Tests.test()

        test: ->
            test("Moon main function", ->

                # Moon instance
                singleInstance = Moon("#target")
                ok(singleInstance instanceof Moon, "Moon should return a instance of itself")

                # Moon default values
                notStrictEqual(singleInstance._collection, null, "Moon instance must have a collection")
                notStrictEqual(singleInstance._callback, null, "Moon instance must have a callback")
                notStrictEqual(singleInstance._stack, null, "Moon instance must have a stack")
                notStrictEqual(singleInstance._step, null, "Moon instance must have a step")
                notStrictEqual(singleInstance._loop, null, "Moon instance must have a loop")
                notStrictEqual(singleInstance._direction, null, "Moon instance must have a direction")

                instances = {}
                instances.singleElement = Moon(Tests.targets[0])
                instances.nodeList = Moon(Tests.targets)
                instances.selectorSingle = Moon("#target-1")
                instances.selectorMulti = Moon(".target")
                instances.arraySameType = Moon(["#target-1", "#target-2"])
                instances.arrayDiffType = Moon(["#target-1", Tests.targets, Tests.targets[0]])

                # Moon selector engine
                equal(instances.singleElement._collection.length, 1, "Expected 1")
                equal(instances.nodeList._collection.length, 5, "Expected 5")
                equal(instances.selectorSingle._collection.length, 1, "Expected 1")
                equal(instances.selectorMulti._collection.length, 5, "Expected 5")
                equal(instances.arraySameType._collection.length, 2, "Expected 2")
                equal(instances.arrayDiffType._collection.length, 7, "Expected 7")
            )
            
            test("Moon _camelize method", ->
                testingCamelize = Moon.fn._camelize("webkit-animation-timing-function")
                strictEqual(testingCamelize, "webkitAnimationTimingFunction", "should return camelized property")
            )

            test("Moon _getPrefix method", ->
                testingPrefix = Moon.fn._getPrefix("animation-timing-function")
                notStrictEqual(document.documentElement.style[testingPrefix], null, "should return a valid property")
            )

            test("Moon _getCssPrefix method", ->
                testignCssPrefix = Moon.fn._getCssPrefix("animation-timing-function")
                testignCssPrefixCamelized = Moon.fn._camelize(testignCssPrefix)
                notStrictEqual(document.documentElement.style[testignCssPrefixCamelized], null, "should return a valid CSS property")

                notStrictEqual(testignCssPrefix.indexOf("-"), -1, "should return hyphen-divided property")

                strictEqual(testignCssPrefix, testignCssPrefix.toLowerCase(), "should return lower-case property")
            )

            test("Moon animate method", ->
                myAnimation = Moon("#target-1").animate(
                    "opacity": "0"
                    "duration": 100
                    "easing": "ease-in-out"
                ).animate(
                    "opacity": "1"
                )

                notEqual(myAnimation._stack[0], null, "animation stack should be declared")

                strictEqual(myAnimation._stack[0].opacity, "0", "animation property should be the declared")
                strictEqual(myAnimation._stack[0].duration, 100, "animation property should be the declared")
                strictEqual(myAnimation._stack[0].easing, "ease-in-out", "animation property should be the declared")

                strictEqual(myAnimation._stack[0].delay, Moon.fn.config.delay, "animation property should be the default")
                strictEqual(myAnimation._stack[0].before, Moon.fn.config.before, "animation property should be the default")
                strictEqual(myAnimation._stack[0].after, Moon.fn.config.after, "animation property should be the default")

                strictEqual(myAnimation._stack[1].opacity, "1", "animation chaining should change the declared properties")
                notStrictEqual(myAnimation._stack[1].opacity, myAnimation._stack[0].opacity, "animation chaining should independently change properties")
            )

            asyncTest("Moon play", ->
                expect(2)
                counter = 0
                callback = ->
                    counter += 1

                myAnimation = Moon("#target-1").animate(
                    "opacity": "0"
                    "duration": 0
                ).play(callback)

                strictEqual(myAnimation._callback, callback, "animation callback should be the declared")
                setTimeout( ->
                    strictEqual(counter, 1, "animation callback should run once")
                    start()
                , 5)
            )

            test("Moon set", ->
                myAnimation = Moon("#target-1").set(
                    "opacity": "0"
                )

                equal(myAnimation._collection[0].style.opacity, "0", "set should set the property")
            )

            asyncTest("Moon pause", ->
                expect(2)

                myAnimation = Moon("#target-1").animate(
                    "opacity": "0"
                    "duration": 500
                ).animate(
                    "opacity": "1"
                    "duration": 500
                ).play()

                steps = []

                setTimeout( ->
                    myAnimation.pause()


                    setTimeout( ->
                        steps.push(myAnimation._step)
                        myAnimation.play()

                        setTimeout( ->    
                            steps.push(myAnimation._step)
                            strictEqual(steps[0], 0, "step should remain the same after pause")
                            strictEqual(steps[1], 1, "animation should continue after used play")
                            start()
                        , 300)
                    , 300)
                , 300)

            )

            asyncTest("Moon loop", ->
                expect(8)
                looping = []

                # counting looping
                looping[0] = Moon("#target-1").animate(
                    "opacity": "0"
                    "duration": 500
                ).animate(
                    "opacity": "1"
                    "duration": 500
                ).loop(2).play()

                # infinite looping
                looping[1] = Moon("#target-2").animate(
                    "opacity": "0"
                    "duration": 500
                ).animate(
                    "opacity": "1"
                    "duration": 500
                ).loop("infinite").play()

                # alternate looping
                looping[2] = Moon("#target-3").animate(
                    "opacity": "0"
                    "duration": 500
                ).animate(
                    "opacity": "1"
                    "duration": 500
                ).loop("alternate").play()

                # setting variables to assert
                loopingVars = []
                setTimeout( ->
                    # looping step of counting at the second iteraction
                    loopingVars.push(looping[0]._step)

                    # looping step of infinite at the second iteraction
                    loopingVars.push(looping[1]._step)

                    # looping step of alternate at the second iteraction
                    loopingVars.push(looping[2]._step)

                    # looping direction at the second iteraction
                    loopingVars.push(looping[2]._direction)
                , 1100)

                setTimeout( ->
                    # looping step of counting at the third iteraction
                    loopingVars.push(looping[0]._step)

                    # looping step of infinite at the third iteraction
                    loopingVars.push(looping[1]._step)

                    # looping step of alternate at the third iteraction
                    loopingVars.push(looping[2]._step)

                    # looping direction of alternate at the third iteraction
                    loopingVars.push(looping[2]._direction)

                    # assert looping vars
                    strictEqual(loopingVars[0], 0, "count looping step at second iteraction expected to be 0")
                    strictEqual(loopingVars[1], 0, "infinite looping step at second iteraction expected to be 0")
                    strictEqual(loopingVars[2], 0, "alternate looping step at second iteraction expected to be 0")
                    strictEqual(loopingVars[3], false, "alternate looping direction at second iteraction expected to be false")
                    strictEqual(loopingVars[4], -1, "count looping step at third iteraction expected to be -1")
                    strictEqual(loopingVars[5], 0, "infinite looping step at third iteraction expected to be 0")
                    strictEqual(loopingVars[6], 0, "alternate looping step at third iteraction expected to be 0")
                    strictEqual(loopingVars[7], true, "alternate looping direction at third iteraction expected to be true")
                    start()
                , 2100)

            )
    
    Tests.init()