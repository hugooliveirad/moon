moonObject = Moon("#target")
console.dir moonObject
test "Return values tests", ->
    ok(moonObject == Moon.pt, "Moon() returns an instance of Moon.pt")
    ok(moonObject.animate({"opacity": "0"}) == Moon.pt, ".animate() returns an instance of Moon.pt")
    ok(moonObject.play() == Moon.pt, "play() returns and instance of Moon.pt")

test "Moon()._collection behavior tests", ->
    ok(Moon("#target")._collection.length == 1, "selection of just one element must affect only one element")
    ok(Moon(".target-class")._collection.length == 5, "selection of five elements must affect all")
    ok(Moon([".target-class", document.getElementById("target")])._collection.length == 6, "selections of five elements by class and one by id must affect every single one")
    ok(Moon(document.getElementById("targets-wrapper").querySelectorAll("div"))._collection.length == 2, "selectors must can be used isolated and returns every selected element")

test "Callback, before and after functions", ->
	Moon("#target").animate
		"opacity": "0"
		"beforeAnimation": ->
			ok(1 == 1, "Before animation was called")
		"afterAnimation": ->
			ok(1 == 1, "After animation was called")
	.play ->
		ok(1 == 1, "Callback on the end of all animations was called")
