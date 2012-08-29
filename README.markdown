```
                                                  _____            _____          
                                                 /\    \          /\    \         
                                                /::\____\        /::\____\        
                                               /:::/    /       /:::/    /        
                                              /:::/    /       /:::/    /         
                                             /:::/    /       /:::/    /          
                                            /:::/    /       /:::/    /           
                                           /:::/    /       /:::/    /            
                                          /:::/    /       /:::/    /      _____  
                                         /:::/    /       /:::/____/      /\    \ 
                                        /:::/____/       |:::|    /      /::\____\
                                        \:::\    \       |:::|____\     /:::/    /
                                         \:::\    \       \:::\    \   /:::/    / 
                                          \:::\    \       \:::\    \ /:::/    /  
                                           \:::\    \       \:::\    /:::/    /   
                                            \:::\    \       \:::\__/:::/    /    
                                             \:::\    \       \::::::::/    /     
                                              \:::\    \       \::::::/    /      
                                               \:::\____\       \::::/    /       
                                                \::/    /        \::/____/        
                                                 \/____/          ~~

                                     
```

##To start contributing:##
1. Fork Lu
2. Install <a href="http://nodejs.org/" target="_blank">Node</a>
2. Install <a href="http://phantomjs.org/index.html" target="_blank">PhantomJS</a>.
3. In a terminal: ```$npm install grunt -g```
3. In a terminal from the Lu directory:```$npm install```
4. In a new terminal from the Lu directory:```$node server.js```
5. Point a browser to <a href="http://localhost:1337/examples/index.html" target="_blank">http://localhost:1337/examples/index.html</a>

Before making pull requests you should make sure your code is tested and linted. See our test directory for test examples. Run ```$grunt lint``` and ```$grunt qunit```.
To build Lu run: ```$grunt build``` while server.js is running.