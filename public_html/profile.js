/*
    Name: Desmond Goodman-Ahearn, Katelen Tellez, Jack Bell
    Final Project:  BlackJack
    Purpose: Code that is used for profile.html. Used to send
    a request to the server with the picture that a user selected.
    The user's profile picture is saved to the databased and updated
    on the homepage to match their selection.
*/

const userAttr = document.getElementById("userAttr");

/*
    This function is used to set the profile picture for the user based on
    the picture that they selected. A get request is used to send the url
    to the server and save it to the database for the user.
*/
function pickImage(_src) {
  let url = '/save/picture/' + encodeURIComponent(_src);
  let p = fetch(url);
  let ps = p.then((response) => {
    return response.text();
  }).then((text) => {
    if (text == 'SUCCESS') {
      window.location.href = '/home.html';
    }

  }).catch(() => {
    alert('Failed to save profile picture');
  });
}

/*
    This function is called on the home page to replace the profile photo that the
    user has selected. A get request is used to send the request to the server and
    the server responds with the profile picture that the user has selected.
*/
function changeProfilePic() {
  let url = '/change/picture/';
  let p = fetch(url);
  let ps = p.then((response) => {
    return response.text();
  }).then((text) => {
    document.getElementById('profile_pic').src = text;
  }).catch(() => {
    alert('Failed to change profile picture');
  });
}

/*
  This function obtains the username from the cookie. It returns the username after
  formatting the cookie to get only the username.
*/
function getUsernameFromCookie() {
  var c = document.cookie
  c = c.substring(33);
  c = c.replace(/%.*/, '');
  return c;
}

// if on the home page then display the user's profile picture
if (window.location.href.match('/home.html') != null || window.location.href.match('/stats.html') != null) {
  changeProfilePic();
}

userAttr.innerHTML = getUsernameFromCookie();

