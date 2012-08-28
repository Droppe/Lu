/**
 * Lu version 0.3.0
 * @author Robert Martone
 * @license
 *
 * Please thank the contributors:
 * https://github.com/linkedin/Lu/graphs/contributors
 *
 * Copyright (c) 2011,2012 LinkedIn
 * All Rights Reserved. Apache Software License 2.0
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
(function(){var a=$(window.LU_CONFIG.scope),b=a.find("[data-lu]").add(a.filter("[data-lu]")),c=b.find("a, button, input").filter("[data-lu*=Button]"),d=c.filter("[data-lu~=Button]"),e=c.filter("[data-lu~='Button:First']"),f=c.filter("[data-lu~='Button:Last']"),g=c.filter("[data-lu~='Button:Load']"),h=c.filter("[data-lu~='Button:Next']"),i=c.filter("[data-lu~='Button:Pause']"),j=c.filter("[data-lu~='Button:Play']"),k=c.filter("[data-lu~='Button:Previous']"),l=c.filter("[data-lu~='Button:Select']"),m=c.filter("[data-lu~='Button:State']"),n=c.filter("[data-lu~='Button:State:Add']"),o=c.filter("[data-lu~='Button:State:Remove']"),p=c.filter("[data-lu~='Button:State:Clear']"),q=c.filter("[data-lu~='Button:State:Reset']"),r=b.filter("[data-lu~=Switch]"),s=b.filter("[data-lu~=Container]"),t=b.filter("[data-lu~=List]"),u=b.filter("[data-lu~=Carousel]");Lu.map(d,"Button",function(a,b){b.hasDependencies=!0}),Lu.map(e,"Button",function(a,b){b.settings.action="first",b.key="Button:First",b.hasDependencies=!0}),Lu.map(f,"Button",function(a,b){b.settings.action="last",b.key="Button:Last",b.hasDependencies=!0}),Lu.map(g,"Button",function(a,b){b.settings.action="load",b.key="Button:Load",b.hasDependencies=!0}),Lu.map(h,"Button",function(a,b){b.settings.action="next",b.key="Button:Next",b.hasDependencies=!0}),Lu.map(i,"Button",function(a,b){b.settings.action="pause",b.key="Button:Pause",b.hasDependencies=!0}),Lu.map(j,"Button",function(a,b){b.settings.action="play",b.key="Button:Play",b.hasDependencies=!0}),Lu.map(k,"Button",function(a,b){b.settings.action="previous",b.key="Button:Previous",b.hasDependencies=!0}),Lu.map(l,"Button",function(a,b){b.settings.action="select",b.key="Button:Select",b.hasDependencies=!0}),Lu.map(m,"Button",function(a,b){b.settings.action="state",b.key="Button:State",b.hasDependencies=!0}),Lu.map(n,"Button",function(a,b){b.settings.action="state",b.settings.method="add",b.key="Button:State:Add",b.hasDependencies=!0}),Lu.map(o,"Button",function(a,b){b.settings.action="state",b.settings.method="remove",b.key="Button:State:Remove",b.hasDependencies=!0}),Lu.map(q,"Button",function(a,b){b.settings.action="state",b.settings.method="reset",b.key="Button:State:Reset",b.hasDependencies=!0}),Lu.map(p,"Button",function(a,b){b.settings.action="state",b.settings.method="clear",b.key="Button:State:Clear",b.hasDependencies=!0}),Lu.map(r,"Switch",function(a,b){}),Lu.map(s,"Container",function(a,b){}),Lu.map(t,"List",function(a,b){}),Lu.map(u,"Carousel",function(a,b){})})();