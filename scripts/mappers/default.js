var Map = new Lu.Map();

Map.add( '[data-lu~=Switch]', 'Switch', function(){} );
Map.add( '[data-lu~=Carousel]', 'Carousel', function(){} );
Map.add( '[data-lu~=List]', 'List', function(){} );

Map.add( '[data-lu~=\'Button:Select\']', 'Button', function(){
  this.settings.action = 'state';
  this.settings.states = ['selected'];
  this.key = 'Button:State';
  this.hasDependencies = true;
} );

Map.add( '[data-lu~=\'Button:Expand\']', 'Button', function(){
  this.settings.action = 'state';
  this.settings.states = ['expanded', 'collapsed'];
  this.key = 'Button:State';
  this.hasDependencies = true;
} );

Map.add( '[data-lu~=\'Button:Next\']', 'Button', function(){
  this.settings.action = 'next';
  this.key = 'Button:Next';
  this.hasDependencies = true;
} );

Map.add( '[data-lu~=\'Button:Previous\']', 'Button', function(){
  this.settings.action = 'previous';
  this.key = 'Button:Previous';
  this.hasDependencies = true;
} );

Map.observe();

//Export to Common JS Loader
if( typeof module !== 'undefined' ){
  if( typeof module.setExports === 'function' ){
    module.setExports( Map );
  } else if( module.exports ){
    module.exports = Map;
  }
}