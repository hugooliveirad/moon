do(window, document) ->
    Tests =
        init: ->
            Tests.targets = document.querySelectorAll(".target")
            Tests.test()

        test: ->
            test("Test Moon main function", ->
                singleInstance = Moon("#target")

                ok(singleInstance instanceof Moon, "Moon should return a instance of itself")

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

                equal(instances.singleElement._collection.length, 1)
                equal(instances.nodeList._collection.length, 5)
                equal(instances.selectorSingle._collection.length, 1)
                equal(instances.selectorMulti._collection.length, 5)
                equal(instances.arraySameType._collection.length, 2)
                equal(instances.arrayDiffType._collection.length, 7)
            )
    
    Tests.init()