var events = {};
var charData = {};

function on(eventStr, fnc) {

    _.each(eventStr.split(" "), function (ev) {
        var evStrArr = ev.split(":");
        if (events[ev] == undefined) {
            events[ev] = [];
        }
        events[ev].push(fnc);
    });
}

function setAttrs(obj, opt = "", cb = function () { }) {
    _.each(obj, function (value, key) {
        var oldValue = charData[key];
        charData[key] = value;
        var elementName = "attr_" + key;
        if (opt != "silent") {
            var eventInfo = {};
            eventInfo.newValue = value;
            eventInfo.oldValue = oldValue;
            _.each(events["change:" + key], function (ev) {
                ev(eventInfo);
            });
        }
        $('span[name=' + elementName + ']').text(value);
        $('input[name=' + elementName + '][type!=radio]').val(value);
        $('input[name=' + elementName + '][type=radio]').filter('[value="' + value + '"]').attr('checked', true);

    });

    cb();
}

function getAttrs(lst, cb) {
    var data = {};
    _.each(lst, function (value) {
        data[value] = charData[value];
    });
    cb(data);
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
        _.each(events["clicked:" + this.name.substr(4)], function (ev) {
            ev(data);
        });

    });

    $("button[type=roll]").click(function (e) {
        e.preventDefault();

    });

    $("script[type='text/worker']").each(function () {
        eval(this.innerHTML);
    });
    var data = {};
    _.each(events["sheet:opened"], function (ev) {
        ev(data);
    });
});