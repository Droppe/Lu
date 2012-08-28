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
var constants=require("lu/constants"),helpers=require("lu/helpers"),List=require("lu/List"),Fiber=require("Fiber"),Carousel;Carousel=List.extend(function(a){var b="play",c="pause",d="first",e="last",f="select",g="previous",h="next",i="out-of-bounds",j="playing",k="paused",l={repeat:-1,autoplay:!1,delay:3e3},m,n=!1,o,p;return{init:function(b,c){var d=this;_.defaults(c,l),a.init.call(this,b,c),this.play=function(){return this.hasState(constants.states.PLAYING)||(function a(){p=window.setTimeout(function(){d.hasState(constants.states.PLAYING)||(d.next(),a())},c.delay)}(),this.setState(constants.states.PLAYING)),this},this.on(constants.events.PLAY,function(a){a.stopPropagation(),d.play()}),this.on([constants.events.PLAY,constants.events.NEXT,constants.events.PREVIOUS,constants.events.FIRST,constants.events.LAST,constants.events.SELECT].join(" "),function(a,b){a.stopPropagation(),d.pause()}),c.autoplay?this.play():this.pause()},pause:function(){return this.hasState(constants.states.PAUSED)||(window.clearTimeout(p),this.setState(constants.states.PAUSED)),this},hasNext:function(){return!0},hasPrevious:function(){return!0},next:function(){return this.index()+1===this.size()?this.first():this.select(this.index()+1),this},previous:function(){return this.index()===0?this.last():this.select(this.index()-1),this}}}),typeof module!="undefined"&&(typeof module.setExports=="function"?module.setExports(Carousel):module.exports&&(module.exports=Carousel));