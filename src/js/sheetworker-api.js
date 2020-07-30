var roll20API = {
    events: {},
    charData: {},
    repItemId: 0,
};

function on(eventStr, fnc) {

    _.each(eventStr.split(" "), function (ev) {
        var evStrArr = ev.split(":");
        if (roll20API.events[ev] == undefined) {
            roll20API.events[ev] = [];
        }
        roll20API.events[ev].push(fnc);
    });
}

function setAttrs(obj, opt = "", cb = function () { }) {
    _.each(obj, function (value, key) {
        var oldValue = roll20API.charData[key];

        roll20API.charData[key] = value;
        if (opt != "silent") {
            var eventInfo = {};
            eventInfo.newValue = value;
            eventInfo.oldValue = oldValue;
            _.each(roll20API.events["change:" + key], function (ev) {
                ev(eventInfo);
            });

            if (key.startsWith("repeating_")) {
                rowId = key.match(/(repeating_[^_]*)_([^_]*)_([^_]*)/);

                _.each(roll20API.events["change:" + rowId[3]], function (ev) {
                    ev(eventInfo);
                });

                _.each(roll20API.events["change:" + rowId[1]], function (ev) {
                    ev(eventInfo);
                });

                _.each(roll20API.events["change:" + rowId[1] + ":" + rowId[3]], function (ev) {
                    ev(eventInfo);
                });
            }
        }



        var elementName = "attr_" + key;
        $('span[name=' + elementName + ']').text(value);
        $('input[name=' + elementName + '][type!=radio]').val(value);
        $('input[name=' + elementName + '][type=radio]').filter('[value="' + value + '"]').attr('checked', true);


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
    return roll20API.repItemId++;
}

function removeRepeatingRow(rowId) {

    rowId = rowId.match(/(repeating_[^_]*)_([^_]*)/);

    $(`div[data-groupname="${rowId[1]}"] div.repitem[reprowid="${rowId[2]}"]`).remove().parent().trigger('sortupdate');

    var props = Object.keys(roll20API.charData);

    props.filter(prop => prop.startsWith(`${rowId[0]}`)).forEach(prop => delete roll20API.charData[prop]);
}



$(document).ready(function () {
    $("input").change(function () {
        var data = {};
        data[this.name.substr(5)] = this.value;
        setAttrs(data);
    })
    $("input[type!=radio]").each(function () {
        var data = {};
        data[this.name.substr(5)] = this.value;
        setAttrs(data);
    });

    $("button[type=action]").click(function (e) {
        e.preventDefault();

        var data = {};
        _.each(roll20API.events["clicked:" + this.name.substr(4)], function (ev) {
            ev(data);
        });

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

        var itemId = generateRowID();

        $(this).parent().prev()
            .append(`<div class="repitem" reprowid="${itemId}">
                <div class="itemcontrol">
                    <button class="btn btn-danger pictos repcontrol_del">#</button>
                    <a class="btn repcontrol_move">≡</a>
                </div >`+ $(`fieldset[class="${dataGroupName}"]`).html() + '</div>');

        $(this).parent().prev().find(`button.repcontrol_del`).click(function (e) {
            e.preventDefault();

            removeRepeatingRow(`${dataGroupName}_${itemId}`);
        });

        $(this).parent().prev().find("input").change(function () {
            var data = {};
            data[`${dataGroupName}_${itemId}_${this.name.substr(5)}`] = this.value;
            setAttrs(data);
        });

        $(this).parent().prev().trigger('sortupdate');

        $(this).parent().prev().find("input").each(function () {
            var data = {};
            data[`${dataGroupName}_${itemId}_${this.name.substr(5)}`] = this.value;
            setAttrs(data);
        });
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



    var data = {};
    _.each(roll20API.events["sheet:opened"], function (ev) {
        ev(data);
    });
});