var local = 'http://localhost:3001'
var online = 'https://laptopsoft.herokuapp.com'
var today = new Date()
var used_host = local
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000
});

function notifyUser(type, message) {
  Toast.fire({
    type: type,
    title: message
  })
}

