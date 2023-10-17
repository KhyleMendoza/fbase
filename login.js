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

  firebase.initializeApp(firebaseConfig);

  const auth = firebase.auth();
  const database = firebase.database();

  let isLoginMode = true;

  function toggleRegistration() {
    if (window.location.href.endsWith('login/') || window.location.href.endsWith('index.html')) {
      isLoginMode = !isLoginMode;

      const emailField = document.getElementById('email');
      const passwordField = document.getElementById('password');
      const fullNameField = document.getElementById('full_name');
      const loginButton = document.getElementById('loginButton');
      const registerButton = document.getElementById('registerButton');
      const toggleMessage = document.getElementById('toggleMessage');

      if (isLoginMode) {
        fullNameField.style.display = 'none';
        registerButton.style.display = 'none';
        loginButton.style.display = 'block';
        toggleMessage.textContent = "Not yet signed up? Register now";
      } else {
        fullNameField.style.display = 'block';
        loginButton.style.display = 'none';
        registerButton.style.display = 'block';
        toggleMessage.textContent = "Already have an account? Login here";
      }
    }
  }

  function register() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const fullName = document.getElementById('full_name').value;

    if (!validateEmail(email) || !validatePassword(password)) {
      alert('Email or Password is invalid.');
      return;
    }

    if (!isLoginMode && !validateField(fullName)) {
      alert('Full Name is invalid.');
      return;
    }

    auth.createUserWithEmailAndPassword(email, password)
      .then(function () {
        const user = auth.currentUser;

        const userData = {
          email: email,
          full_name: fullName,
          last_login: Date.now()
        };

        const databaseRef = database.ref();

        databaseRef.child('users/' + user.uid).set(userData)
          .then(function () {
            console.log("User registered and data saved to the database.");
            window.location.href = 'home.html';
          })
          .catch(function (error) {
            console.error("Error saving user data to the database:", error);
            alert("Error occurred while saving user data: " + error.message);
          });
      })
      .catch(function (error) {
        console.error("Error registering user:", error);
        alert(error.message);
      });
  }

  function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    if (!validateEmail(email) || !validatePassword(password)) {
      alert('Email or Password is invalid.');
      return;
    }
  
    auth.signInWithEmailAndPassword(email, password)
      .then(function () {
        const user = auth.currentUser;
        const loginTime = new Date(); 
        const formattedLoginTime = loginTime.toLocaleString();
  
        const userData = {
          last_login: formattedLoginTime
        };
  
        const databaseRef = database.ref();
  
        databaseRef.child('users/' + user.uid).update(userData)
          .then(function () {
            console.log("User logged in and last login time updated in the database.");
            window.location.href = 'home.html';
          })
          .catch(function (error) {
            console.error("Error updating last login time in the database:", error);
            alert("Error occurred while updating last login time: " + error.message);
          });
      })
      .catch(function (error) {
        alert(error.message);
      });
  }
  
  function validateEmail(email) {
    const expression = /^[^@]+@\w+(\.\w+)+\w$/;
    return expression.test(email);
  }

  function validatePassword(password) {
    return password.length >= 6;
  }

  function validateField(field) {
    return field != null && field.length > 0;
  }

  window.toggleRegistration = toggleRegistration;
  window.register = register;
  window.login = login;

  toggleRegistration();
});
