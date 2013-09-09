App =
    init: ->
        a = App
        # elements declaration
        a.animationWrapper = document.getElementById("animationWrapper")
        a.animationSelect = document.getElementById 'animationSelector'

        # listeners init
        a.animationSelect.addEventListener 'change', (e) ->
            a.controllers.activateAnimation(this.value)

        # hide all animations
        a.controllers.cleanAnimations()

    controllers:
        activateAnimation: (index) ->
            a = App
            index = parseInt(index, 10)
            a.controllers.cleanAnimations()
            # for each animation
            switch index
                when 0
                    # create the target
                    tgt = a.controllers.createTargets(1)

                    setTimeout ->
                        # animate target
                        Moon(tgt).animate
                            "transform": "scale(1.2) rotate(180deg)"
                            "duration": 1500
                        .play()
                    , 500

                when 1
                    # create the target
                    tgt = a.controllers.createTargets(1)

                    setTimeout ->
                        # animate target
                        Moon(tgt).animate
                            "transform": "scale(1.2) rotate(180deg)"
                            "duration": 1500
                        .animate
                            "transform": "translate3d(-100px, 0, 0) scale(0.8)"
                            "duration": 1500
                        .animate
                            "transform": "translate3d(300px, 0, 0) rotate(30deg)"
                            "duration": 1500
                        .animate
                            "transform": "translate3d(0,0,0)"
                            "duration": 1500
                        .play()
                    , 500

        cleanAnimations: ->
            a = App
            # remove every child of animationWrapper
            while a.animationWrapper.firstChild
                a.animationWrapper.removeChild(a.animationWrapper.firstChild)

        createTargets: (num) ->
            a = App
            tgtsCreated = []
            tgtFrag = document.createDocumentFragment()
            for i in [1..num]
                tgt = document.createElement('div')
                tgt.classList.add('target')
                tgtFrag.appendChild(tgt)
                tgtsCreated.push(tgt)

            a.animationWrapper.appendChild(tgtFrag)
            return tgtsCreated

window.onload = App.init