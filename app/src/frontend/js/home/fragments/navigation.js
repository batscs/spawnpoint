const burger = $("#navigation-burger");

burger.on("click", () => {
    burger.parent().toggleClass("navigation-burger-menu");
});