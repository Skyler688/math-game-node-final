const yesNo = document.getElementById("yesNo");

function areYouSure() {
  yesNo.innerHTML =
    '<h3>Are you sure?</h3>\
        <div class="option">\
          <a href="/home">No</a>\
          <a href="/profile/delete">Yes</a>\
        </div>';
}
