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

function setAttrs(obj, opt = "", cb = function () { }) {
    _.each(obj, function (value, key) {
        var oldValue = roll20API.charData[key];
        var eventInfo = {};
        eventInfo.newValue = value;
        eventInfo.oldValue = oldValue;
        eventInfo.sourceAttribute = key.toLowerCase;

        roll20API.charData[key] = value;
        if (opt != "silent") {


            throwEvent("change:" + key, eventInfo);
        }

        var elementName = "attr_" + key;
        $('span[name=' + elementName + ']').text(value);
        $('input[name=' + elementName + '][type!=radio], select[name=' + elementName + ']').val(value);
        $('input[name=' + elementName + '][type=radio]').filter('[value="' + value + '"]').attr('checked', true);



        if (key.startsWith("repeating_")) {
            rowId = key.match(/(repeating_[^_]*)_([^_]*)_([^_]*)/);

            roll20API.charData[`${rowId[1]}_${rowId[3]}`] = value;

            var elementName = "attr_" + rowId[3];
            $(`.repcontainer[data-groupname="${rowId[1]}"] .repitem[reprowid="${rowId[2]}"] span[name="${elementName}"]`).text(value);
            $(`.repcontainer[data-groupname="${rowId[1]}"] .repitem[reprowid="${rowId[2]}"] input[name="${elementName}"][type!=radio], 
               .repcontainer[data-groupname="${rowId[1]}"] .repitem[reprowid="${rowId[2]}"] select[name="${elementName}"]`).val(value);
            $(`.repcontainer[data-groupname="${rowId[1]}"] .repitem[reprowid="${rowId[2]}"] input[name="${elementName}"][type=radio]`).filter(`[value="${value}"]`).attr('checked', true);

            $(`fieldset[class="${rowId[1]}"] span[name="${elementName}"]`).text(value);
            $(`fieldset[class="${rowId[1]}"] input[name="${elementName}"][type!=radio], 
               fieldset[class="${rowId[1]}"] select[name="${elementName}"]`).val(value);
            $(`fieldset[class="${rowId[1]}"] input[name="${elementName}"][type=radio]`).filter(`[value="${value}"]`).attr('checked', true);
            if (opt != "silent") {
                throwEvent("change:" + rowId[3], eventInfo);
                throwEvent("change:" + rowId[1], eventInfo);
                throwEvent("change:" + rowId[1] + ":" + rowId[3], eventInfo);
            }
        }





    });

    cb();
}

function getAttrs(lst, cb) {
    var data = {};
    _.each(lst, function (value) {
        data[value] = roll20API.charData[value];
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

function getSectionIDs(sectionName, cb) {
    var name = "repeating_" + sectionName + "_";
    var data = Object.keys(roll20API.charData).filter(key => key.startsWith(name)).map(function (key) {
        key = key.match(/repeating_[^_]+_([^_]+)_/);
        return key[1];
    });
    cb(data.unique());
}


function removeRepeatingRow(rowId) {

    rowId = rowId.match(/(repeating_[^_]*)_([^_]*)/);

    $(`div[data-groupname="${rowId[1]}"] div.repitem[reprowid="${rowId[2]}"]`).remove().parent().trigger('sortupdate');

    var props = Object.keys(roll20API.charData);

    var filteredProps = props.filter(prop => prop.startsWith(`${rowId[0]}`));
    eventInfo = {};
    eventInfo.removeInfo = {}
    filteredProps.forEach(function (prop) {
        eventInfo.removeInfo[prop] = roll20API.charData[prop];
        delete roll20API.charData[prop];
    });

    eventInfo.sourceAttribute = rowId[0];

    throwEvent("remove:" + rowId[0], eventInfo);
    throwEvent("remove:" + rowId[1], eventInfo);
}

function addRepeatingRow(repcontainer, dataGroupName, itemId) {

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

    repcontainer.find(`.repitem[reprowid="${itemId}"] input, .repitem[reprowid="${itemId}"] select`).change(function () {
        var data = {};
        data[`${dataGroupName}_${itemId}_${this.name.substr(5)}`] = this.value;
        setAttrs(data);
    });

    repcontainer.trigger('sortupdate');

    repcontainer.find(`.repitem[reprowid="${itemId}"] input, .repitem[reprowid="${itemId}"] select`).each(function () {
        var attrName = `${dataGroupName}_${itemId}_${this.name.substr(5)}`;
        el = this;

        getAttrs([attrName], function (data) {
            if (data[attrName] != undefined) {
                el.value = data[attrName];
            }

        });
    }).trigger("change");
}


$(document).ready(function () {

    roll20API.charData = window.localStorage;

    $("script[type='text/worker']").each(function () {
        eval(this.innerHTML);
    });


    $("input, select").change(function () {
        var data = {};
        data[this.name.substr(5)] = this.value;
        setAttrs(data);
    });
    $("input, select").each(function () {
        var attrName = this.name.substr(5);
        el = this;

        getAttrs([attrName], function (data) {
            if (data[attrName] != undefined) {
                el.value = data[attrName];
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

        var repcontainer = $(this).next();

        Object.keys(roll20API.charData).filter(key => key.startsWith(repName[0] + "_")).forEach(function (key) {
            rowId = key.match(/(repeating_[^_]*)_([^_]+)_.*/);
            if (rowId) {
                if (repcontainer.find(`.repitem[reprowid="${rowId[2]}"]`).length == 0) {
                    addRepeatingRow(repcontainer, rowId[1], rowId[2]);
                }
            }

        })

        $(this).next().sortable(
            {
                connectWith: `.ui-sortable[data-groupname="${repName[0]}"]`,
                handle: '.repcontrol_move'
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





    throwEvent("sheet:opened", {});
});