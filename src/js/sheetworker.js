
on('sheet:opened', function () {
    getAttrs(["epgesamt"], function (v) {
        if (v.epgesamt == 0) {
            setAttrs({
                epgesamt: 15
            });
        }
    });
    getSectionIDs("fertigkeitennsc", function (idarray) {
        if (idarray.length == 0) {
            var newrowattrs = {};
            var newrowid = generateRowID();
            newrowattrs["repeating_fertigkeitennsc_" + newrowid + "_fertigkeitnsc"] = "Akrobatik";
            newrowid = generateRowID();
            newrowattrs["repeating_fertigkeitennsc_" + newrowid + "_fertigkeitnsc"] = "Athletik";
            newrowid = generateRowID();
            newrowattrs["repeating_fertigkeitennsc_" + newrowid + "_fertigkeitnsc"] = "Entschlossenheit";
            newrowid = generateRowID();
            newrowattrs["repeating_fertigkeitennsc_" + newrowid + "_fertigkeitnsc"] = "Heimlichkeit";
            newrowid = generateRowID();
            newrowattrs["repeating_fertigkeitennsc_" + newrowid + "_fertigkeitnsc"] = "Wahrnehmung";
            newrowid = generateRowID();
            newrowattrs["repeating_fertigkeitennsc_" + newrowid + "_fertigkeitnsc"] = "Zähigkeit";
            setAttrs(newrowattrs);
        }
    });
    getAttrs(["abilityroll"], function (v) {
        let update = {};
        if (v.abilityroll == "") {
            update["abilityroll"] = "&{template:splittermond_generic}";
        }
        setAttrs(update);
    });
    transferRessources();
});

function transferRessources() {
    getAttrs(["resourceupdated"], function (v) {
        if (+v.resourceupdated == 0) {
            getAttrs(["ansehenswert", "kontaktewert", "standwert", "vermoegenswert"], function (f) {
                let newrowattrs = {};
                let newrowid = generateRowID();
                let ansehen = +f.ansehenswert || 0;
                let kontakte = +f.kontaktewert || 0;
                let stand = +f.standwert || 0;
                let vermoegen = +f.vermoegenswert || 0;
                newrowattrs["repeating_ressources_" + newrowid + "_ressourcename"] = "Ansehen";
                newrowattrs["repeating_ressources_" + newrowid + "_ressourcevalue"] = +ansehen;
                newrowid = generateRowID();
                newrowattrs["repeating_ressources_" + newrowid + "_ressourcename"] = "Kontakte";
                newrowattrs["repeating_ressources_" + newrowid + "_ressourcevalue"] = +kontakte;
                newrowid = generateRowID();
                newrowattrs["repeating_ressources_" + newrowid + "_ressourcename"] = "Stand";
                newrowattrs["repeating_ressources_" + newrowid + "_ressourcevalue"] = +stand;
                newrowid = generateRowID();
                newrowattrs["repeating_ressources_" + newrowid + "_ressourcename"] = "Vermögen";
                newrowattrs["repeating_ressources_" + newrowid + "_ressourcevalue"] = +vermoegen;
                setAttrs(newrowattrs);
                setAttrs({ resourceupdated: 1 });
            });
        } else {
            return;
        }
    });
}


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

on("change:verteidigung change:geistigerwiderstand change:koerperlicherwiderstand change:schadensreduktion", function () {
    getAttrs(["verteidigung", "geistigerwiderstand", "koerperlicherwiderstand", "schadensreduktion"], function (v) {
        let update = {};
        update["kwoben"] = +v.koerperlicherwiderstand;
        update["gwoben"] = +v.geistigerwiderstand;
        update["vtdoben"] = +v.verteidigung;
        update["sroben"] = +v.schadensreduktion;
        setAttrs(update);
    });
});

on("change:beweglichkeit change:groessenklasse change:konstitution change:intuition change:mystik change:willenskraft change:verstand change:staerke change:ausstrahlung change:hiddengsw change:hiddenini change:hiddenlp change:hiddenfokus change:hiddengw change:hiddengwhg change:hiddenkw change:hiddenkwhg change:hiddenvtdhg change:schadensreduktionmod change:geschwindigkeitmod change:initiativemod change:lebenspunktemod change:fokusmod change:verteidigungmod change:koerperlicherwiderstandmod change:geistigerwiderstandmod change:bannmagiepunkte change:beherrschungsmagiepunkte change:bewegungsmagiepunkte change:erkenntnismagiepunkte change:felsmagiepunkte change:feuermagiepunkte change:heilungsmagiepunkte change:illusionsmagiepunkte change:kampfmagiepunkte change:lichtmagiepunkte change:naturmagiepunkte change:schattenmagiepunkte change:schicksalsmagiepunkte change:schutzmagiepunkte change:staerkungsmagiepunkte change:todesmagiepunkte change:verwandlungsmagiepunkte change:wassermagiepunkte change:windmagiepunkte change:hiddenvtdruestungschild change:hiddengswbe change:hiddeninibr change:hiddenvtdgr change:hiddengswag change:hiddengswspr change:erschoepft change:lahm change:hiddenvtdbonus change:hiddengwbonus change:hiddenkwbonus change:hiddenschadensreduktionfruehstueck change:hiddenallwiderstand change:hiddenmodini change:hiddenmodgsw", function () {
    getAttrs(["beweglichkeit", "groessenklasse", "konstitution", "intuition", "mystik", "willenskraft", "verstand", "staerke", "ausstrahlung", "hiddengsw", "hiddenini", "hiddenlp", "hiddenfokus", "hiddengw", "hiddengwhg", "hiddenkw", "hiddenkwhg", "hiddenvtdhg", "schadensreduktionmod", "geschwindigkeitmod", "initiativemod", "lebenspunktemod", "fokusmod", "verteidigungmod", "koerperlicherwiderstandmod", "geistigerwiderstandmod", "arkanekundepunkte", "bannmagiepunkte", "beherrschungsmagiepunkte", "bewegungsmagiepunkte", "erkenntnismagiepunkte", "felsmagiepunkte", "feuermagiepunkte", "heilungsmagiepunkte", "illusionsmagiepunkte", "kampfmagiepunkte", "lichtmagiepunkte", "naturmagiepunkte", "schattenmagiepunkte", "schicksalsmagiepunkte", "schutzmagiepunkte", "staerkungsmagiepunkte", "todesmagiepunkte", "verwandlungsmagiepunkte", "wassermagiepunkte", "windmagiepunkte", "hiddenvtdruestungschild", "gesamtsr", "hiddengswbe", "hiddeninibr", "hiddenvtdgr", "hiddengswag", "hiddengswspr", "erschoepft", "lahm", "hiddenvtdbonus", "hiddenkwbonus", "hiddengwbonus", "hiddenschadensreduktionfruehstueck", "hiddenallwiderstand", "hiddenmodini", "hiddenmodgsw"], function (values) {
        setAttrs({
            geschwindigkeit: +values.beweglichkeit + +values.groessenklasse + +values.geschwindigkeitmod + +values.hiddengsw + +values.hiddengswag + +values.hiddengswspr + +values.hiddenmodgsw - +values.hiddengswbe - +values.erschoepft - +values.lahm,
            lebenspunkte: +values.groessenklasse + +values.konstitution + +values.lebenspunktemod + +values.hiddenlp,
            initiative: 10 - (+values.intuition + +values.hiddenini + +values.hiddeninibr + +values.hiddenmodini) + +values.initiativemod + +values.erschoepft,
            fokus: (+values.mystik + +values.willenskraft) * 2 + +values.fokusmod + +values.hiddenfokus,
            koerperlicherwiderstand: 12 + +values.konstitution + +values.willenskraft + +values.koerperlicherwiderstandmod + +values.hiddenkw + +values.hiddenkwhg + +values.hiddenkwbonus + +values.hiddenallwiderstand,
            geistigerwiderstand: 12 + +values.verstand + +values.willenskraft + +values.geistigerwiderstandmod + +values.hiddengw + +values.hiddengwhg + +values.hiddengwbonus + +values.hiddenallwiderstand,
            verteidigung: 12 + +values.beweglichkeit + +values.staerke + ((5 - values.groessenklasse) * 2) + +values.verteidigungmod + +values.hiddenvtdgr + +values.hiddenvtdhg + +values.hiddenvtdruestungschild + +values.hiddenvtdbonus + +values.hiddenallwiderstand,
            schadensreduktion: +values.gesamtsr + +values.schadensreduktionmod + +values.hiddenschadensreduktionfruehstueck,
            akrobatik1: values.beweglichkeit,
            akrobatik2: values.staerke,
            alchemie1: values.mystik,
            alchemie2: values.verstand,
            anfuehren1: values.ausstrahlung,
            anfuehren2: values.willenskraft,
            arkanekunde1: values.mystik,
            arkanekunde2: values.verstand,
            athletik1: values.beweglichkeit,
            athletik2: values.staerke,
            darbietung1: values.ausstrahlung,
            darbietung2: values.willenskraft,
            diplomatie1: values.ausstrahlung,
            diplomatie2: values.verstand,
            edelhandwerk1: values.intuition,
            edelhandwerk2: values.verstand,
            empathie1: values.intuition,
            empathie2: values.verstand,
            entschlossenheit1: values.ausstrahlung,
            entschlossenheit2: values.willenskraft,
            fingerfertigkeit1: values.ausstrahlung,
            fingerfertigkeit2: values.beweglichkeit,
            geschichteundmythen1: values.mystik,
            geschichteundmythen2: values.verstand,
            handwerk1: values.konstitution,
            handwerk2: values.verstand,
            heilkunde1: values.intuition,
            heilkunde2: values.verstand,
            heimlichkeit1: values.beweglichkeit,
            heimlichkeit2: values.intuition,
            heimlichkeitgk: 5 - +values.groessenklasse,
            jagdkunst1: values.konstitution,
            jagdkunst2: values.verstand,
            laenderkunde1: values.intuition,
            laenderkunde2: values.verstand,
            naturkunde1: values.intuition,
            naturkunde2: values.verstand,
            redegewandtheit1: values.ausstrahlung,
            redegewandtheit2: values.willenskraft,
            schloesserundfallen1: values.intuition,
            schloesserundfallen2: values.beweglichkeit,
            schwimmen1: values.staerke,
            schwimmen2: values.konstitution,
            seefahrt1: values.beweglichkeit,
            seefahrt2: values.konstitution,
            strassenkunde1: values.ausstrahlung,
            strassenkunde2: values.intuition,
            tierfuehrung1: values.ausstrahlung,
            tierfuehrung2: values.beweglichkeit,
            ueberleben1: values.intuition,
            ueberleben2: values.konstitution,
            wahrnehmung1: values.intuition,
            wahrnehmung2: values.willenskraft,
            zaehigkeit1: values.konstitution,
            zaehigkeit2: values.willenskraft,
            bannmagie1: values.mystik,
            bannmagie2: values.willenskraft,
            bannmagie: +values.mystik + +values.willenskraft + +values.bannmagiepunkte,
            beherrschungsmagie1: values.mystik,
            beherrschungsmagie2: values.willenskraft,
            beherrschungsmagie: +values.mystik + +values.willenskraft + +values.beherrschungsmagiepunkte,
            bewegungsmagie1: values.mystik,
            bewegungsmagie2: values.beweglichkeit,
            bewegungsmagie: +values.mystik + +values.beweglichkeit + +values.bewegungsmagiepunkte,
            erkenntnismagie1: values.mystik,
            erkenntnismagie2: values.verstand,
            erkenntnismagie: +values.mystik + +values.verstand + +values.erkenntnismagiepunkte,
            felsmagie1: values.mystik,
            felsmagie2: values.konstitution,
            felsmagie: +values.mystik + +values.konstitution + +values.felsmagiepunkte,
            feuermagie1: values.mystik,
            feuermagie2: values.ausstrahlung,
            feuermagie: +values.mystik + +values.ausstrahlung + +values.feuermagiepunkte,
            heilungsmagie1: values.mystik,
            heilungsmagie2: values.ausstrahlung,
            heilungsmagie: +values.mystik + +values.ausstrahlung + +values.heilungsmagiepunkte,
            illusionsmagie1: values.mystik,
            illusionsmagie2: values.ausstrahlung,
            illusionsmagie: +values.mystik + +values.ausstrahlung + +values.illusionsmagiepunkte,
            kampfmagie1: values.mystik,
            kampfmagie2: values.staerke,
            kampfmagie: +values.mystik + +values.staerke + +values.kampfmagiepunkte,
            lichtmagie1: values.mystik,
            lichtmagie2: values.ausstrahlung,
            lichtmagie: +values.mystik + +values.ausstrahlung + +values.lichtmagiepunkte,
            naturmagie1: values.mystik,
            naturmagie2: values.ausstrahlung,
            naturmagie: +values.mystik + +values.ausstrahlung + +values.naturmagiepunkte,
            schattenmagie1: values.mystik,
            schattenmagie2: values.intuition,
            schattenmagie: +values.mystik + +values.intuition + +values.schattenmagiepunkte,
            schicksalsmagie1: values.mystik,
            schicksalsmagie2: values.ausstrahlung,
            schicksalsmagie: +values.mystik + +values.ausstrahlung + +values.schicksalsmagiepunkte,
            schutzmagie1: values.mystik,
            schutzmagie2: values.ausstrahlung,
            schutzmagie: +values.mystik + +values.ausstrahlung + +values.schutzmagiepunkte,
            staerkungsmagie1: values.mystik,
            staerkungsmagie2: values.staerke,
            staerkungsmagie: +values.mystik + +values.staerke + +values.staerkungsmagiepunkte,
            todesmagie1: values.mystik,
            todesmagie2: values.verstand,
            todesmagie: +values.mystik + +values.verstand + +values.todesmagiepunkte,
            verwandlungsmagie1: values.mystik,
            verwandlungsmagie2: values.konstitution,
            verwandlungsmagie: +values.mystik + +values.konstitution + +values.verwandlungsmagiepunkte,
            wassermagie1: values.mystik,
            wassermagie2: values.intuition,
            wassermagie: +values.mystik + +values.intuition + +values.wassermagiepunkte,
            windmagie1: values.mystik,
            windmagie2: values.verstand,
            windmagie: +values.mystik + +values.verstand + +values.windmagiepunkte
        });
    });
    getAttrs(["beweglichkeit", "groessenklasse", "geschwindigkeitmod", "hiddengsw", "hiddengswag", "hiddengswspr", "hiddenmodgsw", "hiddengswbe", "erschoepft", "lahm"], function (values) {
        let update = {};
        let basis = +values.beweglichkeit + +values.groessenklasse;
        let mod = +values.geschwindigkeitmod;
        let flink = +values.hiddengsw;
        let arkaneverteidigung = +values.hiddengswag;
        let sprinter = +values.hiddengswspr;
        let behinderung = +values.hiddengswbe;
        let modgsw = +values.hiddenmodgsw;
        let erschoepft = +values.erschoepft;
        let lahm = +values.lahm;
        let tooltip = "Basis: " + basis;
        if (+mod > 0) {
            tooltip += "\n + " + +mod + " (Mod.)";
        }
        if (+flink > 0) {
            tooltip += "\n + " + +flink + " (Flink)";
        }
        if (+arkaneverteidigung > 0) {
            tooltip += "\n + " + +arkaneverteidigung + " (Arkane Geschwindigkeit)";
        }
        if (+sprinter > 0) {
            tooltip += "\n + " + +sprinter + " (Sprinter)";
        }
        if (+modgsw > 0) {
            tooltip += "\n + " + +modgsw + " (Modifikator: GSW)";
        }
        if (+behinderung > 0) {
            tooltip += "\n - " + +behinderung + " (Behinderung)";
        }
        if (+erschoepft > 0) {
            tooltip += "\n - " + +erschoepft + " (Erschöpft)";
        }
        if (+lahm > 0) {
            tooltip += "\n - " + +lahm + " (Lahm)";
        }
        update["gswtooltip"] = tooltip;
        setAttrs(update);
    });
    getAttrs(["beweglichkeit", "staerke", "groessenklasse", "verteidigungmod", "hiddenvtdgr", "hiddenvtdhg", "hiddenvtdruestungschild", "hiddenvtdbonus", "hiddenallwiderstand"], function (values) {
        let update = {};
        let basis = 12 + +values.beweglichkeit + +values.staerke + ((5 - values.groessenklasse) * 2);
        let mod = +values.verteidigungmod;
        let gutereflexe = +values.hiddenvtdgr;
        let hg = +values.hiddenvtdhg;
        let ruestungschild = +values.hiddenvtdruestungschild;
        let modivtd = +values.hiddenvtdbonus;
        let modiallew = +values.hiddenallwiderstand;
        let tooltip = "Basis: " + basis;
        if (+mod > 0) {
            tooltip += "\n + " + +mod + " (Mod.)";
        }
        if (+gutereflexe > 0) {
            tooltip += "\n + " + +gutereflexe + " (Gute Reflexe)";
        }
        if (+hg > 0) {
            tooltip += "\n + " + +hg + " (Heldengrad)";
        }
        if (+ruestungschild > 0) {
            tooltip += "\n + " + +ruestungschild + " (Rüstungen+Schild)";
        }
        if (+modivtd > 0) {
            tooltip += "\n + " + +modivtd + " (Modifikator VTD)";
        }
        if (+modiallew > 0) {
            tooltip += "\n + " + +modiallew + " (Modifikator: Alle Widerstände)";
        }
        update["vtdtooltip"] = tooltip;
        setAttrs(update);
    });
    getAttrs(["intuition", "hiddenini", "hiddeninibr", "initiativemod", "erschoepft", "hiddenmodini"], function (values) {
        let update = {};
        let basis = 10 - +values.intuition;
        let vi = +values.hiddenini;
        let br = +values.hiddeninibr;
        let mod = +values.initiativemod;
        let erschoepft = +values.erschoepft;
        let modini = +values.hiddenmodini;
        let tooltip = "10 - Intuition: " + basis;
        if (+vi) {
            tooltip += "\n - " + +vr + " (Verbesserte Initiative)";
        }
        if (+br > 0) {
            tooltip += "\n - " + +br + " (Blitzreflexe)";
        }
        if (+modini > 0) {
            tooltip += "\n - " + +modini + " (Modifikator: INI)";
        }
        if (+mod > 0) {
            tooltip += "\n + " + +mod + " (Mod.)";
        }
        if (+erschoepft > 0) {
            tooltip += "\n + " + +erschoepft + " (Erschöpft)";
        }
        update["initooltip"] = tooltip;
        setAttrs(update);
    });
    getAttrs(["groessenklasse", "konstitution", "hiddeninibr", "lebenspunktemod", "hiddenlp"], function (values) {
        let update = {};
        let basis = +values.groessenklasse + +values.konstitution;
        let mod = +values.lebenspunktemod;
        let robust = +values.hiddenlp;
        let tooltip = "Basis: " + basis;
        if (+mod > 0) {
            tooltip += "\n + " + +mod + " (Mod.)";
        }
        if (+robust > 0) {
            tooltip += "\n + " + +robust + " (Robust)";
        }
        update["lptooltip"] = tooltip;
        setAttrs(update);
    });
    getAttrs(["mystik", "willenskraft", "fokusmod", "hiddenfokus"], function (values) {
        let update = {};
        let basis = (+values.mystik + +values.willenskraft) * 2;
        let mod = +values.fokusmod;
        let fokuspool = +values.hiddenfokus;
        let tooltip = "Basis: " + basis;
        if (+mod > 0) {
            tooltip += "\n + " + +mod + " (Mod.)";
        }
        if (+fokuspool > 0) {
            tooltip += "\n + " + +fokuspool + " (Erh. Fokuspool)";
        }
        update["fokustooltip"] = tooltip;
        setAttrs(update);
    });
    getAttrs(["verstand", "willenskraft", "geistigerwiderstandmod", "hiddengw", "hiddengwhg", "hiddengwbonus", "hiddenallwiderstand"], function (values) {
        let update = {};
        let basis = 12 + +values.verstand + +values.willenskraft;
        let mod = +values.geistigerwiderstandmod;
        let hohergw = +values.hiddengw;
        let hg = +values.hiddengwhg;
        let modigw = +values.hiddengwbonus;
        let modiallew = +values.hiddenallwiderstand;
        let tooltip = "Basis: " + basis;
        if (+mod > 0) {
            tooltip += "\n + " + +mod + " (Mod.)";
        }
        if (+hohergw > 0) {
            tooltip += "\n + " + +hohergw + " (Hoher GW)";
        }
        if (+hg > 0) {
            tooltip += "\n + " + +hg + " (Heldengrad)";
        }
        if (+modigw > 0) {
            tooltip += "\n + " + +modigw + " (Modifikator: GW)";
        }
        if (+modiallew > 0) {
            tooltip += "\n + " + +modiallew + " (Modifikator: Alle Widerstände)";
        }
        update["gwtooltip"] = tooltip;
        setAttrs(update);
    });
    getAttrs(["konstitution", "willenskraft", "koerperlicherwiderstandmod", "hiddenkw", "hiddenkwhg", "hiddenkwbonus", "hiddenallwiderstand"], function (values) {
        let update = {};
        let basis = 12 + +values.konstitution + +values.willenskraft;
        let mod = +values.koerperlicherwiderstandmod;
        let hoherkw = +values.hiddenkw;
        let hg = +values.hiddenkwhg;
        let modikw = +values.hiddenkwbonus;
        let modiallew = +values.hiddenallwiderstand;
        let tooltip = "Basis: " + basis;
        if (+mod > 0) {
            tooltip += "\n + " + +mod + " (Mod.)";
        }
        if (+hoherkw > 0) {
            tooltip += "\n + " + +hoherkw + " (Hoher KW)";
        }
        if (+hg > 0) {
            tooltip += "\n + " + +hg + " (Heldengrad)";
        }
        if (+modikw > 0) {
            tooltip += "\n + " + +modikw + " (Modifikator: KW)";
        }
        if (+modiallew > 0) {
            tooltip += "\n + " + +modiallew + " (Modifikator: Alle Widerstände)";
        }
        update["kwtooltip"] = tooltip;
        setAttrs(update);
    });
});

on("change:ausstrahlungstart change:beweglichkeitstart change:intuitionstart change:konstitutionstart change:mystikstart change:staerkestart change:verstandstart change:willenskraftstart change:heldengrad", function () {
    getAttrs(["ausstrahlungstart", "beweglichkeitstart", "intuitionstart", "konstitutionstart", "mystikstart", "staerkestart", "verstandstart", "willenskraftstart", "heldengrad"], function (values) {
        setAttrs({
            ausstrahlungmax: +values.ausstrahlungstart + +values.heldengrad,
            beweglichkeitmax: +values.beweglichkeitstart + +values.heldengrad,
            intuitionmax: +values.intuitionstart + +values.heldengrad,
            konstitutionmax: +values.konstitutionstart + +values.heldengrad,
            mystikmax: +values.mystikstart + +values.heldengrad,
            staerkemax: +values.staerkestart + +values.heldengrad,
            verstandmax: +values.verstandstart + +values.heldengrad,
            willenskraftmax: +values.willenskraftstart + +values.heldengrad
        });
    });
});

on("change:repeating_meisterschaften:meisterschaftsschwelle", function () {
    getAttrs(["repeating_meisterschaften_meisterschaftsname", "repeating_meisterschaften_meisterschaftsfertigkeit", "blitzreflexecount", "sprintercount"], function (values) {
        var name = values.repeating_meisterschaften_meisterschaftsname;
        var fertigkeit = values.repeating_meisterschaften_meisterschaftsfertigkeit;
        var update = {};
        if (name != "" && fertigkeit != "") {
            switch (name.toLowerCase()) {
                case "blitzreflexe":
                    update["blitzreflexecount"] = +values.blitzreflexecount + 1;
                    break;
                case "gute reflexe":
                    update["hiddenvtdgr"] = 1;
                    break;
                case "rüstungsträger i":
                case "rüstungsträger 1":
                    update["rt1"] = 1;
                    break;
                case "rüstungsträger ii":
                case "rüstungsträger 2":
                    update["rt2"] = 1;
                case "starker schildarm i":
                case "starker schildarm 1":
                    update["st1"] = 1;
                    break;
                case "schmerzwiderstand i":
                case "schmerzwiderstand 1":
                    update["sw1"] = 1;
                    break
                case "starker schildarm ii":
                case "starker schildarm 2":
                    update["st2"] = 1;
                    break;
                case "schmerzwiderstand ii":
                case "schmerzwiderstand 2":
                    update["sw2"] = 1;
                    break;
                case "arkane geschwindigkeit":
                    update["hiddengswag"] = 1;
                    break;
                case "sprinter":
                    update["sprintercount"] = +values.sprintercount + 1;
                    break;
            }
            setAttrs(update);
        }
    });
});

on("change:repeating_staerken:staerkenwert change:repeating_staerken:staerkename", function () {
    getAttrs(["repeating_staerken_staerkenwert", "repeating_staerken_staerkename"], function (values) {
        var staerke = values.repeating_staerken_staerkename;
        var staerkenwert = values.repeating_staerken_staerkenwert;
        var update = {};
        if (staerkenwert >= 0) {
            switch (staerke.toLowerCase()) {
                case "robust":
                    update["hiddenlp"] = +staerkenwert;
                    break;
                case "erhöhter fokuspool":
                    update["hiddenfokus"] = +staerkenwert * 5;
                    break;
                case "flink":
                    update["hiddengsw"] = +staerkenwert;
                    break;
                case "hoher geistiger widerstand":
                    update["hiddengw"] = +staerkenwert * 2;
                    break;
                case "hoher körperlicher widerstand":
                    update["hiddenkw"] = +staerkenwert * 2;
                    break
                case "natürlicher rüstungsschutz":
                    update["hiddensr"] = +staerkenwert;
                    break;
                case "verbesserte initiative":
                    update["hiddenini"] = +staerkenwert * 3;
                    break;
                case "schmerzresistenz":
                    update["schmerzresistenz"] = +staerkenwert;
                    break;
                case "zusätzliche splitterpunkte":
                    update["hiddensplitterpunkte"] = +staerkenwert * 2;
                    break;
                case "erhöhte fokusregeneration":
                    update["hiddenfokreg"] = +staerkenwert;
                    break;
                case "erhöhte lebensregeneration":
                    update["hiddenlifereg"] = +staerkenwert;
                    break;
                case "stabile magie":
                    update["hiddensbm"] = +staerkenwert;
            }
        } else if (!(staerkenwert) && (staerke != "")) {
            setAttrs({
                'repeating_staerken_staerkenwert': 1
            });
        }
        setAttrs(update);
    });
});

on("change:hiddensplitterpunkte change:hiddensplitterpunktehg", function () {
    getAttrs(["hiddensplitterpunkte", "hiddensplitterpunktehg"], function (v) {
        setAttrs({
            splitterpunkte: 3 + +v.hiddensplitterpunkte + +v.hiddensplitterpunktehg
        });
    });
});

on("change:repeating_zauber:magieschulen change:hiddenausstrahlungmod change:hiddenbeweglichkeitmod change:hiddenintuitionmod change:hiddenkonstitutionmod change:hiddenmystikmod change:hiddenstaerkemod change:hiddenverstandmod change:hiddenwillenskraftmod change:bannmagiebonus change:beherrschungsmagiebonus change:bewegungsmagiebonus change:erkenntnismagiebonus change:felsmagiebonus change:feuermagiebonus change:heilungsmagiebonus change:illusionsmagiebonus change:kampfmagiebonus change:lichtmagiebonus change:naturmagiebonus change:schattenmagiebonus change:schicksalsmagiebonus change:schutzmagiebonus change:staerkungsmagiebonus change:todesmagiebonus change:verwandlungsmagiebonus change:wassermagiebonus change:windmagiebonus", function () {
    getSectionIDs("repeating_zauber", function (idarray) {
        if (idarray.length > 0) {
            var update = {};
            var skill = 0;
            var bonus = 0;
            var attr = 0;
            _.each(idarray, function (currentID, i) {
                getAttrs(["repeating_zauber_" + currentID + "_magieschulen", "arkanekunde1", "arkanekunde2", "arkanekundepunkte", "arkanekundebonus", "bannmagie", "bannmagiebonus", "beherrschungsmagie", "beherrschungsmagiebonus", "bewegungsmagie", "bewegungsmagiebonus", "erkenntnismagie", "erkenntnismagiebonus", "felsmagie", "felsmagiebonus", "feuermagie", "feuermagiebonus", "heilungsmagie", "heilungsmagiebonus", "illusionsmagie", "illusionsmagiebonus", "kampfmagie", "kampfmagiebonus", "lichtmagie", "lichtmagiebonus", "naturmagie", "naturmagiebonus", "schattenmagie", "schattenmagiebonus", "schicksalsmagie", "schicksalsmagiebonus", "schutzmagie", "schutzmagiebonus", "staerkungsmagie", "staerkungsmagiebonus", "todesmagie", "todesmagiebonus", "verwandlungsmagie", "verwandlungsmagiebonus", "wassermagie", "wassermagiebonus", "windmagie", "windmagiebonus", "hiddenausstrahlungmod", "hiddenbeweglichkeitmod", "hiddenintuitionmod", "hiddenkonstitutionmod", "hiddenmystikmod", "hiddenstaerkemod", "hiddenverstandmod", "hiddenwillenskraftmod"], function (v) {
                    switch (v["repeating_zauber_" + currentID + "_magieschulen"]) {
                        case "arkanekundezauber":
                            skill = +v.arkanekunde1 + +v.arkanekunde2 + +v.arkanekundepunkte,
                                bonus = +v.arkanekundebonus;
                            attr = +v.hiddenmystikmod + +v.hiddenverstandmod;
                            break;
                        case "bann":
                            skill = v.bannmagie;
                            bonus = v.bannmagiebonus;
                            attr = +v.hiddenmystikmod + +v.hiddenwillenskraftmod;
                            break;
                        case "beherrschung":
                            skill = v.beherrschungsmagie;
                            bonus = v.beherrschungsmagiebonus;
                            attr = +v.hiddenmystikmod + +v.hiddenwillenskraftmod;
                            break;
                        case "bewegung":
                            skill = v.bewegungsmagie;
                            bonus = v.bewegungsmagiebonus;
                            attr = +v.hiddenmystikmod + +v.hiddenbeweglichkeitmod;
                            break;
                        case "erkenntnis":
                            skill = v.erkenntnismagie;
                            bonus = v.erkenntnismagiebonus;
                            attr = +v.hiddenmystikmod + +v.hiddenverstandmod;
                            break;
                        case "fels":
                            skill = v.felsmagie;
                            bonus = v.felsmagiebonus;
                            attr = +v.hiddenmystikmod + +v.hiddenkonstitutionmod;
                            break;
                        case "feuer":
                            skill = v.feuermagie;
                            bonus = v.feuermagiebonus;
                            attr = +v.hiddenmystikmod + +v.hiddenausstrahlungmod;
                            break;
                        case "heilung":
                            skill = v.heilungsmagie;
                            bonus = v.heilungsmagiebonus;
                            attr = +v.hiddenmystikmod + +v.hiddenausstrahlungmod;
                            break;
                        case "illusion":
                            skill = v.illusionsmagie;
                            bonus = v.illusionsmagiebonus;
                            attr = +v.hiddenmystikmod + +v.hiddenausstrahlungmod;
                            break;
                        case "kampf":
                            skill = v.kampfmagie;
                            bonus = v.kampfmagiebonus;
                            attr = +v.hiddenmystikmod + +v.hiddenstaerkemod;
                            break;
                        case "licht":
                            skill = v.lichtmagie;
                            bonus = v.lichtmagiebonus;
                            attr = +v.hiddenmystikmod + +v.hiddenausstrahlungmod;
                            break;
                        case "natur":
                            skill = v.naturmagie;
                            bonus = v.naturmagiebonus;
                            attr = +v.hiddenmystikmod + +v.hiddenausstrahlungmod;
                            break;
                        case "schatten":
                            skill = v.schattenmagie;
                            bonus = v.schattenmagiebonus;
                            attr = +v.hiddenmystikmod + +v.hiddenintuitionmod;
                            break;
                        case "schicksal":
                            skill = v.schicksalsmagie;
                            bonus = v.schicksalsmagiebonus;
                            attr = +v.hiddenmystikmod + +v.hiddenausstrahlungmod;
                            break;
                        case "schutz":
                            skill = v.schutzmagie;
                            bonus = v.schutzmagiebonus;
                            attr = +v.hiddenmystikmod + +v.hiddenausstrahlungmod;
                            break;
                        case "staerkung":
                            skill = v.staerkungsmagie;
                            bonus = v.staerkungsmagiebonus;
                            attr = +v.hiddenmystikmod + +v.hiddenstaerkemod;
                            break;
                        case "tod":
                            skill = v.todesmagie;
                            bonus = v.todesmagiebonus;
                            attr = +v.hiddenmystikmod + +v.hiddenverstandmod;
                            break;
                        case "verwandlung":
                            skill = v.verwandlungsmagie;
                            bonus = v.verwandlungsmagiebonus;
                            attr = +v.hiddenmystikmod + +v.hiddenkonstitutionmod;
                            break;
                        case "wasser":
                            skill = v.wassermagie;
                            bonus = v.wassermagiebonus;
                            attr = +v.hiddenmystikmod + +v.hiddenverstandmod;
                            break;
                        case "wind":
                            skill = v.windmagie;
                            bonus = v.windmagiebonus;
                            attr = +v.hiddenmystikmod + +v.hiddenverstandmod;
                            break;
                    }
                    update["repeating_zauber_" + currentID + "_zauberwert"] = +skill;
                    update["repeating_zauber_" + currentID + "_hiddenmod"] = +bonus;
                    update["repeating_zauber_" + currentID + "_zauberattrmod"] = +attr;
                    setAttrs(update);
                });
            });

        }
    });
});

on("change:repeating_nahkampfwaffen:waffenskill change:repeating_nahkampfwaffen:waffenattr1 change:repeating_nahkampfwaffen:waffenattr2 change:repeating_fernkampfwaffen:waffenskillfern change:repeating_fernkampfwaffen:waffenattr1fern change:repeating_fernkampfwaffen:waffenattr2fern change:handgemengepunkte change:handgemengebonus change:hiebwaffenpunkte change:hiebwaffenbonus change:kettenwaffenpunkte change:kettenwaffenbonus change:klingenwaffenpunkte change:klingenwaffenbonus change:stangenwaffenpunkte change:stangenwaffenbonus change:schusswaffenpunkte change:schusswaffenbonus change:wurfwaffenpunkte change:wurfwaffenbonus change:ausstrahlung change:beweglichkeit change:intuition change:konstitution change:mystik change:staerke change:verstand change:willenskraft change:hiddenausstrahlung change:hiddenbeweglichkeit change:hiddenintuition change:hiddenkonstitution change:hiddenmystik change:hiddenstaerke change:hiddenverstand change:hiddenwillenskraft change:hiddenausstrahlungmod change:hiddenbeweglichkeitmod change:hiddenintuitionmod change:hiddenkonstitutionmod change:hiddenmystikmod change:hiddenstaerkemod change:hiddenverstandmod change:hiddenwillenskraftmod", function () {

    // Nahkampfwaffen
    getSectionIDs("repeating_nahkampfwaffen", function (idarray) {
        var temp1 = 0;
        var temp2 = 0;
        var temp3 = 0;
        if (idarray.length > 0) {
            _.each(idarray, function (currentID, i) {
                let attrmod = 0;
                getAttrs(["repeating_nahkampfwaffen_" + currentID + "_waffenskill", "repeating_nahkampfwaffen_" + currentID + "_waffenattr1", "repeating_nahkampfwaffen_" + currentID + "_waffenattr2", "handgemengepunkte", "handgemengebonus", "hiebwaffenpunkte", "hiebwaffenbonus", "kettenwaffenpunkte", "kettenwaffenbonus", "klingenwaffenpunkte", "klingenwaffenbonus", "stangenwaffenpunkte", "stangenwaffenbonus", "ausstrahlung", "beweglichkeit", "intuition", "konstitution", "mystik", "staerke", "verstand", "willenskraft", "hiddenausstrahlung", "hiddenbeweglichkeit", "hiddenintuition", "hiddenkonstitution", "hiddenmystik", "hiddenstaerke", "hiddenverstand", "hiddenwillenskraft", "hiddenausstrahlungmod", "hiddenbeweglichkeitmod", "hiddenintuitionmod", "hiddenkonstitutionmod", "hiddenmystikmod", "hiddenstaerkemod", "hiddenverstandmod", "hiddenwillenskraftmod"], function (v) {
                    var skill = v["repeating_nahkampfwaffen_" + currentID + "_waffenskill"];
                    var attr1 = v["repeating_nahkampfwaffen_" + currentID + "_waffenattr1"];
                    var attr2 = v["repeating_nahkampfwaffen_" + currentID + "_waffenattr2"];
                    var update = {};
                    switch (skill) {
                        case "hiebwaffen":
                            temp1 = +v.hiebwaffenpunkte + +v.hiebwaffenbonus;
                            break;
                        case "handgemenge":
                            temp1 = +v.handgemengepunkte + +v.handgemengebonus;
                            break;
                        case "kettenwaffen":
                            temp1 = +v.kettenwaffenpunkte + +v.kettenwaffenbonus;
                            break;
                        case "klingenwaffen":
                            temp1 = +v.klingenwaffenpunkte + +v.klingenwaffenbonus;
                            break;
                        case "stangenwaffen":
                            temp1 = +v.stangenwaffenpunkte + +v.stangenwaffenbonus;
                            break;
                    }
                    switch (attr1) {
                        case "aus":
                            temp2 = +v.ausstrahlung + +v.hiddenausstrahlung;
                            attrmod += v.hiddenausstrahlungmod;
                            break;
                        case "bew":
                            temp2 = +v.beweglichkeit + +v.hiddenbeweglichkeit;
                            attrmod += v.hiddenbeweglichkeitmod;
                            break;
                        case "int":
                            temp2 = +v.intuition + +v.hiddenintuition;
                            attrmod += v.hiddenintuitionmod;
                            break;
                        case "kon":
                            temp2 = +v.konstitution + +v.hiddenkonstitution;
                            attrmod += v.hiddenkonstitutionmod;
                            break;
                        case "mys":
                            temp2 = +v.mystik + +v.hiddenmystik;
                            attrmod += v.hiddenmystikmod;
                            break;
                        case "stae":
                            temp2 = +v.staerke + +v.hiddenstaerke;
                            attrmod += v.hiddenstaerkemod
                            break;
                        case "ver":
                            temp2 = +v.verstand + +v.hiddenverstand;
                            attrmod += v.hiddenverstandmod;
                            break;
                        case "wil":
                            temp2 = +v.willenskraft + +v.hiddenwillenskraft;
                            attrmod += v.hiddenwillenskraftmod;
                            break;
                    }
                    switch (attr2) {
                        case "aus":
                            temp3 = +v.ausstrahlung + +v.hiddenausstrahlung;
                            attrmod += v.hiddenausstrahlungmod;
                            break;
                        case "bew":
                            temp3 = +v.beweglichkeit + +v.hiddenbeweglichkeit;
                            attrmod += v.hiddenbeweglichkeitmod;
                            break;
                        case "int":
                            temp3 = +v.intuition + +v.hiddenintuition;
                            attrmod += v.hiddenintuitionmod;
                            break;
                        case "kon":
                            temp3 = +v.konstitution + +v.hiddenkonstitution;
                            attrmod += v.hiddenkonstitutionmod;
                            break;
                        case "mys":
                            temp3 = +v.mystik + +v.hiddenmystik;
                            attrmod += v.hiddenmystikmod;
                            break;
                        case "stae":
                            temp3 = +v.staerke + +v.hiddenstaerke;
                            attrmod += v.hiddenstaerkemod
                            break;
                        case "ver":
                            temp3 = +v.verstand + +v.hiddenverstand;
                            attrmod += v.hiddenverstandmod;
                            break;
                        case "wil":
                            temp3 = +v.willenskraft + +v.hiddenwillenskraft;
                            attrmod += v.hiddenwillenskraftmod;
                            break;
                    }
                    update["repeating_nahkampfwaffen_" + currentID + "_waffenwert"] = +temp1 + +temp2 + +temp3;
                    update["repeating_nahkampfwaffen_" + currentID + "_nahwaffenattrmod"] = +attrmod;
                    setAttrs(update);
                });
            });
        }
    });

    // Fernkampfwaffen
    getSectionIDs("repeating_fernkampfwaffen", function (idarray) {
        var temp1 = 0;
        var temp2 = 0;
        var temp3 = 0;
        if (idarray.length > 0) {
            _.each(idarray, function (currentID, i) {
                let attrmod = 0;
                getAttrs(["repeating_fernkampfwaffen_" + currentID + "_waffenskillfern", "repeating_fernkampfwaffen_" + currentID + "_waffenattr1fern", "repeating_fernkampfwaffen_" + currentID + "_waffenattr2fern", "schusswaffenpunkte", "schusswaffenbonus", "wurfwaffenpunkte", "wurfwaffenbonus", "ausstrahlung", "beweglichkeit", "intuition", "konstitution", "mystik", "staerke", "verstand", "willenskraft", "hiddenausstrahlung", "hiddenbeweglichkeit", "hiddenintuition", "hiddenkonstitution", "hiddenmystik", "hiddenstaerke", "hiddenverstand", "hiddenwillenskraft", "hiddenausstrahlungmod", "hiddenbeweglichkeitmod", "hiddenintuitionmod", "hiddenkonstitutionmod", "hiddenmystikmod", "hiddenstaerkemod", "hiddenverstandmod", "hiddenwillenskraftmod", "bannmagiepunkte", "bannmagiebonus", "beherrschungsmagiepunkte", "beherrschungsmagiebonus", "bewegungsmagiepunkte", "bewegungsmagiebonus", "erkenntnismagiepunkte", "erkenntnismagiebonus", "felsmagiepunkte", "felsmagiebonus", "feuermagiepunkte", "feuermagiebonus", "heilungsmagiepunkte", "heilungsmagiebonus", "illusionsmagiepunkte", "illusionsmagiebonus", "kampfmagiepunkte", "kampfmagiebonus", "lichtmagiepunkte", "lichtmagiebonus", "naturmagiepunkte", "naturmagiebonus", "schattenmagiepunkte", "schattenmagiebonus", "schicksalsmagiepunkte", "schicksalsmagiebonus", "schutzmagiepunkte", "schutzmagiebonus", "staerkungsmagiepunkte", "staerkungsmagiebonus", "todesmagiepunkte", "todesmagiebonus", "verwandlungsmagiepunkte", "verwandlungsmagiebonus", "wassermagiepunkte", "wassermagiebonus", "windmagiepunkte", "windmagiebonus", "arkanekundepunkte", "arkanekundebonus"], function (v) {
                    var skill = v["repeating_fernkampfwaffen_" + currentID + "_waffenskillfern"];
                    var attr1 = v["repeating_fernkampfwaffen_" + currentID + "_waffenattr1fern"];
                    var attr2 = v["repeating_fernkampfwaffen_" + currentID + "_waffenattr2fern"];
                    var setattr2 = "aus";
                    var update = {};
                    var attrupdate = {};
                    if (skill == "schusswaffen") {
                        temp1 = +v.schusswaffenpunkte + +v.schusswaffenbonus;
                    } else if (skill == "wurfwaffen") {
                        temp1 = +v.wurfwaffenpunkte + +v.wurfwaffenbonus;
                    } else {
                        switch (skill) {
                            case "arkanekunde":
                                temp1 = +v.arkanekundepunkte + +v.arkanekundebonus;
                                setattr2 = "ver";
                                break;
                            case "bannmagie":
                                temp1 = +v.bannmagiepunkte + +v.bannmagiebonus;
                                setattr2 = "wil";
                                break;
                            case "beherrschungsmagie":
                                temp1 = +v.beherrschungsmagiepunkte + +v.beherrschungsmagiebonus;
                                setattr2 = "wil";
                                break;
                            case "bewegungsmagie":
                                temp1 = +v.bewegungsmagiepunkte + +v.bewegungsmagiebonus;
                                setattr2 = "bew";
                                break;
                            case "erkenntnismagie":
                                temp1 = +v.erkenntnismagiepunkte + +v.erkenntnismagiebonus;
                                setattr2 = "ver";
                                break;
                            case "felsmagie":
                                temp1 = +v.felsmagiepunkte + +v.felsmagiebonus;
                                setattr2 = "kon";
                                break;
                            case "feuermagie":
                                temp1 = +v.feuermagiepunkte + +v.feuermagiebonus;
                                break;
                            case "heilungsmagie":
                                temp1 = +v.heilungsmagiepunkte + +v.heilungsmagiebonus;
                                break;
                            case "illusionsmagie":
                                temp1 = +v.illusionsmagiepunkte + +v.illusionsmagiebonus;
                                break;
                            case "kampfmagie":
                                temp1 = +v.kampfmagiepunkte + +v.kampfmagiebonus;
                                setattr2 = "stae";
                                break;
                            case "lichtmagie":
                                temp1 = +v.lichtmagiepunkte + +v.lichtmagiebonus;
                                break;
                            case "naturmagie":
                                temp1 = +v.naturmagiepunkte + +v.naturmagiebonus;
                                break;
                            case "schattenmagie":
                                temp1 = +v.schattenmagiepunkte + +v.schattenmagiebonus;
                                setattr2 = "int";
                                break;
                            case "schicksalsmagie":
                                temp1 = +v.schicksalsmagiepunkte + +v.schicksalsmagiebonus;
                                break;
                            case "schutzmagie":
                                temp1 = +v.schutzmagiepunkte + +v.schutzmagiebonus;
                                break;
                            case "staerkungsmagie":
                                temp1 = +v.staerkungsmagiepunkte + +v.staerkungsmagiebonus;
                                setattr2 = "stae";
                                break;
                            case "todesmagie":
                                temp1 = +v.todesmagiepunkte + +v.todesmagiebonus;
                                setattr2 = "ver";
                                break;
                            case "verwandlungsmagie":
                                temp1 = +v.verwandlungsmagiepunkte + +v.verwandlungsmagiebonus;
                                setattr2 = "kon";
                                break;
                            case "wassermagie":
                                temp1 = +v.wassermagiepunkte + +v.wassermagiebonus;
                                setattr2 = "int";
                                break;
                            case "windmagie":
                                temp1 = +v.windmagiepunkte + +v.windmagiebonus;
                                setattr2 = "ver";
                                break;
                        }
                        attrupdate["repeating_fernkampfwaffen_" + currentID + "_waffenattr1fern"] = "mys";
                        attrupdate["repeating_fernkampfwaffen_" + currentID + "_waffenattr2fern"] = setattr2;
                        setAttrs(attrupdate);
                    }
                    switch (attr1) {
                        case "aus":
                            temp2 = +v.ausstrahlung + +v.hiddenausstrahlung;
                            attrmod += v.hiddenausstrahlungmod;
                            break;
                        case "bew":
                            temp2 = +v.beweglichkeit + +v.hiddenbeweglichkeit;
                            attrmod += v.hiddenbeweglichkeitmod;
                            break;
                        case "int":
                            temp2 = +v.intuition + +v.hiddenintuition;
                            attrmod += v.hiddenintuitionmod;
                            break;
                        case "kon":
                            temp2 = +v.konstitution + +v.hiddenkonstitution;
                            attrmod += v.hiddenkonstitutionmod;
                            break;
                        case "mys":
                            temp2 = +v.mystik + +v.hiddenmystik;
                            attrmod += v.hiddenmystikmod;
                            break;
                        case "stae":
                            temp2 = +v.staerke + +v.hiddenstaerke;
                            attrmod += v.hiddenstaerkemod
                            break;
                        case "ver":
                            temp2 = +v.verstand + +v.hiddenverstand;
                            attrmod += v.hiddenverstandmod;
                            break;
                        case "wil":
                            temp2 = +v.willenskraft + +v.hiddenwillenskraft;
                            attrmod += v.hiddenwillenskraftmod;
                            break;
                    }
                    switch (attr2) {
                        case "aus":
                            temp3 = +v.ausstrahlung + +v.hiddenausstrahlung;
                            attrmod += v.hiddenausstrahlungmod;
                            break;
                        case "bew":
                            temp3 = +v.beweglichkeit + +v.hiddenbeweglichkeit;
                            attrmod += v.hiddenbeweglichkeitmod;
                            break;
                        case "int":
                            temp3 = +v.intuition + +v.hiddenintuition;
                            attrmod += v.hiddenintuitionmod;
                            break;
                        case "kon":
                            temp3 = +v.konstitution + +v.hiddenkonstitution;
                            attrmod += v.hiddenkonstitutionmod;
                            break;
                        case "mys":
                            temp3 = +v.mystik + +v.hiddenmystik;
                            attrmod += v.hiddenmystikmod;
                            break;
                        case "stae":
                            temp3 = +v.staerke + +v.hiddenstaerke;
                            attrmod += v.hiddenstaerkemod
                            break;
                        case "ver":
                            temp3 = +v.verstand + +v.hiddenverstand;
                            attrmod += v.hiddenverstandmod;
                            break;
                        case "wil":
                            temp3 = +v.willenskraft + +v.hiddenwillenskraft;
                            attrmod += v.hiddenwillenskraftmod;
                            break;
                    }
                    update["repeating_fernkampfwaffen_" + currentID + "_waffenwertfern"] = +temp1 + +temp2 + +temp3;
                    update["repeating_fernkampfwaffen_" + currentID + "_fernwaffenattrmod"] = +attrmod;
                    setAttrs(update);
                });
            });
        }
    });
});

on("change:ruestungkreatur_onoff change:ruestungkreatur_tickplus change:ruestungkreatur_vtd change:ruestungkreatur_sr", function () {
    getAttrs(["ruestungkreatur_onoff", "ruestungkreatur_tickplus", "ruestungkreatur_vtd", "ruestungkreatur_sr"], function (v) {
        let ruestungonoff = v.ruestungkreatur_onoff;
        let tickplus = 0;
        let vtdplus = 0;
        let srplus = 0;
        if (ruestungonoff == true) {
            tickplus = +v.ruestungkreatur_tickplus;
            vtdplus = +v.ruestungkreatur_vtd;
            srplus = +v.ruestungkreatur_sr;
        }
        setAttrs({
            creature_tickplus_ruestung: tickplus,
            creature_vtd_ruestung: vtdplus,
            creature_sr_ruestung: srplus
        });
    });
});

on("change:repeating_ruestungen remove:repeating_ruestungen change:repeating_ruestungen:ruestungonoff change:rt1 change:rt2", function () {
    getSectionIDs("repeating_ruestungen", function (idarray) {
        if (idarray.length == 0) {
            setAttrs({
                hiddenruestungsvtd: 0,
                hiddenruestungssr: 0,
                hiddenruestungsbe: 0,
                hiddenruestungstickplus: 0
            });
        } else {
            var insgesamtvtd = 0;
            var insgesamtbe = 0;
            var insgesamtsr = 0;
            var insgesamttickplus = 0;
            var keineausgeruestet = true;
            _.each(idarray, function (currentID, i) {
                getAttrs(["repeating_ruestungen_" + currentID + "_ruestungsvtd", "repeating_ruestungen_" + currentID + "_ruestungsbe", "repeating_ruestungen_" + currentID + "_ruestungssr", "repeating_ruestungen_" + currentID + "_ruestungonoff", "repeating_ruestungen_" + currentID + "_ruestungstickplus", "gesamtvtd", "gesamtsr", "gesamtbe", "rt1", "rt2"], function (v) {
                    var vtd = v["repeating_ruestungen_" + currentID + "_ruestungsvtd"];
                    var be = v["repeating_ruestungen_" + currentID + "_ruestungsbe"];
                    var sr = v["repeating_ruestungen_" + currentID + "_ruestungssr"];
                    var tp = v["repeating_ruestungen_" + currentID + "_ruestungstickplus"];
                    var onoff = v["repeating_ruestungen_" + currentID + "_ruestungonoff"];
                    if (onoff == true) {
                        keineausgeruestet = false;
                        insgesamtvtd += +vtd;
                        insgesamtbe += +be;
                        insgesamtsr += +sr;
                        insgesamttickplus += +tp;
                        setAttrs({
                            hiddenruestungsvtd: +insgesamtvtd,
                            hiddenruestungssr: +insgesamtsr,
                            hiddenruestungsbe: +insgesamtbe - +v.rt1,
                            hiddenruestungstickplus: +insgesamttickplus - +v.rt2
                        });
                    }
                });
            });
            if (keineausgeruestet == true) {
                setAttrs({
                    hiddenruestungsvtd: 0,
                    hiddenruestungssr: 0,
                    hiddenruestungsbe: 0,
                    hiddenruestungstickplus: 0
                });
            }
        }
    });
});

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

on("change:repeating_zustaende remove:repeating_zustaende", function (g) {
    getSectionIDs("zustaende", function (idarray) {
        if (idarray.length == 0) {
            var deleteAll = {};
            deleteAll["verwundet"] = 0;
            deleteAll["benommen"] = 0;
            deleteAll["geblendet"] = 0;
            deleteAll["erschoepft"] = 0;
            deleteAll["lahm"] = 0;
            deleteAll["glaubenskrise"] = 0;
            setAttrs(deleteAll);
        } else {
            var verwundet = 0;
            var benommen = 0;
            var erschoepft = 0;
            var geblendet = 0;
            var lahm = 0;
            var glaubenskrise = 0;
            var keineraktiviert = true;
            _.each(idarray, function (currentID, i) {
                getAttrs(["repeating_zustaende_" + currentID + "_zustandsname", "repeating_zustaende_" + currentID + "_zustandsstufe", "repeating_zustaende_" + currentID + "_zustandonoff", "beweglichkeit", "groessenklasse", "geschwindigkeitmod", "hiddengsw", "hiddengswag", "hiddengswspr", "hiddengswbe", "erschoepft"], function (v) {
                    var zustandsname = v["repeating_zustaende_" + currentID + "_zustandsname"];
                    var zustandsstufe = v["repeating_zustaende_" + currentID + "_zustandsstufe"];
                    var zustandonoff = v["repeating_zustaende_" + currentID + "_zustandonoff"];
                    if (+zustandonoff == 1) {
                        keineraktiviert = false;
                        switch (zustandsname) {
                            case "verwundet":
                                verwundet += +zustandsstufe;
                                setAttrs({
                                    verwundet: +verwundet
                                });
                                break;
                            case "benommen":
                                benommen += +zustandsstufe;
                                setAttrs({
                                    benommen: +benommen
                                });
                                break;
                            case "geblendet":
                                geblendet += +zustandsstufe * 2;
                                setAttrs({
                                    geblendet: +geblendet
                                });
                                break;
                            case "erschoepft":
                                erschoepft += +zustandsstufe;
                                setAttrs({
                                    erschoepft: +erschoepft
                                });
                                break;
                            case "glaubenskrise":
                                glaubenskrise += +zustandsstufe;
                                setAttrs({
                                    glaubenskrise: +glaubenskrise
                                });
                                break;
                            case "lahm":
                                let lahmAlt = +v.beweglichkeit + +v.groessenklasse + +v.geschwindigkeitmod + +v.hiddengsw + +v.hiddengswag + +v.hiddengswspr - +v.hiddengswbe - +v.erschoepft;
                                let lahm = 0;
                                let lahmTemp = 0;
                                if (zustandsstufe == 0) {
                                    setAttrs({ lahm: +zustandsstufe });
                                } else if (zustandsstufe > 0) {
                                    for (var i = 1; i <= +zustandsstufe; i++) {
                                        lahmTemp = lahmAlt;
                                        lahmAlt /= 2;
                                        lahm += (lahmTemp - lahmAlt);
                                    }
                                    setAttrs({ lahm: +Math.floor(lahm) });
                                }
                                break;
                            default:
                                break;
                        }
                    }
                });
            });
            if (keineraktiviert == true) {
                setAttrs({
                    verwundet: 0,
                    benommen: 0,
                    geblendet: 0,
                    erschoepft: 0,
                    lahm: 0
                });
            }
        }
    });
});

on("change:schildonoff change:schildvtd change:schildbe change:schildtickplus change:st1 change:st2", function (info) {
    getAttrs(["schildonoff"], function (f) {
        if (f.schildonoff == true) {
            getAttrs(["schildvtd", "schildbe", "schildtickplus", "st1", "st2"], function (g) {
                setAttrs({
                    hiddenschildvtd: +g.schildvtd,
                    hiddenschildbe: +g.schildbe - +g.st1,
                    hiddenschildtickplus: +g.schildtickplus - +g.st2
                });
            });
        } else {
            setAttrs({
                hiddenschildvtd: 0,
                hiddenschildbe: 0,
                hiddenschildtickplus: 0
            });
        }
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

on("change:behinderung", function (eventinfo) {
    getAttrs(["behinderung"], function (values) {
        var modifier = Math.floor(+values.behinderung / 2);
        setAttrs({
            hiddengswbe: modifier
        });
    });
});

on("change:lebenspunkte", function (e) {
    getAttrs(["lebenspunkte", "lebenspunkte_e", "lebenspunkte_k", "lebenspunkte_v"], function (v) {
        setAttrs({
            lebenspunkte_t: (+v.lebenspunkte * 5) - +v.lebenspunkte_e - +v.lebenspunkte_k - +v.lebenspunkte_v
        });
    });
});

on("change:fokus", function (e) {
    getAttrs(["fokus", "fokus_e", "fokus_k", "fokus_v"], function (v) {
        setAttrs({
            fokus_t: +v.fokus - +v.fokus_e - +v.fokus_k - +v.fokus_v
        });
    });
});

on("change:lebenspunkte_v change:lebenspunkte change:schmerzresistenz change:sw1 change:sw2 change:verwundet change:schadenimmun change:wundabzugsmod", function (e) {
    getAttrs(["lebenspunkte", "lebenspunkte_v", "lebenspunkte_k", "lebenspunkte_e", "schmerzresistenz", "sw1", "sw2", "verwundet", "schadenimmun", "wundabzugsmod"], function (v) {
        var mod;
        var row = Math.ceil(+v.lebenspunkte_v / +v.lebenspunkte);
        row += +v.verwundet;
        var sr = v.schmerzresistenz;
        var sw1 = v.sw1;
        var sw2 = v.sw2;
        var war = +v.wundabzugsmod;
        switch (row) {
            case 0:
            case 1:
                mod = 0;
                break;
            case 2:
                mod = 1 - +sr - +sw1 - +sw2;
                break;
            case 3:
                mod = 2 - +sr - +sw1 - +sw2;
                break;
            case 4:
                mod = 4 - +sr - +sw1 - +sw2;
                break;
            case 5:
                mod = 8 - +sr - +sw1 - +sw2;
                break;
            default:
                mod = 8 - +sr - +sw1 - +sw2;
                break;
        }
        mod -= +war;
        if (mod < 0 || v.schadenimmun > 0) { mod = 0; }
        setAttrs({
            schadensmod: +mod
        });
        if (e.sourceAttribute == "lebenspunkte_v") {
            setAttrs({
                lebenspunkte_t: (+v.lebenspunkte * 5) - +v.lebenspunkte_v - +v.lebenspunkte_e - +v.lebenspunkte_k
            });
        }
    });
});

on("change:repeating_attributmods remove:repeating_attributmods", function () {
    getSectionIDs("repeating_attributmods", function (idarray) {
        if (idarray.length == 0) {
            setAttrs({
                hiddenausstrahlungmod: 0,
                hiddenbeweglichkeitmod: 0,
                hiddenintuitionmod: 0,
                hiddenkonstitutionmod: 0,
                hiddenmystikmod: 0,
                hiddenstaerkemod: 0,
                hiddenverstandmod: 0,
                hiddenwillenskraftmod: 0,
                hiddenvtdbonus: 0,
                hiddengwbonus: 0,
                hiddenkwbonus: 0,
                hiddenallgfert: 0,
                hiddenbehinderungfruehsteuck: 0,
                hiddenschadensreduktionfruehstueck: 0,
                angriffsbonus: 0,
                kampffertigkeitenbonus: 0,
                schadenimmun: 0,
                hiddenallfert: 0,
                hiddenallwiderstand: 0,
                wundabzugsmod: 0,
                hiddenmodini: 0,
                hiddenmodgsw: 0
            });
        } else {
            var ausstrahlung = 0;
            var beweglichkeit = 0;
            var intuition = 0;
            var konstitution = 0;
            var mystik = 0;
            var staerke = 0;
            var verstand = 0;
            var willenskraft = 0;
            var vtd = 0;
            var kw = 0;
            var gw = 0;
            var allgfert = 0;
            var beh = 0;
            var sr = 0;
            var ab = 0;
            var kf = 0;
            var si = 0;
            var allfert = 0;
            var allwiderstand = 0;
            var wundabzugsmod = 0;
            var ini = 0;
            var gsw = 0;
            var keineaktiv = true;
            _.each(idarray, function (currentID, i) {
                getAttrs(["repeating_attributmods_" + currentID + "_modattribut", "repeating_attributmods_" + currentID + "_attributmod", "repeating_attributmods_" + currentID + "_attributmodonoff"], function (v) {
                    var attr = v["repeating_attributmods_" + currentID + "_modattribut"];
                    var mod = v["repeating_attributmods_" + currentID + "_attributmod"];
                    var onoff = v["repeating_attributmods_" + currentID + "_attributmodonoff"];
                    var update = {};
                    if (onoff == "on") {
                        keineaktiv = false;
                        switch (attr) {
                            case "aus":
                                ausstrahlung += +mod;
                                update["hiddenausstrahlungmod"] = +ausstrahlung;
                                break;
                            case "bew":
                                beweglichkeit += +mod;
                                update["hiddenbeweglichkeitmod"] = +beweglichkeit;
                                break;
                            case "int":
                                intuition += +mod;
                                update["hiddenintuitionmod"] = +intuition;
                                break;
                            case "kon":
                                konstitution += +mod;
                                update["hiddenkonstitutionmod"] = +konstitution;
                                break;
                            case "mys":
                                mystik += +mod;
                                update["hiddenmystikmod"] = +mystik;
                                break;
                            case "stae":
                                staerke += +mod;
                                update["hiddenstaerkemod"] = +staerke;
                                break;
                            case "ver":
                                verstand += +mod;
                                update["hiddenverstandmod"] = +verstand;
                                break;
                            case "wil":
                                willenskraft += +mod;
                                update["hiddenwillenskraftmod"] = +willenskraft;
                                break;
                            case "vtd":
                                vtd += +mod;
                                update["hiddenvtdbonus"] = +vtd;
                                break;
                            case "kw":
                                kw += +mod;
                                update["hiddenkwbonus"] = +kw;
                                break;
                            case "gw":
                                gw += +mod;
                                update["hiddengwbonus"] = +gw;
                                break;
                            case "allgfert":
                                allgfert += +mod;
                                update["hiddenallgfert"] = +allgfert;
                                break;
                            case "beh":
                                beh += +mod;
                                update["hiddenbehinderungfruehstueck"] = +beh;
                                break;
                            case "sr":
                                sr += +mod;
                                update["hiddenschadensreduktionfruehstueck"] = +sr;
                                break;
                            case "ab":
                                ab += +mod;
                                update["angriffsbonus"] = +ab;
                                break;
                            case "kampffert":
                                kf += +mod;
                                update["kampffertigkeitenbonus"] = +kf;
                                break;
                            case "si":
                                si += +mod;
                                if (si > 1) { si = 1; }
                                update["schadenimmun"] = +si;
                                break;
                            case "allfert":
                                allfert += +mod;
                                update["hiddenallfert"] = +allfert;
                                break;
                            case "allwiderstand":
                                allwiderstand += +mod;
                                update["hiddenallwiderstand"] = +allwiderstand;
                                break;
                            case "war":
                                wundabzugsmod += +mod;
                                update["wundabzugsmod"] = +wundabzugsmod;
                                break;
                            case "ini":
                                ini += +mod;
                                update["hiddenmodini"] = +ini;
                                break;
                            case "gsw":
                                gsw += +mod;
                                update["hiddenmodgsw"] = +gsw;
                                break;
                            default:
                                break;
                        }
                        setAttrs(update);
                    }
                });
            });
            if (keineaktiv == true) {
                setAttrs({
                    hiddenausstrahlungmod: 0,
                    hiddenbeweglichkeitmod: 0,
                    hiddenintuitionmod: 0,
                    hiddenkonstitutionmod: 0,
                    hiddenmystikmod: 0,
                    hiddenstaerkemod: 0,
                    hiddenverstandmod: 0,
                    hiddenwillenskraftmod: 0,
                    hiddenvtdbonus: 0,
                    hiddenkwbonus: 0,
                    hiddengwbonus: 0,
                    hiddenallgfert: 0,
                    hiddenbehinderungfruehstueck: 0,
                    hiddenschadensreduktionfruehstueck: 0,
                    angriffsbonus: 0,
                    kampffertigkeitenbonus: 0,
                    schadenimmun: 0,
                    hiddenallfert: 0,
                    hiddenallwiderstand: 0,
                    wundabzugsmod: 0,
                    hiddenmodini: 0,
                    hiddenmodgsw: 0
                });
            }
        }
    });
});

on("change:rasse", function (f) {
    getAttrs(["rasse"], function (v) {
        switch (v.rasse.toLowerCase()) {
            case "varg":
                setAttrs({
                    groessenklasse: 6
                });
                break;
            case "zwerg":
                setAttrs({
                    groessenklasse: 4
                });
                break;
            case "gnom":
                setAttrs({
                    groessenklasse: 3
                });
                break;
        }
    });
});

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

on("change:repeating_nahkampfwaffen:waffenscharf change:repeating_nahkampfwaffen:waffenexakt change:repeating_nahkampfwaffen:waffenkritisch change:repeating_nahkampfwaffen:waffenschaden1 change:repeating_nahkampfwaffen:waffenschadenwuerfel change:repeating_nahkampfwaffen:waffenschaden3 change:repeating_nahkampfwaffen:waffenname", function (eventInfo) {
    getAttrs(["repeating_nahkampfwaffen_waffenexakt", "repeating_nahkampfwaffen_waffenkritisch", "repeating_nahkampfwaffen_waffenscharf", "repeating_nahkampfwaffen_waffenschaden1", "repeating_nahkampfwaffen_waffenschadenwuerfel", "repeating_nahkampfwaffen_waffenschaden3"], function (v) {
        let exakt = v["repeating_nahkampfwaffen_waffenexakt"];
        let scharf = v["repeating_nahkampfwaffen_waffenscharf"];
        let kritisch = v["repeating_nahkampfwaffen_waffenkritisch"];
        let waffenschaden1 = v["repeating_nahkampfwaffen_waffenschaden1"];
        let waffenschadenwuerfel = v["repeating_nahkampfwaffen_waffenschadenwuerfel"];
        let waffenschaden3 = v["repeating_nahkampfwaffen_waffenschaden3"];
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

on("change:repeating_waffennsc:waffenmerkmalensc", function (eventInfo) {
    getAttrs(["repeating_waffennsc_waffenmerkmalensc"], function (v) {
        let waffenmerkmale = v["repeating_waffennsc_waffenmerkmalensc"].toLowerCase().split(",");
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
            'repeating_waffennsc_waffenexakt': +exakt,
            'repeating_waffennsc_waffenscharf': +scharf,
            'repeating_waffennsc_waffendefensiv': +defensiv,
            'repeating_waffennsc_waffenkritisch': +kritisch
        });
    });
});

on("change:waffenkreatur_merkmale1 change:waffenkreatur_merkmale2", function (eventInfo) {
    getAttrs(["waffenkreatur_merkmale1", "waffenkreatur_merkmale2"], function (v) {
        let waffenmerkmale1 = v.waffenkreatur_merkmale1.toLowerCase().split(",");
        let waffenmerkmale2 = v.waffenkreatur_merkmale2.toLowerCase().split(",");
        let exakt1 = 0;
        let exakt2 = 0;
        let scharf1 = 0;
        let scharf2 = 0;
        let kritisch1 = 0;
        let kritisch2 = 0;
        let temp = "";
        for (var i = 0; i < waffenmerkmale1.length; i++) {
            if (waffenmerkmale1[i].search("exakt") != -1) {
                exakt1 = waffenmerkmale1[i].slice(6).trim();
            }
            if (waffenmerkmale1[i].search("scharf") != -1) {
                scharf1 = waffenmerkmale1[i].slice(7).trim();
            }
            if (waffenmerkmale1[i].search("kritisch") != -1) {
                kritisch1 = waffenmerkmale1[i].slice(9).trim();
            }
        }
        for (var i = 0; i < waffenmerkmale2.length; i++) {
            if (waffenmerkmale2[i].search("exakt") != -1) {
                exakt2 = waffenmerkmale2[i].slice(6).trim();
            }
            if (waffenmerkmale2[i].search("scharf") != -1) {
                scharf2 = waffenmerkmale2[i].slice(7).trim();
            }
            if (waffenmerkmale1[i].search("kritisch") != -1) {
                kritisch2 = waffenmerkmale1[i].slice(9).trim();
            }
        }
        setAttrs({
            waffenexakt_creature1: +exakt1,
            waffenexakt_creature2: +exakt2,
            waffenscharf_creature1: +scharf1,
            waffenscharf_creature2: +scharf2,
            waffenkritisch_creature1: +kritisch1,
            waffenkritisch_creature2: +kritisch2
        });
    });
});

on("change:waffenexakt_creature1 change:waffenkreatur_schaden11 change:waffenscharf_creature1 change:waffenkritisch_creature1 change:waffenkreatur_wuerfel1 change:waffenkreatur_schaden21", function (eventInfo) {
    getAttrs(["waffenexakt_creature1", "waffenkreatur_schaden11", "waffenkritisch_creature1", "waffenscharf_creature1", "waffenkreatur_wuerfel1", "waffenkreatur_schaden21"], function (v) {
        let exakt = v.waffenexakt_creature1;
        let scharf = v.waffenscharf_creature1;
        let kritisch = v.waffenkritisch_creature1;
        let waffenschaden1 = v.waffenkreatur_schaden11;
        let waffenschadenwuerfel = v.waffenkreatur_wuerfel1;
        let waffenschaden3 = v.waffenkreatur_schaden21;
        let damagerollstring = "";
        if (scharf < 0) { scharf = 0; }
        if (exakt < 0) { exakt = 0; }
        if (kritisch < 0) { kritisch = 0; }
        if (kritisch > 0) {
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
            damagerollcreature1: damagerollstring
        });
    });
});

on("change:waffenexakt_creature2 change:waffenkreatur_schaden12 change:waffenkritisch_creature2 change:waffenscharf_creature2 change:waffenkreatur_wuerfel2 change:waffenkreatur_schaden22", function (eventInfo) {
    getAttrs(["waffenexakt_creature2", "waffenkreatur_schaden12", "waffenkritisch_creature2", "waffenscharf_creature2", "waffenkreatur_wuerfel2", "waffenkreatur_schaden22"], function (v) {
        let exakt = v.waffenexakt_creature2;
        let scharf = v.waffenscharf_creature2;
        let kritisch = v.waffenkritisch_creature2;
        let waffenschaden1 = v.waffenkreatur_schaden12;
        let waffenschadenwuerfel = v.waffenkreatur_wuerfel2;
        let waffenschaden3 = v.waffenkreatur_schaden22;
        let damagerollstring = "";
        if (scharf < 0) { scharf = 0; }
        if (exakt < 0) { exakt = 0; }
        if (kritisch < 0) { kritisch = 0; }
        if (kritisch > 0) {
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
            damagerollcreature2: damagerollstring
        });
    });
});

on("change:repeating_waffennsc:waffenscharf change:waffennsc_waffenkritisch change:repeating_waffennsc:waffenexakt change:repeating_waffennsc:waffenschaden1nsc change:repeating_waffennsc:waffenschadenwuerfelnsc change:repeating_waffennsc:waffenschaden3nsc change:repeating_waffennsc:waffennamensc", function (eventInfo) {
    getAttrs(["repeating_waffennsc_waffenexakt", "repeating_waffennsc_waffenkritisch", "repeating_waffennsc_waffenscharf", "repeating_waffennsc_waffenschaden1nsc", "repeating_waffennsc_waffenschadenwuerfelnsc", "repeating_waffennsc_waffenschaden3nsc"], function (v) {
        let exakt = v["repeating_waffennsc_waffenexakt"];
        let scharf = v["repeating_waffennsc_waffenscharf"];
        let kritisch = v["repeating_waffennsc_waffenkritisch"];
        let waffenschaden1 = v["repeating_waffennsc_waffenschaden1nsc"];
        let waffenschadenwuerfel = v["repeating_waffennsc_waffenschadenwuerfelnsc"];
        let waffenschaden3 = v["repeating_waffennsc_waffenschaden3nsc"];
        let damagerollstring = "";
        if (+scharf < 0) { scharf = 0; }
        if (+exakt < 0) { exakt = 0; }
        if (+kritisch < 0) { kritisch = 0; }
        if (+kritisch > 0) {
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
            'repeating_waffennsc_damagerollnsc': damagerollstring
        });
    });
});


on("change:lpnscgesamt change:schmerzimmunnsc change:schmerzresistenznsc", function (f) {
    getAttrs(["lpnscgesamt", "lebenspunktensc", "nschealth", "schmerzimmunnsc", "schmerzresistenznsc"], function (v) {
        if (+v.schmerzimmunnsc == 0) {
            var mod;
            var row = Math.ceil(((+v.lebenspunktensc * +v.nschealth) - +v.lpnscgesamt) / +v.lebenspunktensc);
            var schmerzresistenz = +v.schmerzresistenznsc || 0;
            if (row < 0) { row = 0; }
            if (+v.nschealth == 1) {
                mod = 0;
            } else if (+v.nschealth == 3) {
                switch (row) {
                    case 0:
                    case 1:
                        mod = 0;
                        break;
                    case 2:
                        mod = 2;
                        break;
                    case 3:
                        mod = 8;
                        break;
                    default:
                        mod = 0;
                        break;
                }
            } else if (+v.nschealth == 5) {
                switch (row) {
                    case 0:
                    case 1:
                        mod = 0;
                        break;
                    case 2:
                        mod = 1;
                        break;
                    case 3:
                        mod = 2;
                        break;
                    case 4:
                        mod = 4;
                        break;
                    case 5:
                        mod = 8;
                        break;
                    default:
                        mod = 0;
                        break;
                }
            }
            mod -= schmerzresistenz;
            if (mod < 0) { mod = 0; }
            setAttrs({
                schadensmodnsc: mod
            });
        } else if (+v.schmerzimmunnsc == 1) {
            setAttrs({
                schadensmodnsc: 0
            });
        }
    });
});

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

function writeToSheet(characterData) {
    let hg = 0;
    let character = {};
    let epeingesetzt = 0;
    if (characterData["system"] == "SPLITTERMOND") {
        character["character_name"] = characterData["name"];
        character["gender"] = characterData["gender"][0].toUpperCase() + characterData["gender"].slice(1);
        character["epeingesetzt"] = characterData["investedExp"] || 0;
        character["epgesamt"] = (+characterData["investedExp"] || 0) + +characterData["freeExp"];
        epeingesetzt = characterData["investedExp"] || 0;
        if (+epeingesetzt >= 100 && +epeingesetzt < 300) { hg = 2; }
        else if (+epeingesetzt >= 300 && +epeingesetzt < 600) { hg = 3; }
        if (+epeingesetzt >= 600) { hg = 4; }
        setAttrs({ hg: +hg });
        setAttrs(character);
        character["haarfarbe"] = characterData["hairColor"] || "-";
        character["augenfarbe"] = characterData["eyeColor"] || "-";
        character["geburtsort"] = characterData["birthplace"] || "-";
        character["groesse"] = characterData["size"] || "-";
        character["gewicht"] = characterData["weight"] || "-";
        character["mondzeichen"] = characterData["moonSign"]["name"] || "-";
        character["abstammung"] = characterData["background"] || "-";
        character["ausbildung"] = characterData["education"] || "-";
        character["rasse"] = characterData["race"] || "-";
        character["kultur"] = characterData["culture"] || "-";
        character["hautfarbe"] = characterData["furColor"] || "-";
        let attributestart = ["ausstrahlungstart", "beweglichkeitstart", "intuitionstart", "konstitutionstart", "mystikstart", "staerkestart", "verstandstart", "willenskraftstart"];
        let attributesvalue = ["ausstrahlung", "beweglichkeit", "intuition", "konstitution", "mystik", "staerke", "verstand", "willenskraft"];
        for (var i = 0; i < characterData["attributes"].length; i++) {
            character[attributestart[i]] = characterData["attributes"][i]["startValue"];
            character[attributesvalue[i]] = characterData["attributes"][i]["value"];
        }
        character["groessenklasse"] = characterData["attributes"][9]["value"];
        let ressources = {};
        let newrowid = 0;
        let description = "";
        let longdescription = "";
        let value = 0;
        for (var i = 0; i < characterData["resources"].length; i++) {
            value = characterData["resources"][i]["value"] || 0;
            if (value > 0) {
                newrowid = generateRowID();
                if (characterData["resources"][i]["description"] != null) {
                    description = " (" + characterData["resources"][i]["description"] + ")";
                } else {
                    description = "";
                }
                character["repeating_ressources_" + newrowid + "_ressourcename"] = characterData["resources"][i]["name"] + description;
                character["repeating_ressources_" + newrowid + "_ressourcevalue"] = +value;
            }
        }
        for (var i = 0; i < characterData["powers"].length; i++) {
            let power = characterData["powers"][i]["name"];
            value = characterData["powers"][i]["count"] || 0;
            newrowid = generateRowID();
            character["repeating_staerken_" + newrowid + "_staerkename"] = power;
            character["repeating_staerken_" + newrowid + "_staerkenwert"] = value;
        }
        if (characterData["weaknesses"] != null) {
            for (var i = 0; i < characterData["weaknesses"].length; i++) {
                newrowid = generateRowID();
                character["repeating_schwaechen_" + newrowid + "_schwaeche"] = characterData["weaknesses"][i];
            }
        }
        if (characterData["languages"] != null) {
            for (var i = 0; i < characterData["languages"].length; i++) {
                newrowid = generateRowID();
                character["repeating_sprachen_" + newrowid + "_sprache"] = characterData["languages"][i];
            }
        }
        if (characterData["cultureLores"] != null) {
            for (var i = 0; i < characterData["cultureLores"].length; i++) {
                newrowid = generateRowID();
                character["repeating_kulturkunde_" + newrowid + "_kulturkunde"] = characterData["cultureLores"][i];
            }
        }
        let masteryname;
        let level;
        let masteryshortdescription = "";
        let masterylongdescription = "";
        let skill;
        let skillname;
        let skillvalue;
        let magicvalues = {};
        let skilltranslated = { "melee": "handgemengepunkte", "slashing": "hiebwaffenpunkte", "chains": "kettenwaffenpunkte", "blades": "klingenwaffenpunkte", "longrange": "schusswaffenpunkte", "staffs": "stangenwaffenpunkte", "throwing": "wurfwaffenpunkte", "acrobatics": "akrobatikpunkte", "alchemy": "alchemiepunkte", "leadership": "anfuehrenpunkte", "arcanelore": "arkanekundepunkte", "athletics": "athletikpunkte", "performance": "darbietungspunkte", "diplomacy": "diplomatiepunkte", "clscraft": "edelhandwerkpunkte", "empathy": "empathiepunkte", "determination": "entschlossenheitpunkte", "dexterity": "fingerfertigkeitpunkte", "history": "geschichteundmythenpunkte", "craftmanship": "handwerkpunkte", "heal": "heilkundepunkte", "stealth": "heimlichkeitpunkte", "hunting": "jagdkunstpunkte", "countrylore": "laenderkundepunkte", "nature": "naturkundepunkte", "eloquence": "redegewandtheitpunkte", "locksntraps": "schloesserundfallenpunkte", "swim": "schwimmenpunkte", "seafaring": "seefahrtpunkte", "streetlore": "strassenkundepunkte", "animals": "tierfuehrungpunkte", "survival": "ueberlebenpunkte", "perception": "wahrnehmungpunkte", "endurance": "zaehigkeitpunkte", "antimagic": "bannmagiepunkte", "controlmagic": "beherrschungsmagiepunkte", "motionmagic": "bewegungsmagiepunkte", "insightmagic": "erkenntnismagiepunkte", "stonemagic": "felsmagiepunkte", "firemagic": "feuermagiepunkte", "healmagic": "heilungsmagiepunkte", "illusionmagic": "illusionsmagiepunkte", "combatmagic": "kampfmagiepunkte", "lightmagic": "lichtmagiepunkte", "naturemagic": "naturmagiepunkte", "shadowmagic": "schattenmagiepunkte", "fatemagic": "schicksalsmagiepunkte", "protectionmagic": "schutzmagiepunkte", "enhancemagic": "staerkungsmagiepunkte", "deathmagic": "todesmagiepunkte", "transformationmagic": "verwandlungsmagiepunkte", "watermagic": "wassermagiepunkte", "windmagic": "windmagiepunkte" };
        for (var i = 0; i < characterData["skills"].length; i++) {
            let sprCount = 0;
            skill = characterData["skills"][i]["id"];
            skillname = translateGenesis(skill);
            skillvalue = characterData["skills"][i]["points"];
            magicvalues[skillname] = +skillvalue;
            if (characterData["skills"][i]["masterships"].length > 0) {
                for (var j = 0; j < characterData["skills"][i]["masterships"].length; j++) {
                    newrowid = generateRowID();
                    masteryshortdescription = "";
                    masterylongdescription = "";
                    masteryname = characterData["skills"][i]["masterships"][j]["name"];
                    //if (masteryname.toLowerCase() == "sprinter") { sprCount ++; console.log("Gotcha!"); }
                    level = characterData["skills"][i]["masterships"][j]["level"];
                    if (characterData["skills"][i]["masterships"][j]["shortDescription"] != null) {
                        masteryshortdescription = characterData["skills"][i]["masterships"][j]["shortDescription"];
                    }
                    if (characterData["skills"][i]["masterships"][j]["longDescription"] != null) {
                        masterylongdescription = characterData["skills"][i]["masterships"][j]["longDescription"];
                    } else {
                        masterylongdescription = masteryshortdescription;
                    }
                    character["repeating_meisterschaften_" + newrowid + "_meisterschaftsname"] = masteryname;
                    character["repeating_meisterschaften_" + newrowid + "_meisterschaftsfertigkeit"] = skillname;
                    character["repeating_meisterschaften_" + newrowid + "_meisterschaftsbeschreibung"] = skillname;
                    character["repeating_meisterschaften_" + newrowid + "_meisterschaftsschwelle"] = +level;
                    character["repeating_meisterschaften_" + newrowid + "_meisterschaftswirkung"] = masteryshortdescription;
                    newrowid = generateRowID();
                    character["repeating_masterytooltips_" + newrowid + "_masterytooltipname"] = masteryname;
                    character["repeating_masterytooltips_" + newrowid + "_masterytooltiptext"] = masterylongdescription;
                    character["tooltips"] = 1;
                    //if (+sprCount > 0) { character["sprinterocunt"] = +sprCount; }
                }
            }
            character[skilltranslated[skill]] = +skillvalue;
        }
        if (characterData["spells"].length > 0) {
            let translatedschoolstoschools = { "Arkane Kunde": "arkanekundezauber", "Bannmagie": "bann", "Beherrschungsmagie": "beherrschung", "Bewegungsmagie": "bewegung", "Erkenntnismagie": "erkenntnis", "Felsmagie": "fels", "Feuermagie": "feuer", "Heilungsmagie": "heilung", "Illusionsmagie": "illusion", "Kampfmagie": "kampf", "Lichtmagie": "licht", "Naturmagie": "natur", "Schattenmagie": "schatten", "Schicksalsmagie": "schicksal", "Schutzmagie": "schutz", "Stärkungsmagie": "staerkung", "Todesmagie": "tod", "Verwandlungsmagie": "verwandlung", "Wassermagie": "wasser", "Windmagie": "wind" };
            let spelllongdescription = "";
            for (var i = 0; i < characterData["spells"].length; i++) {
                newrowid = generateRowID();
                character["repeating_zauber_" + newrowid + "_zaubername"] = characterData["spells"][i]["name"];
                character["repeating_zauber_" + newrowid + "_magieschulen"] = translatedschoolstoschools[characterData["spells"][i]["school"]];
                character["repeating_zauber_" + newrowid + "_zauberschwierigkeit"] = characterData["spells"][i]["difficulty"];
                character["repeating_zauber_" + newrowid + "_zauberkosten"] = characterData["spells"][i]["focus"];
                character["repeating_zauber_" + newrowid + "_zauberdauer"] = characterData["spells"][i]["castDuration"];
                character["repeating_zauber_" + newrowid + "_zauberrw"] = characterData["spells"][i]["castRange"];
                character["repeating_zauber_" + newrowid + "_zauberwd"] = characterData["spells"][i]["spellDuration"];
                if (characterData["spells"][i]["longDescription"] != null) {
                    spelllongdescription = characterData["spells"][i]["longDescription"];
                    //character["repeating_zauber_" + newrowid + "_zauberwirkung"] = characterData["spells"][i]["longDescription"];
                }
                newrowid = generateRowID();
                character["repeating_spelltooltips_" + newrowid + "_spelltooltipname"] = characterData["spells"][i]["name"];
                character["repeating_spelltooltips_" + newrowid + "_spelltooltiptext"] = spelllongdescription;
            }
            character["tooltips_spells"] = 1;
        }
        let meleeskills = { "BEW": "bew", "STÄ": "stae", "AUS": "aus", "INT": "int", "KON": "kon", "MYS": "mys", "VER": "ver", "WIL": "wil" };
        if (characterData["meleeWeapons"].length > 0) {
            let merkmale = "";
            let damage;
            let damagewuerfel;
            let damageplus;
            for (var i = 0; i < characterData["meleeWeapons"].length; i++) {
                newrowid = generateRowID();
                merkmale = "";
                character["repeating_nahkampfwaffen_" + newrowid + "_waffenname"] = characterData["meleeWeapons"][i]["name"];
                character["repeating_nahkampfwaffen_" + newrowid + "_waffenskill"] = characterData["meleeWeapons"][i]["skill"].toLowerCase();
                if (characterData["meleeWeapons"][i]["attribute1"] != null) {
                    character["repeating_nahkampfwaffen_" + newrowid + "_waffenattr1"] = meleeskills[characterData["meleeWeapons"][i]["attribute1"]];
                    character["repeating_nahkampfwaffen_" + newrowid + "_waffenattr2"] = meleeskills[characterData["meleeWeapons"][i]["attribute2"]];
                }
                character["repeating_nahkampfwaffen_" + newrowid + "_waffenwgs"] = characterData["meleeWeapons"][i]["weaponSpeed"];
                if (characterData["meleeWeapons"][i]["damage"] != null) {
                    damage = characterData["meleeWeapons"][i]["damage"].toString().split("W")[0] || 0;
                    damagewuerfel = "d" + characterData["meleeWeapons"][i]["damage"].toString().split("W")[1].toString().split("+")[0];
                    damageplus = characterData["meleeWeapons"][i]["damage"].toString().split("W")[1].toString().split("+")[1] || 0;
                    character["repeating_nahkampfwaffen_" + newrowid + "_waffenschaden1"] = damage;
                    character["repeating_nahkampfwaffen_" + newrowid + "_waffenschadenwuerfel"] = damagewuerfel;
                    character["repeating_nahkampfwaffen_" + newrowid + "_waffenschaden3"] = damageplus;
                }
                if (characterData["meleeWeapons"][i]["features"].length > 0) {
                    for (var j = 0; j < characterData["meleeWeapons"][i]["features"].length; j++) {
                        merkmale += characterData["meleeWeapons"][i]["features"][j]["name"];
                        if (j < (characterData["meleeWeapons"][i]["features"].length - 1)) {
                            merkmale += ", ";
                        }
                    }
                }
                character["repeating_nahkampfwaffen_" + newrowid + "_waffenmerkmale"] = merkmale;
            }
        }
        if (characterData["longRangeWeapons"].length > 0) {
            merkmale = "";
            damage = "";
            damagewuerfel = "";
            damageplus = "";
            for (var i = 0; i < characterData["longRangeWeapons"].length; i++) {
                newrowid = generateRowID();
                merkmale = "";
                character["repeating_fernkampfwaffen_" + newrowid + "_waffennamefern"] = characterData["longRangeWeapons"][i]["name"];
                character["repeating_fernkampfwaffen_" + newrowid + "_waffenskillfern"] = characterData["longRangeWeapons"][i]["skill"].toLowerCase();
                if (characterData["longRangeWeapons"][i]["attribute1"] != null) {
                    character["repeating_fernkampfwaffen_" + newrowid + "_waffenattr1fern"] = meleeskills[characterData["longRangeWeapons"][i]["attribute1"]];
                    character["repeating_fernkampfwaffen_" + newrowid + "_waffenattr2fern"] = meleeskills[characterData["longRangeWeapons"][i]["attribute2"]];
                }
                character["repeating_fernkampfwaffen_" + newrowid + "_waffenwgsfern"] = characterData["longRangeWeapons"][i]["weaponSpeed"];
                if (characterData["longRangeWeapons"][i]["damage"] != null && characterData["longRangeWeapons"][i]["damage"] != "") {
                    damage = characterData["longRangeWeapons"][i]["damage"].toString().split("W")[0];
                    damagewuerfel = "d" + characterData["longRangeWeapons"][i]["damage"].toString().split("W")[1].toString().split("+")[0];
                    damageplus = characterData["longRangeWeapons"][i]["damage"].toString().split("W")[1].toString().split("+")[1] || 0;
                    character["repeating_fernkampfwaffen_" + newrowid + "_waffenschaden1fern"] = damage;
                    character["repeating_fernkampfwaffen_" + newrowid + "_waffenschadenwuerfelfern"] = damagewuerfel;
                    character["repeating_fernkampfwaffen_" + newrowid + "_waffenschaden3fern"] = damageplus;
                }
                character["repeating_fernkampfwaffen_" + newrowid + "_waffenrwfern"] = characterData["longRangeWeapons"][i]["range"];
                if (characterData["longRangeWeapons"][i]["features"].length > 0) {
                    for (var j = 0; j < characterData["longRangeWeapons"][i]["features"].length; j++) {
                        merkmale += characterData["longRangeWeapons"][i]["features"][j]["name"];
                        if (j < (characterData["longRangeWeapons"][i]["features"].length - 1)) {
                            merkmale += ", ";
                        }
                    }
                }
                character["repeating_fernkampfwaffen_" + newrowid + "_waffenmerkmalefern"] = merkmale;
            }
        }
        let ruestungsmerkmale;
        if (characterData["armors"].length > 0) {
            for (var i = 0; i < characterData["armors"].length; i++) {
                ruestungsmerkmale = "";
                newrowid = generateRowID();
                character["repeating_ruestungen_" + newrowid + "_ruestungsname"] = characterData["armors"][i]["name"];
                character["repeating_ruestungen_" + newrowid + "_ruestungsvtd"] = characterData["armors"][i]["defense"];
                character["repeating_ruestungen_" + newrowid + "_ruestungssr"] = characterData["armors"][i]["damageReduction"];
                character["repeating_ruestungen_" + newrowid + "_ruestungsbe"] = characterData["armors"][i]["handicap"];
                character["repeating_ruestungen_" + newrowid + "_ruestungstickplus"] = characterData["armors"][i]["tickMalus"];
                if (characterData["armors"][i]["features"].length == 1) {
                    ruestungsmerkmale = characterData["armors"][i]["features"][0]["name"];
                    if (characterData["armors"][i]["features"][0]["level"] > 0) {
                        ruestungsmerkmale += " " + characterData["armors"][i]["features"][0]["level"];
                    }
                } else if (characterData["armors"][i]["features"].length > 1) {
                    for (var j = 0; j < characterData["armors"][i]["features"].length; j++) {
                        ruestungsmerkmale += characterData["armors"][i]["features"][j]["name"];
                        if (characterData["armors"][i]["features"][j]["level"] > 0) {
                            ruestungsmerkmale += " " + characterData["armors"][i]["features"][j]["level"];
                        }
                        if (j < (characterData["armors"][i]["features"].length - 1)) {
                            ruestungsmerkmale += ", ";
                        }
                    }
                }
                character["repeating_ruestungen_" + newrowid + "_ruestungsmerkmal"] = ruestungsmerkmale;
            }
        }
        if (characterData["shields"].length > 0) {
            merkmale = "";
            character["schildname"] = characterData["shields"][0]["name"];
            character["schildvtd"] = characterData["shields"][0]["defensePlus"];
            character["schildbe"] = characterData["shields"][0]["handicap"];
            character["schildtickplus"] = characterData["shields"][0]["tickMalus"];
            character["schildmerkmale"] = characterData["shields"][0]["features"][0]["name"];

            newrowid = generateRowID();
            character["repeating_nahkampfwaffen_" + newrowid + "_waffenname"] = "Schildstoß";
            character["repeating_nahkampfwaffen_" + newrowid + "_waffenskill"] = characterData["shields"][0]["skill"].toLowerCase();
            character["repeating_nahkampfwaffen_" + newrowid + "_waffenattr1"] = "bew";
            character["repeating_nahkampfwaffen_" + newrowid + "_waffenattr2"] = "stae";
            character["repeating_nahkampfwaffen_" + newrowid + "_waffenwgs"] = "7";
            character["repeating_nahkampfwaffen_" + newrowid + "_waffenschaden1"] = "1";
            character["repeating_nahkampfwaffen_" + newrowid + "_waffenschadenwuerfel"] = "d6";
            character["repeating_nahkampfwaffen_" + newrowid + "_waffenschaden3"] = "1";
            character["repeating_nahkampfwaffen_" + newrowid + "_waffenmerkmale"] = characterData["shields"][0]["features"][0]["name"];
        }
        if (characterData["items"].length > 0 && characterData["items"] != null) {
            let count;
            let item;
            for (var i = 0; i < characterData["items"].length; i++) {
                item = characterData["items"][i]["name"];
                count = characterData["items"][i]["count"];
                newrowid = generateRowID();
                character["repeating_ausruestung_" + newrowid + "_anzahl"] = +count;
                character["repeating_ausruestung_" + newrowid + "_name"] = item;
                character["repeating_ausruestung_" + newrowid + "_getragen"] = true;
            }
        }
        if (characterData["notes"] != null) {
            character["notizen"] = characterData["notes"];
        }
        setAttrs(character);
    } else {
        characterData = characterData["splimochar"];
        setAttrs({ character_name: characterData["name"] });
        switch (characterData["gender"]) {
            case ("MALE"):
                setAttrs({ gender: "Männlich" });
                break;
            case ("FEMALE"):
                setAttrs({ gender: "Weiblich" });
                break;
            default:
                setAttrs({ gender: "Undefiniert" });
        }
        setAttrs({ epeingesetzt: characterData["_expinv"] || 0 });
        epeingesetzt = characterData["_expinv"] || 0;
        setAttrs({ epgesamt: (+characterData["_expinv"] || 0) + +characterData["_expfree"] });
        if (+epeingesetzt >= 100 && +epeingesetzt < 300) { hg = 2; }
        else if (+epeingesetzt >= 300 && +epeingesetzt < 600) { hg = 3; }
        if (+epeingesetzt >= 600) { hg = 4; }
        setAttrs({ heldengrad: +hg });
        setAttrs({ haarfarbe: characterData["hairColor"] });
        setAttrs({ augenfarbe: characterData["eyeColor"] });
        setAttrs({ geburtsort: characterData["birthPlace"] });
        setAttrs({ groesse: characterData["size"] });
        setAttrs({ gewicht: characterData["weight"] });
        setAttrs({ mondzeichen: translateGenesis(characterData["_splinter"]) });
        setAttrs({ abstammung: translateGenesis(characterData["_bground"]) });
        setAttrs({ ausbildung: translateGenesis(characterData["_edu"]) });
        setAttrs({ rasse: translateGenesis(characterData["_race"]) });
        setAttrs({ kultur: translateGenesis(characterData["_culture"]) });
        for (var i = 0; i < characterData["attributes"]["attr"].length; i++) {
            switch (characterData["attributes"]["attr"][i]["_id"]) {
                case ("CHARISMA"):
                    setAttrs({ ausstrahlungstart: characterData["attributes"]["attr"][i]["_start"] });
                    setAttrs({ ausstrahlung: characterData["attributes"]["attr"][i]["_value"] });
                    break;
                case ("AGILITY"):
                    setAttrs({ beweglichkeitstart: characterData["attributes"]["attr"][i]["_start"] });
                    setAttrs({ beweglichkeit: characterData["attributes"]["attr"][i]["_value"] });
                    break;
                case ("INTUITION"):
                    setAttrs({ intuitionstart: characterData["attributes"]["attr"][i]["_start"] });
                    setAttrs({ intuition: characterData["attributes"]["attr"][i]["_value"] });
                    break;
                case ("CONSTITUTION"):
                    setAttrs({ konstitutionstart: characterData["attributes"]["attr"][i]["_start"] });
                    setAttrs({ konstitution: characterData["attributes"]["attr"][i]["_value"] });
                    break;
                case ("MYSTIC"):
                    setAttrs({ mystikstart: characterData["attributes"]["attr"][i]["_start"] });
                    setAttrs({ mystik: characterData["attributes"]["attr"][i]["_value"] });
                    break;
                case ("STRENGTH"):
                    setAttrs({ staerkestart: characterData["attributes"]["attr"][i]["_start"] });
                    setAttrs({ staerke: characterData["attributes"]["attr"][i]["_value"] });
                    break;
                case ("MIND"):
                    setAttrs({ verstandstart: characterData["attributes"]["attr"][i]["_start"] });
                    setAttrs({ verstand: characterData["attributes"]["attr"][i]["_value"] });
                    break;
                case ("WILLPOWER"):
                    setAttrs({ willenskraftstart: characterData["attributes"]["attr"][i]["_start"] });
                    setAttrs({ willenskraft: characterData["attributes"]["attr"][i]["_value"] });
                    break;
                default:
                    setAttrs({ xmlimport: "Fehler: Unbekanntes Attribut." });
            }
        }
        let ressources = {};
        let newrowid = 0;
        let description = "";
        let value = 0;
        for (var i = 0; i < characterData["resourcerefs"]["resourceref"].length; i++) {
            value = characterData["resourcerefs"]["resourceref"][i]["_val"] || 0;
            if (value > 0) {
                newrowid = generateRowID();
                if (characterData["resourcerefs"]["resourceref"][i].hasOwnProperty('_description')) {
                    description = " (" + characterData["resourcerefs"]["resourceref"][i]["_description"] + ")";
                } else {
                    description = "";
                }
                ressources["repeating_ressources_" + newrowid + "_ressourcename"] = translateGenesis(characterData["resourcerefs"]["resourceref"][i]["_ref"]) + description;
                ressources["repeating_ressources_" + newrowid + "_ressourcevalue"] = value;
                setAttrs(ressources);
            }
        }
        let staerken = {};
        for (var i = 0; i < characterData["powerrefs"]["powerref"].length; i++) {
            value = characterData["powerrefs"]["powerref"][i]["_count"] || 0;
            newrowid = generateRowID();
            staerken["repeating_staerken_" + newrowid + "_staerkename"] = translateGenesis(characterData["powerrefs"]["powerref"][i]["_ref"]);
            staerken["repeating_staerken_" + newrowid + "_staerkenwert"] = value;
            setAttrs(staerken);
        }
        if (characterData["weaknesses"] != null) {
            let schwaechen = {};
            if (Array.isArray(characterData["weaknesses"]["weakness"])) {
                for (var i = 0; i <= characterData["weaknesses"]["weakness"].length; i++) {
                    let schwaeche = characterData["weaknesses"]["weakness"][i];
                    newrowid = generateRowID();
                    schwaeche = schwaeche.charAt(0).toUpperCase() + schwaeche.slice(1);
                    schwaechen["repeating_schwaechen_" + newrowid + "_schwaeche"] = schwaeche;
                    setAttrs(schwaechen);
                }
            } else {
                newrowid = generateRowID();
                schwaechen["repeating_schwaechen_" + newrowid + "_schwaeche"] = characterData["weaknesses"]["weakness"];
                setAttrs(schwaechen);
            }

        }
        if (characterData["languages"] != null) {
            let languages = {};
            if (Array.isArray(characterData["languages"]["languageref"])) {
                for (var i = 0; i < characterData["languages"]["languageref"].length; i++) {
                    let language = characterData["languages"]["languageref"][i]["_ref"];
                    newrowid = generateRowID();
                    language = language.charAt(0).toUpperCase() + language.slice(1);
                    languages["repeating_sprachen_" + newrowid + "_sprache"] = language;
                    setAttrs(languages);
                }
            } else {
                newrowid = generateRowID();
                let language = characterData["languages"]["languageref"]["_ref"];
                language = language.charAt(0).toUpperCase() + language.slice(1);
                languages["repeating_sprachen_" + newrowid + "_sprache"] = language;
                setAttrs(languages);
            }
        }
        if (characterData["culturelores"] != null) {
            let culturelores = {};
            if (Array.isArray(characterData["culturelores"]["cultloreref"])) {
                for (var i = 0; i < characterData["culturelores"]["cultloreref"].length; i++) {
                    let culturelore = translateGenesis(characterData["culturelores"]["cultloreref"][i]["_ref"]);
                    newrowid = generateRowID();
                    culturelores["repeating_kulturkunde_" + newrowid + "_kulturkunde"] = culturelore;
                    setAttrs(culturelores);
                }
            } else {
                newrowid = generateRowID();
                let culturelore = translateGenesis(characterData["culturelores"]["cultloreref"]["_ref"]);
                culturelores["repeating_kulturkunde_" + newrowid + "_kulturkunde"] = culturelore;
                setAttrs(culturelores);
            }
        }
        var skillvalue = 0;
        var masteryname;
        var masteries = {};
        for (var i = 0; i < characterData["skillvals"]["skillval"].length; i++) {
            var skill = characterData["skillvals"]["skillval"][i]["_skill"]
            var skillname = translateGenesis(skill);
            skillvalue = 0;
            if (characterData["skillvals"]["skillval"][i].hasOwnProperty("_val")) {
                skillvalue = characterData["skillvals"]["skillval"][i]["_val"];
            }
            if (characterData["skillvals"]["skillval"][i].hasOwnProperty("masterref")) {
                if (Array.isArray(characterData["skillvals"]["skillval"][i]["masterref"])) {
                    for (var j = 0; j < characterData["skillvals"]["skillval"][i]["masterref"].length; j++) {
                        masteryname = characterData["skillvals"]["skillval"][i]["masterref"][j]["_ref"];
                        masteryname = masteryname.split("/")[1];
                        masteryname = translateGenesis(masteryname);
                        newrowid = generateRowID();
                        masteries["repeating_meisterschaften_" + newrowid + "_meisterschaftsname"] = masteryname;
                        masteries["repeating_meisterschaften_" + newrowid + "_meisterschaftsfertigkeit"] = skillname;
                        masteries["repeating_meisterschaften_" + newrowid + "_meisterschaftsbeschreibung"] = skillname;
                        masteries["repeating_meisterschaften_" + newrowid + "_meisterschaftsschwelle"] = 1;
                        setAttrs(masteries);
                    }
                } else {
                    masteryname = characterData["skillvals"]["skillval"][i]["masterref"]["_ref"];
                    masteryname = masteryname.split("/")[1];
                    masteryname = translateGenesis(masteryname);
                    newrowid = generateRowID();
                    masteries["repeating_meisterschaften_" + newrowid + "_meisterschaftsname"] = masteryname;
                    masteries["repeating_meisterschaften_" + newrowid + "_meisterschaftsfertigkeit"] = skillname;
                    masteries["repeating_meisterschaften_" + newrowid + "_meisterschaftsbeschreibung"] = skillname;
                    masteries["repeating_meisterschaften_" + newrowid + "_meisterschaftsschwelle"] = 1;
                    setAttrs(masteries);
                }
            }
            switch (skill) {
                case ("melee"):
                    setAttrs({ handgemengepunkte: +skillvalue });
                    break;
                case ("slashing"):
                    setAttrs({ hiebwaffenpunkte: +skillvalue });
                    break;
                case ("chains"):
                    setAttrs({ kettenwaffenpunkte: +skillvalue });
                    break;
                case ("blades"):
                    setAttrs({ klingenwaffenpunkte: +skillvalue });
                    break;
                case ("longrange"):
                    setAttrs({ schusswaffenpunkte: +skillvalue });
                    break;
                case ("staffs"):
                    setAttrs({ stangenwaffenpunkte: +skillvalue });
                    break;
                case ("throwing"):
                    setAttrs({ wurfwaffenpunkte: +skillvalue });
                    break;
                case ("acrobatics"):
                    setAttrs({ akrobatikpunkte: +skillvalue });
                    break;
                case ("alchemy"):
                    setAttrs({ alchemiepunkte: +skillvalue });
                    break;
                case ("leadership"):
                    setAttrs({ anfuehrenpunkte: +skillvalue });
                    break;
                case ("arcanelore"):
                    setAttrs({ arkanekundepunkte: +skillvalue });
                    break;
                case ("athletics"):
                    setAttrs({ athletikpunkte: +skillvalue });
                    break;
                case ("performance"):
                    setAttrs({ darbietungpunkte: +skillvalue });
                    break;
                case ("diplomacy"):
                    setAttrs({ diplomatiepunkte: +skillvalue });
                    break;
                case ("clscraft"):
                    setAttrs({ edelhandwerkpunkte: +skillvalue });
                    break;
                case ("empathy"):
                    setAttrs({ empathiepunkte: +skillvalue });
                    break;
                case ("determination"):
                    setAttrs({ entschlossenheitpunkte: +skillvalue });
                    break;
                case ("dexterity"):
                    setAttrs({ fingerfertigkeitpunkte: +skillvalue });
                    break;
                case ("history"):
                    setAttrs({ geschichteundmythenpunkte: +skillvalue });
                    break;
                case ("craftmanship"):
                    setAttrs({ handwerkpunkte: +skillvalue });
                    break;
                case ("heal"):
                    setAttrs({ heilkundepunkte: +skillvalue });
                    break;
                case ("stealth"):
                    setAttrs({ heimlichkeitpunkte: +skillvalue });
                    break;
                case ("hunting"):
                    setAttrs({ jagdkunstpunkte: +skillvalue });
                    break;
                case ("countrylore"):
                    setAttrs({ laenderkundepunkte: +skillvalue });
                    break;
                case ("nature"):
                    setAttrs({ naturkundepunkte: +skillvalue });
                    break;
                case ("eloquence"):
                    setAttrs({ redegewandtheitpunkte: +skillvalue });
                    break;
                case ("locksntraps"):
                    setAttrs({ schloesserundfallenpunkte: +skillvalue });
                    break;
                case ("swim"):
                    setAttrs({ schwimmenpunkte: +skillvalue });
                    break;
                case ("seafaring"):
                    setAttrs({ seefahrtpunkte: +skillvalue });
                    break;
                case ("streetlore"):
                    setAttrs({ strassenkundepunkte: +skillvalue });
                    break
                case ("animals"):
                    setAttrs({ tierfuehrungpunkte: +skillvalue });
                    break;
                case ("survival"):
                    setAttrs({ ueberlebenpunkte: +skillvalue });
                    break;
                case ("perception"):
                    setAttrs({ wahrnehmungpunkte: +skillvalue });
                    break;
                case ("endurance"):
                    setAttrs({ zaehigkeitpunkte: +skillvalue });
                    break;
                case ("antimagic"):
                    setAttrs({ bannmagiepunkte: +skillvalue });
                    break;
                case ("controlmagic"):
                    setAttrs({ beherrschungsmagiepunkte: +skillvalue });
                    break;
                case ("motionmagic"):
                    setAttrs({ bewegungsmagiepunkte: +skillvalue });
                    break;
                case ("insightmagic"):
                    setAttrs({ erkenntnismagiepunkte: +skillvalue });
                    break;
                case ("stonemagic"):
                    setAttrs({ felsmagiepunkte: +skillvalue });
                    break;
                case ("firemagic"):
                    setAttrs({ feuermagiepunkte: +skillvalue });
                    break;
                case ("healmagic"):
                    setAttrs({ heilungsmagiepunkte: +skillvalue });
                    break;
                case ("illusionmagic"):
                    setAttrs({ illusionsmagiepunkte: +skillvalue });
                    break;
                case ("combatmagic"):
                    setAttrs({ kampfmagiepunkte: +skillvalue });
                    break;
                case ("lightmagic"):
                    setAttrs({ lichtmagiepunkte: +skillvalue });
                    break;
                case ("naturemagic"):
                    setAttrs({ naturmagiepunkte: +skillvalue });
                    break;
                case ("shadowmagic"):
                    setAttrs({ schattenmagiepunkte: +skillvalue });
                    break;
                case ("fatemagic"):
                    setAttrs({ schicksalsmagiepunkte: +skillvalue });
                    break;
                case ("protectionmagic"):
                    setAttrs({ schutzmagiepunkte: +skillvalue });
                    break;
                case ("enhancemagic"):
                    setAttrs({ staerkungsmagiepunkte: +skillvalue });
                    break;
                case ("deathmagic"):
                    setAttrs({ todesmagiepunkte: +skillvalue });
                    break;
                case ("transformationmagic"):
                    setAttrs({ verwandlungsmagiepunkte: +skillvalue });
                    break;
                case ("watermagic"):
                    setAttrs({ wassermagiepunkte: +skillvalue });
                    break;
                case ("windmagic"):
                    setAttrs({ windmagiepunkte: +skillvalue });
                    break;
            }
        }
        var magicschools = { "antimagic": "bann", "controlmagic": "beherrschung", "motionmagic": "bewegung", "insightmagic": "erkenntnis", "stonemagic": "fels", "firemagic": "feuer", "healmagic": "heilung", "illusionmagic": "illusion", "combatmagic": "kampf", "lightmagic": "licht", "naturemagic": "natur", "shadowmagic": "schatten", "fatemagic": "schicksal", "protectionmagic": "schutz", "enhancemagic": "staerkung", "deathmagic": "tod", "transformationmagic": "verwandlung", "watermagic": "wasser", "windmagic": "wind" };
        if (characterData["spellvals"] != null) {
            var spells = {};
            for (var i = 0; i < characterData["spellvals"]["spellval"].length; i++) {
                let school = characterData["spellvals"]["spellval"][i]["_school"];
                let spell = characterData["spellvals"]["spellval"][i]["_spell"];
                newrowid = generateRowID();
                spells["repeating_zauber_" + newrowid + "_zaubername"] = translateGenesis(spell);
                if (school in magicschools) {
                    school = magicschools[school];
                }
                spells["repeating_zauber_" + newrowid + "_magieschulen"] = school;
                setAttrs(spells);
            }
        }
        let items = "";
        for (var i = 0; i < characterData["carries"]["item"].length; i++) {
            let item = characterData["carries"]["item"][i]["_ref"].charAt(0).toUpperCase() + characterData["carries"]["item"][i]["_ref"].slice(1);
            let count = characterData["carries"]["item"][i]["_count"];
            if (+count > 1) {
                item += " (" + count + ")";
            }
            items += item + "\n";
        }
        setAttrs({ stuff: items });
    }
    setAttrs({ jsonimport: "Import erfolgreich abgeschlossen." });
    setAttrs({ startimport: 0 });
}

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

function translateGenesis(termToTranslate) {
    var ressources = { "reputation": "Ansehen", "status": "Stand", "contacts": "Kontakte", "wealth": "Vermögen", "creature": "Kreatur", "mentor": "Mentor", "rank": "Rang", "refuge": "Zuflucht", "entourage": "Gefolge", "relic": "Relikt", "faith": "Glaube" };
    var apprenticeships = { "arcanesage": "Arkaner Gelehrter", "circlefirsthouse": "Zirkelmagier des ersten Hauses", "circlethirdhouse": "Zirkelmagier des dritten Hauses", "morkaipriest": "Morkai-Priester", "beastmaster": "Bestienmeister", "asii": "Asii", "bloodrider": "Blutreiter", "shadowsnake": "Schattenschlange", "animalmagician": "Tierzauberer", "elementalist": "Elementarist", "circleelementalist": "Elementarist des Zirkels", "firecaller": "Feuerrufer", "masterofstone": "Steinmeister", "tempesttamer": "Sturmbändiger", "titanchild": "Titanenkinder", "servantofrockandflame": "Diener von Fels und Flamme", "explorer": "Entdecker", "searcherofforefathers": "Ahnensucher", "truthseeker": "Wahrheitsfinder", "wavewalker": "Wogenwanderer", "faithwarrior": "Glaubenskrieger", "baruopriest": "Baruo-Priester", "whitewatcher": "Weißer Wächter", "ghosttearer": "Geistreißer", "shieldmaid": "Schildmaid", "glow_walker": "Glutgänger", "grimman": "Grimmanswachen", "cervaritam": "Cervaritam", "moonwolf": "Mondwolf", "corsairpriest": "Korsarenpriester", "wingguardian": "Schwingenwächter", "border_crosser": "Grenzgänger", "westergrom_resister": "Westergromer Widerständler", "farn_ranger": "Farnischläufer", "tree_settler": "Baumsiedler", "healer": "Heiler", "lifeguardian": "Lebenswächter", "potionmaster": "Trankmeister", "delarain": "Delarain", "ghosthealer": "Geistheiler", "priesthelphand": "Priester der Helfenden Hand", "circlesecondhouse": "Zirkelmagier des zweiten Hauses", "inquisitor": "Inquisitor", "honorguard": "Ehrwächter", "voice_of_ghosts": "Stimme der Geister", "nighthawk": "Nachtfalke", "fighter": "Kämpfer", "weaponsmaster": "Waffenmeister", "fameseeker": "Ruhmsucher", "fang": "Reißzahn", "clanwarrior": "Klankrieger", "sarnburg_defender": "Sarnburger Wehrstreiter", "martial_artist": "Kampfkünstler", "monk_red_phoenix": "Mönch des Roten Phönix", "mountainmonk": "Bergmönch", "circle_student": "Schüler des Kreises", "cultist": "Kultist", "herold_of_doom": "Untergangsverkünder", "ronite": "Ronite", "disciple_dragonfish": "Jünger des Drachenfisch", "lyxapriest": "Lyxa-Priester", "scout": "Kundschafter", "shadowrunner": "Schattenläufer", "seahawk": "Seefalke", "treetopscout": "Wipfelspäher", "pathfinder": "Wegfinder", "sleeples_rider": "Reiter der Schlaflosen", "flamefinder": "Flammenfinder", "magicmediator": "Magischer Unterhändler", "mediator": "Mediator", "discipleoflyxa": "Jünger von Lyxa", "desertsage": "Wüstenweiser", "goden": "Goden", "esmoda_mediator": "Esmodanische Unterhändler", "inspektor_of_symbols": "Inspektor der Zeichen", "mystic": "Mystiker", "deepseeker": "Tiefensucher", "stonefather": "Steinvater/-Mutter", "firedancer": "Feuertänzer", "mysticwarrior": "Mystischer Krieger", "skeftamagi": "Skeftamagi", "bladedancer": "Klingentänzer", "runewarrior": "Runenkrieger", "firemercenary": "Feuersöldner", "lorepriest": "Priester des Wissens", "drakeguardian": "Drakenwächter", "keeperofsecrets": "Hüter der Geheimnisse", "discipleofrahidis": "Jünger Rahidis", "adeshbid": "Adeshbid", "scriptseeker": "Schriftensucher", "yonnuspriest": "Yonnus-Priester", "flying_snake": "Fliegende Schlange", "singer_of_truth": "Wahrsängerinnen", "intriguer": "Ränkeschmied", "legendsinger": "Legendensänger", "waveenvoy": "Wogenbote", "gutterprince": "Gossenprinz", "silvershadow": "Silberschatten", "wise_pusa": "Weise von Pusa", "warrior": "Recke", "wyrmbannknight": "Ritter des Wyrmbann", "swordjudge": "Schwertrichter", "bladeguardian": "Klingenwächter", "sipahi": "Sipahi", "disciple_jord": "Jünger Jords", "kantioku": "Kantioku", "spiderofficer": "Offizier der Spinne", "shadowblade": "Schattenklinge", "protector": "Protector", "streetblade": "Straßenklinge", "stormcorsar": "Sturmkorsar", "preserver_of_web": "Bewahrer des Gewebes", "caransassassin": "Carans Assassinen", "showman": "Schausteller", "minstrel": "Minnesänger", "bard": "Sangesgeselle", "jester": "Hofnarr", "rogue": "Schurke", "goldhand": "Goldhand", "wallstriker": "Mauerstürmer", "trapmaster": "Fallenmeister", "soulguide": "Seelenführer", "galstarsinger": "Galstarsänger", "augur": "Auguren", "ghostseeker": "Geistsucher", "enlightenedone": "Erleuchteter", "animalleader": "Tierführer", "monkeyhand": "Affenhand", "butterflydancer": "Schmetterlingstänzer", "pigeonking": "Taubenkönig", "transformer": "Verwandler", "animalformer": "Tierverwandler", "warlock": "Hexer", "aurifer": "Aurifer", "circlefifthhouse": "Zirkelmagier des fünften Hauses", "ranger": "Waldläufer", "desertranger": "Sandläufer", "tunnelguardian": "Tunnelwächter", "beastcaller": "Bestienrufer", "meng_shou": "Meng Shou", "qin_shou": "Qin Shou", "wandererpriest": "Wanderpriester", "stormcaller": "Sturmrufer", "lunarseeker": "Lunare Sucher", "hammerpriest": "Hammerpriester", "druid": "Druide", "moonshaman": "Mondschamane", "vordanshield": "Vordans Schilde", "servantofape": "Diener des Affen", "zaruszpriestshaman": "Zarusz-Priesterschamane", "drugonjourneyma": "Drugongeselle", "wondermaker": "Wunderwerker", "firnbezwinger": "Firnbezwinger", "athanorier": "Athanorier", "daugther_maker": "Tochter des Schaffens" };
    var cultures = { "gulong": "Gulong", "dakardsmyr": "Dakardsmyr", "aitushar": "Aitushar", "mertstaedt": "Mertalischer Städtebund", "dalmreich": "Dalmarisches Reich", "elyrrose": "Elyrea - Rosenorden", "elyrvolk": "Elyrea - Volk", "furgand": "Furgand", "immersomm": "Immersommeralben", "jagodien": "Jagodien", "jagodsklav": "Jogodai - Sklaven", "jagodstamm": "Jogodai - Stammesangehöriger", "midstad": "Midstad", "nyrdfing": "Nyrdfing", "patalis": "Patalis", "selenia": "Selenia", "teleshai": "Teleshai", "termark": "Termark", "tirdurghachan": "Tir Durghachan", "unreich": "Unreich", "vaigarr": "Vaigarr", "waechter": "Wächterbund", "westergrom": "Westergrom", "wintholt": "Wintholt", "zwingard": "Zwingard", "arkuri": "Arkuri", "frynjord": "Frynjord", "raugarr": "Raugarr", "sadu": "Sadu", "schwertadel": "Schwertalben - Adel", "schwertvolk": "Schwertalben - Volk", "zhoujiang": "Zhoujiang", "daemmeralb": "Dämmeralben", "gotmarkut": "Gotor, Marakatam und Kutakina", "mahaluu": "Mahaluu", "piriwatu": "Piriwatu", "schaschbar": "Schaschbar", "utarti": "Utarti", "ashurmazaan": "Ashurmazaan", "badashan": "Badashan", "chorrash": "Chorrash", "demerai": "Demerai", "farukhur": "Farukhur", "fedirin": "Fedirin", "feuerlauf": "Feuerläufer", "keshabid": "Keshabid", "pashtar": "Pashtar", "shahandir": "Shahandir", "tarr": "Tarr", "turubar": "Turubar", "keshubim": "Keshubim", "kungaitan": "Kungaitan", "porukala": "Porukala", "puntani": "Puntani", "strominseln": "Stromlandinseln - Inseln", "stromsiprangu": "Stromlandinseln - Siprangu", "afali": "Afali", "albseebund": "Albischer Seebund", "anuu": "Anuu", "borombri": "Borombri", "ioria": "Ioria", "schaedel": "Schädelkorsaren" };
    var origins = { "custom": "Frei erschaffen", "eremits": "Einsiedler", "academics": "Gelehrte", "ragtag": "Gesindel", "largefarm": "Großbauern", "nobility": "Hochadel", "craftsmen": "Handwerker", "courtier": "Höflinge", "farmer": "Kleinbauern", "warrior": "Kriegsvolk", "artists": "Künstler", "gentry": "Landadel", "magister": "Magistrale", "priests": "Priester", "traveler": "Reisende", "sailor": "Seefahrer", "wizard": "Zauberer" };
    var backgrounds = { "custom": "Frei erschaffen", "eremits": "Einsiedler", "academics": "Gelehrte", "ragtag": "Gesindel", "largefarm": "Großbauern", "nobility": "Hochadel", "craftsmen": "Handwerker", "courtier": "Höflinge", "farmer": "Kleinbauern", "warrior": "Kriegsvolk", "artists": "Künstler", "gentry": "Landadel", "magister": "Magistrale", "priests": "Priester", "traveler": "Reisende", "sailor": "Seefahrer", "wizard": "Zauberer" };
    var skills = { "acrobatics": "akrobatik", "alchemy": "alchemie", "animals": "tierfuehrung", "antimagic ": "bannmagie", "arcanelore": "arkanekunde", "athletics": "athletik", "blades": "klingenwaffen", "chains": "kettenwaffen", "clscraft": "edelhandwerk", "combatmagic": "kampfmagie", "controlmagic": "beherrschungsmagie", "countrylore": "laenderkunde", "craftmanship": "handwerk", "deathmagic": "todesmagie", "determination": "entschlossenheit", "dexterity": "fingerfertigkeit", "diplomacy": "diplomatie", "eloquence": "redegewandheit", "empathy": "empathie", "endurance": "zaehigkeit", "enhancemagic": "staerkungsmagie", "fatemagic": "schicksalsmagie", "firemagic": "feuermagie", "heal": "heilkunde", "healmagic": "heilungsmagie", "history": "geschichteundmythen", "hunting": "jagdkunst", "illusionmagic": "illusionsmagie", "insightmagic": "erkenntnismagie", "leadership": "anfuehren", "lightmagic": "lichtmagie", "locksntraps": "schloesserundfallen", "longrange": "schusswaffen", "melee": "handgemenge", "motionmagic": "bewegungsmagie", "nature": "naturkunde", "naturemagic": "naturmagie", "perception": "wahrnehmung", "performance": "darbietung", "protectionmagic": "schutzmagie", "seafaring": "seefahrt", "shadowmagic": "schattenmagie", "slashing": "hiebwaffen", "staffs": "stangenwaffen", "stealth": "heimlichkeit", "stonemagic": "felsmagie", "streetlore": "strassenkunde", "survival": "ueberleben", "swim": "schwimmen", "throwing": "wurfwaffen", "transformationmagic": "verwandlungsmagie", "watermagic": "wassermagie", "windmagic": "windmagie" };
    var races = { "alben": "Alb", "gnome": "Gnom", "human": "Mensch", "varg": "Varg", "dwarf": "Zwerg" };
    var splinters = { "FLASH": "Der Blitz", "OMEN": "Omen des Schwarzen Mondes", "SIGHT": "Das Zweite Gesicht", "TRABANT": "Freundschaft des Trabanten", "GAMBLER": "Der Spieler", "RICHMAN": "Gunst des Reichen Mannes", "MOONPOWER": "Segen der Mondkraft", "BLOODMOON": "Blutiges Antlitz des Mondes", "GHOSTTHOUGHT": "Geist der Gedanken", "ROCK": "Der Fels" };
    var abilities = { "addsplinter": "Zusätzliche Splitterpunkte", "urbane": "Weltgewandt", "focuspool": "Erhöhter Fokuspool", "succour_in_need": "Beistand in der Not", "lowlight": "Dämmersicht", "onestepahead": "Einen Schritt voraus", "attractive": "Attraktivität", "goodhearing": "Scharfes Gehör", "senseorient": "Orientierungssinn", "resistpoison": "Giftresistenz", "literate": "Literat", "focusregen": "Erhöhte Fokusregeneration", "friendfire": "Erwählter der Feuerwesen", "priest": "Priester", "sensefairy": "Feensinn", "resistmind": "Hoher Geistiger Widerstand", "swift": "Flink", "goodmemory": "Gutes Gedächtnis", "goodsight": "Scharfe Sicht", "asketic": "Asket", "enduring": "Ausdauernd", "tinker": "Bastler", "naturalarmor": "Natürlicher Rüstungsschutz", "naturalweapon": "Natürliche Waffe", "sensesocial": "Soziales Gespür", "sensedistance": "Entfernungssinn", "friendearth": "Erwählter der Felswesen", "sturdy": "Robust", "resistheat": "Hitzeresistenz", "friendghost": "Erwählter der Geisterwesen", "friendgodservant": "Erwählter der Götterdiener", "friendlight": "Erwählter der Lichtwesen", "friendair": "Erwählter der Luftwesen", "friendnature": "Erwählter der Naturwesen", "friendshadow": "Erwählter der Schattenwesen", "friendwater": "Erwählter der Wasserwesen", "friendundead": "Erwählter untoter Wesen", "sensesmell": "Feine Nase", "concentrated": "Konzentrationsstärke", "floatingform": "Fließende Form", "socialable": "Gesellig", "sensebalance": "Gleichgewichtssinn", "holy_mark": "Heiliges Mal", "resistbody": "Hoher Körperlicher Widerstand", "childlie": "Kind der Lüge", "tough": "Zäh", "resistcold": "Kälteresistenz", "childnature": "Kind der Natur", "liferegen": "Erhöhte Lebensregeneration", "packmule": "Lastesel", "shield_faith": "Schild des Glaubens", "resistpain": "Schmerzresistenz", "sensesocial": "Soziales Gespür", "animallover": "Tierfreund", "highini": "Verbesserte Initiative", "animalfamiliar": "Tiervertrauter", "determined": "Zielstrebig", "priest": "Priester", "childlife": "Kind des Lebens", "childlore": "Kind der Weisheit", "childdeath": "Kind des Todes", "childprophecy": "Kind der Vorsehung", "childorder": "Kind der Ordnung", "aura_chosen": "Aura des Auserwählten" };
    var spells1 = { "accelerate": "Beschleunigen", "acidsquirt": "Säurestrahl", "alarm": "Alarm", "allunderstanding": "Allverständnis", "animalfriend": "Freund der Tiere", "animalmessenger": "Tierischer Bote", "animalsenses": "Tiersinne", "animalshape": "Tierform", "animateshadow": "Schatten beleben", "antidote": "Giftbann", "antimagicarea": "Zone der Bannung", "auracounter": "Aura der Kontermagie", "auradetermin": "Aura der Entschlossenheit", "auraleader": "Aura des Anführers", "auralifeforce": "Aura der Lebenskraft", "aurapainless": "Aura der Schmerzlosigkeit", "aurashadow": "Aura der Schatten", "aurawarmth": "Aura der Wärme", "badluck": "Pech", "balloflight": "Lichtkugel", "banishcoincidence": "Zufall bannen", "barkskin": "Rindenhaut", "beastform": "Bestienform", "birdshape": "Vogelform", "blackice": "Eisglätte", "blackness": "Schwärze", "blazingbarrier": "Gleißende Barriere", "blazingshield": "Gleißender Schild", "blessing": "Segnung", "bodyoflight": "Leib aus Licht", "bodyofshadow": "Schattenleib", "breakcurse": "Fluch brechen", "breakprotection": "Schutz aufheben", "breakspell": "Zauber bannen", "breathwater": "Wasseratmung", "bridgeoflight": "Lichtbrücke", "burden": "Last", "calllightning": "Blitze rufen", "calmanimal": "Tiere beruhigen", "cancelcontrol": "Beherrschung aufheben", "cateyes": "Katzenaugen", "catreflexes": "Katzenreflexe", "chainlightning": "Kettenblitz", "chamaeleon": "Chamäleon", "changeface": "Gesicht ändern", "claws": "Krallen", "cleansewater": "Wasser reinigen", "cloudpath": "Wolkenpfad", "coldprotection": "Schutz vor Kälte", "coldshield": "Kälteschild", "cometome": "Komm zu mir", "connectedlife": "Lebensband", "consecration": "Weihe", "consumemagic": "Magie verzehren", "controlanimal": "Tiere beherrschen", "controlfairy": "Feenwesen beherrschen", "controlfire": "Flammenherrschaft", "controlshadow": "Schattenspiel", "controlwater": "Wasserherrschaft", "controlweather": "Wetterkontrolle", "copyvoice": "Stimme kopieren", "counterspell": "Gegenzauber", "curseofpain": "Fluch der Schmerzen", "damagecircle": "Schadenszirkel", "damagewave": "Schadenswelle", "damnation": "Verdammung", "dancinglights": "Lichtertanz", "darkness": "Dunkelheit", "daylight": "Nacht zum Tag", "deathcurse": "Todesfluch", "deathprotection": "Todesschutz", "decreaseattitude": "Einstellung verschlechtern", "detectmagic": "Magie erkennen", "detectpoison": "Gift erkennen", "diplomatstongue": "Zunge des Diplomaten", "distract": "Verwirren", "disturbinsight": "Erkenntnis stören", "dontgoyet": "Geh noch nicht", "doom": "Verhängnis", "earthquake": "Erdbeben", "earthtomud": "Erde zu Schlamm", "easytarget": "Leichtes Ziel", "electricityprotection": "Schutz vor Elektrizität", "elementalprotection": "Schutz vor Elementen", "enchantprojectile": "Geschoss verzaubern", "encrypt": "Text verschlüsseln", "endofway": "Ende des Weges", "endtransformation": "Verwandlung beenden", "enhanceconst": "Ausdauer stärken", "enhancedefenses": "Widerstände erhöhen", "enhancehealing": "Heilung stärken", "enhancehearing": "Gehör verbessern", "enhanceitem": "Gegenstand verbessern", "enhancesenses": "Sinne verstärken", "enhancesight": "Sicht verbessern", "enhancevitality": "Lebenskraft stärken", "enterghostworld": "Geistreise", "exhaustmagic": "Magie erschöpfen", "exorcisefairy": "Feenwesen bannen", "faint": "Schwächeanfall", "falseface": "Falsches Gesicht", "falsifyinsight": "Erkenntnis fälschen", "farsight": "Fernsicht", "fear": "Furcht", "featherfall": "Sanfter Fall", "findwater": "Wasser finden", "fireball": "Feuerball", "firecone": "Flammenkegel", "firelance": "Feuerstrahl", "fireprotection": "Schutz vor Feuer", "fireshield": "Flammenschild", "fistofstone": "Steinfaust", "flame": "Flamme", "flamingweapon": "Flammende Waffe", "flash": "Lichtblitz", "fly": "Fliegen", "flyingweapon": "Beflügelte Waffe", "fogshape": "Nebelgestalt", "fortune": "Glück", "freeze": "Einfrieren", "geas": "Schicksalsband", "ghostdagger": "Geisterdolch", "ghostsight": "Geisterblick", "glare": "Blenden", "growth": "Wachstum", "gushofwater": "Wasserschwall", "gustofwind": "Windstoß", "haircolor": "Haarfarbe", "hallucination": "Halluzination", "handoffire": "Flammenhand", "harden": "Härte", "harmitem": "Gegenstand beschädigen", "healing": "Heilung", "heat": "Wärme", "heatmetal": "Metall erhitzen", "heatsurrounding": "Umgebung erhitzen", "heavylimbs": "Schwere Arme", "hush": "Verstummen", "icelance": "Eislanze", "iceprison": "Eisiges Gefängnis", "ignorepain": "Schmerzen ignorieren", "incinerate": "Einäschern", "inconspicuousness": "Unauffälligkeit", "increaseattitude": "Einstellung verbessern", "increasemorale": "Moral erhöhen", "indestructible": "Unzerstörbar", "inflame": "Entzünden", "innerglow": "Inneres Leuchten", "interferespell": "Zauberer behindern", "invisibility": "Unsichtbarkeit", "ironaura": "Eiserne Aura", "leap": "Sprung", "leaplegs": "Sprungbeine", "leavenotrace": "Spurlos in der Wildnis", "levitate": "Levitieren", "lifedrain": "Lebensraub", "liftburden": "Lasten heben", "light": "Licht", "lightban": "Lichtbann", "lightningbolt": "Blitzschlag", "lightweapon": "Waffe des Lichtes", "lightweight": "Leichtigkeit", "lookinsun": "Blick in die Sonne", "magicblow": "Magischer Schlag", "magicchain": "Magische Fessel", "magiccompass": "Magischer Kompass", "magicdialogue": "Magisches Zwiegespräch", "magicfeint": "Magische Finte", "magickeyhole": "Magisches Schlüsselloch", "magiclock": "Magisches Schloss", "magicmessage": "Magische Botschaft", "magicquill": "Zauberfeder", "magnetism": "Magnetismus", "majorbanspell": "Totaler Zauberbann", "majorblessing": "Hohe Segnung", "majormagicarmor": "Magischer Panzer", "majorprotectmagic": "Großer Magieschutz", "manipulatememory": "Gedächtnis verändern", "masquerade": "Maskerade", "memorygap": "Erinnerungslücke", "meteor": "Kometenwurf", "mightexplosion": "Machtexplosion", "mindlessservant": "Willenloser Diener", "minorhealing": "Leichte Heilung", "minormagicarmor": "Magische Rüstung", "minorprotectmagic": "Kleiner Magieschutz", "moldstone": "Fels formen", "moveitem": "Gegenstand bewegen", "nightvision": "Nachtsicht", "objectillusion": "Objektillusion", "onewithfire": "Eins mit dem Feuer", "panopticum": "Panoptikum", "paralysis": "Lähmung", "peacefulness": "Schutz vor Angriffen", "penetratefog": "Nebelsicht", "petrify": "Versteinern", "phantasmagoria": "Trugbild", "picklock": "Schloss öffnen", "poisonprotection": "Schutz vor Gift", "prophecy": "Prophezeiung", "protectedbylight": "Lichter Schutz", "protectinghand": "Schützende Hand", "protectmind": "Gedankenschutz", "puppet": "Marionette", "quickwash": "Katzenwäsche", "raiseundead": "Untote erheben", "readmind": "Gedankenlesen", "reflectspell": "Zauber zurückwerfen", "refresh": "Erfrischung", "regeneration": "Regeneration", "rejuvenate": "Verjüngen", "repair": "Reparatur", "resistpain": "Schmerzen widerstehen", "restoration": "Wiederherstellung", "screech": "Kreischen", "scriptunderstanding": "Schriftverständnis", "seismicshock": "Erdstoß", "selfheal": "Selbstheilung", "senseattitude": "Einstellung spüren", "senseghost": "Hauch der Geister", "senseofowl": "Eulengespür", "shadowarmor": "Schattenrüstzeug", "shadowarrow": "Schattenpfeil", "shadowban": "Schattenbann", "shadowcloak": "Schattenmantel", "shadowleap": "Schattensprung", "shadowveil": "Schattenschleier", "shadowweapon": "Schattenwaffe", "shapeshift": "Fremde Gestalt", "shockgrasp": "Schockgriff", "shove": "Stoß", "silence": "Stille", "sixthsense": "Sechster Sinn", "sleep": "Schlaf", "smallanimalshape": "Kleintierform", "smalldeath": "Totenschlaf", "smell": "Geruch", "speakwithanimal": "Tiersprache", "speakwithghost": "Geistersprache", "spidercrawl": "Spinnenlauf", "steady": "Standfest", "steelskin": "Stahlhaut", "stone": "Stein", "stoneclaws": "Felshände", "stonedestruction": "Felszerstörung", "stonemissile": "Felsgeschoss", "stoneskin": "Steinhaut", "strengthbear": "Bärenstärke", "summonfog": "Nebel rufen" };
    var spells2 = { "suggestion": "Suggestion", "summonghost": "Geister rufen I", "summonstone": "Felswesen rufen 1", "suppressspell": "Zauber unterdrücken", "swarm": "Insektenschwarm", "tendrilarrow": "Rankenpfeil", "tendrils": "Ranken", "terrorform": "Schreckgestalt", "truesight": "Wahrer Blick", "turnundead": "Untote bannen", "twister": "Stürmischer Wind", "undeadprotection": "Schutz vor Untoten", "understandlanguage": "Sprachverständnis", "unseenobject": "Unsichtbares Objekt", "veil": "Verhüllung", "veillife": "Leben verhüllen", "ventriloquate": "Geräuschhexerei", "viewhistory": "Spuren der Vergangenheit", "walkonwater": "Über Wasser gehen", "walkwalls": "Durch Wände gehen", "walkwilderness": "Weg durch die Natur", "walloffire": "Flammenwand", "wallofshadow": "Schattenwand", "wallofstone": "Steinwand", "weakenarmor": "Rüstung schwächen", "weakenundead": "Untote schwächen", "weaponoflight": "Waffe aus Licht", "windshield": "Windschild", "wither": "Verdorren" };
    var spells3 = { "fit": "Anpassung", "breathcontrol": "Atemkontrolle", "stun": "Betäubungsschlag", "counter_blind": "Blendung unterdrücken", "wakeup": "Erwecken", "stone_writing": "Felsschrift", "finger_protection": "Fingerschutz", "focustrap": "Fokusfalle", "focussed_motion": "Fokussierte Bewegung", "slippery": "Glitschig", "call_for_help": "Hilferuf", "bone_collector": "Knochensammler", "suppress_melancholia": "Schwermut unterdrücken", "call_animal": "Tierruf", "mourning_garments": "Trauerkleid", "attention": "Vorsicht", "magic_makeup": "Zauberschminke", "absolute_silence": "Absolute Stille", "ancestor_advice": "Ahnenrat", "frighting_object": "Ängstigendes Objekt", "nondescript_face": "Allerweltsgesicht", "aging": "Altern", "sense_age": "Altersgespür", "attack_premonition": "Angriff vorhersehen", "animate1": "Animierung I", "animate2": "Animierung II", "animate3": "Animierung III", "animate4": "Animierung IV", "animate5": "Animierung V", "antimagic_shell": "Antimagischer Wall", "wall_running": "An Wänden laufen", "disenchant_artifact": "Artefakt entzaubern", "counter_artifact": "Artefakt stören", "wave_of_counter_artifact": "Artefaktstörwelle", "ashes_to_ashes": "Asche zu Asche", "refreshment": "Auffrischung", "bed_of_shadows": "Auf Schatten gebettet", "go_all_out": "Aufs Ganze gehen", "uplift": "Auftrieb", "aura_counter_motion": "Aura der Bewegungsstörung", "aura_coldness": "Aura der Kälte", "aura_catseyes": "Aura der Katzenaugen", "aura_slowness": "Aura der Langsamkeit", "aura_enhance_light": "Aura der Leuchtverstärkung", "aura_nightrest": "Aura der Nachtruhe", "aura_reflexes": "Aura der Reflexe", "aura_cleansing": "Aura der Reinigung", "aura_repair": "Aura der Reparatur", "aura_damagereflection": "Aura der Schadensreflexion", "aura_steadfastness": "Aura der Standhaftigkeit", "aura_confidence": "Aura der Zuversicht", "aura_clearmind": "Aura des klaren Geistes", "aura_connectedLife": "Aura des Lebensbandes", "aura_shadowsight": "Aura des Schattenblicks", "blackout": "Aussetzer", "banish_animals": "Bannkreis gegen Tiere", "command": "Befehlswort", "light_shield": "Beflügelter Schild", "calm": "Beruhigung", "disturb_summoner": "Beschwörer stören", "change_owner": "Besitzerwechsel", "stop_motion": "Bewegung stoppen", "blinding_flames": "Blendende Flammen", "lightning_shield": "Blitzschild", "stop_bleeding": "Blutung stoppen", "bad_omen": "Böses Omen", "fire_accelerant": "Brandbeschleuniger", "fire_dilution": "Brandmilderung", "ailing": "Dahinsiechen", "demons_eyes": "Dämonenaugen", "the_last_call": "Der letzte Ruf", "thunderstruck": "Donnerschlag", "thorntendrils": "Dornenranken", "blastwave": "Druckwelle", "dark_protection": "Dunkle Schutzaura", "echochamber": "Echokammer", "ice_armamentarium": "Eisiges Rüstzeug", "walk_on_ice": "Eislauf", "banish_element": "Elementarbann", "sense_emotion": "Emotionen spüren", "grandness": "Erhabenheit", "rest": "Erholung", "sense_tremors": "Erschütterungssinn", "explosive_arrow": "Explosiver Pfeil", "false_identity": "Falsche Identität", "foul_wind": "Fauliger Wind", "fist_of_destruction": "Faust der Zerstörung", "fist_of_light": "Faust des Lichts", "weaken_fairy": "Feenwesen schwächen", "stonebonds": "Felsfesseln", "stonespike": "Felsstachel", "telemessage": "Fernbotschaft", "firebonds": "Feuerfesseln", "fireproof": "Feuerfest", "firerain": "Feuerregen", "shake_off_darkness": "Finsternis abschütteln", "curse_of_exhaustion": "Fluch der Erschöpfung", "curse_of_weakness": "Fluch der Schwäche", "curse_of_age": "Fluch des Alters", "curse_of_doubt": "Fluch des Zweifels", "whispering_shadow": "Flüsternder Schatten", "disturb_flight": "Flug stören", "transform_other": "Fremdverwandlung", "rain_of_sparks": "Funkenregen", "mental_image": "Gedankenbild", "scary_flames": "Gefährliche Flammen", "heat_object": "Gegenstand erhitzen", "fasten_object": "Gegenstand fixieren", "headwind": "Gegenwind", "hardened_skin": "Gehärtete Haut", "secret_message": "Geheimbotschaft", "secret_language": "Geheimsprache", "ghost_curse": "Geisterfluch", "ghostfriend": "Geisterfreund", "ghostprison": "Geisterkerger", "spiritpath": "Geisterpfad", "ghostarrows": "Geisterpfeile", "ghost_shield": "Geisterschild", "ghost_weapon": "Geisterwaffe", "mind_over_physical": "Geist über Körper", "support_healing": "Genesung unterstützen", "neutralize_smell": "Geruch neutralisieren", "sharpended_blade": "Geschärfte Klinge", "change_gender": "Geschlechtswechsel", "got_it": "Geschnappt", "stonewaves": "Gesteinswelle", "immunity_poison": "Giftimmunität", "spit_poison": "Gift speien", "dilute_poison": "Gift verdünnen", "poisoncloud": "Giftwolke", "gliding": "Gleiten", "gravebeast": "Grabesbestie", "groupmessage": "Gruppenbotschaft", "grouptalk": "Gruppengespräch", "good_face": "Gute Miene", "craft_sense": "Handwerksinn", "craft_profiency": "Handwerkswissen", "hard_fall": "Harter Fall", "mold_hard": "Hartes formen", "provoke_hate": "Hass hervorrufen", "healing_rain": "Heilsamer Regen", "healers_scan": "Heilungsblick", "disturb_healing": "Heilung stören", "hot_as_lava": "Heiß wie Lava", "heros_weapon": "Heldenwaffe", "control_heat": "Hitze kontrollieren", "major_fairy_ban": "Höherer Feebann", "harden_wood": "Holz verstärken", "humanoidform": "Humanoidenform", "illumination": "Illumination", "reveal_illusion": "Illusion enttarnen", "combatsense": "Kampfgespür", "combatinspiration": "Kampfinspiration", "change_clothing": "Kleidung verändern", "minor_ghostprison": "Kleiner Geisterkerker", "blades_of_light": "Klingen aus Licht", "knotloosener": "Knotenlöser", "kometenschlag": "Kometenschlag", "disturb_concentration": "Konzentration stören", "detect_life": "Leben spüren", "lifeseed": "Lebenssamen", "light_armor": "Leichte Rüstung", "last_rear_up": "Letztes Aufbäumen", "light_protective_aura": "Lichte Schutzaura", "lightcontrol": "Lichtkontrolle", "enhance_light": "Lichtquelle stärken", "consume_light": "Lichtquelle verzehren", "magic_choke": "Magischer Würgegriff", "copy_material": "Material kopieren", "mental_blow": "Mentaler Schlag", "cause_minor_illness": "Minderes Siechtum verursachen", "merge_with_shadows": "Mit Schatten verschmelzen", "moonsteelskin": "Mondstahlhaut", "disperse_fog": "Nebel auflösem", "negative_surrounding": "Negative Umgebung", "like_an_eel": "Nicht zu packen", "objectexplosion": "Objektexplosion", "protect_object": "Objekt schützen", "transform_object": "Objekt verändern", "veil_object": "Objektverhüllung", "arrow_fire": "Pfeil aus Feuer", "arrow_wind": "Pfeil der Winde", "wand_of_tendrils": "Rankenwand", "speedy_movement": "Rasende Bewegung", "speedy_undead": "Rasende Untote", "rage": "Raserei", "reactive_protection": "Reaktiver Schutz", "cleansing": "Reinigung", "giantism": "Riesenwuchs", "enhance_armor": "Rüstung stärken", "armor_penetration": "Rüstungsdurchdringung", "eroding_acid": "Säurefraß", "acid_rain": "Säureregen", "acid_shield": "Säureschild", "fierce_wind": "Scharfer Wind", "shadow_grasp": "Schattengriff", "shadow_armor": "Schattenrüstung", "summon_lock": "Schloss herbeirufen", "fast_as_lightning": "Schnell wie der Blitz", "dreadful_shadow": "Schrecklicher Schatten", "protective_mirror_image": "Schützendes Spiegelbild", "protective_flesh_bones": "Schutz aus Fleisch und Knochen", "protective_water": "Schutz des Wassers", "sickness_protection": "Schutz vor Krankheiten", "protectarea_insight": "Schutzzone gegen Erkenntnis", "find_weakness": "Schwachstelle finden" };
    var spells4 = { "heavy_armor": "Schwere Rüstung", "heavy_weapon": "Schwere Waffe", "webbings": "Schwimmhäute", "own_choices_fate": "Selbstgewähltes Schicksal", "selfillusion": "Selbstillusion", "selfdoubt": "Selbstzweifel", "cause_infirmity": "Siechtum verursachen", "splintershield": "Splitterschild", "spring": "Sprungfeder", "lay_trail": "Spur legen", "hail_of_stones": "Steinhagel", "disturbing_noise": "Störgeräusch", "weaken_structure": "Struktur schwächen", "blunt_weapon": "Stumpfe Waffe", "stormshield": "Sturmschild", "lift_camouflage": "Tarnung aufheben", "temporary_shield": "Temporärer Schild", "deep_sleep_field": "Tiefschlaffeld", "immitate_animal": "Tier nachahmen", "animal_tongue": "Tierzunge", "sense_death": "Todesgespür", "twister": "Tornado", "undead_animal": "Totentier", "dreammessage": "Traumbotschaft", "read_dreams": "Traumlesen", "find_passage": "Übergang finden", "close_passage": "Übergang schließen", "sense_surrounding": "Umgebungssinn", "knock_off_arrow": "Umstoßender Pfeil", "inevitable_arrow": "Unabwendbarer Pfeil", "disaster": "Unheil", "blurred": "Unschärfe", "invisible_for_fairies": "Unsichtbarkeit vor Feen", "invisible_for_animals": "Unsichtbarkeit vor Tieren", "sense_undead": "Untote erspüren", "turn_undead": "Untote vertreiben", "smash_undead": "Untote zerschmettern", "immobile": "Unverrückbar", "vacuum": "Vakuum", "darkening": "Verdunkelung", "stop_decay": "Verfall stoppen", "stiffen": "Verfestigung", "hiding_place": "Versteck", "preparation": "Vorbereitung", "alert_mind": "Wacher Geist", "weaken_weapon": "Waffe schwächen", "smash_weapon": "Waffe zerschmettern", "improve_wall": "Wand stärken", "water_thrust": "Wasserschub", "jet_of_water": "Wasserstrahl", "incandescent_hand": "Weißglühende Hand", "longcast": "Weitwurf", "lightwave": "Welle aus Licht", "ressurection": "Wiederbelebung", "recycling": "Wiederverwertung", "power_of_wilderness": "Wildniskraft", "hibernation": "Winterschlaf", "wavebonds": "Wogenfesseln", "cauterize": "Wunde ausbrennen", "copy_throwing_weapon": "Wurfwaffe kopieren", "sticky_shadows": "Zähe Schatten", "spell_intuitiveness": "Zauberahnung", "spell_constraints": "Zauberhemmer", "weaken_spell": "Zauber schwächen", "overload_spell": "Zauber überlasten", "veil_spell": "Zauber verhüllen", "summon_stone_0": "Felswesen rufen 0", "summon_stone_1": "Felswesen rufen I", "summon_stone_2": "Felswesen rufen II", "summon_stone_3": "Felswesen rufen III", "summon_stone_4": "Felswesen rufen IV", "summon_stone_5": "Felswesen rufen V", "summon_fire_0": "Feuerwesen rufen 0", "summon_fire_1": "Feuerwesen rufen I", "summon_fire_2": "Feuerwesen rufen II", "summon_fire_3": "Feuerwesen rufen III", "summon_fire_4": "Feuerwesen rufen IV", "summon_fire_5": "Feuerwesen rufen V", "summon_light_0": "Lichtwesen rufen 0", "summon_light_1": "Lichtwesen rufen I", "summon_light_2": "Lichtwesen rufen II", "summon_light_3": "Lichtwesen rufen III", "summon_light_4": "Lichtwesen rufen IV", "summon_light_5": "Lichtwesen rufen V", "summon_nature_0": "Naturwesen rufen 0", "summon_nature_1": "Naturwesen rufen I", "summon_nature_2": "Naturwesen rufen II", "summon_nature_3": "Naturwesen rufen III", "summon_nature_4": "Naturwesen rufen IV", "summon_nature_5": "Naturwesen rufen V", "summon_shadow_0": "Schattenwesen rufen 0", "summon_shadow_1": "Schattenwesen rufen I", "summon_shadow_2": "Schattenwesen rufen II", "summon_shadow_3": "Schattenwesen rufen III", "summon_shadow_4": "Schattenwesen rufen IV", "summon_shadow_5": "Schattenwesen rufen V", "summon_fate_0": "Götterdiener rufen 0", "summon_fate_1": "Götterdiener rufen I", "summon_fate_2": "Götterdiener rufen II", "summon_fate_3": "Götterdiener rufen III", "summon_fate_4": "Götterdiener rufen IV", "summon_fate_5": "Götterdiener rufen V", "summon_ghost_0": "Geisterwesen rufen 0", "summon_ghost_1": "Geisterwesen rufen I", "summon_ghost_2": "Geisterwesen rufen II", "summon_ghost_3": "Geisterwesen rufen III", "summon_ghost_4": "Geisterwesen rufen IV", "summon_ghost_5": "Geisterwesen rufen V", "summon_water_0": "Wasserwesen rufen 0", "summon_water_1": "Wasserwesen rufen I", "summon_water_2": "Wasserwesen rufen II", "summon_water_3": "Wasserwesen rufen III", "summon_water_4": "Wasserwesen rufen IV", "summon_water_5": "Wasserwesen rufen V", "summon_wind_0": "Windwesen rufen 0", "summon_wind_1": "Windwesen rufen I", "summon_wind_2": "Windwesen rufen II", "summon_wind_3": "Windwesen rufen III", "summon_wind_4": "Windwesen rufen IV", "summon_wind_5": "Windwesen rufen V" };
    var masteries1 = { "againstdarkness": "Wider die Finsternis", "agileinarmor": "Agiler Rüstungsträger", "aimedspells": "Gezielte Zauber", "alchemistsassistant": "Des Alchemisten Helfer", "alertness": "Wachsamkeit", "ambush": "Hinterhalt", "animaladept_bear": "Tierkenner (Bärenartige)", "animaladept_biggame": "Tierkenner (Großwild)", "animaladept_bird": "Tierkenner (Vögel)", "animaladept_canine": "Tierkenner (Hundeartige)", "animaladept_feline": "Tierkenner (Katzenartige)", "animaladept_fish": "Tierkenner (Fische)", "animaladept_insect": "Tierkenner (Insekten)", "animaladept_reptile": "Tierkenner (Reptilien)", "animaladept_smallgame": "Tierkenner (Kleinwild)", "animaladept_spider": "Tierkenner (Spinnentiere)", "animalcaster": "Tierzauberer", "animalexpert_bear": "Tierexperte (Bärenartige)", "animalexpert_biggame": "Tierexperte (Großwild)", "animalexpert_bird": "Tierexperte (Vögel)", "animalexpert_canine": "Tierexperte (Hundeartige)", "animalexpert_feline": "Tierexperte (Katzenartige)", "animalexpert_fish": "Tierexperte (Fische)", "animalexpert_insect": "Tierexperte (Insekten)", "animalexpert_reptile": "Tierexperte (Reptilien)", "animalexpert_smallgame": "Tierexperte (Kleinwild)", "animalexpert_spider": "Tierexperte (Spinnentiere)", "animalskin": "Haut des Tieres", "apnoe": "Apnoe", "arcanedefense1": "Arkane Verteidigung I", "arcanedefense2": "Arkane Verteidigung II", "arcanediagnosis": "Arkane Diagnose", "arcanespeed": "Arkane Geschwindigkeit", "archenemy": "Erzfeind", "arenaveteran": "Veteran der Arena", "armour1": "Rüstungsträger I", "armour2": "Rüstungsträger II", "artifactlore": "Artefaktkunde", "artificalreality": "Künstliche Wirklichkeit", "artisan": "Brandstifter", "assault": "Sturmlauf", "athomeeverywhere": "Überall zu Hause", "attackplan": "Schlachtplan (Angriff)", "balance": "Balance", "banishingprotection": "Schutz vor Bannung", "bansong": "Bannlied", "beasthunter": "Bestienjäger", "beastmaster": "Herr der Bestien", "berserk": "Berserker", "betterdisarm": "Verbessertes Entwaffnen", "betterknock": "Verbessertes Umreißen", "bibliophile": "Büchernarr", "bihandedattack": "Beidhändiger Angriff", "bihandedmastery": "Meister mit zwei Waffen", "bihandedparry": "Beidhändige Abwehr", "birdofpreyform": "Gestalt des Greifvogels", "biweapon": "Kampf mit zwei Waffen", "blackmarket": "Schwarzmarkt", "block": "Block", "bloodbath": "Blutbad", "bloodletting": "Blutiger Aderlass", "bonebreaker": "Knochenbrecher", "breathoffate": "Hauch des Schicksals", "calm": "Beruhigen", "calmhand": "Ruhige Hand", "casterseye": "Auge des Zauberers", "castershand": "Hand des Zauberers", "caution1": "Vorsicht I", "caution2": "Vorsicht II", "chainshackles": "Kettenfessel", "challenge": "Herausfordern", "changedsurrounding": "Veränderte Umgebung", "chesthit_bear": "Blattschuss (Bärenartige)", "chesthit_biggame": "Blattschuss (Großwild)", "chesthit_bird": "Blattschuss (Vögel)", "chesthit_canine": "Blattschuss (Hundeartige)", "chesthit_feline": "Blattschuss (Katzenartige)", "chesthit_fish": "Blattschuss (Fische)", "chesthit_insect": "Blattschuss (Insekten)", "chesthit_reptile": "Blattschuss (Reptilien)", "chesthit_smallgame": "Blattschuss (Kleinwild)", "chesthit_spider": "Blattschuss (Spinnentiere)", "cleverleader": "Vorausschauender Führer", "closecombatthrow": "Nahkampfwerfer", "clutch": "Umklammern", "concentratedfocus": "Konzentrierter Fokus", "confusion": "Verwirrung", "conservation": "Konservierung", "contortionist": "Schlangenmensch", "coordevade": "Koordiniertes Ausweichen", "coordinator": "Koordinator", "corporesana": "Gesunder Geist in gesundem Körper", "corsar": "Korsar", "cosmeticthaumaturgy": "Kosmetische Thaumaturgie", "costsavingjourney": "Sparsame Reise", "countermagic": "Konterzauberer", "cover": "Tarnidentität", "createscroll1": "Schriftrollen erstellen I", "createscroll2": "Schriftrollen erstellen II", "createscroll3": "Schriftrollen erstellen III", "creativedistraction": "Kreative Ablenkung", "creaturespecialist": "Spezialist für alle Wesen", "creeper": "Leisetreter", "crowdpleaser": "Publikumsliebling", "cursebringer": "Fluchbringer", "dancingblade": "Klingentanz", "darknessview": "Blick in die Dunkelheit", "dashingblow": "Schmetterschlag", "deathblow": "Todesschlag", "deepseadiver": "Tiefseetaucher", "defender": "Verteidiger", "defenseplan": "Schlachtplan (Verteidigung)", "delayedcaster": "Zauberverzögerer", "destroyerheart": "Herz des Zertörers", "detox": "Entgiftung", "diatribehymn": "Schmählied/Loblied", "diplomat": "Diplomat", "disarm": "Entwaffnen", "distancecaster": "Fernzauberer", "distract": "Ablenken", "disturbclairvoyance": "Trübung des Blicks", "dompteur": "Dompteur", "doublethrow": "Mehrfachwurf", "dyingbreath": "Atem des Sterbenden", "earthaffinity": "Erdverbundenheit", "effectivemotion": "Effektive Bewegung", "efficiency": "Effizienz", "efficienthunter": "Effizienter Jäger", "effortofwill": "Willensanstrengung", "elegantwhirlingblades": "Eleganter Klingenwirbel", "emotionsense": "Stimmungsgespür", "empathy": "Einfühlsamkeit", "enemy": "Feind", "enforcehealing": "Heilung fördern", "enhancefamiliar": "Stärkung des Vertrauten", "escapologist": "Entfesslungskünstler", "estimateanimal": "Tier einschätzen", "etiquettes": "Etikette", "evade1": "Ausweichen 1", "evade2": "Ausweichen 2", "evade3": "Ausweichen 3", "evademovement": "Ausweichbewegung", "expert": "Fachmann", "exploringmind": "Forschender Geist", "familiarbond": "Vertrautenband", "familiarlanguage": "Vertrautensprache", "fascinate": "Faszinieren", "fastforager": "Schneller Sammler", "fasthunter": "Schneller Jäger", "fastreader": "Schnellleser", "fastshooter1": "Schnellschütze I", "fastshooter2": "Schnellschütze II", "favoredform": "Bevorzugte Gestalt", "feint1": "Antäuschen 1", "feint2": "Antäuschen 2", "feint3": "Antäuschen 3", "fielddignostics": "Felddiagnose", "fieldstudy": "Feldforschung", "fightunderwater": "Kampf unter Wasser", "firemastery": "Feuermeisterschaft", "fireresistence1": "Feuerresistenz I", "fireresistence2": "Feuerresistenz II", "fireresistence3": "Feuerresistenz III", "firmamentmymap": "Meine Karte ist das Firmament", "fittingtone": "Der richtige Ton", "flameheart": "Flammenherz", "flashreflexes": "Blitzreflexe", "focuscontrol": "Fokuskontrolle", "forcetransmission": "Übertragung der Kraft", "formbanishing": "Bannung der Form", "formcontrol": "Kontrolle der Form", "formveil": "Verhüllung der Form", "fortuneteller": "Wahrsager", "freeclimber": "Freikletterer", "freedomofform": "Freiheit der Form", "freehand": "Freihändigkeit", "gambler": "Glücksspieler", "ghostexpert": "Geisterkenner", "giftedinlanguage": "Sprachbegabt", "goodaim": "Zielschuss", "goodeducation": "Gute Allgemeinbildung", "goodreflexes": "Gute Reflexe", "grandmaster": "Großmeister", "greatforcetransmission": "Große Übertragung der Kraft", "haggler": "Feilscher", "hahascoundrel": "Haha, Schurke!", "hammerblow": "Hammerschlag", "handyknowledge": "Praktisches Wissen", "hardendbycustom": "Abhärtung durch Gewöhnung", "hardhammerblow": "Kraftvoller Hammerschlag", "hardsweepingblow": "Kraftvoller Rundumschlag", "hardthrow": "Harter Wurf", "hastyprotection": "Eiliger Schutz", "healingluck": "Heilungsgeschick", "healthydistrust": "Gesundes Misstrauen", "heargossip": "Gerüchte aufschnappen", "herbhag": "Kräuterhexe", "herooftheseas": "Held der Meere", "hidemagicgestures": "Zaubergesten verbergen", "hold": "Halten", "hunter": "Waidmann", "hunter_bear": "Jäger (Bärenartige)", "hunter_biggame": "Jäger (Großwild)", "hunter_bird": "Jäger (Vögel)", "hunter_canine": "Jäger (Hundeartige)", "hunter_feline": "Jäger (Katzenartige)", "hunter_fish": "Jäger (Fische)", "hunter_insect": "Jäger (Insekten)", "hunter_reptile": "Jäger (Reptilien)", "hunter_smallgame": "Jäger (Kleinwild)", "hunter_spider": "Jäger (Spinnentiere)", "hunteroffables": "Jäger des Sagenhaften", "huntersupernatural": "Jäger des Übernatürlichen", "hurriedidentify": "Eilige Identifikation", "hypnosis": "Hypnose", "ignoreshield": "Schild umschlagen", "imperturbable": "Unbeirrbar", "improvisationartist": "Improvisationskünstler", "improvise": "Improvisation", "improviseddressup": "Improvisierte Verkleidung", "inferno": "Inferno", "influenceattitude": "Einstellung beeinflussen", "inspire": "Inspirieren", "instransparent": "Undurchschaubar", "investor": "Investor", "ironconcentration": "Eiserne Konzentration", "ironwill": "Eiserner Wille", "journeyman": "Geselle", "judgeattribute": "Werte einschätzen", "judgecharacter": "Begabter Menschenkenner", "keepcool1": "Kühler Kopf I", "keepcool2": "Kühler Kopf II", "knock": "Umreißen", "knowhoiam": "Wisst Ihr überhaupt wer ich bin?", "knowledgeispower": "Wissen ist Macht", "lastarray": "Das letzte Aufgebot", "laughmedicine": "Lachen i.d.b. Medizin", "legendhunter": "Legendenjäger", "legendsinger": "Legendensänger", "lethal": "Tödlicher Schaden", "librarian": "Bibliothekar", "lifesaver": "Lebensretter", "likemypocket": "Wie meine Westentasche", "lockhammer": "Schlösserhammer", "longdistanceswimmer": "Langstreckenschwimmer", "longjump": "Weitspringer", "longrangewhirlingblades": "Weitreichender Klingenwirbel", "longwhirlingdefense": "Andauernder Verteidigungswirbel", "luckychild": "Glückskind" };
    var masteries2 = { "luminance": "Leuchtkraft", "magiccrafter": "Zauberfinger", "magicpull": "Magischer Sog", "magicsymbols": "Magische Zeichen", "magictricks": "Magische Tricks", "marksman": "Scharfschütze", "master": "Meister", "masterbalance": "Meisterhafte Balance", "masterhunter_bear": "Meisterjäger (Bärenartige)", "masterhunter_biggame": "Meisterjäger (Großwild)", "masterhunter_bird": "Meisterjäger (Vögel)", "masterhunter_canine": "Meisterjäger (Hundeartige)", "masterhunter_feline": "Meisterjäger (Katzenartige)", "masterhunter_fish": "Meisterjäger (Fische)", "masterhunter_insect": "Meisterjäger (Insekten)", "masterhunter_reptile": "Meisterjäger (Reptilien)", "masterhunter_smallgame": "Meisterjäger (Kleinwild)", "masterhunter_spider": "Meisterjäger (Spinnentiere)", "masterofage": "Herr des Alters", "masteroffireghosts": "Herr der Feuergeister", "masterofghosts": "Herr der Geister", "masterofstone": "Herr der Felsen", "masterofstoneghosts": "Herr der Felsgeister", "masterofundead": "Meister der Untoten", "masterpiece": "Meisterwerk", "mastershot": "Meisterschuss", "mastersmith": "Schmiedemeister", "masterthrow": "Meisterwurf", "masterwaterelem": "Herr der Wasserwesen", "masterwaves": "Herr der Wogen", "materialbond1": "Materielle Verbindung 1", "materialbond2": "Materielle Verbindung 2", "mentalmaster": "Herr über den Geist", "meteologist": "Meteorologie", "missilevolley": "Geschosshagel", "missionary": "Missionar", "monkey": "Kletteraffe", "muscleman": "Muskelprotz", "natureexpert": "Naturkenner", "natureharmony": "Harmonie mit der Natur", "naturesong": "Lied der Natur", "necromancer": "Nekromant", "nightvision": "Nachtsicht", "nobodywashere": "Keiner war hier", "nothinghappend": "Nichts passiert!", "notintheface": "Nicht ins Gesicht", "nutshellcaptain": "Kapitän der verfaulten Nussschale", "observant": "Aufmerksam", "oceandiver": "Meerestaucher", "onewithnature": "Eins mit der Natur", "opportunist": "Opportunist", "overload": "Überlasten", "ownadvantage": "Eigener Vorteil", "painful": "Schmerzhafter Hieb", "penetratingprojectile": "Durchschlagendes Geschoss", "perfecthearing": "Absolutes Gehör", "perfectorientation": "Unfehlbare Orientierung", "perfecttaste": "Perfekter Gaumen", "philosopher": "Philosoph", "polymath": "Universalgelehrter", "preemption": "Vorahnung", "projectilemagic": "Geschossmagie", "protectingshadows": "Schützende Schatten", "protectionlight": "Schutz des Lichtes", "protectionmagicexpert": "Zauberschutz-Experte", "protectionmagicmaster": "Zauberschutz-Meister", "puppet": "Gliederpuppe", "push": "Abdrängen", "quickdrawer": "Schnellziehen", "quickreaction": "Schnelle Reaktion", "quicksearch": "Schnelle Durchsuchung", "quickshielddefense": "Schnelle Schildabwehr", "quickupagain": "Schnell wieder auf den Beinen", "readfoe1": "Gegner durchschauen I", "readfoe2": "Gegner durchschauen II", "rebellionsong": "Lied des Aufstandes", "relentless": "Unerbittlich", "relicmaster": "Artefaktmeister", "resistpain1": "Schmerzwiderstand I", "resistpain2": "Schmerzwiderstand II", "resistwater1": "Wasserresistenz 1", "resistwater2": "Wasserresistenz 2", "resistwater3": "Wasserresistenz 3", "ridingfighter": "Reiterkampf", "riposte": "Riposte", "riverdiver": "Flusstaucher", "roll": "Abrollen", "rush": "Vorstürmen", "sailorslegs": "Beine des Seemanns", "savingcaster": "Sparsamer Zauberer", "scrimper": "Sparfuchs", "seadog": "Seebär", "secondidentity": "Zweite Identität", "secondskin": "Zweite Haut", "shadowchild": "Kind der Schatten", "shadowmaster": "Schattenherr", "shadowwalker": "Wanderer im Schatten", "sharptongue": "Scharfe Zunge", "shield1": "Starker Schildarm I", "shield2": "Starker Schildarm II", "shieldbreaker": "Schildbrecher", "siegeshooter": "Belagerungsschütze", "sienewcutter": "Sehnenschneider", "skilledcreeper": "Begabter Schleicher", "skilledhealer": "Begabter Heiler", "skilledrescue": "Geschickte Rettung", "skilledsailor": "Begabter Seemann", "skilledsalvage": "Geschickte Rettung", "skilledscholar": "Begabter Gelehrter", "skilledscout": "Begabter Späher", "skilledstreetwalker": "Begabter Straßenwanderer", "skilledswimmer": "Begabter Schwimmer", "skilledtracker": "Begabter Spurenleser", "skipjack": "Stehaufmännchen", "sleeper": "Schläfer", "sneakattack1": "Überraschungsangriff I", "sneakattack2": "Überraschungsangriff II", "sneakattack3": "Überraschungsangriff III", "solverofknots": "Knotenlöser", "sortie": "Ausfall", "soundlessness": "Lautlosigkeit", "speaktome": "Rede mit mir", "sprinter": "Sprinter", "standclear": "Auf Abstand halten", "stargaze": "Blick auf die Sterne", "steelconcentration": "Stählerne Konzentration", "steeplechaser": "Hindernisläufer", "stonemastership": "Felsmeisterschaft", "stoneresistence1": "Felsresistenz I", "stoneresistence2": "Felsresistenz II", "stoneresistence3": "Felsresistenz III", "stormvoice": "Stimme des Sturms", "strangehold": "Würgegriff", "strongthrowing": "Starker Wurfarm", "sturdyhead": "Dickschädel", "stylegrace": "Stil und Grazie", "subtileanalysis": "Subtile Forschung", "supporthealing": "Heilung fördern", "surgeon": "Wundarzt", "surroundingsenses_city": "Umgebungssinne (Stadt)", "surroundingsenses_desert": "Umgebungssinne (Wüste)", "surroundingsenses_faerie": "Umgebungssinne (Feenwelten)", "surroundingsenses_forest": "Umgebungssinne (Wald)", "surroundingsenses_grassland": "Umgebungssinne (Steppe)", "surroundingsenses_ice": "Umgebungssinne (Eis)", "surroundingsenses_jungle": "Umgebungssinne (Dschungel)", "surroundingsenses_mountain": "Umgebungssinne (Gebirge)", "surroundingsenses_ocean": "Umgebungssinne (Meer)", "surroundingsenses_swamp": "Umgebungssinne (Sumpf)", "sweepingblow": "Rundumschlag", "sweepingslash": "Durchschlagender Hieb", "swiftpicklocks": "Flinke Dietriche", "swiftpursuit": "Flinker Verfolger", "tacticalmastermind": "Taktisches Genie", "talentedalchemist": "Begabter Alchemist", "talentedartist": "Begabter Künstler", "talentedcraftsman": "Begabter Handwerker", "talentedfingerartist": "Begabter Fingerkünstler", "talentedhistorian": "Begabter Historiker", "talentedlier": "Begabter Lügner", "talentedpighead": "Begabter Sturkopf", "talentedtradesman": "Begabter Handwerker", "targetedhit": "Gezielter Treffer", "targetedshots1": "Gezielte Schüsse I", "targetedshots2": "Gezielte Schüsse II", "taunt": "Beißender Spott", "telepathicshield": "Telepathischer Schild", "tellgossip": "Gerüchte verbreiten", "terrainlore_desert": "Geländekunde (Wüste)", "terrainlore_faerie": "Geländekunde (Feenwelten)", "terrainlore_forest": "Geländekunde (Wald)", "terrainlore_grassland": "Geländekunde (Steppe)", "terrainlore_ice": "Geländekunde (Eis)", "terrainlore_jungle": "Geländekunde (Dschungel)", "terrainlore_mountain": "Geländekunde (Gebirge)", "terrainlore_ocean": "Geländekunde (Meer)", "terrainlore_swamp": "Geländekunde (Sumpf)", "tirelesschaser": "Unermüdlicher Verfolger", "troopup": "Sammeln", "truthwithin": "Der Sage wahrer Kern", "twosoulsonethought": "Zwei Geister, ein Gedanke", "unblinded": "Ungeblendet", "undeadhunter": "Untotenjäger", "unobstrusive": "Unauffällig", "urgentmessage": "Dringende Botschaft", "veteranofmelee": "Veteran des Kampfgetümmels", "vetinary": "Tierarzt", "voicesoffriends": "Stimmen der Freunde", "wallclimber": "Mauerstürmer", "wardingexpert": "Bannzauber-Experte", "wardinghand": "Bannende Hand", "warning": "Unterschwellige Warnung", "warrider": "Schlachtreiter", "warrioroflight": "Streiter des Lichtes", "wasnotme": "Ich war's nicht", "watchit": "Pass ja auf!", "watermastery": "Wassermeisterschaft", "wavechild": "Kind der Wellen", "wayoftheworld": "Wesen der Welt", "weaponoutofnothing": "Waffe aus dem Nichts", "weatherexpert": "Wetterkundig", "weathermaster": "Herr des Wetters", "weatherproof": "Wetterfest", "whirlingblades": "Klingenwirbel", "whirlingdefense": "Verteidigungswirbel", "wildernesschild": "Kind der Wildnis", "wildernessrunner": "Wildnisläufer", "willbreaker": "Willensbrecher", "windghostmaster": "Herr der Windgeister", "windmastery": "Windmeisterschaft", "windresistence1": "Windresistenz I", "windresistence2": "Windresistenz II", "windresistence3": "Windresistenz III", "withdraw": "Rückzugsgefecht", "withoutwords": "Ohne Worte", "wondercrafter againstdarkness": "Wider die Finsternis", "agileinarmor": "Agiler Rüstungsträger", "aimedspells": "Gezielte Zauber", "alchemistsassistant": "Des Alchemisten Helfer", "alertness": "Wachsamkeit", "ambush": "Hinterhalt", "animaladept_bear": "Tierkenner (Bärenartige)", "animaladept_biggame": "Tierkenner (Großwild)", "animaladept_bird": "Tierkenner (Vögel)", "animaladept_canine": "Tierkenner (Hundeartige)", "animaladept_feline": "Tierkenner (Katzenartige)", "animaladept_fish": "Tierkenner (Fische)", "animaladept_insect": "Tierkenner (Insekten)", "animaladept_reptile": "Tierkenner (Reptilien)", "animaladept_smallgame": "Tierkenner (Kleinwild)", "animaladept_spider": "Tierkenner (Spinnentiere)", "animalcaster": "Tierzauberer", "animalexpert_bear": "Tierexperte (Bärenartige)", "animalexpert_biggame": "Tierexperte (Großwild)", "animalexpert_bird": "Tierexperte (Vögel)", "animalexpert_canine": "Tierexperte (Hundeartige)", "animalexpert_feline": "Tierexperte (Katzenartige)", "animalexpert_fish": "Tierexperte (Fische)", "animalexpert_insect": "Tierexperte (Insekten)", "animalexpert_reptile": "Tierexperte (Reptilien)", "animalexpert_smallgame": "Tierexperte (Kleinwild)", "animalexpert_spider": "Tierexperte (Spinnentiere)", "animalskin": "Haut des Tieres", "apnoe": "Apnoe", "arcanedefense1": "Arkane Verteidigung I", "arcanedefense2": "Arkane Verteidigung II", "arcanediagnosis": "Arkane Diagnose", "arcanespeed": "Arkane Geschwindigkeit", "archenemy": "Erzfeind" };
    var masteries3 = { "arenaveteran": "Veteran der Arena", "armour1": "Rüstungsträger I", "armour2": "Rüstungsträger II", "artifactlore": "Artefaktkunde", "artificalreality": "Künstliche Wirklichkeit", "artisan": "Brandstifter", "assault": "Sturmlauf", "athomeeverywhere": "Überall zu Hause", "attackplan": "Schlachtplan (Angriff)", "balance": "Balance", "banishingprotection": "Schutz vor Bannung", "bansong": "Bannlied", "beasthunter": "Bestienjäger", "beastmaster": "Herr der Bestien", "berserk": "Berserker", "betterdisarm": "Verbessertes Entwaffnen", "betterknock": "Verbessertes Umreißen", "bibliophile": "Büchernarr", "bihandedattack": "Beidhändiger Angriff", "bihandedmastery": "Meister mit zwei Waffen", "bihandedparry": "Beidhändige Abwehr", "birdofpreyform": "Gestalt des Greifvogels", "biweapon": "Kampf mit zwei Waffen", "blackmarket": "Schwarzmarkt", "block": "Block", "bloodbath": "Blutbad", "bloodletting": "Blutiger Aderlass", "bonebreaker": "Knochenbrecher", "breathoffate": "Hauch des Schicksals", "calm": "Beruhigen", "calmhand": "Ruhige Hand", "casterseye": "Auge des Zauberers", "castershand": "Hand des Zauberers", "caution1": "Vorsicht I", "caution2": "Vorsicht II", "chainshackles": "Kettenfessel", "challenge": "Herausfordern", "changedsurrounding": "Veränderte Umgebung", "chesthit_bear": "Blattschuss (Bärenartige)", "chesthit_biggame": "Blattschuss (Großwild)", "chesthit_bird": "Blattschuss (Vögel)", "chesthit_canine": "Blattschuss (Hundeartige)", "chesthit_feline": "Blattschuss (Katzenartige)", "chesthit_fish": "Blattschuss (Fische)", "chesthit_insect": "Blattschuss (Insekten)", "chesthit_reptile": "Blattschuss (Reptilien)", "chesthit_smallgame": "Blattschuss (Kleinwild)", "chesthit_spider": "Blattschuss (Spinnentiere)", "cleverleader": "Vorausschauender Führer", "closecombatthrow": "Nahkampfwerfer", "clutch": "Umklammern", "concentratedfocus": "Konzentrierter Fokus", "confusion": "Verwirrung", "conservation": "Konservierung", "contortionist": "Schlangenmensch", "coordevade": "Koordiniertes Ausweichen", "coordinator": "Koordinator", "corporesana": "Gesunder Geist in gesundem Körper", "corsar": "Korsar", "cosmeticthaumaturgy": "Kosmetische Thaumaturgie", "costsavingjourney": "Sparsame Reise", "countermagic": "Konterzauberer", "cover": "Tarnidentität", "createscroll1": "Schriftrollen erstellen I", "createscroll2": "Schriftrollen erstellen II", "createscroll3": "Schriftrollen erstellen III", "creativedistraction": "Kreative Ablenkung", "creaturespecialist": "Spezialist für alle Wesen", "creeper": "Leisetreter", "crowdpleaser": "Publikumsliebling", "cursebringer": "Fluchbringer", "dancingblade": "Klingentanz", "darknessview": "Blick in die Dunkelheit", "dashingblow": "Schmetterschlag", "deathblow": "Todesschlag", "deepseadiver": "Tiefseetaucher", "defender": "Verteidiger", "defenseplan": "Schlachtplan (Verteidigung)", "delayedcaster": "Zauberverzögerer", "destroyerheart": "Herz des Zertörers", "detox": "Entgiftung", "diatribehymn": "Schmählied/Loblied", "diplomat": "Diplomat", "disarm": "Entwaffnen", "distancecaster": "Fernzauberer", "distract": "Ablenken", "disturbclairvoyance": "Trübung des Blicks", "dompteur": "Dompteur", "doublethrow": "Mehrfachwurf", "dyingbreath": "Atem des Sterbenden", "earthaffinity": "Erdverbundenheit", "effectivemotion": "Effektive Bewegung", "efficiency": "Effizienz", "efficienthunter": "Effizienter Jäger", "effortofwill": "Willensanstrengung", "elegantwhirlingblades": "Eleganter Klingenwirbel", "emotionsense": "Stimmungsgespür", "empathy": "Einfühlsamkeit", "enemy": "Feind", "enforcehealing": "Heilung fördern", "enhancefamiliar": "Stärkung des Vertrauten", "escapologist": "Entfesslungskünstler", "estimateanimal": "Tier einschätzen", "etiquettes": "Etikette", "evade1": "Ausweichen 1", "evade2": "Ausweichen 2", "evade3": "Ausweichen 3", "evademovement": "Ausweichbewegung", "expert": "Fachmann", "exploringmind": "Forschender Geist", "familiarbond": "Vertrautenband", "familiarlanguage": "Vertrautensprache", "fascinate": "Faszinieren", "fastforager": "Schneller Sammler", "fasthunter": "Schneller Jäger", "fastreader": "Schnellleser", "fastshooter1": "Schnellschütze I", "fastshooter2": "Schnellschütze II", "favoredform": "Bevorzugte Gestalt", "feint1": "Antäuschen 1", "feint2": "Antäuschen 2", "feint3": "Antäuschen 3", "fielddignostics": "Felddiagnose", "fieldstudy": "Feldforschung", "fightunderwater": "Kampf unter Wasser", "firemastery": "Feuermeisterschaft", "fireresistence1": "Feuerresistenz I", "fireresistence2": "Feuerresistenz II", "fireresistence3": "Feuerresistenz III", "firmamentmymap": "Meine Karte ist das Firmament", "fittingtone": "Der richtige Ton", "flameheart": "Flammenherz", "flashreflexes": "Blitzreflexe", "focuscontrol": "Fokuskontrolle", "forcetransmission": "Übertragung der Kraft", "formbanishing": "Bannung der Form", "formcontrol": "Kontrolle der Form", "formveil": "Verhüllung der Form", "fortuneteller": "Wahrsager", "freeclimber": "Freikletterer", "freedomofform": "Freiheit der Form", "freehand": "Freihändigkeit", "gambler": "Glücksspieler", "ghostexpert": "Geisterkenner", "giftedinlanguage": "Sprachbegabt", "goodaim": "Zielschuss", "goodeducation": "Gute Allgemeinbildung", "goodreflexes": "Gute Reflexe", "grandmaster": "Großmeister", "greatforcetransmission": "Große Übertragung der Kraft", "haggler": "Feilscher", "hahascoundrel": "Haha, Schurke!", "hammerblow": "Hammerschlag", "handyknowledge": "Praktisches Wissen", "hardendbycustom": "Abhärtung durch Gewöhnung", "hardhammerblow": "Kraftvoller Hammerschlag", "hardsweepingblow": "Kraftvoller Rundumschlag", "hardthrow": "Harter Wurf", "hastyprotection": "Eiliger Schutz", "healingluck": "Heilungsgeschick", "healthydistrust": "Gesundes Misstrauen", "heargossip": "Gerüchte aufschnappen", "herbhag": "Kräuterhexe", "herooftheseas": "Held der Meere", "hidemagicgestures": "Zaubergesten verbergen", "hold": "Halten", "hunter": "Waidmann", "hunter_bear": "Jäger (Bärenartige)", "hunter_biggame": "Jäger (Großwild)", "hunter_bird": "Jäger (Vögel)", "hunter_canine": "Jäger (Hundeartige)", "hunter_feline": "Jäger (Katzenartige)", "hunter_fish": "Jäger (Fische)", "hunter_insect": "Jäger (Insekten)", "hunter_reptile": "Jäger (Reptilien)", "hunter_smallgame": "Jäger (Kleinwild)", "hunter_spider": "Jäger (Spinnentiere)", "hunteroffables": "Jäger des Sagenhaften", "huntersupernatural": "Jäger des Übernatürlichen", "hurriedidentify": "Eilige Identifikation", "hypnosis": "Hypnose", "ignoreshield": "Schild umschlagen", "imperturbable": "Unbeirrbar", "improvisationartist": "Improvisationskünstler", "improvise": "Improvisation", "improviseddressup": "Improvisierte Verkleidung", "inferno": "Inferno", "influenceattitude": "Einstellung beeinflussen", "inspire": "Inspirieren", "instransparent": "Undurchschaubar", "investor": "Investor", "ironconcentration": "Eiserne Konzentration", "ironwill": "Eiserner Wille", "journeyman": "Geselle", "judgeattribute": "Werte einschätzen", "judgecharacter": "Begabter Menschenkenner", "keepcool1": "Kühler Kopf I", "keepcool2": "Kühler Kopf II", "knock": "Umreißen", "knowhoiam": "Wisst Ihr überhaupt wer ich bin?", "knowledgeispower": "Wissen ist Macht", "lastarray": "Das letzte Aufgebot", "laughmedicine": "Lachen i.d.b. Medizin", "legendhunter": "Legendenjäger", "legendsinger": "Legendensänger", "lethal": "Tödlicher Schaden", "librarian": "Bibliothekar", "lifesaver": "Lebensretter", "likemypocket": "Wie meine Westentasche", "lockhammer": "Schlösserhammer", "longdistanceswimmer": "Langstreckenschwimmer", "longjump": "Weitspringer", "longrangewhirlingblades": "Weitreichender Klingenwirbel", "longwhirlingdefense": "Andauernder Verteidigungswirbel", "luckychild": "Glückskind", "luminance": "Leuchtkraft", "magiccrafter": "Zauberfinger", "magicpull": "Magischer Sog", "magicsymbols": "Magische Zeichen", "magictricks": "Magische Tricks", "marksman": "Scharfschütze", "master": "Meister", "masterbalance": "Meisterhafte Balance", "masterhunter_bear": "Meisterjäger (Bärenartige)", "masterhunter_biggame": "Meisterjäger (Großwild)", "masterhunter_bird": "Meisterjäger (Vögel)", "masterhunter_canine": "Meisterjäger (Hundeartige)", "masterhunter_feline": "Meisterjäger (Katzenartige)", "masterhunter_fish": "Meisterjäger (Fische)", "masterhunter_insect": "Meisterjäger (Insekten)", "masterhunter_reptile": "Meisterjäger (Reptilien)", "masterhunter_smallgame": "Meisterjäger (Kleinwild)", "masterhunter_spider": "Meisterjäger (Spinnentiere)", "masterofage": "Herr des Alters", "masteroffireghosts": "Herr der Feuergeister", "masterofghosts": "Herr der Geister", "masterofstone": "Herr der Felsen", "masterofstoneghosts": "Herr der Felsgeister", "masterofundead": "Meister der Untoten", "masterpiece": "Meisterwerk", "mastershot": "Meisterschuss", "mastersmith": "Schmiedemeister", "masterthrow": "Meisterwurf", "masterwaterelem": "Herr der Wasserwesen", "masterwaves": "Herr der Wogen", "materialbond1": "Materielle Verbindung 1", "materialbond2": "Materielle Verbindung 2", "mentalmaster": "Herr über den Geist", "meteologist": "Meteorologie" };
    var masteries4 = { "missilevolley": "Geschosshagel", "missionary": "Missionar", "monkey": "Kletteraffe", "muscleman": "Muskelprotz", "natureexpert": "Naturkenner", "natureharmony": "Harmonie mit der Natur", "naturesong": "Lied der Natur", "necromancer": "Nekromant", "nightvision": "Nachtsicht", "nobodywashere": "Keiner war hier", "nothinghappend": "Nichts passiert!", "notintheface": "Nicht ins Gesicht", "nutshellcaptain": "Kapitän der verfaulten Nussschale", "observant": "Aufmerksam", "oceandiver": "Meerestaucher", "onewithnature": "Eins mit der Natur", "opportunist": "Opportunist", "overload": "Überlasten", "ownadvantage": "Eigener Vorteil", "painful": "Schmerzhafter Hieb", "penetratingprojectile": "Durchschlagendes Geschoss", "perfecthearing": "Absolutes Gehör", "perfectorientation": "Unfehlbare Orientierung", "perfecttaste": "Perfekter Gaumen", "philosopher": "Philosoph", "polymath": "Universalgelehrter", "preemption": "Vorahnung", "projectilemagic": "Geschossmagie", "protectingshadows": "Schützende Schatten", "protectionlight": "Schutz des Lichtes", "protectionmagicexpert": "Zauberschutz-Experte", "protectionmagicmaster": "Zauberschutz-Meister", "puppet": "Gliederpuppe", "push": "Abdrängen", "quickdrawer": "Schnellziehen", "quickreaction": "Schnelle Reaktion", "quicksearch": "Schnelle Durchsuchung", "quickshielddefense": "Schnelle Schildabwehr", "quickupagain": "Schnell wieder auf den Beinen", "readfoe1": "Gegner durchschauen I", "readfoe2": "Gegner durchschauen II", "rebellionsong": "Lied des Aufstandes", "relentless": "Unerbittlich", "relicmaster": "Artefaktmeister", "resistpain1": "Schmerzwiderstand I", "resistpain2": "Schmerzwiderstand II", "resistwater1": "Wasserresistenz 1", "resistwater2": "Wasserresistenz 2", "resistwater3": "Wasserresistenz 3", "ridingfighter": "Reiterkampf", "riposte": "Riposte", "riverdiver": "Flusstaucher", "roll": "Abrollen", "rush": "Vorstürmen", "sailorslegs": "Beine des Seemanns", "savingcaster": "Sparsamer Zauberer", "scrimper": "Sparfuchs", "seadog": "Seebär", "secondidentity": "Zweite Identität", "secondskin": "Zweite Haut", "shadowchild": "Kind der Schatten", "shadowmaster": "Schattenherr", "shadowwalker": "Wanderer im Schatten", "sharptongue": "Scharfe Zunge", "shield1": "Starker Schildarm I", "shield2": "Starker Schildarm II", "shieldbreaker": "Schildbrecher", "siegeshooter": "Belagerungsschütze", "sienewcutter": "Sehnenschneider", "skilledcreeper": "Begabter Schleicher", "skilledhealer": "Begabter Heiler", "skilledrescue": "Geschickte Rettung", "skilledsailor": "Begabter Seemann", "skilledsalvage": "Geschickte Rettung", "skilledscholar": "Begabter Gelehrter", "skilledscout": "Begabter Späher", "skilledstreetwalker": "Begabter Straßenwanderer", "skilledswimmer": "Begabter Schwimmer", "skilledtracker": "Begabter Spurenleser", "skipjack": "Stehaufmännchen", "sleeper": "Schläfer", "sneakattack1": "Überraschungsangriff I", "sneakattack2": "Überraschungsangriff II", "sneakattack3": "Überraschungsangriff III", "solverofknots": "Knotenlöser", "sortie": "Ausfall", "soundlessness": "Lautlosigkeit", "speaktome": "Rede mit mir", "sprinter": "Sprinter", "standclear": "Auf Abstand halten", "stargaze": "Blick auf die Sterne", "steelconcentration": "Stählerne Konzentration", "steeplechaser": "Hindernisläufer", "stonemastership": "Felsmeisterschaft", "stoneresistence1": "Felsresistenz I", "stoneresistence2": "Felsresistenz II", "stoneresistence3": "Felsresistenz III", "stormvoice": "Stimme des Sturms", "strangehold": "Würgegriff", "strongthrowing": "Starker Wurfarm", "sturdyhead": "Dickschädel", "stylegrace": "Stil und Grazie", "subtileanalysis": "Subtile Forschung", "supporthealing": "Heilung fördern", "surgeon": "Wundarzt", "surroundingsenses_city": "Umgebungssinne (Stadt)", "surroundingsenses_desert": "Umgebungssinne (Wüste)", "surroundingsenses_faerie": "Umgebungssinne (Feenwelten)", "surroundingsenses_forest": "Umgebungssinne (Wald)", "surroundingsenses_grassland": "Umgebungssinne (Steppe)", "surroundingsenses_ice": "Umgebungssinne (Eis)", "surroundingsenses_jungle": "Umgebungssinne (Dschungel)", "surroundingsenses_mountain": "Umgebungssinne (Gebirge)", "surroundingsenses_ocean": "Umgebungssinne (Meer)", "surroundingsenses_swamp": "Umgebungssinne (Sumpf)", "sweepingblow": "Rundumschlag", "sweepingslash": "Durchschlagender Hieb", "swiftpicklocks": "Flinke Dietriche", "swiftpursuit": "Flinker Verfolger", "tacticalmastermind": "Taktisches Genie", "talentedalchemist": "Begabter Alchemist", "talentedartist": "Begabter Künstler", "talentedcraftsman": "Begabter Handwerker", "talentedfingerartist": "Begabter Fingerkünstler", "talentedhistorian": "Begabter Historiker", "talentedlier": "Begabter Lügner", "talentedpighead": "Begabter Sturkopf", "talentedtradesman": "Begabter Handwerker", "targetedhit": "Gezielter Treffer", "targetedshots1": "Gezielte Schüsse I", "targetedshots2": "Gezielte Schüsse II", "taunt": "Beißender Spott", "telepathicshield": "Telepathischer Schild", "tellgossip": "Gerüchte verbreiten", "terrainlore_desert": "Geländekunde (Wüste)", "terrainlore_faerie": "Geländekunde (Feenwelten)", "terrainlore_forest": "Geländekunde (Wald)", "terrainlore_grassland": "Geländekunde (Steppe)", "terrainlore_ice": "Geländekunde (Eis)", "terrainlore_jungle": "Geländekunde (Dschungel)", "terrainlore_mountain": "Geländekunde (Gebirge)", "terrainlore_ocean": "Geländekunde (Meer)", "terrainlore_swamp": "Geländekunde (Sumpf)", "tirelesschaser": "Unermüdlicher Verfolger", "troopup": "Sammeln", "truthwithin": "Der Sage wahrer Kern", "twosoulsonethought": "Zwei Geister, ein Gedanke", "unblinded": "Ungeblendet", "undeadhunter": "Untotenjäger", "unobstrusive": "Unauffällig", "urgentmessage": "Dringende Botschaft", "veteranofmelee": "Veteran des Kampfgetümmels", "vetinary": "Tierarzt", "voicesoffriends": "Stimmen der Freunde", "wallclimber": "Mauerstürmer", "wardingexpert": "Bannzauber-Experte", "wardinghand": "Bannende Hand", "warning": "Unterschwellige Warnung", "warrider": "Schlachtreiter", "warrioroflight": "Streiter des Lichtes", "wasnotme": "Ich war's nicht", "watchit": "Pass ja auf!", "watermastery": "Wassermeisterschaft", "wavechild": "Kind der Wellen", "wayoftheworld": "Wesen der Welt", "weaponoutofnothing": "Waffe aus dem Nichts", "weatherexpert": "Wetterkundig", "weathermaster": "Herr des Wetters", "weatherproof": "Wetterfest", "whirlingblades": "Klingenwirbel", "whirlingdefense": "Verteidigungswirbel", "wildernesschild": "Kind der Wildnis", "wildernessrunner": "Wildnisläufer", "willbreaker": "Willensbrecher", "windghostmaster": "Herr der Windgeister", "windmastery": "Windmeisterschaft", "windresistence1": "Windresistenz I", "windresistence2": "Windresistenz II", "windresistence3": "Windresistenz III", "withdraw": "Rückzugsgefecht", "withoutwords": "Ohne Worte", "wondercrafter": "Wunderwirker", "wonderworker": "Wunderarbeiter", "workunderwater": "Arbeit unter Wasser", "wouldilietoyou": "Können diese Augen lügen?" };
    var masteries5 = { "analyst": "Analyst", "meditation": "Meditaton", "flexible_weakening": "Flexible Schwächung", "cleansing_concentration": "Reinigende Konzentration (Aufladung)", "protecting_concentration": "Schützende Konzentration (Aufladung)", "weakening_concentration": "Schwächende Konzentration (Aufladung)", "strong_weakening": "Starke Schwächung", "wallmaster": "Wandmeister", "destroying_concentration": "Zerstörerische Konzentration (Auflad.)", "overwhelming_profiency": "Erdrückende Kenntnis", "longterm_observation": "Langzeitbeobachtung", "magic_detector": "Magiedetektor", "magic_gesture_expert": "Zaubergesten-Experte", "fake_magic_gesture": "Falsche Zaubergesten", "fast_casting": "Flinkes Zaubern", "enhanced_spells": "Verstärkte Zauber", "targeting_caster": "Zielender Zauberer", "unhasty_casting": "Hastfreies Zaubern", "silent_casting": "Stilles Zaubern", "ranged_casting": "Weites Zaubern", "sustained_casting": "Anhaltende Zauberwirkung", "broad_knowledge": "Breite Zauberkenntnis", "opponent_blood": "Gegner der Blutwesen", "opponent_stone": "Gegner der Felswesen", "opponent_fire": "Gegner der Feuerwesen", "opponent_ghost": "Gegner der Geisterwesen", "opponent_god": "Gegner der Götterdiener", "opponent_light": "Gegner der Lichtwesen", "opponent_nature": "Gegner der Naturwesen", "opponent_shadow": "Gegner der Schattenwesen", "opponent_water": "Gegner der Wasserwesen", "opponent_darkness": "Gegner der Wesen der Finsternis", "opponent_wind": "Gegner der Windwesen", "magehunter": "Magierjäger", "selective_field": "Selektives Schutzfeld", "antimagic_hardening": "Antimagische Abhärtung", "brute_banishing": "Brachiales Bannen", "effective_banisher": "Effektiver Bannmagier", "enemy_blood": "Feind der Blutwesen", "enemy_stone": "Feind der Felswesen", "enemy_fire": "Feind der Feuerwesen", "enemy_ghost": "Feind der Geisterwesen", "enemy_god": "Feind der Götterdiener", "enemy_light": "Feind der Lichtwesen", "enemy_nature": "Feind der Naturwesen", "enemy_shadow": "Feind der Schattenwesen", "enemy_water": "Feind der Wasserwesen", "enemy_darkness": "Feind der Wesen der Finsternis", "enemy_wind": "Feind der Windwesen", "broadband_antimagic": "Breitband-Bannmagie", "archenemy_blood": "Erzfeind der Blutwesen", "archenemy_stone": "Erzfeind der Felswesen", "archenemy_fire": "Erzfeind der Feuerwesen", "archenemy_ghost": "Erzfeind der Geisterwesen", "archenemy_god": "Erzfeind der Götterdiener", "archenemy_light": "Erzfeind der Lichtwesen", "archenemy_nature": "Erzfeind der Naturwesen", "archenemy_shadow": "Erzfeind der Schattenwesen", "archenemy_water": "Erzfeind der Wasserwesen", "archenemy_darkness": "Erzfeind der Wesen der Finsternis", "archenemy_wind": "Erzfeind der Windwesen", "fast_counter": "Schneller Konter", "superior_counter": "Überlegener Konter", "countermagic_armor": "Antimagischer Panzer", "penetrating_gaze": "Durchdringender Blick", "subtle_influence": "Subtile Beeinflussung", "unyielding_will": "Unbeugsamer Wille", "counter_control": "Beherrschungskonter", "friendly_takeover": "Freundliche Übernahme", "superiority": "Überlegenheit", "duel_of_wills": "Willensduell", "victory_of_mind": "Sieg des Geistes ", "will_enhancer": "Willensverstärkun", "materialbond3": "Materielle Verbindung III", "firm_anker": "Feste Verankerung", "hard_to_hit": "Kaum zu treffen", "paralyzing_magic": "Lähmende Magie", "lasting_speed": "Ausgedehnte Geschwindigkeit", "deflect_projectile1": "Geschoss ablenken I", "speed_transfer": "Geschwindigkeitsübertragung", "telekinetic": "Telekinetiker", "moving_caster1": "Zauberbewegungen I", "deflect_projectile2": "Geschoss ablenken II", "unrestricted_motion": "Uneingeschränkte Bewegung", "moving_caster2": "Zauberbewegungen II", "one_with_the_wind": "Eins mit dem Wind", "reflect_projectile": "Geschoss zurückschleudern", "i_see_through_you": "Ich habe dich durchschaut!", "magic_senses": "Magische Sinne", "recognize_signature": "Signatur erkennen", "enhanced_senses": "Sinnesstärkung", "knowledge_is_power": "Wissen ist Macht", "spellsense1": "Zaubergespür I", "arcane_forensic1": "Arkaner Forensiker I", "soothing_aura": "Beruhigende Aura", "shared_insight": "Geteilte Erkenntnis", "forced_insight": "Gewaltsame Erkenntnis", "illusiondestroyer": "Illusionszerstörer", "deep_insight": "Tiefe Erkenntnis", "arcane_forensic2": "Arkaner Forensiker II", "thought_cathedral": "Gedankenkathedrale", "sense_magic": "Magiegespür", "spellsense2": "Zaubergespür II", "arcane_forensic3": "Arkaner Forensiker III", "divider_of_veils": "Teiler des Schleiers", "stone_summoner": "Felsbeschwörer", "stone_power": "Felsenkraft", "power_of_the_ore": "Kraft des Erzes", "stone_former": "Steinformer", "object_caster": "Objektzauberer", "sense_stone": "Felsgespür", "object_destroyer": "Objektzerstörer", "stubborn_as_stone": "Sturheit der Felsen", "fists_of_steel": "Fäuste aus Stahl", "stoneaffinity": "Felsverbundenheit", "heavens_enemy": "Himmelsfeind", "root_in_stone": "Felsverwurzelung", "mind_of_seel": "Stählerne Stirn", "impressive_flame": "Beeindruckende Flamme", "fire_summoner": "Feuerbeschwörer", "heat_aura": "Hitzeaura", "bonfire": "Leuchtfeuer", "forceful_explosion": "Starke Explosion", "burning_rage": "Brennender Zorn", "efficient_flames": "Effiziente Flammen", "fireproof": "Feuerfestigkeit", "fiery_surrounding": "Feurige Umgebung", "firestarter": "Feuerstarter", "master_of_heat": "Herr über die Hitze", "firestorm": "Feuersturm", "heatmaster": "Herr der Hitze", "cauterize": "Kauterisieren", "feeding_flames": "Nährende Flammen", "healing_efficiency": "Heilungseffizienz", "disease_resistence": "Seuchenresistenz", "life_blossom": "Lebensblüte", "emergency_balm": "Notlinderung", "signs_of_life": "Zeichen des Lebens", "anatomic_secrets": "Anatomisches Spezialwissen", "magic_poison_immunity": "Magische Giftimmunität", "multiple_healing": "Mehrfachheilung", "life_intuition": "Gespür des Lebens", "healing_hands": "Heilende Hände", "phoenix_rising": "Phönix aus der Asche", "stable_healmagic": "Stabile Heilzauberei", "clear_sight": "Klarer Blick", "blurry_blade": "Verschwommene Klinge", "multiple_illusions": "Multiple Trugbilder", "selective_illusions": "Selektive Illusion", "immoderate_trust": "Übermäßiges Vertrauen", "inscrutable_magic": "Undurchschaubare Magie", "shared_camouflage": "Geteilte Tarnung", "spellhustle": "Zauberschwindel", "master_of_weak_minds": "Herr der schwachen Geister", "unseen_attack": "Ungesehener Angriff", "constant_disturbance1": "Andauernde Störung I", "arcane_archer": "Arkaner Bogenschütze", "defensive_caster": "Defensiver Zauberer", "pierce_darkness": "Durchdringe die Dunkelheit", "magical_throwing_weapon": "Zauberhafte Wurfwaffe", "constant_disturbance2": "Andauernde Störung II", "one_with_weapon": "Eins mit der Waffe", "destroyerghost": "Geist des Zerstörers", "protected_caster": "Geschützter Zauberer", "careful_aiming": "Sorgfältiges Zielen", "enhanced_attack": "Verstärkter Angriff", "unruly_disturbance": "Widerspenstige Störung", "destroyerblood": "Blut des Zerstörers", "hardtoescape": "Kaum zu entrinnen", "masterofmelee": "Meister des Kampfgetümmels", "destroyermind": "Verstand des Zerstörer", "moonsteel_concentration": "Mondstählerne Konzentration", "blinder": "Blender" };
    var masteries6 = { "child_of_light": "Kind des Lichts", "lightsummoner": "Lichtbeschwörer", "disrupter_of_shadows": "Störer der Schatten", "smashing_light": "Zerschmetterndes Licht", "brighter_as_light": "Heller als das Licht", "master_of_lightcreatures": "Herr der Lichtgeister", "shining_example": "Leuchtendes Vorbild", "light_in_the_dark": "Licht in der Finsternis", "lightenhancer": "Lichtverstärker", "shocking_light": "Lichtschock", "nurturing_light": "Nahrung des Lichts", "guardian_of_light": "Wächter des Lichts", "arbiter_of_brightness": "Gebieter der Helligkeit", "smasher_of_darkness": "Zerschmetterer der Dunkelheit", "localfauna": "Lokale Tierwelt", "natureconjurer": "Naturbeschwörer", "natureprotection": "Schutz der Natur", "animalcaller": "Tierrufer", "magichardening": "Magische Abhärtung", "naturecloseness": "Nähe zur Natur", "animalcompany": "Tierbegleitung", "rootsleep": "Wurzelschlaf", "wildernessservant": "Diener der Wildnis", "nature_nourishment": "Nahrung der Natur", "onewithanimals": "Eins mit den Tieren", "efficientdisguise": "Effiziente Verhüllung", "lightconjurer": "Lichtbeschwörer", "disruptor_of_light": "Störer des Lichts", "unseen": "Ungesehen", "darker_as_shadows": "Dunkler als die Schatten", "master_of_shadowghosts": "Herr der Schattengeister", "nightlyhunter": "Nächtlicher ", "scaryshadows": "Furchterregende Schatten", "caringshadows": "Behütende Schatten", "shadowsense": "Schattengespürr", "matterveiler": "Verhüller der Materie", "godly_conjurer": "Göttlicher Beschwörer", "fate_aware": "Schicksalsbewusst", "self_blessing": "Selbstsegnung", "personalized_curse": "Personalisierter Fluch", "fate_knowledge": "Schicksalskenntnis", "blessed": "Vom Glück verfolgt", "leased_luck": "Das Glück gepachtet", "curse_master": "Fluchmeister", "prophet": "Prophet", "grand_curse_master": "Fluchgroßmeister", "owns_fate_master": "Herr des eigenen Schicksals", "hastyprotection2": "Eiliger Schutz II", "protective_knowledge": "Schützendes Wissen", "protection_bloodcreature": "Schutz vor Blutwesen", "protection_stonecreature": "Schutz vor Felswesen", "protection_firecreature": "Schutz vor Feuerwesen", "protection_ghostcreature": "Schutz vor Geisterwesen", "protection_godservant": "Schutz vor Götterdienern", "protection_lightcreature": "Schutz vor Lichtwesen", "protection_naturecreature": "Schutz vor Naturwesen", "protection_shadowcreature": "Schutz vor Schattenwesen", "protection_watercreature": "Schutz vor Wasserwesen", "protection_creature_darkness": "Schutz vor Kreaturen der Finsternis", "protection_windcreature": "Schutz vor Windwesen", "stacked_protection": "Gestapelter Schutz", "strong_protection": "Starker Schutz", "spell_identification": "Zaubererkennung", "close": "Knapp daneben", "magic_defender": "Magischer Verteidiger", "granted_protection": "Verliehene Schutzwirkung", "thorny_protection": "Dorniger Schutz", "shared_protection": "Geteilte Schutzwirkung", "tightened_morale": "Gefestigte Moral", "magic_and_craftmanship": "Magie und Handwerk", "acuteness": "Scharfsinn", "overall_senses": "Allumfassende Sinne", "steely_morale": "Gestählte Moral", "longterm_overload": "Langfristiges Überlasten", "shared_advantage": "Geteilter Vorteil", "forcetransfer": "Krafttransfer", "magic_runes": "Magische Runen", "absolute_awareness": "Absolute Aufmerksamkeit", "spelladvantage": "Zaubervorteil", "ghostcreature_conjurer": "Geisterbeschwörer", "undead_classicist": "Untotenkenner", "curse_of_curses": "Fluch der Flüche", "inspired_by_ghosts": "Inspiration der Geister", "necromantic_dulling": "Nekromantische Abstumpfung", "undead_presence": "Präsenz der Untoten", "ageless": "Alterslosigkeit", "hard_to_see_through": "Kaum zu durchschauen", "splendid_animalform": "Prächtige Tiergestalt", "form_stability": "Stabilität der Form", "accustomed_form": "Gewohnte Gestalt", "harmonized_transformation": "Harmonisierte Verwandlung", "fighting_form": "Kämpfende Tiergestalt", "mighty_form": "Mächtige Tiergestalt", "magic_crafter1": "Magischer Handwerker I", "second_skin": "Zweite Haut", "eternal_form": "Ewige Form", "magic_crafter2": "Magischer Handwerker II", "master_of_objects": "Meister der Objekte", "flood_guider": "Flutenlenker", "cold_aura": "Kälteaura", "water_summoner": "Wasserbeschwörer", "icy_surrounding": "Eisige Umgebung", "friend_of_fishes": "Freund der Fische", "secrete_poison": "Gift ausscheiden", "master_icy_terrain": "Meister des eisigen Terrains", "overwhelming_tides": "Überwältigende Fluten", "wave_conqueror": "Wogenbezwinger", "conqueror_of_dryness": "Bezwinger der Trockenheit", "quencher_of_flames": "Ersticker der Flammen", "master_of_frost": "Herr der Kälte", "one_with_waves": "Eins mit den Wogen", "ally_of_fishes": "Verbündeter der Fische", "good_nose": "Spürnase", "fanned_by_wind": "Vom Winde umweht", "weatherproof": "Wetterfest", "wind_summoner": "Windbeschwörer", "whispering_wind": "Flüsternder Wind", "master_thunderstorms": "Gewittermeister", "deep_breath": "Langer Atem", "carried_by_wind": "Von den Winden getragen", "friend_of_the_sky": "Himmelsfreund", "flight_knowledge": "Flugkenntnis", "wings_of_the_storm": "Flügel des Sturms", "one_with_the_wind2": "Eins mit dem Wind", "free_breath": "Freier Atem", "ritual_lore_1": "Ritualkunde I", "ritual_connection": "Ritualband", "focus_theft": "Fokusdiebstahl", "ritual_lore_2": "Ritualkunde II", "ritual_lore_3": "Ritualkunde III", "versed_scrolluser": "Arkaner Schriftkundiger", "artifact_speeder": "Artefaktbeschleuniger", "artifact_stacking": "Artefaktstapelung", "artifact_prolonging": "Artefaktverlängerer", "create_talismans": "Talismane erstellen", "enhanced_anchor": "Verbesserte Verankerung", "scroll_expert": "Strukturgeber-Experte", "customized_artifacts": "Maßgeschneiderte Artefakte", "create_spellstore": "Zauberspeicher erstellen", "fast_spellstore_replenish": "Schneller Zauberspeicher-Auflader", "spellstore_replenish": "Zauberspeicher aufladen", "higher_artifactmaster": "Höherer Artefaktmagier", "fast_undead": "Flinke Untote", "master_abnormities": "Meister der Abnormitäten", "graceful_skeleton": "Skelett und Grazie", "dancing_dead": "Totentanz", "hard_to_banish": "Kaum zu bannen", "spontaneous_graverobbery": "Spontaner Grabraub", "undead_hordes": "Untote Horden", "undead_onslaught": "Untoter Ansturm", "rise": "Erhebt euch!", "corpseteacher": "Leichenlehrer", "master_undead_hordes": "Herr der untoten Scharen", "service_expert": "Dienstexperte", "healing_beings": "Heilende Wesen", "helpful_beings": "Hilfreiche Wesen", "combat_conjuror": "Kampfbeschwörer", "fighting_beings": "Kämpfende Wesen", "combatcasting_beings": "Kampfzaubernde Wesen", "scouting_beings": "Kundschaftende Wesen", "protecting_beings": "Schützende Wesen", "powerful_conjuror": "Starker Beschwörer", "transporting_beings_1": "Transportierende Wesen I", "lore_of_beings": "Wesenskenntnis", "casting_beings": "Zaubernde Wesen", "transporting_beings_2": "Transportierende Wesen II", "promising_conjuror": "Vielversprechender Beschwörer", "excellent_conjuror": "Herausragender Beschwörer", "transporting_beings_3": "Transportierende Wesen III", "arcane_overload": "Arkane Überladung", "complex_commands": "Komplexe Golembefehle", "personal_synchronisation": "Persönliche Synchronisierung", "spontaneous_instruction": "Spontane Unterweisung", "designer": "Konstrukteur", "adaptive_designer": "Adaptiver Konstrukteur", "binding_animation": "Bindende Animierung", "restoration": "Restaurierung" };
    if (termToTranslate in ressources) {
        return ressources[termToTranslate];
    } else if (termToTranslate in apprenticeships) {
        return apprenticeships[termToTranslate];
    } else if (termToTranslate in cultures) {
        return cultures[termToTranslate];
    } else if (termToTranslate in origins) {
        return origins[termToTranslate];
    } else if (termToTranslate in races) {
        return races[termToTranslate];
    } else if (termToTranslate in splinters) {
        return splinters[termToTranslate];
    } else if (termToTranslate in abilities) {
        return abilities[termToTranslate];
    } else if (termToTranslate in skills) {
        return skills[termToTranslate];
    } else if (termToTranslate in spells1) {
        return spells1[termToTranslate];
    } else if (termToTranslate in spells2) {
        return spells2[termToTranslate];
    } else if (termToTranslate in spells3) {
        return spells3[termToTranslate];
    } else if (termToTranslate in spells4) {
        return spells4[termToTranslate];
    } else if (termToTranslate in masteries1) {
        return masteries1[termToTranslate];
    } else if (termToTranslate in masteries2) {
        return masteries2[termToTranslate];
    } else if (termToTranslate in masteries3) {
        return masteries3[termToTranslate];
    } else if (termToTranslate in masteries4) {
        return masteries4[termToTranslate];
    } else if (termToTranslate in masteries5) {
        return masteries5[termToTranslate];
    } else if (termToTranslate in masteries6) {
        return masteries6[termToTranslate];
    } else if (termToTranslate in backgrounds) {
        return backgrounds[termToTranslate];
    } else {
        return termToTranslate;
    }
}

on("change:nsctemplate", function (eventInfo) {
    getAttrs(["nsctemplate"], function (v) {
        createNSCFromTemplate(v.nsctemplate);
    });
});

function createNSCFromTemplate(template) {
    var newrowid = generateRowID();
    var newrowattrs = {};
    var weaponnames = {};
    var weaponskills = {};
    var weaponspeed = {};
    var weapondamage1 = {};
    var weapondamage2 = {};
    var weapondamage3 = {};
    var weaponini = {};
    var weaponattributes = {};
    var masterynames = {};
    var masteryskills = {};
    var masterylevels = {};
    var spellnames = {};
    var spellschools = {};
    var spelldiffs = {};
    var spellcosts = {};
    var spelldurations = {};
    var spellranges = {};
    var spellimpactdurations = {};
    var spelllevels = {};
    var abilitynames = {};
    var abilitylevels = {};
    var featurenames = {};
    var featurelevels = {};
    setAttrs({ "namensc": "", "ausstrahlungnsc": 0, "beweglichkeitnsc": 0, "intuitionnsc": 0, "konstitutionnsc": 0, "mystiknsc": 0, "staerkensc": 0, "verstandnsc": 0, "willenskraftnsc": 0, "groessenklassensc": 5, "geschwindigkeitnsc": 0, "lebenspunktensc": 0, "fokusnscgesamt": 0, "verteidigungnsc": 0, "schadensreduktionnsc": 0, "koerperlicherwiderstandnsc": 0, "geistigerwiderstandnsc": 0, "lpnscgesamt": 0, "nschealth": 5, "schmerzimmunnsc": 0, "initiativensc": 1 });
    getSectionIDs("repeating_waffennsc", function (idarray) {
        for (var i = 0; i < idarray.length; i++) {
            removeRepeatingRow("repeating_waffennsc_" + idarray[i]);
        }
    });
    getSectionIDs("repeating_meisterschaftennsc", function (idarray) {
        for (var i = 0; i < idarray.length; i++) {
            removeRepeatingRow("repeating_meisterschaftennsc_" + idarray[i]);
        }
    });
    getSectionIDs("repeating_zaubernsc", function (idarray) {
        for (var i = 0; i < idarray.length; i++) {
            removeRepeatingRow("repeating_zaubernsc_" + idarray[i]);
        }
    });
    getSectionIDs("repeating_fertigkeitennsc", function (idarray) {
        for (var i = 0; i < idarray.length; i++) {
            removeRepeatingRow("repeating_fertigkeitennsc_" + idarray[i]);
        }
    });
    getSectionIDs("repeating_merkmalensc", function (idarray) {
        for (var i = 0; i < idarray.length; i++) {
            removeRepeatingRow("repeating_merkmalensc_" + idarray[i]);
        }
    });
    switch (template) {
        case ("baumwandler"):
            setAttrs({ "namensc": "Baumwandler", "ausstrahlungnsc": 4, "beweglichkeitnsc": 2, "intuitionnsc": 3, "konstitutionnsc": 8, "mystiknsc": 4, "staerkensc": 9, "verstandnsc": 3, "willenskraftnsc": 4, "groessenklassensc": 7, "geschwindigkeitnsc": 8, "lebenspunktensc": 15, "fokusnscgesamt": 16, "verteidigungnsc": 29, "schadensreduktionnsc": 4, "koerperlicherwiderstandnsc": 33, "geistigerwiderstandnsc": 27, "lpnscgesamt": 75, "nschealth": 5, "schmerzimmunnsc": 0, "initiativensc": 7 });
            weaponnames = ["Körper"];
            weaponskills = [22];
            weaponspeed = [13];
            weapondamage1 = [3];
            weapondamage2 = ["d6"];
            weapondamage3 = [4];
            weaponini = [7];
            weaponattributes = ["Umklammern, Wuchtig"];
            masterynames = ["Umklammern", "Vorstürmen", "Würgegriff", "Lied der Natur"];
            masteryskills = ["Handgemenge", "Handgemenge", "Handgemenge", "Naturmagie"];
            masterylevels = [1, 1, 3, 1];
            spellnames = ["Rindenhaut", "Wachstum", "Ranken", "Spurlos in der Wildnis"];
            spellschools = ["natur", "natur", "natur", "natur"];
            spelldiffs = [18, 18, 21, 21];
            spellcosts = ["K4V1", "4V1", "K8V2", "K8V2"];
            spelldurations = [3, 3, 8, 8];
            spellranges = ["Zauberer", "5m", "10m", "Zauberer"];
            spellimpactdurations = ["kan.", "-", "kan.", "kan."];
            spelllevels = [13, 13, 13, 13];
            abilitynames = ["Akrobatik", "Athletik", "Entschlossenheit", "Heimlichkeit", "Wahrnehmung", "Zähigkeit", "Naturmagie"];
            abilitylevels = [11, 15, 16, 7, 11, 23, 13];
            featurenames = ["Dämmersicht", "Feenblut", "Giftimmunität", "Schmerzresistenz", "Taktiker", "Verwundbarkeit gegen Feuerschaden"];
            featurelevels = [1, 1, 1, 1, 1, 1];
            break;
        case ("daemmerweide"):
            setAttrs({ "namensc": "Dämmerweide", "ausstrahlungnsc": 2, "beweglichkeitnsc": 1, "intuitionnsc": 2, "konstitutionnsc": 9, "mystiknsc": 0, "staerkensc": 9, "verstandnsc": 0, "willenskraftnsc": 5, "groessenklassensc": 9, "geschwindigkeitnsc": 0, "lebenspunktensc": 18, "fokusnscgesamt": 10, "verteidigungnsc": 27, "schadensreduktionnsc": 8, "koerperlicherwiderstandnsc": 38, "geistigerwiderstandnsc": 24, "lpnscgesamt": 90, "nschealth": 5, "schmerzimmunnsc": 1, "initiativensc": 8 });
            weaponnames = ["Ranken"];
            weaponskills = [24];
            weaponspeed = [12];
            weapondamage1 = [4];
            weapondamage2 = ["d6"];
            weapondamage3 = [2];
            weaponini = [8];
            weaponattributes = ["Umklammern, Wuchtig"];
            masterynames = ["Umklammern", "Umreißen (Schwierigkeit 23)", "Würgegriff"];
            masteryskills = ["Handgemenge", "Handgemenge", "Handgemenge"];
            masterylevels = [1, 1, 3];
            abilitynames = ["Entschlossenheit", "Wahrnehmung", "Zähigkeit"];
            abilitylevels = [15, 7, 25];
            featurenames = ["Betäubungsimmunität", "Dämmersicht", "Furchterregend", "Giftimmunität", "Koloss (Ranken)", "Schmerzimmunität", "Verwundbarkeit gegen Feuerschaden", "Verwundbarkeit gegen Lichtschaden"];
            featurelevels = [1, 1, 25, 1, 2, 1, 1, 1];
            break;
        case ("dryade"):
            setAttrs({ "namensc": "Dryade", "ausstrahlungnsc": 5, "beweglichkeitnsc": 3, "intuitionnsc": 5, "konstitutionnsc": 2, "mystiknsc": 5, "staerkensc": 3, "verstandnsc": 3, "willenskraftnsc": 4, "groessenklassensc": 5, "geschwindigkeitnsc": 8, "lebenspunktensc": 7, "fokusnscgesamt": 23, "verteidigungnsc": 25, "schadensreduktionnsc": 3, "koerperlicherwiderstandnsc": 23, "geistigerwiderstandnsc": 29, "lpnscgesamt": 35, "nschealth": 5, "schmerzimmunnsc": 0, "initiativensc": 2 });
            weaponnames = ["Körper"];
            weaponskills = [16];
            weaponspeed = [7];
            weapondamage1 = [1];
            weapondamage2 = ["d6"];
            weapondamage3 = [2];
            weaponini = [2];
            weaponattributes = ["-"];
            masterynames = ["Überraschungsangriff 1", "Lied der Natur"];
            masteryskills = ["Handgemenge", "Naturmagie"];
            masterylevels = [1, 1];
            spellnames = ["Rindenhaut", "Wachstum", "Ranken", "Tiere beherrschen", "Chamäleon", "Insektenschwarm"];
            spellschools = ["natur", "natur", "natur", "natur", "natur", "natur"];
            spelldiffs = ["18", "18", "21", "GW", "24", "24"];
            spellcosts = ["K4V1", "4V1", "K8V2", "K8V2", "K12V3", "12V3"];
            spelldurations = [3, 3, 8, 6, 9, 12];
            spellranges = ["Zauberer", "5m", "10m", "5m", "Zauberer", "10m"];
            spellimpactdurations = ["kan.", "-", "kan.", "kan.", "kan.", "5 Minuten"];
            spelllevels = [19, 19, 19, 19, 19, 19];
            abilitynames = ["Akrobatik", "Athletik", "Entschlossenheit", "Heimlichkeit", "Wahrnehmung", "Zähigkeit", "Naturmagie"];
            abilitylevels = [11, 10, 14, 16, 13, 10, 19];
            featurenames = ["Dämmersicht", "Feenblut", "Taktiker", "Verwundbarkeit gegen Feuerschaden"];
            featurelevels = [1, 1, 1, 1];
            break;
        case ("duesterfee"):
            setAttrs({ "namensc": "Düsterfee", "ausstrahlungnsc": 7, "beweglichkeitnsc": 3, "intuitionnsc": 3, "konstitutionnsc": 1, "mystiknsc": 6, "staerkensc": 1, "verstandnsc": 5, "willenskraftnsc": 5, "groessenklassensc": 5, "geschwindigkeitnsc": 8, "lebenspunktensc": 6, "fokusnscgesamt": 52, "verteidigungnsc": 23, "schadensreduktionnsc": 0, "koerperlicherwiderstandnsc": 19, "geistigerwiderstandnsc": 31, "lpnscgesamt": 18, "nschealth": 3, "schmerzimmunnsc": 0, "initiativensc": 7 });
            masterynames = ["Eiserner Wille", "Leisetreter", "Willensbrecher", "Materielle Verbindung 1", "Trübung des Blickes", "Blick in die Dunkelheit"];
            masteryskills = ["Entschlossenheit", "Heimlichkeit", "Beherrschungsmagie", "Beherrschungsmagie", "Illusionsmagie", "Schattenmagie"];
            masterylevels = [1, 1, 1, 2, 1, 1];
            spellnames = ["Furcht", "Verstummen", "Magische Fessel", "Schlaf", "Halluzination", "Lähmung", "Geräuschhexerei", "Magische Finte", "Stille", "Blenden", "Kreischen", "Trugbild", "Rindenhaut", "Tiere beherrschen", "Dunkelheit", "Schattenmantel", "Schattenpfeil", "Verhüllung"];
            spellschools = ["beherrschung", "beherrschung", "beherrschung", "beherrschung", "beherrschung", "beherrschung", "illusion", "illusion", "illusion", "illusion", "illusion", "illusion", "natur", "natur", "schatten", "schatten", "schatten", "schatten"];
            spelldiffs = ["GW", "GW", "GW", "GW", "GW", "KW", 15, 18, 18, "KW", 21, 21, 18, "GW", 18, 18, "VTD", 21];
            spellcosts = ["4V1", "K4V1", "K8V2", "8V2", "K12V3", "K8V2", "1", "4V1", "K4V1", "4V1", "8V2", "K8V2", "K4V1", "K8V2", "K4V1", "K4V1", "6V2", "K8V2"];
            spelldurations = [4, 3, 4, 6, 14, 7, 4, 4, 1, 3, 9, 6, 3, 6, 1, 1, 7, 4];
            spellranges = ["5m", "5m", "10m", "5m", "10m", "10m", "10m", "10m", "Zauberer", "5m", "Zauberer", "5m", "Zauberer", "5m", "Zauberer", "Zauberer", "10m", "Zauberer"];
            spellimpactdurations = ["60 Ticks", "kan.", "kan.", "-", "kan.", "kan.", "-", "kan.", "kan.", "-", "kan.", "kan.", "kan.", "kan.", "kan.", "kan.", "-", "kan."];
            spelllevels = [21, 21, 21, 21, 21, 21, 18, 18, 18, 18, 18, 18, 17, 17, 16, 16, 16, 16];
            abilitynames = ["Akrobatik", "Athletik", "Entschlossenheit", "Heimlichkeit", "Wahrnehmung", "Zähigkeit", "Beherrschungsmagie", "Illusionsmagie", "Naturmagie", "Schattenmagie"];
            abilitylevels = [9, 4, 18, 13, 13, 6, 21, 18, 17, 16];
            featurenames = ["Dämmersicht", "Feenblut", "Fliegend", "Furchterregend", "Konzentrationsstärke", "Resistenz gegen Schattenschaden", "Schwächlich", "Taktiker", "Verwundbarkeit gegen Lichtschaden"];
            featurelevels = [1, 1, 1, 15, 1, 4, 1, 1, 1];
            break;
        case ("felsling"):
            setAttrs({ "namensc": "Felsling", "ausstrahlungnsc": 2, "beweglichkeitnsc": 1, "intuitionnsc": 2, "konstitutionnsc": 4, "mystiknsc": 1, "staerkensc": 5, "verstandnsc": 2, "willenskraftnsc": 2, "groessenklassensc": 3, "geschwindigkeitnsc": 4, "lebenspunktensc": 7, "fokusnscgesamt": 6, "verteidigungnsc": 18, "schadensreduktionnsc": 2, "koerperlicherwiderstandnsc": 21, "geistigerwiderstandnsc": 15, "lpnscgesamt": 21, "nschealth": 3, "schmerzimmunnsc": 1, "initiativensc": 8 });
            weaponnames = ["Körper"];
            weaponskills = [9];
            weaponspeed = [10];
            weapondamage1 = [1];
            weapondamage2 = ["d6"];
            weapondamage3 = [2];
            weaponini = [8];
            weaponattributes = ["-"];
            abilitynames = ["Akrobatik", "Athletik", "Entschlossenheit", "Heimlichkeit", "Wahrnehmung", "Zähigkeit"];
            abilitylevels = [6, 8, 8, 3, 4, 11];
            featurenames = ["Betäubungsimmunität", "Feenblut", "Hitzeresistenz", "Kälteresistenz", "Kreatur", "Resistenz gegen Felsschaden", "Schmerzimmunität", "Schwächlich"];
            featurelevels = [1, 1, 3, 3, 5, 2, 1, 1];
            break;
        case ("feuerdjinn"):
            setAttrs({ "namensc": "Feuerdjinn", "ausstrahlungnsc": 3, "beweglichkeitnsc": 5, "intuitionnsc": 3, "konstitutionnsc": 4, "mystiknsc": 5, "staerkensc": 5, "verstandnsc": 3, "willenskraftnsc": 4, "groessenklassensc": 5, "geschwindigkeitnsc": 8, "lebenspunktensc": 9, "fokusnscgesamt": 28, "verteidigungnsc": 30, "schadensreduktionnsc": 1, "koerperlicherwiderstandnsc": 32, "geistigerwiderstandnsc": 28, "lpnscgesamt": 45, "nschealth": 5, "schmerzimmunnsc": 0, "initiativensc": 7 });
            weaponnames = ["Körper"];
            weaponskills = [20];
            weaponspeed = [8];
            weapondamage1 = [1];
            weapondamage2 = ["d6"];
            weapondamage3 = [5];
            weaponini = [7];
            weaponattributes = ["-"];
            masterynames = ["Flammenherz", "Feuermeisterschaft", "Inferno"];
            masteryskills = ["Feuermagie", "Feuermagie", "Feuermagie"];
            masterylevels = [1, 2, 3];
            spellnames = ["Feuerstrahl", "Flammenherrschaft", "Metall erhitzen", "Flammenkegel", "Flammenschild", "Feuerball", "Flammenwand"];
            spellschools = ["feuer", "feuer", "feuer", "feuer", "feuer", "feuer", "feuer"];
            spelldiffs = ["VTD", 21, 21, 24, 24, 27, 27];
            spellcosts = ["5V2", "K8V2", "K8V2", "12V4", "K12V3", "15V5", "K16V4"];
            spelldurations = [8, 7, 5, 15, 9, 19, 15];
            spellranges = ["10m", "10m", "Berührung", "5m", "Zauberer", "25m", "5m"];
            spellimpactdurations = ["-", "kan.", "kan.", "-", "kan.", "-", "kan."];
            spelllevels = [21, 21, 21, 21, 21, 21, 21];
            abilitynames = ["Akrobatik", "Athletik", "Entschlossenheit", "Heimlichkeit", "Wahrnehmung", "Zähigkeit", "Feuermagie"];
            abilitylevels = [15, 14, 12, 8, 12, 14, 21];
            featurenames = ["Betäubungsimmunität", "Erschöpfungsresistenz", "Feenblut", "Fliegend", "Hitzeresistenz", "Resistenz gegen Feuerschaden", "Taktiker", "Verwundbarkeit gegen Wasserschaden"];
            featurelevels = [1, 2, 1, 1, 5, 15, 1, 1];
            break;
        case ("finsterschwinge"):
            setAttrs({ "namensc": "Finsterschwinge", "ausstrahlungnsc": 0, "beweglichkeitnsc": 5, "intuitionnsc": 3, "konstitutionnsc": 3, "mystiknsc": 0, "staerkensc": 5, "verstandnsc": 1, "willenskraftnsc": 3, "groessenklassensc": 5, "geschwindigkeitnsc": 2, "lebenspunktensc": 8, "fokusnscgesamt": 6, "verteidigungnsc": 27, "schadensreduktionnsc": 2, "koerperlicherwiderstandnsc": 31, "geistigerwiderstandnsc": 22, "lpnscgesamt": 40, "nschealth": 5, "schmerzimmunnsc": 0, "initiativensc": 7 });
            weaponnames = ["Körper"];
            weaponskills = [18];
            weaponspeed = [7];
            weapondamage1 = [1];
            weapondamage2 = ["d6"];
            weapondamage3 = [4];
            weaponini = [7];
            weaponattributes = ["Durchdringung 2, Umklammern"];
            abilitynames = ["Akrobatik", "Athletik", "Entschlossenheit", "Heimlichkeit", "Wahrnehmung", "Zähigkeit"];
            abilitylevels = [14, 12, 6, 17, 11, 11];
            featurenames = ["Dunkelsicht", "Fliegend", "Furchterregend", "Gift (Blut 3 / Sterbend 2 / 3 Tage)"];
            featurelevels = [1, 1, 20, 1];
            break;
        case ("flimmerfee"):
            setAttrs({ "namensc": "Flimmerfee", "ausstrahlungnsc": 4, "beweglichkeitnsc": 4, "intuitionnsc": 3, "konstitutionnsc": 1, "mystiknsc": 3, "staerkensc": 0, "verstandnsc": 3, "willenskraftnsc": 1, "groessenklassensc": 1, "geschwindigkeitnsc": 4, "lebenspunktensc": 2, "fokusnscgesamt": 13, "verteidigungnsc": 22, "schadensreduktionnsc": 0, "koerperlicherwiderstandnsc": 12, "geistigerwiderstandnsc": 18, "lpnscgesamt": 6, "nschealth": 3, "schmerzimmunnsc": 0, "initiativensc": 7 });
            masterynames = ["Schutz des Lichtes"];
            masteryskills = ["Lichtmagie"];
            masterylevels = [2];
            abilitynames = ["Akrobatik", "Athletik", "Entschlossenheit", "Heimlichkeit", "Wahrnehmung", "Zähigkeit", "Lichtmagie"];
            abilitylevels = [12, 4, 5, 12, 9, 2, 12];
            featurenames = ["Feenblut", "Fliegend", "Kreatur", "Resistenz gegen Lichtschaden", "Schwächlich", "Taktiker", "Verwundbarkeit gegen Kälteschaden", "Verwundbarkeit gegen Schattenschaden"];
            featurelevels = [1, 1, 6, 4, 1, 1, 1, 1];
            break;
        case ("gargyl"):
            setAttrs({ "namensc": "Gargyl", "ausstrahlungnsc": 2, "beweglichkeitnsc": 2, "intuitionnsc": 3, "konstitutionnsc": 5, "mystiknsc": 1, "staerkensc": 5, "verstandnsc": 2, "willenskraftnsc": 4, "groessenklassensc": 5, "geschwindigkeitnsc": 4, "lebenspunktensc": 10, "fokusnscgesamt": 10, "verteidigungnsc": 28, "schadensreduktionnsc": 7, "koerperlicherwiderstandnsc": 40, "geistigerwiderstandnsc": 24, "lpnscgesamt": 50, "nschealth": 5, "schmerzimmunnsc": 1, "initiativensc": 7 });
            weaponnames = ["Körper"];
            weaponskills = [19];
            weaponspeed = [10];
            weapondamage1 = [2];
            weapondamage2 = ["d6"];
            weapondamage3 = [6];
            weaponini = [7];
            weaponattributes = ["Durchdringung 3"];
            masterynames = ["Umreißen", "Vorstürmen", "Rundumschlag"];
            masteryskills = ["Handgemenge", "Handgemenge", "Handgemenge"];
            masterylevels = [1, 1, 2];
            abilitynames = ["Akrobatik", "Athletik", "Entschlossenheit", "Heimlichkeit", "Wahrnehmung", "Zähigkeit"];
            abilitylevels = [9, 12, 10, 9, 11, 14];
            featurenames = ["Betäubungsimmunität", "Dunkelsicht", "Erschöpfungsresistenz", "Fliegend", "Giftimmunität", "Resistenz gegen Felsschaden", "Schmerzimmunität"];
            featurelevels = [1, 1, 4, 1, 1, 5, 1];
            break;
        case ("geisterhafterkrieger"):
            setAttrs({ "namensc": "Geisterhafter Krieger", "ausstrahlungnsc": 2, "beweglichkeitnsc": 3, "intuitionnsc": 2, "konstitutionnsc": 2, "mystiknsc": 1, "staerkensc": 4, "verstandnsc": 1, "willenskraftnsc": 5, "groessenklassensc": 5, "geschwindigkeitnsc": 8, "lebenspunktensc": 7, "fokusnscgesamt": 12, "verteidigungnsc": 24, "schadensreduktionnsc": 6, "koerperlicherwiderstandnsc": 23, "geistigerwiderstandnsc": 25, "lpnscgesamt": 35, "nschealth": 5, "schmerzimmunnsc": 1, "initiativensc": 8 });
            weaponnames = ["Körper", "Langschwert"];
            weaponskills = [13, 17];
            weaponspeed = [5, 8];
            weapondamage1 = [1, 1];
            weapondamage2 = ["d6", "d6"];
            weapondamage3 = [0, 4];
            weaponini = [8, 8];
            weaponattributes = ["-", "Scharf 2"];
            masterynames = ["Ausfall", "Kühler Kopf 1", "Unbeirrbar"];
            masteryskills = ["Klingenwaffen", "Entschlossenheit", "Entschlossenheit"];
            masterylevels = [1, 1, 1];
            abilitynames = ["Akrobatik", "Athletik", "Entschlossenheit", "Heimlichkeit", "Wahrnehmung", "Zähigkeit"];
            abilitylevels = [7, 9, 12, 13, 9, 15];
            featurenames = ["Betäubungsimmunität", "Dunkelsicht", "Erschöpfungsresistenz", "Furchterregend", "Geist", "Giftimmunität", "Körperlos", "Schmerzimmunität"];
            featurelevels = [1, 1, 3, 15, 1, 1, 1, 1];
            break;
        case ("geisterwolf"):
            setAttrs({ "namensc": "Geisterwolf", "ausstrahlungnsc": 2, "beweglichkeitnsc": 4, "intuitionnsc": 5, "konstitutionnsc": 4, "mystiknsc": 0, "staerkensc": 6, "verstandnsc": 1, "willenskraftnsc": 3, "groessenklassensc": 6, "geschwindigkeitnsc": 14, "lebenspunktensc": 10, "fokusnscgesamt": 6, "verteidigungnsc": 28, "schadensreduktionnsc": 1, "koerperlicherwiderstandnsc": 25, "geistigerwiderstandnsc": 23, "lpnscgesamt": 50, "nschealth": 5, "schmerzimmunnsc": 0, "initiativensc": 5 });
            weaponnames = ["Körper"];
            weaponskills = [20];
            weaponspeed = [8];
            weapondamage1 = [2];
            weapondamage2 = ["d6"];
            weapondamage3 = [5];
            weaponini = [5];
            weaponattributes = ["Scharf 2"];
            masterynames = ["Umreißen (Schwierigkeit 20)", "Vorstürmen", "Flinker Verfolger", "Unermüdlicher Verfolger", "Schmerzwiderstand 1"];
            masteryskills = ["Handgemenge", "Handgemenge", "Athletik", "Jagdkunst", "Zähigkeit"];
            masterylevels = [1, 1, 2, 1, 2];
            abilitynames = ["Akrobatik", "Athletik", "Entschlossenheit", "Heimlichkeit", "Jagdkunst", "Wahrnehmung", "Zähigkeit"];
            abilitylevels = [11, 17, 9, 13, 24, 21, 12];
            featurenames = ["Dämmersicht", "Erschöpfungsresistenz", "Furchterregend", "Kälteresistenz", "Taktiker"];
            featurelevels = [1, 3, 15, 2, 1];
            break;
        case ("ghul"):
            setAttrs({ "namensc": "Ghul", "ausstrahlungnsc": 0, "beweglichkeitnsc": 3, "intuitionnsc": 1, "konstitutionnsc": 3, "mystiknsc": 0, "staerkensc": 4, "verstandnsc": 2, "willenskraftnsc": 3, "groessenklassensc": 5, "geschwindigkeitnsc": 8, "lebenspunktensc": 8, "fokusnscgesamt": 6, "verteidigungnsc": 22, "schadensreduktionnsc": 0, "koerperlicherwiderstandnsc": 24, "geistigerwiderstandnsc": 18, "lpnscgesamt": 40, "nschealth": 5, "schmerzimmunnsc": 0, "initiativensc": 9 });
            weaponnames = ["Körper"];
            weaponskills = [15];
            weaponspeed = [6];
            weapondamage1 = [1];
            weapondamage2 = ["d6"];
            weapondamage3 = [2];
            weaponini = [9];
            weaponattributes = ["Durchdringung 1"];
            masterynames = ["Hinterhalt"];
            masteryskills = ["Heimlichkeit"];
            masterylevels = [2];
            abilitynames = ["Akrobatik", "Athletik", "Entschlossenheit", "Heimlichkeit", "Wahrnehmung", "Zähigkeit"];
            abilitylevels = [7, 9, 4, 9, 4, 10];
            featurenames = ["Dämmersicht", "Furchterregend", "Gift (Blut 3 / Benommen / 60 Ticks)", "Schmerzresistenz", "Untot", "Verwundbarkeit gegen Lichtschaden"];
            featurelevels = [1, 15, 1, 1, 1, 1];
            break;
        case ("grabbeisser"):
            setAttrs({ "namensc": "Grabbeißer", "ausstrahlungnsc": 0, "beweglichkeitnsc": 3, "intuitionnsc": 3, "konstitutionnsc": 3, "mystiknsc": 0, "staerkensc": 3, "verstandnsc": 0, "willenskraftnsc": 1, "groessenklassensc": 4, "geschwindigkeitnsc": 7, "lebenspunktensc": 7, "fokusnscgesamt": 2, "verteidigungnsc": 18, "schadensreduktionnsc": 3, "koerperlicherwiderstandnsc": 16, "geistigerwiderstandnsc": 13, "lpnscgesamt": 21, "nschealth": 3, "schmerzimmunnsc": 0, "initiativensc": 7 });
            weaponnames = ["Körper"];
            weaponskills = [10];
            weaponspeed = [8];
            weapondamage1 = [1];
            weapondamage2 = ["d6"];
            weapondamage3 = [2];
            weaponini = [7];
            weaponattributes = ["-"];
            masterynames = ["Kletteraffe", "Freikletterer"];
            masteryskills = ["Athletik", "Athletik"];
            masterylevels = [1, 3];
            abilitynames = ["Akrobatik", "Athletik", "Entschlossenheit", "Heimlichkeit", "Wahrnehmung", "Zähigkeit"];
            abilitylevels = [6, 10, 2, 7, 9, 5];
            featurenames = ["Dunkelsicht", "Gift (Blut 1 / Benommen / 60 Ticks)", "Kreatur", "Schwächlich"];
            featurelevels = [1, 1, 3, 1];
            break;
        case ("harpyie"):
            setAttrs({ "namensc": "Harpyie", "ausstrahlungnsc": 1, "beweglichkeitnsc": 4, "intuitionnsc": 2, "konstitutionnsc": 2, "mystiknsc": 0, "staerkensc": 3, "verstandnsc": 2, "willenskraftnsc": 2, "groessenklassensc": 5, "geschwindigkeitnsc": 6, "lebenspunktensc": 7, "fokusnscgesamt": 4, "verteidigungnsc": 22, "schadensreduktionnsc": 0, "koerperlicherwiderstandnsc": 19, "geistigerwiderstandnsc": 18, "lpnscgesamt": 35, "nschealth": 5, "schmerzimmunnsc": 0, "initiativensc": 8 });
            weaponnames = ["Körper"];
            weaponskills = [13];
            weaponspeed = [7];
            weapondamage1 = [1];
            weapondamage2 = ["d6"];
            weapondamage3 = [3];
            weaponini = [8];
            weaponattributes = ["Scharf 2, Umklammern"];
            masterynames = ["Umklammern"];
            masteryskills = ["Handgemenge"];
            masterylevels = [1];
            abilitynames = ["Akrobatik", "Athletik", "Entschlossenheit", "Heimlichkeit", "Wahrnehmung", "Zähigkeit"];
            abilitylevels = [11, 8, 7, 6, 9, 6];
            featurenames = ["Fliegend", "Furchterregend", "Kreatur"];
            featurelevels = [1, 10, 6];
            break;
        case ("hydra"):
            setAttrs({ "namensc": "Hydra", "ausstrahlungnsc": 2, "beweglichkeitnsc": 6, "intuitionnsc": 3, "konstitutionnsc": 9, "mystiknsc": 0, "staerkensc": 10, "verstandnsc": 1, "willenskraftnsc": 5, "groessenklassensc": 8, "geschwindigkeitnsc": 12, "lebenspunktensc": 17, "fokusnscgesamt": 10, "verteidigungnsc": 38, "schadensreduktionnsc": 4, "koerperlicherwiderstandnsc": 45, "geistigerwiderstandnsc": 30, "lpnscgesamt": 85, "nschealth": 5, "schmerzimmunnsc": 0, "initiativensc": 7 });
            weaponnames = ["Körper"];
            weaponskills = [28];
            weaponspeed = [10];
            weapondamage1 = [3];
            weapondamage2 = ["d6"];
            weapondamage3 = [2];
            weaponini = [7];
            weaponattributes = ["Durchdringung 1, Lange Waffe, Wuchtig"];
            masterynames = ["Umreißen (Schwierigkeit 25)", "Vorstürmen", "Rundumschlag", "Schmerzwiderstand 1"];
            masteryskills = ["Handgemenge", "Handgemenge", "Handgemenge", "Zähigkeit"];
            masterylevels = [1, 1, 2, 2];
            abilitynames = ["Akrobatik", "Athletik", "Entschlossenheit", "Heimlichkeit", "Wahrnehmung", "Zähigkeit"];
            abilitylevels = [16, 26, 10, 3, 9, 23];
            featurenames = ["Furchterregend", "Gift (Blut 3 / Sterbend 3 / 45 Ticks)", "Hitzeresistenz", "Koloss (3 Köpfe)", "Schmerzresistenz"];
            featurelevels = [25, 1, 1, 3, 1];
            break;
        case ("oger"):
            setAttrs({ "namensc": "Oger", "ausstrahlungnsc": 1, "beweglichkeitnsc": 3, "intuitionnsc": 1, "konstitutionnsc": 8, "mystiknsc": 0, "staerkensc": 7, "verstandnsc": 1, "willenskraftnsc": 3, "groessenklassensc": 7, "geschwindigkeitnsc": 10, "lebenspunktensc": 15, "fokusnscgesamt": 6, "verteidigungnsc": 28, "schadensreduktionnsc": 2, "koerperlicherwiderstandnsc": 27, "geistigerwiderstandnsc": 19, "lpnscgesamt": 75, "nschealth": 5, "schmerzimmunnsc": 0, "initiativensc": 9 });
            weaponnames = ["Körper", "Kriegshammer"];
            weaponskills = [16, 20];
            weaponspeed = [7, 12];
            weapondamage1 = [1, 2];
            weapondamage2 = ["d6", "d10"];
            weapondamage3 = [2, 4];
            weaponini = [9, 9];
            weaponattributes = ["Wuchtig", "Unhandlich, Wuchtig, Zweihändig"];
            masterynames = ["Umreißen (Schwierigkeit 20)", "Rundumschlag", "Schmetterschlag", "Schmerzwiderstand 1"];
            masteryskills = ["Hiebwaffen", "Hiebwaffen", "Hiebwaffen", "Zähigkeit"];
            masterylevels = [1, 2, 2, 2];
            abilitynames = ["Akrobatik", "Athletik", "Entschlossenheit", "Heimlichkeit", "Wahrnehmung", "Zähigkeit"];
            abilitylevels = [10, 16, 8, 4, 6, 25];
            featurenames = ["Dämmersicht", "Erschöpfungsresistenz", "Schmerzresistenz"];
            featurelevels = [1, 2, 1];
            break;
        case ("orkkrieger"):
            setAttrs({ "namensc": "Orkkrieger", "ausstrahlungnsc": 1, "beweglichkeitnsc": 3, "intuitionnsc": 2, "konstitutionnsc": 5, "mystiknsc": 2, "staerkensc": 6, "verstandnsc": 2, "willenskraftnsc": 5, "groessenklassensc": 5, "geschwindigkeitnsc": 8, "lebenspunktensc": 10, "fokusnscgesamt": 14, "verteidigungnsc": 22, "schadensreduktionnsc": 1, "koerperlicherwiderstandnsc": 24, "geistigerwiderstandnsc": 19, "lpnscgesamt": 50, "nschealth": 5, "schmerzimmunnsc": 0, "initiativensc": 8 });
            weaponnames = ["Körper", "Streitkolben"];
            weaponskills = [12, 16];
            weaponspeed = [6, 9];
            weapondamage1 = [1, 1];
            weapondamage2 = ["d6", "d6"];
            weapondamage3 = [1, 5];
            weaponini = [8, 8];
            weaponattributes = ["-", "-"];
            masterynames = ["Berseker", "Vorstürmen", "Rundumschlag", "Schmetterschlag", "Schmerzwiderstand 1"];
            masteryskills = ["Hiebwaffen", "Hiebwaffen", "Hiebwaffen", "Hiebwaffen", "Zähigkeit"];
            masterylevels = [1, 1, 2, 2, 2];
            spellnames = ["Lebenskraft stärken", "Schmerzen widerstehen"];
            spellschools = ["staerkung", "staerkung"];
            spelldiffs = [21, 21];
            spellcosts = ["K8V2", "K8V2"];
            spelldurations = [4, 4];
            spellranges = ["Zauberer", "Zauberer"];
            spellimpactdurations = ["kan.", "kan."];
            spelllevels = [12, 12];
            abilitynames = ["Akrobatik", "Athletik", "Entschlossenheit", "Heimlichkeit", "Wahrnehmung", "Zähigkeit", "Stärkungsmagie"];
            abilitylevels = [9, 14, 9, 9, 12, 19, 12];
            featurenames = ["Dämmersicht", "Erschöpfungsresistenz", "Taktiker"];
            featurelevels = [1, 1, 1];
            break;
        case ("orkspaeher"):
            setAttrs({ "namensc": "Orkspäher", "ausstrahlungnsc": 1, "beweglichkeitnsc": 4, "intuitionnsc": 3, "konstitutionnsc": 2, "mystiknsc": 3, "staerkensc": 3, "verstandnsc": 3, "willenskraftnsc": 2, "groessenklassensc": 3, "geschwindigkeitnsc": 9, "lebenspunktensc": 5, "fokusnscgesamt": 10, "verteidigungnsc": 18, "schadensreduktionnsc": 0, "koerperlicherwiderstandnsc": 15, "geistigerwiderstandnsc": 15, "lpnscgesamt": 15, "nschealth": 3, "schmerzimmunnsc": 0, "initiativensc": 7 });
            weaponnames = ["Körper", "Kurzbogen", "Säbel"];
            weaponskills = [8, 11, 9];
            weaponspeed = [5, 5, 8];
            weapondamage1 = [1, 1, 1];
            weapondamage2 = ["d6", "d10", "d6"];
            weapondamage3 = [0, 1, 4];
            weaponini = [7, 7, 7];
            weaponattributes = ["-", "Durchdringung 1, Scharf 2, Zweihändig", "Scharf 2"];
            masterynames = ["Scharfschütze", "Schnellschütze", "Flinker Verfolger", "Hinterhalt", "Unermüdlicher Verfolger"];
            masteryskills = ["Schusswaffen", "Schusswaffen", "Athletik", "Heimlichkeit", "Jagdkunst"];
            masterylevels = [1, 1, 2, 2, 1];
            spellnames = ["Sicht verbessern", "Beschleunigen"];
            spellschools = ["staerkung", "staerkung"];
            spelldiffs = [18, 18];
            spellcosts = ["K4V1", "K4V1"];
            spelldurations = [1, 1];
            spellranges = ["Zauberer", "Zauberer"];
            spellimpactdurations = ["kan.", "kan."];
            spelllevels = [10, 10];
            abilitynames = ["Akrobatik", "Athletik", "Entschlossenheit", "Heimlichkeit", "Jagdkunst", "Wahrnehmung", "Zähigkeit", "Stärkungsmagie"];
            abilitylevels = [11, 12, 8, 16, 12, 18, 8, 10];
            featurenames = ["Dämmersicht", "Erschöpfungsresistenz", "Schwächlich", "Taktiker"];
            featurelevels = [1, 2, 1, 1];
            break;
        case ("rattling"):
            setAttrs({ "namensc": "Rattling", "ausstrahlungnsc": 1, "beweglichkeitnsc": 3, "intuitionnsc": 3, "konstitutionnsc": 2, "mystiknsc": 1, "staerkensc": 2, "verstandnsc": 2, "willenskraftnsc": 1, "groessenklassensc": 3, "geschwindigkeitnsc": 8, "lebenspunktensc": 5, "fokusnscgesamt": 4, "verteidigungnsc": 19, "schadensreduktionnsc": 0, "koerperlicherwiderstandnsc": 13, "geistigerwiderstandnsc": 13, "lpnscgesamt": 15, "nschealth": 3, "schmerzimmunnsc": 0, "initiativensc": 7 });
            weaponnames = ["Körper", "Säbel"];
            weaponskills = [8, 8];
            weaponspeed = [5, 8];
            weapondamage1 = [1, 1];
            weapondamage2 = ["d6", "d6"];
            weapondamage3 = [0, 4];
            weaponini = [7, 7];
            weaponattributes = ["Stumpf", "Scharf 2"];
            spellnames = ["Katzenaugen", "Schattenmantel"];
            spellschools = ["schatten", "schatten"];
            spelldiffs = [18, 18];
            spellcosts = ["K4V1", "K4V1"];
            spelldurations = [1, 1];
            spellranges = ["Zauberer", "Zauberer"];
            spellimpactdurations = ["kan.", "kan."];
            spelllevels = [7, 7];
            abilitynames = ["Akrobatik", "Athletik", "Entschlossenheit", "Heimlichkeit", "Wahrnehmung", "Zähigkeit", "Schattenmagie"];
            abilitylevels = [11, 7, 3, 11, 7, 3, 7];
            featurenames = ["Dämmersicht", "Feigling", "Kreatur", "Schwächlich"];
            featurelevels = [1, 1, 5, 1];
            break;
        case ("raeuber"):
            setAttrs({ "namensc": "Räuber", "ausstrahlungnsc": 2, "beweglichkeitnsc": 2, "intuitionnsc": 3, "konstitutionnsc": 2, "mystiknsc": 1, "staerkensc": 3, "verstandnsc": 2, "willenskraftnsc": 2, "groessenklassensc": 5, "geschwindigkeitnsc": 7, "lebenspunktensc": 7, "fokusnscgesamt": 6, "verteidigungnsc": 18, "schadensreduktionnsc": 0, "koerperlicherwiderstandnsc": 16, "geistigerwiderstandnsc": 16, "lpnscgesamt": 35, "nschealth": 5, "schmerzimmunnsc": 0, "initiativensc": 7 });
            weaponnames = ["Körper", "Streitkolben"];
            weaponskills = [8, 9];
            weaponspeed = [5, 9];
            weapondamage1 = [1, 1];
            weapondamage2 = ["d6", "d6"];
            weapondamage3 = [0, 5];
            weaponini = [7, 7];
            weaponattributes = ["Stumpf", "-"];
            masterynames = ["Überraschungsangriff 1"];
            masteryskills = ["Heimlichkeit"];
            masterylevels = [1];
            spellnames = ["Ausdauer stärken", "Gehör verbessern", "Sicht verbessern"];
            spellschools = ["staerkung", "staerkung", "staerkung"];
            spelldiffs = [15, 18, 18];
            spellcosts = ["K1", "K4V1", "K4V1"];
            spelldurations = [1, 1, 1];
            spellranges = ["Zauberer", "Zauberer", "Zauberer"];
            spellimpactdurations = ["kan.", "kan.", "kan."];
            spelllevels = [8, 8, 8];
            abilitynames = ["Akrobatik", "Athletik", "Entschlossenheit", "Heimlichkeit", "Wahrnehmung", "Zähigkeit", "Stärkungsmagie"];
            abilitylevels = [5, 7, 5, 11, 8, 7, 8];
            featurenames = ["Feigling", "Taktiker"];
            featurelevels = [1, 1];
            break;
        case ("raubritter"):
            setAttrs({ "namensc": "Raubritter", "ausstrahlungnsc": 3, "beweglichkeitnsc": 5, "intuitionnsc": 4, "konstitutionnsc": 5, "mystiknsc": 2, "staerkensc": 6, "verstandnsc": 2, "willenskraftnsc": 3, "groessenklassensc": 5, "geschwindigkeitnsc": 9, "lebenspunktensc": 11, "fokusnscgesamt": 15, "verteidigungnsc": 33, "schadensreduktionnsc": 4, "koerperlicherwiderstandnsc": 26, "geistigerwiderstandnsc": 23, "lpnscgesamt": 55, "nschealth": 5, "schmerzimmunnsc": 0, "initiativensc": 6 });
            weaponnames = ["Körper", "Lanze", "Langschwert"];
            weaponskills = [15, 20, 22];
            weaponspeed = [8, 18, 11];
            weapondamage1 = [1, 2, 1];
            weapondamage2 = ["d6", "d10", "d6"];
            weapondamage3 = [0, 1, 4];
            weaponini = [6, 6, 6];
            weaponattributes = ["Stumpf", "Lange Waffe, Reiterwaffe 6, Scharf 3, Wuchtig, Zweihändig", "Scharf 2"];
            masterynames = ["Ausfall", "Verteidigungswirbel", "Entwaffnen (Schwierigkeit 31)", "Gezielte Treffer", "Vorstürmen", "Rundumschlag", "Herausforderung", "Sammeln", "Reiterkampf", "Schlachtreiter", "Freihändigkeit", "Rüstungsträger 1", "Starker Schildarm", "Rüstungsträger 2", "Schmerzwiderstand 1"];
            masteryskills = ["Klingenwaffen", "Klingenwaffen", "Klingenwaffen", "Klingenwaffen", "Stangenwaffen", "Stangenwaffen", "Anführen", "Anführen", "Tierführung", "Tierführung", "Tierführung", "Zähigkeit", "Zähigkeit", "Zähigkeit", "Zähigkeit"];
            masterylevels = [1, 1, 2, 2, 1, 2, 1, 1, 1, 2, 3, 1, 1, 2, 2];
            spellnames = ["Ausdauer stärken", "Sicht verbessern", "Eiserne Aura", "Heilung stärken"];
            spellschools = ["staerkung", "staerkung", "staerkung", "staerkung"];
            spelldiffs = [15, 18, 21, 21];
            spellcosts = ["K1", "K4V1", "K8V2", "8V2"];
            spelldurations = [1, 1, 9, 3];
            spellranges = ["Zauberer", "Zauberer", "Zauberer", "Zauberer"];
            spellimpactdurations = ["kan.", "kan.", "kan.", "-"];
            spelllevels = [14, 14, 14, 14];
            abilitynames = ["Akrobatik", "Anführen", "Athletik", "Entschlossenheit", "Heimlichkeit", "Tieführung", "Wahrnehmung", "Zähigkeit", "Stärkungsmagie"];
            abilitylevels = [10, 13, 10, 11, 8, 16, 12, 18, 14];
            featurenames = ["Schmerzresistenz", "Taktiker"];
            featurelevels = [1, 1];
            break;
        case ("raubskarabaeus"):
            setAttrs({ "namensc": "Raubskarabäus", "ausstrahlungnsc": 0, "beweglichkeitnsc": 2, "intuitionnsc": 4, "konstitutionnsc": 3, "mystiknsc": 0, "staerkensc": 4, "verstandnsc": 0, "willenskraftnsc": 1, "groessenklassensc": 6, "geschwindigkeitnsc": 4, "lebenspunktensc": 9, "fokusnscgesamt": 2, "verteidigungnsc": 20, "schadensreduktionnsc": 3, "koerperlicherwiderstandnsc": 24, "geistigerwiderstandnsc": 18, "lpnscgesamt": 45, "nschealth": 5, "schmerzimmunnsc": 0, "initiativensc": 6 });
            weaponnames = ["Körper"];
            weaponskills = [15];
            weaponspeed = [7];
            weapondamage1 = [1];
            weapondamage2 = ["d6"];
            weapondamage3 = [5];
            weaponini = [6];
            weaponattributes = ["Durchdringung 2, Umklammern"];
            masterynames = ["Umklammern", "Vorstürmen", "Überraschungsangriff 2"];
            masteryskills = ["Handgemenge", "Handgemenge", "Heimlichkeit"];
            masterylevels = [1, 1, 2];
            abilitynames = ["Akrobatik", "Athletik", "Entschlossenheit", "Heimlichkeit", "Wahrnehmung", "Zähigkeit"];
            abilitylevels = [6, 6, 1, 15, 11, 6];
            featurenames = ["Hitzeresistenz", "Kreatur"];
            featurelevels = [2, 6];
            break;
        case ("riesenspinne"):
            setAttrs({ "namensc": "Riesenspinne", "ausstrahlungnsc": 0, "beweglichkeitnsc": 4, "intuitionnsc": 3, "konstitutionnsc": 1, "mystiknsc": 0, "staerkensc": 2, "verstandnsc": 0, "willenskraftnsc": 1, "groessenklassensc": 4, "geschwindigkeitnsc": 8, "lebenspunktensc": 5, "fokusnscgesamt": 2, "verteidigungnsc": 18, "schadensreduktionnsc": 0, "koerperlicherwiderstandnsc": 17, "geistigerwiderstandnsc": 15, "lpnscgesamt": 15, "nschealth": 3, "schmerzimmunnsc": 0, "initiativensc": 7 });
            weaponnames = ["Körper"];
            weaponskills = [11];
            weaponspeed = [7];
            weapondamage1 = [1];
            weapondamage2 = ["d6"];
            weapondamage3 = [3];
            weaponini = [7];
            weaponattributes = ["-"];
            masterynames = ["Kletteraffe", "Freikletterer", "Leisetreter", "Überraschungsangriff 1"];
            masteryskills = ["Athletik", "Athletik", "Heimlichkeit", "Heimlichkeit"];
            masterylevels = [1, 3, 1, 1];
            abilitynames = ["Akrobatik", "Athletik", "Entschlossenheit", "Heimlichkeit", "Wahrnehmung", "Zähigkeit"];
            abilitylevels = [8, 11, 3, 14, 6, 4];
            featurenames = ["Gift (Blut 2 / Benommen / 60 Ticks)", "Kreatur", "Schwächlich"];
            featurelevels = [1, 4, 1];
            break;
        case ("sanddrache"):
            setAttrs({ "namensc": "Sanddrache", "ausstrahlungnsc": 2, "beweglichkeitnsc": 7, "intuitionnsc": 5, "konstitutionnsc": 10, "mystiknsc": 0, "staerkensc": 12, "verstandnsc": 1, "willenskraftnsc": 5, "groessenklassensc": 9, "geschwindigkeitnsc": 13, "lebenspunktensc": 19, "fokusnscgesamt": 10, "verteidigungnsc": 37, "schadensreduktionnsc": 5, "koerperlicherwiderstandnsc": 36, "geistigerwiderstandnsc": 25, "lpnscgesamt": 95, "nschealth": 5, "schmerzimmunnsc": 0, "initiativensc": 5 });
            weaponnames = ["Biss", "Klaue"];
            weaponskills = [23, 29];
            weaponspeed = [14, 11];
            weapondamage1 = [5, 4];
            weapondamage2 = ["d6", "d6"];
            weapondamage3 = [4, 2];
            weaponini = [5, 5];
            weaponattributes = ["Durchdringung 3, Scharf 3", "Wuchtig"];
            masterynames = ["Umreißen (Schwierigkeit 23)", "Vorstürmen", "Überraschungsangriff 1", "Schmerzwiderstand 2"];
            masteryskills = ["Handgemenge", "Handgemenge", "Heimlichkeit", "Zähigkeit"];
            masterylevels = [1, 1, 1, 3];
            abilitynames = ["Akrobatik", "Athletik", "Entschlossenheit", "Heimlichkeit", "Wahrnehmung", "Zähigkeit"];
            abilitylevels = [19, 27, 10, 13, 15, 29];
            featurenames = ["Dämmersicht", "Gift (Blut 3 / Bewusstlos / 5 Minuten)", "Hitzeresistenz", "Koloss (Biss, Klaue)", "Resistenz gegen Feuerschaden", "Schmerzresistenz", "Verwundbarkeit gegen Kälteschaden"];
            featurelevels = [1, 1, 3, 2, 3, 1, 1];
            break;
        case ("schattenweber"):
            setAttrs({ "namensc": "Schattenweber", "ausstrahlungnsc": 5, "beweglichkeitnsc": 2, "intuitionnsc": 4, "konstitutionnsc": 2, "mystiknsc": 7, "staerkensc": 2, "verstandnsc": 7, "willenskraftnsc": 7, "groessenklassensc": 5, "geschwindigkeitnsc": 6, "lebenspunktensc": 7, "fokusnscgesamt": 53, "verteidigungnsc": 30, "schadensreduktionnsc": 0, "koerperlicherwiderstandnsc": 33, "geistigerwiderstandnsc": 37, "lpnscgesamt": 35, "nschealth": 5, "schmerzimmunnsc": 0, "initiativensc": 6 });
            weaponnames = ["Kampfstab"];
            weaponskills = [15];
            weaponspeed = [9];
            weapondamage1 = [1];
            weapondamage2 = ["d10"];
            weapondamage3 = [2];
            weaponini = [6];
            weaponattributes = ["Defensiv 2, Lange Waffe, Zweihändig"];
            masterynames = ["Kind der Schatten", "Schützende Schatten", "Nekromant", "Meister der Untoten"];
            masteryskills = ["Schattenmagie", "Schattenmagie", "Todesmagie", "Todesmagie"];
            masterylevels = [2, 2, 2, 3];
            spellnames = ["Dunkelheit", "Schattenpfeil", "Schattenwand", "Lichtbann", "Schwächeanfall", "Fluch der Schmerzen", "Lebensraub", "Untote erheben", "Todesfluch", "Verdorren"];
            spellschools = ["schatten", "schatten", "schatten", "schatten", "tod", "tod", "tod", "tod", "tod", "tod"];
            spelldiffs = [18, "VTD", 21, 24, "KW", "KW", "KW", 24, "KW", "VTD"];
            spellcosts = ["K4V1", "6V2", "K8V2", "12V3", "K8V2", "8V2", "12V3", "12V3", "16V4", "16V4"];
            spelldurations = [1, 7, 6, 11, 6, 6, 10, "5 M.", 16, 14];
            spellranges = ["Zauberer", "10m", "5m", "10m", "5m", "5m", "Berührung", "Berührung", "5m", "Berührung"];
            spellimpactdurations = ["kan.", "-", "kan.", "-", "kan.", "-", "-", "1 Tag", "-", "-"];
            spelllevels = [20, 20, 20, 20, 26, 26, 26, 26, 26, 26];
            abilitynames = ["Akrobatik", "Athletik", "Entschlossenheit", "Heimlichkeit", "Wahrnehmung", "Zähigkeit", "Schattenmagie", "Todesmagie"];
            abilitylevels = [5, 4, 18, 9, 14, 9, 20, 26];
            featurenames = ["Dunkelsicht", "Erschöpfungsresistenz", "Furchterregend", "Giftimmunität", "Konzentrationsstärke", "Resistenz gegen Schattenschaden", "Taktiker", "Untot", "Verwundbarkeit gegen Lichtschaden"];
            featurelevels = [1, 2, 25, 1, 1, 5, 1, 1, 1];
            break;
        case ("schnappechse"):
            setAttrs({ "namensc": "Schnappechse", "ausstrahlungnsc": 2, "beweglichkeitnsc": 5, "intuitionnsc": 4, "konstitutionnsc": 7, "mystiknsc": 0, "staerkensc": 9, "verstandnsc": 2, "willenskraftnsc": 3, "groessenklassensc": 7, "geschwindigkeitnsc": 12, "lebenspunktensc": 14, "fokusnscgesamt": 6, "verteidigungnsc": 28, "schadensreduktionnsc": 2, "koerperlicherwiderstandnsc": 27, "geistigerwiderstandnsc": 23, "lpnscgesamt": 70, "nschealth": 5, "schmerzimmunnsc": 0, "initiativensc": 6 });
            weaponnames = ["Körper"];
            weaponskills = [19];
            weaponspeed = [9];
            weapondamage1 = [2];
            weapondamage2 = ["d6"];
            weapondamage3 = [6];
            weaponini = [6];
            weaponattributes = ["-"];
            masterynames = ["Vorstürmen", "Flinker Verfolger", "Kampf unter Wasser"];
            masteryskills = ["Handgemenge", "Athletik", "Schwimment"];
            masterylevels = [1, 2, 2];
            abilitynames = ["Akrobatik", "Athletik", "Entschlossenheit", "Heimlichkeit", "Schwimmen", "Wahrnehmung", "Zähigkeit"];
            abilitylevels = [14, 21, 9, 13, 24, 14, 15];
            featurenames = ["Gift (Blut 3 / Verwundet / 5 Minuten)", "Hitzeresistenz", "Verwundbarkeit gegen Kälteschaden"];
            featurelevels = [1, 1, 1];
            break;
        case ("skelett"):
            setAttrs({ "namensc": "Skelett", "ausstrahlungnsc": 0, "beweglichkeitnsc": 2, "intuitionnsc": 0, "konstitutionnsc": 2, "mystiknsc": 0, "staerkensc": 3, "verstandnsc": 0, "willenskraftnsc": 1, "groessenklassensc": 5, "geschwindigkeitnsc": 6, "lebenspunktensc": 7, "fokusnscgesamt": 2, "verteidigungnsc": 17, "schadensreduktionnsc": 0, "koerperlicherwiderstandnsc": 18, "geistigerwiderstandnsc": 22, "lpnscgesamt": 21, "nschealth": 3, "schmerzimmunnsc": 1, "initiativensc": 10 });
            weaponnames = ["Säbel"];
            weaponskills = [10];
            weaponspeed = [8];
            weapondamage1 = [1];
            weapondamage2 = ["d6"];
            weapondamage3 = [4];
            weaponini = [10];
            weaponattributes = ["Scharf 2"];
            abilitynames = ["Akrobatik", "Athletik", "Entschlossenheit", "Heimlichkeit", "Wahrnehmung", "Zähigkeit"];
            abilitylevels = [5, 5, 1, 2, 3, 6];
            featurenames = ["Betäubungsimmunität", "Dunkelsicht", "Erschöpfungsresistenz", "Furchterregend", "Giftimmunität", "Schmerzimmunität", "Schwächlich", "Untot", "Verwundbarkeit gegen Lichtschaden"];
            featurelevels = [1, 1, 4, 10, 1, 1, 1, 1, 1];
            break;
        case ("soeldner"):
            setAttrs({ "namensc": "Söldner", "ausstrahlungnsc": 1, "beweglichkeitnsc": 4, "intuitionnsc": 3, "konstitutionnsc": 4, "mystiknsc": 2, "staerkensc": 5, "verstandnsc": 2, "willenskraftnsc": 2, "groessenklassensc": 5, "geschwindigkeitnsc": 7, "lebenspunktensc": 9, "fokusnscgesamt": 8, "verteidigungnsc": 27, "schadensreduktionnsc": 2, "koerperlicherwiderstandnsc": 22, "geistigerwiderstandnsc": 18, "lpnscgesamt": 45, "nschealth": 5, "schmerzimmunnsc": 0, "initiativensc": 7 });
            weaponnames = ["Körper", "Leichte Armbrust", "Streithammer"];
            weaponskills = [13, 16, 18];
            weaponspeed = [8, 10, 14];
            weapondamage1 = [1, 2, 2];
            weapondamage2 = ["d6", "d6", "d6"];
            weapondamage3 = [0, 6, 3];
            weaponini = [7, 7, 7];
            weaponattributes = ["Stumpf", "Durchdringung 4, Zweihändig", "Scharf 2, Vielseitig"];
            masterynames = ["Berserker", "Vorstürmen", "Schmetterschlag", "Schnellschütze", "Starker Schildarm 1"];
            masteryskills = ["Hiebwaffen", "Hiebwaffen", "Hiebwaffen", "Schusswaffen", "Zähigkeit"];
            masterylevels = [1, 1, 2, 1, 1];
            spellnames = ["Ausdauer stärken", "Gehör verbessern", "Lebenskraft stärken"];
            spellschools = ["staerkung", "staerkung", "staerkung"];
            spelldiffs = [15, 18, 21];
            spellcosts = ["K1", "K4V1", "K8V2"];
            spelldurations = [1, 1, 4];
            spellranges = ["Zauberer", "Zauberer", "Zauberer"];
            spellimpactdurations = ["kan.", "kan.", "kan."];
            spelllevels = [13, 13, 13];
            abilitynames = ["Akrobatik", "Athletik", "Entschlossenheit", "Heimlichkeit", "Wahrnehmung", "Zähigkeit", "Stärkungsmagie"];
            abilitylevels = [7, 10, 10, 7, 11, 14, 13];
            featurenames = ["Taktiker"];
            featurelevels = [1];
            break;
        case ("spuk"):
            setAttrs({ "namensc": "Spuk", "ausstrahlungnsc": 2, "beweglichkeitnsc": 1, "intuitionnsc": 3, "konstitutionnsc": 1, "mystiknsc": 3, "staerkensc": 1, "verstandnsc": 1, "willenskraftnsc": 3, "groessenklassensc": 4, "geschwindigkeitnsc": 4, "lebenspunktensc": 5, "fokusnscgesamt": 27, "verteidigungnsc": 18, "schadensreduktionnsc": 6, "koerperlicherwiderstandnsc": 15, "geistigerwiderstandnsc": 18, "lpnscgesamt": 15, "nschealth": 3, "schmerzimmunnsc": 1, "initiativensc": 7 });
            weaponnames = ["Körper"];
            weaponskills = [5];
            weaponspeed = [9];
            weapondamage1 = [1];
            weapondamage2 = ["d6"];
            weapondamage3 = [0];
            weaponini = [7];
            weaponattributes = ["Stumpf"];
            spellnames = ["Stoß", "Gegenstand bewegen", "Geräuschhexerei", "Lichtertanz", "Unsichtbarkeit"];
            spellschools = ["bewegung", "bewegung", "illusion", "illusion", "illusion"];
            spelldiffs = ["KW", 18, 15, 15, 30];
            spellcosts = [1, "K4V1", 1, 1, "K20V5"];
            spelldurations = [2, 3, 4, 1, 15];
            spellranges = ["5m", "5m", "10m", "10m", "Zauberer"];
            spellimpactdurations = ["-", "kan.", "-", "1 M", "kan."];
            spelllevels = [9, 9, 20, 20, 20];
            abilitynames = ["Akrobatik", "Athletik", "Entschlossenheit", "Heimlichkeit", "Wahrnehmung", "Zähigkeit", "Bewegungsmagie", "Illusionsmagie"];
            abilitylevels = [3, 3, 8, 11, 9, 4, 9, 20];
            featurenames = ["Betäubungsimmunität", "Dämmersicht", "Fliegend", "Furchterregend", "Geist", "Giftimmunität", "Hitzeresistenz", "Kälteresistenz", "Körperlos", "Kreatur", "Schmerzimmunität", "Schwächlich"];
            featurelevels = [1, 1, 1, 10, 1, 1, 3, 3, 1, 5, 1, 1];
            break;
        case ("traumbringer"):
            setAttrs({ "namensc": "Traumbringer", "ausstrahlungnsc": 4, "beweglichkeitnsc": 3, "intuitionnsc": 5, "konstitutionnsc": 3, "mystiknsc": 4, "staerkensc": 2, "verstandnsc": 3, "willenskraftnsc": 5, "groessenklassensc": 4, "geschwindigkeitnsc": 10, "lebenspunktensc": 8, "fokusnscgesamt": 38, "verteidigungnsc": 24, "schadensreduktionnsc": 6, "koerperlicherwiderstandnsc": 21, "geistigerwiderstandnsc": 27, "lpnscgesamt": 24, "nschealth": 3, "schmerzimmunnsc": 0, "initiativensc": 5 });
            masterynames = ["Schattenherr", "Schützende Schatten"];
            masteryskills = ["Schattenmagie", "Schattenmagie"];
            masterylevels = [1, 2];
            spellnames = ["Dunkelheit", "Lebensraub"];
            spellschools = ["schatten", "tod"];
            spelldiffs = [18, "KW"];
            spellcosts = ["K4V1", "12V3"];
            spelldurations = [1, 10];
            spellranges = ["Zauberer", "Berührung"];
            spellimpactdurations = ["kan.", "-"];
            spelllevels = [18, 18];
            abilitynames = ["Akrobatik", "Athletik", "Entschlossenheit", "Heimlichkeit", "Wahrnehmung", "Zähigkeit", "Schattenmagie", "Todesmagie"];
            abilitylevels = [7, 10, 14, 16, 13, 13, 18, 18];
            featurenames = ["Betäubungsimmunität", "Dunkelsicht", "Feenblut", "Fliegend", "Furchterregend", "Körperlos", "Resistenz gegen Schattenschaden", "Schwächlich", "Verwundbarkeit gegen Lichtschaden"];
            featurelevels = [1, 1, 1, 1, 15, 1, 5, 1, 1];
            break;
        case ("waldbestie"):
            setAttrs({ "namensc": "Waldbestie", "ausstrahlungnsc": 2, "beweglichkeitnsc": 4, "intuitionnsc": 3, "konstitutionnsc": 6, "mystiknsc": 0, "staerkensc": 8, "verstandnsc": 1, "willenskraftnsc": 3, "groessenklassensc": 6, "geschwindigkeitnsc": 14, "lebenspunktensc": 12, "fokusnscgesamt": 6, "verteidigungnsc": 27, "schadensreduktionnsc": 1, "koerperlicherwiderstandnsc": 30, "geistigerwiderstandnsc": 25, "lpnscgesamt": 60, "nschealth": 5, "schmerzimmunnsc": 0, "initiativensc": 7 });
            weaponnames = ["Körper"];
            weaponskills = [15];
            weaponspeed = [8];
            weapondamage1 = [1];
            weapondamage2 = ["d6"];
            weapondamage3 = [6];
            weaponini = [7];
            weaponattributes = ["Wuchtig"];
            masterynames = ["Umreißen (Schwierigkeit 20)", "Vorstürmen", "Kletteraffe", "Muskelprotz", "Freikletterer"];
            masteryskills = ["Handgemenge", "Handgemenge", "Athletik", "Athletik", "Athletik"];
            masterylevels = [1, 1, 1, 2, 3];
            abilitynames = ["Akrobatik", "Athletik", "Entschlossenheit", "Heimlichkeit", "Wahrnehmung", "Zähigkeit"];
            abilitylevels = [12, 24, 6, 13, 9, 14];
            featurenames = ["Dämmersicht", "Furchterregend", "Schmerzresistenz"];
            featurelevels = [1, 20, 1];
            break;
        case ("walddrache"):
            setAttrs({ "namensc": "Walddrache", "ausstrahlungnsc": 4, "beweglichkeitnsc": 7, "intuitionnsc": 5, "konstitutionnsc": 8, "mystiknsc": 3, "staerkensc": 11, "verstandnsc": 2, "willenskraftnsc": 6, "groessenklassensc": 8, "geschwindigkeitnsc": 18, "lebenspunktensc": 16, "fokusnscgesamt": 35, "verteidigungnsc": 31, "schadensreduktionnsc": 4, "koerperlicherwiderstandnsc": 33, "geistigerwiderstandnsc": 30, "lpnscgesamt": 80, "nschealth": 5, "schmerzimmunnsc": 0, "initiativensc": 5 });
            weaponnames = ["Klaue", "Schwanz"];
            weaponskills = [28, 24];
            weaponspeed = [9, 10];
            weapondamage1 = [3, 2];
            weapondamage2 = ["d6", "d6"];
            weapondamage3 = [2, 2];
            weaponini = [5, 5];
            weaponattributes = ["Durchdringung 1, Scharf 2", "Lange Waffe, Wuchtig"];
            masterynames = ["Umreißen (Schwierigkeit 23)", "Vorstürmen", "Hinterhalt", "Schmerzwiderstand 1"];
            masteryskills = ["Handgemenge", "Handgemenge", "Heimlichkeit", "Zähigkeit"];
            masterylevels = [1, 1, 2, 2];
            spellnames = ["Feuerstrahl", "Rindenhaut", "Tiere beherrschen", "Chamäleon"];
            spellschools = ["feuer", "natur", "natur", "natur"];
            spelldiffs = ["VTD", 18, "GW", 24];
            spellcosts = ["5V2", "K4V1", "K8V2", "K12V3"];
            spelldurations = [8, 3, 6, 9];
            spellranges = ["10m", "Zauberer", "5m", "Zauberer"];
            spellimpactdurations = ["-", "kan.", "kan.", "kan."];
            spelllevels = [14, 17, 17, 17];
            abilitynames = ["Akrobatik", "Athletik", "Entschlossenheit", "Heimlichkeit", "Wahrnehmung", "Zähigkeit", "Feuermgie", "Naturmagie"];
            abilitylevels = [18, 25, 15, 19, 18, 24, 14, 17];
            featurenames = ["Fliegend", "Furchterregend", "Giftimmunität", "Hitzeresistenz", "Koloss (Klaue, Schwanz)", "Resistenz gegen Feuerschaden", "Schmerzresistenz", "Taktiker", "Verwundbarkeit gegen Kälteschaden"];
            featurelevels = [1, 20, 1, 1, 2, 2, 1, 1, 1];
            break;
        case ("wandelnderleichnam"):
            setAttrs({ "namensc": "Wandelnder Leichnam", "ausstrahlungnsc": 0, "beweglichkeitnsc": 1, "intuitionnsc": 0, "konstitutionnsc": 3, "mystiknsc": 0, "staerkensc": 3, "verstandnsc": 0, "willenskraftnsc": 0, "groessenklassensc": 5, "geschwindigkeitnsc": 4, "lebenspunktensc": 8, "fokusnscgesamt": 0, "verteidigungnsc": 17, "schadensreduktionnsc": 0, "koerperlicherwiderstandnsc": 19, "geistigerwiderstandnsc": 14, "lpnscgesamt": 24, "nschealth": 3, "schmerzimmunnsc": 1, "initiativensc": 10 });
            weaponnames = ["Körper"];
            weaponskills = [8];
            weaponspeed = [11];
            weapondamage1 = [1];
            weapondamage2 = ["d6"];
            weapondamage3 = [1];
            weaponini = [10];
            weaponattributes = ["Umklammernd"];
            masterynames = ["Halten", "Umklammern"];
            masteryskills = ["Handgemenge", "Handgemenge"];
            masterylevels = [1, 1];
            abilitynames = ["Akrobatik", "Athletik", "Entschlossenheit", "Heimlichkeit", "Wahrnehmung", "Zähigkeit"];
            abilitylevels = [4, 6, 0, 1, 0, 8];
            featurenames = ["Betäubungsimmunität", "Dunkelsicht", "Erschöpfungsresistenz", "Furchterregend", "Giftimmunität", "Schmerzimmunität", "Schwächlich", "Untot", "Verwundbarkeit gegen Lichtschaden"];
            featurelevels = [1, 1, 4, 15, 1, 1, 1, 1, 1];
            break;
        case ("zaubermeister"):
            setAttrs({ "namensc": "Zaubermeister", "ausstrahlungnsc": 4, "beweglichkeitnsc": 2, "intuitionnsc": 4, "konstitutionnsc": 2, "mystiknsc": 5, "staerkensc": 2, "verstandnsc": 3, "willenskraftnsc": 5, "groessenklassensc": 5, "geschwindigkeitnsc": 6, "lebenspunktensc": 7, "fokusnscgesamt": 30, "verteidigungnsc": 22, "schadensreduktionnsc": 0, "koerperlicherwiderstandnsc": 23, "geistigerwiderstandnsc": 24, "lpnscgesamt": 35, "nschealth": 5, "schmerzimmunnsc": 0, "initiativensc": 6 });
            weaponnames = ["Langschwert"];
            weaponskills = [16];
            weaponspeed = [8];
            weapondamage1 = [1];
            weapondamage2 = ["d6"];
            weapondamage3 = [4];
            weaponini = [6];
            weaponattributes = ["Scharf 2"];
            masterynames = ["Ausfall", "Eiserner Wille", "Eiserne Konzentration", "Herz des Zerstörers", "Blutbad", "Eiliger Schutz"];
            masteryskills = ["Klingenwaffen", "Entschlossenheit", "Kampfmagie", "Kampfmagie", "Kampfmagie", "Schutzmagie"];
            masterylevels = [1, 1, 1, 2, 3, 1];
            spellnames = ["Geschoss verzaubern", "Blitzschlag", "Leichtes Ziel", "Schadenswelle", "Kettenblitz", "Gedankenschutz", "Windschild", "Magischer Panzer"];
            spellschools = ["kampf", "kampf", "kampf", "kampf", "kampf", "schutz", "schutz", "schutz"];
            spelldiffs = [18, "VTD", "KW", 24, "VTD", 21, 24, 24];
            spellcosts = ["K4V1", "6V2", "K8V2", "12V4", "12V3", "K8V2", "K12V3", "K12V3"];
            spelldurations = [2, 7, 7, 12, 11, 4, 9, 11];
            spellranges = ["Berührung", "10m", "5m", "Zauberer", "25m", "Zauberer", "Zauberer", "Zauberer"];
            spellimpactdurations = ["kan.", "-", "-", "-", "kan.", "kan.", "kan.", "kan."];
            spelllevels = [23, 23, 23, 23, 23, 21, 21, 21];
            abilitynames = ["Akrobatik", "Athletik", "Entschlossenheit", "Heimlichkeit", "Wahrnehmung", "Zähigkeit", "Kampfmagie", "Schutzmagie"];
            abilitylevels = [6, 3, 15, 9, 16, 12, 23, 21];
            featurenames = ["Konzentrationsstärke", "Taktiker"];
            featurelevels = [1, 1];
            break;
        case ("adler"):
            setAttrs({ "namensc": "Adler", "ausstrahlungnsc": 2, "beweglichkeitnsc": 2, "intuitionnsc": 3, "konstitutionnsc": 2, "mystiknsc": 0, "staerkensc": 1, "verstandnsc": 1, "willenskraftnsc": 3, "groessenklassensc": 3, "geschwindigkeitnsc": 20, "lebenspunktensc": 5, "fokusnscgesamt": 6, "verteidigungnsc": 20, "schadensreduktionnsc": 0, "koerperlicherwiderstandnsc": 17, "geistigerwiderstandnsc": 16, "lpnscgesamt": 15, "nschealth": 3, "schmerzimmunnsc": 0, "initiativensc": 7 });
            weaponnames = ["Körper"];
            weaponskills = [6];
            weaponspeed = [9];
            weapondamage1 = [1];
            weapondamage2 = ["d6"];
            weapondamage3 = [1];
            weaponini = [7];
            weaponattributes = ["-"];
            masterynames = ["Vorstürmen", "Überraschungsangriff 1"];
            masteryskills = ["Handgemenge", "Heimlichkeit"];
            masterylevels = [1, 1];
            abilitynames = ["Akrobatik", "Athletik", "Entschlossenheit", "Heimlichkeit", "Jagdkunst", "Wahrnehmung", "Zähigkeit"];
            abilitylevels = [6, 4, 9, 8, 9, 16, 5];
            featurenames = ["Dämmersicht", "Fliegend", "Kreatur", "Schwächlich"];
            featurelevels = [1, 1, 3, 1];
            break;
        case ("alligator"):
            setAttrs({ "namensc": "Alligator", "ausstrahlungnsc": 1, "beweglichkeitnsc": 3, "intuitionnsc": 4, "konstitutionnsc": 5, "mystiknsc": 0, "staerkensc": 8, "verstandnsc": 0, "willenskraftnsc": 1, "groessenklassensc": 8, "geschwindigkeitnsc": 8, "lebenspunktensc": 13, "fokusnscgesamt": 2, "verteidigungnsc": 20, "schadensreduktionnsc": 3, "koerperlicherwiderstandnsc": 21, "geistigerwiderstandnsc": 16, "lpnscgesamt": 65, "nschealth": 5, "schmerzimmunnsc": 0, "initiativensc": 6 });
            weaponnames = ["Körper"];
            weaponskills = [14];
            weaponspeed = [10];
            weapondamage1 = [2];
            weapondamage2 = ["d6"];
            weapondamage3 = [6];
            weaponini = [6];
            weaponattributes = ["Scharf 2, Umklammern"];
            masterynames = ["Umklammern", "Überraschungsangriff 1", "Kampf unter Wasser"];
            masteryskills = ["Handgemenge", "Heimlichkeit", "Schwimmen"];
            masterylevels = [1, 1, 2];
            abilitynames = ["Akrobatik", "Athletik", "Entschlossenheit", "Heimlichkeit", "Schwimmen", "Wahrnehmung", "Zähigkeit"];
            abilitylevels = [11, 16, 4, 13, 19, 10, 15];
            featurenames = ["Hitzeresistenz", "Verwundbarkeit gegen Kälteschaden"];
            featurelevels = [1, 1];
            break;
        case ("auerochse"):
            setAttrs({ "namensc": "Auerochse", "ausstrahlungnsc": 1, "beweglichkeitnsc": 2, "intuitionnsc": 2, "konstitutionnsc": 6, "mystiknsc": 0, "staerkensc": 8, "verstandnsc": 0, "willenskraftnsc": 2, "groessenklassensc": 7, "geschwindigkeitnsc": 13, "lebenspunktensc": 13, "fokusnscgesamt": 4, "verteidigungnsc": 23, "schadensreduktionnsc": 0, "koerperlicherwiderstandnsc": 23, "geistigerwiderstandnsc": 18, "lpnscgesamt": 65, "nschealth": 5, "schmerzimmunnsc": 0, "initiativensc": 8 });
            weaponnames = ["Körper"];
            weaponskills = [13];
            weaponspeed = [11];
            weapondamage1 = [3];
            weapondamage2 = ["d6"];
            weapondamage3 = [2];
            weaponini = [8];
            weaponattributes = ["Wuchtig"];
            masterynames = ["Umreißen (Schwierigkeit 20)", "Vorstürmen", "Muskelprotz"];
            masteryskills = ["Handgemenge", "Handgemenge", "Athletik"];
            masterylevels = [1, 1, 2];
            abilitynames = ["Akrobatik", "Athletik", "Entschlossenheit", "Heimlichkeit", "Wahrnehmung", "Zähigkeit"];
            abilitylevels = [10, 20, 6, 4, 7, 18];
            featurenames = ["Erschöpfungsresistenz"];
            featurelevels = [2];
            break;
        case ("baer"):
            setAttrs({ "namensc": "Bär", "ausstrahlungnsc": 3, "beweglichkeitnsc": 2, "intuitionnsc": 4, "konstitutionnsc": 7, "mystiknsc": 0, "staerkensc": 8, "verstandnsc": 1, "willenskraftnsc": 3, "groessenklassensc": 7, "geschwindigkeitnsc": 12, "lebenspunktensc": 14, "fokusnscgesamt": 6, "verteidigungnsc": 26, "schadensreduktionnsc": 1, "koerperlicherwiderstandnsc": 31, "geistigerwiderstandnsc": 19, "lpnscgesamt": 70, "nschealth": 5, "schmerzimmunnsc": 0, "initiativensc": 6 });
            weaponnames = ["Körper"];
            weaponskills = [20];
            weaponspeed = [8];
            weapondamage1 = [2];
            weapondamage2 = ["d6"];
            weapondamage3 = [4];
            weaponini = [6];
            weaponattributes = ["Scharf 3"];
            masterynames = ["Umreißen  (Schwierigkeit 20)", "Vorstürmen"];
            masteryskills = ["Handgemenge", "Handgemenge"];
            masterylevels = [1, 1];
            abilitynames = ["Akrobatik", "Athletik", "Entschlossenheit", "Heimlichkeit", "Wahrnehmung", "Zähigkeit"];
            abilitylevels = [10, 15, 8, 9, 14, 15];
            featurenames = ["Kälteresistenz", "Schmerzresistenz"];
            featurelevels = [2, 1];
            break;
        case ("falke"):
            setAttrs({ "namensc": "Falke", "ausstrahlungnsc": 2, "beweglichkeitnsc": 4, "intuitionnsc": 2, "konstitutionnsc": 1, "mystiknsc": 0, "staerkensc": 0, "verstandnsc": 1, "willenskraftnsc": 2, "groessenklassensc": 2, "geschwindigkeitnsc": 22, "lebenspunktensc": 3, "fokusnscgesamt": 4, "verteidigungnsc": 21, "schadensreduktionnsc": 0, "koerperlicherwiderstandnsc": 17, "geistigerwiderstandnsc": 16, "lpnscgesamt": 9, "nschealth": 3, "schmerzimmunnsc": 0, "initiativensc": 8 });
            weaponnames = ["Körper"];
            weaponskills = [5];
            weaponspeed = [9];
            weapondamage1 = [1];
            weapondamage2 = ["d6"];
            weapondamage3 = [1];
            weaponini = [8];
            weaponattributes = ["Stumpf"];
            masterynames = ["Vorstürmen", "Leisetreter", "Überraschungsangriff 1"];
            masteryskills = ["Handgemenge", "Heimlichkeit", "Heimlichkeit"];
            masterylevels = [1, 1, 1];
            abilitynames = ["Akrobatik", "Athletik", "Entschlossenheit", "Heimlichkeit", "Jagdkunst", "Wahrnehmung", "Zähigkeit"];
            abilitylevels = [8, 4, 5, 11, 12, 16, 3];
            featurenames = ["Dämmersicht", "Fliegend", "Kreatur", "Schwächlich"];
            featurelevels = [1, 1, 2, 1];
            break;
        case ("hai"):
            setAttrs({ "namensc": "Hai", "ausstrahlungnsc": 1, "beweglichkeitnsc": 4, "intuitionnsc": 3, "konstitutionnsc": 6, "mystiknsc": 0, "staerkensc": 8, "verstandnsc": 0, "willenskraftnsc": 2, "groessenklassensc": 7, "geschwindigkeitnsc": 13, "lebenspunktensc": 13, "fokusnscgesamt": 4, "verteidigungnsc": 26, "schadensreduktionnsc": 0, "koerperlicherwiderstandnsc": 27, "geistigerwiderstandnsc": 18, "lpnscgesamt": 65, "nschealth": 5, "schmerzimmunnsc": 0, "initiativensc": 7 });
            weaponnames = ["Körper"];
            weaponskills = [20];
            weaponspeed = [10];
            weapondamage1 = [2];
            weapondamage2 = ["d6"];
            weapondamage3 = [6];
            weaponini = [7];
            weaponattributes = ["Scharf 3"];
            abilitynames = ["Akrobatik", "Athletik", "Entschlossenheit", "Heimlichkeit", "Schwimmen", "Wahrnehmung", "Zähigkeit"];
            abilitylevels = [12, 14, 5, 21, 13, 16];
            featurenames = ["Dämmersicht", "Kälteresistenz", "Unterwasserwesen"];
            featurelevels = [1, 2, 1];
            break;
        case ("hyaene"):
            setAttrs({ "namensc": "Hyäne", "ausstrahlungnsc": 1, "beweglichkeitnsc": 3, "intuitionnsc": 4, "konstitutionnsc": 2, "mystiknsc": 0, "staerkensc": 3, "verstandnsc": 1, "willenskraftnsc": 0, "groessenklassensc": 3, "geschwindigkeitnsc": 13, "lebenspunktensc": 5, "fokusnscgesamt": 0, "verteidigungnsc": 17, "schadensreduktionnsc": 0, "koerperlicherwiderstandnsc": 15, "geistigerwiderstandnsc": 14, "lpnscgesamt": 15, "nschealth": 3, "schmerzimmunnsc": 0, "initiativensc": 6 });
            weaponnames = ["Körper"];
            weaponskills = [10];
            weaponspeed = [7];
            weapondamage1 = [1];
            weapondamage2 = ["d6"];
            weapondamage3 = [3];
            weaponini = [6];
            weaponattributes = ["-"];
            abilitynames = ["Akrobatik", "Athletik", "Entschlossenheit", "Heimlichkeit", "Wahrnehmung", "Zähigkeit"];
            abilitylevels = [9, 7, 1, 10, 8, 5];
            featurenames = ["Feigling", "Hitzeresistenz", "Kreatur", "Schwächlich"];
            featurelevels = [1, 1, 4, 1];
            break;
        case ("jaguar"):
            setAttrs({ "namensc": "Jaguar", "ausstrahlungnsc": 2, "beweglichkeitnsc": 5, "intuitionnsc": 4, "konstitutionnsc": 2, "mystiknsc": 0, "staerkensc": 5, "verstandnsc": 1, "willenskraftnsc": 4, "groessenklassensc": 5, "geschwindigkeitnsc": 14, "lebenspunktensc": 7, "fokusnscgesamt": 8, "verteidigungnsc": 22, "schadensreduktionnsc": 0, "koerperlicherwiderstandnsc": 19, "geistigerwiderstandnsc": 17, "lpnscgesamt": 35, "nschealth": 5, "schmerzimmunnsc": 0, "initiativensc": 6 });
            weaponnames = ["Körper"];
            weaponskills = [15];
            weaponspeed = [6];
            weapondamage1 = [1];
            weapondamage2 = ["d6"];
            weapondamage3 = [4];
            weaponini = [6];
            weaponattributes = ["Scharf 2"];
            masterynames = ["Umreißen (Schwierigkeit 20)", "Vorstürmen", "Freikletterer", "Leisetreter", "Überraschungsangriff 2"];
            masteryskills = ["Handgemenge", "Handgemenge", "Athletik", "Heimlichkeit", "Heimlichkeit"];
            masterylevels = [1, 1, 3, 1, 2];
            abilitynames = ["Akrobatik", "Athletik", "Entschlossenheit", "Heimlichkeit", "Wahrnehmung", "Zähigkeit"];
            abilitylevels = [16, 14, 7, 18, 13, 9];
            featurenames = ["Feigling", "Hitzeresistenz", "Kreatur", "Taktiker"];
            featurelevels = [1, 1, 6, 1];
            break;
        case ("kampfhund"):
            setAttrs({ "namensc": "Kampfhund", "ausstrahlungnsc": 1, "beweglichkeitnsc": 3, "intuitionnsc": 3, "konstitutionnsc": 2, "mystiknsc": 0, "staerkensc": 4, "verstandnsc": 1, "willenskraftnsc": 2, "groessenklassensc": 3, "geschwindigkeitnsc": 11, "lebenspunktensc": 5, "fokusnscgesamt": 4, "verteidigungnsc": 18, "schadensreduktionnsc": 0, "koerperlicherwiderstandnsc": 17, "geistigerwiderstandnsc": 16, "lpnscgesamt": 25, "nschealth": 5, "schmerzimmunnsc": 0, "initiativensc": 7 });
            weaponnames = ["Körper"];
            weaponskills = [8];
            weaponspeed = [7];
            weapondamage1 = [1];
            weapondamage2 = ["d6"];
            weapondamage3 = [3];
            weaponini = [7];
            weaponattributes = ["-"];
            masterynames = ["Umreißen (Schwierigkeit 17)", "Vorstürmen", "Flinker Verfolger", "Unermüdlicher Verfolger", "Schmerzwiderstand 1"];
            masteryskills = ["Handgemenge", "Handgemenge", "Athletik", "Jagdkunst", "Zähigkeit"];
            masterylevels = [1, 1, 2, 1, 2];
            abilitynames = ["Akrobatik", "Athletik", "Entschlossenheit", "Heimlichkeit", "Jagdkunst", "Wahrnehmung", "Zähigkeit"];
            abilitylevels = [7, 11, 6, 7, 11, 10, 13];
            featurenames = ["Kreatur"];
            featurelevels = [4];
            break;
        case ("loewe"):
            setAttrs({ "namensc": "Löwe", "ausstrahlungnsc": 3, "beweglichkeitnsc": 4, "intuitionnsc": 2, "konstitutionnsc": 5, "mystiknsc": 0, "staerkensc": 7, "verstandnsc": 1, "willenskraftnsc": 3, "groessenklassensc": 6, "geschwindigkeitnsc": 13, "lebenspunktensc": 11, "fokusnscgesamt": 6, "verteidigungnsc": 21, "schadensreduktionnsc": 0, "koerperlicherwiderstandnsc": 23, "geistigerwiderstandnsc": 19, "lpnscgesamt": 55, "nschealth": 5, "schmerzimmunnsc": 0, "initiativensc": 8 });
            weaponnames = ["Körper"];
            weaponskills = [18];
            weaponspeed = [7];
            weapondamage1 = [2];
            weapondamage2 = ["d6"];
            weapondamage3 = [3];
            weaponini = [8];
            weaponattributes = ["Scharf 2, Wuchtig"];
            masterynames = ["Umreißen (Schwierigkeit 20)", "Vorstürmen"];
            masteryskills = ["Handgemenge", "Handgemenge"];
            masterylevels = [1, 1];
            abilitynames = ["Akrobatik", "Athletik", "Entschlossenheit", "Heimlichkeit", "Wahrnehmung", "Zähigkeit"];
            abilitylevels = [11, 13, 8, 11, 10, 13];
            featurenames = ["Hitzeresistenz"];
            featurelevels = [1];
            break;
        case ("nashorn"):
            setAttrs({ "namensc": "Nashorn", "ausstrahlungnsc": 2, "beweglichkeitnsc": 2, "intuitionnsc": 2, "konstitutionnsc": 8, "mystiknsc": 0, "staerkensc": 9, "verstandnsc": 0, "willenskraftnsc": 2, "groessenklassensc": 8, "geschwindigkeitnsc": 13, "lebenspunktensc": 16, "fokusnscgesamt": 4, "verteidigungnsc": 22, "schadensreduktionnsc": 4, "koerperlicherwiderstandnsc": 29, "geistigerwiderstandnsc": 18, "lpnscgesamt": 80, "nschealth": 5, "schmerzimmunnsc": 0, "initiativensc": 8 });
            weaponnames = ["Körper"];
            weaponskills = [15];
            weaponspeed = [14];
            weapondamage1 = [3];
            weapondamage2 = ["d6"];
            weapondamage3 = [6];
            weaponini = [8];
            weaponattributes = ["Wuchtig"];
            masterynames = ["Umreißen", "Vorstürmen"];
            masteryskills = ["Handgemenge", "Handgemenge"];
            masterylevels = [1, 1];
            abilitynames = ["Akrobatik", "Athletik", "Entschlossenheit", "Heimlichkeit", "Wahrnehmung", "Zähigkeit"];
            abilitylevels = [11, 18, 7, 4, 5, 20];
            featurenames = ["Hitzeresistenz"];
            featurelevels = [1];
            break;
        case ("pferd"):
            setAttrs({ "namensc": "Pferd", "ausstrahlungnsc": 2, "beweglichkeitnsc": 3, "intuitionnsc": 3, "konstitutionnsc": 5, "mystiknsc": 0, "staerkensc": 8, "verstandnsc": 1, "willenskraftnsc": 1, "groessenklassensc": 7, "geschwindigkeitnsc": 13, "lebenspunktensc": 12, "fokusnscgesamt": 2, "verteidigungnsc": 19, "schadensreduktionnsc": 0, "koerperlicherwiderstandnsc": 23, "geistigerwiderstandnsc": 14, "lpnscgesamt": 60, "nschealth": 5, "schmerzimmunnsc": 0, "initiativensc": 7 });
            weaponnames = ["Körper"];
            weaponskills = [8];
            weaponspeed = [10];
            weapondamage1 = [2];
            weapondamage2 = ["d6"];
            weapondamage3 = [0];
            weaponini = [7];
            weaponattributes = ["Stumpf"];
            masterynames = ["Vorstürmen", "Flinker Verfolger", "Muskelprotz"];
            masteryskills = ["Handgemenge", "Athletik", "Athletik"];
            masterylevels = [1, 2, 2];
            abilitynames = ["Akrobatik", "Athletik", "Entschlossenheit", "Heimlichkeit", "Wahrnehmung", "Zähigkeit"];
            abilitylevels = [11, 25, 7, 6, 6, 12];
            featurenames = ["Erschöpfungsresistenz", "Kreatur"];
            featurelevels = [1, 3];
            break;
        case ("riesenschlange"):
            setAttrs({ "namensc": "Riesenschlange", "ausstrahlungnsc": 1, "beweglichkeitnsc": 5, "intuitionnsc": 3, "konstitutionnsc": 2, "mystiknsc": 0, "staerkensc": 5, "verstandnsc": 0, "willenskraftnsc": 1, "groessenklassensc": 5, "geschwindigkeitnsc": 8, "lebenspunktensc": 7, "fokusnscgesamt": 2, "verteidigungnsc": 25, "schadensreduktionnsc": 0, "koerperlicherwiderstandnsc": 18, "geistigerwiderstandnsc": 15, "lpnscgesamt": 21, "nschealth": 3, "schmerzimmunnsc": 0, "initiativensc": 7 });
            weaponnames = ["Körper"];
            weaponskills = [18];
            weaponspeed = [5];
            weapondamage1 = [1];
            weapondamage2 = ["d6"];
            weapondamage3 = [2];
            weaponini = [7];
            weaponattributes = ["Umklammern"];
            masterynames = ["Halten", "Umklammern", "Würgegriff", "Leisetreter", "Überraschungsangriff 1", "Kampf unter Wasser"];
            masteryskills = ["Handgemenge", "Handgemenge", "Handgemenge", "Heimlichkeit", "Heimlichkeit", "Schwimmen"];
            masterylevels = [1, 1, 3, 1, 1, 2];
            abilitynames = ["Akrobatik", "Athletik", "Entschlossenheit", "Heimlichkeit", "Schwimmen", "Wahrnehmung", "Zähigkeit"];
            abilitylevels = [12, 10, 4, 15, 12, 10, 8];
            featurenames = ["Gift (Blut 2 / Benommen / 60 Ticks)", "Hitzeresistenz", "Kreatur", "Schwächlich", "Verwundbarkeit gegen Kälteschaden"];
            featurelevels = [1, 1, 6, 1, 1];
            break;
        case ("skorpion"):
            setAttrs({ "namensc": "Skorpion", "ausstrahlungnsc": 1, "beweglichkeitnsc": 1, "intuitionnsc": 3, "konstitutionnsc": 1, "mystiknsc": 0, "staerkensc": 0, "verstandnsc": 0, "willenskraftnsc": 0, "groessenklassensc": 1, "geschwindigkeitnsc": 2, "lebenspunktensc": 2, "fokusnscgesamt": 0, "verteidigungnsc": 14, "schadensreduktionnsc": 0, "koerperlicherwiderstandnsc": 10, "geistigerwiderstandnsc": 11, "lpnscgesamt": 2, "nschealth": 1, "schmerzimmunnsc": 0, "initiativensc": 7 });
            weaponnames = ["Körper"];
            weaponskills = [8];
            weaponspeed = [6];
            weapondamage1 = [1];
            weapondamage2 = ["d6"];
            weapondamage3 = [0];
            weaponini = [7];
            weaponattributes = ["-"];
            abilitynames = ["Akrobatik", "Athletik", "Entschlossenheit", "Heimlichkeit", "Wahrnehmung", "Zähigkeit"];
            abilitylevels = [3, 1, 1, 14, 6, 1];
            featurenames = ["Gift (Blut 2 / Sterbend 3 / 60 Ticks)", "Hitzeresistenz", "Kreatur", "Zerbrechlich"];
            featurelevels = [1, 2, 2, 1];
            break;
        case ("taube"):
            setAttrs({ "namensc": "Taube", "ausstrahlungnsc": 1, "beweglichkeitnsc": 2, "intuitionnsc": 2, "konstitutionnsc": 1, "mystiknsc": 0, "staerkensc": 0, "verstandnsc": 0, "willenskraftnsc": 1, "groessenklassensc": 1, "geschwindigkeitnsc": 12, "lebenspunktensc": 2, "fokusnscgesamt": 2, "verteidigungnsc": 17, "schadensreduktionnsc": 0, "koerperlicherwiderstandnsc": 13, "geistigerwiderstandnsc": 13, "lpnscgesamt": 2, "nschealth": 1, "schmerzimmunnsc": 0, "initiativensc": 8 });
            weaponnames = ["Körper"];
            weaponskills = [4];
            weaponspeed = [8];
            weapondamage1 = [1];
            weapondamage2 = ["d6"];
            weapondamage3 = [-1];
            weaponini = [8];
            weaponattributes = ["Stumpf"];
            abilitynames = ["Akrobatik", "Athletik", "Entschlossenheit", "Heimlichkeit", "Wahrnehmung", "Zähigkeit"];
            abilitylevels = [5, 2, 6, 4, 7, 2];
            featurenames = ["Erschöpfungsresistenz", "Fliegend", "Kreatur", "Zerbrechlich"];
            featurelevels = [1, 1, 1, 1];
            break;
        case ("wildschwein"):
            setAttrs({ "namensc": "Wildschwein", "ausstrahlungnsc": 1, "beweglichkeitnsc": 4, "intuitionnsc": 3, "konstitutionnsc": 3, "mystiknsc": 0, "staerkensc": 4, "verstandnsc": 0, "willenskraftnsc": 1, "groessenklassensc": 4, "geschwindigkeitnsc": 11, "lebenspunktensc": 7, "fokusnscgesamt": 2, "verteidigungnsc": 18, "schadensreduktionnsc": 0, "koerperlicherwiderstandnsc": 21, "geistigerwiderstandnsc": 15, "lpnscgesamt": 21, "nschealth": 3, "schmerzimmunnsc": 0, "initiativensc": 7 });
            weaponnames = ["Körper"];
            weaponskills = [11];
            weaponspeed = [8];
            weapondamage1 = [1];
            weapondamage2 = ["d6"];
            weapondamage3 = [4];
            weaponini = [7];
            weaponattributes = ["Wuchtig"];
            masterynames = ["Vorstürmen", "Schmerzwiderstand 1"];
            masteryskills = ["Handgemenge", "Zähigkeit"];
            masterylevels = [1, 2];
            abilitynames = ["Akrobatik", "Athletik", "Entschlossenheit", "Heimlichkeit", "Wahrnehmung", "Zähigkeit"];
            abilitylevels = [8, 11, 6, 7, 6, 9];
            featurenames = ["Kreatur", "Schwächlich"];
            featurelevels = [4, 1];
            break;
        case ("wolf"):
            setAttrs({ "namensc": "Wolf", "ausstrahlungnsc": 1, "beweglichkeitnsc": 4, "intuitionnsc": 5, "konstitutionnsc": 2, "mystiknsc": 0, "staerkensc": 3, "verstandnsc": 1, "willenskraftnsc": 1, "groessenklassensc": 4, "geschwindigkeitnsc": 14, "lebenspunktensc": 6, "fokusnscgesamt": 2, "verteidigungnsc": 20, "schadensreduktionnsc": 0, "koerperlicherwiderstandnsc": 18, "geistigerwiderstandnsc": 17, "lpnscgesamt": 18, "nschealth": 3, "schmerzimmunnsc": 0, "initiativensc": 5 });
            weaponnames = ["Körper"];
            weaponskills = [13];
            weaponspeed = [7];
            weapondamage1 = [1];
            weapondamage2 = ["d6"];
            weapondamage3 = [4];
            weaponini = [5];
            weaponattributes = ["Scharf 2"];
            masterynames = ["Umreißen (Schwierigkeit 17)", "Vorstürmen", "Flinker Verfolger", "Leisetreter"];
            masteryskills = ["Handgemenge", "Handgemenge", "Athletik", "Heimlichkeit"];
            masterylevels = [1, 1, 2, 1];
            abilitynames = ["Akrobatik", "Athletik", "Entschlossenheit", "Heimlichkeit", "Jagdkunst", "Wahrnehmung", "Zähigkeit"];
            abilitylevels = [10, 11, 4, 15, 14, 13, 8];
            featurenames = ["Dämmersicht", "Feigling", "Kälteresistenz", "Kreatur", "Schwächlich"];
            featurelevels = [1, 1, 4, 1];
            break;
    }
    for (var i = 0; i < weaponnames.length; i++) {
        newrowattrs["repeating_waffennsc_" + newrowid + "_waffennamensc"] = weaponnames[i];
        newrowattrs["repeating_waffennsc_" + newrowid + "_waffenwertnsc"] = weaponskills[i];
        newrowattrs["repeating_waffennsc_" + newrowid + "_waffenwgsnsc"] = weaponspeed[i];
        newrowattrs["repeating_waffennsc_" + newrowid + "_waffenschaden1nsc"] = weapondamage1[i];
        newrowattrs["repeating_waffennsc_" + newrowid + "_waffenschadenwuerfelnsc"] = weapondamage2[i];
        newrowattrs["repeating_waffennsc_" + newrowid + "_waffenschaden3nsc"] = weapondamage3[i];
        newrowattrs["repeating_waffennsc_" + newrowid + "_waffenininsc"] = weaponini[i];
        newrowattrs["repeating_waffennsc_" + newrowid + "_waffenmerkmalensc"] = weaponattributes[i];
        newrowid = generateRowID();
    }
    for (var i = 0; i < masterynames.length; i++) {
        newrowattrs["repeating_meisterschaftennsc_" + newrowid + "_meisterschaftnsc"] = masterynames[i];
        newrowattrs["repeating_meisterschaftennsc_" + newrowid + "_meisterschaftsfertigkeitnsc"] = masteryskills[i];
        newrowattrs["repeating_meisterschaftennsc_" + newrowid + "_meisterschaftsschwellensc"] = masterylevels[i];
        newrowid = generateRowID();
    }
    for (var i = 0; i < spellnames.length; i++) {
        newrowattrs["repeating_zaubernsc_" + newrowid + "_zaubernamensc"] = spellnames[i];
        newrowattrs["repeating_zaubernsc_" + newrowid + "_magieschulennsc"] = spellschools[i];
        newrowattrs["repeating_zaubernsc_" + newrowid + "_zauberschwierigkeitnsc"] = spelldiffs[i];
        newrowattrs["repeating_zaubernsc_" + newrowid + "_zauberkostennsc"] = spellcosts[i];
        newrowattrs["repeating_zaubernsc_" + newrowid + "_zauberdauernsc"] = spelldurations[i];
        newrowattrs["repeating_zaubernsc_" + newrowid + "_zauberrwnsc"] = spellranges[i];
        newrowattrs["repeating_zaubernsc_" + newrowid + "_zauberwdnsc"] = spellimpactdurations[i];
        newrowattrs["repeating_zaubernsc_" + newrowid + "_zauberwertnsc"] = spelllevels[i];
        newrowid = generateRowID();
    }
    for (var i = 0; i < abilitynames.length; i++) {
        newrowattrs["repeating_fertigkeitennsc_" + newrowid + "_fertigkeitnsc"] = abilitynames[i];
        newrowattrs["repeating_fertigkeitennsc_" + newrowid + "_fertigkeitswertnsc"] = abilitylevels[i];
        newrowid = generateRowID();
    }
    for (var i = 0; i < featurenames.length; i++) {
        newrowattrs["repeating_merkmalensc_" + newrowid + "_merkmalnsc"] = featurenames[i];
        newrowattrs["repeating_merkmalensc_" + newrowid + "_merkmalstufensc"] = featurelevels[i];
        newrowid = generateRowID();
    }
    setAttrs(newrowattrs);
}

on("change:lebenspunkte_k change:lebenspunkte_e change:lebenspunkte_v", function (f) {
    if (f.sourceType == "sheetworker") { return; }
    getAttrs(["lebenspunkte_t"], function (v) {
        let newValue = f.newValue || 0;
        let previousValue = f.previousValue || 0;
        setAttrs({
            lebenspunkte_t: +v.lebenspunkte_t - (+newValue - +previousValue)
        });
    });
});


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
            let fokus_v = +v.fokus_v;
            let fokus_e = +v.fokus_e;
            let fokus_t = +v.fokus_t;
            let fokus_k = +v.fokus_k;
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

on("change:repeating_zaubernsc:directcalcnsc", function (f) {
    getAttrs(["repeating_zaubernsc_directcalcnsc", "repeating_zaubernsc_zauberkostennsc"], function (values) {
        var update = {};
        var kosten = 0;
        update["repeating_zaubernsc_directcalcnsc"] = "off";
        setAttrs(update);
        kosten = values.repeating_zaubernsc_zauberkostennsc;
        calculateSpell(kosten, "nsc");
    });
});

on("change:repeating_zaubernsc:directcalcvnscv", function (f) {
    getAttrs(["repeating_zaubernsc_directcalcnscv", "repeating_zaubernsc_zauberkostennscv"], function (values) {
        var update = {};
        var kosten = 0;
        update["repeating_zaubernsc_directcalcnscv"] = "off";
        setAttrs(update);
        kosten = values.repeating_zaubernsc_zauberkostennscv;
        calculateSpell(kosten, "nsc");
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

on("remove:repeating_staerken", function (eventInfo) {
    var rowid = eventInfo.sourceAttribute.substring(19, 39);
    var staerke = eventInfo.removedInfo["repeating_staerken_" + rowid + "_staerkename"];
    var update = {};
    var attribs = {
        "robust": "hiddenlp",
        "erhöhter fokuspool": "hiddenfokus",
        "flink": "hiddengsw",
        "hoher geistiger widerstand": "hiddengw",
        "hoher körperlicher widerstand": "hiddenkw",
        "natürlicher rüstungsschutz": "hiddensr",
        "verbesserte initiative": "hiddenini",
        "schmerzresistenz": "schmerzresistenz",
        "zusätzliche splitterpunkte": "hiddensplitterpunkte",
        "erhöhte fokusregeneration": "hiddenfokreg",
        "erhöhte lebensregeneration": "hiddenlifereg",
        "stabile magie": "hiddensbm"
    };
    if (attribs[staerke] != "undefined") {
        update[attribs[staerke.toLowerCase()]] = 0;
        setAttrs(update);
    }
});

on("remove:repeating_meisterschaften", function (eventInfo) {
    var rowid = eventInfo.sourceAttribute.substring(26, 46);
    var meisterschaft = eventInfo.removedInfo["repeating_meisterschaften_" + rowid + "_meisterschaftsname"];
    var update = {};
    var meisterschaften = {
        "blitzreflexe": "blitzreflexecount",
        "gute reflexe": "hiddenvtdgr",
        "rüstungsträger i": "rt1",
        "rüstungsträger 1": "rt1",
        "rüstungsträger ii": "rt2",
        "rüstungsträger 2": "rt2",
        "starker schildarm i": "st1",
        "starker schildarm 1": "st1",
        "schmerzwiderstand i": "sw1",
        "schmerzwiderstand 1": "sw1",
        "starker schildarm ii": "st2",
        "starker schildarm 2": "st2",
        "schmerzwiderstand ii": "sw2",
        "schmerzwiderstand 2": "sw2",
        "arkane geschwindigkeit": "hiddengswag",
        "sprinter": "sprintercount"
    };
    if (meisterschaft.toLowerCase() == "blitzreflexe") {
        getAttrs(["blitzreflexecount"], function (v) {
            if (+v.blitzreflexecount > 0) {
                update[meisterschaften[meisterschaft.toLowerCase()]] = +v.blitzreflexecount - 1;
                setAttrs(update);
            }
        });
    } else if (meisterschaft.toLowerCase() == "sprinter") {
        getAttrs(["sprintercount"], function (v) {
            if (+v.sprintercount > 0) {
                update[meisterschaften[meisterschaft.toLowerCase()]] = +v.sprintercount - 1;
                setAttrs(update);
            }
        });
    } else {
        if (meisterschaften[meisterschaft] != "undefined") {
            update[meisterschaften[meisterschaft.toLowerCase()]] = 0;
            setAttrs(update);
        }
    }
});

on("change:blitzreflexecount", function (eventInfo) {
    getAttrs(["blitzreflexecount", "hiddeninibr"], function (v) {
        let update = {};
        let blitzreflexecount = +v.blitzreflexecount;
        if (+blitzreflexecount <= 2) {
            update["hiddeninibr"] = +blitzreflexecount * 3;
            setAttrs(update);
        } else {
            update["hiddeninibr"] = 0;
            setAttrs(update);
        }
    });
});

on("change:sprintercount", function (eventInfo) {
    getAttrs(["sprintercount", "hiddengswspr"], function (v) {
        let update = {};
        let sprintercount = +v.sprintercount;
        if (+sprintercount <= 2) {
            update["hiddengswspr"] = +sprintercount;
            setAttrs(update);
        } else {
            update["hiddengswspr"] = 0;
            setAttrs(update);
        }
    });
});

on("change:lebenspunkte_v", function (eventInfo) {
    if (eventInfo.sourceType == "sheetworker") { return; }
    getAttrs(["lebenspunkte_v", "lebenspunkte_t", "lebenspunkte"], function (v) {
        let lp_v = +v.lebenspunkte_v;
        let lp_t = +v.lebenspunkte_t;
        let s2 = (+v.lebenspunkte * 4) + 1;
        let s3b = +v.lebenspunkte * 5;
        let dead = (+v.lebenspunkte * 6) + 1;
        var update = {};
        if (+lp_t >= +v.lebenspunkte && +lp_v >= +s2) {
            let newrowid = generateRowID();
            update["repeating_zustaende_" + newrowid + "_zustandsname"] = "sterbendw";
            update["repeating_zustaende_" + newrowid + "_zustandsstufe"] = 2;
            update["repeating_zustaende_" + newrowid + "_zustandonoff"] = true;
        }
        if (+lp_t > 0 && +lp_v >= +s3b) {
            let newrowid = generateRowID();
            update["repeating_zustaende_" + newrowid + "_zustandsname"] = "sterbendw";
            update["repeating_zustaende_" + newrowid + "_zustandsstufe"] = 3;
            update["repeating_zustaende_" + newrowid + "_zustandonoff"] = true;
            newrowid = generateRowID();
            update["repeating_zustaende_" + newrowid + "_zustandsname"] = "bewusstlos";
            update["repeating_zustaende_" + newrowid + "_zustandsstufe"] = 1;
            update["repeating_zustaende_" + newrowid + "_zustandonoff"] = true;
        }
        if (+lp_v >= dead) {
            let newrowid = generateRowID();
            update["repeating_zustaende_" + newrowid + "_zustandsname"] = "totw";
            update["repeating_zustaende_" + newrowid + "_zustandsstufe"] = 1;
            update["repeating_zustaende_" + newrowid + "_zustandonoff"] = true;
        }
        setAttrs(update);
    });
});

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

on("change:lebenspunktensc_k change:lebenspunktensc_v change:lebenspunktensc_e change:nschealth change:lebenspunktensc", function (eventInfo) {
    getAttrs(["lebenspunktensc_k", "lebenspunktensc_v", "lebenspunktensc_e", "lpnscgesamt", "nschealth", "lebenspunktensc"], function (v) {
        if (eventInfo.newValue < 0) { return; }
        var gesamtlp = +v.lebenspunktensc * +v.nschealth;
        setAttrs({
            lpnscgesamt: +gesamtlp - +v.lebenspunktensc_k - +v.lebenspunktensc_v - +v.lebenspunktensc_e
        });
    });
});

on("change:fokusnsc_k change:fokusnsc_e change:fokusnsc_v change:foknscgesamt change:fokusnscgesamt", function (eventInfo) {
    getAttrs(["fokusnsc_k", "fokusnsc_e", "fokusnsc_v", "foknscgesamt", "nschealth", "fokusnscgesamt"], function (v) {
        if (eventInfo.newValue < 0) { return; }
        var gesamtfokus = +v.fokusnscgesamt;
        setAttrs({
            foknscgesamt: +gesamtfokus - +v.fokusnsc_v - +v.fokusnsc_k - +v.fokusnsc_e
        });
    });
});

on("change:creature_vtd_ruestung change:creature_verteidigung", function (eventInfo) {
    getAttrs(["creature_vtd_ruestung", "creature_verteidigung"], function (v) {
        setAttrs({
            creature_verteidigung_gesamt: +v.creature_verteidigung + +v.creature_vtd_ruestung
        });
    });
});

on("change:repeating_masterytooltips:masterytooltipname change:repeating_masterytooltips:masterytooltiptext", function () {
    getAttrs(["repeating_masterytooltips_masterytooltipname", "repeating_masterytooltips_masterytooltiptext"], function (values) {
        let mastery = values.repeating_masterytooltips_masterytooltipname;
        let tooltip = values.repeating_masterytooltips_masterytooltiptext;
        let update = {};
        getSectionIDs("repeating_meisterschaften", function (idarray) {
            if (idarray.length > 0) {
                _.each(idarray, function (currentID, i) {
                    getAttrs(["repeating_meisterschaften_" + currentID + "_meisterschaftsname"], function (v) {
                        var name = v["repeating_meisterschaften_" + currentID + "_meisterschaftsname"];
                        if (name.toLowerCase() == mastery.toLowerCase()) {
                            update["repeating_meisterschaften_" + currentID + "_meisterschaftsbeschreibung"] = tooltip;
                            setAttrs(update);
                        }
                    });
                });
            }
        });
    });
});

on("change:repeating_spelltooltips:spelltooltipname change:repeating_spelltooltips:spelltooltiptext", function () {
    getAttrs(["repeating_spelltooltips_spelltooltipname", "repeating_spelltooltips_spelltooltiptext"], function (values) {
        let spell = values.repeating_spelltooltips_spelltooltipname;
        let tooltip = values.repeating_spelltooltips_spelltooltiptext;
        let update = {};
        getSectionIDs("repeating_zauber", function (idarray) {
            if (idarray.length > 0) {
                _.each(idarray, function (currentID, i) {
                    getAttrs(["repeating_zauber_" + currentID + "_zaubername"], function (v) {
                        var name = v["repeating_zauber_" + currentID + "_zaubername"];
                        if (name.toLowerCase() == spell.toLowerCase()) {
                            update["repeating_zauber_" + currentID + "_zauberbeschreibung"] = tooltip;
                            setAttrs(update);
                        }
                    });
                });
            }
        });
    });
});

on("change:tooltips change:tooltips_spells", function () {
    getAttrs(["tooltips", "tooltips_spells"], function (values) {
        let tooltips_m = values.tooltips;
        let tooltips_s = values.tooltips_spells;
        let update = {};

        getSectionIDs("repeating_meisterschaften", function (idarray) {
            if (idarray.length > 0) {
                _.each(idarray, function (currentID, i) {
                    update["repeating_meisterschaften_" + currentID + "_tooltips_inside"] = tooltips_m;
                    setAttrs(update);
                });
            }
        });

        getSectionIDs("repeating_zauber", function (idarray) {
            if (idarray.length > 0) {
                _.each(idarray, function (currentID, i) {
                    update["repeating_zauber_" + currentID + "_tooltips_inside_spells"] = tooltips_s;
                    setAttrs(update);
                });
            }
        });
    });
});

on("change:repeating_ausruestung:last change:repeating_ausruestung:getragen change:repeating_ausruestung:anzahl remove:repeating_ausruestung change:repeating_behaelter1:last change:repeating_behaelter1:getragen change:repeating_behaelter1:anzahl remove:repeating_behaelter1 change:repeating_behaelter2:last change:repeating_behaelter2:getragen change:repeating_behaelter2:anzahl remove:repeating_behaelter2 change:repeating_behaelter3:last change:repeating_behaelter3:getragen change:repeating_behaelter3:anzahl remove:repeating_behaelter3 change:repeating_behaelter4:last change:repeating_behaelter4:getragen change:repeating_behaelter4:anzahl remove:repeating_behaelter4 change:repeating_behaelter5:last change:repeating_behaelter5:getragen change:repeating_behaelter5:anzahl remove:repeating_behaelter5", function (eventInfo) {
    let row = eventInfo.sourceAttribute.split("_")[1];
    let lastfelder = { "ausruestung": "gesamtlast_koerper", "behaelter1": "gesamtlast_behaelter1", "behaelter2": "gesamtlast_behaelter2", "behaelter3": "gesamtlast_behaelter3", "behaelter4": "gesamtlast_behaelter4", "behaelter5": "gesamtlast_behaelter5" };
    let lastfeld = lastfelder[row];
    getSectionIDs(`repeating_${row}`, function (idarray) {
        let update = {};
        let nichtsgetragen = true;
        let sum = 0;
        let last = 0;
        let getragen = true;
        let anzahl = 0;
        if (idarray.length > 0) {
            _.each(idarray, function (currentID, i) {
                getAttrs([`repeating_${row}_` + currentID + `_last`, `repeating_${row}_` + currentID + `_getragen`, `repeating_${row}_` + currentID + `_anzahl`], function (v) {
                    last = v[`repeating_${row}_` + currentID + `_last`];
                    getragen = v[`repeating_${row}_` + currentID + `_getragen`];
                    anzahl = v[`repeating_${row}_` + currentID + `_anzahl`];
                    if (getragen == true) {
                        nichtsgetragen = false;
                        sum += +last * +anzahl;
                        update[`${lastfeld}`] = +sum;
                        setAttrs(update);
                    }

                });
            });
        }
        if (nichtsgetragen == true) {
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
