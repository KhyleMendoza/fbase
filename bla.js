let user;

function logout() {
    firebase.auth().signOut().then(function () {
        alert("Signed out successfully");
        window.location.href = 'index.html';
    }).catch(function (error) {
        alert("Error occurred while signing out: " + error.message);
    });
}

function uploadProfilePicture() {
    const input = document.getElementById('profile-picture-input');
    const file = input.files[0];

    if (file && user && user.uid) {
        const userRef = firebase.database().ref('users/' + user.uid);
        userRef.once('value').then(function (snapshot) {
            const userData = snapshot.val();

            if (userData && userData.profile_picture_url) {
                const oldStorageRef = firebase.storage().refFromURL(userData.profile_picture_url);
                oldStorageRef.delete().then(() => {
                    console.log('Old profile picture file deleted successfully');
                }).catch((error) => {
                    console.error('Error deleting old profile picture file:', error.message);
                });
            }
            const storageRef = firebase.storage().ref('profile/' + user.uid + '/' + file.name);
            storageRef.put(file).then((snapshot) => {
                alert('Profile picture uploaded successfully');
                snapshot.ref.getDownloadURL().then((downloadURL) => {
                    userRef.update({
                        profile_picture_url: downloadURL,
                        last_login: firebase.database.ServerValue.TIMESTAMP,
                    }).then(() => {
                        console.log('Profile picture URL updated successfully');
                        const profilePicture = document.getElementById('profile-picture');
                        profilePicture.src = downloadURL || 'default_profile_picture.jpg';
                    }).catch((error) => {
                        console.error('Error updating profile picture URL:', error.message);
                    });
                });
            }).catch((error) => {
                console.error('Error uploading profile picture:', error.message);
            });
        }).catch(function (error) {
            console.error("Error fetching user data:", error);
        });
    }
}


function deleteProfilePicture() {
    if (user && user.uid) {
        const userRef = firebase.database().ref('users/' + user.uid);

        userRef.once('value').then(function (snapshot) {
            const userData = snapshot.val();

            if (userData && userData.profile_picture_url) {
                const storageRef = firebase.storage().refFromURL(userData.profile_picture_url);

                storageRef.delete().then(() => {
                    console.log('Profile picture file deleted successfully');
                }).catch((error) => {
                    console.error('Error deleting profile picture file:', error.message);
                });

                userRef.update({
                    profile_picture_url: null,
                    last_login: firebase.database.ServerValue.TIMESTAMP,
                }).then(() => {
                    console.log('Profile picture deleted successfully');
                    const profilePicture = document.getElementById('profile-picture');
                    profilePicture.src = 'default_profile_picture.jpg';
                }).catch((error) => {
                    console.error('Error updating user data:', error.message);
                });
            } else {
                console.error("Profile picture URL not found in the user data.");
            }
        }).catch(function (error) {
            console.error("Error fetching user data:", error);
        });
    }
}

document.addEventListener('DOMContentLoaded', function () {
    var firebaseConfig = {
        apiKey: "AIzaSyBCQT4jYP6WEcSMYNMsF8wgAlOMidaHS4g",
        authDomain: "login-fef6e.firebaseapp.com",
        databaseURL: "https://login-fef6e-default-rtdb.firebaseio.com",
        projectId: "login-fef6e",
        storageBucket: "login-fef6e.appspot.com",
        messagingSenderId: "365869099274",
        appId: "1:365869099274:web:c9c03dbc4b1ceb4f30f2f3",
        measurementId: "G-9SN9TSYZY8"
    };

    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }

    firebase.auth().onAuthStateChanged(function (currentUser) {
        if (currentUser) {
            user = currentUser;
            const userRef = firebase.database().ref('users/' + user.uid);

            userRef.once('value').then(function (snapshot) {
                const userData = snapshot.val();

                if (userData && userData.full_name && userData.last_login) {
                    document.getElementById('lastlogin').innerText = userData.last_login;
                    document.getElementById('username').innerText = userData.full_name;
                    document.getElementById('uid').innerText = user.uid;
                    document.getElementById('email').innerText = user.email;
                    const profilePicture = document.getElementById('profile-picture');
                    profilePicture.src = userData.profile_picture_url || 'default_profile_picture.jpg';
                } else {
                    console.error("User data not found in the database.");
                }
            }).catch(function (error) {
                console.error("Error fetching user data:", error);
            });
        } else {
            window.location.href = 'index.html';
        }
    });
});
