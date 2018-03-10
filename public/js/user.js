function onClickLogin(){
    var loginForm = document.getElementById('loginForm');
    var signupForm = document.getElementById('signupForm');
    
    signupForm.style.display = "none";
    loginForm.style.display = "block";
}

function onClickLogOut(){
    var url = window.location.origin;

    location.href = url;
}

function onClicksignupForm(){
    var signupForm = document.getElementById('signupForm');
    var loginForm = document.getElementById('loginForm');

    loginForm.style.display = "none";

    signupForm.style.display = "block";
}

function onLogin(){
    var loginForm = document.getElementById('loginForm');
    var fields = loginForm.querySelectorAll('input');
    var username = fields[0].value;
    var password = fields[1].value;

    if(username && password){
        fetch('/users/getUserData')
        .then(response => response.json())
        .catch(error => console.error('Error:', error))
        .then(response => {
            console.log('Success:', response);

            if(response){
                var existingUsers = Object.getOwnPropertyNames(response);
                var index = existingUsers.indexOf(username);
                if(index>=0){
                    var data = response[username];
                    if(data.pswd == password){
                        displayUserProfile(data);
                        console.log("logged In.");
                    }
                    else{
                        alert("Invalid Password!!");
                    }
                }
                else{
                    alert("User Doesn't exist! Please login!!");
                }
            }
            else{
                alert('Unable to fetch response, Please try again');
            }
        });
    }
    else{
        alert("Enter username and password");
    }
}

function onSignUp(){
    var signupForm = document.getElementById('signupForm');
    var fields = signupForm.querySelectorAll('input');
    var username = fields[0].value;
    var password = fields[1].value;
    var confirmPassword = fields[2].value;

    if(password === confirmPassword){
        var userData = {
            "name"  : username,
            "pswd"  : password,
            "dweets": [],
            "followers" : []
        };

        fetch('/users/addData',{
            method : 'post',
            headers: { 'Accept': 'application/json, text/plain, */*', 'Content-Type': 'application/json' },
            body   : JSON.stringify({user : userData})
        })
        .then(response => response.json())
        .catch(error => console.error('Error:', error))
        .then(response => {
            console.log('Success:', response);
    
            if(response){
                var existingUsers = Object.getOwnPropertyNames(response.users);
                var index = existingUsers.indexOf(username);
                if(index>=0){
                    var data = response.users[username];
                    if(data.pswd == password){
                        console.log("logged In.");
                        displayUserProfile(data);
                    }
                    else{
                        alert("Invalid Password!!");
                    }
                }
                else{
                    alert("User Doesn't exist! Please login!!");
                }
            }
            else{
                alert('Unable to fetch response, Please try again');
            }
        });
    }
    else{
        password.value = "";
        confirmPassword.value = "";
        alert("Password not matching! Please enter again!!");
    }
}

function displayUserProfile(data){
    var navbarItems = document.getElementById('navbarItems');
    var loginLink  = document.getElementById("loginLink");
    var signUpLink =  document.getElementById("signUpLink");
    var loginForm = document.getElementById('loginForm');
    var signupForm = document.getElementById('signupForm');
    var dweetPanel = document.getElementById('dweetPanel');

    dweetPanel.setAttribute('loginUserData',JSON.stringify(data));
    loginLink && (loginLink.style.display = "none");
    signUpLink && (signUpLink.style.display = "none");
    signupForm && (signupForm.style.display = "none");
    loginForm && (loginForm.style.display = "none");

    navbarItems.innerHTML = `<li id="profileLink">
            <a class="font-formatting" href="#" onclick="onClickProfileLink()">`+data.name+`</a>
        </li>
        <li>
            <a class="font-formatting" style="color:red;" href="#" onclick="onClickLogOut()">LogOut</a>
        </li>`;

    dweetPanel.innerHTML =     `
        <div>
            <br/>
            <input type="text" id="searchUserInput" class="form-control" placeholder="Enter Username">
            <br/>
            <button style="margin:auto;" type="submit" class="btn btn-primary center-btn-span" id="searchUserBtn" onclick="onSearchUser()">Search</button>
            <br/>
        </div>
        <div id="dweetContentArea" class="panel panel-success">
        </div>`;
    
    createDweetsPanel(data);
    dweetPanel.style.display = "block";

    if(data.followers.length){
        displayFollowersDweets(data);
    }
}

function onClickProfileLink(){
    var dweetPanel = document.getElementById('dweetPanel');

    var data = JSON.parse(dweetPanel.getAttribute('loginUserData'));

    fetch('/users/getUserData?name='+data.name)
    .then(response => response.json())
    .catch(error => console.error('Error:', error))
    .then(response => {
        console.log('Success:', response);

        if(response){
            displayUserProfile(response);
        }
        else{
            alert('Unable to fetch response, Please try again');
        }
    });
}

function createDweetsPanel(data){
    var dweetContentArea = document.getElementById('dweetContentArea');
    var dweetPanel = document.getElementById('dweetPanel');
    
    var loginUserData = JSON.parse(dweetPanel.getAttribute('loginUserData'));
    dweetContentArea.setAttribute('data',JSON.stringify(data));

    var dweetsRow = "";
    if(data.dweets.length){
        for(var i=0;i<data.dweets.length;i++){
            dweetsRow = dweetsRow + `
            <tr>
                <th># `+(i+1)+` :`+data.dweets[i].content+`</th>
            </tr>
            <tr>
                <td>
                    <span>
                        <i class="fa fa-thumbs-o-up fa-1x like-btn" style="margin-right:25%;cursor:pointer;">`+data.dweets[i].likes+`</i>
                        <i class="fa fa-thumbs-o-down fa-1x dislike-btn" style="margin-right:25%;;cursor:pointer;">`+data.dweets[i].dislikes+`</i>
                    </span>
                </td>
            </tr>`;
        }
    }


    
    dweetContentArea.innerHTML =     `
        <div class="panel-heading">
            <img style="width: 5%;" src="https://cdn1.iconfinder.com/data/icons/mix-color-4/502/Untitled-1-512.png" alt="User avatar"></img> 
            <h3 class="user-heading">  `+data.name+` : </h3>
            <span style="float:right;">
                <button id="followBtn" style="display:none;" type="submit" class="btn btn-success" onclick="onClickFollow()">Follow</button>
            </span>
        </div>
            <div class="panel-body">
                <p>
                    Dweets : 
                    <span style="float:right;">
                    <button type="submit" id="addCmnt" class="btn btn-success" style="display:none" onclick="onAddDweet()">Add Dweet</button>
                    </span>
                </p>
            </div>
            <table class="table">
                <thead>
                </thead>
                <tbody>`+
                dweetsRow+
                `</tbody>
            </table>
            <div id = "newDweetArea" style="display:none;">
                <input type="text" id="newCmnt" class="form-control" placeholder="Enter Dweet">
                <br/>
                <span class="center-btn-span">
                    <button type="submit" class="btn btn-success center-btn"  onclick="onSubmitDweet()">Submit</button>
                    <button type="submit" class="btn btn-success center-btn" id="removeCmnt" onclick="onCancelDweet()">Cancel</button>
                </span>
            </div>
            `;
    if(data.name != loginUserData.name){
        var followBtn = document.getElementById('followBtn');

        followBtn.style.display = "block";

        var followers = loginUserData.followers;
        var isFollowed = followers.indexOf(data.name);
        var followBtn = document.getElementById('followBtn');

        if(isFollowed>=0){
            followBtn.innerText = "Following";
            followBtn.disabled = true;
        }
    }
    else{
        var addCmnt = document.getElementById('addCmnt');
        addCmnt.style.display = "block";
    }
    assignLikeDislikeBtn();
}

function onClickFollow(){
    var dweetContentArea = document.getElementById('dweetContentArea');
    var data = JSON.parse(dweetContentArea.getAttribute('data'));

    updateUserData('followers',data.name,null,"login");
}

function onSearchUser(){
    var newUsername = document.getElementById('searchUserInput');
    var userFollowersContainer = document.getElementById('userFollowersContainer');

    if(newUsername.value){
        fetch('/users/searchUser',{
            method : 'post',
            headers: { 'Accept': 'application/json, text/plain, */*', 'Content-Type': 'application/json' },
            body   : JSON.stringify({'name' : newUsername.value})
        })
        .then(response => response.json())
        .catch(error => console.error('Error:', error))
        .then(response => {
            console.log('Success:', response);

            newUsername.value = "";

            if(response){
                createDweetsPanel(response);
                userFollowersContainer.style.display = "none";
            }
            else{
                alert('Unable to fetch response, Please try again');
            }
        });
    }
}

function onAddDweet(){
    var DweetArea = document.getElementById('newDweetArea');

    DweetArea.style.display = "block";
}

function onCancelDweet(){
    var DweetArea = document.getElementById('newDweetArea');

    DweetArea.style.display = "none";
}

function onSubmitDweet(){
    var newCmnt = document.getElementById('newCmnt').value;

    if(newCmnt){
        var newData = {
            "content": newCmnt,
            "likes": 0,
            "dislikes": 0
        };

        updateUserData("dweets",newData);
    }
    else{
        alert("Enter Dweet!!!");
    }
    
}

function assignLikeDislikeBtn(){
    var dweetPanel = document.getElementById('dweetPanel');
    var likeBtns = dweetPanel.querySelectorAll('i.like-btn');
    var dislikeBtns = dweetPanel.querySelectorAll('i.dislike-btn');
    var userName = dweetPanel.getAttribute('username');

    for(var i=0;i<likeBtns.length;i++){
        likeBtns[i].onclick = function(e){
            var index = e.currentTarget.getAttribute('index');
            updateUserData('likes',index,null,'login');
        }
        likeBtns[i].setAttribute('index',i);
    }

    for(var i=0;i<dislikeBtns.length;i++){
        dislikeBtns[i].onclick = function(e){
            var index = e.currentTarget.getAttribute('index');
            updateUserData('dislikes',index,null,'login');
        }
        dislikeBtns[i].setAttribute('index',i);
    }
}

function updateUserData(key,newData,username,type){
    if(type=="login"){
        var dweetPanel = document.getElementById('dweetPanel');
        var  data = JSON.parse(dweetPanel.getAttribute('loginUserData'));
    }
    else{
        var dweetContentArea = document.getElementById('dweetContentArea');
        var  data = JSON.parse(dweetContentArea.getAttribute('data'));
    }
    

    var name = (username)?username:data.name;
    var updatedData = {'user' : name, 'key' : key, 'data' : newData , 'loginUser':data.name};

    fetch('/users/updateData',{
        method : 'post',
        headers: { 'Accept': 'application/json, text/plain, */*', 'Content-Type': 'application/json' },
        body   : JSON.stringify({'newData' : updatedData})
    })
    .then(response => response.json())
    .catch(error => console.error('Error:', error))
    .then(response => {
        console.log('Success:', response);

        if(response){
            if(username){
                displayFollowersDweets({followers:response.followers});
            }
            else if(type=="login"){
                displayUserProfile(response)
            }
            else{
                createDweetsPanel(response);
            }
        }
        else{
            alert('Unable to fetch response, Please try again');
        }
    });
}

function displayFollowersDweets(data){
    var followers = data.followers;

    fetch('/users/getFollowersDweets',{
        method : 'post',
        headers: { 'Accept': 'application/json, text/plain, */*', 'Content-Type': 'application/json' },
        body   : JSON.stringify({'followers' : followers})
    })
    .then(response => response.json())
    .catch(error => console.error('Error:', error))
    .then(response => {
        console.log('displayFollowersDweets Success:', response);

        if(response){
            createFollowersDweetsPanel(response);
        }
    });
}

function createFollowersDweetsPanel(followersDweets){
    var userFollowersContainer = document.getElementById('userFollowersContainer');

    userFollowersContainer.style.display = "block";

    var dweetsRow = "";
    for(var i=0;i<followersDweets.length;i++){
        var name = followersDweets[i].name;
        dweetsRow = dweetsRow + `
        <tr>
            <th class="follower-dweets"># `+name+` : </th>
        </tr>`;
        var dweets = followersDweets[i].dweets;
        for(var j=0;j<dweets.length;j++){
            dweetsRow = dweetsRow + `<tr>
                <th>`+dweets[j].content+`</th>
            </tr>
            <tr>
                <td>
                    <span>
                        <i id=`+name+','+j+` class=" fa fa-thumbs-o-up fa-1x like-btn" style="margin-right:25%;cursor:pointer;">`+dweets[j].likes+`</i>
                        <i id=`+name+','+j+` class="fa fa-thumbs-o-down fa-1x dislike-btn" style="margin-right:25%;cursor:pointer;">`+dweets[j].dislikes+`</i>
                    </span>
                </td>
            </tr>`;
        }
    }

    var dweetTable = `<table class="table">
                            <tbody>`+
                            dweetsRow+
                            `</tbody>
                        </table>`;

    userFollowersContainer.innerHTML = dweetTable;
    assignFollowersDweetsLikeDislikeEvents();
}

function assignFollowersDweetsLikeDislikeEvents(){
    var userFollowersContainer = document.getElementById('userFollowersContainer');
    var likeBtns = userFollowersContainer.querySelectorAll('i.like-btn');
    var dislikeBtns = userFollowersContainer.querySelectorAll('i.dislike-btn');

    for(var i=0;i<likeBtns.length;i++){
        likeBtns[i].onclick = function(e){
            var id = e.currentTarget.id;
            var name = id.split(',')[0];
            var index = id.split(',')[1];

            updateUserData('likes',index,name);
        }
    }

    for(var i=0;i<dislikeBtns.length;i++){
        dislikeBtns[i].onclick = function(e){
            var id = e.currentTarget.id;
            var name = id.split(',')[0];
            var index = id.split(',')[1];

            updateUserData('dislikes',index,name);
        }
    }
}