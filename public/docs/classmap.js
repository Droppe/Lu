YAHOO.env.classMap = {"FirstButton": "athena", "LoadButton": "athena", "Container": "athena", "LeftTip": "athena", "LastButton": "athena", "Accordion": "athena", "Tip": "athena", "MultiSwitch": "athena", "OffButton": "athena", "Carousel": "athena", "NextButton": "athena", "FormSelect": "athena", "OnButton": "athena", "Dropdown": "athena", "RightTip": "athena", "BelowTip": "athena", "config": "athena", "athena": "athena", "Reveal": "athena", "SelectButton": "athena", "Button": "athena", "List": "athena", "OpenButton": "athena", "RadioButton": "athena", "SwitchButton": "athena", "Dialog": "athena", "Checkbox": "athena", "Tabs": "athena", "Abstract": "athena", "CloseButton": "athena", "Loader": "athena", "Switcher": "athena"};

YAHOO.env.resolveClass = function(className) {
    var a=className.split('.'), ns=YAHOO.env.classMap;

    for (var i=0; i<a.length; i=i+1) {
        if (ns[a[i]]) {
            ns = ns[a[i]];
        } else {
            return null;
        }
    }

    return ns;
};
