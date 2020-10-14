function autoUpdate(attributes, dataCallback) {
    attributesStr = attributes.map(attr => "change:" + attr).join(" ");
    on(attributesStr, e => getAttrs(attributes, v => setAttrs(dataCallback(v, e))));
}

var allModifier = [];

function int(value, defaultValue = 0) {
    return parseInt(value) || defaultValue;
}

function modStr(value, defaultValue = 0) {
    var val = int(value);
    return (val < 0 ? "" : "+") + val;
}

function str(value, defaultValue = "") {
    return value || defaultValue;
}

function intSum(v) {
    return Object.values(v).reduce((a, b) => int(a) + int(b));
}

function autoFertigkeit(fertigkeitId, fertigkeit) {
    autoUpdate([
        fertigkeit.Attribute[0].toLowerCase(),
        fertigkeit.Attribute[1].toLowerCase(),
        fertigkeitId + "punkte",
        fertigkeitId + "mod",
        fertigkeitId + "moduser"], v => {
            let update = {};
            update[fertigkeitId] = intSum(v);
            return update;
        });
    allModifier.push(fertigkeitId);
}

function autoKampfFertigkeit(fertigkeitId) {
    autoUpdate([
        fertigkeitId + "punkte",
        fertigkeitId + "mod",
        fertigkeitId + "moduser"], v => {
            let update = {};
            update[fertigkeitId] = intSum(v);
            return update;
        });
    allModifier.push(fertigkeitId);
}

for (var fertigkeitId in splittermond.fertigkeiten) {
    autoFertigkeit(fertigkeitId, splittermond.fertigkeiten[fertigkeitId])
}

for (var fertigkeitId in splittermond.fertigkeiten) {
    autoFertigkeit(fertigkeitId, splittermond.fertigkeiten[fertigkeitId])
}
for (var fertigkeitId in splittermond.magieschulen) {
    autoFertigkeit(fertigkeitId, splittermond.magieschulen[fertigkeitId])
}

for (var fertigkeitId in splittermond.kampffertigkeiten) {
    autoKampfFertigkeit(fertigkeitId);
}

function autoAttribut(attributId) {
    autoUpdate([attributId + "basis", attributId + "mod", attributId + "moduser"], v => {
        let update = {};
        update[attributId] = intSum(v);
        return update;
    });
    autoUpdate([attributId + "start", "heldengrad"], v => {
        let update = {};
        update[attributId + "max"] = int(v[attributId + "start"]) + int(v.heldengrad);
        return update;
    });
    allModifier.push(attributId);
}

for (var attributId in splittermond.attribute) {
    autoAttribut(attributId);
}


on('sheet:opened', function () {
    getAttrs(["abilityroll"], function (v) {
        let update = {};
        if (v.abilityroll == "") {
            update["abilityroll"] = "&{template:splittermond_generic}";
        }
        setAttrs(update);
    });
    getAttrs(["resourceupdated", "ansehenswert", "kontaktewert", "standwert", "vermoegenswert"], function (v) {
        if (int(v.resourceupdated) == 0) {
            let newrowattrs = {};
            let newrowid = generateRowID();
            newrowattrs["resourceupdated"] = 1;
            newrowattrs["repeating_ressources_" + newrowid + "_ressourcename"] = "Ansehen";
            newrowattrs["repeating_ressources_" + newrowid + "_ressourcevalue"] = int(v.ansehenswert, 0);
            newrowid = generateRowID();
            newrowattrs["repeating_ressources_" + newrowid + "_ressourcename"] = "Kontakte";
            newrowattrs["repeating_ressources_" + newrowid + "_ressourcevalue"] = int(v.kontaktewert, 0);
            newrowid = generateRowID();
            newrowattrs["repeating_ressources_" + newrowid + "_ressourcename"] = "Stand";
            newrowattrs["repeating_ressources_" + newrowid + "_ressourcevalue"] = int(v.standwert, 0);
            newrowid = generateRowID();
            newrowattrs["repeating_ressources_" + newrowid + "_ressourcename"] = "Vermögen";
            newrowattrs["repeating_ressources_" + newrowid + "_ressourcevalue"] = int(v.vermoegenswert, 0);
            setAttrs(newrowattrs);
        } else {
            return;
        }
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

function getGroessenklasseFromRasse(rasse) {
    rasse = (rasse || "mensch").toLowerCase();
    if (rasse in splittermond.rassen) {
        return int(splittermond.rassen[rasse].groessenklasse) || 5;
    } else {
        return 5;
    }
}

function heldengradBonus(hg) {
    return (int(hg) - 1) * 2;
}



allModifier.push("groessenklasse");
autoUpdate(["rasse", "groessenklassemod", "groessenklassemoduser"], v => ({
    groessenklasse: getGroessenklasseFromRasse(v.rasse) + int(v.groessenklassemod) + int(v.groessenklassemoduser)
}));
allModifier.push("geschwindigkeit");
autoUpdate(["beweglichkeit", "groessenklasse", "geschwindigkeitmod", "geschwindigkeitmoduser"], v => ({
    geschwindigkeit: int(v.beweglichkeit) + int(v.groessenklasse) + int(v.geschwindigkeitmod) + int(v.geschwindigkeitmoduser)
}));
allModifier.push("lebenspunkte");
autoUpdate(["konstitution", "groessenklasse", "lebenspunktemod", "lebenspunktemoduser"], v => ({
    lebenspunkte: int(v.groessenklasse) + int(v.konstitution) + int(v.lebenspunktemod) + int(v.lebenspunktemoduser)
}));
allModifier.push("initiative");
autoUpdate(["intuition", "initiativemod", "initiativemoduser"], v => ({
    initiative: 10 - int(v.intuition) + int(v.initiativemod) + int(v.initiativemoduser)
}));
allModifier.push("fokus");
autoUpdate(["mystik", "willenskraft", "fokusmod", "fokusmoduser"], v => ({
    fokus: (int(v.mystik) + int(v.willenskraft)) * 2 + int(v.fokusmod) + int(v.fokusmoduser)
}));
allModifier.push("koerperlicherwiderstand");
autoUpdate(["konstitution", "willenskraft", "koerperlicherwiderstandmod", "koerperlicherwiderstandmoduser", "heldengrad"], v => ({
    koerperlicherwiderstand: 12 + int(v.konstitution) + int(v.willenskraft) + int(v.koerperlicherwiderstandmod) + int(v.koerperlicherwiderstandmoduser) + heldengradBonus(v.heldengrad)
}));
allModifier.push("geistigerwiderstand");
autoUpdate(["verstand", "willenskraft", "geistigerwiderstandmod", "geistigerwiderstandmoduser", "heldengrad"], v => ({
    geistigerwiderstand: 12 + int(v.verstand) + int(v.willenskraft) + int(v.geistigerwiderstandmod) + int(v.geistigerwiderstandmoduser) + heldengradBonus(v.heldengrad)
}));
allModifier.push("verteidigung");
autoUpdate(["beweglichkeit", "staerke", "groessenklasse", "verteidigungmod", "verteidigungmoduser", "heldengrad"], v => ({
    verteidigung: 12 + int(v.beweglichkeit) + int(v.staerke) + (5 - int(v.groessenklasse)) * 2 + int(v.verteidigungmod) + int(v.verteidigungmoduser) + heldengradBonus(v.heldengrad)
}));


// Calculate modifier from "staerken"
on("change:repeating_staerken remove:repeating_staerken", function () {
    getSectionIDs("repeating_staerken", function (idarray) {

        idAttrsStr = idarray.map(id => "repeating_staerken_" + id + "_staerkename");
        idAttrsStr = idAttrsStr.concat(idarray.map(id => "repeating_staerken_" + id + "_staerkenwert"));
        getAttrs(idAttrsStr, function (v) {
            var staerkenmod = {};

            idarray.forEach(function (id) {
                var staerke = str(v["repeating_staerken_" + id + "_staerkename"]).toLowerCase();
                var staerkenwert = int(v["repeating_staerken_" + id + "_staerkenwert"]);
                if (staerke in splittermond.staerken) {
                    for (var key in splittermond.staerken[staerke].modifier) {
                        var modifier = { name: splittermond.staerken[staerke].tooltip, value: int(splittermond.staerken[staerke].modifier[key]) * staerkenwert };
                        if (!(key in staerkenmod)) {
                            staerkenmod[key] = [];
                        }
                        staerkenmod[key].push(modifier)
                    }
                }
            });
            setAttrs({ staerkenmod: JSON.stringify(staerkenmod) });
        });
    });
});

// Calculate modifier from "zustaende"
on("change:repeating_zustaende remove:repeating_zustaende", function () {
    getSectionIDs("repeating_zustaende", function (idarray) {

        idAttrsStr = idarray.map(id => "repeating_zustaende_" + id + "_zustandsname");
        idAttrsStr = idAttrsStr.concat(idarray.map(id => "repeating_zustaende_" + id + "_zustandsstufe"));
        idAttrsStr = idAttrsStr.concat(idarray.map(id => "repeating_zustaende_" + id + "_zustandonoff"));
        getAttrs(idAttrsStr, function (v) {
            var zustandmod = {};

            idarray.forEach(function (id) {
                var zustand = str(v["repeating_zustaende_" + id + "_zustandsname"]).toLowerCase();
                var zustandwert = int(v["repeating_zustaende_" + id + "_zustandsstufe"]);
                var zustandonoff = int(v["repeating_zustaende_" + id + "_zustandonoff"]);
                if (zustandonoff == 1) {
                    for (var splimoZustand in splittermond.zustaende) {
                        if (zustand.startsWith(splimoZustand) && zustand != "") {
                            for (var key in splittermond.zustaende[splimoZustand].modifier) {
                                var modifier = { name: splittermond.zustaende[splimoZustand].tooltip, value: int(splittermond.zustaende[splimoZustand].modifier[key]) * zustandwert };
                                if (!(key in zustandmod)) {
                                    zustandmod[key] = [];
                                }
                                zustandmod[key].push(modifier);
                            }
                        }
                    }
                }

            });
            setAttrs({ zustaendemod: JSON.stringify(zustandmod) });
        });
    });
});


// Calculate modifier from "Attributmodifikatoren"
on("change:repeating_attributmods remove:repeating_attributmods", function () {
    getSectionIDs("repeating_attributmods", function (idarray) {

        idAttrsStr = idarray.map(id => "repeating_attributmods_" + id + "_modattribut");
        idAttrsStr = idAttrsStr.concat(idarray.map(id => "repeating_attributmods_" + id + "_attributmodname"));
        idAttrsStr = idAttrsStr.concat(idarray.map(id => "repeating_attributmods_" + id + "_attributmod"));
        idAttrsStr = idAttrsStr.concat(idarray.map(id => "repeating_attributmods_" + id + "_attributmodonoff"));
        getAttrs(idAttrsStr, function (v) {
            var attributmod = {};

            idarray.forEach(function (id) {
                var attribut = str(v["repeating_attributmods_" + id + "_modattribut"]);
                var name = str(v["repeating_attributmods_" + id + "_attributmodname"]);
                var modvalue = int(v["repeating_attributmods_" + id + "_attributmod"]);
                var modactive = str(v["repeating_attributmods_" + id + "_attributmodonoff"]);
                if (modactive == "on") {
                    var attribute = []
                    switch (attribut) {
                        case "allwiderstand":
                            attribute = attribute.concat(["verteidigung", "geistigerwiderstand", "koerperlicherwiderstand"]);
                            break;
                        case "allfertigkeiten":
                            attribute = attribute.concat(Object.keys(splittermond.fertigkeiten));
                            attribute = attribute.concat(Object.keys(splittermond.magieschulen));
                            attribute = attribute.concat(Object.keys(splittermond.kampffertigkeiten));
                            break;
                        case "allgfertigkeiten":
                            attribute = attribute.concat(Object.keys(splittermond.fertigkeiten));
                            break;
                        case "kampffertigkeiten":
                            attribute = attribute.concat(Object.keys(splittermond.kampffertigkeiten));
                            break;
                        case "magiefertigkeiten":
                            attribute = attribute.concat(Object.keys(splittermond.magieschulen));
                            break;
                        default:
                            attribute.push(attribut)
                    }
                    for (var attribut of attribute) {
                        var modifier = { name: name, value: modvalue };
                        if (!(attribut in attributmod)) {
                            attributmod[attribut] = [];
                        }
                        attributmod[attribut].push(modifier);
                    }
                }

            });
            setAttrs({ attributmodsmod: JSON.stringify(attributmod) });
        });
    });
});


// Calculate modifier from "zustaende"
on("change:repeating_meisterschaften remove:repeating_meisterschaften", function () {
    getSectionIDs("repeating_meisterschaften", function (idarray) {

        idAttrsStr = idarray.map(id => "repeating_meisterschaften_" + id + "_meisterschaftsname"); getAttrs(idAttrsStr, function (v) {
            var meisterschaftmod = {};

            idarray.forEach(function (id) {
                var meisterschaft = str(v["repeating_meisterschaften_" + id + "_meisterschaftsname"]).toLowerCase();
                for (var splimoMeisterschaft in splittermond.meisterschaften) {
                    if (meisterschaft == splimoMeisterschaft) {
                        for (var key in splittermond.meisterschaften[splimoMeisterschaft].modifier) {
                            var modifier = { name: splittermond.meisterschaften[splimoMeisterschaft].tooltip, value: int(splittermond.meisterschaften[splimoMeisterschaft].modifier[key]) };
                            if (!(key in meisterschaftmod)) {
                                meisterschaftmod[key] = [];
                            }
                            meisterschaftmod[key].push(modifier);
                        }
                    }
                }

            });
            setAttrs({ meisterschaftmod: JSON.stringify(meisterschaftmod) });
        });
    });
});


// Calc "Zauber"
on("change:repeating_zauber:magieschulen", function () {
    getSectionIDs("repeating_zauber", function (idarray) {
        if (idarray.length > 0) {
            var update = {};
            var fields = idarray.map(id => "repeating_zauber_" + id + "_magieschulen");
            fields = fields.concat(Object.keys(splittermond.magieschulen));
            getAttrs(fields, function (v) {
                idarray.forEach(function (id) {
                    update["repeating_zauber_" + id + "_zauberwert"] = v[v["repeating_zauber_" + id + "_magieschulen"]];
                })
                setAttrs(update);
            });
        }
    });
});

// Calc Waffenskill
on("change:repeating_waffen:waffenskill change:repeating_waffen:waffenattr1 change:repeating_waffen:waffenattr2 change:repeating_waffen:waffenmod "
    + Object.keys(splittermond.attribute).map(v => "change:" + v).join(" ")
    + Object.keys(splittermond.kampffertigkeiten).map(v => "change:" + v).join(" "), function () {
        // Nahkampfwaffen
        getSectionIDs("repeating_waffen", function (idarray) {

            if (idarray.length > 0) {
                var update = {};
                var attrArr = [];
                idarray.forEach(function (v) {
                    attrArr.push("repeating_waffen_" + v + "_waffenskill");
                    attrArr.push("repeating_waffen_" + v + "_waffenattr1");
                    attrArr.push("repeating_waffen_" + v + "_waffenattr2");
                    attrArr.push("repeating_waffen_" + v + "_waffenmod");
                });
                attrArr = attrArr.concat(Object.keys(splittermond.attribute));
                attrArr = attrArr.concat(Object.keys(splittermond.kampffertigkeiten));
                getAttrs(attrArr, function (v) {
                    _.each(idarray, function (currentID, i) {
                        var skill = v["repeating_waffen_" + currentID + "_waffenskill"];
                        var attr1 = v["repeating_waffen_" + currentID + "_waffenattr1"];
                        var attr2 = v["repeating_waffen_" + currentID + "_waffenattr2"];
                        var mod = int(v["repeating_waffen_" + currentID + "_waffenmod"]);
                        update["repeating_waffen_" + currentID + "_waffenwert"] = int(v[skill]) + int(v[attr1]) + int(v[attr2]) + mod;
                    });
                    setAttrs(update);
                });
            }
        });
    });
/*
on("change:hiddenschildvtd change:hiddenruestungsvtd change:hiddenruestungssr change:hiddenschildbe change:hiddenruestungsbe change:hiddenschildtickplus change:hiddenruestungstickplus change:hiddensr change:hiddenbehinderungfruehstueck", function (g) {
    getAttrs(["hiddenschildvtd", "hiddenruestungsvtd", "hiddenruestungssr", "hiddenschildbe", "hiddenruestungsbe", "hiddenschildtickplus", "hiddenruestungstickplus", "hiddensr", "hiddenbehinderungfruehstueck", "hiddenschadensreduktionfruehstueck"], function (f) {
        setAttrs({
            gesamtvtd: +f.hiddenschildvtd + +f.hiddenruestungsvtd,
            gesamtsr: +f.hiddenruestungssr + +f.hiddensr + +f.hiddenschadensreduktionfruehstueck,
            gesamtbe: Math.max((+f.hiddenruestungsbe + +f.hiddenschildbe - +f.hiddenbehinderungfruehstueck), 0),
            gesamttickplus: +f.hiddenruestungstickplus + +f.hiddenschildtickplus
        })
    });
});


on("change:gesamtvtd change:gesamtsr change:gesamtbe", function (eventinfo) {
    getAttrs(["gesamtvtd", "gesamtsr", "gesamtbe", "schadensreduktionmod", "hiddenschadensreduktionfruehstueck"], function (values) {
        setAttrs({
            hiddenvtdruestungschild: +values.gesamtvtd,
            schadensreduktion: +values.gesamtsr + +values.schadensreduktionmod + +values.hiddenschadensreduktionfruehstueck,
            behinderung: +values.gesamtbe
        });
    });
});
*/


on("change:lebenspunkte change:lebenspunkte_e change:lebenspunkte_k change:lebenspunkte_v", function (e) {
    getAttrs(["lebenspunkte", "lebenspunkte_e", "lebenspunkte_k", "lebenspunkte_v"], function (v) {
        var temp = (int(v.lebenspunkte) * 5) - int(v.lebenspunkte_e) - int(v.lebenspunkte_k) - int(v.lebenspunkte_v);
        setAttrs({
            lebenspunkte_t: temp,
            lebenspunkte_v_bar: ("6".repeat(int(v.lebenspunkte_v))),
            lebenspunkte_k_bar: ("6".repeat(int(v.lebenspunkte_k))),
            lebenspunkte_e_bar: ("6".repeat(int(v.lebenspunkte_e))),
            lebenspunkte_t_bar: ("6".repeat(Math.max(temp, 0)))
        });
    });
});


on("change:fokus change:fokus_e change:fokus_k change:fokus_v", function (e) {
    getAttrs(["fokus", "fokus_e", "fokus_k", "fokus_v"], function (v) {
        var temp = int(v.fokus) - int(v.fokus_e) - int(v.fokus_k) - int(v.fokus_v);
        setAttrs({
            fokus_t: temp,
            fokus_v_bar: "6".repeat(int(v.fokus_v)),
            fokus_k_bar: "6".repeat(int(v.fokus_k)),
            fokus_e_bar: "6".repeat(int(v.fokus_e)),
            fokus_t_bar: "6".repeat(Math.max(temp, 0))
        });
    });
});
/*

on("change:repeating_nahkampfwaffen:waffenmerkmale", function (eventInfo) {
    getAttrs(["repeating_nahkampfwaffen_waffenmerkmale"], function (v) {
        let waffenmerkmale = v["repeating_nahkampfwaffen_waffenmerkmale"].toLowerCase().split(",");
        let exakt = 0;
        let scharf = 0;
        let kritisch = 0;
        let defensiv = 0;
        for (var i = 0; i < waffenmerkmale.length; i++) {
            if (waffenmerkmale[i].search("exakt") != -1) {
                exakt = waffenmerkmale[i].slice(6).trim();
            }
            if (waffenmerkmale[i].search("scharf") != -1) {
                scharf = waffenmerkmale[i].slice(7).trim();
            }
            if (waffenmerkmale[i].search("kritisch") != -1) {
                kritisch = waffenmerkmale[i].slice(9).trim();
            }
            if (waffenmerkmale[i].search("defensiv") != -1) {
                defensiv = waffenmerkmale[i].slice(9).trim();
            }
        }
        setAttrs({
            'repeating_nahkampfwaffen_waffenexakt': +exakt,
            'repeating_nahkampfwaffen_waffenscharf': +scharf,
            'repeating_nahkampfwaffen_waffenkritisch': +kritisch,
            'repeating_nahkampfwaffen_waffendefensiv': +defensiv
        });
    });
});


on("change:repeating_nahkampfwaffen:waffenscharf change:repeating_nahkampfwaffen:waffenexakt change:repeating_nahkampfwaffen:waffenkritisch change:repeating_nahkampfwaffen:waffenschaden change:repeating_nahkampfwaffen:waffenname", function (eventInfo) {
    getAttrs(["repeating_nahkampfwaffen_waffenexakt", "repeating_nahkampfwaffen_waffenkritisch", "repeating_nahkampfwaffen_waffenscharf", "repeating_nahkampfwaffen_waffenschaden"], function (v) {
        let exakt = v["repeating_nahkampfwaffen_waffenexakt"];
        let scharf = v["repeating_nahkampfwaffen_waffenscharf"];
        let kritisch = v["repeating_nahkampfwaffen_waffenkritisch"];
        let waffenschaden1 = 1;
        let waffenschadenwuerfel = "d6";
        let waffenschaden3 = 0;
        if (!v["repeating_nahkampfwaffen_waffenschaden"]) {
            v["repeating_nahkampfwaffen_waffenschaden"] = "";
        }
        let temp = v["repeating_nahkampfwaffen_waffenschaden"].match(/([0-9]{0,1})(W6|W10|w6|w10)[ ]*\+{0,1}[ ]*([0-9]*)/);
        if (temp) {
            if (temp[1] == "") {
                temp[1] = 1;
            }

            temp[2] = temp[2].toLowerCase().replace("w", "d");
            waffenschaden1 = +temp[1];
            waffenschadenwuerfel = temp[2];
            waffenschaden3 = +temp[3];

        }

        let die_max = 0;
        let die_minus = 0;
        let damagerollstring;
        if (scharf < 0) { scharf = 0; }
        if (exakt < 0) { exakt = 0; }
        if (kritisch < 0) { kritisch = 0; }
        if (kritisch > 0) {
            damagerollstring = "";
            die_max = waffenschadenwuerfel.substr(1);
            die_minus = +waffenschadenwuerfel.substr(1) - 1;
            if ((+waffenschaden1 + +exakt) == 1) {
                damagerollstring += "{1" + waffenschadenwuerfel + "}<" + +die_minus + "*([[{1d" + +die_minus + "," + scharf + "d1}k1]]-" + (+die_max + +kritisch) + ")+" + (+die_max + +kritisch) + "+" + waffenschaden3;
            } else {
                damagerollstring = "{";
                for (i = 1; i <= +waffenschaden1 + +exakt; i++) {
                    damagerollstring = damagerollstring + "{1" + waffenschadenwuerfel + "}<" + +die_minus + "*([[{1d" + +die_minus + "," + scharf + "d1}k1]]-" + (+die_max + +kritisch) + ")+" + (+die_max + +kritisch) + ",";
                }
                damagerollstring = damagerollstring.slice(0, -1);
                damagerollstring += "}k" + waffenschaden1 + " + " + waffenschaden3;
            }
        } else if (kritisch == 0) {
            damagerollstring = "{";
            for (i = 1; i <= +waffenschaden1 + +exakt; i++) {
                damagerollstring = damagerollstring + "{1" + waffenschadenwuerfel + ", " + scharf + "d1}k1,";
            }
            damagerollstring = damagerollstring.slice(0, -1);
            damagerollstring = damagerollstring + "}k" + waffenschaden1 + " + " + waffenschaden3;
        }
        setAttrs({
            'repeating_nahkampfwaffen_damageroll': damagerollstring
        });
    });
});

on("change:repeating_fernkampfwaffen:waffenmerkmalefern", function (eventInfo) {
    getAttrs(["repeating_fernkampfwaffen_waffenmerkmalefern"], function (v) {
        let waffenmerkmale = v["repeating_fernkampfwaffen_waffenmerkmalefern"].toLowerCase().split(",");
        let exakt = 0;
        let scharf = 0;
        let kritisch = 0;
        for (var i = 0; i < waffenmerkmale.length; i++) {
            if (waffenmerkmale[i].search("exakt") != -1) {
                exakt = waffenmerkmale[i].slice(6).trim();
            }
            if (waffenmerkmale[i].search("scharf") != -1) {
                scharf = waffenmerkmale[i].slice(7).trim();
            }
            if (waffenmerkmale[i].search("kritisch") != -1) {
                kritisch = waffenmerkmale[i].slice(9).trim();
            }
        }
        setAttrs({
            'repeating_fernkampfwaffen_waffenexakt': +exakt,
            'repeating_fernkampfwaffen_waffenscharf': +scharf,
            'repeating_fernkampfwaffen_waffenkritisch': +kritisch
        });
    });
});

on("change:repeating_fernkampfwaffen:waffenscharf change:repeating_fernkampfwaffen:waffenexakt change:repeating_fernkampfwaffen:waffenkritisch change:repeating_fernkampfwaffen:waffenschaden1fern change:repeating_fernkampfwaffen:waffenschadenwuerfelfern change:repeating_fernkampfwaffen:waffenschaden3fern change:repeating_fernkampfwaffen:waffennamefern", function (eventInfo) {
    getAttrs(["repeating_fernkampfwaffen_waffenexakt", "repeating_fernkampfwaffen_waffenscharf", "repeating_fernkampfwaffen_waffenkritisch", "repeating_fernkampfwaffen_waffenschaden1fern", "repeating_fernkampfwaffen_waffenschadenwuerfelfern", "repeating_fernkampfwaffen_waffenschaden3fern"], function (v) {
        let exakt = v["repeating_fernkampfwaffen_waffenexakt"];
        let scharf = v["repeating_fernkampfwaffen_waffenscharf"];
        let kritisch = v["repeating_fernkampfwaffen_waffenkritisch"];
        let waffenschaden1 = v["repeating_fernkampfwaffen_waffenschaden1fern"];
        let waffenschadenwuerfel = v["repeating_fernkampfwaffen_waffenschadenwuerfelfern"];
        let waffenschaden3 = v["repeating_fernkampfwaffen_waffenschaden3fern"];
        if (kritisch > 0) {
            damagerollstring = "";
            die_max = waffenschadenwuerfel.substr(1);
            die_minus = +waffenschadenwuerfel.substr(1) - 1;
            if ((+waffenschaden1 + +exakt) == 1) {
                damagerollstring += "[[{1" + waffenschadenwuerfel + "}<" + +die_minus + "*([[{1d" + +die_minus + "," + scharf + "d1}k1]]-" + (+die_max + +kritisch) + ")+" + (+die_max + +kritisch) + "+" + waffenschaden3 + "]]";
            } else {
                damagerollstring = "[[{";
                for (i = 1; i <= +waffenschaden1 + +exakt; i++) {
                    damagerollstring = damagerollstring + "{1" + waffenschadenwuerfel + "}<" + +die_minus + "*([[{1d" + +die_minus + "," + scharf + "d1}k1]]-" + (+die_max + +kritisch) + ")+" + (+die_max + +kritisch) + ",";
                }
                damagerollstring = damagerollstring.slice(0, -1);
                damagerollstring += "}k" + waffenschaden1 + " + " + waffenschaden3 + "]]";
            }
        } else if (+kritisch == 0) {
            damagerollstring = "{";
            for (i = 1; i <= +waffenschaden1 + +exakt; i++) {
                damagerollstring = damagerollstring + "{1" + waffenschadenwuerfel + ", " + scharf + "d1}k1,";
            }
            damagerollstring = damagerollstring.slice(0, -1);
            damagerollstring = damagerollstring + "}k" + waffenschaden1 + " + " + waffenschaden3;
        }
        setAttrs({
            'repeating_fernkampfwaffen_damagerollfern': damagerollstring
        });
    });
});

*/


on("change:notizen", function (eventInfo) {
    getAttrs(["notizen", "fokus", "lebenspunkte"], function (v) {
        let notizen = v.notizen.toLowerCase();
        if (notizen.startsWith("!setnull(")) {
            switch (notizen.slice(9).slice(0, -1)) {
                case "sr":
                    setAttrs({ hiddensr: 0 });
                    break;
                case "lp":
                    setAttrs({
                        lebenspunkte_k: 0,
                        lebenspunkte_e: 0,
                        lebenspunkte_v: 0,
                        lebenspunkte_t: +v.lebenspunkte * 5
                    });
                    break;
                case "fokus":
                    setAttrs({
                        fokus_k: 0,
                        fokus_e: 0,
                        fokus_v: 0,
                        fokus_t: +v.fokus
                    });
                    break;
                case "gsw":
                    setAttrs({ hiddengsw: 0 });
                    setAttrs({ hiddengswag: 0 });
                    setAttrs({ hiddengswbe: 0 });
                    setAttrs({ hiddengswspr: 0 });
                    break;
                case "gw":
                    setAttrs({ hiddengw: 0 });
                    setAttrs({ hiddengw: 0 });
                    break;
                case "kw":
                    setAttrs({ hiddenkw: 0 });
                    break;
                case "ini":
                    setAttrs({ hiddenini: 0 });
                    break;
                case "schmerzresistenz":
                    setAttrs({ schmerzresistenz: 0 });
                    break;
                case "splitterpunkte":
                    setAttrs({ hiddensplitterpunkte: 0 });
                    break;
                default:
                    setAttrs({ notizen: "Syntax-Fehler!" });
            }
            setAttrs({ notizen: "" });
        }
    });
});

on("clicked:startimport", function (f) {
    getAttrs(["jsonimport"], function (v) {
        importerror = false;
        try {
            var characterData = JSON.parse(v.jsonimport);
        } catch (err) {
            importerror = true;
        }
        if (!importerror && v.jsonimport != "") {
            clearSheet();
            writeToSheet(characterData);
        } else {
            setAttrs({ xmlimport: "Fehler beim Parsen des JSON-Strings!" })
        }
    });
});

function clearSheet() {
    let exp = 0;
    setAttrs({
        ansehenswert: 0,
        kontaktewert: 0,
        standwert: 0,
        vermoegenswert: 0
    });
    getSectionIDs("repeating_ressources", function (idarray) {
        for (var i = 0; i < idarray.length; i++) {
            removeRepeatingRow("repeating_ressources_" + idarray[i]);
        }
    });
    setAttrs({
        hiddenlp: 0,
        hiddenfokus: 0,
        hiddengsw: 0,
        hiddengw: 0,
        hiddenkw: 0,
        hiddensr: 0,
        hiddenini: 0,
        schemerzresistenz: 0,
        hiddensplitterpunkte: 0,
        hiddensbm: 0,
        sprintercount: 0
    });
    getSectionIDs("repeating_staerken", function (idarray) {
        for (var i = 0; i < idarray.length; i++) {
            removeRepeatingRow("repeating_staerken_" + idarray[i]);
        }
    });
    getSectionIDs("repeating_schwaechen", function (idarray) {
        for (var i = 0; i < idarray.length; i++) {
            removeRepeatingRow("repeating_schwaechen_" + idarray[i]);
        }
    });
    setAttrs({
        hiddenausstrahlungmod: 0,
        hiddenbeweglichkeitmod: 0,
        hiddenintuitionmod: 0,
        hiddenkonstitutionmod: 0,
        hiddenmystikmod: 0,
        hiddenstaerkemod: 0,
        hiddenverstandmod: 0,
        hiddenwillenskraftmod: 0
    });
    getSectionIDs("repeating_attributmods", function (idarray) {
        for (var i = 0; i < idarray.length; i++) {
            removeRepeatingRow("repeating_attributmods_" + idarray[i]);
        }
    });
    getSectionIDs("repeating_sprachen", function (idarray) {
        for (var i = 0; i < idarray.length; i++) {
            removeRepeatingRow("repeating_sprachen_" + idarray[i]);
        }
    });
    getSectionIDs("repeating_kulturkunde", function (idarray) {
        for (var i = 0; i < idarray.length; i++) {
            removeRepeatingRow("repeating_kulturkunde_" + idarray[i]);
        }
    });
    getSectionIDs("repeating_nahkampfwaffen", function (idarray) {
        for (var i = 0; i < idarray.length; i++) {
            removeRepeatingRow("repeating_nahkampfwaffen_" + idarray[i]);
        }
    });
    getSectionIDs("repeating_fernkampfwaffen", function (idarray) {
        for (var i = 0; i < idarray.length; i++) {
            removeRepeatingRow("repeating_fernkampfwaffen_" + idarray[i]);
        }
    });
    setAttrs({
        verwundet: 0,
        benommen: 0,
        geblendet: 0,
        erschoepft: 0,
        lahm: 0
    });
    getSectionIDs("repeating_zustaende", function (idarray) {
        for (var i = 0; i < idarray.length; i++) {
            removeRepeatingRow("repeating_zustaende_" + idarray[i]);
        }
    });
    getSectionIDs("repeating_zauber", function (idarray) {
        for (var i = 0; i < idarray.length; i++) {
            removeRepeatingRow("repeating_zauber_" + idarray[i]);
        }
    });
    setAttrs({
        gesamtsr: 0,
        gesamtbe: 0,
        schildbe: 0
    });
    getSectionIDs("repeating_ruestungen", function (idarray) {
        for (var i = 0; i < idarray.length; i++) {
            removeRepeatingRow("repeating_ruestungen_" + idarray[i]);
        }
    });
    setAttrs({
        hiddeninibr: 0,
        hiddenvtdgr: 0,
        rt1: 0,
        rt2: 0,
        st1: 0,
        st2: 0,
        sw1: 0,
        sw2: 0,
        hiddengswag: 0
    });
    getSectionIDs("repeating_meisterschaften", function (idarray) {
        for (var i = 0; i < idarray.length; i++) {
            removeRepeatingRow("repeating_meisterschaften_" + idarray[i]);
        }
    });
    getSectionIDs("repeating_masterytooltips", function (idarray) {
        for (var i = 0; i < idarray.length; i++) {
            removeRepeatingRow("repeating_masterytooltips_" + idarray[i]);
        }
    });
    getSectionIDs("repeating_spelltooltips", function (idarray) {
        for (var i = 0; i < idarray.length; i++) {
            removeRepeatingRow("repeating_spelltooltips_" + idarray[i]);
        }
    });
}



on("change:fokus_k change:fokus_e change:fokus_v", function (f) {
    if (f.sourceType == "sheetworker") { return; }
    getAttrs(["fokus_t"], function (v) {
        let newValue = f.newValue || 0;
        let previousValue = f.previousValue || 0;
        setAttrs({
            fokus_t: +v.fokus_t - (+newValue - +previousValue)
        });
    });
});

on("clicked:verschnaufpause", function (f) {
    getAttrs(["fokus_k", "fokus_e", "fokus_k", "fokus_e", "fokus_v", "fokus_t", "lebenspunkte_k", "lebenspunkte_e", "lebenspunkte_v", "lebenspunkte_t", "regbonus", "konstitution", "willenskraft", "lebenspunkte", "fokus", "hiddenfokreg", "hiddenlifereg"], function (v) {
        let update = {};
        let kon = +v.konstitution;
        let wil = +v.willenskraft;
        let lifereg = +v.hiddenlifereg;
        let fokreg = +v.hiddenfokreg;
        let regbonus = +v.regbonus;
        let konbonus = 2;
        let wilbonus = 2;
        update["fokus_t"] = +v.fokus_t;
        update["fokus_v"] = +v.fokus_v;
        update["fokus_e"] = +v.fokus_e;
        update["fokus_k"] = +v.fokus_k;
        update["lebenspunkte_t"] = +v.lebenspunkte_t;
        update["lebenspunkte_v"] = +v.lebenspunkte_v;
        update["lebenspunkte_e"] = +v.lebenspunkte_e;
        update["lebenspunkte_k"] = +v.lebenspunkte_k;
        update["fokus_t"] += update["fokus_e"];
        update["fokus_e"] = 0;
        update["lebenspunkte_t"] += update["lebenspunkte_e"];
        update["lebenspunkte_e"] = 0;
        setAttrs(update);
    });
});

on("clicked:ruhephase", function (f) {
    getAttrs(["fokuskzue", "fokus_k", "fokus_e", "fokus_k", "fokus_e", "fokus_v", "fokus_t", "lebenspunkte_k", "lebenspunkte_e", "lebenspunkte_v", "lebenspunkte_t", "regbonus", "konstitution", "willenskraft", "lebenspunkte", "fokus", "hiddenfokreg", "hiddenlifereg"], function (v) {
        let update = {};
        let kon = +v.konstitution;
        let wil = +v.willenskraft;
        let lifereg = +v.hiddenlifereg;
        let fokreg = +v.hiddenfokreg;
        let regbonus = +v.regbonus;
        let konbonus = 2;
        let wilbonus = 2;
        let liferegtotal = 0;
        let fokregtotal = 0;
        let lebenspunkte_max = 0;
        let fokus_max = +v.fokus;
        let lebenspunkte_gesamt = (+v.lebenspunkte * 5);
        update["fokus_t"] = +v.fokus_t;
        update["fokus_v"] = +v.fokus_v;
        update["fokus_e"] = +v.fokus_e;
        update["fokus_k"] = +v.fokus_k;
        update["lebenspunkte_t"] = +v.lebenspunkte_t;
        update["lebenspunkte_v"] = +v.lebenspunkte_v;
        update["lebenspunkte_e"] = +v.lebenspunkte_e;
        lebenspunkte_max = +lebenspunkte_gesamt - +v.lebenspunkte_k;
        fokus_max = +v.fokus;
        if (lifereg == 1) {
            konbonus = 3;
        }
        if (fokreg == 1) {
            wilbonus = 3;
        }
        liferegtotal = +regbonus + (+kon * +konbonus);
        fokregtotal = (+wil * +wilbonus);
        update["lebenspunkte_t"] += +update["lebenspunkte_e"];
        update["lebenspunkte_e"] = 0;
        if (+liferegtotal > +update["lebenspunkte_v"]) { liferegtotal = +update["lebenspunkte_v"]; }
        if (+update["lebenspunkte_t"] + liferegtotal > +lebenspunkte_max) { liferegtotal = +lebenspunkte_max - +update["lebenspunkte_t"]; }
        update["lebenspunkte_v"] -= +liferegtotal;
        update["lebenspunkte_t"] += +liferegtotal;
        if (v.fokuskzue == true) {
            update["fokus_t"] += +update["fokus_k"];
            update["fokus_k"] = 0;
        } else {
            fokus_max = +v.fokus - +v.fokus_k;
        }
        update["fokus_t"] += +update["fokus_e"];
        update["fokus_e"] = 0;
        if (+fokregtotal > +update["fokus_v"]) { fokregtotal = +update["fokus_v"]; }
        if ((+update["fokus_t"] + +fokregtotal) > fokus_max) { fokregtotal = (+fokus_max - + update["fokus_t"]); }
        update["fokus_v"] -= +fokregtotal;
        update["fokus_t"] += +fokregtotal;
        setAttrs(update);
    });
});

on("clicked:resetfokus", function (f) {
    getAttrs(["fokus"], function (v) {
        setAttrs({
            fokus_e: 0,
            fokus_k: 0,
            fokus_v: 0,
            fokus_t: +v.fokus
        });
    });
});

on("clicked:resetlp", function (f) {
    getAttrs(["lebenspunkte"], function (v) {
        setAttrs({
            lebenspunkte_e: 0,
            lebenspunkte_k: 0,
            lebenspunkte_v: 0,
            lebenspunkte_t: (+v.lebenspunkte * 5)
        });
    });
});

function calculateSpell(costsToCalculate, obj) {
    if (obj == "player") {
        getAttrs(["fokus_v", "fokus_t", "fokus_e", "fokus_k"], function (v) {
            let update = {};
            let zauberkosten = costsToCalculate;
            let fokus_v = int(v.fokus_v);
            let fokus_e = int(v.fokus_e);
            let fokus_t = int(v.fokus_t);
            let fokus_k = int(v.fokus_k);
            let kosten_e = 0;
            let kosten_k = 0;
            let kosten_v = 0;
            let gesamtkosten = 0;
            let temp = zauberkosten.toString().match(/\d{1,2}|[K,k]\d{1,2}|[V,v]\d{1,2}/g);
            var i;
            for (i = 0; i < temp.length; i++) {
                if (temp[i].charAt(0).toLowerCase() == "k") {
                    temp[i] = temp[i].substr(1);
                    kosten_k = temp[i];
                } else if (temp[i].charAt(0).toLowerCase() == "v") {
                    temp[i] = temp[i].substr(1);
                    kosten_v = temp[i];
                } else {
                    kosten_e = temp[i];
                }
            }
            if (kosten_k != 0 && kosten_v != 0) {
                kosten_k -= kosten_v;
            } else if (kosten_k == 0 && kosten_v != 0) {
                kosten_e -= kosten_v;
            }
            gesamtkosten = +kosten_e + +kosten_v + +kosten_k;
            update["zauberkosten"] = 0;
            if (+fokus_t >= +gesamtkosten) {
                update["fokus_e"] = +v.fokus_e + +kosten_e;
                update["fokus_v"] = +v.fokus_v + +kosten_v;
                update["fokus_k"] = +v.fokus_k + +kosten_k;
                update["fokus_t"] = +v.fokus_t - +gesamtkosten;
            }
            setAttrs(update);
        });
    } else if (obj == "nsc") {
        getAttrs(["fokusnsc_v", "foknscgesamt", "fokusnsc_e", "fokusnsc_k"], function (v) {
            let update = {};
            let zauberkosten = costsToCalculate;
            let fokus_v = +v.fokusnsc_v;
            let fokus_e = +v.fokusnsc_e;
            let fokus_t = +v.foknscgesamt;
            let fokus_k = +v.fokusnsc_k;
            let kosten_e = 0;
            let kosten_k = 0;
            let kosten_v = 0;
            let gesamtkosten = 0;
            let temp = zauberkosten.toString().match(/\d{1,2}|[K,k]\d{1,2}|[V,v]\d{1,2}/g);
            var i;
            for (i = 0; i < temp.length; i++) {
                if (temp[i].charAt(0).toLowerCase() == "k") {
                    temp[i] = temp[i].substr(1);
                    kosten_k = temp[i];
                } else if (temp[i].charAt(0).toLowerCase() == "v") {
                    temp[i] = temp[i].substr(1);
                    kosten_v = temp[i];
                } else {
                    kosten_e = temp[i];
                }
            }
            if (kosten_k != 0 && kosten_v != 0) {
                kosten_k -= kosten_v;
            } else if (kosten_k == 0 && kosten_v != 0) {
                kosten_e -= kosten_v;
            }
            gesamtkosten = +kosten_e + +kosten_v + +kosten_k;
            update["zauberkosten"] = 0;
            if (+fokus_t >= +gesamtkosten) {
                update["fokusnsc_e"] = +fokus_e + +kosten_e;
                update["fokusnsc_v"] = +fokus_v + +kosten_v;
                update["fokusnsc_k"] = +fokus_k + +kosten_k;
                update["foknscgesamt"] = +fokus_t - +gesamtkosten;
            }
            setAttrs(update);
        });
    }
}

on("clicked:zaubercalc", function (f) {
    getAttrs(["zauberkosten"], function (v) {
        calculateSpell(v.zauberkosten, "player");
    });
});

on("change:gmroll", function (f) {
    getAttrs(["gmroll"], function (v) {
        let rollstring = "";
        if (v.gmroll == "nogm") {
            rollstring = "&{template:splittermond_generic}";
        } else if (v.gmroll == "gm") {
            rollstring = "/w GM &{template:splittermond_generic}";
        }
        setAttrs({
            abilityroll: rollstring
        });
    });
});

on("change:repeating_zauber:directcalc", function (f) {
    getAttrs(["repeating_zauber_directcalc", "repeating_zauber_zauberkosten"], function (values) {
        var update = {};
        var kosten = values.repeating_zauber_zauberkosten;
        if (values.repeating_zauber_directcalc == "directcalc") {
            update["repeating_zauber_directcalc"] = "off";
            setAttrs(update);
            calculateSpell(kosten, "player");
        }
    });
});

on("change:repeating_zauber:directcalcv", function (f) {
    getAttrs(["repeating_zauber_directcalcv", "repeating_zauber_zauberkostenv"], function (values) {
        var update = {};
        var kosten = values.repeating_zauber_zauberkostenv;
        if (values.repeating_zauber_directcalcv == "directcalc") {
            update["repeating_zauber_directcalcv"] = "off";
            setAttrs(update);
            calculateSpell(kosten, "player");
        }
    });
});


on("change:hiddensbm", function (f) {
    getAttrs(["hiddensbm"], function (v) {
        if (+v.hiddensbm > 1) {
            setAttrs({
                hiddensbm: 1
            });
        }
    });
});


on("clicked:addschaden", function (e) {
    getAttrs(["anzahlschaden", "anzahlschadenart", "lebenspunkte", "lebenspunkte_v", "lebenspunkte_e", "lebenspunkte_k"], function (v) {
        var schaden_v = 0;
        var schaden_e = 0;
        var schaden_k = 0;
        var gesamtSchaden = int(v.lebenspunkte_v) + int(v.lebenspunkte_e) + int(v.lebenspunkte_k);

        switch (v.anzahlschadenart) {
            case "e":
                schaden_e = int(v.anzahlschaden);
                var diff = Math.min(Math.max(gesamtSchaden + schaden_e - int(v.lebenspunkte) * 5, 0), schaden_e);
                schaden_v += diff;
                schaden_e -= diff;
                break;
            case "k":
                schaden_k = int(v.anzahlschaden);
                var diff = Math.min(Math.max(gesamtSchaden + schaden_k - int(v.lebenspunkte) * 5, 0), schaden_k);
                schaden_v += diff;
                schaden_k -= diff;
                break;
            default:
                schaden_v = int(v.anzahlschaden);
                break;
        }

        setAttrs({
            lebenspunkte_v: int(v.lebenspunkte_v) + schaden_v,
            lebenspunkte_e: int(v.lebenspunkte_e) + schaden_e,
            lebenspunkte_k: int(v.lebenspunkte_k) + schaden_k,
        });

    })
});

on("clicked:removeschaden", function (e) {
    getAttrs(["anzahlschaden", "anzahlschadenart", "lebenspunkte", "lebenspunkte_v", "lebenspunkte_e", "lebenspunkte_k"], function (v) {
        var schaden_v = 0;
        var schaden_e = 0;
        var schaden_k = 0;

        switch (v.anzahlschadenart) {
            case "e":
                schaden_e = -int(v.anzahlschaden);
                break;
            case "k":
                schaden_k = -int(v.anzahlschaden);
                break;
            default:
                schaden_v = -int(v.anzahlschaden);
                break;
        }

        setAttrs({
            lebenspunkte_v: Math.max(int(v.lebenspunkte_v) + schaden_v, 0),
            lebenspunkte_e: Math.max(int(v.lebenspunkte_e) + schaden_e, 0),
            lebenspunkte_k: Math.max(int(v.lebenspunkte_k) + schaden_k, 0)
        });

    })
});


on("change:lebenspunkte_v", function (eventInfo) {
    oldLebenspunkte_v = int(eventInfo.previousValue);
    getAttrs(["lebenspunkte_v", "lebenspunkte_t", "lebenspunkte"], function (v) {
        var oldGesundheitsstufe = Math.min(Math.max(Math.ceil(oldLebenspunkte_v / int(v.lebenspunkte)), 1), 6);
        var gesundheitsstufe = Math.min(Math.max(Math.ceil(int(v.lebenspunkte_v) / int(v.lebenspunkte)), 1), 6);
        let lp_v = int(v.lebenspunkte_v);
        let lp_t = +v.lebenspunkte_t;
        let dead = (+v.lebenspunkte * 6) + 1;
        var update = {};
        if (oldGesundheitsstufe == 4 && gesundheitsstufe == 5) {
            let newrowid = generateRowID();
            update["repeating_zustaende_" + newrowid + "_zustandsname"] = "sterbend (Gesundheitsst.)";
            update["repeating_zustaende_" + newrowid + "_zustandsstufe"] = 2;
            update["repeating_zustaende_" + newrowid + "_zustandonoff"] = 1;
        }
        if (oldGesundheitsstufe == 5 && gesundheitsstufe == 6) {
            let newrowid = generateRowID();
            update["repeating_zustaende_" + newrowid + "_zustandsname"] = "sterbend (Gesundheitsst.)";
            update["repeating_zustaende_" + newrowid + "_zustandsstufe"] = 3;
            update["repeating_zustaende_" + newrowid + "_zustandonoff"] = 1;
            newrowid = generateRowID();
            update["repeating_zustaende_" + newrowid + "_zustandsname"] = "bewusstlos (Gesundheitsst.)";
            update["repeating_zustaende_" + newrowid + "_zustandsstufe"] = 1;
            update["repeating_zustaende_" + newrowid + "_zustandonoff"] = 1;
        }
        if (lp_v >= (+v.lebenspunkte * 6)) {
            let newrowid = generateRowID();
            update["repeating_zustaende_" + newrowid + "_zustandsname"] = "tot (Gesundheitsst.)";
            update["repeating_zustaende_" + newrowid + "_zustandsstufe"] = 1;
            update["repeating_zustaende_" + newrowid + "_zustandonoff"] = 1;
        }
        update.gesundheitsstufe = gesundheitsstufe;
        setAttrs(update);
    });
});

allModifier.push("gesundheitsstufe");
allModifier.push("wundabzug");
autoUpdate(["gesundheitsstufe", "gesundheitsstufemod", "wundabzugmod", "wundabzugmoduser"], v => ({
    wundabzug: Math.min(Math.max(Math.floor(Math.pow(2, Math.max(Math.min(int(v.gesundheitsstufe) + int(v.gesundheitsstufemod) - 1, 5), 0) - 1)) + int(v.wundabzugmod) + int(v.wundabzugmoduser), 0), 8)
}));



on("change:rolldamagecheck change:rolldamagensccheck", function (eventInfo) {
    getAttrs(["rolldamagensccheck", "rolldamagecheck"], function (v) {
        let damagensc = "";
        let damagescnah = "";
        let damagescfern = "";
        let update = {};
        if (eventInfo.sourceAttribute == "rolldamagecheck") {
            if (v.rolldamagecheck == true) {
                damagescnah = "[Wirf!](~repeating_nahkampfwaffen_show_damage)";
                damagescfern = "[Wirf!](~repeating_fernkampfwaffen_show_damage)";
            } else {
                damagescnah = "[[@{damageroll}]]";
                damagescfern = "[[@{damagerollfern}]]";
            }
            getSectionIDs("repeating_nahkampfwaffen", function (idarray) {
                _.each(idarray, function (currentID, i) {
                    update["repeating_nahkampfwaffen_" + currentID + "_rolldamage"] = damagescnah;
                    setAttrs(update);
                });
            });
            getSectionIDs("repeating_fernkampfwaffen", function (idarray) {
                _.each(idarray, function (currentID, i) {
                    update["repeating_fernkampfwaffen_" + currentID + "_rolldamagefern"] = damagescfern;
                    setAttrs(update);
                });
            });
        } else {
            if (v.rolldamagensccheck == true) {
                damagensc = "[Wirf!](~repeating_waffennsc_show_damage)";
            } else {
                damagensc = "[[@{damagerollnsc}]]";
            }
            getSectionIDs("repeating_waffennsc", function (idarray) {
                _.each(idarray, function (currentID, i) {
                    update["repeating_waffennsc_" + currentID + "_rolldamagensc"] = damagensc;
                    setAttrs(update);
                });
            });
        }
    });
});



on("change:repeating_ausruestung:last change:repeating_ausruestung:getragen change:repeating_ausruestung:anzahl remove:repeating_ausruestung change:repeating_behaelter1:last change:repeating_behaelter1:getragen change:repeating_behaelter1:anzahl remove:repeating_behaelter1 change:repeating_behaelter2:last change:repeating_behaelter2:getragen change:repeating_behaelter2:anzahl remove:repeating_behaelter2 change:repeating_behaelter3:last change:repeating_behaelter3:getragen change:repeating_behaelter3:anzahl remove:repeating_behaelter3 change:repeating_behaelter4:last change:repeating_behaelter4:getragen change:repeating_behaelter4:anzahl remove:repeating_behaelter4 change:repeating_behaelter5:last change:repeating_behaelter5:getragen change:repeating_behaelter5:anzahl remove:repeating_behaelter5", function (eventInfo) {
    let row = eventInfo.sourceAttribute.split("_")[1];
    let lastfelder = { "ausruestung": "gesamtlast_koerper", "behaelter1": "gesamtlast_behaelter1", "behaelter2": "gesamtlast_behaelter2", "behaelter3": "gesamtlast_behaelter3", "behaelter4": "gesamtlast_behaelter4", "behaelter5": "gesamtlast_behaelter5" };
    let lastfeld = lastfelder[row];
    getSectionIDs(`repeating_${row}`, function (idarray) {
        if (idarray.length > 0) {
            var attrArr = [];
            idarray.forEach(function (currentID) {
                attrArr.push(`repeating_${row}_` + currentID + `_last`);
                attrArr.push(`repeating_${row}_` + currentID + `_getragen`);
                attrArr.push(`repeating_${row}_` + currentID + `_anzahl`);
            });
            getAttrs(attrArr, function (v) {
                var sum = 0;
                idarray.forEach(function (currentID) {
                    var last = v[`repeating_${row}_` + currentID + `_last`];
                    var getragen = v[`repeating_${row}_` + currentID + `_getragen`];
                    var anzahl = v[`repeating_${row}_` + currentID + `_anzahl`];
                    sum += int(last) * int(anzahl) * int(getragen);
                });
                var update = {};
                update[`${lastfeld}`] = sum;
                setAttrs(update);
            });
        } else {
            var update = {}
            update[`${lastfeld}`] = 0;
            setAttrs(update);
        }
    });
});

on("change:gesamtlast_koerper change:gesamtlast_behaelter1 change:gesamtlast_behaelter2 change:gesamtlast_behaelter3 change:gesamtlast_behaelter4 change:gesamtlast_behaelter4", function (eventInfo) {
    getAttrs(["gesamtlast_koerper", "gesamtlast_behaelter1", "gesamtlast_behaelter2", "gesamtlast_behaelter3", "gesamtlast_behaelter4", "gesamtlast_behaelter5"], function (v) {
        let sum = +v.gesamtlast_koerper + +v.gesamtlast_behaelter1 + +v.gesamtlast_behaelter2 + +v.gesamtlast_behaelter3 + +v.gesamtlast_behaelter4 + +v.gesamtlast_behaelter5;
        let update = {};
        update["gesamtlast"] = sum;
        setAttrs(update);
    });
});


//update Schadensreduktion, Behinderung, Tick+, VTD+
["sr", "be", "tickplus", "vtd"].forEach(function (type) {
    allModifier.push("ruestungs" + type);
    allModifier.push("schild" + type);
    on(`change:repeating_ruestungen change:schild${type} change:ruestungs${type}mod change:schild${type}mod change:schildonoff`, function () {
        getSectionIDs("repeating_ruestungen", function (rid) {
            var fields = [`ruestungs${type}mod`, `ruestungs${type}modtooltip`, `schild${type}mod`, `schild${type}modtooltip`, `schild${type}`, "schildonoff"];
            fields = fields.concat(rid.map(v => `repeating_ruestungen_${v}_ruestungs${type}`));
            fields = fields.concat(rid.map(v => `repeating_ruestungen_${v}_ruestungonoff`));
            getAttrs(fields, function (v) {
                var val = 0;
                var tooltip = "";
                rid.forEach(function (rowid) {
                    val = (v[`repeating_ruestungen_${rowid}_ruestungonoff`] == "1") ? int(val) + Math.max(int(v[`repeating_ruestungen_${rowid}_ruestungs${type}`]) + int(v[`ruestungs${type}mod`]), 0) : val;
                    tooltip += (v[`repeating_ruestungen_${rowid}_ruestungonoff`] == "1") ? v[`ruestungs${type}modtooltip`] + "\n" : "";
                });
                val += ((v["schildonoff"] == "1") ? Math.max(int(v[`schild${type}`]) + int(v[`schild${type}mod`]), 0) : 0);
                tooltip += (v["schildonoff"] == "1") ? v[`schild${type}modtooltip`] + "\n" : "";
                var update = {};
                update["ruestung" + type] = val;
                update["ruestung" + type + "modtooltip"] = tooltip;
                setAttrs(update);
            });
        })
    });
});

on("change:repeating_waffen", function (e) {
    var attr = e.sourceAttribute.split("_");
    var rowId = attr[2].toLowerCase();

    console.log(rowId);

    getSectionIDs("repeating_aawaffen", function (idarray) {
        var fields = [`repeating_waffen_${rowId}_waffenname`, `repeating_waffen_${rowId}_waffenwert`];
        fields = fields.concat(idarray.map(v => `repeating_aawaffen_${v}_aawaffe`));
        fields = fields.concat(idarray.map(v => `repeating_aawaffen_${v}_aawert`));
        fields = fields.concat(idarray.map(v => `repeating_aawaffen_${v}_rowid`));
        getAttrs(fields, function (vw) {
            var update = {};
            var changed = false;
            idarray.forEach(function (id) {
                if (str(vw[`repeating_aawaffen_${id}_rowid`]).toLowerCase() == rowId) {
                    update[`repeating_aawaffen_${id}_aawaffe`] = str(vw[`repeating_waffen_${rowId}_waffenname`]);
                    update[`repeating_aawaffen_${id}_aawert`] = str(vw[`repeating_waffen_${rowId}_waffenwert`]);
                    changed = true;
                }
                if (str(vw[`repeating_aawaffen_${id}_rowid`]).toLowerCase() == "") {
                    removeRepeatingRow("repeating_aawaffen_" + id);
                }
            });
            if (!changed) {
                var newRowId = generateRowID();
                update[`repeating_aawaffen_${newRowId}_rowid`] = rowId;
                update[`repeating_aawaffen_${newRowId}_aawaffe`] = str(vw[`repeating_waffen_${rowId}_waffenname`]);
                update[`repeating_aawaffen_${newRowId}_aawert`] = str(vw[`repeating_waffen_${rowId}_waffenwert`]);
            }
            setAttrs(update);
        });
    });

});

on("remove:repeating_waffen", function (e) {
    var attr = e.sourceAttribute.split("_");
    var rowId = attr[2].toLowerCase();

    console.log(rowId);

    getSectionIDs("repeating_aawaffen", function (idarray) {
        var fields = [`repeating_waffen_${rowId}_waffenname`, `repeating_waffen_${rowId}_waffenwert`];
        fields = fields.concat(idarray.map(v => `repeating_aawaffen_${v}_aawaffe`));
        fields = fields.concat(idarray.map(v => `repeating_aawaffen_${v}_aawert`));
        fields = fields.concat(idarray.map(v => `repeating_aawaffen_${v}_rowid`));
        getAttrs(fields, function (vw) {
            var update = {};
            var changed = false;
            idarray.forEach(function (id) {
                if (str(vw[`repeating_aawaffen_${id}_rowid`]).toLowerCase() == rowId || str(vw[`repeating_aawaffen_${id}_rowid`]).toLowerCase() == "") {
                    removeRepeatingRow("repeating_aawaffen_" + id);
                }
            });
            setAttrs(update);
        });
    });

});
/*
on("change:repeating_waffen remove:repeating_waffen sheet:opened", function () {
    getSectionIDs("repeating_aawaffen", function (idarray) {
        idarray.forEach(function (v) {
            removeRepeatingRow("repeating_aawaffen_" + v);
        });

        getSectionIDs("repeating_waffen", function (idarray) {
            var fields = idarray.map(v => `repeating_waffen_${v}_waffenname`);
            fields = fields.concat(idarray.map(v => `repeating_waffen_${v}_waffenwert`));
            getAttrs(fields, function (vw) {
                var update = {};
                idarray.forEach(function (id) {
                    if (str(vw[`repeating_waffen_${id}_waffenname`]) != "" || int(vw[`repeating_waffen_${id}_waffenwert`]) > 0) {
                        //var newrowid = generateRowID();
                        update[`repeating_aawaffen_${id}_aawaffe`] = str(vw[`repeating_waffen_${id}_waffenname`]);
                        update[`repeating_aawaffen_${id}_aawert`] = str(vw[`repeating_waffen_${id}_waffenwert`]);
                    }
                });
                setAttrs(update);
            });
        });
    });

});
*/
autoUpdate(["ruestungbe"], v => ({
    behinderung: v.ruestungbe
}));


// Update internal modifier
on("change:staerkenmod change:attributmodsmod change:groessenklasse change:zustaendemod change:meisterschaftmod change:wundabzug change:ruestungvtd change:behinderung", function () {
    getAttrs(["staerkenmod", "attributmodsmod", "groessenklasse", "wundabzug", "zustaendemod", "meisterschaftmod", "ruestungvtd", "behinderung"], function (v) {
        var allmod = [JSON.parse(v.staerkenmod), JSON.parse(v.attributmodsmod), JSON.parse(v.zustaendemod), JSON.parse(v.meisterschaftmod)]
        var update = {};
        allModifier.forEach(function (v) {
            var modifier = v + "mod";
            update[modifier + "tooltip"] = "";
            update[modifier] = 0;
            allmod.forEach(function (modobj) {
                if (v in modobj) {
                    modobj[v].forEach(function (v) {
                        update[modifier] += int(v.value);
                        update[modifier + "tooltip"] += `\n${modStr(v.value)} (${v.name})`;
                    })
                }
            })

        });

        var heimlichkeitmodgk = -(int(v.groessenklasse) - 5);
        update["heimlichkeitmod"] += heimlichkeitmodgk;
        if (heimlichkeitmodgk != 0) {
            update["heimlichkeitmodtooltip"] = `\n${heimlichkeitmodgk} (GK)`
        }

        //wundabzug
        if (int(v.wundabzug) > 0) {
            var attr = Object.keys(splittermond.fertigkeiten);
            attr = attr.concat(Object.keys(splittermond.magieschulen));
            attr = attr.concat(Object.keys(splittermond.kampffertigkeiten));
            attr.push("initiative");
            attr.forEach(function (f) {
                update[f + "mod"] -= int(v.wundabzug);
                update[f + "modtooltip"] += `\n${modStr(-int(v.wundabzug))} (Wundabzug)`;
            })
        }

        //Ausrüstung VTD+
        if (int(v.ruestungvtd) != 0) {
            update["verteidigungmod"] += int(v.ruestungvtd);
            update["verteidigungmodtooltip"] += `\n${modStr(int(v.ruestungvtd))} (Schild & Rüstung)`;
        }

        //Behinderung
        if (int(v.behinderung) != 0) {
            ["athletik", "akrobatik", "fingerfertigkeit", "heimlichkeit", "schloesserundfallen", "seefahrt", "tierfuehrung"].forEach(function (attr) {
                update[attr + "mod"] -= int(v.behinderung);
                update[attr + "modtooltip"] += `\n${modStr(-int(v.behinderung))} (Behinderung)`;
            });
            if (Math.floor(int(v.behinderung) / 2) > 0) {
                var val = Math.floor(int(v.behinderung) / 2);
                update["geschwindigkeitmod"] -= val;
                update["geschwindigkeitmodtooltip"] += `\n${modStr(-val)} (Behinderung)`;
            }

        }
        setAttrs(update);
    });
});

// Update Tooltips
allModifier.forEach(function (attr) {
    on(`change:${attr} change:${attr}mod change:${attr}moduser change:${attr}modtooltip`, function (e) {
        getAttrs([attr, attr + "mod", attr + "modtooltip", attr + "moduser"], function (v) {
            var tooltip = "Basis: " + (int(v[attr]) - int(v[attr + "mod"]) - int(v[attr + "moduser"])) + str(v[attr + "modtooltip"]);
            if (int(v[attr + "moduser"]) != 0) {
                tooltip += "\n" + modStr(v[attr + "moduser"]) + " (mod.)"
            }

            var update = {};
            update[attr + "tooltip"] = tooltip;
            setAttrs(update);
        });
    });
});
