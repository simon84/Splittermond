on('sheet:opened', function () {
    getAttrs(["abilityroll", "epgesamt"], function (v) {
        let update = {};
        if (v.epgesamt == 0) {
            update.epgesamt = 15;
        }

        if (v.abilityroll == "") {
            update.abilityroll = "&{template:splittermond_generic}";
        }
        setAttrs(update);
    });

});


on("change:epeingesetzt change:epgesamt", function () {
    getAttrs(["epeingesetzt", "epgesamt"], function (values) {
        setAttrs({
            epoffen: values.epgesamt - values.epeingesetzt
        });
        var hg = 1;
        var bonus = 0;
        var sp = 0;
        if (values.epeingesetzt >= 100 && values.epeingesetzt < 300) {
            hg = 2;
            bonus = 2;
            sp = 1;
        }
        if (values.epeingesetzt >= 300 && values.epeingesetzt < 600) {
            hg = 3;
            bonus = 4;
            sp = 2;
        }
        if (values.epeingesetzt >= 600) {
            hg = 4;
            bonus = 6;
            sp = 3;
        }
        setAttrs({
            epoffen: values.epgesamt - values.epeingesetzt,
            heldengrad: hg,
            hiddenvtdhg: bonus,
            hiddenkwhg: bonus,
            hiddengwhg: bonus,
            hiddensplitterpunktehg: sp
        });
    });
});

function autoUpdate(attributes, dataCallback) {
    attributesStr = attributes.map(attr => "change:" + attr).join(" ");
    on(attributesStr, e => getAttrs(attributes, v => setAttrs(dataCallback(v))));
}


autoUpdate(["beweglichkeit", "groessenklasse", "geschwindigkeitmod", "geschwindigkeitstaerkemod"], function (v) {
    return { geschwindigkeit: +v.beweglichkeit + +v.groessenklasse + +v.geschwindigkeitmod + +v.geschwindigkeitstaerkemod };
});

autoUpdate(["konstitution", "groessenklasse", "lebenspunktemod", "hiddenlebenspunktemod"], function (v) {
    return { lebenspunkte: +v.groessenklasse + +v.konstitution + +v.lebenspunktemod + +v.lebenspunktestaerkemod };
});

autoUpdate(["intuition", "initiativemod", "initiativestaerkemod"], function (v) {
    return { initiative: 10 - +v.intuition + +v.initiativemod + +v.initiativestaerkemod };
});

autoUpdate(["mystik", "willenskraft", "fokusmod", "fokusstaerkemod"], function (v) {
    return { fokus: (+v.mystik + +v.willenskraft) * 2 + +v.fokusmod + +v.fokusstaerkemod };
});

autoUpdate(["konstitution", "willenskraft", "koerperlicherwiderstandmod", "koerperlicherwiderstandstaerkemod", "heldengrad"], function (v) {
    return { koerperlicherwiderstand: 12 + +v.konstitution + +v.willenskraft + +v.koerperlicherwiderstandmod + +v.koerperlicherwiderstandstaerkemod + (+v.heldengrad - 1) * 2 };
});

autoUpdate(["verstand", "willenskraft", "geistigerwiderstandmod", "geistigerwiderstandstaerkemod", "heldengrad"], function (v) {
    return { geistigerwiderstand: 12 + +v.verstand + +v.willenskraft + +v.geistigerwiderstandmod + +v.geistigerwiderstandstaerkemod + (+v.heldengrad - 1) * 2 };
});

autoUpdate(["beweglichkeit", "staerke", "groessenklasse", "verteidigungmod", "verteidigungstaerkemod", "heldengrad"], function (v) {
    return { verteidigung: 12 + +v.beweglichkeit + +v.staerke + ((5 - +v.groessenklasse) * 2) + +v.verteidigungmod + +v.verteidigungstaerkemod + (+v.heldengrad - 1) * 2 };
});


Object.keys(splittermond.attribute).forEach(attribut => autoUpdate([attribut, "heldengrad"], function (v) {
    var data = {};
    data[attribut + "max"] = +v[attribut + "start"] + +v.heldengrad;
    return data;
}));

on("change:repeating_staerken", function () {
    getSectionIDs("staerken", function (idarray) {

        idAttrsStr = idarray.map(id => "repeating_staerken_" + id + "_staerke");
        idAttrsStr.concat(idarray.map(id => "repeating_staerken_" + id + "_staerkenwert"));

        getAttrs(idAttrsStr, function (v) {
            var staerke = v["repeating_staerken_" + id + "_staerke"];
            var staerkenwert = v["repeating_staerken_" + id + "_staerkenwert"];
            var update = [];

            idarray.forEach(function (id) {
                var staerke = v["repeating_staerken_" + id + "_staerke"];
                var staerkenwert = v["repeating_staerken_" + id + "_staerkenwert"];
                if (splittermond.staerken[staerke.toLowerCase()] != undefined) {
                    Object.keys(splittermond.staerken[v.staerke.toLowerCase()]).forEach(function (value, key) {
                        update[key + "staerkemod"] += value * staerkenwert;
                    });
                }
            });


            setAttrs(update);
        });
    });
});
