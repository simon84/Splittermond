
["einstellungen", "grundwerte", "fertigkeiten", "magie", "entwicklung", "ausruestung", "kampf"].forEach(button => {
    on(`clicked:${button}`, function () {
        setAttrs({
            tab: button
        });
    });
});