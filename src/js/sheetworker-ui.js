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

on("clicked:incschwierigkeit", function () {
    getAttrs(["probenschwierigkeit"], v => {
        setAttrs({
            "probenschwierigkeit": int(v.probenschwierigkeit) + 1
        });
    });
});

on("clicked:decschwierigkeit", function () {
    getAttrs(["probenschwierigkeit"], v => {
        setAttrs({
            "probenschwierigkeit": int(v.probenschwierigkeit) - 1
        });
    });
});

on("clicked:incmod", function () {
    getAttrs(["probenmodifikator"], v => {
        setAttrs({
            "probenmodifikator": int(v.probenmodifikator) + 1
        })
    })
});

on("clicked:decmod", function () {
    getAttrs(["probenmodifikator"], v => {
        setAttrs({
            "probenmodifikator": int(v.probenmodifikator) - 1
        });
    });
});
