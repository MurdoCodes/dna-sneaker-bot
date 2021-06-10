$(document).ready(function() {
    $("#sidebarCollapse").on("click", function() {
        $("#sidebar").toggleClass("active");
        $(".navbar-brand").toggleClass("active");

        $(this).toggleClass("active");
    });
  });
  