YAHOO.env.classMap = {"FirstButton": "lu", "LoadButton": "lu", "Container": "lu", "LeftTip": "lu", "LastButton": "lu", "Accordion": "lu", "Tip": "lu", "MultiSwitch": "lu", "OffButton": "lu", "Carousel": "lu", "NextButton": "lu", "FormSelect": "lu", "OnButton": "lu", "Dropdown": "lu", "RightTip": "lu", "BelowTip": "lu", "config": "lu", "lu": "lu", "Reveal": "lu", "SelectButton": "lu", "Button": "lu", "List": "lu", "OpenButton": "lu", "RadioButton": "lu", "SwitchButton": "lu", "Dialog": "lu", "Checkbox": "lu", "Tabs": "lu", "Abstract": "lu", "CloseButton": "lu", "Loader": "lu", "Switcher": "lu"};

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
