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
