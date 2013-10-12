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
                # simple animation
                when 0
                    # create the target
                    tgt = a.controllers.createTargets(1)

                    setTimeout ->
                        # animate target
                        Moon(tgt).animate
                            "transform": "scale(1.2) rotate(180deg)"
                            "duration": 1500
                        .play()
                    , 1

                # chained animation
                when 1
                    tgt = a.controllers.createTargets(1)

                    setTimeout ->
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
                    , 1

                # two elements
                when 2
                    tgt = a.controllers.createTargets(2)

                    setTimeout ->
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
                    , 1

                # callback
                when 3
                    tgt = a.controllers.createTargets(1)

                    setTimeout ->
                        Moon(tgt).animate
                            "transform": "scale(1.2) rotate(180deg)"
                            "duration": 1500
                        .play -> 
                            alert("callback called")
                        
                    , 1

                # after and before animation
                when 4
                    tgt = a.controllers.createTargets(1)
                    
                    setTimeout ->
                        Moon(tgt).animate
                            "transform": "scale(1.2) rotate(180deg)"
                            "duration": 1500
                            "before": ->
                                alert("Function called before animation")
                            "after": ->
                                alert("Function called after animation")
                        .animate
                            "transform": "scale(1) rotate(0deg)"
                            "duration": 1000
                            "before": ->
                                alert("Function called before animation")
                            "after": ->
                                alert("Function called after animation")
                        .play()
                        
                    , 1                    

                # stress
                when 5
                    total = 1000
                    tgt = []
                    tgt.push(a.controllers.createTargets(total / 4, "mini"))
                    tgt.push(a.controllers.createTargets(total / 4, "mini"))
                    tgt.push(a.controllers.createTargets(total / 4, "mini"))
                    tgt.push(a.controllers.createTargets(total / 4, "mini"))
                    count = 0
                    setTimeout ->
                        animation = ->
                            console.log(count)
                            Moon(tgt[count]).animate
                                "transform": "translate3d(#{(Math.random() - 0.5) * 100}px, #{(Math.random() - 0.5) * 100}px, 0) scale3d(#{(Math.random() + 0.5)}, #{(Math.random() + 0.5)}, #{(Math.random() + 0.5)})"
                                "duration": 100
                            .play()
                            count++
                            count = 0 if count > 3

                            requestAnimationFrame(animation)

                        animation()

                    , 10

                # set
                when 6
                    tgt = a.controllers.createTargets(1)
                    setTimeout ->
                        Moon(".target").set
                            "transform": "scale(.5)"
                    , 1000

                # pause
                when 7
                    tgt = a.controllers.createTargets(1)
                    setTimeout ->
                        myMoon = Moon(tgt).animate
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

                        setTimeout ->
                            myMoon.pause()
                        , 1600

                        tgt[0].addEventListener('click', ->
                            myMoon.play()
                        )
                    , 1


        cleanAnimations: ->
            a = App
            # remove every child of animationWrapper
            while a.animationWrapper.firstChild
                a.animationWrapper.removeChild(a.animationWrapper.firstChild)

        createTargets: (num, cls) ->
            a = App
            tgtsCreated = []
            tgtFrag = document.createDocumentFragment()
            for i in [1..num]
                tgt = document.createElement('div')
                tgt.classList.add('target')
                tgt.classList.add(cls) if cls?
                tgtFrag.appendChild(tgt)
                tgtsCreated.push(tgt)

            a.animationWrapper.appendChild(tgtFrag)
            return tgtsCreated

window.onload = App.init