
["einstellungen", "grundwerte", "fertigkeiten", "magie", "ausruestung", "kampf"].forEach(button => {
    on(`clicked:${button}`, function () {
        setAttrs({
            tab: button
        });
    });
});

["sicherheit", "standard", "risiko"].forEach(button => {
    on(`clicked:probenwurfoption_${button}`, function () {
        setAttrs({
            probenwurfoption: button
        });
    });
});