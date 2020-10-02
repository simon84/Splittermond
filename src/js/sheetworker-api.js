var roll20API = {
    events: {},
    charData: {},
    repItemId: 0,
};

function on(eventStr, fnc) {
    _.each(eventStr.split(" "), function (ev) {
        if (roll20API.events[ev] == undefined) {
            roll20API.events[ev] = [];
        }
        roll20API.events[ev].push(fnc);
    });
}

function throwEvent(ev, eventInfo) {
    _.each(roll20API.events[ev], function (evCb) {
        evCb(eventInfo);
    });
}

async function setAttrs(obj, opt = "", cb = function () { }) {
    _.each(obj, function (value, key) {
        var eventInfo = {};
        eventInfo.newValue = value;
        eventInfo.previousValue = roll20API.charData[key];
        eventInfo.sourceAttribute = key.toLowerCase();

        if (value == eventInfo.previousValue) {
            cb();
            return;
        }

        roll20API.charData[key] = value;
        if (opt != "silent") {


            throwEvent("change:" + key, eventInfo);
        }

        var elementName = "attr_" + key;

        $(`span[name="${elementName}"], input[name="${elementName}"], select[name="${elementName}"], textarea[name="${elementName}"]`).each(function () {
            var el = $(this);
            var tagName = this.tagName;

            if (value != undefined) {
                if (tagName == "SPAN" || tagName == "TEXTAREA") {
                    el.text(value);
                } else {
                    if (el.attr("type") == "checkbox" || el.attr("type") == "radio") {
                        if (el.attr("type") == "checkbox") {
                            el.prop("checked", el.val() == value);
                        } else {
                            if (el.val() == value) {
                                el.prop("checked", true);
                            }
                        }
                    } else {
                        el.val(value);
                    }
                }
            }
            el.trigger("change");
        });


        if (key.startsWith("repeating_")) {
            rowId = key.match(/(repeating_[^_]*)_([^_]*)_([^_]*)/);

            if (rowId) {
                roll20API.charData[`_lastId_${rowId[1]}`] = rowId[2];
            } else {
                rowId = key.match(/(repeating_[^_]*)_([^_]*)/);
                rowId[3] = rowId[2];
                rowId[2] = roll20API.charData[`_lastId_${rowId[1]}`];
                eventInfo.sourceAttribute = (`${rowId[1]}_${rowId[2]}_${rowId[3]}`).toLowerCase();
            }
            var repOrder = [];
            if (roll20API.charData["_reporder:" + rowId[1]] != undefined) {
                repOrder = roll20API.charData["_reporder:" + rowId[1]].split(",").filter(v => v.match(/[0-9]+/));
            }

            if (rowId[2].startsWith("$")) {
                var temp = rowId[2].substr(1);
                rowId[2] = repOrder[+temp];
            }



            if (!repOrder.includes(rowId[2])) {
                addRepeatingRow($(`.repcontainer[data-groupname="${rowId[1]}"]`), rowId[1], rowId[2]);
            }

            roll20API.charData[`${rowId[1]}_${rowId[3]}`] = value;


            var elementName = "attr_" + rowId[3];

            $(`.repcontainer[data-groupname="${rowId[1]}"] .repitem[reprowid="${rowId[2]}"] input[name="${elementName}"],
            .repcontainer[data-groupname="${rowId[1]}"] .repitem[reprowid="${rowId[2]}"] select[name="${elementName}"],
            .repcontainer[data-groupname="${rowId[1]}"] .repitem[reprowid="${rowId[2]}"] span[name="${elementName}"],
            .repcontainer[data-groupname="${rowId[1]}"] .repitem[reprowid="${rowId[2]}"] textarea[name="${elementName}"]`).each(function () {
                var el = $(this);
                var tagName = this.tagName;

                if (value != undefined) {
                    if (tagName == "SPAN" || tagName == "TEXTAREA") {
                        el.text(value);
                    } else {
                        if (el.attr("type") == "checkbox" || el.attr("type") == "radio") {
                            if (el.attr("type") == "checkbox") {
                                el.prop("checked", el.val() == value);
                            } else {
                                if (el.val() == value) {
                                    el.prop("checked", true);
                                }
                            }

                        } else {
                            el.val(value);
                        }
                    }
                }
                el.trigger("change");
            });

            if (opt != "silent") {
                throwEvent("change:" + rowId[3], eventInfo);
                throwEvent("change:" + rowId[1], eventInfo);
                throwEvent("change:" + rowId[1] + ":" + rowId[3], eventInfo);
            }
        }





    });

    cb();
}

async function getAttrs(lst, cb) {
    var data = {};
    _.each(lst, function (value) {
        if (value.startsWith("repeating_")) {
            var rowId = value.match(/(repeating_[^_]*)_([^_]*)_([^_]*)/);
            if (rowId) {
                if (rowId[2].startsWith("$")) {
                    var repOrder = [];
                    if (roll20API.charData["_reporder:" + rowId[1]] != undefined) {
                        repOrder = roll20API.charData["_reporder:" + rowId[1]].split(",").filter(v => v.match(/[0-9]+/));
                    }
                    var temp = rowId[2].substr(1);
                    rowId[2] = repOrder[+temp];
                }
                data[value] = roll20API.charData[`${rowId[1]}_${rowId[2]}_${rowId[3]}`];
            } else {
                rowId = value.match(/(repeating_[^_]*)_([^_]*)/);
                rowId[3] = rowId[2];
                rowId[2] = roll20API.charData[`_lastId_${rowId[1]}`];
                data[value] = roll20API.charData[`${rowId[1]}_${rowId[2]}_${rowId[3]}`];
            }

        } else {
            data[value] = roll20API.charData[value];
        }

    });
    cb(data);
}

function generateRowID() {
    if (roll20API.charData._lastRepItemId == undefined) {
        roll20API.charData._lastRepItemId = 0;
    }
    return roll20API.charData._lastRepItemId++;
}

Array.prototype.unique = function () {
    return this.filter(function (value, index, self) {
        return self.indexOf(value) === index;
    });
}

async function getSectionIDs(sectionName, cb) {

    // var name = sectionName + "_";
    // var data = Object.keys(roll20API.charData).filter(key => key.startsWith(name)).map(function (key) {
    //     key = key.match(/repeating_[^_]+_([^_]+)_([^_]+)/);
    //     if (key) {
    //         return key[1];
    //     } else {
    //         return "";
    //     }

    // });

    // //data = data.unique();
    // data = data.filter(val => (val != ""));
    if (roll20API.charData["_reporder:" + sectionName] == undefined) {
        cb([]);
    } else {
        cb(roll20API.charData["_reporder:" + sectionName].split(",").filter(v => v != ""));
    }


}


function removeRepeatingRow(rowId) {

    rowId = rowId.match(/(repeating_[^_]*)_([^_]*)/);

    $(`div[data-groupname="${rowId[1]}"] div.repitem[reprowid="${rowId[2]}"]`).remove().parent().trigger('sortupdate');

    var props = Object.keys(roll20API.charData);

    var filteredProps = props.filter(prop => prop.startsWith(`${rowId[0]}`));
    eventInfo = {};
    eventInfo.removedInfo = {}
    filteredProps.forEach(function (prop) {
        eventInfo.removedInfo[prop] = roll20API.charData[prop];
        delete roll20API.charData[prop];
    });

    roll20API.charData["_reporder:" + rowId[1]] = roll20API.charData["_reporder:" + rowId[1]].split(",").filter(v => (v != rowId[2] && v != ""));

    eventInfo.sourceAttribute = rowId[0];

    throwEvent("remove:" + rowId[0], eventInfo);
    throwEvent("remove:" + rowId[1], eventInfo);
}

function addRepeatingRow(repcontainer, dataGroupName, itemId) {
    if (roll20API.charData["_reporder:" + dataGroupName] == undefined) {
        roll20API.charData["_reporder:" + dataGroupName] = [];
    }
    var reporder = roll20API.charData["_reporder:" + dataGroupName].split(",").filter(v => v.match(/[0-9]+/));

    if (!reporder.includes(itemId)) {
        reporder.push(itemId);
    }

    roll20API.charData["_reporder:" + dataGroupName] = reporder;


    repcontainer
        .append(`<div class="repitem" reprowid="${itemId}">
                <div class="itemcontrol">
                    <button class="btn btn-danger pictos repcontrol_del">#</button>
                    <a class="btn repcontrol_move">≡</a>
                </div >`+ $(`fieldset[class="${dataGroupName}"]`).html() + '</div>');

    repcontainer.find(`.repitem[reprowid="${itemId}"] .itemcontrol button.repcontrol_del`).click(function (e) {
        e.preventDefault();

        removeRepeatingRow(`${dataGroupName}_${itemId}`);
    });

    repcontainer.find(`.repitem[reprowid="${itemId}"] input[name^="attr_"], .repitem[reprowid="${itemId}"] select[name^="attr_"], .repitem[reprowid="${itemId}"] textarea[name^="attr_"]`).change(function () {
        var data = {};
        if ($(this).attr("type") == "checkbox" || $(this).attr("type") == "radio") {
            if ($(this).prop("checked")) {
                data[`${dataGroupName}_${itemId}_${this.name.substr(5)}`] = this.value;
            } else {
                data[`${dataGroupName}_${itemId}_${this.name.substr(5)}`] = "";
            }

        } else {
            data[`${dataGroupName}_${itemId}_${this.name.substr(5)}`] = this.value;
        }

        setAttrs(data);
    });

    repcontainer.find("button[type=action]").click(function (e) {
        e.preventDefault();


        roll20API.charData[`_lastId_${dataGroupName}`] = itemId;
        throwEvent("clicked:" + `${dataGroupName}_${itemId}_${this.name.substr(4)}`, {});
        throwEvent("clicked:" + `${dataGroupName}:${this.name.substr(4)}`, {});
        throwEvent("clicked:" + `${dataGroupName}`, {});
        throwEvent("clicked:" + `${this.name.substr(4)}`, {});
    });

    repcontainer.find("button[type=roll]").click(function (e) {
        e.preventDefault();

    });


    repcontainer.trigger('sortupdate');

    repcontainer.find(`.repitem[reprowid="${itemId}"] input[name^="attr_"], 
    .repitem[reprowid="${itemId}"] select[name^="attr_"], 
    .repitem[reprowid="${itemId}"] span[name^="attr_"], 
    .repitem[reprowid="${itemId}"] textarea[name^="attr_"]`).each(function () {
        var attrName = `${dataGroupName}_${itemId}_${this.getAttribute("name").substr(5)}`;
        var el = $(this);
        var tagName = this.tagName;

        getAttrs([attrName], function (data) {
            if (data[attrName] != undefined) {
                if (tagName == "SPAN" || tagName == "TEXTAREA") {
                    el.text(data[attrName]);
                } else {
                    if (el.attr("type") == "checkbox" || el.attr("type") == "radio") {
                        el.prop("checked", el.val() == data[attrName]);
                    } else {
                        el.val(data[attrName]);
                    }
                }
            }
        });
    }).trigger("change");
}


$(document).ready(function () {

    roll20API.charData = window.localStorage;




    $('input[name^="attr_"], select[name^="attr_"], textarea[name^="attr_"]').change(function () {
        var data = {};
        if ($(this).attr("type") == "checkbox" || $(this).attr("type") == "radio") {
            if ($(this).prop("checked")) {
                data[this.name.substr(5)] = this.value;
            } else {
                if ($(this).attr("type") == "checkbox") {
                    data[this.name.substr(5)] = "";
                }

            }

        } else {
            data[this.name.substr(5)] = this.value;
        }

        setAttrs(data);
    });

    $('input[name^="attr_"], select[name^="attr_"], span[name^="attr_"], textarea[name^="attr_"]').each(function () {
        var attrName = this.getAttribute("name").substr(5);
        var el = $(this);
        var tagName = this.tagName;

        getAttrs([attrName], function (data) {
            if (data[attrName] != undefined) {
                if (tagName == "SPAN" || tagName == "TEXTAREA") {
                    el.text(data[attrName]);
                } else {
                    if (el.attr("type") == "checkbox" || el.attr("type") == "radio") {
                        el.prop("checked", el.val() == data[attrName]);
                    } else {
                        el.val(data[attrName]);
                    }
                }
            }
        });
    }).trigger("change");

    $("button[type=action]").click(function (e) {
        e.preventDefault();

        throwEvent("clicked:" + this.name.substr(4), {});

    });

    $("button[type=roll]").click(function (e) {
        e.preventDefault();

    });

    $("fieldset[class^='repeating_']").each(function () {
        this.style = "display: none";
        var repName = this.className.match(/repeating_([^_]*)/);

        $(this).after(`<div class="repcontainer ui-sortable" data-groupname="${repName[0]}"></div>
        <div class="repcontrol" data-groupname="${repName[0]}">
            <button class="btn repcontrol_edit">Modify</button>
            <button class="btn repcontrol_add">+Add</button>
        </div>`);

        if (roll20API.charData["_reporder:" + repName[0]] == undefined) {
            roll20API.charData["_reporder:" + repName[0]] = [];
        }

        var repcontainer = $(this).next();
        var reporder = roll20API.charData["_reporder:" + repName[0]].split(",").filter(v => v.match(/[0-9]+/));
        if (reporder.length > 0) {
            reporder.forEach(function (key) {
                addRepeatingRow(repcontainer, repName[0], key);
            });
        } else {
            Object.keys(roll20API.charData).filter(key => key.startsWith(repName[0] + "_")).forEach(function (key) {
                rowId = key.match(/(repeating_[^_]*)_([^_]+)_.*/);
                if (rowId) {
                    if (repcontainer.find(`.repitem[reprowid="${rowId[2]}"]`).length == 0) {
                        addRepeatingRow(repcontainer, rowId[1], rowId[2]);
                    }
                }

            });
        }


        $(this).next().sortable(
            {
                connectWith: `.ui-sortable[data-groupname="${repName[0]}"]`,
                handle: '.repcontrol_move',
                update: function (event, ui) {
                    var repOrder = ui.item.parent().children().map(function (idx) {
                        return $(this).attr("reprowid");
                    });
                    repOrder = $.makeArray(repOrder).filter(v => v.match(/[0-9]+/));
                    console.log(repOrder);
                    roll20API.charData["_reporder:" + repName[0]] = $.makeArray(repOrder);
                    throwEvent("change:_reporder:" + repName[0]);
                }
            }
        );
    });

    $("button[class='btn repcontrol_add']").click(function (e) {
        e.preventDefault();
        var dataGroupName = $(this).parent().attr("data-groupname");
        repcontainer = $(this).parent().prev();

        var itemId = generateRowID();

        addRepeatingRow(repcontainer, dataGroupName, itemId)
    });

    $("button[class='btn repcontrol_edit']").click(function (e) {
        e.preventDefault();
        repcontainer = $(this).parent().prev();

        if (repcontainer.hasClass("editmode")) {
            repcontainer.removeClass("editmode");
            $(this).text("Modify");
            $(this).next().removeAttr("style");
        } else {
            repcontainer.addClass("editmode");
            $(this).text("Done");
            $(this).next().css({ "display": "none" });
        }




    });


    $("script[type='text/worker']").each(function () {
        eval(this.innerHTML);
    });


    throwEvent("sheet:opened", {});
});